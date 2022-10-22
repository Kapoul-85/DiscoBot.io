const Discord = require("discord.js");
const data = require("../data.json");

module.exports = {

    name: "unmute",
    description: "Permet de démute un utilisateur",
    permission: Discord.PermissionFlagsBits.MuteMembers,
    dm: false,
    category: "Moderation",
    options: [
        {
            type: "user",
            name: "member",
            description: "Le membre à unmute",
            required: true,
            autocomplete: false,
        },
        {
            type: "string",
            name: "raison",
            description: "La raison du unmute",
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
                            .setTitle(`Utilisateur Inconnu`)
                            .setColor(data[i].colorWarn)
                            .setDescription(`Pas de membre a unmute.\nVeuillez préciser un utilisateur`)
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
                            .setTitle(`Vous démute vous même ? N'y comptez pas !`)
                            .setColor(data[i].colorWarn)
                            .setDescription(`Vous ne pouvez pas vous unmute vous même !`)
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
                            .setTitle(`Ce membre ne peut pas être unmute !`)
                            .setColor(data[i].colorWarn)
                            .setDescription(`Vous ne pouvez pas unmute le propriétaire du serveur!`)
                            .setTimestamp();
                        return message.followUp({embeds: [embedWarn]})
                        .then((send) => {
                            setTimeout(() => {
                                send.delete();
                            }, 3000);
                        });
                    }
                
                    if(!member.isCommunicationDisabled()) {
                        const embedWarn = new Discord.EmbedBuilder()
                            .setTitle(`Pas de membre a unmute !`)
                            .setColor(data[i].colorWarn)
                            .setDescription(`${user} n'est pas mute !`)
                            .setTimestamp();
                        return message.followUp({embeds: [embedWarn]})
                        .then((send) => {
                            setTimeout(() => {
                                send.delete();
                            }, 3000);
                        });
                    }

                    try {
                        const embedBan = new Discord.EmbedBuilder()
                            .setTitle(`UnMute`)
                            .setColor(data[i].colorDanger)
                            .setDescription(`Tu as été unMute du serveur ${message.guild.name} par ${message.user.tag} pour la raison: \`${reason}\``)
                            .setTimestamp();
                        await bot.users.cache.get(user).send({embeds: [embedBan]});
                    }
                    catch(err) {}

                    const embedBanInstance = new Discord.EmbedBuilder()
                        .setTitle(`UnMute`)
                        .setColor(data[i].colorDanger)
                        .setDescription(`${message.user} a unMute ${user} pour la raison : \`${reason}\``)
                        .setTimestamp();
                    await message.followUp({embeds: [embedBanInstance]})
                    .then((send) => {
                        setTimeout(() => {
                            send.delete();
                        }, 3000);
                    });

                    const embedBan = new Discord.EmbedBuilder()
                        .setTitle(`UnMute`)
                        .setColor(data[i].colorDanger)
                        .setDescription(`${message.user} a unMute ${user} pour la raison : \`${reason}\``)
                        .setTimestamp();
                    await channel.send({embeds: [embedBan]});

                    await member.timeout(null, reason);
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
                        .setDescription(`Une erreur c'est porduite lors de la tantative de unMute ${user}`)
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