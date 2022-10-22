const Discord = require('discord.js');
const data = require("../data.json");

module.exports = {

    name: "mp",
    description: "Permet d'envoyer un mp avec le bot'",
    permission: Discord.PermissionFlagsBits.ManageChannels,
    dm: false,
    category: "Moderation",
    options: [
        {
            type: "user",
            name: "member",
            description: "Le membre à qui vous voulez envoyer le message",
            required: true,
            autocomplete: false,
        },
        {
            type: "string",
            name: "message",
            description: "Le message à envoyer",
            required: true,
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
                    let messageBot = args.getString("message");
                    
                    if(!user.id){
                        const embedInconnue = new Discord.EmbedBuilder()
                            .setTitle(`Membre inconnu`)
                            .setColor(data[i].colorWarn)
                            .setDescription(`Pas de membre a envoyer le message.\nVeuillez préciser un utilisateur présent sur le serveur`)
                            .setTimestamp();
                        return message.followUp({embeds: [embedInconnue]})
                        .then((send) => {
                            setTimeout(() => {
                                send.delete();
                            }, 3000);
                        });
                    }

                    if(!messageBot){
                        const embedInconnue = new Discord.EmbedBuilder()
                            .setTitle(`Message inconnu`)
                            .setColor(data[i].colorWarn)
                            .setDescription(`Pas de message.\nVeuillez préciser un message`)
                            .setTimestamp();
                        return message.followUp({embeds: [embedInconnue]})
                        .then((send) => {
                            setTimeout(() => {
                                send.delete();
                            }, 3000);
                        });
                    }

                    setTimeout(() => {
                        channel.bulkDelete(1);
                    });

                    const embedMP = new Discord.EmbedBuilder()
                        .setTitle(`Mp de ${message.user.tag}`)
                        .setColor(data[i].colorBase)
                        .addFields(
                            {name: `Message: `, value: messageBot},
                            {name: `Du serveur: `, value: message.guild.name}
                            )
                        .setTimestamp();
                    await bot.users.cache.get(user.id).send({embeds: [embedMP]});

                    const embedMPInstance = new Discord.EmbedBuilder()
                    .setTitle(`Mp de ${message.user.username}`)
                    .setColor(data[i].colorBase)
                    .addFields(
                        {name: `Message: `, value: messageBot},
                        {name: "a", value: `${user}`}
                        )
                    .setTimestamp();
                    await message.followUp({embeds: [embedMPInstance]});

                    const embedMPServer = new Discord.EmbedBuilder()
                        .setTitle(`Mp de ${message.user.username}`)
                        .setColor(data[i].colorBase)
                        .addFields(
                            {name: `Message: `, value: messageBot},
                            {name: "a", value: `${user}`}
                            )
                        .setTimestamp();
                    await channel.send({embeds: [embedMPServer]});
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
                        .setDescription(`Une erreur s'est produite lors de la tentative d'envoyer un message à ${user}`)
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