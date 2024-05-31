const client = require("../index");
const { version: discordjsVersion } = require("discord.js");
const { prefix } = require("../botconfig/main.json");
const main_json = require("../botconfig/main.json");

client.on("ready", async () => {
  client.user.setActivity(
    `${client.guilds.cache.size} ${
      client.guilds.cache.size > 1 ? "Servers" : "Server"
    }`,
    { type: "WATCHING" },
  );
  console.log("[e[");
  require("../dash.js");
});
