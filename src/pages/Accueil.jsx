import { useEffect } from "react"
import instance from "../services/HttpClient"
import React from 'react';
import { Button, Layout, Typography, Space, Switch } from 'antd'; // Ajout de Row et Col ici
import { SunOutlined, MoonOutlined, MailOutlined, GithubOutlined, LinkedinOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';
const { Header, Content} = Layout;

function Accueil() {
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await instance.get("/test")  // endpoint test
        console.log(response.data)  // reponse API dans console
      } catch (error) {
        console.error("Erreur API :", error) //erreur dans console
      }
    }

    fetchData()
  }, [])

    return (
        <></>
    )
}

export default Accueil