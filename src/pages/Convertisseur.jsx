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
// On importe directement la grammaire COBOL officielle cachée dans les paquets legacy !
import { cobol } from '@codemirror/legacy-modes/mode/cobol';
import instance from "../services/HttpClient"

const Convertisseur = () => {
    // LES ETATS EN MEMOIRE
    const [cobolCode, setCobolCode] = useState(''); // code inséré ds panneau gauche
    const [resultCode, setResultCode] = useState(''); // résultat affiché ds panneau droit
    const [activeTab, setActiveTab] = useState('traducteur'); // onglet du mode traduction activé
    const fileInputRef = useRef(null); // ref pour le bouton d'import
    const [isScanning, setIsScanning] = useState(false); // si en cours de chargement des résultats

    // LES FONCTIONS
    // Importer
    const handleImport = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setCobolCode(event.target.result);
            };
            reader.readAsText(file);
        }
    };

    // Traduction / Tuteur
    const handleAnalyse = () => {
        if (!cobolCode) return;

        setResultCode('');  /* --- A RETIRER QD CONNECTION AVEC BACK --- */
        setIsScanning(true); /* --- A RETIRER QD CONNECTION AVEC BACK --- */

        /* --- POUR CONNECTION AVEC BACK --- */
        /*
        try {
            setResultCode('');
            setIsScanning(true);
            const response = await instance.post("/test", {    // endpoint test A REMPLACER
                code : cobolCode,
                mode : activeTab
            }) 
            if (response.data && response.data.resultat) {  // vérifie si le back a bien renvoyé des données et où exactement ds data A VERIFIER
                setResultCode(response.data.resultat);
            } else {
                setResultCode("Le serveur a répondu, mais le format de données est inattendu.");
            }   
        } catch (error) {
            console.error("Erreur API lors de l'analyse :", error);
            setResultCode("Une erreur est survenue lors de la communication avec le serveur.");
        }
        */

        setTimeout(() => {
            if (activeTab === 'traducteur') {
                setResultCode(`Traduction de ce code COBOL`);
            } else {
                setResultCode(`Explication du rôle de ce code COBOL`);
            } 
            setIsScanning(false);
        }, 2500);
    };

    // Exporter
    const handleExport = () => {
        const element = document.createElement("a");
        const file = new Blob([resultCode], { type: 'text/plain;charset=utf-8' });
        element.href = URL.createObjectURL(file);
        element.download = activeTab === 'traducteur' ? "traduction.txt" : "explication.txt";
        document.body.appendChild(element);
        element.click();
    };

    // Onglets pour panneau de droite (Traducteur / Tuteur)
    const tabItems = [
        { key: 'traducteur', label: 'Traducteur' },
        { key: 'tuteur', label: 'Tuteur' },
    ];

    return (
        // LE VISUEL
        <div style={{ padding: '40px 60px'}}>
            
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
                    <div style={{ position: 'relative', marginBottom: '10px'}}>
                        <TextArea
                            rows={18}
                            readOnly
                            value={resultCode}
                            placeholder={isScanning 
                                ? 'Analyse en cours...' 
                                : activeTab === 'traducteur' 
                                ? 'Cliquez sur "Analyser" pour lancer la traduction de votre code...' 
                                : 'Cliquez sur “Analyser” pour lancer le mode tuteur...'
                                    }
                            className='resultats'
                            style={{color: resultCode? 'rgba(0, 0, 0, 0.5)' : '#ABB2BF'}}
                        />
                    </div>

                    {/* Bouton Exporter */}
                    <div className='exporter-box'>
                        <Button 
                            type="primary" 
                            icon={<DownloadOutlined />} 
                            size="large"
                            disabled={!resultCode}
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