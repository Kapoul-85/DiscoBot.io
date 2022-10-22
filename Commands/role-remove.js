const Discord = require("discord.js");
const data = require("../data.json");

module.exports = {

    name: "role-remove",
    description: "Supprime un role à un utilisateur",
    permission: Discord.PermissionFlagsBits.ManageRoles,
    dm: false,
    category: "Role",
    options: [
        {
            type: "user",
            name: "member",
            description: "Le nom du membre à retirer un role",
            required: true,
            autocomplete: false,
        },
        {
            type: "role",
            name: "namerole",
            description: "Le nom du role à retiter au membre",
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
                            .setDescription(`Pas de nom.\nVeuillez préciser le nom du membre à qui vous souhaitez retirer le rôle`)
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
                            .setTitle(`Role inconnu`)
                            .setColor(data[i].colorWarn)
                            .setDescription(`Pas de rôle connu sous ce nom.\nVeuillez préciser le nom du rôle à retirer au membre`)
                            .setTimestamp();
                        return message.followUp({embeds: [embedInconnue]})
                        .then((send) => {
                            setTimeout(() => {
                                send.delete();
                            }, 3000);
                        });
                    }
    
                    let member = message.guild.members.cache.get(user.id);
                    await member.roles.remove(rolename);
    
                    const embedPing = new Discord.EmbedBuilder()
                        .setTitle(`Rôle retiré`)
                        .setColor(data[i].colorBase)
                        .setDescription(`Le rôle ${rolename} a bien été retiré a ${user}.`)
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
                    let rolename = args.getString("namerole");
                    const embedInconnue = new Discord.EmbedBuilder()
                        .setTitle(`Pas role à retirer! erreur`)
                        .setColor(data[i].colorDanger)
                        .setDescription(`Une erreur s'est produite lors de la tentative de retirer le role ${rolename}, à ${user}`)
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