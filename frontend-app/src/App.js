import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [status, setStatus] = useState('Cargando conexión...');
  const [statusClassName, setStatusClassName] = useState('');
  const [message, setMessage] = useState('');
  const [sentMessage, setSentMessage] = useState('');

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        await axios.get('http://localhost:8080/api/v1/chat/dashboard');
        setStatus('¡Conectado correctamente!');
        setStatusClassName('success');
      } catch (error) {
        console.error("Error conectando al BFF", error);
        setStatus('Error: No se pudo conectar con el servidor.');
        setStatusClassName('error');
      }
    };

    cargarDatos();
  }, []);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      enviarMensaje();
    }
  };

  const enviarMensaje = async () => {
    if (!message) return;

    try {
      await axios.post('http://localhost:8080/api/v1/chat/send', {
        userId: 1, // id de usuario (pruebas)
        text: message
      });
      
      setMessage(''); 
      setSentMessage('Mensaje enviado con éxito');
      setTimeout(() => setSentMessage(''), 3000); // Ocultar el mensaje después de 3 segundos
    } catch (error) {
      console.error("Error al enviar", error);
      setSentMessage('Error al enviar el mensaje');
      setTimeout(() => setSentMessage(''), 3000);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Wasap-2</h1>
        <p className={statusClassName}>{status}</p>
        
        <div className="chat-container">
          <div className="input-container">
            <input 
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe un mensaje..."
            />
            <button onClick={enviarMensaje}>Enviar</button>
          </div>
          {sentMessage && <p className="sent-message-success">{sentMessage}</p>}
        </div>
      </header>
    </div>
  );
}

export default App;
