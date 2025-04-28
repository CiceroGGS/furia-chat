// frontend/src/components/LiveMatchPanel.jsx
import React, { useEffect, useState } from "react";
import styled, { keyframes, css } from "styled-components";
import furiaLogo from "../../../frontend/src/assets/furia-esports-logo.png"; // Ajuste o caminho se necessário
import teamLiguid from "../../../frontend/src/assets/team-liguid-logo.png";
import fazeClan from "../../../frontend/src/assets/Faze_Clan-logo.webp";

const getMockData = () => {
  const opponents = ["Team Liquid", "FaZe Clan", "Natus Vincere"];
  const opponent = opponents[Math.floor(Math.random() * opponents.length)];
  return {
    team1: {
      name: "FURIA",
      logo: getLogo("FURIA"),
      score: Math.floor(Math.random() * 16),
    },
    team2: {
      name: opponent,
      logo: getLogo(opponent),
      score: Math.floor(Math.random() * 16),
    },
    event: "Simulação de Partida",
    map: "Mirage",
    status: "SIMULADO",
    vodLink: "#",
  };
};

const getLogo = (teamName) => {
  const logos = {
    FURIA: null,
    "Team Liquid": teamLiguid,
    "FaZe Clan": fazeClan,
  };
  return logos[teamName] || furiaLogo;
};

const loadingAnimation = keyframes`
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
`;

const LiveMatchPanel = () => {
  const [data, setData] = useState(null);
  const [loading, setLoad] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/match-live");
        if (!res.ok) throw new Error();
        const json = await res.json();
        setData(json);
      } catch {
        setData(getMockData());
      } finally {
        setLoad(false);
      }
    };
    fetchData();
    const iv = setInterval(fetchData, 60000);
    return () => clearInterval(iv);
  }, []);

  if (loading)
    return (
      <Panel isLoading>
        <LoadingText>Carregando...</LoadingText>
      </Panel>
    );

  return (
    <Panel simulated={data.status === "SIMULADO"} isLoading={loading}>
      {data.status === "SIMULADO" && <SimTag>⚙️ Simulação</SimTag>}
      <Badge status={data.status}>{data.status}</Badge>
      <Event>{data.event}</Event>
      <MatchInfo>
        <TeamInfo>
          <TeamLogo src={data.team1.logo} alt={data.team1.name} />
          <TeamName>{data.team1.name}</TeamName>
          <TeamScore>{data.team1.score}</TeamScore>
        </TeamInfo>
        <VSSymbol>×</VSSymbol>
        <TeamInfo>
          <TeamScore>{data.team2.score}</TeamScore>
          <TeamName>{data.team2.name}</TeamName>
          <TeamLogo src={data.team2.logo} alt={data.team2.name} />
        </TeamInfo>
      </MatchInfo>
      <Details>
        <MapLabel>Mapa:</MapLabel> <MapName>{data.map}</MapName>
      </Details>
      <ActionButton
        href={data.vodLink}
        target="_blank"
        rel="noopener noreferrer"
        simulated={data.status === "SIMULADO"}
      >
        {data.status === "SIMULADO" ? "Sem Jogo ao Vivo" : "Assista Agora"}
      </ActionButton>
    </Panel>
  );
};

const Panel = styled.div`
  position: relative;
  background: linear-gradient(
    135deg,
    rgba(20, 20, 20, 0.8) 0%,
    rgba(40, 40, 40, 0.8) 100%
  );
  border-radius: 15px;
  padding: 20px;
  margin: 20px 0;
  color: #eee;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  border: 1px solid ${(p) => (p.simulated ? "#666" : "#ff8c00")};

  ${({ isLoading }) =>
    isLoading &&
    css`
      animation: ${loadingAnimation} 1.5s infinite ease-in-out;
      background: #333;
      border-color: #555;
    `}
`;

const LoadingText = styled.div`
  font-size: 1rem;
  color: #aaa;
`;

const SimTag = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(100, 100, 100, 0.7);
  color: #ddd;
  padding: 5px 10px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: bold;
  z-index: 10;
`;

const Badge = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background: ${(p) => (p.status === "LIVE" ? "#dc2626" : "#22c5e0")};
  color: white;
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 0.9rem;
  font-weight: bold;
  text-transform: uppercase;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  z-index: 10;
`;

const Event = styled.h2`
  font-weight: bold;
  margin-bottom: 15px;
  color: #facc15;
  font-size: 1.2rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
`;

const MatchInfo = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 20px 0;
`;

const TeamInfo = styled.div`
  display: flex;
  align-items: center;
`;

const TeamLogo = styled.img`
  height: 60px;
  margin: 0 10px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
`;

const TeamName = styled.span`
  font-weight: bold;
  font-size: 1.1rem;
  color: #eee;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.4);
`;

const TeamScore = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: #f97316;
  margin: 0 15px;
  text-shadow: 2px 2px 3px rgba(0, 0, 0, 0.6);
`;

const VSSymbol = styled.span`
  font-size: 2rem;
  color: #ccc;
  opacity: 0.8;
`;

const Details = styled.div`
  margin: 15px 0;
  color: #ddd;
  font-size: 0.9rem;
`;

const MapLabel = styled.span`
  font-weight: bold;
  margin-right: 5px;
`;

const MapName = styled.strong`
  color: #fff;
`;

const ActionButton = styled.a`
  display: inline-block;
  background: ${(p) => (p.simulated ? "#6b7280" : "#8b5cf6")};
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s ease-in-out, transform 0.2s ease-in-out;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);

  &:hover {
    background: ${(p) => (p.simulated ? "#4b5563" : "#a78bfa")};
    transform: translateY(-2px);
  }
`;

export default LiveMatchPanel;
