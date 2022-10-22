const Discord = require('discord.js');
const bumpData = require("../bump.json");
const bumpData1 = require("../bump.json");
const data = require("../data.json");

module.exports = {
    name: "bump",
    description: "Permet de bump le serveur",
    permission: Discord.PermissionFlagsBits.SendMessages,
    dm: false,
    category: "Bump",

    async run(bot, message, args){

        try {
            await message.deferReply();
            const guild = message.guild;

                for (let i = 0; i < data.length; i++) {
                    if(data[i].guildID == guild.id){
                        for (let i = 0; i < bumpData.length; i++) {
                            if(bumpData[i].guildId == guild.id){
                                const embedInfo = new Discord.EmbedBuilder()
                                    .setDescription("Bump du serveur.")
                                    .setColor(data[i].colorBase)

                                message.followUp({embeds: [embedInfo]});
                                for (let i = 0; i < bumpData1.length; i++) {
                                    bot.guilds.cache.get(bumpData1[i].guildId).channels.cache.get(bumpData1[i].channelId.id).send(`>>> ${message.user.username} bump: \n\n**${message.guild.name}**\n\nDescription:\n${bumpData[i].message}\n\n**Invite: [join](${bumpData[i].invite.url})**`)
                                }
                            }
                        }
                    }
                }
        }
        catch (err) {
            const guild = message.guild;

            for (let i = 0; i < data.length; i++) {
                if(data[i].guildID == guild.id){
                    const embedInconnue = new Discord.EmbedBuilder()
                        .setTitle(`Pas de bump! erreur`)
                        .setColor(data[i].colorDanger)
                        .setDescription(`Une erreur c'est porduite lors de la tentative de bump le serveur`)
                        .setTimestamp();
                    return message.followUp({embeds: [embedInconnue]})
                    .then((send) => {
                        setTimeout(() => {
                            send.delete();
                        }, 3000);
                    });
                }
            }
        }
    }
}