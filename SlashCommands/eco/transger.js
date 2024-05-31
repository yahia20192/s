const { Client, CommandInteraction } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
   name: "transfer",
   description: "Transfer money to someone else.",
   type: "CHAT_INPUT",
   options: [
      {
         type: "USER",
         name: "recipient",
         description: "The user you want to transfer money to.",
         required: true,
      },
      {
         type: "INTEGER",
         name: "amount",
         description: "The amount of money you want to transfer.",
         required: true,
      },
   ],
   run: async (client, interaction, args) => {
      const recipient = interaction.options.getUser("recipient");
      const amount = interaction.options.getInteger("amount");

      if (!recipient || !amount) {
         return interaction.followUp(
            "Please provide both recipient and amount.",
         );
      }

      if (recipient.id == interaction.user.id || recipient.bot) return;
      let sender = await db.get("balances." + interaction.user.id);
      let receiver = await db.get("balances." + recipient.id);

      if (!sender)
         return await interaction.followUp("You dont have enough money.");

      if (sender < amount)
         return await interaction.followUp("You dont have enough money.");

      if (receiver == null) {
         receiver = await db.set(`balances.${recipient.id}`, "0");
      }

      receiver += amount;
      await db.set(`balances.${recipient.id}`, receiver);

      sender -= amount;
      await db.set(`balances.${interaction.user.id}`, sender);

      await interaction.followUp(
         `Transferring ${amount} to ${recipient.username}.`,
      );
   },
};
