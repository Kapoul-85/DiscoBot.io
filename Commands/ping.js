const Discord = require("discord.js");
const data = require("../data.json");

module.exports = {

    name: "ping",
    description: "Permet de voir la latence entre le bot et vous.",
    permission: Discord.PermissionFlagsBits.SendMessages,
    category: "Information",
    dm: true,
    autocomplete: false,

    async run(bot, message) {

        await message.deferReply();
        const ping = bot.ws.ping;
        if(ping <= 100){
            color = ":green_square:";
        }else if(ping > 100){
            color = ":red_square:";
        }
        const guild = message.guild;
        for (let i = 0; i < data.length; i++) {
            if(data[i].guildID == guild.id){
                const embedPing = new Discord.EmbedBuilder()
                    .setTitle(`Ping Pong`)
                    .setColor(data[i].colorBase)
                    .setDescription(` 🏓 Pong!\nTon ping actuel est de \`${ping} ms\``)
                    .setTimestamp();
                await message.followUp({embeds: [embedPing]});
            }
        }
    }
}