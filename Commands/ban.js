const Discord = require("discord.js");
const data = require("../data.json");

module.exports = {
    name: "ban",
    description: "Permet de ban un utilisateur",
    permission: Discord.PermissionFlagsBits.BanMembers,
    dm: false,
    category: "Moderation",
    options: [
        {
            type: "user",
            name: "member",
            description: "Le membre à bannir",
            required: true,
            autocomplete: false,
        },
        {
            type: "string",
            name: "raison",
            description: "La raison du bannissement",
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
                    let user = args.getUser("member");
                    const channel = message.guild.channels.cache.find(channel => channel.name === data[i].logs.name);
                    if(!channel) return;

                    if(!user.id){
                        const embedInconnue = new Discord.EmbedBuilder()
                            .setTitle(`Inconnue`)
                            .setColor(data[i].colorWarn)
                            .setDescription(`Pas de membre a bannir.\nVeuillez présiser un utilisateur`)
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
                            .setTitle(`Pas de membre a bannir !`)
                            .setColor(data[i].colorWarn)
                            .setDescription(`Vous ne pouvez pas vous bannir vous même !`)
                            .setTimestamp();
                        return message.followUp({embeds: [embedWarn]})
                        .then((send) => {
                            setTimeout(() => {
                                send.delete();
                            }, 3000);
                        });
                    }

                    if(member && !member.bannable) {
                        const embedWarn = new Discord.EmbedBuilder()
                            .setTitle(`Pas de membre a Ban !`)
                            .setColor(data[i].colorWarn)
                            .setDescription(`Je ne peux pas Ban cette personne !`)
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
                            .setTitle(`Pas de membre a bannir !`)
                            .setColor(data[i].colorWarn)
                            .setDescription(`Vous ne pouvez pas bannir le propriétaire du serveur!`)
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
                            .setTitle(`Pas de membre a bannir !`)
                            .setColor(data[i].colorWarn)
                            .setDescription(`${user} est déja bannie !`)
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
                            .setTitle(`Bannie`)
                            .setColor(data[i].colorDanger)
                            .setDescription(`Tu as été banni du serveur ${message.guild.name} par ${message.user.tag} pour la raison: \`${reason}\``)
                            .setTimestamp();
                        await bot.users.cache.get(user.id).send({embeds: [embedBan]});
                    }
                    catch(err) {}

                    const embedBanInstance = new Discord.EmbedBuilder()
                        .setTitle(`Banni`)
                        .setColor(data[i].colorDanger)
                        .setDescription(`${message.user} a banni ${user} pour la raison : \`${reason}\``)
                        .setTimestamp();
                    await message.followUp({embeds: [embedBanInstance]})
                    .then((send) => {
                        setTimeout(() => {
                            send.delete();
                        }, 3000);
                    });

                    const embedBan = new Discord.EmbedBuilder()
                        .setTitle(`Banni`)
                        .setColor(data[i].colorDanger)
                        .setDescription(`${message.user} a banni ${user} pour la raison : \`${reason}\``)
                        .setTimestamp();
                    await channel.send({embeds: [embedBan]});

                    await message.guild.members.ban(user, {reason: reason});
                }
            }
        }
        catch (err){
            let user = args.getUser("member");
            const embedInconnue = new Discord.EmbedBuilder()
                .setTitle(`Pas de membre a bannir! erreur`)
                .setColor(data[i].colorDanger)
                .setDescription(`Une erreur c'est porduite lors de la tantative de bannir ${user}`)
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