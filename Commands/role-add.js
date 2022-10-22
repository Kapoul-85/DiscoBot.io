const Discord = require("discord.js");
const data = require("../data.json");

module.exports = {

    name: "role-add",
    description: "Supprime un role du serveur",
    permission: Discord.PermissionFlagsBits.ManageRoles,
    dm: false,
    category: "Role",
    options: [
        {
            type: "user",
            name: "member",
            description: "Le nom du membre à ajouter un role",
            required: true,
            autocomplete: false,
        },
        {
            type: "role",
            name: "namerole",
            description: "Le nom du role à ajouter au membre",
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
                    let user = args.getUser("member");
                    if(!user){
                        const embedInconnue = new Discord.EmbedBuilder()
                            .setTitle(`Membre inconnu`)
                            .setColor(data[i].colorWarn)
                            .setDescription(`Pas de nom.\nVeuillez préciser le nom du membre a ajouter le role`)
                            .setTimestamp();
                        return message.followUp({embeds: [embedInconnue]})
                        .then((send) => {
                            setTimeout(() => {
                                send.delete();
                            }, 3000);
                        });
                    }

                    let rolename = args.getRole("namerole");
                    if(!rolename){
                        const embedInconnue = new Discord.EmbedBuilder()
                            .setTitle(`Inconnue`)
                            .setColor(data[i].colorWarn)
                            .setDescription(`Pas de nom.\nVeuillez présiser le nom du role a alouter au membre`)
                            .setTimestamp();
                        return message.followUp({embeds: [embedInconnue]})
                        .then((send) => {
                            setTimeout(() => {
                                send.delete();
                            }, 3000);
                        });
                    }
    
                    let member = message.guild.members.cache.get(user.id);
                    await member.roles.add(rolename);
    
                    const embedPing = new Discord.EmbedBuilder()
                        .setTitle(`Role ajouter`)
                        .setColor(data[i].colorBase)
                        .setDescription(`Le role ${rolename} a bien était ajouter a ${user}.`)
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
                    let user = args.getUser("member");
                    let rolename = args.getRole("namerole");
                    const embedInconnue = new Discord.EmbedBuilder()
                        .setTitle(`Pas role a ajouter! erreur`)
                        .setColor(data[i].colorDanger)
                        .setDescription(`Une erreur c'est porduite lors de la tantative d'ajoute le role ${rolename}, a ${user}`)
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