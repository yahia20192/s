const client = require("../index");
const { MessageEmbed } = require("discord.js");
const prefix = "-";

client.on("messageCreate", async (message) => {
   try {
      if (
         message.author.bot ||
         !message.guild ||
         !message.content.toLowerCase().startsWith(prefix)
      )
         return;
      if (!message.member)
         message.member = await message.guild.fetchMember(message);
      const [cmd, ...args] = message.content
         .slice(prefix.length)
         .trim()
         .split(" ");

      console.log("Command:", cmd);

      const command =
         client.commands.get(cmd.toLowerCase()) ||
         client.commands.find((c) => c.aliases?.includes(cmd.toLowerCase()));

      if (command) {
         await command.run(client, message, args);
      }

   } catch (error) {
      console.error("Error executing command:", error);
   }
});
