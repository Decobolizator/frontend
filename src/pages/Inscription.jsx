import { Form, Input, Button, Layout, Typography, Space, Switch, Row, Col } from 'antd'; // Ajout de Row et Col ici
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
const { Title, Paragraph } = Typography;
import { useOutletContext } from 'react-router-dom';
import './Inscription.css'

const Inscription = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const { darkMode } = useOutletContext();
    const [emailError, setEmailError] = useState('');
    const onFinish = async (values) => {
        try {

            const FullName = values.Fullname.trim().split(' ');
            const firstName = FullName[0] || '';
            const lastName = FullName.slice(1).join(' ') || '';

            const user = {
                email: values.Email,
                password: values.Password,
                firstName: firstName,
                lastName: lastName,
            };

            const response = await axios.post('http://localhost:4000/auth/register', user);

            console.log('Inscription réussie !', response.data);
            navigate('/login'); // Redirige vers la page de connexion après succès
        } catch (error) {
            if (error.response?.status === 409) {
                form.setFields([
                    {
                        name: 'Email',
                        errors: ['Cette adresse email est déjà utilisée.'],
                    },
                ]);
            } else {
                console.error("Erreur lors de l'inscription:", error.response?.data || error.message);
            }
        }
    };

    return (
        <div className={`content-wrapper ${darkMode ? 'dark-mode' : 'light-mode'}`}>

            {/* Section Gauche */}
            <div className='left-section'>

                {/* Titre */}
                <Title className='left-title'>BIENVENUE !</Title>

                {/* Text explicatif */}
                <Paragraph className='left-text'>
                    ScanCod est une site web permettant de traduire et de comprendre vos codes en langage Cobol.
                </Paragraph>

                {/* Connexion */}
                <div style={{ marginTop: '1rem' }}>
                    <Paragraph className='left-subtext'>
                        Vous avez déjà un compte ? Cliquez ci-dessous pour continuer à utiliser le service.
                    </Paragraph>
                    <Button ghost size="large" className='btn-ghost-custom' onClick={() => navigate('/login')}>
                        Connexion
                    </Button>
                </div>

                {/* Triceratops */}
                <img src="/src/assets/triceratops.svg" alt="Dino" className='dino' />
            </div>

            {/* Section droite (inscription) */}
            <div className='right-section'>
                <div className='form-container'>
                    <Title level={2} className='form-title'>
                        Inscription
                    </Title>
                    <Paragraph className='paragraph'>
                        Veuillez compléter vos informations personnelles puis attendre une confirmation par email.
                    </Paragraph>

                    {/* Form */}
                    <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false} className="custom-form">
                        <Form.Item label="Email" name="Email" rules={[{ required: true, type: 'email' }]}>
                            <Input placeholder="alice.martin@example.fr" />
                        </Form.Item>

                        <Form.Item label="Prénom Nom" name="Fullname" rules={[{ required: true }]}>
                            <Input placeholder="Alice Martin" />
                        </Form.Item>

                        <Form.Item label="Mot de passe" name="Password"
                            rules={[
                                { required: true, message: 'Veuillez saisir un mot de passe' },

                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value) {
                                            return Promise.resolve();
                                        }

                                        if (value.length < 8) {
                                            return Promise.reject(
                                                new Error('Le mot de passe doit contenir au minimum 8 caractères, avec au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial. Pour des raisons de sécurité, il ne doit pas contenir votre prénom ni votre nom.')
                                            );
                                        }


                                        // 1. Vérification des critères de caractères
                                        const hasUppercase = /[A-Z]/.test(value);
                                        const hasLowercase = /[a-z]/.test(value);
                                        const hasNumber = /[0-9]/.test(value);
                                        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_+\-=\[\]\\\/]/.test(value);

                                        if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar) {
                                            return Promise.reject(
                                                new Error('Le mot de passe doit contenir au minimum 8 caractères, avec au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial. Pour des raisons de sécurité, il ne doit pas contenir votre prénom ni votre nom.')
                                            );
                                        }

                                        // 2. Vérification de l'exclusion du Prénom / Nom
                                        const completName = getFieldValue('Fullname') || '';
                                        const parts = completName.trim().split(' ');
                                        const firstname = parts[0]?.toLowerCase() || '';
                                        const lastname = parts.slice(1).join(' ')?.toLowerCase() || '';
                                        const passwordLower = value.toLowerCase();

                                        // On ne bloque que si l'utilisateur a tapé quelque chose dans le nom ET que c'est dans le mdp
                                        if (firstname && firstname.length > 2 && passwordLower.includes(firstname)) {
                                            return Promise.reject(new Error('Pour des raisons de sécurité, le mot de passe ne doit pas contenir votre prénom.'));
                                        }
                                        if (lastname && lastname.length > 2 && passwordLower.includes(lastname)) {
                                            return Promise.reject(new Error('Pour des raisons de sécurité, le mot de passe ne doit pas contenir votre nom.'));
                                        }

                                        return Promise.resolve();
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="Exemple@2Mdp" />
                        </Form.Item>

                        <Form.Item
                            label="Confirmer le mot de passe"
                            name="Confirm Password"
                            dependencies={['password']}
                            rules={[
                                { required: true },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('Password') === value) return Promise.resolve();
                                        return Promise.reject(new Error('Les mots de passe ne correspondent pas'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="Example2mdp" />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className='btn-submit'>
                                Confirmer
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>

        </div>

    );
};

export default Inscription;