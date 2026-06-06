import React from 'react';
import { Typography, Button, Space } from 'antd';
import { useNavigate } from 'react-router-dom';

import './Erreur403.css'

const { Title, Paragraph } = Typography;

const Deconnexion = () => {
    const navigate = useNavigate();

    return (
        <div className='page-wrapper'>
            <div className='erreur-wrapper'>
                <img src="/src/assets/deconnexion.svg" alt="Logo"/>

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
                        onClick={() => navigate('/')}
                    >
                        Déconnexion
                    </Button>
                </Space>
            </div>
        </div>
    );
};

export default Deconnexion;