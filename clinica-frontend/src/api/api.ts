import axios from 'axios';

// Criando uma instância personalizada
const api = axios.create({
  baseURL: 'http://localhost:3000',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tokenAcesso');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Adicionando um interceptor de resposta
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status == 401 && error.response.data.error == "expired token") {
        const tokenRefresh = localStorage.getItem("tokenRefresh")
        const response = await api.get(`/renovar-token?token=${tokenRefresh}`)
        const novoToken= response.data.data.tokenAcesso
        localStorage.setItem("tokenAcesso", novoToken)
        error.config.headers.Authorization = `Bearer ${novoToken}`;
        return axios(error.config);
    }
    localStorage.clear()
    return Promise.reject(error);
  }
);

export default api;