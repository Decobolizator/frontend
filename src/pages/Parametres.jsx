import { useState } from 'react';
import { Tabs, Avatar, Button, Input, Modal, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, UploadOutlined, HistoryOutlined } from '@ant-design/icons';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Parametres.css';

const { TabPane } = Tabs;

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
            return message.error("Les mots de passe ne correspondent pas");
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

            <div className="profile-photo-row">
                <Avatar
                    size={56}
                    src={user?.photoProfil || undefined}
                    style={{ backgroundColor: '#08979C', fontSize: '1.2rem', fontFamily: 'Akatab, sans-serif' }}
                >
                    {!user?.photoProfil && `${user?.firstName?.charAt(0).toUpperCase()}${user?.lastName?.charAt(0).toUpperCase()}`}
                </Avatar>

                <div className="photo-info">
                    <span className="photo-label">Photo de profil</span>
                    <span className="photo-hint">La photo aide vos collègues à vous reconnaître.</span>
                </div>
                <input type="file" id="upload-photo" style={{ display: 'none' }} accept="image/*" />

                <Button
                    icon={<UploadOutlined />}
                    className="btn-importer"
                    onClick={() => document.getElementById('upload-photo').click()}
                >
                    Importer
                </Button>
            </div>

            <div className="info-block">
                <div className="info-header">
                    <span className="info-icon"><UserOutlined /></span>
                    <span className="info-label">Prénom Nom</span>
                </div>
                <div className="info-body">
                    <span className="info-value">{user?.firstName} {user?.lastName}</span>
                </div>
            </div>

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
                    <span className="info-value">{"*".repeat(10)}</span>
                    <Button className="btn-modifier" onClick={() => setModal1Open(true)}>Modifier</Button>
                </div>
            </div>

            <div className="confirm-row">
                <Button type="primary" className="btn-confirmer">
                    Confirmer
                </Button>
            </div>

            <Modal
                title="Vérification de sécurité"
                open={modal1Open}
                onCancel={() => setModal1Open(false)}
                footer={[
                    <Button key="cancel" onClick={() => setModal1Open(false)}>Annuler</Button>,
                    <Button key="next" type="primary" className="btn-confirmer" onClick={handleVerify}>
                        Suivant
                    </Button>,
                ]}
            >
                <div style={{ marginTop: 16 }}>
                    <p style={{ marginBottom: 8 }}>Veuillez entrer votre ancien mot de passe :</p>
                    <Input.Password placeholder="Ancien mot de passe" value={oldPassword} onChange={e => setOldPassword(e.target.value)} />
                </div>
            </Modal>

            <Modal
                title="Modifier le mot de passe"
                open={modal2Open}
                onCancel={() => setModal2Open(false)}
                footer={[
                    <Button key="cancel" onClick={() => setModal2Open(false)}>Annuler</Button>,
                    <Button key="save" type="primary" className="btn-confirmer" onClick={handleSave}>
                        Enregistrer
                    </Button>,
                ]}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
                    <Input.Password
                        placeholder="Nouveau mot de passe"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                    />
                    <Input.Password
                        placeholder="Confirmer le mot de passe"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                    />
                </div>
            </Modal>
        </div>
    );
};

const HistoriqueTab = () => {
    return (
        <div className="account-card">
            <h2 className="section-title">Historique</h2>
            {Array.from({ length: 5 }).map((_, index) => (
                <div className="info-block" key={index} style={{ marginBottom: '16px' }}>
                    <div className="info-header">
                        <span className="info-icon"><HistoryOutlined /></span>
                        <span className="info-label">Il y a 27 minutes</span>
                    </div>
                    <div className="info-body">
                        <span className="info-value">exemple_code</span>
                        <Button className="btn-modifier">Reprendre à partir de là</Button>
                    </div>
                </div>
            ))}
        </div>
    );
};

const Parametres = () => {
    const { darkMode } = useOutletContext();
    return (
        <div className={`moncompte-page ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            <div className="moncompte-header">
                <h1 className="page-title">Mon Compte</h1>
                <p className="page-subtitle">
                    Votre compte est associé à votre email de votre entreprise, il n'est donc pas possible
                    de changer une partie de vos informations personnelles pour parer tout problème d'intégrité.
                </p>
            </div>

            <Tabs defaultActiveKey="compte" className="moncompte-tabs">
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