// backend/routes/liveMatchRoutes.js
const express = require("express");
const HLTV = require("hltv");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const matches = await HLTV.getMatches();
    const furia = matches.find(
      (m) =>
        (m.team1?.name.includes("FURIA") || m.team2?.name.includes("FURIA")) &&
        (m.live || m.upcoming)
    );
    if (!furia) return res.status(404).json({ error: "Nenhuma partida FURIA" });

    const getBackendLogo = (name) => {
      const L = {
        FURIA: "https://img-cdn.hltv.org/teamlogo/8298/...png",
        "Team Liquid": null,
        "FaZe Clan": null,
        "Natus Vincere": null,
      };
      return L[name] || null;
    };

    res.json({
      team1: {
        name: furia.team1.name,
        logo: getBackendLogo(furia.team1.name),
        score: furia.team1.result,
      },
      team2: {
        name: furia.team2.name,
        logo: getBackendLogo(furia.team2.name),
        score: furia.team2.result,
      },
      event: furia.event.name,
      map: "Mirage",
      status: furia.live ? "LIVE" : "EM BREVE",
      vod: `https://www.hltv.org${furia.link}`,
    });
  } catch (e) {
    console.error("HLTV error:", e);
    res.status(500).json({ error: "HLTV API indisponível" });
  }
});

module.exports = router;
