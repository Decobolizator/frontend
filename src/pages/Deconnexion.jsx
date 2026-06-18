import React from 'react';
import { Typography, Button, Space, message } from 'antd';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Erreur403.css';

const { Title, Paragraph } = Typography;

const Deconnexion = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { darkMode } = useOutletContext(); 

    return (
        <div className={`page-wrapper ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            <div className='erreur-wrapper'>
                <img src="/src/assets/deconnexion.svg" alt="Logo" />

                <Title className="erreur-403-title">
                    Autorisation
                </Title>
                <Paragraph className="erreur-403-sub">
                    Êtes-vous sûr de vouloir vous déconnecter ?
                </Paragraph>

                <Space size="middle">
                    <Button
                        className='btn-retour'
                        onClick={() => navigate('/')}
                    >
                        Annuler
                    </Button>
                    <Button
                        type="primary"
                        className='btn-connexion'
                        onClick={() => {
                            navigate('/');                    
                            logout();
                            message.open({
                                type: 'success',
                                icon: null,
                                content: (
                                    <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                        <strong className="toast-title-text" style={{ fontSize: '16px', lineHeight: '24px', fontWeight: 600 }}>
                                            Vous avez été déconnecté avec succès!
                                        </strong>
                                        <span className="toast-sub-text" style={{ fontSize: '14px', marginTop: '4px' }}>
                                            Reconnectez vous pour profiter de plus d’options.
                                        </span>
                                    </div>
                                ),
                                duration: 3,
                                className: `custom-toast-deco ${darkMode ? 'dark-toast' : 'light-toast'}`,
                            });
                        }}
                    >
                        Déconnexion
                    </Button>
                </Space>
            </div>
        </div>
    );
};

export default Deconnexion;