import { Form, Input, Button, Layout, Typography, Space, Switch, Row, Col } from 'antd'; // Ajout de Row et Col ici
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const { Title, Paragraph } = Typography;
import { useOutletContext } from 'react-router-dom';
import './Inscription.css'

const Inscription = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const { darkMode } = useOutletContext();
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
            console.error("Erreur lors de l'inscription:", error.response?.data || error.message);
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

                        <Form.Item label="Mot de passe" name="Password" rules={[
                            { required: true },
                            { min: 8, message: 'Le mot de passe doit contenir au moins 8 caractères' }
                        ]}>
                            <Input.Password placeholder="example2mdp" />
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
                            <Input.Password placeholder="example2mdp" />
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