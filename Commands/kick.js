const Discord = require("discord.js");
const data = require("../data.json");

module.exports = {

    name: "kick",
    description: "Permet de kick un utilisateur",
    permission: Discord.PermissionFlagsBits.KickMembers,
    dm: false,
    category: "Moderation",
    options: [
        {
            type: "user",
            name: "member",
            description: "Le membre à kick",
            required: true,
            autocomplete: false,
        },
        {
            type: "string",
            name: "raison",
            description: "La raison du kick",
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

                    if(!user){
                        const embedInconnue = new Discord.EmbedBuilder()
                            .setTitle(`Membre inconnu`)
                            .setColor(data[i].colorWarn)
                            .setDescription(`Membre à kick inconnu.\nVeuillez préciser un utilisateur`)
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
                            .setTitle(`Pas de membre à kick !`)
                            .setColor(data[i].colorWarn)
                            .setDescription(`Vous ne pouvez pas vous kick vous même !`)
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
                            .setTitle(`Pas de membre à kick !`)
                            .setColor(data[i].colorWarn)
                            .setDescription(`Vous ne pouvez pas kick le propriétaire du serveur!`)
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
                            .setTitle(`Pas de membre a kick !`)
                            .setColor(data[i].colorWarn)
                            .setDescription(`${user} est déja kick !`)
                            .setTimestamp();
                        return message.followUp({embeds: [embedWarn]})
                        .then((send) => {
                            setTimeout(() => {
                                send.delete();
                            }, 3000);
                        });
                    }

                    const embedUserKick = new Discord.EmbedBuilder()
                        .setTitle(`Kick`)
                        .setColor(data[i].colorDanger)
                        .setDescription(`Tu as été kick du serveur ${message.guild.name} par ${message.user.tag} pour la raison: \`${reason}\``)
                        .setTimestamp();
                    await bot.users.cache.get(user.id).send({embeds: [embedUserKick]});

                    const embedInstanceKick = new Discord.EmbedBuilder()
                        .setTitle(`Kick`)
                        .setColor(data[i].colorDanger)
                        .setDescription(`${message.user} a kick ${user} pour la raison : \`${reason}\``)
                        .setTimestamp();
                    await message.followUp({embeds: [embedInstanceKick]})
                    .then((send) => {
                        setTimeout(() => {
                            send.delete();
                        }, 3000);
                    });

                    const embedServerKick = new Discord.EmbedBuilder()
                        .setTitle(`Kick`)
                        .setColor(data[i].colorDanger)
                        .setDescription(`${message.user} a kick ${user} pour la raison : \`${reason}\``)
                        .setTimestamp();
                    await channel.send({embeds: [embedServerKick]});

                    await message.guild.members.kick(user, {reason: reason});
                }
            }
        }
        catch (err){
            const guild = message.guild;
            for (let i = 0; i < data.length; i++) {
                if(data[i].guildID == guild.id){
                    let user = args.getUser("member");
                    const embedInconnue = new Discord.EmbedBuilder()
                        .setTitle(`Pas de membre a kick! erreur`)
                        .setColor(data[i].colorDanger)
                        .setDescription(`Une erreur c'est porduite lors de la tantative de kick ${user}`)
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