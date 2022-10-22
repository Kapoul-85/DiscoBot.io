const Discord = require("discord.js");
const fs = require("fs");

module.exports = {
    name: "init",
    description: "Permet d'initaialiser le bot",
    permission: Discord.PermissionFlagsBits.Administrator,
    dm: false,
    category: "Moderation",
    options: [
        {
            type: "channel",
            name: "salonlogs",
            description: "Le salon de logs",
            required: true,
            autocomplete: true,
        },
        {
            type: "channel",
            name: "salonarriver",
            description: "Le salon d'arriver",
            required: true,
            autocomplete: true,
        },
        {
            type: "channel",
            name: "salondepart",
            description: "Le salon de depart",
            required: true,
            autocomplete: true,
        },
        {
            type: "channel",
            name: "cathegorieprivateroom",
            description: "La cathégorie de privateroom",
            required: true,
            autocomplete: true,
        },
        {
            type: "channel",
            name: "cathegorieticket",
            description: "La cathégorie de ticket",
            required: true,
            autocomplete: true,
        },
        {
            type: "string",
            name: "colordanger",
            description: "La couleur de l'embed de danger (#ff0000)",
            required: true,
            autocomplete: false,
        },
        {
            type: "string",
            name: "colorwarn",
            description: "La couleur de l'embed de danger (#ff9a00)",
            required: true,
            autocomplete: false,
        },
        {
            type: "string",
            name: "colorbase",
            description: "La couleur de l'embed de base (#4af308)",
            required: true,
            autocomplete: false,
        },
        {
            type: "string",
            name: "lien",
            description: "Le lien du serveur (https://discord.gg/GFNWT6gY4w) ",
            required: true,
            autocomplete: false,
        }
    ],

    async run(bot, message, args){

        await message.deferReply();
        let salonlogs = args.getChannel("salonlogs");
        if(!salonlogs){
            const embedInconnue = new Discord.EmbedBuilder()
                .setTitle(`Inconnue`)
                .setColor("#ff9a00")
                .setDescription(`Pas de salon logs.\nVeuillez présiser un salon de logs`)
                .setTimestamp();
            return message.followUp({embeds: [embedInconnue]})
            .then((send) => {
                setTimeout(() => {
                    send.delete();
                }, 3000);
            });
        }
        let salonarriver = args.getChannel("salonarriver");
        if(!salonarriver){
            const embedInconnue = new Discord.EmbedBuilder()
                .setTitle(`Inconnue`)
                .setColor("#ff9a00")
                .setDescription(`Pas de salon d'arriver.\nVeuillez présiser un salon d'arrivé`)
                .setTimestamp();
            return message.followUp({embeds: [embedInconnue]})
            .then((send) => {
                setTimeout(() => {
                    send.delete();
                }, 3000);
            });
        }
        let salondepart = args.getChannel("salondepart");
        if(!salondepart){
            const embedInconnue = new Discord.EmbedBuilder()
                .setTitle(`Inconnue`)
                .setColor("#ff9a00")
                .setDescription(`Pas de salon depart.\nVeuillez présiser un salon de depart`)
                .setTimestamp();
            return message.followUp({embeds: [embedInconnue]})
            .then((send) => {
                setTimeout(() => {
                    send.delete();
                }, 3000);
            });
        }
        let cathegorieprivateroom = args.getChannel("cathegorieprivateroom");
        if(!cathegorieprivateroom){
            const embedInconnue = new Discord.EmbedBuilder()
                .setTitle(`Inconnue`)
                .setColor("#ff9a00")
                .setDescription(`Pas de cathégoriegorie privateroom.\nVeuillez présiser une cathégorie de privateroom`)
                .setTimestamp();
            return message.followUp({embeds: [embedInconnue]})
            .then((send) => {
                setTimeout(() => {
                    send.delete();
                }, 3000);
            });
        }
        let cathegorieticket = args.getChannel("cathegorieticket");
        if(!cathegorieticket){
            const embedInconnue = new Discord.EmbedBuilder()
                .setTitle(`Inconnue`)
                .setColor("#ff9a00")
                .setDescription(`Pas de cathegorie ticket.\nVeuillez présiser une cathégorie de ticket`)
                .setTimestamp();
            return message.followUp({embeds: [embedInconnue]})
            .then((send) => {
                setTimeout(() => {
                    send.delete();
                }, 3000);
            });
        }
        let colorDanger = args.getString("colordanger");
        if(!colorDanger){
            const embedInconnue = new Discord.EmbedBuilder()
                .setTitle(`Inconnue`)
                .setColor("#ff9a00")
                .setDescription(`Pas de colorDanger.\nVeuillez présiser une coleur de danger`)
                .setTimestamp();
            return message.followUp({embeds: [embedInconnue]})
            .then((send) => {
                setTimeout(() => {
                    send.delete();
                }, 3000);
            });
        }
        let colorWarn = args.getString("colorwarn");
        if(!colorWarn){
            const embedInconnue = new Discord.EmbedBuilder()
                .setTitle(`Inconnue`)
                .setColor("#ff9a00")
                .setDescription(`Pas de colorWarn.\nVeuillez présiser une coleur de warn`)
                .setTimestamp();
            return message.followUp({embeds: [embedInconnue]})
            .then((send) => {
                setTimeout(() => {
                    send.delete();
                }, 3000);
            });
        }
        let colorBase = args.getString("colorbase");
        if(!colorBase){
            const embedInconnue = new Discord.EmbedBuilder()
                .setTitle(`Inconnue`)
                .setColor("#ff9a00")
                .setDescription(`Pas de colorBase.\nVeuillez présiser une coleur de base`)
                .setTimestamp();
            return message.followUp({embeds: [embedInconnue]})
            .then((send) => {
                setTimeout(() => {
                    send.delete();
                }, 3000);
            });
        }

        let lien = args.getString("lien");
        if(!lien){
            const embedInconnue = new Discord.EmbedBuilder()
                .setTitle(`Inconnue`)
                .setColor("#ff9a00")
                .setDescription(`Pas de lien.\nVeuillez présiser un le lien du serveur`)
                .setTimestamp();
            return message.followUp({embeds: [embedInconnue]})
            .then((send) => {
                setTimeout(() => {
                    send.delete();
                }, 3000);
            });
        }

        const data = require("../data.json");
    
            let dataconfig = {
                guildID: message.guild.id,
                logs: salonlogs,
                arriver: salonarriver,
                depart: salondepart,
                privateroom: cathegorieprivateroom,
                ticket: cathegorieticket,
                colorDanger: colorDanger,
                colorWarn: colorWarn,
                colorBase: colorBase,
                lien: lien,
                emoji: null,
            };

            data.push(dataconfig);

        fs.writeFile("data.json", JSON.stringify(data), err => {
            
            if (err) throw err; 

        });

        message.followUp("Initialisation du bot terminé.")
        .then((send) => {
            setTimeout(() => {
                send.delete();
            }, 3000);
        });
    }
}