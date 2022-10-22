const Discord = require("discord.js");
const data = require("../data.json");
const warns = require("../warns.json");
const fs = require('fs');

module.exports = {

    name: "unwarn",
    description: "Permet de unwarn un utilisateur",
    permission: Discord.PermissionFlagsBits.MuteMembers,
    dm: false,
    category: "Moderation",
    options: [
        {
            type: "user",
            name: "member",
            description: "Le membre à unwarn",
            required: true,
            autocomplete: false,
        },
        {
            type: "string",
            name: "raison",
            description: "La raison du unwarn",
            required: false,
            autocomplete: false,
        }
    ],

    async run(bot, message, args){

        try {
            await message.deferReply();
            const guild = message.guild;
            
            for (let i = 0; i < data.length; i++) {
                if(data[i].guildID == guild.id){
                    const channel = message.guild.channels.cache.find(channel => channel.name === data[i].logs.name);
                    if(!channel) return;
                    let user = args.getUser("member");
                    if(!user){
                        const embedInconnue = new Discord.EmbedBuilder()
                            .setTitle(`Membre inconnu`)
                            .setColor(data[i].colorWarn)
                            .setDescription(`Pas de membre a unwarn.\nVeuillez préciser un utilisateur`)
                            .setTimestamp();
                        return message.followUp({embeds: [embedInconnue]})
                        .then((send) => {
                            setTimeout(() => {
                                send.delete();
                            }, 3000);
                        });
                    }

                    let member = message.guild.members.cache.get(user.id);

                    let reason = args.getString("raison");
                    if(!reason) reason = "Pas de raison fournie.";

                    if(message.user.id == user.id) {
                        const embedWarn = new Discord.EmbedBuilder()
                            .setTitle(`Vous unwarn vous même ? N'y comptez pas !`)
                            .setColor(data[i].colorWarn)
                            .setDescription(`Vous ne pouvez pas vous unwarn vous même !`)
                            .setTimestamp();
                        return message.followUp({embeds: [embedWarn]})
                        .then((send) => {
                            setTimeout(() => {
                                send.delete();
                            }, 3000);
                        });
                    }

                    if((await message.guild.fetchOwner()).id == user.id){
                        const embedWarn = new Discord.EmbedBuilder()
                            .setTitle(`Pas de membre a unwarn !`)
                            .setColor(data[i].colorWarn)
                            .setDescription(`Vous ne pouvez pas unwarn le propriétaire du serveur!`)
                            .setTimestamp();
                        return message.followUp({embeds: [embedWarn]})
                        .then((send) => {
                            setTimeout(() => {
                                send.delete();
                            }, 3000);
                        });
                    }

                    if(member.isCommunicationDisabled()){
                        const embedWarn = new Discord.EmbedBuilder()
                            .setTitle(`Membre mute !`)
                            .setColor(data[i].colorWarn)
                            .setDescription(`Vous ne pouvez pas unwarn un member qui est mute!`)
                            .setTimestamp();
                        return message.followUp({embeds: [embedWarn]})
                        .then((send) => {
                            setTimeout(() => {
                                send.delete();
                            }, 3000);
                        });
                    }

                    if (!warns[user.id]) {
                        const embedInconnue = new Discord.EmbedBuilder()
                            .setTitle(`Inconnue`)
                            .setColor(data[i].colorWarn)
                            .setDescription(`Pas de membre a unwarn.\nCette utilisateur n'est pas warn.`)
                            .setTimestamp();
                        return message.followUp({embeds: [embedInconnue]})
                        .then((send) => {
                            setTimeout(() => {
                                send.delete();
                            }, 3000);
                        });
                    } else {
                        warns[user.id].warnCount -= 1;

                        const embedUnWarnUser = new Discord.EmbedBuilder()
                            .setTitle(`Unwarn`)
                            .setColor(data[i].colorDanger)
                            .setDescription(`Tu as été unwarn du serveur ${message.guild.name} par ${message.user.tag} pour la raison: \`${reason}\`\n(**${warns[user.id].warnCount}**/**5**)`)
                            .setTimestamp();
                        await bot.users.cache.get(user.id).send({embeds: [embedUnWarnUser]});

                        const embedUnWarnInstance = new Discord.EmbedBuilder()
                            .setTitle(`Unwarn`)
                            .setColor(data[i].colorDanger)
                            .setDescription(`${message.user} a unwarn ${user} pour la raison : \`${reason}\`\n(**${warns[user.id].warnCount}**/**5**)`)
                            .setTimestamp();
                        await message.followUp({embeds: [embedUnWarnInstance]})
                        .then((send) => {
                            setTimeout(() => {
                                send.delete();
                            }, 3000);
                        });

                        const embedUnWarnServer = new Discord.EmbedBuilder()
                            .setTitle(`Unwarn`)
                            .setColor(data[i].colorDanger)
                            .setDescription(`${message.user} a unwarn ${user} pour la raison : \`${reason}\`\n(**${warns[user.id].warnCount}**/**5**)`)
                            .setTimestamp();
                        await channel.send({embeds: [embedUnWarnServer]});
                    }
            
                    fs.writeFile("./warns.json", JSON.stringify(warns), err => {
                        if (err) console.log(err);
                    });
                }
            }
        }
        catch (err){
            const guild = message.guild;
            
            for (let i = 0; i < data.length; i++) {
                if(data[i].guildID == guild.id){
                    let user = args.getUser("member");
                    const embedInconnue = new Discord.EmbedBuilder()
                        .setTitle(`Allo houston, nous avons un problème...`)
                        .setColor(data[i].colorDanger)
                        .setDescription(`Une erreur s'est produite lors de la tentative de unwarn ${user}`)
                        .setTimestamp();
                    await message.followUp({embeds: [embedInconnue]})
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