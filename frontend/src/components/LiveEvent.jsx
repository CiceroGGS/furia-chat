import styled from "styled-components";

const Event = styled.div`
  background: #ff550022;
  border-left: 3px solid #ff5500;
  padding: 8px;
  margin: 5px 0;
  font-style: italic;
  animation: fadeIn 0.5s;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const LiveEvent = ({ event }) => {
  return <Event>🔴 {event}</Event>;
};

export default LiveEvent;
