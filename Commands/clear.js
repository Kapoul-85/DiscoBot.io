const Discord = require("discord.js");
const data = require("../data.json");

module.exports = {
    name: "clear",
    description: "clear message",
    permission: Discord.PermissionFlagsBits.ManageMessages,
    dm: false,
    category: "Moderation",
    options: [
        {
            type: "number",
            name: "nombre",
            description: "Le nombre de message a supprimer",
            required: true,
            autocomplete: false,
        },
        {
            type: "channel",
            name: "salon",
            description: "Le salon où vous voulez supprimer les messages",
            required: false,
            autocomplete: true,
        }
    ],

    async run(bot, message, args){

        await message.deferReply();
        const guild = message.guild;
            for (let i = 0; i < data.length; i++) {
                if(data[i].guildID == guild.id){
                let channel = args.getChannel("salon");
                if(!channel) channel = message.channel;

                if(channel.id != message.channel.id && !message.guild.channels.cache.get(channel.id)) {
                    const embedInconnue = new Discord.EmbedBuilder()
                        .setTitle(`Inconnue`)
                        .setColor(data[i].colorWarn)
                        .setDescription(`Pas de salon.\nVeuillez présiser un salon existant`)
                        .setTimestamp();
                    return message.followUp({embeds: [embedInconnue]})
                    .then((send) => {
                        setTimeout(() => {
                            send.delete();
                        }, 3000);
                    });
                }

                let number = args.getNumber("nombre");

                if(parseInt(number) <= 0) {
                    const embedWarn = new Discord.EmbedBuilder()
                        .setTitle(`Pas de message a supprimer !`)
                        .setColor(data[i].colorWarn)
                        .setDescription(`Nombre de message à supprimer doit ètre supperieur a 0!`)
                        .setTimestamp();
                    return message.followUp({embeds: [embedWarn]})
                    .then((send) => {
                        setTimeout(() => {
                            send.delete();
                        }, 3000);
                    });
                }

                if(parseInt(number) > 100) {
                    const embedWarn = new Discord.EmbedBuilder()
                        .setTitle(`Pas de message a supprimer !`)
                        .setColor(data[i].colorWarn)
                        .setDescription(`Nombre de message à supprimer doit ètre infférieur a 101!`)
                        .setTimestamp();
                    return message.followUp({embeds: [embedWarn]})
                    .then((send) => {
                        setTimeout(() => {
                            send.delete();
                        }, 3000);
                    });
                }

                try {
                    const messageDelete = number + 1;
                    let messages = await channel.bulkDelete(parseInt(messageDelete));

                    const embedDelete = new Discord.EmbedBuilder()
                        .setTitle(`Message supprimés !`)
                        .setColor(data[i].colorBase)
                        .setDescription(`J'ai bien supprimer ${messages.size} message(s) dans le salon ${channel} !`)
                        .setTimestamp();
                    return message.channel.send({embeds: [embedDelete]})
                    .then((send) => {
                        setTimeout(() => {
                            send.delete();
                        }, 3000);
                    });
                }
                catch (err){
                    const embedInconnue = new Discord.EmbedBuilder()
                        .setTitle(`Pas de messages a supprimer! erreur`)
                        .setColor(data[i].colorDanger)
                        .setDescription(`Une erreur s'est porduite lors de la tantative de supprimer les messages dans le salon ${channel}`)
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