import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, Switch } from 'antd';
import './Connexion.css';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { message } from 'antd';
const { Title, Paragraph } = Typography;

const Connexion = () => {
  const navigate = useNavigate();
  const { darkMode } = useOutletContext();
  const [form] = Form.useForm();

  const { login } = useAuth();
  const onFinish = async (values) => {
    try {
      const response = await axios.post('http://localhost:4000/auth/login', values);
      const { token, user } = response.data;
      login(user, token); //stocker les données du user pour qu'il soit connecté
      message.open({
        type: 'success',
        content: (
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
            <strong style={{ fontSize: '16px', color: 'rgb(0, 0, 0)', lineHeight: '24px', fontWeight: 600 }}>
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
      setTimeout(() => { navigate('/'); }, 1500); //on redirige après 1.5 s en cas de réussite de connexion 

    } catch (error) {
      console.error("Détail de l'erreur :", error);
      const errorMessage = error.response?.data?.message || "Une erreur est survenue lors de la connexion.";
      message.error(errorMessage);
    }
  };

  return (
    <div className={`login-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      {/* SECTION GAUCHE : Formulaire */}
      <div className="form-section">
        <div className="form-content">
          <Title level={1} className="main-title">Votre compte</Title>
          <Paragraph className="subtitle">
            Veuillez entrer votre mot de passe afin d’accéder à votre compte personnel.
          </Paragraph>

          <Form
            form={form}
            layout="vertical"
            className="custom-form"
            onFinish={onFinish}
          >
            <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Veuillez entrer un email valide' }]}>
              <Input placeholder="alice.martin@example.fr" />
            </Form.Item>

            <Form.Item
              label="Mot de passe"
              name="password"
              rules={[{ required: true, message: 'Veuillez entrer votre mot de passe' }]}
              extra={<a href="#" className="forgot-link">Mot de passe oublié ?</a>}
            >
              <Input.Password placeholder="example" />
            </Form.Item>

            <Button type="primary" htmlType="submit" className="btn-valider">
              Valider
            </Button>
          </Form>

          {/* partie inscription */}
          <div className="signup-footer">
            <Paragraph className="inscription" style={{ marginBottom: "0px" }}>Vous n’avez pas de compte ?</Paragraph>
            <Paragraph className="inscription"  >Cliquez ci-dessous pour vous inscrire.</Paragraph>
            <Button className="btn-inscription" onClick={() => navigate('/inscription')}>Inscription</Button>
          </div>
        </div>
      </div>


      {/* Section droite dino */}
      <div className="design-section">
        {/* Le bleu clair */}
        <div className="curve-overlay"></div>

        {/* Le le bleu foncé devant */}
        <div className="main-curve-content">
          <img src="/src/assets/triceratops.svg" alt="Dino" className='dino_co' />
        </div>
      </div>


    </div>
  );
};

export default Connexion;