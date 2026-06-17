import React from 'react';
import { useEffect } from "react";
import { Typography, Row, Col, Button, Input, Tabs, Layout, Popover } from 'antd';
const { Title, Paragraph } = Typography;
const { TextArea } = Input;
import { UploadOutlined, DownloadOutlined, ReloadOutlined, FolderAddOutlined, FolderOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';
const { Header, Content } = Layout;
import { useOutletContext } from 'react-router-dom';
import './accueil.css';

const Accueil = () => {

    const { darkMode } = useOutletContext();

    const tabItems = [
        { key: 'traducteur', label: 'Traducteur' },
        { key: 'tuteur', label: 'Tuteur' },
    ];

    return (
        <div className={`accueil-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>

            {/* --- Section à propos --- */}
            <section className="section-a-propos">
                {/* Partie gauche paragraphe */}
                
                <div className="a-propos-gauche">
                    <h1>À propos du site</h1>
                    <div className="a-propos-texte">
                        <p>ScanCod est un site web dédié à la compréhension du langage Cobol. Idéal pour documenter vos codes, vous formez au Cobol, ou accélérer la transition de langage de vos projets.</p>
                        <p>Notre outil permet de traduire vos codes du langage Cobol en un langage naturel, et de reprendre là où vous en étiez grâce à votre historique. Exportez votre JSON intermédiaire, afin d'avoir point de départ pour la transition vers un autre langage.</p>
                        <p>Utilisez également le mode tuteur afin de recevoir une explication du rôle de votre fichier au sein d'un projet. Bon décodage avec Decobolizator !</p>
                    </div>
                </div>

                {/* Partie droite dino */}
                <div className="a-propos-droite">
                    {/* Le bleu clair */}
                    <div className="accueil-curve-clair"></div>

                    {/* Le bleu foncé devant */}
                    <div className="accueil-curve-foncee">
                        <img src="/src/assets/triceratops.svg" alt="Dino" className='accueil-dino' />
                    </div>
                </div>
            </section>

            {/* --- PARTIE GUIDE D'UTILISATION --- */}
            <section className="section-guide">
                {/* Titre et description de la page */}
                <Title level={1} className='guide-title'>
                    Guide d’utilisation
                </Title>
                <Paragraph className='guide-description'>
                    Ce convertisseur en ligne gratuit vous permet de convertir du code de Cobol en langage naturel en un seul clic. Pour utiliser ce convertisseur, suivez les étapes suivantes :
                </Paragraph>
                <Paragraph className="guide-description">
                    (Notez que vous n'obtiendrez pas toujours le même code, puisqu'il est généré par un modèle de langage IA qui n'est pas 100 % déterministe et qui est mis à jour de temps en temps.)
                </Paragraph>

                <hr style={{margin: '50px 0' }} />

                <Paragraph className="guide-description" style={{marginTop:"0px", fontSize:"25px"}}>
                   Import d'un fichier unique 
                </Paragraph>
                {/* Grille principale (2 colonnes) */}
                <Row gutter={[32, 32]} style={{ marginTop: '50px' }}>

                    {/* PANNEAU GAUCHE : Code COBOL */}
                    <Col xs={24} lg={12}>
                        {/* Ligne des 2 boutons */}

                        <div className="guide-bouton-box">

                            {/* Bouton Importer un fichier */}
                            <div className="guide-step-wrapper">
                                {/* popup survol */}
                                <Popover
                                    title="Étape 1 : Importer votre code"
                                    content={<div>
                                        Ce bouton permet d'analyser un <strong>fichier COBOL unique</strong>.<br />
                                        Vous pouvez importer un fichier depuis votre ordinateur ou taper/coller directement
                                        votre code source dans l'éditeur de texte ci-dessous.
                                    </div>}
                                    trigger="hover"
                                    placement="topLeft"
                                >
                                    <div className="guide-number-badge step-1">1</div>
                                </Popover>

                                <Button
                                    type="primary"
                                    icon={<UploadOutlined />}
                                    size="large"
                                    className='guide-bouton clair'
                                >
                                    Importer un fichier
                                </Button>
                            </div>


                            {/* Bouton Importer un projet */}
                            <div className="guide-step-wrapper">
                                <Button
                                    type="primary"
                                    icon={<FolderOutlined />}
                                    size="large"
                                    className='guide-bouton clair'
                                >
                                    Importer un projet
                                </Button>
                            </div>

                            {/* Bouton Analyser */}
                            <div className="guide-step-wrapper">
                                {/* popup survol */}
                                <Popover
                                    title="Étape 3 : Analyser votre code"
                                    content="Cliquez sur le bouton d’analyse pour lancer l’analyse dans le mode sélectionné."
                                    trigger="hover"
                                    placement="topLeft"
                                >
                                    <div className="guide-number-badge step-3">3</div>
                                </Popover>

                                <Button
                                    type="primary"
                                    icon={<ReloadOutlined />}
                                    size="large"
                                    className='guide-bouton foncé'
                                >
                                    Analyser
                                </Button>
                            </div>
                        </div>

                        {/* Editeur CodeMirror6 */}
                        <div className="guide-fake-editor">

                            {/* Ligne 1 */}
                            <div className="guide-code-line">
                                <span className="guide-line-number">000100</span>
                                <span className="guide-line-content"><span className="cb-keyword">IDENTIFICATION DIVISION</span>.</span>
                            </div>

                            {/* Ligne 2 */}
                            <div className="guide-code-line">
                                <span className="guide-line-number">000200</span>
                                <span className="guide-line-content"><span className="cb-keyword">PROGRAM-ID</span>. GESTION-STOCK.</span>
                            </div>

                            {/* Ligne 3 */}
                            <div className="guide-code-line">
                                <span className="guide-line-number">000300</span>
                                <span className="guide-line-content"><span className="cb-keyword">AUTHOR</span>. PROJET-DECOBOLIZATOR.</span>
                            </div>

                            {/* Ligne 4 */}
                            <div className="guide-code-line">
                                <span className="guide-line-number">000400</span>
                                <span className="guide-line-content"><span className="cb-comment">*--------------------------------------------*</span></span>
                            </div>

                            {/* Ligne 5 */}
                            <div className="guide-code-line">
                                <span className="guide-line-number">000500</span>
                                <span className="guide-line-content"><span className="cb-comment">* CE PROGRAMME SIMULE UNE GESTION D'INVENTAIRE POUR TESTER LE    *</span></span>
                            </div>

                            {/* Ligne 6 */}
                            <div className="guide-code-line">
                                <span className="guide-line-number">000600</span>
                                <span className="guide-line-content"><span className="cb-comment">* PIPELINE DE PARSING ET DE TRADUCTION EN LANGAGE NATUREL.        *</span></span>
                            </div>

                            {/* Ligne 7 */}
                            <div className="guide-code-line">
                                <span className="guide-line-number">000700</span>
                                <span className="guide-line-content"><span className="cb-comment">*--------------------------------------------*</span></span>
                            </div>

                            {/* Ligne 8 */}
                            <div className="guide-code-line">
                                <span className="guide-line-number">000800</span>
                                <span className="guide-line-content"></span>
                            </div>

                            {/* Ligne 9 */}
                            <div className="guide-code-line">
                                <span className="guide-line-number">000900</span>
                                <span className="guide-line-content"><span className="cb-keyword">ENVIRONMENT DIVISION</span>.</span>
                            </div>

                            {/* Ligne 10 */}
                            <div className="guide-code-line">
                                <span className="guide-line-number">001000</span>
                                <span className="guide-line-content"><span className="cb-keyword">CONFIGURATION SECTION</span>.</span>
                            </div>

                            {/* Ligne 11 */}
                            <div className="guide-code-line">
                                <span className="guide-line-number">001100</span>
                                <span className="guide-line-content"><span className="cb-keyword">SPECIAL-NAMES</span>.</span>
                            </div>

                            {/* Ligne 12 */}
                            <div className="guide-code-line">
                                <span className="guide-line-number">001200</span>
                                <span className="guide-line-content">    <span className="cb-keyword">DECIMAL-POINT IS COMMA</span>.</span>
                            </div>

                            {/* Ligne 13 */}
                            <div className="guide-code-line">
                                <span className="guide-line-number">001300</span>
                                <span className="guide-line-content"></span>
                            </div>

                            {/* Ligne 14 */}
                            <div className="guide-code-line">
                                <span className="guide-line-number">001400</span>
                                <span className="guide-line-content"><span className="cb-keyword">DATA DIVISION</span>.</span>
                            </div>

                            {/* Ligne 15 */}
                            <div className="guide-code-line">
                                <span className="guide-line-number">001500</span>
                                <span className="guide-line-content"><span className="cb-keyword">WORKING-STORAGE SECTION</span>.</span>
                            </div>

                            {/* Ligne 16 */}
                            <div className="guide-code-line">
                                <span className="guide-line-number">001600</span>
                                <span className="guide-line-content"></span>
                            </div>

                            {/* Ligne 17 */}
                            <div className="guide-code-line">
                                <span className="guide-line-number">001700</span>
                                <span className="guide-line-content"><span className="cb-comment">* DEFINITION DES CONSTANTES ET VARIABLES DE TRAVAIL</span></span>
                            </div>

                            {/* Ligne 18 */}
                            <div className="guide-code-line">
                                <span className="guide-line-number">001800</span>
                                <span className="guide-line-content"><span className='cb-var'>01 </span>WS-CONSTANTES.</span>
                            </div>

                            {/* Ligne 19 */}
                            <div className="guide-code-line">
                                <span className="guide-line-number">001900</span>
                                <span className="guide-line-content">    <span className="cb-var">05 </span>WS-TAXE-TVA     <span className='cb-keyword'>PIC </span><span className='cb-var'>9(02)</span>V99 <span className='cb-keyword'>VALUE </span><span className='cb-var'>20,00</span>.</span>
                            </div>

                            {/* Ligne 20 */}
                            <div className="guide-code-line">
                                <span className="guide-line-number">002000</span>
                                <span className="guide-line-content">    <span className="cb-var">05 </span>WS-SEUIL-ALERTE <span className='cb-keyword'>PIC </span><span className='cb-var'>9(03)    </span><span className='cb-keyword'>VALUE </span><span className='cb-var'>10</span>.</span>
                            </div>
                        </div>
                    </Col>

                    {/* PANNEAU DROITE : Sortie Traducteur / Tuteur */}
                    <Col xs={24} lg={12}>
                        {/* Onglets Traducteur / Tuteur */}
                        <div className="guide-tab-box" style={{ position: 'relative' }}>
                            {/* popup survol */}
                            <Popover
                                title="Étape 2 : Choisissez le mode d’analyse : "
                                content={<div>
                                    Traducteur pour traduire votre code COBOL en langage naturel,<br />
                                    Tuteur pour recevoir une explication du rôle de votre code dans un projet.
                                </div>}
                                trigger="hover"
                                placement="topLeft"
                            >
                                <div className="guide-number-badge step-2">2</div>
                            </Popover>

                            <Tabs
                                activeKey="traducteur"
                                items={[
                                    { key: 'traducteur', label: 'Traducteur' },
                                    { key: 'tuteur', label: 'Tuteur' },
                                ]}
                                type="card"
                                className="guide-custom-tabs"
                            />
                        </div>

                        {/* Zone de texte Résultat */}
                        <div style={{ position: 'relative', marginBottom: '10px' }}>
                            {/* popup survol */}
                            <Popover
                                title="Étape 4 : Consulter le résultat"
                                content={<div>
                                    Le résultat de l’analyse sera affiché dans la zone de sortie.
                                </div>}
                                trigger="hover"
                                placement="bottomLeft"
                            >
                                <div className="guide-number-badge step-4">4</div>
                            </Popover>

                            <div className="guide-fake-translation">

                                {/* Entête du programme */}
                                <div className="translation-line">
                                    PROGRAMME GESTION-STOCK
                                </div>
                                <div className="translation-line">
                                    AUTEUR: PROJET-DECOBOLIZATOR
                                </div>
                                <div className="translation-line">
                                    DESCRIPTION: Simule une gestion d'inventaire pour tester le pipeline de parsing et de traduction.
                                </div>
                                <div className="translation-line"></div>

                                {/* Configuration */}
                                <div className="translation-line">
                                    CONFIGURATION GLOBAL:
                                </div>
                                <div className="translation-line">
                                    &nbsp;&nbsp;&nbsp;&nbsp;Définir le séparateur décimal comme étant la VIRGULE (",")
                                </div>
                                <div className="translation-line"></div>

                                {/* Section Variables */}
                                <div className="translation-line">
                                    VARIABLES ET CONSTANTES (WORKING-STORAGE):
                                </div>
                                <div className="translation-line"></div>

                                {/* Bloc de constantes */}
                                <div className="translation-line">
                                    &nbsp;&nbsp;&nbsp;&nbsp;STRUCTURE WS-CONSTANTES:
                                </div>
                                <div className="translation-line">
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;WS-TAXE-TVA: Nombre décimal (2 chiffres, 2 décimales) = 20,00
                                </div>
                                <div className="translation-line">
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;WS-SEUIL-ALERTE : Nombre entier (3 chiffres) = 10
                                </div>
                                <div className="translation-line"></div>

                                {/* Structure de données Produit */}
                                <div className="translation-line">
                                    &nbsp;&nbsp;&nbsp;&nbsp;STRUCTURE WS-PRODUIT:
                                </div>
                                <div className="translation-line">
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;WS-PROD-ID : Nombre entier (8 chiffres)
                                </div>
                                <div className="translation-line">
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;WS-PROD-LIBELLE : Chaîne de caractères (30 caractères)
                                </div>
                                <div className="translation-line">
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;WS-PROD-PRIX-HT : Nombre décimal (5 chiffres, 2 décimales)
                                </div>
                                <div className="translation-line">
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;WS-PROD-STOCK-QTE : Nombre entier signé (4 chiffres)
                                </div>
                                <div className="translation-line">
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;WS-PROD-CATEGORIE : Chaîne de caractères (10 caractères)
                                </div>
                                <div className="translation-line">
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Condition CAT-ALIMENTAIRE : Vrai si WS-PROD-CATEGORIE vaut "ALIM"
                                </div>
                                <div className="translation-line">
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Condition CAT-ELECTRONIQUE : Vrai si WS-PROD-CATEGORIE vaut "ELEC"
                                </div>
                                <div className="translation-line"></div>

                                {/* Bloc de calculs */}
                                <div className="translation-line">
                                    &nbsp;&nbsp;&nbsp;&nbsp;STRUCTURE WS-CALCULS:
                                </div>
                                <div className="translation-line">
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Variables de calculs non encore définies
                                </div>
                                <div className="translation-line"></div>

                                <div className="translation-line">
                                    FIN PROGRAMME
                                </div>

                            </div>
                        </div>

                        {/* Bouton Exporter */}
                        <div className='guide-exporter-box'>
                            <div className="guide-step-wrapper">
                                {/* popup survol */}
                                <Popover
                                    title="Étape 5 : Exporter votre code"
                                    content="La traduction est exportable sous forme de fichier JSON."
                                    trigger="hover"
                                    placement="topLeft"
                                >
                                    <div className="guide-number-badge step-5">5</div>
                                </Popover>

                                <Button
                                    type="primary"
                                    icon={<DownloadOutlined />}
                                    size="large"
                                    className='guide-bouton clair'
                                >
                                    Exporter
                                </Button>
                            </div>

                        </div>
                    </Col>
                </Row>









                <hr style={{margin: '50px 0' }} />

                <Paragraph className="guide-description" style={{marginTop:"0px", fontSize:"25px"}}>
                   Import d'un projet entier
                </Paragraph>
                {/* Grille principale (2 colonnes) */}
                <Row gutter={[32, 32]} style={{ marginTop: '50px' }}>

                    {/* PANNEAU GAUCHE : Code COBOL */}
                    <Col xs={24} lg={12}>
                        {/* Ligne des 2 boutons */}

                        <div className="guide-bouton-box">

                            {/* Bouton Importer un fichier */}
                            <div className="guide-step-wrapper">
                                {/* popup survol */}

                                <Button
                                    type="primary"
                                    icon={<UploadOutlined />}
                                    size="large"
                                    className='guide-bouton clair'
                                >
                                    Importer un fichier
                                </Button>
                            </div>


                            {/* Bouton Importer un projet */}
                            <div className="guide-step-wrapper">
                                {/* popup survol */}
                                <Popover
                                    title="Étape 1 : Importer votre projet"
                                    content={<div>
                                        Ce bouton permet d'analyser un <strong>projet complet </strong>.<br />
                                        Sélectionnez le répertoire contenant vos fichiers COBOL pour charger l'arborescence
                                        et analyser l'ensemble de l'application en une seule fois.
                                    </div>}
                                    trigger="hover"
                                    placement="topLeft"
                                >
                                    <div className="guide-number-badge step-1">1</div>
                                </Popover>

                                <Button
                                    type="primary"
                                    icon={<FolderOutlined />}
                                    size="large"
                                    className='guide-bouton clair'
                                >
                                    Importer un projet
                                </Button>
                            </div>

                            {/* Bouton Analyser */}
                            <div className="guide-step-wrapper">
                                {/* popup survol */}
                                <Popover
                                    title="Étape 3 : Analyser votre code"
                                    content="Cliquez sur le bouton d’analyse pour lancer l’analyse dans le mode sélectionné."
                                    trigger="hover"
                                    placement="topLeft"
                                >
                                    <div className="guide-number-badge step-3">3</div>
                                </Popover>

                                <Button
                                    type="primary"
                                    icon={<ReloadOutlined />}
                                    size="large"
                                    className='guide-bouton foncé'
                                >
                                    Analyser
                                </Button>
                            </div>
                        </div>

                        {/* Editeur CodeMirror6 */}
                        <div className="guide-fake-editor">

                            {/* Ligne 1 */}
                            <div className="guide-code-line">
                                <span className="guide-line-number">000100</span>
                                <span className="guide-line-content"><span className="cb-keyword">IDENTIFICATION DIVISION</span>.</span>
                            </div>

                            {/* Ligne 2 */}
                            <div className="guide-code-line">
                                <span className="guide-line-number">000200</span>
                                <span className="guide-line-content"><span className="cb-keyword">PROGRAM-ID</span>. GESTION-STOCK.</span>
                            </div>

                            {/* Ligne 3 */}
                            <div className="guide-code-line">
                                <span className="guide-line-number">000300</span>
                                <span className="guide-line-content"><span className="cb-keyword">AUTHOR</span>. PROJET-DECOBOLIZATOR.</span>
                            </div>

                            {/* Ligne 4 */}
                            <div className="guide-code-line">
                                <span className="guide-line-number">000400</span>
                                <span className="guide-line-content"><span className="cb-comment">*--------------------------------------------*</span></span>
                            </div>

                            {/* Ligne 5 */}
                            <div className="guide-code-line">
                                <span className="guide-line-number">000500</span>
                                <span className="guide-line-content"><span className="cb-comment">* CE PROGRAMME SIMULE UNE GESTION D'INVENTAIRE POUR TESTER LE    *</span></span>
                            </div>

                            {/* Ligne 6 */}
                            <div className="guide-code-line">
                                <span className="guide-line-number">000600</span>
                                <span className="guide-line-content"><span className="cb-comment">* PIPELINE DE PARSING ET DE TRADUCTION EN LANGAGE NATUREL.        *</span></span>
                            </div>

                            {/* Ligne 7 */}
                            <div className="guide-code-line">
                                <span className="guide-line-number">000700</span>
                                <span className="guide-line-content"><span className="cb-comment">*--------------------------------------------*</span></span>
                            </div>

                            {/* Ligne 8 */}
                            <div className="guide-code-line">
                                <span className="guide-line-number">000800</span>
                                <span className="guide-line-content"></span>
                            </div>

                            {/* Ligne 9 */}
                            <div className="guide-code-line">
                                <span className="guide-line-number">000900</span>
                                <span className="guide-line-content"><span className="cb-keyword">ENVIRONMENT DIVISION</span>.</span>
                            </div>

                            {/* Ligne 10 */}
                            <div className="guide-code-line">
                                <span className="guide-line-number">001000</span>
                                <span className="guide-line-content"><span className="cb-keyword">CONFIGURATION SECTION</span>.</span>
                            </div>

                            {/* Ligne 11 */}
                            <div className="guide-code-line">
                                <span className="guide-line-number">001100</span>
                                <span className="guide-line-content"><span className="cb-keyword">SPECIAL-NAMES</span>.</span>
                            </div>

                            {/* Ligne 12 */}
                            <div className="guide-code-line">
                                <span className="guide-line-number">001200</span>
                                <span className="guide-line-content">    <span className="cb-keyword">DECIMAL-POINT IS COMMA</span>.</span>
                            </div>

                            {/* Ligne 13 */}
                            <div className="guide-code-line">
                                <span className="guide-line-number">001300</span>
                                <span className="guide-line-content"></span>
                            </div>

                            {/* Ligne 14 */}
                            <div className="guide-code-line">
                                <span className="guide-line-number">001400</span>
                                <span className="guide-line-content"><span className="cb-keyword">DATA DIVISION</span>.</span>
                            </div>

                            {/* Ligne 15 */}
                            <div className="guide-code-line">
                                <span className="guide-line-number">001500</span>
                                <span className="guide-line-content"><span className="cb-keyword">WORKING-STORAGE SECTION</span>.</span>
                            </div>

                            {/* Ligne 16 */}
                            <div className="guide-code-line">
                                <span className="guide-line-number">001600</span>
                                <span className="guide-line-content"></span>
                            </div>

                            {/* Ligne 17 */}
                            <div className="guide-code-line">
                                <span className="guide-line-number">001700</span>
                                <span className="guide-line-content"><span className="cb-comment">* DEFINITION DES CONSTANTES ET VARIABLES DE TRAVAIL</span></span>
                            </div>

                            {/* Ligne 18 */}
                            <div className="guide-code-line">
                                <span className="guide-line-number">001800</span>
                                <span className="guide-line-content"><span className='cb-var'>01 </span>WS-CONSTANTES.</span>
                            </div>

                            {/* Ligne 19 */}
                            <div className="guide-code-line">
                                <span className="guide-line-number">001900</span>
                                <span className="guide-line-content">    <span className="cb-var">05 </span>WS-TAXE-TVA     <span className='cb-keyword'>PIC </span><span className='cb-var'>9(02)</span>V99 <span className='cb-keyword'>VALUE </span><span className='cb-var'>20,00</span>.</span>
                            </div>

                            {/* Ligne 20 */}
                            <div className="guide-code-line">
                                <span className="guide-line-number">002000</span>
                                <span className="guide-line-content">    <span className="cb-var">05 </span>WS-SEUIL-ALERTE <span className='cb-keyword'>PIC </span><span className='cb-var'>9(03)    </span><span className='cb-keyword'>VALUE </span><span className='cb-var'>10</span>.</span>
                            </div>
                        </div>
                    </Col>

                    {/* PANNEAU DROITE : Sortie Traducteur / Tuteur */}
                    <Col xs={24} lg={12}>
                        {/* Onglets Traducteur / Tuteur */}
                        <div className="guide-tab-box" style={{ position: 'relative' }}>
                            {/* popup survol */}
                            <Popover
                                title="Étape 2 : Choisissez le mode d’analyse : "
                                content={<div>
                                    Traducteur pour traduire votre code COBOL en langage naturel,<br />
                                    Tuteur pour recevoir une explication du rôle de votre code dans un projet.
                                </div>}
                                trigger="hover"
                                placement="topLeft"
                            >
                                <div className="guide-number-badge step-2">2</div>
                            </Popover>

                            <Tabs
                                activeKey="traducteur"
                                items={[
                                    { key: 'traducteur', label: 'Traducteur' },
                                    { key: 'tuteur', label: 'Tuteur' },
                                ]}
                                type="card"
                                className="guide-custom-tabs"
                            />
                        </div>

                        {/* Zone de texte Résultat */}
                        <div style={{ position: 'relative', marginBottom: '10px' }}>
                            {/* popup survol */}
                            <Popover
                                title="Étape 4 : Consulter le résultat"
                                content={<div>
                                    Le résultat de l’analyse sera affiché dans la zone de sortie.
                                </div>}
                                trigger="hover"
                                placement="bottomLeft"
                            >
                                <div className="guide-number-badge step-4">4</div>
                            </Popover>

                            <div className="guide-fake-translation">

                                {/* Entête du programme */}
                                <div className="translation-line">
                                    PROGRAMME GESTION-STOCK
                                </div>
                                <div className="translation-line">
                                    AUTEUR: PROJET-DECOBOLIZATOR
                                </div>
                                <div className="translation-line">
                                    DESCRIPTION: Simule une gestion d'inventaire pour tester le pipeline de parsing et de traduction.
                                </div>
                                <div className="translation-line"></div>

                                {/* Configuration */}
                                <div className="translation-line">
                                    CONFIGURATION GLOBAL:
                                </div>
                                <div className="translation-line">
                                    &nbsp;&nbsp;&nbsp;&nbsp;Définir le séparateur décimal comme étant la VIRGULE (",")
                                </div>
                                <div className="translation-line"></div>

                                {/* Section Variables */}
                                <div className="translation-line">
                                    VARIABLES ET CONSTANTES (WORKING-STORAGE):
                                </div>
                                <div className="translation-line"></div>

                                {/* Bloc de constantes */}
                                <div className="translation-line">
                                    &nbsp;&nbsp;&nbsp;&nbsp;STRUCTURE WS-CONSTANTES:
                                </div>
                                <div className="translation-line">
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;WS-TAXE-TVA: Nombre décimal (2 chiffres, 2 décimales) = 20,00
                                </div>
                                <div className="translation-line">
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;WS-SEUIL-ALERTE : Nombre entier (3 chiffres) = 10
                                </div>
                                <div className="translation-line"></div>

                                {/* Structure de données Produit */}
                                <div className="translation-line">
                                    &nbsp;&nbsp;&nbsp;&nbsp;STRUCTURE WS-PRODUIT:
                                </div>
                                <div className="translation-line">
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;WS-PROD-ID : Nombre entier (8 chiffres)
                                </div>
                                <div className="translation-line">
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;WS-PROD-LIBELLE : Chaîne de caractères (30 caractères)
                                </div>
                                <div className="translation-line">
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;WS-PROD-PRIX-HT : Nombre décimal (5 chiffres, 2 décimales)
                                </div>
                                <div className="translation-line">
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;WS-PROD-STOCK-QTE : Nombre entier signé (4 chiffres)
                                </div>
                                <div className="translation-line">
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;WS-PROD-CATEGORIE : Chaîne de caractères (10 caractères)
                                </div>
                                <div className="translation-line">
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Condition CAT-ALIMENTAIRE : Vrai si WS-PROD-CATEGORIE vaut "ALIM"
                                </div>
                                <div className="translation-line">
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Condition CAT-ELECTRONIQUE : Vrai si WS-PROD-CATEGORIE vaut "ELEC"
                                </div>
                                <div className="translation-line"></div>

                                {/* Bloc de calculs */}
                                <div className="translation-line">
                                    &nbsp;&nbsp;&nbsp;&nbsp;STRUCTURE WS-CALCULS:
                                </div>
                                <div className="translation-line">
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Variables de calculs non encore définies
                                </div>
                                <div className="translation-line"></div>

                                <div className="translation-line">
                                    FIN PROGRAMME
                                </div>

                            </div>
                        </div>

                        {/* Bouton Exporter */}
                        <div className='guide-exporter-box'>
                            <div className="guide-step-wrapper">
                                {/* popup survol */}
                                <Popover
                                    title="Étape 5 : Exporter votre code"
                                    content="La traduction est exportable sous forme de fichier JSON."
                                    trigger="hover"
                                    placement="topLeft"
                                >
                                    <div className="guide-number-badge step-5">5</div>
                                </Popover>

                                <Button
                                    type="primary"
                                    icon={<DownloadOutlined />}
                                    size="large"
                                    className='guide-bouton clair'
                                >
                                    Exporter
                                </Button>
                            </div>

                        </div>
                    </Col>

                </Row>

            </section>

        </div>
    );
};

export default Accueil;