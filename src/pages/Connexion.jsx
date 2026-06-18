import { useNavigate, useOutletContext } from 'react-router-dom';
import { Form, Input, Button, Typography, message } from 'antd';
import axios from 'axios';
import triceratops from '../assets/triceratops.svg';
import './Connexion.css';
import HttpClient from '../services/HttpClient'

const { Title, Paragraph } = Typography;

const Connexion = () => {
  const navigate = useNavigate();
  const { darkMode } = useOutletContext();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const response = await HttpClient.post('/auth/login', {
        email: values.email,
        password: values.password
      });

      if (response.data.status === '2FA_REQUIRED') {
        message.success("Identifiants validés. Code de vérification envoyé par email.");
        
        // Redirection vers la page de confirmation en passant l'email dans le state
        setTimeout(() => { 
          navigate('/connexion2', { state: { email: values.email } }); 
        }, 1200);
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || "Identifiants invalides.";
      message.error(errorMessage);
    }
  };

  return (
    <div className={`login-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="form-section">
        <div className="form-content">
          <Title level={1} className="main-title">Votre compte</Title>
          <Paragraph className="subtitle">
            Veuillez entrer votre mot de passe afin d’accéder à votre compte personnel.
          </Paragraph>

          <Form form={form} layout="vertical" className="custom-form" onFinish={onFinish}>
            <Form.Item 
              label="Email" 
              name="email" 
              rules={[{ required: true, type: 'email', message: 'Veuillez entrer un email valide' }]}
            >
              <Input placeholder="alice.martin@example.fr" />
            </Form.Item>

            <Form.Item
              label="Mot de passe"
              name="password"
              rules={[{ required: true, message: 'Veuillez entrer votre mot de passe' }]}
              extra={<a href="/forgot-password" className="forgot-link">Mot de passe oublié ?</a>}
            >
              <Input.Password placeholder="******" />
            </Form.Item>

            <Button type="primary" htmlType="submit" className="btn-valider">
              Valider
            </Button>
          </Form>

          <div className="signup-footer">
            <Paragraph className="inscription" style={{ marginBottom: "0px" }}>Vous n’avez pas de compte ?</Paragraph>
            <Paragraph className="inscription">Cliquez ci-dessous pour vous inscrire.</Paragraph>
            <Button className="btn-inscription" onClick={() => navigate('/inscription')}>Inscription</Button>
          </div>
        </div>
      </div>

      <div className="design-section">
        <div className="curve-overlay"></div>
        <div className="main-curve-content">
          <img src={triceratops} alt="Dino" className='dino_co' />
        </div>
      </div>
    </div>
  );
};

export default Connexion;
