import { useEffect, useState } from "react";
import styled from "styled-components";

const Panel = styled.div`
  background: rgba(0, 0, 0, 0.7);
  border: 2px solid #ff5500;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  color: white;
  text-align: center;
  font-family: "Arial Black", sans-serif;
`;

const MatchInfo = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
`;

const LiveMatchPanel = ({ matchId }) => {
  const [matchData, setMatchData] = useState({
    score: "0 - 0",
    map: "Mirage",
    round: 1,
  });

  useEffect(() => {
    const maps = ["Mirage", "Inferno", "Overpass", "Ancient", "Nuke"];
    const interval = setInterval(() => {
      setMatchData((prev) => ({
        score: `${Math.min(16, prev.score.split(" - ")[0] * 1 + 1)} - ${
          prev.score.split(" - ")[1]
        }`,
        map: maps[Math.floor(Math.random() * maps.length)],
        round: prev.round + 1,
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, [matchId]);

  return (
    <Panel>
      <h3>⚡ {matchData.map}</h3>
      <p>FURIA {matchData.score} Oponente</p>
      <MatchInfo>
        <span>Round: {matchData.round}</span>
        <span>Mapa: {matchData.map}</span>
      </MatchInfo>
    </Panel>
  );
};

export default LiveMatchPanel;
