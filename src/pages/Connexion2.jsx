import React from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import './Connexion2.css';

const { Title, Paragraph } = Typography;

const Connexion2 = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log('Code soumis :', values.codeValidation);
        message.success('Code validé avec succès !');
    };

    return (
        <div className="confirmation-page-wrapper">
            <div className="confirmation-white-box">
                
                {/* En-tête */}
                <Title level={1} className="confirmation-title">
                    Confirmation
                </Title>
                <Paragraph className="confirmation-subtitle">
                    Vous allez recevoir un mail avec un code de vérification. Veuillez vérifier votre adresse email associée à votre compte.
                </Paragraph>

                {/* Formulaire */}
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
                        <Input 
                            placeholder="000000" 
                            className="confirmation-input"
                            maxLength={6}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            className="btn-continuer"
                        >
                            Continuer
                        </Button>
                    </Form.Item>
                </Form>

            </div>
        </div>
    );
};

export default Connexion2;