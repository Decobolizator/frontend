import { useState, useEffect } from 'react';
import { Tabs, Avatar, Button, Input, Modal, message, Spin, Empty, Tag } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, UploadOutlined, HistoryOutlined, FileOutlined, ArrowRightOutlined, SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import { useOutletContext, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import instance from '../services/HttpClient';
import './Parametres.css';

const { TabPane } = Tabs;

const timeAgo = (dateStr) => {
    const normalized = dateStr.endsWith('Z') ? dateStr : dateStr + 'Z';
    const date = new Date(normalized);
    const now = Date.now();
    const diff = now - date.getTime();
    const seconds = Math.floor(diff / 1000);

    if (seconds < 60) return `Il y a ${seconds} seconde${seconds > 1 ? 's' : ''}`;
        const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
        const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
        const days = Math.floor(hours / 24);
        return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
};

const MonCompteTab = () => {
    const [modal1Open, setModal1Open] = useState(false);
    const [modal2Open, setModal2Open] = useState(false);
    const { user, token } = useAuth();

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Vérification ancien mdp
    const handleVerify = async () => {
        if (!oldPassword) {
            return message.error("Veuillez saisir votre mot de passe actuel");
        }
        try {
            const tokenStocke = localStorage.getItem('token');
            await axios.post(
                'http://localhost:4000/auth/verify-password',
                { password: oldPassword },
                { headers: { Authorization: `Bearer ${tokenStocke}` } }
            );
            console.log("oldpass", oldPassword)
            setModal1Open(false);
            setModal2Open(true);
            setOldPassword('');
        } catch (error) {
            console.error(error);
            const errorMsg = error.response?.data?.message || "Ancien mot de passe incorrect";
            message.error(errorMsg);
        }
    };

    // Enregistrement nouveau mot de passe
    const handleSave = async () => {
        if (newPassword !== confirmPassword) {
            return message.error('Les mots de passe ne correspondent pas');
        }
        if (newPassword.length < 8) {
            return message.error("Le mot de passe doit contenir au moins 8 caractères");
        }
        try {
            const tokenStocke = localStorage.getItem('token');
            await axios.post(
                'http://localhost:4000/auth/update-password',
                { newPassword },
                { headers: { Authorization: `Bearer ${tokenStocke}` } }
            );
            message.success("Mot de passe modifié avec succès");
            setModal2Open(false);
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error(error);
            const errorMsg = error.response?.data?.message || "Impossible de modifier le mot de passe";
            message.error(errorMsg);
        }
    };

    return (
        <div className="account-card">
            <h2 className="section-title">Informations personnelles</h2>

            {/* Photo de profil */}
            <div className="profile-photo-row">
                <Avatar
                    size={56}
                    style={{ backgroundColor: '#08979C', fontSize: '1.2rem', fontFamily: 'Akatab, sans-serif' }}
                >
                    { `${user?.firstName?.charAt(0).toUpperCase()}${user?.lastName?.charAt(0).toUpperCase()}`}
                </Avatar>

                <div className="photo-info">
                    <span className="photo-label">Profil de {user?.firstName} {user?.lastName}</span>
               
                </div>

              
            </div>

            {/* Prénom Nom */}
            <div className="info-block">
                <div className="info-header">
                    <span className="info-icon"><UserOutlined /></span>
                    <span className="info-label">Prénom Nom</span>
                </div>
                <div className="info-body">
                    <span className="info-value">{user?.firstName} {user?.lastName}</span>
                </div>
            </div>

            {/* Email */}
            <div className="info-block">
                <div className="info-header">
                    <span className="info-icon"><MailOutlined /></span>
                    <span className="info-label">Email</span>
                </div>
                <div className="info-body">
                    <span className="info-value">{user?.email}</span>
                </div>
            </div>

            <div className="info-block">
                <div className="info-header">
                    <span className="info-icon"><LockOutlined /></span>
                    <span className="info-label">Mot de passe</span>
                </div>
                <div className="info-body">
                    <span className="info-value">{'*'.repeat(10)}</span>
                    <Button className="btn-modifier" onClick={() => setModal1Open(true)}>
                        Modifier
                    </Button>
                </div>
            </div>

            <Modal
                title="Vérification de sécurité"
                open={modal1Open}
                onCancel={() => { setModal1Open(false); setOldPassword(''); }}
                footer={[
                    <Button key="cancel" onClick={() => { setModal1Open(false); setOldPassword(''); }}>
                        Annuler
                    </Button>,
                    <Button key="next" type="primary" className="btn-confirmer" onClick={handleVerify}>
                        Suivant
                    </Button>,
                ]}
            >
                <div style={{ marginTop: 16 }}>
                    <p style={{ marginBottom: 8 }}>Veuillez entrer votre ancien mot de passe :</p>
                    <Input.Password
                        placeholder="Ancien mot de passe"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        onPressEnter={handleVerify}
                    />
                </div>
            </Modal>

            <Modal
                title="Modifier le mot de passe"
                open={modal2Open}
                onCancel={() => { setModal2Open(false); setNewPassword(''); setConfirmPassword(''); }}
                footer={[
                    <Button key="cancel" onClick={() => { setModal2Open(false); setNewPassword(''); setConfirmPassword(''); }}>
                        Annuler
                    </Button>,
                    <Button key="save" type="primary" className="btn-confirmer" onClick={handleSave}>
                        Enregistrer
                    </Button>,
                ]}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
                    <Input.Password
                        placeholder="Nouveau mot de passe"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <Input.Password
                        placeholder="Confirmer le mot de passe"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onPressEnter={handleSave}
                    />
                </div>
            </Modal>
        </div>
    );
};

const HistoriqueTab = () => {
    const navigate = useNavigate();
    const [projets, setProjets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchHistorique = async () => {
            try {
                const response = await instance.get('/projects');
                console.log('premier projet:', response.data[0]);
                setProjets(response.data);
            } catch (error) {
                console.error('Erreur chargement historique :', error);
                message.error("Impossible de charger l'historique.");
            } finally {
                setLoading(false);
            }
        };

        fetchHistorique();
    }, []);

    const handleReprendre = (projet) => {
        const fichierCobol = projet.files?.find(f => f.file_type === 'cobol_source');
        const nomFichier = fichierCobol?.file_name ?? projet.name;
        const contenuSource = fichierCobol?.content ?? '';

        console.log("Nom du fichier :", nomFichier);
    console.log("Contenu source (COBOL) :", contenuSource);

        navigate('/convertisseur', {
            state: {
                projectId: projet.id,
                projectName: projet.name,
                fileName: nomFichier,
                sourceContent: contenuSource
            },
        });
    };

    const handleSupprimer = async (projetId) => {
        try {
            await instance.delete(`/projects/${projetId}`);
            setProjets(prev => prev.filter(p => p.id !== projetId));
            message.success('Projet supprimé.');
        } catch (error) {
            console.error('Erreur suppression :', error);
            message.error('Impossible de supprimer le projet.');
        }
    };

    const projetsFiltres = projets.filter(p => {
        const fichierCobol = p.files?.find(f => f.file_type === 'cobol_source');
        const nomFichier = fichierCobol?.file_name ?? p.name;
        return nomFichier.toLowerCase().includes(search.toLowerCase());
    });

    if (loading) {
        return (
            <div className="account-card" style={{ textAlign: 'center', padding: '60px 0' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (projets.length === 0) {
        return (
            <div className="account-card">
                <h2 className="section-title">Vos anciennes traduction</h2>
                <Empty
                    description="Aucune traduction effectuée pour le moment."
                    style={{ padding: '40px 0' }}
                />
            </div>
        );
    }

    return (
        <div className="account-card">

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h2 className="section-title" style={{ margin: 0 }}>Vos anciennes traduction</h2>
                <Input
                    placeholder="Rechercher un projet..."
                    prefix={<SearchOutlined />}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    allowClear
                    style={{ width: 260, marginRight: "6%", border: '1px solid #d9d9d9' }}
                />
            </div>

            {projetsFiltres.length === 0 ? (
                <Empty description={search ? "Aucun projet ne correspond à votre recherche." : "Aucune traduction effectuée pour le moment."} />
            ) : (
                projetsFiltres.map((projet) => {
                    // Nom du fichier COBOL source, sinon fallback sur le nom du projet

                    const fichierCobol = projet.files?.find(f => f.file_type === 'cobol_source');
                    const nomFichier = fichierCobol?.file_name ?? projet.name;
                    const modeFichier = projet.description

                    // Date de référence : last_processed_at > updated_at > created_at
                    const dateRef =
                        projet.last_processed_at ?? projet.updated_at ?? projet.created_at;

                    return (
                        <div className="info-block" key={projet.id} style={{ marginBottom: '16px' }}>
                            <div className="info-header">
                                <span className="info-icon"><HistoryOutlined /></span>
                                <span className="info-label">{timeAgo(dateRef)}</span>
                                <Button
                                    type="text"
                                    danger
                                    icon={<DeleteOutlined />}
                                    size="small"
                                    onClick={() => handleSupprimer(projet.id)}
                                    style={{ marginLeft: 'auto', color: "black" }}
                                />
                            </div>

                            <div className="info-body">

                                <span className="info-value" style={{ marginLeft: "2%" }}>
                                    {modeFichier} : <span style={{ fontStyle: "italic", color: "#008cff" }}>{nomFichier}</span>
                                </span>
                                <Button
                                    className="btn-modifier"
                                    onClick={() => handleReprendre(projet)}
                                    disabled={projet.status === 'processing'}
                                >
                                    <ArrowRightOutlined /> Reprendre à partir de là
                                </Button>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
};

// ─────────────────────────────────────────────
// Page principale
// ─────────────────────────────────────────────

const Parametres = () => {
    const { darkMode } = useOutletContext();
    const [activeTab, setActiveTab] = useState('compte');

    const headerTexts = {
        compte: {
            title: "Mon Compte",
            subtitle: "Votre compte est associé à votre email de votre entreprise, il n’est donc pas possible de changer une partie de vos informations personnelles pour parer tout problème d’intégrité. "
        },
        historique: {
            title: "Historique",
            subtitle: "Vous pourrez trouver ici toutes les traductions que vous avez efféctué. Effectuez des recherches ou ajoutez des filtres pour trouver de manières plus efficaces ce que vous souhaitez. "
        }
    };

    return (
        <div className={`moncompte-page ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            <div className="moncompte-header">
                <h1 className="page-title">{headerTexts[activeTab].title}</h1>
                <p className="page-subtitle">
                    {headerTexts[activeTab].subtitle}
                </p>
            </div>

            <Tabs
                activeKey={activeTab}
                onChange={(key) => setActiveTab(key)}
                className="moncompte-tabs"
            >
                <TabPane tab="Mon compte" key="compte">
                    <MonCompteTab />
                </TabPane>
                <TabPane tab="Historique" key="historique">
                    <HistoriqueTab />
                </TabPane>
            </Tabs>
        </div>
    );
};

export default Parametres;