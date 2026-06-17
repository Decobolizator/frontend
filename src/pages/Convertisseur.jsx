import React, { useState, useRef, useEffect } from 'react';
import { Typography, Row, Col, Button, Input, Tabs } from 'antd';
import { UploadOutlined, DownloadOutlined, ReloadOutlined, FileOutlined, FolderOutlined, FolderOpenOutlined, LoadingOutlined, } from '@ant-design/icons';
import { useOutletContext, useLocation } from 'react-router-dom';
const { Title, Paragraph } = Typography;
const { TextArea } = Input;
import './convertisseur.css';
import CodeMirror from '@uiw/react-codemirror';
import { StreamLanguage } from '@codemirror/language';
// On importe directement la grammaire COBOL officielle 
import { cobol } from '@codemirror/legacy-modes/mode/cobol';
import instance from "../services/HttpClient";
import { oneDark } from '@codemirror/theme-one-dark';

// -----------------------------------------------------------------------
// Construction de l'arborescence à partir d'une liste de File (webkitdirectory)
// -----------------------------------------------------------------------

// Transforme une liste plate de File (avec webkitRelativePath du type
// "MonProjet/src/PROG1.cbl") en un arbre { type, name, path, children }
function buildTreeFromFiles(fileList) {
    const root = { type: 'folder', name: 'root', path: '', children: {} };

    for (const file of fileList) {
        const relPath = file.webkitRelativePath || file.name;
        const parts = relPath.split('/').filter(Boolean);

        let current = root;
        let accPath = '';

        parts.forEach((part, index) => {
            accPath = accPath ? `${accPath}/${part}` : part;
            const isFile = index === parts.length - 1;

            if (isFile) {
                current.children[part] = {
                    type: 'file',
                    name: part,
                    path: accPath,
                    file,
                };
            } else {
                if (!current.children[part]) {
                    current.children[part] = {
                        type: 'folder',
                        name: part,
                        path: accPath,
                        children: {},
                    };
                }
                current = current.children[part];
            }
        });
    }

    return root;
}

// Convertit l'arbre { children: {} } en tableau triable (dossiers d'abord, alpha ensuite)
function sortedEntries(node) {
    return Object.values(node.children).sort((a, b) => {
        if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
        return a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' });
    });
}

// -----------------------------------------------------------------------
// Composant d'arborescence
// -----------------------------------------------------------------------

const TreeNode = ({ node, depth, selectedPath, onSelectFile, resultsByName, isLoading }) => {
    const [open, setOpen] = useState(true);

    if (node.type === 'folder') {
        const entries = sortedEntries(node);
        return (
            <div className="tree-folder">
                <div
                    className="tree-row tree-row-folder"
                    style={{ paddingLeft: 8 + depth * 16 }}
                    onClick={() => setOpen(!open)}
                >
                    {open ? <FolderOpenOutlined /> : <FolderOutlined />}
                    <span className="tree-label">{node.name}</span>
                </div>
                {open && entries.map((child) => (
                    <TreeNode
                        key={child.path}
                        node={child}
                        depth={depth + 1}
                        selectedPath={selectedPath}
                        onSelectFile={onSelectFile}
                        resultsByName={resultsByName}
                        isLoading={isLoading}
                    />
                ))}
            </div>
        );
    }

    // type === 'file'
    const isSelected = selectedPath === node.path;
    const isReady = !isLoading && resultsByName && resultsByName[node.name] !== undefined;

    return (
        <div
            className={`tree-row tree-row-file ${isSelected ? 'tree-row-active' : ''} ${isLoading ? 'tree-row-loading' : ''}`}
            style={{ paddingLeft: 8 + depth * 16 }}
            onClick={() => onSelectFile(node)}
        >
            {isLoading ? <LoadingOutlined spin /> : <FileOutlined />}
            <span className="tree-label">{node.name}</span>
        </div>
    );
};

