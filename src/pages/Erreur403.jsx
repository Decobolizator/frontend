import React from 'react';
import { Typography, Button, Space } from 'antd';
import { useNavigate, useOutletContext } from 'react-router-dom';

import './Erreur403.css'

const { Title, Paragraph } = Typography;

const Erreur403 = () => {
    const navigate = useNavigate();
    const { darkMode } = useOutletContext(); 

    return (
        <div className={`page-wrapper ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            <div className='erreur-wrapper'>
                <img src="/src/assets/erreur403.svg" alt="Logo"/>

                <Title className="erreur-403-title">
                    403
                </Title>
                <Paragraph className="erreur-403-sub">
                    Désolé, vous n'avez pas le droit d'accéder à cette page.
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
                        onClick={() => navigate('/login')}
                    >
                        Connexion
                    </Button>
                </Space>
            </div>
        </div>
    );
};

export default Erreur403;