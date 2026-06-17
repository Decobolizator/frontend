import React from 'react';
import { Typography, Button, Space, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Erreur403.css'

const { Title, Paragraph } = Typography;

const Deconnexion = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    return (
        <div className='page-wrapper'>
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
                                        <strong style={{ fontSize: '16px', color: 'rgb(0, 0, 0)', lineHeight: '24px', fontWeight: 600 }}>
                                            Vous avez été déconnecté avec succès!
                                        </strong>
                                        <span style={{ fontSize: '14px', color: 'rgb(0, 0, 0)', marginTop: '4px' }}>
                                            Reconnectez vous pour profiter de plus d’options.
                                        </span>
                                    </div>
                                ),
                                duration: 3,
                                className: 'custom-toast-deco',
                            })

                                ;
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