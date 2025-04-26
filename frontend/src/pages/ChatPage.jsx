import { useState } from "react";

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  function handleSendMessage(e) {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setMessages([...messages, newMessage]);
    setNewMessage("");
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1>Fúria Chat</h1>

      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          minHeight: "300px",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: "8px" }}>
            {msg}
          </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage} style={{ display: "flex" }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Digite sua mensagem..."
          style={{ flex: 1, padding: "10px" }}
        />
        <button type="submit" style={{ padding: "10px 20px" }}>
          Enviar
        </button>
      </form>
    </div>
  );
}

export default ChatPage;
