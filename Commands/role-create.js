const Discord = require("discord.js");
const data = require("../data.json");

module.exports = {

    name: "role-create",
    description: "Créé un role sur ce serveur",
    permission: Discord.PermissionFlagsBits.ManageRoles,
    dm: false,
    category: "Role",
    options: [
        {
            type: "string",
            name: "rolename",
            description: "Le nom du role a créé",
            required: true,
            autocomplete: false,
        },
        {
            type: "string",
            name: "color",
            description: "La couleur du role a créé",
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
                    let rolename = args.getString("rolename");
                    if(!rolename){
                        const embedInconnue = new Discord.EmbedBuilder()
                            .setTitle(`Inconnue`)
                            .setColor(data[i].colorWarn)
                            .setDescription(`Pas de nom.\nVeuillez présiser le nom du role`)
                            .setTimestamp();
                        return message.followUp({embeds: [embedInconnue]})
                        .then((send) => {
                            setTimeout(() => {
                                send.delete();
                            }, 3000);
                        });
                    }

                    let color = args.getString("color");
                    if(!color){
                        const embedInconnue = new Discord.EmbedBuilder()
                            .setTitle(`Inconnue`)
                            .setColor(data[i].colorWarn)
                            .setDescription(`Pas de couleur.\nVeuillez présiser la couleur du role`)
                            .setTimestamp();
                        return message.followUp({embeds: [embedInconnue]})
                        .then((send) => {
                            setTimeout(() => {
                                send.delete();
                            }, 3000);
                        });
                    }
    
                    guild.roles.create({ 
                        name: rolename,
                        color: color,
                        permissions: [Discord.PermissionsBitField.Flags.SendMessages, Discord.PermissionsBitField.Flags.KickMembers] 
                    });
    
                    const embedPing = new Discord.EmbedBuilder()
                        .setTitle(`Role créé;`)
                        .setColor(data[i].colorBase)
                        .setDescription(`Le role ${rolename} a bien était créé.`)
                        .setTimestamp();
                    await message.followUp({embeds: [embedPing]})
                    .then((send) => {
                        setTimeout(() => {
                            send.delete();
                        }, 3000);
                    });
                }
            }
        } catch (err) {
            const guild = message.guild;
            for (let i = 0; i < data.length; i++) {
                if(data[i].guildID == guild.id){
                    const embedInconnue = new Discord.EmbedBuilder()
                        .setTitle(`Pas role a créé! erreur`)
                        .setColor(data[i].colorDanger)
                        .setDescription(`Une erreur c'est porduite lors de la tantative de créée un role`)
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