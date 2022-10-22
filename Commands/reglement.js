const Discord = require("discord.js");
const data = require("../data.json");
const fs = require("fs");

module.exports = {

    name: "reglement",
    description: "Permet d'ajouter une réaction qui donne un role",
    permission: Discord.PermissionFlagsBits.ManageMessages,
    dm: false,
    category: "Moderation",
    options: [
        {
            type: "role",
            name: "namerole",
            description: "Le nom du role a ajouter au membre",
            required: true,
            autocomplete: false,
        },
        {
            type: "string",
            name: "idmessage",
            description: "L'id du message de reglement",
            required: true,
            autocomplete: false,
        },
        {
            type: "string",
            name: "reaction",
            description: "La réaction a ajouter au message de reglement",
            required: true,
            autocomplete: false,
        }
    ],

    async run(bot, message, args) {

        await message.deferReply();
        const guild = message.guild;

        try {
            for (let i = 0; i < data.length; i++) {
                if(data[i].guildID == guild.id){
                    let rolename = args.getRole("namerole");
                    if(!rolename){
                        const embedInconnue = new Discord.EmbedBuilder()
                            .setTitle(`Inconnue`)
                            .setColor(data[i].colorWarn)
                            .setDescription(`Pas de role.\nVeuillez présiser le role a ajouter au membre`)
                            .setTimestamp();
                        return message.followUp({embeds: [embedInconnue]})
                        .then((send) => {
                            setTimeout(() => {
                                send.delete();
                            }, 3000);
                        });
                    }

                    let idmessage = args.getString("idmessage");
                    if(!idmessage){
                        const embedInconnue = new Discord.EmbedBuilder()
                            .setTitle(`Inconnue`)
                            .setColor(data[i].colorWarn)
                            .setDescription(`Pas d'id de message.\nVeuillez présiser l'id d'un message.`)
                            .setTimestamp();
                        return message.followUp({embeds: [embedInconnue]})
                        .then((send) => {
                            setTimeout(() => {
                                send.delete();
                            }, 3000);
                        });
                    }

                    let reaction = args.getString("reaction");
                    if(!reaction){
                        const embedInconnue = new Discord.EmbedBuilder()
                            .setTitle(`Inconnue`)
                            .setColor(data[i].colorWarn)
                            .setDescription(`Pas de réaction.\nVeuillez présiser une réaction.`)
                            .setTimestamp();
                        return message.followUp({embeds: [embedInconnue]})
                        .then((send) => {
                            setTimeout(() => {
                                send.delete();
                            }, 3000);
                        });
                    }

                    message.channel.messages.fetch(idmessage)
                    .then(msg => msg.react(reaction))
                    .catch(console.error);

                    message.followUp("Reaction ajouter")
                    .then((send) => {
                        setTimeout(() => {
                            send.delete();
                        }, 2000);
                    });

                    for (let i = 0; i < data.length; i++) {
                        if(data[i].guildID == guild.id){
                            data[i].emoji = reaction,
                            data[i].role = rolename.id,

                            fs.writeFile("data.json", JSON.stringify(data), err => {
            
                                if (err) throw err; 
                    
                            });
                        }   
                    }
                }
            }
        } catch (err) {
            const guild = message.guild;
            for (let i = 0; i < data.length; i++) {
                if(data[i].guildID == guild.id){
                    let reaction = args.getString("reaction");
                    const embedInconnue = new Discord.EmbedBuilder()
                        .setTitle(`Pas role a ajouter! erreur`)
                        .setColor(data[i].colorDanger)
                        .setDescription(`Une erreur c'est porduite lors de la tantative d'ajoute la réaction ${reaction}`)
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