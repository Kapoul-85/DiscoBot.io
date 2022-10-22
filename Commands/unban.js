const Discord = require("discord.js");
const data = require("../data.json");

module.exports = {

    name: "unban",
    description: "Permet de débannir un utilisateur",
    permission: Discord.PermissionFlagsBits.BanMembers,
    dm: false,
    category: "Moderation",
    options: [
        {
            type: "user",
            name: "utilisateur",
            description: "L'utilisateur à débannir",
            required: true,
            autocomplete: false,
        },
        {
            type: "string",
            name: "raison",
            description: "La raison du débannissement",
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
                    let user = args.getUser("utilisateur");

                    if(!user){
                        const embedInconnue = new Discord.EmbedBuilder()
                            .setTitle(`Inconnue`)
                            .setColor(data[i].colorWarn)
                            .setDescription(`Pas de membre a unBan.\nVeuillez présiser un utilisateur`)
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
                            .setTitle(`Pas de membre a unBan !`)
                            .setColor(data[i].colorWarn)
                            .setDescription(`Vous ne pouvez pas vous unBan vous même !`)
                            .setTimestamp();
                        return message.followUp({embeds: [embedWarn]})
                        .then((send) => {
                            setTimeout(() => {
                                send.delete();
                            }, 3000);
                        });
                    }
                    
                    if(member && message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
                        const embedWarn = new Discord.EmbedBuilder()
                            .setTitle(`Pas de membre a unBan !`)
                            .setColor(data[i].colorWarn)
                            .setDescription(`Vous ne pouvez pas unBan cette personne!`)
                            .setTimestamp();
                        return message.followUp({embeds: [embedWarn]})
                        .then((send) => {
                            setTimeout(() => {
                                send.delete();
                            }, 3000);
                        });
                    }

                    if((await message.guild.bans.fetch()).get(user)) {
                        const embedWarn = new Discord.EmbedBuilder()
                            .setTitle(`Pas de membre a unBan !`)
                            .setColor(data[i].colorWarn)
                            .setDescription(`${user} n'est pas ban !`)
                            .setTimestamp();
                        return message.followUp({embeds: [embedWarn]})
                        .then((send) => {
                            setTimeout(() => {
                                send.delete();
                            }, 3000);
                        });
                    }

                    try {
                        const embedClientBan = new Discord.EmbedBuilder()
                            .setTitle(`UnBan`)
                            .setColor(data[i].colorDanger)
                            .setDescription(`Tu as été unBan du serveur ${message.guild.name} par ${message.user.tag} pour la raison: \`${reason}\``)
                            .setTimestamp();
                        await bot.users.cache.get(user.id).send({embeds: [embedClientBan]});
                    }
                    catch(err) {}

                    
                    const embedBanInstance = new Discord.EmbedBuilder()
                        .setTitle(`UnBan`)
                        .setColor(data[i].colorDanger)
                        .setDescription(`${message.user} a unban ${user} pour la raison : \`${reason}\``)
                        .setTimestamp();
                    await message.followUp({embeds: [embedBanInstance]})
                    .then((send) => {
                        setTimeout(() => {
                            send.delete();
                        }, 3000);
                    });

                    const embedBanLogs = new Discord.EmbedBuilder()
                        .setTitle(`UnBan`)
                        .setColor(data[i].colorDanger)
                        .setDescription(`${message.user} a unban ${user} pour la raison : \`${reason}\``)
                        .setTimestamp();
                    await channel.send({embeds: [embedBanLogs]});

                    await message.guild.members.unban(user, {reason: reason});
                }
            }
        }
        catch (err){
            const guild = message.guild;
            
            for (let i = 0; i < data.length; i++) {
                if(data[i].guildID == guild.id){
                let user = args.getUser("utilisateur");
                const embedInconnue = new Discord.EmbedBuilder()
                        .setTitle(`Pas de membre a unBan! erreur`)
                        .setColor(data[i].colorDanger)
                        .setDescription(`Une erreur c'est porduite lors de la tantative de unBan ${user}`)
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