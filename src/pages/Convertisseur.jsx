import React, { useState, useRef, useEffect } from 'react';
import { Typography, Row, Col, Button, Input, Tabs } from 'antd';
import { UploadOutlined, DownloadOutlined, ReloadOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';
const { Title, Paragraph } = Typography;
const { TextArea } = Input;
import './convertisseur.css';
import CodeMirror from '@uiw/react-codemirror';
import { EditorView } from '@codemirror/view';
import { StreamLanguage } from '@codemirror/language';
import { useOutletContext } from 'react-router-dom';
// On importe directement la grammaire COBOL officielle cachée dans les paquets legacy !
import { cobol } from '@codemirror/legacy-modes/mode/cobol';
import instance from "../services/HttpClient";
import { oneDark } from '@codemirror/theme-one-dark';

const Convertisseur = () => {

    const { darkMode } = useOutletContext();

    // LES ETATS EN MEMOIRE
    const [cobolCode, setCobolCode] = useState(''); // code inséré ds panneau gauche
    const [fileName, setFileName] = useState('code_manuel.cbl'); // nom fichier analysé
    const [analysisCounts, setAnalysisCounts] = useState({}); // nb analyse d'un fichier
    const [traductionResult, setTraductionResult] = useState(''); // résultat de l'onglet Traducteur
    const [tuteurResult, setTuteurResult] = useState('');         // résultat de l'onglet Tuteur
    const [activeTab, setActiveTab] = useState('traducteur'); // onglet du mode traduction activé
    const fileInputRef = useRef(null); // ref pour le bouton d'import
    const [isScanning, setIsScanning] = useState(false); // si en cours de chargement des résultats
    const [rawResponse, setRawResponse] = useState(null); // stocke reponse brut

    // LES FONCTIONS
    // Importer
    const handleImport = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            const reader = new FileReader();
            reader.onload = (event) => {
                setCobolCode(event.target.result);
            };
            reader.readAsText(file);
        }
    };

    // Traduction / Tuteur

    const handleAnalyse = async () => {
        if (!cobolCode) return;

        try {
            if (activeTab === 'traducteur') setTraductionResult('');
            else setTuteurResult('');
            setRawResponse(null);
            setIsScanning(true);

            let finalFileName = fileName;
            const currentCount = analysisCounts[fileName] || 0;
            if (currentCount > 0) {
                // On sépare le nom et l'extension 
                const lastDotIndex = fileName.lastIndexOf('.');
                if (lastDotIndex !== -1) {
                    const namePart = fileName.substring(0, lastDotIndex);
                    const extPart = fileName.substring(lastDotIndex);
                    finalFileName = `${namePart}(${currentCount})${extPart}`; // ex: input(1).cbl
                } else {
                    finalFileName = `${fileName}(${currentCount})`;
                }
            }
            setAnalysisCounts(prev => ({
                ...prev,
                [fileName]: currentCount + 1
            }));

            const operation = activeTab === 'traducteur' ? 'analyze-project' : 'describe-project';

            const payload = {
                inputType: 'text',
                operation: operation,
                text: cobolCode,
                fileName: finalFileName,
                userContext: operation === 'analyze-project' ? 'Traduction de fichier' : 'Explication de fichier'
            };

            const response = await instance.post("/translation/input", payload, {
                headers: {
                    Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzIiwiZW1haWwiOiJqYWNrLnNwYXJyb3dAZXBmZWR1LmZyIiwiaWF0IjoxNzgxNjI5NzQ4fQ.OfBWNBuMVZFDBlDRykeWGGMxxcfkVE2Vk90sSjfSToM"
                }
            });

            if (response.data && response.data.files && response.data.files.length > 0) {
                setRawResponse(response.data);

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


    // Exporter
const handleExport = async () => {
  if (activeTab === 'traducteur') {
    try {
      const response = await instance.post('/translation/chunks', {
        cobolCode,
        fileName,
      }, {
        headers: {
          Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzIiwiZW1haWwiOiJqYWNrLnNwYXJyb3dAZXBmZWR1LmZyIiwiaWF0IjoxNzgxNjI5NzQ4fQ.OfBWNBuMVZFDBlDRykeWGGMxxcfkVE2Vk90sSjfSToM"
        }
      })
      const json = JSON.stringify(response.data, null, 2)
      const blob = new Blob([json], { type: 'application/json' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `${fileName.replace(/\.[^.]+$/, '')}_chunks.json`
      a.click()
    } catch (err) {
      console.error('Erreur export chunks :', err)
    }
  } else {
    const blob = new Blob([resultCode], { type: 'text/plain;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'explication.txt'
    a.click()
  }
}

    // Onglets pour panneau de droite (Traducteur / Tuteur)
    const tabItems = [
        { key: 'traducteur', label: 'Traducteur' },
        { key: 'tuteur', label: 'Tuteur' },
    ];

    return (
        // LE VISUEL
        <div className={`convertisseur-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>

            {/* Titre et description de la page */}
            <Title level={1} className='title'>
                Convertisseur COBOL
            </Title>
            <Paragraph className='description'>
                Importer ou écrire dans la fenêtre de gauche le code COBOL à traduire puis appuyer sur le bouton traduire.
            </Paragraph>

            {/* Grille principale (2 colonnes) */}
            <Row gutter={[32, 32]}>

                {/* PANNEAU GAUCHE : Code COBOL */}
                <Col xs={24} lg={12}>
                    {/* Ligne des 2 boutons */}
                    <div className="bouton-box">
                        {/* Bouton Importer */}
                        <label>
                            <input
                                type="file"
                                ref={fileInputRef}
                                accept=".cbl,.cob,.txt"
                                onChange={handleImport}
                                style={{ display: 'none' }}
                            />
                            <Button
                                type="primary"
                                icon={<UploadOutlined />}
                                size="large"
                                onClick={() => fileInputRef.current.click()} // Déclenche le clic sur l'input caché
                                className='bouton clair'
                            >
                                Importer
                            </Button>
                        </label>

                        {/* Bouton Analyser */}
                        <Button
                            type="primary"
                            icon={<ReloadOutlined />}
                            size="large"
                            onClick={handleAnalyse}
                            className='bouton foncé'
                        >
                            Analyser
                        </Button>
                    </div>

                    {/* Editeur CodeMirror6 */}
                    <div className='editeur'>
                        {/* La Barre de Scan Animée */}
                        {isScanning && <div className="scanner-line" />}

                        <CodeMirror
                            value={cobolCode}
                            height="492px"
                            onChange={(value) => setCobolCode(value)}
                            extensions={[
                                // Charge la vraie coloration COBOL officielle
                                StreamLanguage.define(cobol),
                                darkMode ? oneDark : [],
                            ]}
                        />
                    </div>
                </Col>

                {/* PANNEAU DROITE : Sortie Traducteur / Tuteur */}
                <Col xs={24} lg={12}>
                    {/* Onglets Traducteur / Tuteur */}
                    <div className="tab-box">
                        <Tabs
                            activeKey={activeTab}
                            onChange={(key) => setActiveTab(key)}
                            items={tabItems}
                            type="card"
                            className="custom-tabs"
                        />
                    </div>

                    {/* Zone de texte Résultat */}
                    <div style={{ position: 'relative', marginBottom: '10px' }}>
                        <TextArea
                            rows={18}
                            readOnly
                            value={activeTab === 'traducteur' ? traductionResult : tuteurResult}
                            placeholder={isScanning
                                ? 'Analyse en cours...'
                                : activeTab === 'traducteur'
                                    ? 'Cliquez sur "Analyser" pour lancer la traduction de votre code...'
                                    : 'Cliquez sur “Analyser” pour lancer le mode tuteur...'
                            }
                            className='resultats'
                            style={{
                                color: darkMode ? 'rgba(255, 255, 255, 0.75)' : 'rgba(0, 0, 0, 0.75)',
                                ['--ant-color-text-placeholder']: darkMode ? 'rgba(255, 255, 255, 0.55)' : '#ABB2BF',
                            }}
                        />
                    </div>

                    {/* Bouton Exporter */}
                    <div className='exporter-box'>
                        <Button
                            type="primary"
                            icon={<DownloadOutlined />}
                            size="large"
                            disabled={activeTab === 'traducteur' ? !traductionResult : !tuteurResult}
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