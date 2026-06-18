import { Layout, Typography, Space, Switch, Row, Col, Button, Dropdown } from 'antd';
import { SunOutlined, MoonOutlined, MailOutlined, GithubOutlined, UserOutlined, PoweroffOutlined } from '@ant-design/icons';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
const { Content, Header, Footer } = Layout;
const { Title, Text } = Typography;
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Avatar } from 'antd';
import logo from '../assets/logo.svg';
import nametag from '../assets/nametag.svg';
import './MainLayout.css';

const MainLayout = () => {
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(false);
    const { user } = useAuth();

    const getInitials = (firstName, lastName) => {
        return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
    };

    const toggleTheme = (checked) => {
        setDarkMode(checked);
    };

    const menuItems = [
        {
            key: 'account',
            label: 'Mon compte',
            icon: <UserOutlined style={{ fontSize: '16px' }} />,
            onClick: () => navigate('/parametres'),
            style: { padding: '10px 16px' }
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            label: 'Se déconnecter',
            icon: <PoweroffOutlined style={{ fontSize: '16px' }} />,
            danger: true,
            onClick: () => navigate('/deconnexion'),
            style: { padding: '10px 16px' }
        },
    ];

    return (
        <Layout className={`main-layout ${darkMode ? 'dark-mode' : 'light-mode'}`}>

            {/* Header */}
            <Header className="header">
                <div className="header-left">
                    <img src={logo} className="logo" alt="Logo" />
                    <img
                        src={nametag}
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

                {/* Bouton mode clair/sombre */}
                <Space size="large">
                    <Switch
                        className="custom-switch"
                        unCheckedChildren={<SunOutlined />}
                        checkedChildren={<MoonOutlined />}
                        defaultChecked={false}
                        onChange={toggleTheme}
                        checked={darkMode}
                    />

                    {user ? (
                        <Dropdown 
                            menu={{ items: menuItems }} 
                            trigger={['click']} 
                            placement="bottomRight"
                            overlayClassName="custom-profile-dropdown"
                        >
                            <Avatar
                                size={40}
                                style={{ 
                                    backgroundColor: '#08979C', 
                                    fontSize: '1.2rem', 
                                    fontFamily: 'Akatab, sans-serif', 
                                    cursor: 'pointer' 
                                }}
                            >
                                {getInitials(user.firstName, user.lastName)}
                            </Avatar>
                        </Dropdown>
                    ) : (
                        <Button className="btn-primary-custom" onClick={() => navigate('/login')}>
                            Connexion
                        </Button>
                    )}
                </Space>
            </Header>

            {/* Content */}
            <Content className='content'>
                <Outlet context={{ darkMode }} />
            </Content>

            {/* Footer */}
            <Footer className='footer'>
                <Row justify="space-between" align="top">
                    <Col xs={24} md={9}>
                        <Space direction="vertical" size={0} align="start" style={{ width: '100%' }}>
                            <div className='footer-logo'>
                                <img src={logo} alt="Logo" />
                                <img src={nametag} alt="Nametag" style={{ marginBottom: "4%" }} />
                            </div>
                            <Text type="secondary" className='footer-text' style={{ display: 'block', paddingLeft: "15%" }}>
                                ScandCod est un site web permettant de traduire et de comprendre vos codes en langage Cobol.
                            </Text>
                        </Space>
                    </Col>

                    <Col xs={12} md={4}>
                        <Title level={5} style={{ marginBottom: "5%" }}>Navigation</Title>
                        <Space direction="vertical">
                            <NavLink to="/" style={{ color: 'gray' }}>Accueil</NavLink>
                            <NavLink to="/convertisseur" style={{ color: 'gray' }}>Convertisseur</NavLink>
                        </Space>
                    </Col>

                    <Col xs={12} md={4}>
                        <Title level={5} style={{ marginBottom: "5%" }}>Contact</Title>
                        <Space direction="vertical">
                            <Space><MailOutlined style={{ color: darkMode ? "#ffffff" : "#000000" }} /><Text>contact@decobol.fr</Text></Space>
                            <Space size="small">
                                <GithubOutlined style={{ color: darkMode ? "#ffffff" : "#000000" }} /><Text>https://github.com/Decobolizator</Text>
                            </Space>
                        </Space>
                    </Col>
                </Row>
            </Footer>
        </Layout>
    );
};

export default MainLayout;