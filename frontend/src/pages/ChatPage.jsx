// src/pages/ChatPage.jsx
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import {
  ChatContainer,
  Header,
  LiveMatchPanel,
  MatchTitle,
  MatchScore,
  MatchStats,
  CheerBanner,
  MessageList,
  Message,
  MessageHeader,
  Username,
  MessageTime,
  InputContainer,
  MessageInput,
  SendButton,
  CheerButton,
} from "../styles/ChatStyle";

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [liveEvents, setLiveEvents] = useState([]);
  const [matchData, setMatchData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [cheerCount, setCheerCount] = useState(0);
  const [lastCheerUser, setLastCheerUser] = useState("");
  const socket = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.current = io("http://localhost:5000");

    socket.current.on("connect", () => {
      setIsConnected(true);
      socket.current.emit("join_match", "current_furia_match");
    });

    socket.current.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.current.on("new_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.current.on("live_event", (event) => {
      setLiveEvents((prev) => [...prev.slice(-5), event]);
    });

    socket.current.on("match_data", (data) => {
      setMatchData(data);
    });

    socket.current.on("match_update", (update) => {
      setMatchData((prev) => ({
        ...prev,
        score: update.score,
        map: update.map,
        round: update.round,
      }));
    });

    socket.current.on("cheer_update", (data) => {
      setCheerCount(data.count);
      setLastCheerUser(data.user);
    });

    socket.current.on("special_event", (data) => {
      setLiveEvents((prev) => [...prev, data.message]);
      setCheerCount(0);
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, liveEvents, cheerCount]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      username: "Você",
      message: newMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    socket.current.emit("send_message", messageData);
    setNewMessage("");
  };

  const handleCheer = () => {
    socket.current.emit("send_cheer", {
      username: "Você",
      type: "furia_cheer",
    });
  };

  return (
    <ChatContainer>
      <Header>FURIA CHAT</Header>

      <LiveMatchPanel>
        {matchData ? (
          <>
            <MatchTitle>⚡ {matchData.event || "FURIA Match"}</MatchTitle>
            <MatchScore>
              {matchData.team1 || "FURIA"} {matchData?.score || "0 x 0"}{" "}
              {matchData.team2 || "Opponent"}
            </MatchScore>
            <MatchStats>
              <span>Round: {matchData.round || "1"}</span>
              <span>Map: {matchData.map || "Mirage"}</span>
            </MatchStats>
          </>
        ) : (
          <p>Carregando dados da partida...</p>
        )}
      </LiveMatchPanel>

      {cheerCount > 0 && (
        <CheerBanner>
          🔥 {cheerCount}{" "}
          {cheerCount === 1 ? "pessoa gritou" : "pessoas gritaram"}!
          {lastCheerUser && ` (${lastCheerUser} foi o último)`}
        </CheerBanner>
      )}

      <MessageList>
        {liveEvents.map((event, index) => (
          <Message key={`event-${index}`} $isBot>
            <MessageHeader>
              <Username>FURIA Bot</Username>
              <MessageTime>
                {new Date().toLocaleTimeString([], { timeStyle: "short" })}
              </MessageTime>
            </MessageHeader>
            {event}
          </Message>
        ))}

        {messages.map((msg, index) => (
          <Message key={`msg-${index}`} $isUser={msg.username === "Você"}>
            <MessageHeader>
              <Username>{msg.username}</Username>
              <MessageTime $isUser={msg.username === "Você"}>
                {msg.time}
              </MessageTime>
            </MessageHeader>
            {msg.message}
          </Message>
        ))}
        <div ref={messagesEndRef} />
      </MessageList>

      <InputContainer onSubmit={handleSendMessage}>
        <MessageInput
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Envie um grito de guerra! 🔥"
          disabled={!isConnected}
        />
        <CheerButton
          type="button"
          onClick={handleCheer}
          disabled={!isConnected}
        >
          🔥 VAMO!
        </CheerButton>
        <SendButton type="submit" disabled={!isConnected}>
          {isConnected ? "ENVIAR" : "..."}
        </SendButton>
      </InputContainer>
    </ChatContainer>
  );
}

export default ChatPage;
