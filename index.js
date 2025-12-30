const express = require("express");
const axios = require("axios");
const app = express();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const GUILD_ID = process.env.GUILD_ID;
const ROLE_NAME = "GIRP | CEO";

app.get("/", (req, res) => {
  res.send("Galaxy Infinity ADV RP - Online");
});

app.get("/login", (req, res) => {
  const redirect = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&scope=identify%20guilds.members.read&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}`;
  res.redirect(redirect);
});

app.get("/callback", async (req, res) => {
  const code = req.query.code;

  try {
    const tokenRes = await axios.post(
      "https://discord.com/api/oauth2/token",
      new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.REDIRECT_URI
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const accessToken = tokenRes.data.access_token;

    const userRes = await axios.get("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const memberRes = await axios.get(
      `https://discord.com/api/users/@me/guilds/${GUILD_ID}/member`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    const roles = memberRes.data.roles;

    if (roles.includes(process.env.CEO_ROLE_ID)) {
      res.send("✅ Acesso ADMIN liberado (GIRP | CEO)");
    } else {
      res.send("❌ Você não possui o cargo GIRP | CEO");
    }

  } catch (err) {
    res.send("Erro no login.");
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Galaxy Infinity online na porta " + PORT);
});

  console.log("Galaxy Infinity online");
});
