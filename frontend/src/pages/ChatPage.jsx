import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import Message from "../components/Message";
import {
  ChatContainer,
  Header,
  LiveMatchPanel,
  CheerBanner,
  MessageList,
  InputContainer,
  MessageInput,
  SendButton,
  CheerButton,
} from "../styles/ChatStyle";

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [cheerCount, setCheerCount] = useState(0);
  const [lastCheerUser, setLastCheerUser] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const socket = useRef(null);
  const endRef = useRef(null);
  const authToken = localStorage.getItem("authToken"); // Obtenha o token do localStorage
  const localUsername = localStorage.getItem("username"); // Recupere o username

  useEffect(() => {
    if (authToken) {
      socket.current = io("http://localhost:5000", {
        auth: {
          token: authToken,
        },
      });

      socket.current.on("connect", () =>
        console.log("Conectado ao servidor Socket.IO")
      );
      socket.current.on("disconnect", () =>
        console.log("Desconectado do servidor Socket.IO")
      );
      socket.current.on("initial_messages", (msgs) => setMessages(msgs || []));
      socket.current.on("new_message", (m) =>
        setMessages((prev) => [...prev, m])
      );
      socket.current.on("cheer_update", (d) => {
        setCheerCount(d.count);
        setLastCheerUser(d.user);
      });

      return () => socket.current.disconnect();
    } else {
      console.log("Token de autenticação não encontrado.");
      // Lógica para lidar com usuário não autenticado (redirecionar para login, exibir mensagem, etc.)
    }
  }, [authToken]); // Re-executa se o authToken mudar

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, cheerCount]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMsg.trim() || !socket.current?.connected) return;

    socket.current.emit("send_message", {
      message: newMsg,
      parentMessageId: replyingTo,
    });

    setNewMsg("");
    setReplyingTo(null);
  };

  const handleCheer = () => {
    if (socket.current?.connected && authToken) {
      socket.current.emit("send_cheer", {}); // O backend agora deve identificar o usuário pelo token
    } else {
      console.log(
        "Usuário não autenticado ou não conectado para enviar cheer."
      );
      // Lógica para informar o usuário que ele precisa estar logado
    }
  };

  const handleReply = (messageId) => {
    const messageToReply = messages.find((m) => m._id === messageId);
    setReplyingTo(messageId);
    setNewMsg(`@${messageToReply.username} `);
  };

  return (
    <ChatContainer>
      <Header>FURIA CHAT</Header>

      <LiveMatchPanel>
        {/* conteúdo ou componentes do painel ao vivo */}
      </LiveMatchPanel>

      {cheerCount > 0 && (
        <CheerBanner>
          🔥 {cheerCount} gritos! ({lastCheerUser})
        </CheerBanner>
      )}

      <MessageList>
        {messages
          ?.filter((msg) => msg)
          .map((m) => (
            <Message
              key={m._id}
              message={{
                ...m,
                parentMessagePreview: m.parentMessageId
                  ? (() => {
                      const parentMsg = messages.find(
                        (msg) => msg._id === m.parentMessageId
                      );
                      return parentMsg
                        ? {
                            username: parentMsg.username,
                            message: parentMsg.message,
                          }
                        : null;
                    })()
                  : null,
              }}
              currentUser={localUsername}
              onEdit={(id, content) => {
                socket.current.emit("edit_message", { id, content });
              }}
              onDelete={(id) => {
                socket.current.emit("delete_message", { id });
              }}
              onReact={(id, emoji) => {
                socket.current.emit("react_message", { id, emoji });
              }}
              onReply={handleReply}
            />
          ))}
        <div ref={endRef} />
      </MessageList>

      <InputContainer onSubmit={handleSend}>
        {replyingTo && (
          <div
            style={{
              background: "rgba(255,85,0,0.1)",
              padding: "8px",
              borderRadius: "4px",
              marginBottom: "8px",
              fontSize: "0.9rem",
            }}
          >
            Respondendo a:{" "}
            {messages
              .find((m) => m._id === replyingTo)
              ?.message.substring(0, 30)}
            ...
            <button
              onClick={() => setReplyingTo(null)}
              style={{
                background: "none",
                border: "none",
                color: "#ff5500",
                marginLeft: "8px",
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>
        )}
        <MessageInput
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Envie uma mensagem..."
        />
        <CheerButton onClick={handleCheer} type="button">
          🔥
        </CheerButton>
        <SendButton
          type="submit"
          disabled={!socket.current?.connected || !authToken}
        >
          ENVIAR
        </SendButton>
      </InputContainer>
      {!authToken && (
        <div style={{ textAlign: "center", padding: "1rem", color: "gray" }}>
          Você precisa estar logado para participar do chat.
        </div>
      )}
    </ChatContainer>
  );
}

export default ChatPage;
