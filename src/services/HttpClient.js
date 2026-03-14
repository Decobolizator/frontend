import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8000/', // URL de l'API
  headers: {
   // 'Authorization': 'Bearer your_token_here', // pour authentification
    'Content-Type': 'application/json', 
  },
});

export default instance;