const FileTree = ({ root, selectedPath, onSelectFile, resultsByName, isLoading }) => {
    const entries = sortedEntries(root);
    return (
        <div className="tree-container">
            {entries.map((child) => (
                <TreeNode
                    key={child.path}
                    node={child}
                    depth={0}
                    selectedPath={selectedPath}
                    onSelectFile={onSelectFile}
                    resultsByName={resultsByName}
                    isLoading={isLoading}
                />
            ))}
        </div>
    );
};

// Aplati l'arbre pour récupérer tous les noeuds de type 'file'
function flattenFiles(node, acc = []) {
    for (const child of sortedEntries(node)) {
        if (child.type === 'file') acc.push(child);
        else flattenFiles(child, acc);
    }
    return acc;
}

const Convertisseur = () => {

    // Contexte
    const { darkMode } = useOutletContext();
    const location = useLocation();
    const { projectId, projectName, fileName: initialFileName } = location.state ?? {};

    // Ref
    const fileInputRef = useRef(null); // ref pour le bouton d'import
    const folderInputRef = useRef(null); // import dossier (projet)

    // Configuration et constantes
    const extensionsValides = ['.txt', '.cbl', '.cob'];
    const [mode, setMode] = useState('single'); //Mode global : 'single' (fichier unique) ou 'project' (dossier importé, arborescence)
    const [activeTab, setActiveTab] = useState('traducteur'); // onglet du mode traduction activé
    const [isFileSupported, setIsFileSupported] = useState(true);

    // Mode single file
    const [fileName, setFileName] = useState(initialFileName || 'code_manuel.cbl');
    const [cobolCode, setCobolCode] = useState(''); // code inséré ds panneau gauche
    const [traductionResult, setTraductionResult] = useState(''); // résultat de l'onglet Traducteur
    const [tuteurResult, setTuteurResult] = useState('');         // résultat de l'onglet Tuteur
    const [isScanning, setIsScanning] = useState(false); // si en cours de chargement des résultats
    const [analysisCounts, setAnalysisCounts] = useState({});

    // Mode projet
    const [projectRoot, setProjectRoot] = useState(null); // arbre construit depuis webkitdirectory
    const [projectFiles, setProjectFiles] = useState([]); // liste plate des File du projet
    const [selectedFilePath, setSelectedFilePath] = useState(null);
    const [selectedFileName, setSelectedFileName] = useState(null);
    const [projectResults, setProjectResults] = useState({ traducteur: {}, tuteur: {} });
    const [projectLoading, setProjectLoading] = useState({ traducteur: false, tuteur: false });
    const [projectError, setProjectError] = useState('');
    const [showTree, setShowTree] = useState(false);


    const operationForTab = (tab) => (tab === 'traducteur' ? 'analyze-project' : 'describe-project');

    const rootFolderNode = projectRoot ? sortedEntries(projectRoot)[0] ?? null : null;

    useEffect(() => {
        if (!projectId) return;

        const loadProject = async () => {
            try {
                setIsScanning(true);
                const response = await instance.get(`/projects/${projectId}`);
                const projet = response.data;

                const nomDuFichierSource = fileName || 'Fichier inconnu';

                setCobolCode(`* Fichier source associé : ${nomDuFichierSource}\n* Veuillez ré-importer ce fichier pour modifier le code.`);

                const translation = projet.content?.translation || projet.content?.role || '';
                if (translation) {
                    setTraductionResult(translation);
                    setTuteurResult(translation);
                } else {
                    const nonDispo = "Aucun résultat disponible pour ce projet.";
                    setTraductionResult(nonDispo);
                    setTuteurResult(nonDispo);
                }
            } catch (err) {
                console.error("Erreur chargement projet :", err);
            } finally {
                setIsScanning(false);
            }
        };

        loadProject();
    }, [projectId, fileName]);

    // LES FONCTIONS

    // Import 

    const handleImportFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setMode('single');

        setTraductionResult('');
        setTuteurResult('');

        // extrait extension
        const lastDotIndex = file.name.lastIndexOf('.');
        const extension = lastDotIndex !== -1
            ? file.name.substring(lastDotIndex).toLowerCase()
            : '';

        // si extension valide, on ne lit pas le fichier
        if (!extensionsValides.includes(extension)) {
            setIsFileSupported(false);
            setFileName(file.name);
            setCobolCode(`* Ce fichier n'est pas pris en charge par Decobolizator, il ne sera pas inclus dans l'analyse.\n* Veuillez importer uniquement des .txt, .cob et .cbl.`);
            e.target.value = ''; // Réinitialise l'input
            return;
        }

        setIsFileSupported(true);
        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = (event) => {
            setCobolCode(event.target.result);
        };
        reader.readAsText(file);
        e.target.value = '';

    };

    const handleImportFolder = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setMode('project');
        setProjectFiles(files);
        const tree = buildTreeFromFiles(files);
        setProjectRoot(tree);
        setSelectedFilePath(null);
        setSelectedFileName(null);

        setProjectResults({ traducteur: {}, tuteur: {} });
        setTraductionResult('');
        setTuteurResult('');

        setProjectLoading({ traducteur: false, tuteur: false });
        setProjectError('');
        setShowTree(true);
        e.target.value = '';
    };

    // Lecture du contenu texte de chaque file du projet

    const readFileAsText = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (ev) => resolve(ev.target.result);
            reader.onerror = reject;
            reader.readAsText(file);
        });

    // Analyse mode single file

    const handleAnalyseSingle = async () => {
        if (!cobolCode) return;
        if (!cobolCode || !isFileSupported) return;
        try {
            if (activeTab === 'traducteur') setTraductionResult('');
            else setTuteurResult('');
            setIsScanning(true);

            let finalFileName = fileName;
            const currentCount = analysisCounts[fileName] || 0;
            if (currentCount > 0) {
                const lastDotIndex = fileName.lastIndexOf('.');
                if (lastDotIndex !== -1) {
                    const namePart = fileName.substring(0, lastDotIndex);
                    const extPart = fileName.substring(lastDotIndex);
                    finalFileName = `${namePart}(${currentCount})${extPart}`;
                } else {
                    finalFileName = `${fileName}(${currentCount})`;
                }
            }
            setAnalysisCounts(prev => ({
                ...prev,
                [fileName]: currentCount + 1
            }));

            const operation = operationForTab(activeTab);

            const payload = {
                inputType: 'text',
                operation: operation,
                text: cobolCode,
                fileName: finalFileName,
                userContext: operation === 'analyze-project' ? 'Traduction de fichier' : 'Explication de fichier'
            };

            const response = await instance.post("/translation/input", payload);

            if (response.data && response.data.files && response.data.files.length > 0) {
                const firstFile = response.data.files[0];
                const resultText = activeTab === 'traducteur' ? firstFile.translation : firstFile.role;

                if (resultText) {
                    if (activeTab === 'traducteur') setTraductionResult(resultText);
                    else setTuteurResult(resultText);
                } else {
                    const msgVide = "Le fichier a été traité mais aucun résultat n'a été généré.";
                    if (activeTab === 'traducteur') setTraductionResult(msgVide);
                    else setTuteurResult(msgVide);
                }
            } else {
                const msgFichierManquant = "Le serveur a répondu, mais aucun fichier n'est présent dans le résultat.";
                if (activeTab === 'traducteur') setTraductionResult(msgFichierManquant);
                else setTuteurResult(msgFichierManquant);
            }

        } catch (error) {
            console.error("Erreur API lors de l'analyse :", error);
            const msg = error.response?.data?.message || "Une erreur est survenue lors de la communication avec le serveur.";
            if (activeTab === 'traducteur') setTraductionResult(msg);
            else setTuteurResult(msg);
        } finally {
            setIsScanning(false);
        }
    };

    // Analyse mode projet

    const runProjectAnalysis = async (tabToAnalyse) => {
        if (!projectFiles.length) return;

        setProjectError('');
        setProjectLoading(prev => ({ ...prev, [tabToAnalyse]: true }));

        try {
            //  On filtre la liste pour ne garder que les fichiers valides
            const fichiersValides = projectFiles.filter(f => {
                const nomFichier = f.webkitRelativePath || f.name;
                const extension = nomFichier.substring(nomFichier.lastIndexOf('.')).toLowerCase();
                return extensionsValides.includes(extension);
            });

            // Si après filtrage il ne reste rien à analyser
            if (fichiersValides.length === 0) {
                setProjectError("Aucun fichier valide (.txt, .cob, .cbl) trouvé dans ce projet.");
                setProjectLoading(prev => ({ ...prev, [tabToAnalyse]: false }));
                return;
            }

            // mapping uniquement sur les fichiers valides filtrés
            const filesPayload = await Promise.all(
                fichiersValides.map(async (f) => ({
                    name: f.webkitRelativePath || f.name,
                    content: await readFileAsText(f),
                }))
            );

            const operation = operationForTab(tabToAnalyse);

            const payload = {
                inputType: 'folder',
                operation,
                files: filesPayload,
            };

            const response = await instance.post("/translation/input", payload);

            const resultMap = {};
            const files = response.data?.files || [];
            for (const f of files) {
                const simpleName = f.name.split('/').pop();
                resultMap[simpleName] = tabToAnalyse === 'traducteur' ? (f.translation ?? '') : (f.role ?? '');
            }

            setProjectResults(prev => ({ ...prev, [tabToAnalyse]: resultMap }));
        } catch (error) {
            console.error("Erreur API lors de l'analyse du projet :", error);
            const msg = error.response?.data?.message || "Une erreur est survenue lors de la communication avec le serveur.";
            setProjectError(msg);
        } finally {
            setProjectLoading(prev => ({ ...prev, [tabToAnalyse]: false }));
        }
    };

    // Bouton "Analyser" du mode projet : ne lance que l'onglet actif
    const handleAnalyseProject = () => {
        runProjectAnalysis(activeTab);
    };

    // Changement d'onglet en mode projet
    const handleTabChange = (key) => {
        setActiveTab(key);
    };

    // Sélection d'un fichier dans l'arbre
    const handleSelectFile = async (node) => {
        setSelectedFilePath(node.path);
        setSelectedFileName(node.name);

        if (node.file) {
            // récupère l'extension en minuscule
            const extension = node.name.substring(node.name.lastIndexOf('.')).toLowerCase();

            // Si l'extension n'est pas supportée, on ne lit pas le fichier
            if (!extensionsValides.includes(extension)) {
                setIsFileSupported(false);
                setCobolCode(`Ce fichier n'est pas pris en charge par Decobolizator,\nil ne sera pas inclus dans l'analyse.\n\nVeuillez importer uniquement des .txt, .cob et .cbl.`);
                return;
            }

            // Si le fichier est valide, on lit le fichier
            try {
                setIsFileSupported(true);
                const content = await readFileAsText(node.file);
                setCobolCode(content);
            } catch (err) {
                console.error("Erreur lors de la lecture du fichier sélectionné :", err);
            }
        }
    };

    // Déclenche le bon handler "Analyser" selon le mode actif
    const handleAnalyse = () => {
        if (mode === 'project') handleAnalyseProject();
        else handleAnalyseSingle();
    };

    // Export
    const handleExport = async () => {
        // détermine le nom du fichier et le code à envoyer
        const fileToExportName = isProjectMode ? selectedFileName : fileName;
        const codeToExport = cobolCode;

        // Sécurité : si aucun fichier n'est sélectionné en mode projet ou si le code est vide
        if (isProjectMode && !fileToExportName) {
            console.warn("Export annulé : Aucun fichier sélectionné dans le projet.");
            return;
        }
        if (!codeToExport) {
            console.warn("Export annulé : Aucun code COBOL à envoyer.");
            return;
        }

        // Appel à l'API
        try {
            const response = await instance.post('/translation/chunks', {
                cobolCode: codeToExport,
                fileName: fileToExportName,
            });

            // Téléchargement du résultat intermédiaire JSON obtenu
            const json = JSON.stringify(response.data, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `${fileToExportName.replace(/\.[^.]+$/, '')}_chunks.json`;
            a.click();
        } catch (err) {
            console.error('Erreur lors de l\'export des chunks :', err);
        }
    };

    // Onglets pour panneau de droite (Traducteur / Tuteur)
    const tabItems = [
        { key: 'traducteur', label: 'Traducteur' },
        { key: 'tuteur', label: 'Tuteur' },
    ];

    // Valeurs dérivées pour l'affichage

    const isProjectMode = mode === 'project';
    const isCurrentTabLoading = isProjectMode && projectLoading[activeTab];
    const currentResultsMap = isProjectMode ? (projectResults[activeTab] || {}) : null;

    const displayedResult = isProjectMode
        ? (selectedFileName ? (currentResultsMap[selectedFileName] ?? '') : '')
        : (activeTab === 'traducteur' ? traductionResult : tuteurResult);

    const exportDisabled = isProjectMode
        ? Object.keys(currentResultsMap || {}).length === 0
        : (activeTab === 'traducteur' ? !traductionResult : !tuteurResult);

    let placeholderText;
    if (isProjectMode) {
        if (isCurrentTabLoading) {
            placeholderText = 'Analyse du projet en cours...';
        } else if (!projectFiles.length) {
            placeholderText = 'Importez un dossier de code COBOL pour commencer.';
        } else if (Object.keys(currentResultsMap || {}).length === 0) {
            placeholderText = 'Cliquez sur "Analyser" pour lancer l\'analyse du projet...';
        } else if (!selectedFileName) {
            placeholderText = 'Sélectionnez un fichier dans l\'arborescence pour voir son résultat.';
        } else {
            placeholderText = '';
        }
    } else {
        placeholderText = isScanning
            ? 'Analyse en cours...'
            : activeTab === 'traducteur'
                ? 'Cliquez sur "Analyser" pour lancer la traduction de votre code...'
                : 'Cliquez sur "Analyser" pour lancer le mode tuteur...';
    }

    return (
        <div className={`convertisseur-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            <Title level={1} className='title'>
                Convertisseur COBOL
            </Title>
            <Paragraph className='description'>
                Importez un fichier, collez du code, ou importez un dossier entier pour analyser un projet COBOL complet.
            </Paragraph>

            <Row gutter={[32, 32]}>
                {/* PANNEAU GAUCHE : Code COBOL */}
                <Col xs={24} lg={12}>
                    <div className="bouton-box">
                        {/* Bouton Importer : fichier unique */}
                        <label>
                            <input
                                type="file"
                                ref={fileInputRef}
                                accept=".cbl,.cob,.txt"
                                onChange={handleImportFile}
                                style={{ display: 'none' }}
                            />
                            <Button
                                type="primary"
                                icon={<UploadOutlined />}
                                size="large"
                                onClick={() => fileInputRef.current.click()}
                                className='bouton clair'
                            >
                                Importer un fichier
                            </Button>
                        </label>

                        {/* Bouton Importer : projet */}
                        <label>
                            <input
                                type="file"
                                ref={folderInputRef}
                                onChange={handleImportFolder}
                                style={{ display: 'none' }}
                                webkitdirectory="true"
                                directory="true"
                                multiple
                            />
                            <Button
                                type="primary"
                                icon={<FolderOutlined />}
                                size="large"
                                onClick={() => folderInputRef.current.click()}
                                className='bouton clair'
                            >
                                Importer un projet
                            </Button>
                        </label>

                        {/* Bouton Analyser */}
                        <Button
                            type="primary"
                            icon={<ReloadOutlined />}
                            size="large"
                            onClick={handleAnalyse}
                            loading={isProjectMode ? isCurrentTabLoading : isScanning}
                            disabled={isProjectMode ? !projectFiles.length : !cobolCode}
                            className='bouton foncé'
                        >
                            Analyser
                        </Button>
                    </div>

                    {/* Panneau code gauche */}
                    <div className="zone-edition-wrapper">

                        {/* Volet arborescence */}
                        {isProjectMode && (
                            <div
                                className={`editeur projet-arborescence ${!showTree ? 'is-collapsed' : ''}`}
                                onClick={() => !showTree && setShowTree(true)} // fermé : cliquer n'importe où sur la barre pr ouvrir volet
                            >
                                {/* Fermé : affichage unqiuement icône */}
                                {!showTree ? (
                                    <div className="mini-tree-toggle">
                                        <FolderOutlined style={{ fontSize: '20px', color: '#08979C' }} />
                                    </div>
                                ) : (
                                    <>
                                        {/* Ouvert : icône dossier en haut pour fermer */}
                                        <div className="tree-close-header" onClick={(e) => { e.stopPropagation(); setShowTree(false); }}>
                                            <FolderOpenOutlined className="tree-close-icon" />
                                            <span className="tree-header-title">{rootFolderNode?.name || projectRoot?.name || "Projet"}</span>
                                        </div>

                                        {projectError && <div className="tree-error">{projectError}</div>}
                                        {rootFolderNode ? (
                                            <FileTree
                                                root={rootFolderNode}
                                                selectedPath={selectedFilePath}
                                                onSelectFile={handleSelectFile}
                                                resultsByName={currentResultsMap}
                                                isLoading={isCurrentTabLoading}
                                            />
                                        ) : (
                                            <div className="tree-empty">Aucun projet.</div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}

                        {/* Ajuste dynamiquement éditeur selon que le volet est ouvert ou fermé */}
                        <div className={`editeur ${isProjectMode ? (showTree ? 'editeur-tree-open' : 'editeur-tree-collapsed') : ''}`}>
                            {isScanning && <div className="scanner-line" />}
                            <CodeMirror
                                value={cobolCode}
                                height="492px"
                                onChange={(value) => setCobolCode(value)}
                                extensions={
                                    isFileSupported
                                        ? [StreamLanguage.define(cobol), darkMode ? oneDark : []]
                                        : []
                                }
                                // si extension pas supportée
                                style={{
                                    color: isFileSupported
                                        ? 'inherit'
                                        : (darkMode ? '#ffffff' : '#000000')
                                }}
                            />
                        </div>
                    </div>
                </Col>

                {/* PANNEAU DROITE : Sortie Traducteur / Tuteur */}
                <Col xs={24} lg={12}>
                    <div className="tab-box">
                        <Tabs
                            activeKey={activeTab}
                            onChange={handleTabChange}
                            items={tabItems}
                            type="card"
                            className="custom-tabs"
                        />
                    </div>

                    <div style={{ position: 'relative', marginBottom: '10px' }}>
                        {isProjectMode && selectedFileName && (
                            <div className="resultat-filename">{selectedFileName}</div>
                        )}
                        <TextArea
                            rows={18}
                            readOnly
                            value={displayedResult}
                            placeholder={placeholderText}
                            className='resultats'
                            style={{
                                color: darkMode ? 'rgba(255, 255, 255, 0.75)' : 'rgba(0, 0, 0, 0.75)',
                                ['--ant-color-text-placeholder']: darkMode ? 'rgba(255, 255, 255, 0.55)' : '#ABB2BF',
                            }}
                        />
                    </div>

                    <div className='exporter-box'>
                        <Button
                            type="primary"
                            icon={<DownloadOutlined />}
                            size="large"
                            disabled={exportDisabled}
                            onClick={handleExport}
                            className='bouton clair'
                        >
                            Exporter
                        </Button>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default Convertisseur;