const Discord = require('discord.js');
const data = require("../data.json");

module.exports = {
    name: "bump-info",
    description: "Permet de charger les infos de bump",
    permission: Discord.PermissionFlagsBits.SendMessages,
    dm: false,
    category: "Bump",

    async run(bot, message, args){

        try {
            await message.deferReply();
            const guild = message.guild;

            for (let i = 0; i < data.length; i++) {
                if(data[i].guildID == guild.id){
                    const bump =  require("../bump.json");
                    for(i = 0; i< bump.length; i++){
                        if(message.guild.id == bump[i].guildId){
                            const embedInfo = new Discord.EmbedBuilder()
                            .setDescription("Info du bump du serveur.")
                            .setColor(data[i].colorBase)
        
                            message.followUp({embeds: [embedInfo]});
                            message.channel.send(`>>> preview ${message.user.username}: \n\n**${message.guild.name}**\n\nDescription:\n${bump[i].message}\n\n**Invite: [link](${bump[i].invite.url})**\n\n(Channel de bump <#${bump[i].channelId.id}>)`)
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
                        .setDescription(`Une erreur c'est porduite lors de charger les infos de bump.`)
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