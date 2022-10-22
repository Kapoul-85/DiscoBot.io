const Discord = require("discord.js");
const data = require("../data.json");

module.exports = {

    name: "role-delete",
    description: "Supprime un role du serveur",
    permission: Discord.PermissionFlagsBits.ManageRoles,
    dm: false,
    category: "Role",
    options: [
        {
            type: "string",
            name: "rolename",
            description: "Le nom du role a supprimer",
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
                            .setDescription(`Pas de nom.\nVeuillez présiser le nom du role a supprimer`)
                            .setTimestamp();
                        return message.followUp({embeds: [embedInconnue]})
                        .then((send) => {
                            setTimeout(() => {
                                send.delete();
                            }, 3000);
                        });
                    }

                    const embedPing = new Discord.EmbedBuilder()
                        .setTitle(`Role supprimé`)
                        .setColor(data[i].colorBase)
                        .setDescription(`Le role ${rolename} a bien était supprimer.`)
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
                        .setTitle(`Pas role a supprimer! erreur`)
                        .setColor(data[i].colorDanger)
                        .setDescription(`Une erreur c'est porduite lors de la tantative de supprimer un role`)
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