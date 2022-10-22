const Discord = require("discord.js");
const data = require("../data.json");

module.exports = {

    name: "create-private-room",
    description: "Permet de créé un private room",
    permission: Discord.PermissionFlagsBits.SendMessages,
    dm: false,
    category: "PrivateRoom",
    options: [
        {
            type: "string",
            name: "salontype",
            description: "Le type de salon que vous souhaiter crééer voice ou text",
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
                    let typeChannel = args.getString("salontype");
                    const SalonIDPrivateRoom = message.guild.channels.cache.find(channel => channel.name === data[i].privateroom.name);
                    if(!SalonIDPrivateRoom) return;

                    const user = message.user.username.toLowerCase();

                    if(!typeChannel){
                        const embedInconnue = new Discord.EmbedBuilder()
                            .setTitle(`Inconnue`)
                            .setColor(data[i].colorWarn)
                            .setDescription(`Pas de type de salon séléctionner.\nVeuillez présiser un type de salon \`voice\` ou \`text\``)
                            .setTimestamp();
                        return message.followUp({embeds: [embedInconnue]})
                        .then((send) => {
                            setTimeout(() => {
                                send.delete();
                            }, 3000);
                        });
                    }
                    if(!typeChannel == "voice"){
                        const embedInconnue = new Discord.EmbedBuilder()
                            .setTitle(`Inconnue`)
                            .setColor(data[i].colorWarn)
                            .setDescription(`Type de salon innéxsitant ou mal écrit.\nVeuillez présiser un type de salon \`voice\` ou \`text\``)
                            .setTimestamp();
                        await message.followUp({embeds: [embedInconnue]})
                        .then((send) => {
                            setTimeout(() => {
                                send.delete();
                            }, 3000);
                        });
                    }
                    if(!typeChannel == "text"){
                        const embedInconnue = new Discord.EmbedBuilder()
                            .setTitle(`Inconnue`)
                            .setColor(data[i].colorWarn)
                            .setDescription(`Type de salon innéxsitant ou mal écrit.\nVeuillez présiser un type de salon \`voice\` ou \`text\``)
                            .setTimestamp();
                        await message.followUp({embeds: [embedInconnue]})
                        .then((send) => {
                            setTimeout(() => {
                                send.delete();
                            }, 3000);
                        });
                    }
                    else if(typeChannel == "voice"){
                        message.guild.channels.create({
                            name: `private-room-${user}`,
                            permissionOverwrites: [
                                {
                                    id: message.user.id,
                                    allow: [Discord.PermissionFlagsBits.SendMessages, Discord.PermissionFlagsBits.ViewChannel, Discord.PermissionFlagsBits.Speak, Discord.PermissionFlagsBits.Connect, Discord.PermissionFlagsBits.PrioritySpeaker, Discord.PermissionFlagsBits.Stream],
                                },
                                {
                                    id: message.guild.roles.everyone,
                                    deny: [Discord.PermissionFlagsBits.ViewChannel],
                                }
                            ],
                            type: Discord.ChannelType.GuildVoice,
                            parent: SalonIDPrivateRoom,
                        });
                        return message.followUp({content: "Private room créé", ephemeral: true})
                        .then((send) => {
                            setTimeout(() => {
                                send.delete();
                            }, 3000);
                        });
                    }
                    else if(typeChannel == "text"){
                        message.guild.channels.create({
                            name: `private-room-${user}`,
                            permissionOverwrites: [
                                {
                                    id: message.user.id,
                                    allow: [Discord.PermissionFlagsBits.SendMessages, Discord.PermissionFlagsBits.ViewChannel, Discord.PermissionFlagsBits.Speak, Discord.PermissionFlagsBits.Connect, Discord.PermissionFlagsBits.PrioritySpeaker, Discord.PermissionFlagsBits.Stream],
                                },
                                {
                                    id: message.guild.roles.everyone,
                                    deny: [Discord.PermissionFlagsBits.ViewChannel],
                                }
                            ],
                            type: Discord.ChannelType.GuildText,
                            parent: SalonIDPrivateRoom,
                        });
                        return message.followUp({content: "Private room créé", ephemeral: true})
                        .then((send) => {
                            setTimeout(() => {
                                send.delete();
                            }, 3000);
                        });
                    }
                }
            }
        }
        catch (err){
            const guild = message.guild;
            
            for (let i = 0; i < data.length; i++) {
                if(data[i].guildID == guild.id){
                    const embedInconnue = new Discord.EmbedBuilder()
                        .setTitle(`Pas de private room a créé! erreur`)
                        .setColor(data[i].colorDanger)
                        .setDescription(`Une erreur c'est porduite lors de la tantative de créé votre private room`)
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