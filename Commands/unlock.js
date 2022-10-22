const Discord = require("discord.js");
const data = require("../data.json");

module.exports = {

    name: "unlock",
    description: "Permet de réouvrir un salon",
    permission: Discord.PermissionFlagsBits.ManageChannels,
    dm: false,
    category: "Moderation",
    options: [
        {
            type: "channel",
            name: "salon",
            description: "Le salon à réouvrir",
            required: true,
            autocomplete: true,
        },
        {
            type: "string",
            name: "raison",
            description: "La raison de la réouverture du salon",
            required: false,
            autocomplete: false,
        }
    ],

    async run(bot, message, args) {

        try {
            await message.deferReply();
            const guild = message.guild;
            
            for (let i = 0; i < data.length; i++) {
                if(data[i].guildID == guild.id){
                    const channelServer = message.guild.channels.cache.find(channel => channel.name === data[i].logs.name);
                    if(!channelServer) return;

                    let channel = args.getChannel("salon");
                    if(!channel) channel = message.channel;
            
                    let reason = args.getString("raison");
                    if(!reason) reason = "Pas de raison fournie.";

                    if(channel.id != message.channel.id && !message.guild.channels.cache.get(channel.id)) {
                        const embedInconnue = new Discord.EmbedBuilder()
                            .setTitle(`Salon inconnu`)
                            .setColor(data[i].colorWarn)
                            .setDescription(`Pas de salon.\nVeuillez préciser un salon existant`)
                            .setTimestamp();
                        return message.followUp({embeds: [embedInconnue]})
                        .then((send) => {
                            setTimeout(() => {
                                send.delete();
                            }, 3000);
                        });
                    }

                    const embedOpen = new Discord.EmbedBuilder()
                        .setTitle(`Salon Ouvert !`)
                        .setColor(data[i].colorDanger)
                        .setDescription(`Le salon ${channel} est désormais ouvert.\nRaison: \`${reason}\``)
                        .setTimestamp();
                    await channel.send({embeds: [embedOpen]});

                    const embedSalonOpen = new Discord.EmbedBuilder()
                        .setTitle(`Salon Ouvert !`)
                        .setColor(data[i].colorDanger)
                        .setDescription(`Le salon ${channel} est désormais ouvert.\nRaison: \`${reason}\``)
                        .setTimestamp();
                    await message.channel.send({embeds: [embedSalonOpen]})
                    .then((send) => {
                        setTimeout(() => {
                            send.delete();
                        }, 3000);
                    });

                    const embedServerOpen = new Discord.EmbedBuilder()
                        .setTitle(`Salon Ouvert !`)
                        .setColor(data[i].colorDanger)
                        .setDescription(`Le salon ${channel} est désormais ouvert.\nRaison: \`${reason}\``)
                        .setTimestamp();
                    await channelServer.send({embeds: [embedServerOpen]})

                    channel.permissionOverwrites.edit(
                        channel.guild.roles.everyone, {
                        SendMessages: true
                    })
                }
            }
        }
        catch(err) {
            const guild = message.guild;
            
            for (let i = 0; i < data.length; i++) {
                if(data[i].guildID == guild.id){
                    let channel = args.getChannel("salon");
                    if(!channel) channel = message.channel;
                    const embedInconnue = new Discord.EmbedBuilder()
                        .setTitle(`Allo houston, nous avons un problème...`)
                        .setColor(data[i].colorDanger)
                        .setDescription(`Une erreur s'est porduite lors de la tentative d'ouvrir' le salon ${channel}`)
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
};