import { Layout, Typography, Space, Switch, Row, Col, Button, Modal } from 'antd';
import { SunOutlined, MoonOutlined, MailOutlined, GithubOutlined, LinkedinOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
const { Content, Header, Footer } = Layout;
const { Title, Text } = Typography;
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Avatar } from 'antd';

const MainLayout = () => {
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(false);
    const [isPopupOpen, setPopupOpen] = useState(false);
    const { user } = useAuth();

    const getInitials = (firstName, lastName) => {
        return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
    };

    const toggleTheme = (checked) => {
        setDarkMode(checked);
    };

    return (
        <Layout className={`main-layout ${darkMode ? 'dark-mode' : 'light-mode'}`}>

            {/* Header */}
            <Header className="header">
                <div className="header-left">

                    <img src="/src/assets/logo.svg" className="logo" />
                    <img
                        src={"/src/assets/nametag.svg"}
                        alt="Name"
                        className="nametag"
                    />

                    {/* Navigation */}
                    <div className='header-left'>
                        <NavLink
                            to="/"
                            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                        >
                            Accueil
                        </NavLink>
                        <NavLink
                            to="/convertisseur"
                            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                        >
                            Convertisseur
                        </NavLink>
                    </div>
                </div>

                {/* Bouton mode claire/sombre */}
                <Space size="large">
                    <Switch
                        className="custom-switch"
                        unCheckedChildren={<SunOutlined />}
                        checkedChildren={<MoonOutlined />}
                        defaultChecked={false}
                        onChange={toggleTheme}
                        checked={darkMode}
                    />

                    {
                        user?(
                        <Avatar
                            size = { 40}
                            style = {{ backgroundColor: '#08979C', fontSize: '1.2rem', fontFamily: 'Akatab, sans-serif', cursor: 'pointer' }}
                            onClick={() => setPopupOpen(true)}
                        >
                    {getInitials(user.firstName, user.lastName)}
                </Avatar>

                ) : (
                <Button className="btn-primary-custom" onClick={() => navigate('/login')}>
                    Connexion
                </Button>

                    )}
            </Space>

        </Header>

            {/* Content  onClick={() => navigate('/parametres')} */ }
    <Content className='content'>
        <Outlet context={{ darkMode }} /> {/*pour passer l'etat du theme (dark/light mode)*/}
    </Content>

    {/* Footer */ }
            <Footer className='footer'  >
                <Row justify="space-between" align="top" >
                    <Col xs={24} md={9} >
                        <Space direction="vertical" size={0} align="start" style={{ width: '100%' }}>

                            <div className='footer-logo' >
                                <img src="/src/assets/logo.svg" alt="Logo" />
                                <img src={"/src/assets/nametag.svg"} alt="Nametag" style={{ marginBottom: "4%" }} />
                            </div>

                            <Text type="secondary" className='footer-text' style={{ display: 'block', paddingLeft: "15%" }}>
                                ScandCod est un site web permettant de traduire et de comprendre vos codes en langage Cobol.
                            </Text>

                        </Space>
                    </Col>

                    <Col xs={12} md={4}>
                        <Title level={5} style={{ marginBottom: "5%" }}>Navigation</Title>
                        <Space orientation="vertical">
                            <NavLink to="/" style={{ color: 'gray' }}>Accueil</NavLink>
                            <NavLink to="/convertisseur" style={{ color: 'gray' }}>Convertisseur</NavLink>
                        </Space>
                    </Col>

                    <Col xs={12} md={4}>
                        <Title level={5} style={{ marginBottom: "5%" }}>Contact</Title>
                        <Space orientation="vertical">
                            <Space><MailOutlined style={{ color: darkMode ? "#ffffff" : "#000000" }} /><Text>contact@decobol.fr</Text></Space>
                            <Space size="small">
                                <GithubOutlined style={{ color: darkMode ? "#ffffff" : "#000000" }} /><Text>https://github.com/Decobolizator</Text>

                            </Space>

                        </Space>
                    </Col>
                </Row>
            </Footer>
            <Modal
                open={isPopupOpen}
                onCancel={() => setPopupOpen(false)}
                width={210}
                style={{ top: '12%', left: '39%' }}
                footer={[]}
            >

                <Button
                    type="text"
                    icon={<UserOutlined />}
                    style={{ paddingLeft: '0px', paddingBottom: '10%', paddingTop: '15%' }}

                    onClick={() => {
                        navigate('/parametres');
                        setPopupOpen(false);
                    }}
                >
                    Mon compte
                </Button>

                <Button
                    type="text"
                    icon={<LogoutOutlined />}
                    style={{ paddingLeft: '0px', paddingBottom: '0px' }}
                    onClick={() => {
                        navigate('/deconnexion');
                        setPopupOpen(false);
                    }}
                >
                    Se déconnecter
                </Button>
            </Modal>
        </Layout >
    );
};

export default MainLayout;