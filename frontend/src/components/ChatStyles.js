import styled from "styled-components";

// Componentes principais
export const ChatContainer = styled.div`
  width: 100%;
  max-width: 600px;
  height: 90vh;
  margin: 0 auto;
  background: #121212;
  border-radius: 16px;
  border: 2px solid #ff5500;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 20px rgba(255, 85, 0, 0.3);
`;

export const LiveMatchPanel = styled.div`
  background: rgba(0, 0, 0, 0.7);
  padding: 15px;
  margin-bottom: 10px;
  border-bottom: 1px solid #ff5500;
  color: white;
  text-align: center;
  font-family: "Arial Black", sans-serif;
`;

export const MessageList = styled.div`
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  background: #1e1e1e;
  display: flex;
  flex-direction: column;
  gap: 10px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #ff5500;
    border-radius: 3px;
  }
`;

// Componentes de mensagem
export const Message = styled.div`
  padding: 12px 15px;
  background: ${(props) => (props.$isUser ? "#ff5500" : "#2a2a2a")};
  color: ${(props) => (props.$isUser ? "#000" : "#fff")};
  border-radius: ${(props) =>
    props.$isUser ? "15px 15px 0 15px" : "15px 15px 15px 0"};
  align-self: ${(props) => (props.$isUser ? "flex-end" : "flex-start")};
  max-width: 80%;
  position: relative;
`;

export const MessageMeta = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 0.8rem;
`;

export const Username = styled.span`
  font-weight: bold;
  color: ${(props) => (props.$isUser ? "#000" : "#ff5500")};
`;

export const Timestamp = styled.span`
  color: ${(props) => (props.$isUser ? "#333" : "#888")};
  margin-left: 10px;
`;

// Componentes de entrada
export const InputForm = styled.form`
  display: flex;
  padding: 15px;
  gap: 10px;
  background: #2a2a2a;
  border-top: 1px solid #ff5500;
`;

export const MessageInput = styled.input`
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 25px;
  background: #1e1e1e;
  color: white;
  font-size: 14px;
  outline: none;

  &::placeholder {
    color: #888;
  }
`;

export const ActionButton = styled.button`
  padding: 0 20px;
  border: none;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 5px;
`;

export const SendButton = styled(ActionButton)`
  background: #ff5500;
  color: black;
  &:hover {
    background: #ff7700;
  }
`;

export const CheerButton = styled(ActionButton)`
  background: linear-gradient(to right, #ff5500, #ff9900);
  color: black;
  &:hover {
    background: linear-gradient(to right, #ff7700, #ffbb00);
  }
`;

// Componentes especiais
export const CheerBanner = styled.div`
  background: linear-gradient(to right, #ff5500, #ff9900);
  color: black;
  padding: 10px;
  text-align: center;
  margin: 0 15px 15px;
  border-radius: 5px;
  font-weight: bold;
  animation: pulse 1.5s infinite;

  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.03);
    }
    100% {
      transform: scale(1);
    }
  }
`;
