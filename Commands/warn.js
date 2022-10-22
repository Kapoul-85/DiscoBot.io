const Discord = require("discord.js");
const data = require("../data.json");
const fs = require('fs');
const ms = require("ms");

module.exports = {

    name: "warn",
    description: "Permet de warn un utilisateur",
    permission: Discord.PermissionFlagsBits.MuteMembers,
    dm: false,
    category: "Moderation",
    options: [
        {
            type: "user",
            name: "member",
            description: "Le membre à warn",
            required: true,
            autocomplete: false,
        },
        {
            type: "string",
            name: "raison",
            description: "La raison du warn",
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

                    let convertedTime = ms("1d");

                    if(!user){
                        const embedInconnue = new Discord.EmbedBuilder()
                            .setTitle(`Membre inconnu`)
                            .setColor(data[i].colorWarn)
                            .setDescription(`Pas de membre a warn.\nVeuillez préciser un utilisateur`)
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
                            .setTitle(`Pas de membre a warn !`)
                            .setColor(data[i].colorWarn)
                            .setDescription(`Vous ne pouvez pas vous warn vous même !`)
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
                            .setTitle(`Ce membre ne peut pas être warn !`)
                            .setColor(data[i].colorWarn)
                            .setDescription(`Vous ne pouvez pas warn le propriétaire du serveur!`)
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
                            .setDescription(`Vous ne pouvez pas warn un membre qui est mute!`)
                            .setTimestamp();
                        return message.followUp({embeds: [embedWarn]})
                        .then((send) => {
                            setTimeout(() => {
                                send.delete();
                            }, 3000);
                        });
                    }

                    const warn = require("../warns.json");

                    for (let i = 0; i < warn.length; i++) {
                        if(warn[i].guildID == guild.id && warn[i].userID == user.id){
                            warn[i].warnCount += 1;
                            if(warn[i].warnCount >= 5) {
                                const embedWarnUser = new Discord.EmbedBuilder()
                                    .setTitle(`Mute`)
                                    .setColor(data[i].colorDanger)
                                    .setDescription(`Tu as été warn du serveur ${message.guild.name} par ${message.user.tag} pour la raison: \`${reason}\`(**5**/**5**)\nTu est désormais mute pendants 1 jour.`)
                                    .setTimestamp();
                                await bot.users.cache.get(user.id).send({embeds: [embedWarnUser]});
        
                                const embedWarnInstance = new Discord.EmbedBuilder()
                                    .setTitle(`Mute`)
                                    .setColor(data[i].colorDanger)
                                    .setDescription(`${message.user} a warn ${user} pour la raison : \`${reason}\`\n(**5**/**5**) ${user} est désormais mute pendants 1 jour.`)
                                    .setTimestamp();
                                await message.followUp({embeds: [embedWarnInstance]});
        
                                const embedWarnServer = new Discord.EmbedBuilder()
                                    .setTitle(`Mute`)
                                    .setColor(data[i].colorDanger)
                                    .setDescription(`${message.user} a warn ${user} pour la raison : \`${reason}\`\n(**5**/**5**) ${user} est désormais mute pendants 1 jour.`)
                                    .setTimestamp();
                                await channel.send({embeds: [embedWarnServer]});
        
                                warn[i].warnCount = 0;
        
                                await member.timeout(convertedTime, reason);
                    
                            } else {
                                const embedWarnUser = new Discord.EmbedBuilder()
                                    .setTitle(`Warn`)
                                    .setColor(data[i].colorDanger)
                                    .setDescription(`Tu as été warn du serveur ${message.guild.name} par ${message.user.tag} pour la raison: \`${reason}\`\n(**${warns[user.id].warnCount}**/**5**)`)
                                    .setTimestamp();
                                await bot.users.cache.get(user.id).send({embeds: [embedWarnUser]});
        
                                const embedWarnInstance = new Discord.EmbedBuilder()
                                    .setTitle(`Warn`)
                                    .setColor(data[i].colorDanger)
                                    .setDescription(`${message.user} a warn ${user} pour la raison : \`${reason}\`\n(**${warns[user.id].warnCount}**/**5**)`)
                                    .setTimestamp();
                                await message.followUp({embeds: [embedWarnInstance]})
                                .then((send) => {
                                    setTimeout(() => {
                                        send.delete();
                                    }, 3000);
                                });
        
                                const embedWarnServer = new Discord.EmbedBuilder()
                                    .setTitle(`Warn`)
                                    .setColor(data[i].colorDanger)
                                    .setDescription(`${message.user} a warn ${user} pour la raison : \`${reason}\`\n(**${warns[user.id].warnCount}**/**5**)`)
                                    .setTimestamp();
                                await channel.send({embeds: [embedWarnServer]});
                            }
                        }
                        else{
                            let warnData = {
                                guildID: guild.id,
                                author: message.user.username,
                                authorID: message.user.id,
                                raison: reason,
                                userID: user.id,
                                warnCount: 1, 
                            };
    
                            warn.push(warnData);

                            const embedWarnUser = new Discord.EmbedBuilder()
                                    .setTitle(`Warn`)
                                    .setColor(data[i].colorDanger)
                                    .setDescription(`Tu as été warn du serveur ${message.guild.name} par ${message.user.tag} pour la raison: \`${reason}\`\n(**${warns[user.id].warnCount}**/**5**)`)
                                    .setTimestamp();
                            await bot.users.cache.get(user.id).send({embeds: [embedWarnUser]});
    
                            const embedWarnInstance = new Discord.EmbedBuilder()
                                .setTitle(`Warn`)
                                .setColor(data[i].colorDanger)
                                .setDescription(`${message.user} a warn ${user} pour la raison : \`${reason}\`\n(**${warns[user.id].warnCount}**/**5**)`)
                                .setTimestamp();
                            await message.followUp({embeds: [embedWarnInstance]})
                            .then((send) => {
                                setTimeout(() => {
                                    send.delete();
                                }, 3000);
                            });
    
                            const embedWarnServer = new Discord.EmbedBuilder()
                                .setTitle(`Warn`)
                                .setColor(data[i].colorDanger)
                                .setDescription(`${message.user} a warn ${user} pour la raison : \`${reason}\`\n(**${warns[user.id].warnCount}**/**5**)`)
                                .setTimestamp();
                            await channel.send({embeds: [embedWarnServer]});
                        }
                    }

                    fs.writeFile("./warns.json", JSON.stringify(warn), err => {
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
                        .setDescription(`Une erreur s'est produite lors de la tentative de warn ${user}`)
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