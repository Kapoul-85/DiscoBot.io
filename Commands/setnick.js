const Discord = require('discord.js');
const data = require('../data.json');

module.exports = {

    name: "setnick",
    description: "Permet de changer un peudo",
    permission:  Discord.PermissionFlagsBits.ChangeNickname,
    dm: false,
    category: "Moderation", 
    options: [
        {
            type: "user",
            name: "member",
            description: "Le membre changer le pseudo",
            required: true,
            autocomplete: false,
        },
        {
            type: "string",
            name: "newpseudo",
            description: "Le nouveau pseudo",
            required: true,
            autocomplete: false,
        }
    ],

    async run(bot, message, args) {

        try {
            await message.deferReply();
            const guild = message.guild;
            
            for (let i = 0; i < data.length; i++) {
                if(data[i].guildID == guild.id){
                    let user = args.getUser("member");
                    let newPseudo = args.getString("newpseudo");
                    const channel = message.guild.channels.cache.find(channel => channel.name === data[i].logs.name);
                    if(!channel) return;

                    if(!user){
                        const embedInconnue = new Discord.EmbedBuilder()
                            .setTitle(`Inconnue`)
                            .setColor(data[i].colorWarn)
                            .setDescription(`Pas de membre a changer le pseudo.\nVeuillez présiser un utilisateur`)
                            .setTimestamp();
                        return message.followUp({embeds: [embedInconnue]})
                        .then((send) => {
                            setTimeout(() => {
                                send.delete();
                            }, 3000);
                        });
                    }

                    let member = message.guild.members.cache.get(user.id);
                    member.setNickname(newPseudo);

                    const embedWarn = new Discord.EmbedBuilder()
                        .setTitle(`Pseudo Changer !`)
                        .setColor(data[i].colorDanger)
                        .setDescription(`Vous vener de changer le pseudo de ${member.user.username} en ${user}!`)
                        .setTimestamp();
                    await message.followUp({embeds: [embedWarn]})
                    .then((send) => {
                        setTimeout(() => {
                            send.delete();
                        }, 3000);
                    });

                    const embedServerSetNickName = new Discord.EmbedBuilder()
                        .setColor(data[i].colorDanger)
                        .addFields(
                            {name: "**Pseudo Changé de**" , value: `${member.user.username}`},
                            {name: "**Pseudo Changé en**:" , value: `${user}`}
                            )
                        .setTimestamp();
                    channel.send({embeds: [embedServerSetNickName]})
                }
            }
        }
        catch (err){
            let user = args.getUser("member");
            let newPseudo = args.getString("newpseudo");
            const embedInconnue = new Discord.EmbedBuilder()
                .setTitle(`Pas de membre a changer le pseudo! erreur`)
                .setColor(data[i].colorDanger)
                .setDescription(`Une erreur c'est porduite lors de la tantative de changer le pseudo de ${user} en ${newPseudo}`)
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