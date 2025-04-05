import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [message, setMessage] = useState('');

  // Define the expected response structure
  interface LoginResponse {
    token: string;
  }
  
  // Função para realizar login
  const handleLogin = async () => {
    try {
      const response = await axios.post<LoginResponse>('http://localhost:8080/auth/login', {
        email,
        senha
      });
      setToken(response.data.token);
      console.log('Token recebido:', response.data.token);
      setMessage('Login bem-sucedido!');
    } catch (error) {
      setMessage('Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  // Função para realizar logout
  const handleLogout = () => {
    setToken(null);
    setMessage('Você saiu da aplicação.');
  };

  // Função para acessar um endpoint protegido
  const fetchProtectedData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/usuario/listar', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage(`Dados protegidos: ${JSON.stringify(response.data)}`);
    } catch (error) {
      setMessage('Erro ao acessar dados protegidos. Verifique o token.');
    }
  };

  return (
    <div>
      <h1>Autenticação com JWT</h1>
      {!token ? (
        <div>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <div>
          <button onClick={fetchProtectedData}>Acessar Dados Protegidos</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
      <p>{message}</p>
    </div>
  );
}

export default App;
