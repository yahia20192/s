const { Client, Collection } = require("discord.js");
const client = new Client({ intents: 32767 });
module.exports = client;

client.aliases = new Collection();
client.cooldowns = new Collection();
client.slashCommands = new Collection();
client.commands = new Collection();
require("./handler")(client);

client.login("TOKEN");
