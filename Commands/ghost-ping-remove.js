const Discord = require("discord.js");
const data = require("../data.json");
const fs = require("fs");

module.exports = {

    name: "ghost-ping-remove",
    description: "Supprime un salon ghost ping ",
    permission: Discord.PermissionFlagsBits.ManageMessages,
    dm: false,
    category: "GhostPing",
    options: [
        {
            type: "channel",
            name: "ghostpingchannel",
            description: "Le salon ghost ping que vous voulez supprimer.",
            required: true,
            autocomplete: true,
        }
    ],

    async run(bot, message, args){

        await message.deferReply();
        const guild = message.guild;

        try {
            for (let i = 0; i < data.length; i++) {
                if(data[i].guildID == guild.id){
                    let ghostPingChannel = args.getChannel("ghostpingchannel");

                    if(!ghostPingChannel){
                        const embedInconnue = new Discord.EmbedBuilder()
                            .setTitle(`Inconnue`)
                            .setColor(data[i].colorWarn)
                            .setDescription(`Pas de salon.\nVeuillez présiser un salon existant`)
                            .setTimestamp();
                        return message.followUp({embeds: [embedInconnue]})
                        .then((send) => {
                            setTimeout(() => {
                                send.delete();
                            }, 3000);
                        });
                    }
                    const ghostPing =  require("../ghostping.json");

                    for(i = 0; i< ghostPing.length; i++){
                        if(ghostPing[i].guildID == guild.id && ghostPing[i].idsalon.name == ghostPingChannel){
                            delete ghostPing[i].guildID;
                            delete ghostPing[i].idsalon;
                            const embedGhostPing = new Discord.EmbedBuilder()
                                .setTitle(`Ghost Ping supprimer`)
                                .setColor(data[i].colorBase)
                                .setDescription(`Le salon ${ghostPingChannel} n'est plus un salon ghost ping`)
                                .setTimestamp();
                            return message.followUp({embeds: [embedGhostPing]})
                            .then((send) => {
                                setTimeout(() => {
                                    send.delete();
                                }, 3000);
                            });
                        }else{
                            const embedGhostPing = new Discord.EmbedBuilder()
                                .setTitle(`Inconnue`)
                                .setColor(data[i].colorBase)
                                .setDescription(`Le salon ${ghostPingChannel} n'est pas un salon ghost ping`)
                                .setTimestamp();
                            return message.followUp({embeds: [embedGhostPing]})
                            .then((send) => {
                                setTimeout(() => {
                                    send.delete();
                                }, 3000);
                            });
                        }
                    }
                }
            }
        } catch (err) {
            let ghostPingChannel = args.getChannel("ghostpingchannel");
            const embedInconnue = new Discord.EmbedBuilder()
                .setTitle(`Pas de salon ghostping! erreur`)
                .setColor(data[i].colorDanger)
                .setDescription(`Une erreur s'est porduite lors de la tantative de retirer le ghost ping du salon ${ghostPingChannel}`)
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