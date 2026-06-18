import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { MailOutlined } from '@ant-design/icons';
import axios from 'axios';
import './Connexion2.css';
import HttpClient from '../services/HttpClient'

const { Title, Paragraph } = Typography;

const Oubli = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { darkMode } = useOutletContext();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await HttpClient.post('/auth/password/forgot', {
                email: values.email
            });
            message.success(response.data.message || "Lien de réinitialisation envoyé !");
        } catch (error) {
            console.error(error);
            message.error("Une erreur est survenue lors de la demande.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`confirmation-page-wrapper ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            <div className="confirmation-white-box" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                <div style={{ width: '100%', textAlign: 'left', marginBottom: '16px', marginTop: '-8px' }}>
                    <Title level={1} className="confirmation-title" style={{ textAlign: 'left', margin: 0, paddingBottom: '8px' }}>
                        Réinitialisation
                    </Title>
                    <Paragraph className="confirmation-subtitle" style={{ textAlign: 'left', margin: 0 }}>
                        Entrez votre adresse mail associée à votre compte pour recevoir un lien de réinitialisation de votre mot de passe.
                    </Paragraph>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    requiredMark={false}
                    className="confirmation-form"
                    style={{ width: '100%' }}
                >
                    <Form.Item
                        label="Adresse email"
                        name="email"
                        rules={[
                            { required: true, message: 'Veuillez saisir votre adresse email' },
                            { type: 'email', message: 'Veuillez saisir une adresse email valide' }
                        ]}
                    >
                        <Input 
                            prefix={<MailOutlined className="input-icon" style={{ marginRight: '4px' }} />}
                            placeholder="exemple@entreprise.fr" 
                            className="confirmation-input" 
                            disabled={loading}
                        />
                    </Form.Item>

                    <Form.Item style={{ marginTop: '24px', marginBottom: 0 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', width: '100%' }}>
                            <Button 
                                type="default"
                                onClick={() => navigate('/login')}
                                className="btn-annuler"
                                disabled={loading}
                            >
                                Annuler
                            </Button>

                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                className="btn-continuer"
                                loading={loading}
                            >
                                Continuer
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Oubli;
