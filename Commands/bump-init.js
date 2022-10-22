const Discord = require('discord.js');
const fs = require("fs");
const data = require("../data.json");

module.exports = {
    name: "bump-init",
    description: "Permet d'initialiser le bump",
    permission: Discord.PermissionFlagsBits.Administrator,
    dm: false,
    category: "Bump",
    options :[
        {
            type: "string",
            name: "message",
            description: "Le message a evoyer",
            required: true,
            autocomplete: false,
        },
        {
            type: "channel",
            name: "channel",
            description: "Le salon a evoyer les bumps", 
            required: true,
            autocomplete: true,
        }
    ],

    async run(bot, message, args){

        try {
            await message.deferReply();
            const guild = message.guild;

                for (let i = 0; i < data.length; i++) {
                    if(data[i].guildID == guild.id){
                        const messageArgs = args.getString("message");
                        const channel = args.getChannel("channel");
                        if(!messageArgs){
                            const embedInconnue = new Discord.EmbedBuilder()
                                .setTitle(`Inconnue`)
                                .setColor(data[i].colorWarn)
                                .setDescription(`Pas de message.\nVeuiller entrer un message de moins de 40 characters`)
                                .setTimestamp();
                            return message.followUp({embeds: [embedInconnue]})
                            .then((send) => {
                                setTimeout(() => {
                                    send.delete();
                                }, 4000);
                            });
                        }

                        if(messageArgs.length > 40){
                            const embedInconnue = new Discord.EmbedBuilder()
                                .setTitle(`Trop de characters`)
                                .setColor(data[i].colorWarn)
                                .setDescription(`Pas de message.\nVeuiller entrer un message de moins de 40 characters`)
                                .setTimestamp();
                            return message.followUp({embeds: [embedInconnue]})
                            .then((send) => {
                                setTimeout(() => {
                                    send.delete();
                                }, 3000);
                            });
                        }

                        if(!channel){
                            const embedInconnue = new Discord.EmbedBuilder()
                                .setTitle(`Inconnue`)
                                .setColor(data[i].colorWarn)
                                .setDescription(`Pas de channel.\nVeuiller préciser un channel`)
                                .setTimestamp();
                            return message.followUp({embeds: [embedInconnue]})
                            .then((send) => {
                                setTimeout(() => {
                                    send.delete();
                                }, 3000);
                            });
                        }

                        let invite;
                        try {
                            invite = await message.channel.createInvite({
                                maxAge: 86400
                            }, `Bump Invite`)
                        } catch { 
                            const embedInconnue = new Discord.EmbedBuilder()
                                .setTitle(`Pas d'invitation créé ! erreur`)
                                .setColor(data[i].colorWarn)
                                .setDescription(`Une erreur c'est porduite lors de créé une invitation de bump`)
                                .setTimestamp();
                            return message.followUp({embeds: [embedInconnue]})
                            .then((send) => {
                                setTimeout(() => {
                                    send.delete();
                                }, 3000);
                            });
                        }

                        const bumpData = require("../bump.json");
                            
                            let Databump = {
                                author: message.user.username,
                                guildId: message.guild.id, 
                                channelId: channel,
                                message: messageArgs,
                                serverName: message.guild.name,
                                invite: invite
                            }

                        bumpData.push(Databump);

                        fs.writeFile("bump.json", JSON.stringify(bumpData), err => {
                        
                            if (err) throw err; 
            
                        });

                        const embedSucces= new Discord.EmbedBuilder()
                            .setColor(data[i].colorBase)
                            .setDescription(`Initialisation du bump réussi`)
                        message.followUp({embeds: [embedSucces]})
                        message.channel.send(`>>> ${message.user.username} inisialisé:\n\n**${message.guild.name}**\n\nDescription:\n${messageArgs}\n\nIn**Invite: [join](${invite})**\n\n(Channel de bump ${channel})`)
                        
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
                        .setDescription(`Une erreur c'est porduite lors de la tentative d'initialiser le bump du serveur`)
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