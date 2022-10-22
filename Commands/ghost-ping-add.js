const Discord = require("discord.js");
const data = require("../data.json");
const fs = require("fs");
const console = require("console");

module.exports = {

    name: "ghost-ping-add",
    description: "Définir un salon commeghost ping ",
    permission: Discord.PermissionFlagsBits.ManageMessages,
    dm: false,
    category: "GhostPing",
    options: [
        {
            type: "channel",
            name: "ghostpingchannel",
            description: "Le salon que vous voulez définir comme ghost ping",
            required: true,
            autocomplete: true,
        }
    ],

    async run(bot, message, args){

        await message.deferReply();

        try {
            const guild = message.guild;
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

                    for (let i = 0; i < ghostPing.length; i++) {
                        if(ghostPing[i].guildID == guild.id && ghostPing[i].idsalon.id == ghostPingChannel.id){
                            const embedGhostPing = new Discord.EmbedBuilder()
                                .setTitle(`Salon déja ghost ping.`)
                                .setColor(data[i].colorWarn)
                                .setDescription(`Le salon ${ghostPingChannel} est déjà un salon ghost ping.`)
                                .setTimestamp();
                            
                            message.followUp({embeds: [embedGhostPing]})
                            .then((send) => {
                                setTimeout(() => {
                                    send.delete();
                                }, 3000);
                            });
                        }
                        else{
                            let ghostPingData = {
                                guildID: guild.id,
                                idsalon: ghostPingChannel
                            };

                            ghostPing.push(ghostPingData);

                            fs.writeFile("./ghostping.json", JSON.stringify(ghostPing), err => {
                                if (err) console.log(err);
                            });
                        } 

                        const embedGhostPing = new Discord.EmbedBuilder()
                            .setTitle(`Ghost Ping Réussi.`)
                            .setColor(data[i].colorBase)
                            .setDescription(`Le salon ${ghostPingChannel} viens d'ètre défini comme ghostping.\nUtiliser **/list-ghost-ping** pour voir les salons en ghost ping.\nUtiliser **/remove-ghost-ping** pour supprimer un salon ghost ping.`)
                            .setTimestamp();
                        return message.followUp({embeds: [embedGhostPing]})
                        .then((send) => {
                            setTimeout(() => {
                                send.delete();
                            }, 8000);
                        });
                    }
                }
            }
        } catch (err) {
            const guild = message.guild;
            for (let i = 0; i < data.length; i++) {
                if(data[i].guildID == guild.id){
                    let ghostPingChannel = args.getChannel("ghostpingchannel");
                    const embedInconnue = new Discord.EmbedBuilder()
                        .setTitle(`Pas de salon a définir comme ghostping! erreur`)
                        .setColor(data[i].colorDanger)
                        .setDescription(`Une erreur s'est porduite lors de la tantative de définir le salon ${ghostPingChannel} comme ghost ping`)
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