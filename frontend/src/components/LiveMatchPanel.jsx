import { useEffect, useState } from "react";
import styled from "styled-components";

const Panel = styled.div`
  background: rgba(0, 0, 0, 0.7);
  border: 2px solid #ff5500;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 15px;
  color: white;
  font-family: "Arial Black", sans-serif;
`;

const LiveMatchPanel = ({ matchId }) => {
  const [matchData, setMatchData] = useState({
    score: "0 x 0",
    round: 1,
    economy: "$4,200",
  });

  useEffect(() => {
    // Simulação - Substitua pela API real depois
    const interval = setInterval(() => {
      setMatchData((prev) => ({
        score: `FURIA ${Math.floor(Math.random() * 10)} x ${Math.floor(
          Math.random() * 10
        )} Opponent`,
        round: prev.round + 1,
        economy: `$${Math.floor(Math.random() * 10_000)}`,
      }));
    }, 30000); // Atualiza a cada 30s

    return () => clearInterval(interval);
  }, [matchId]);

  return (
    <Panel>
      <h3>⚡ LIVE: {matchData.score}</h3>
      <p>
        Round: {matchData.round} | Economia: {matchData.economy}
      </p>
    </Panel>
  );
};

export default LiveMatchPanel;
