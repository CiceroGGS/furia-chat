import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");

  const handleSendMessage = () => {
    if (message.trim() !== "" && username.trim() !== "") {
      const messageData = { username, message };
      socket.emit("send_message", messageData);
      setMessage("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/chat")
      .then((response) => response.json())
      .then((data) => {
        setMessages(data);
      })
      .catch((error) => console.error("Erro ao carregar mensagens:", error));

    socket.on("receive_message", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Digite seu nome"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.username}</strong>: {msg.message}
          </div>
        ))}
      </div>

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Digite sua mensagem"
      />
      <button onClick={handleSendMessage}>Enviar</button>
    </div>
  );
}

export default App;
