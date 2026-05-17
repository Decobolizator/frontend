import { Layout, Typography, Space, Switch, Row, Col, Button } from 'antd';
import { SunOutlined, MoonOutlined, MailOutlined, GithubOutlined, LinkedinOutlined } from '@ant-design/icons';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
const { Content, Header, Footer } = Layout;
const { Title, Text } = Typography;
import { useState } from 'react';

const MainLayout = () => {
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(false);

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
                        src={darkMode ? "/src/assets/nametag_sombre.svg" : "/src/assets/nametag_claire.svg"}
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
                    <Button className="btn-primary-custom" onClick={() => navigate('/login')}>
                        Connexion
                    </Button>
                </Space>
            </Header>

            {/* Content */}
            <Content className='content'>
                <Outlet context={{ darkMode }} /> {/*pour passer l'etat du theme (dark/light mode)*/}
            </Content>

            {/* Footer */}
            <Footer className='footer'>
                <Row justify="space-between" align="top">
                    <Col xs={24} md={8}>
                        <Space orientation="vertical" size={0}>

                            {/* Conteneur horizontal pour Logo + NameTag */}
                            <div className='footer-logo'>
                                <img src="/src/assets/logo.svg" alt="Logo" />
                                <img
                                    src={darkMode ? "/src/assets/nametag_sombre.svg" : "/src/assets/nametag_claire.svg"}

                                />
                            </div>



                            <Text type="secondary" className='footer-text'>
                                ScandCod est un site web permettant de traduire et de comprendre vos codes en langage Cobol.
                            </Text>
                        </Space>

                    </Col>

                    <Col xs={12} md={4}>
                        <Title level={5}>Navigation</Title>
                        <Space orientation="vertical">
                            <NavLink to="/" style={{ color: 'gray' }}>Accueil</NavLink>
                            <NavLink to="/convertisseur" style={{ color: 'gray' }}>Convertisseur</NavLink>
                        </Space>
                    </Col>

                    <Col xs={12} md={4}>
                        <Title level={5}>Contact</Title>
                        <Space orientation="vertical">
                            <Space><MailOutlined /><Text>contact@decobol.fr</Text></Space>
                            <Space size="large">
                                <GithubOutlined /><LinkedinOutlined />
                            </Space>
                        </Space>
                    </Col>
                </Row>
            </Footer>
        </Layout>
    );
};

export default MainLayout;