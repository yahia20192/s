const { Client, CommandInteraction } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
   name: "balance",
   description: "Check your balance.",
   type: "CHAT_INPUT",
   run: async (client, interaction, args) => {
      const userId = interaction.user.id;
      let userBalance = await db.get(`balances.${userId}`);
      if (userBalance === null || userBalance === undefined) {
         // If user doesn't exist in the database, set their balance to 0
         await db.set(`balances.${userId}`, 0);
         userBalance = 0;
      }
      await interaction.followUp(`Your balance is ${userBalance} coins.`);
   },
};
