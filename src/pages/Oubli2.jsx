import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import './Connexion2.css';

const { Title, Paragraph } = Typography;

const Oubli2 = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const resetId = Number(searchParams.get('id'));
    const resetToken = searchParams.get('token');

    const onFinish = async (values) => {
        if (!resetId || !resetToken) {
            return message.error("Le lien de réinitialisation est invalide ou incomplet.");
        }

        setLoading(true);
        try {
            await axios.post('http://localhost:4000/auth/password/reset', {
                resetId: resetId,
                resetToken: resetToken,
                newPassword: values.password
            });

            message.success("Votre mot de passe a été modifié avec succès !");
            setTimeout(() => navigate('/login'), 2000);

        } catch (error) {
            console.error(error);
            const errorMsg = error.response?.data?.message || "Le jeton a expiré ou est invalide.";
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="confirmation-page-wrapper">
            <div className="confirmation-white-box" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                <div style={{ width: '100%', textAlign: 'left', marginBottom: '16px', marginTop: '-8px' }}>
                    <Title level={1} className="confirmation-title" style={{ textAlign: 'left', margin: 0, paddingBottom: '8px' }}>
                        Réinitialisation
                    </Title>
                    <Paragraph className="confirmation-subtitle" style={{ textAlign: 'left', margin: 0, color: 'rgba(0, 0, 0, 0.45)' }}>
                        Veuillez choisir votre nouveau mot de passe. Il doit contenir au moins 8 caractères, une lettre majuscule, une lettre minuscule et un chiffre.
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
                        label="Nouveau mot de passe"
                        name="password"
                        rules={[
                            { required: true, message: 'Veuillez saisir votre nouveau mot de passe' },
                            { min: 8, message: 'Le mot de passe doit contenir au moins 8 caractères' },
                            {
                                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                                message: 'Le mot de passe doit contenir une majuscule, une minuscule et un chiffre'
                            }
                        ]}
                    >
                        <Input.Password 
                            prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)', marginRight: '4px' }} />}
                            placeholder="••••••••" 
                            className="confirmation-input" 
                            disabled={loading}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Confirmer le nouveau mot de passe"
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Veuillez confirmer votre mot de passe' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Les deux mots de passe ne correspondent pas'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password 
                            prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)', marginRight: '4px' }} />}
                            placeholder="••••••••" 
                            className="confirmation-input" 
                            disabled={loading}
                        />
                    </Form.Item>

                    <Form.Item style={{ marginTop: '24px', marginBottom: 0 }}>
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            className="btn-continuer" 
                            style={{ width: '100%' }}
                            loading={loading}
                        >
                            Continuer
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Oubli2;
