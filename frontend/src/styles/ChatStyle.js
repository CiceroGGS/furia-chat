import styled from "styled-components";

export const ChatContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: #121212;
  border-radius: 10px;
  border: 2px solid #ff5500;
  box-shadow: 0 0 20px rgba(255, 85, 0, 0.3);
  height: 90vh;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
  background: #000;
  border-bottom: 2px solid #ff5500;
  margin-bottom: 20px;
  color: #ff5500;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 1.5rem;
  font-weight: bold;
`;

export const LiveMatchPanel = styled.div`
  background: rgba(0, 0, 0, 0.7);
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 5px;
  border: 1px solid #ff5500;
  color: white;
  text-align: center;
  font-family: "Arial Black", sans-serif;
`;

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

export const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  background: #1e1e1e;
  border-radius: 8px;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: #1a1a1a;
  }
  &::-webkit-scrollbar-thumb {
    background: #ff5500;
    border-radius: 4px;
  }
`;

export const InputContainer = styled.form`
  display: flex;
  gap: 10px;
  padding: 10px;
  background: #2a2a2a;
  border-radius: 8px;
  flex-direction: column;
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

const ActionButton = styled.button`
  padding: 0 20px;
  border: none;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 5px;
  height: 44px;
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
