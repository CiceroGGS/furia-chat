import React, { useEffect, useState } from "react";
import styled from "styled-components";

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
    FURIA: "https://img-cdn.hltv.org/teamlogo/8298/...png",
    "Team Liquid": "...",
    "FaZe Clan": "...",
    "Natus Vincere": "...",
  };
  return (
    logos[teamName] || "https://www.hltv.org/img/static/team/placeholder.svg"
  );
};

export default function LiveMatchPanel() {
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

  if (loading) return <Panel>Carregando...</Panel>;

  return (
    <Panel simulated={data.status === "SIMULADO"}>
      {data.status === "SIMULADO" && <SimTag>⚙️ SIMULAÇÃO</SimTag>}
      <Badge status={data.status}>{data.status}</Badge>
      <Event>{data.event}</Event>
      <Teams>
        <Team>
          <Logo src={data.team1.logo} alt={data.team1.name} />
          <Name>{data.team1.name}</Name>
          <Score>{data.team1.score}</Score>
        </Team>
        <VS>×</VS>
        <Team>
          <Score>{data.team2.score}</Score>
          <Name>{data.team2.name}</Name>
          <Logo src={data.team2.logo} alt={data.team2.name} />
        </Team>
      </Teams>
      <Info>
        <span>Mapa:</span> <strong>{data.map}</strong>
      </Info>
      <Watch href={data.vodLink} target="_blank" rel="noopener noreferrer">
        {data.status === "SIMULADO" ? "Sem jogo ao vivo" : "Assistir"}
      </Watch>
    </Panel>
  );
}

const Panel = styled.div`
  position: relative;
  background: rgba(10, 10, 10, ${(p) => (p.simulated ? 0.7 : 0.9)});
  border: 2px solid ${(p) => (p.simulated ? "#888" : "#ff5500")};
  border-radius: 12px;
  padding: 15px;
  margin: 20px 0;
  color: white;
  text-align: center;
`;

const SimTag = styled.div`
  position: absolute;
  top: -10px;
  right: 20px;
  background: #888;
  color: #eee;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
`;

const Badge = styled.div`
  position: absolute;
  top: -10px;
  left: 20px;
  background: ${(p) => (p.status === "LIVE" ? "#ff0000" : "#ff5500")};
  color: white;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
`;

const Event = styled.div`
  font-weight: bold;
  margin-bottom: 15px;
  color: #ffaa00;
  font-size: 1.1rem;
`;

const Teams = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 15px 0;
`;

const Team = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Logo = styled.img`
  height: 50px;
  margin-bottom: 8px;
`;

const Name = styled.span`
  font-weight: bold;
  margin: 5px 0;
`;

const Score = styled.span`
  font-size: 2rem;
  font-weight: bold;
  color: #ff5500;
`;

const VS = styled.span`
  font-size: 1.5rem;
  opacity: 0.7;
`;

const Info = styled.div`
  margin: 15px 0;
`;

const Watch = styled.a`
  display: inline-block;
  background: #9147ff;
  color: white;
  padding: 8px 12px;
  border-radius: 5px;
  text-decoration: none;
  font-size: 0.9rem;
`;
