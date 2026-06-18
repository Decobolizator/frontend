import React from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { useNavigate, useLocation, useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Connexion2.css';
import HttpClient from '../services/HttpClient'

const { Title, Paragraph } = Typography;

const Connexion2 = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [form] = Form.useForm();
    const { login } = useAuth();
    const { darkMode } = useOutletContext();

    const emailUser = location.state?.email;

    const onFinish = async (values) => {
        if (!emailUser) {
            message.error("Session invalide. Veuillez vous identifier à nouveau.");
            return navigate('/login');
        }

        try {
            const response = await HttpClient.post('/auth/verify-2fa', {
                email: emailUser,
                codeValidation: values.codeValidation
            });

            const { token, user } = response.data;
            login(user, token); 

            message.open({
                type: 'success',
                content: (
                    <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                        <strong className="toast-title-text" style={{ fontSize: '16px', fontWeight: 600 }}>
                            Vous êtes connecté !
                        </strong>
                        <span className="toast-sub-text" style={{ fontSize: '14px', marginTop: '4px' }}>
                            Bienvenue {user?.firstName} {user?.lastName}
                        </span>
                    </div>
                ),
                duration: 2,
                className: `custom-toast-right ${darkMode ? 'dark-toast' : 'light-toast'}`,
            });
            
            setTimeout(() => { navigate('/'); }, 1500);

        } catch (error) {
            console.error(error);
            const errorMessage = error.response?.data?.message || "Code incorrect ou expiré.";
            message.error(errorMessage);
        }
    };

    return (
        <div className={`confirmation-page-wrapper ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            <div className="confirmation-white-box">
                <Title level={1} className="confirmation-title">Confirmation</Title>
                <Paragraph className="confirmation-subtitle">
                    Vous allez recevoir un mail avec un code de vérification. Veuillez vérifier votre adresse email associée à votre compte.
                </Paragraph>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    requiredMark={false}
                    className="confirmation-form"
                >
                    <Form.Item
                        label="Code de validation"
                        name="codeValidation"
                        rules={[
                            { required: true, message: 'Veuillez saisir le code' },
                            { len: 6, message: 'Le code doit contenir exactement 6 caractères' }
                        ]}
                    >
                        <Input placeholder="000000" className="confirmation-input" maxLength={6} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="btn-continuer">
                            Continuer
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Connexion2;
