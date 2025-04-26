import { useEffect, useState } from "react";
import styled from "styled-components";
import { CSSTransition } from "react-transition-group";
import "./LiveMatchStyles.css";

const LiveMatchPanel = ({ matchId }) => {
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const fetchMatchData = async () => {
      // Mock data - replace with real API call in production
      const mockData = {
        team1: {
          name: "FURIA",
          logo: "https://images.seeklogo.com/logo-png/42/1/furia-esports-logo-png_seeklogo-428783.png",
          score: 10,
          players: ["KSCERATO", "yuurih", "arT", "chelo", "FalleN"],
        },
        team2: {
          name: "Team Liquid",
          logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjc5nGJKAMjK5FEWPeE8QQgaF95GGgynqMRA&s",
          score: 8,
          players: ["EliGE", "NAF", "oSee", "nitr0", "YEKINDAR"],
        },
        event: "ESL Pro League S19",
        map: "Mirage",
        round: 18,
        status: "LIVE",
        vodLink: "https://twitch.tv/esl_csgo",
      };

      setTimeout(() => {
        setMatchData(mockData);
        setLoading(false);
      }, 1500);
    };

    fetchMatchData();
    const interval = setInterval(fetchMatchData, 30000);
    return () => clearInterval(interval);
  }, [matchId]);

  if (loading) return <Panel>Carregando dados da partida...</Panel>;

  return (
    <Panel className="live-match-panel">
      <LiveBadge status={matchData.status}>
        {matchData.status === "LIVE" ? "🔴 AO VIVO" : "⏱ EM BREVE"}
      </LiveBadge>

      <EventLogo>{matchData.event}</EventLogo>

      <TeamsContainer>
        <Team>
          <TeamLogo src={matchData.team1.logo} alt={matchData.team1.name} />
          <TeamName>{matchData.team1.name}</TeamName>
          <TeamScore>{matchData.team1.score}</TeamScore>
        </Team>

        <VS>×</VS>

        <Team>
          <TeamScore>{matchData.team2.score}</TeamScore>
          <TeamName>{matchData.team2.name}</TeamName>
          <TeamLogo src={matchData.team2.logo} alt={matchData.team2.name} />
        </Team>
      </TeamsContainer>

      <MatchInfo>
        <MapInfo>
          <span>Mapa:</span>
          <strong>{matchData.map}</strong>
        </MapInfo>
        <RoundInfo>
          <span>Round:</span>
          <strong>{matchData.round}/30</strong>
        </RoundInfo>
      </MatchInfo>

      <ToggleDetails onClick={() => setShowDetails(!showDetails)}>
        {showDetails ? "▲ Esconder" : "▼ Detalhes"}
      </ToggleDetails>

      <CSSTransition
        in={showDetails}
        timeout={300}
        classNames="details"
        unmountOnExit
      >
        <MatchDetails>
          <PlayersList>
            <h4>Jogadores FURIA:</h4>
            {matchData.team1.players.map((player) => (
              <Player key={player}>{player}</Player>
            ))}
          </PlayersList>

          <MatchActions>
            <WatchButton href={matchData.vodLink} target="_blank">
              Assistir no Twitch
            </WatchButton>
          </MatchActions>
        </MatchDetails>
      </CSSTransition>
    </Panel>
  );
};

// Styled Components
const Panel = styled.div`
  background: rgba(10, 10, 10, 0.9);
  border: 2px solid #ff5500;
  border-radius: 12px;
  padding: 15px;
  margin: 20px 0;
  color: white;
  position: relative;
  box-shadow: 0 4px 20px rgba(255, 85, 0, 0.2);
`;

const LiveBadge = styled.div`
  position: absolute;
  top: -10px;
  left: 20px;
  background: ${(props) => (props.status === "LIVE" ? "#ff0000" : "#ff5500")};
  color: white;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
`;

const EventLogo = styled.div`
  text-align: center;
  font-weight: bold;
  margin-bottom: 15px;
  color: #ffaa00;
  font-size: 1.1rem;
`;

const TeamsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 15px 0;
`;

const Team = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
`;

const TeamLogo = styled.img`
  height: 50px;
  margin-bottom: 8px;
  filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.3));
`;

const TeamName = styled.span`
  font-weight: bold;
  margin: 5px 0;
`;

const TeamScore = styled.span`
  font-size: 2rem;
  font-weight: bold;
  color: #ff5500;
`;

const VS = styled.span`
  font-size: 1.5rem;
  margin: 0 20px;
  opacity: 0.7;
`;

const MatchInfo = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 15px 0;
  font-size: 0.9rem;
`;

const MapInfo = styled.div`
  background: rgba(255, 85, 0, 0.2);
  padding: 5px 10px;
  border-radius: 5px;

  strong {
    color: #ffaa00;
  }
`;

const RoundInfo = styled(MapInfo)`
  background: rgba(0, 100, 255, 0.2);

  strong {
    color: #00aaff;
  }
`;

const ToggleDetails = styled.button`
  background: none;
  border: none;
  color: #aaa;
  cursor: pointer;
  display: block;
  margin: 10px auto 0;
  font-size: 0.8rem;

  &:hover {
    color: #ff5500;
  }
`;

const MatchDetails = styled.div`
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #333;
`;

const PlayersList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 15px;

  h4 {
    grid-column: span 2;
    color: #ff5500;
    margin-bottom: 5px;
  }
`;

const Player = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 5px 10px;
  border-radius: 3px;
  font-size: 0.9rem;
`;

const MatchActions = styled.div`
  display: flex;
  justify-content: center;
`;

const WatchButton = styled.a`
  background: #9147ff;
  color: white;
  padding: 8px 15px;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
  transition: background 0.2s;

  &:hover {
    background: #772ce8;
  }
`;

export default LiveMatchPanel;
