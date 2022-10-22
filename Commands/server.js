const Discord = require("discord.js");
const data = require("../data.json");

module.exports = {

    name: "server",
    description: "Permet de voir les serveur ou se trouve le bot.",
    permission: Discord.PermissionFlagsBits.SendMessages,
    category: "Information",
    dm: true,
    autocomplete: false,

    async run(bot, message) {

        await message.deferReply();
        const guilds = bot.guilds.cache.map((g) => g.name);

        const guild = message.guild;
        for (let i = 0; i < data.length; i++) {
            if(data[i].guildID == guild.id){
                const embedServer = new Discord.EmbedBuilder()
                    .setTitle(`Les différants serveur ou se trouve le bot:`)
                    .setColor(data[i].colorBase)
                    .setDescription(`${guilds}`)
                    .setTimestamp();
                await message.followUp({embeds: [embedServer]})
                .then((send) => {
                    setTimeout(() => {
                        send.delete();
                    }, 6000);
                });
            }
        }
    }
}