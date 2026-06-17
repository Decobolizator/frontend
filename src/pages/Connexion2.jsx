import React from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Connexion2.css';

const { Title, Paragraph } = Typography;

const Connexion2 = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [form] = Form.useForm();
    const { login } = useAuth();

    // On récupère l'email transmis de manière transparente par la page précédente
    const emailUser = location.state?.email;

    const onFinish = async (values) => {
        if (!emailUser) {
            message.error("Session invalide. Veuillez vous identifier à nouveau.");
            return navigate('/login');
        }

        try {
            // Validation finale sur la route de double authentification
            const response = await axios.post('http://localhost:4000/auth/verify-2fa', {
                email: emailUser,
                codeValidation: values.codeValidation
            });

            const { token, user } = response.data;
            
            // Initialisation globale de la session utilisateur connectée
            login(user, token); 

            message.open({
                type: 'success',
                content: (
                  <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                    <strong style={{ fontSize: '16px', color: 'rgb(0, 0, 0)', fontWeight: 600 }}>
                      Vous êtes connecté !
                    </strong>
                    <span style={{ fontSize: '14px', color: 'rgb(0, 0, 0)', marginTop: '4px' }}>
                      Bienvenue {user?.firstName} {user?.lastName}
                    </span>
                  </div>
                ),
                duration: 2,
                className: 'custom-toast-right',
            });
            
            setTimeout(() => { navigate('/'); }, 1500);

        } catch (error) {
            console.error(error);
            const errorMessage = error.response?.data?.message || "Code incorrect ou expiré.";
            message.error(errorMessage);
        }
    };

    return (
        <div className="confirmation-page-wrapper">
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