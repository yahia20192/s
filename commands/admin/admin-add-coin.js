const Discord = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
   name: "admin-add-coin",
   aliases: ["aac"],
   description: "Returns Websocket Ping",
   run: async (client, message, args) => {
      if (
         message.author.id !== "591698325707685909" ||
         message.author.id !== "346751313058725889"
      ) {
         const user = message.mentions.users.first();

         if (!user) {
            return message.reply("Please mention a user to add coins to.");
         }

         // Get the amount of coins to add
         const coinsToAdd = await parseInt(args[0]);

         if (isNaN(coinsToAdd) || coinsToAdd <= 0) {
            return message.reply(
               "Please provide a valid amount of coins to add.",
            );
         }
         let userCoins = (await db.get(`balances.${user.id}`)) || 0;

         // Add coins to the user
         userCoins += coinsToAdd;
         await db.set(`balances.${user.id}`, userCoins);

         return message.reply(
            `Added ${coinsToAdd} coins to ${user.tag}. They now have a total of ${userCoins} coins.`,
         );
      }
   },
};
