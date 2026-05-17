import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, Switch } from 'antd';
import './Connexion.css';
import { useOutletContext } from 'react-router-dom';
const { Title, Paragraph } = Typography;

const Connexion = () => {
  const navigate = useNavigate();
  const { darkMode } = useOutletContext();
  const [form] = Form.useForm();

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
          >
            <Form.Item label="Email" name="email">
              <Input placeholder="alice.martin@example.fr" />
            </Form.Item>

            <Form.Item 
              label="Mot de passe" 
              name="password"
              extra={<a href="#" className="forgot-link">Mot de passe oublié ?</a>}
            >
              <Input.Password placeholder="example" />
            </Form.Item>

            <Button type="primary" className="btn-valider">
              Valider
            </Button>
          </Form>

          {/* partie inscription */}
          <div className="signup-footer">
            <Paragraph className = "inscription"style={{marginBottom: "0px"}}>Vous n’avez pas de compte ?</Paragraph>
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