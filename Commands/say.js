const Discord = require('discord.js');
const data = require("../data.json");

module.exports = {

    name: "say",
    description: "Permet d'envoyer un message avec le bot'",
    permission: Discord.PermissionFlagsBits.ManageMessages,
    dm: false,
    category: "Moderation",
    options: [
        {
            type: "string",
            name: "message",
            description: "Le message a envoyer",
            required: true,
            autocomplete: false,
        },
        {
            type: "channel",
            name: "salon",
            description: "Le salon à envoyer le message",
            required: false,
            autocomplete: true,
        }
    ],

    async run(bot, message, args){

        try {
            await message.deferReply();
            const guild = message.guild;
            
            for (let i = 0; i < data.length; i++) {
                if(data[i].guildID == guild.id){
                    let channel = args.getChannel("salon");
                    if(!channel) channel = message.channel;
                    let messageBot = args.getString("message");
                    
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
                        message.channel.send(messageBot);
                    });
                }
            }
        }
        catch (err){
            const guild = message.guild;
            
            for (let i = 0; i < data.length; i++) {
                if(data[i].guildID == guild.id){
                    const embedInconnue = new Discord.EmbedBuilder()
                        .setTitle(`Allo houston, nous avons un problème...`)
                        .setColor(data[i].colorDanger)
                        .setDescription(`Une erreur s'est produite lors de la tentative d'envoyer un message.`)
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