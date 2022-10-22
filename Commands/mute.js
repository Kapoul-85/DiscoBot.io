const Discord = require("discord.js");
const data = require("../data.json");
const ms = require("ms");

module.exports = {

    name: "mute",
    description: "Permet de mute un utilisateur",
    permission: Discord.PermissionFlagsBits.MuteMembers,
    dm: false,
    category: "Moderation",
    options: [
        {
            type: "user",
            name: "member",
            description: "Le membre à mute",
            required: true,
            autocomplete: false,
        },
        {
            type: "string",
            name: "time",
            description: "Le temps du mute",
            required: true,
            autocomplete: false,
        },
        {
            type: "string",
            name: "raison",
            description: "La raison du mute",
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
                            .setTitle(`Inconnu`)
                            .setColor(data[i].colorWarn)
                            .setDescription(`Pas de membre a mute.\nVeuillez préciser un utilisateur`)
                            .setTimestamp();
                        return message.followUp({embeds: [embedInconnue]})
                        .then((send) => {
                            setTimeout(() => {
                                send.delete();
                            }, 3000);
                        });
                    }

                    let member = message.guild.members.cache.get(user.id);

                    let time = args.get("time").value;
                    if(!time) {
                        const embedTime = new Discord.EmbedBuilder()
                            .setTitle(`Pas de temps`)
                            .setColor(data[i].colorWarn)
                            .setDescription(`Pas de temps saisi.\nVeuillez préciser un temps`)
                            .setTimestamp();
                        return message.followUp({embeds: [embedTime]})
                        .then((send) => {
                            setTimeout(() => {
                                send.delete();
                            }, 3000);
                        });
                    }

                    let convertedTime = ms(time);
                    if(!convertedTime) {
                        const embedTime = new Discord.EmbedBuilder()
                            .setTitle(`Pas le bon format`)
                            .setColor(data[i].colorWarn)
                            .setDescription(`Le format du temps n'est pas valide.\nVeuillez préciser un temps valide`)
                            .setTimestamp();
                        return message.followUp({embeds: [embedTime]})
                        .then((send) => {
                            setTimeout(() => {
                                send.delete();
                            }, 3000);
                        });
                    }

                    let reason = args.getString("raison");
                    if(!reason) reason = "Pas de raison fournie.";

                    if(message.user.id == user.id) {
                        const embedWarn = new Discord.EmbedBuilder()
                            .setTitle(`Pas de membre a mute !`)
                            .setColor(data[i].colorWarn)
                            .setDescription(`Vous ne pouvez pas vous mute vous même !`)
                            .setTimestamp();
                        await message.followUp({embeds: [embedWarn]})
                        .then((send) => {
                            setTimeout(() => {
                                send.delete();
                            }, 3000);
                        });
                    }

                    if((await message.guild.fetchOwner()).id == user.id){
                        const embedWarn = new Discord.EmbedBuilder()
                            .setTitle(`Ce membre de peut pas être mute`)
                            .setColor(data[i].colorWarn)
                            .setDescription(`Vous ne pouvez pas mute le propriétaire du serveur !`)
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
                            .setDescription(`Vous ne pouvez pas mute un membre qui est mute!`)
                            .setTimestamp();
                        return message.followUp({embeds: [embedWarn]})
                        .then((send) => {
                            setTimeout(() => {
                                send.delete();
                            }, 3000);
                        });
                    }

                    try {
                        const embedMuteUser = new Discord.EmbedBuilder()
                            .setTitle(`Mute`)
                            .setColor(data[i].colorDanger)
                            .setDescription(`Tu as été mute du serveur ${message.guild.name} pendant \`${time}\` par ${message.user.tag} pour la raison: \`${reason}\``)
                            .setTimestamp();
                        await bot.users.cache.get(user.id).send({embeds: [embedMuteUser]});
                    }
                    catch(err) {}
                    
                    const embedMuteInstance = new Discord.EmbedBuilder()
                        .setTitle(`Mute`)
                        .setColor(data[i].colorDanger)
                        .setDescription(`${message.user} a mute ${user} pendant \`${time}\` pour la raison : \`${reason}\``)
                        .setTimestamp();
                    await message.followUp({embeds: [embedMuteInstance]})
                    .then((send) => {
                        setTimeout(() => {
                            send.delete();
                        }, 3000);
                    });

                    const embedMuteServer = new Discord.EmbedBuilder()
                        .setTitle(`Mute`)
                        .setColor(data[i].colorDanger)
                        .setDescription(`${message.user} a mute ${user} pendant \`${time}\` pour la raison : \`${reason}\``)
                        .setTimestamp();
                    await channel.send({embeds: [embedMuteServer]});

                    await member.timeout(convertedTime, reason);
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
                        .setDescription(`Une erreur s'est porduite lors de la tentative de mute ${user}`)
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