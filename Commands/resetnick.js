const Discord = require('discord.js');
const data = require("../data.json");

module.exports = {

    name: "resetnick",
    description: "Permet de reset un peudo",
    permission:  Discord.PermissionFlagsBits.ChangeNickname,
    dm: false,
    category: "Moderation", 
    options: [
        {
            type: "user",
            name: "member",
            description: "Le membre dont vous voulez reset le pseudo",
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
                    const channel = message.guild.channels.cache.find(channel => channel.name === data[i].logs.name);
                    if(!channel) return;

                    if(!user){
                        const embedInconnue = new Discord.EmbedBuilder()
                            .setTitle(`Membre inconnu`)
                            .setColor(data[i].colorWarn)
                            .setDescription(`Pas de membre à reset le pseudo.\nVeuillez préciser un utilisateur présent sur le serveur`)
                            .setTimestamp();
                        return message.followUp({embeds: [embedInconnue]})
                        .then((send) => {
                            setTimeout(() => {
                                send.delete();
                            }, 3000);
                        });
                    }

                    let member = message.guild.members.cache.get(user.id);
                    member.setNickname(null);

                    const embedWarn = new Discord.EmbedBuilder()
                        .setTitle(`Pseudo Reset !`)
                        .setColor(data[i].colorDanger)
                        .setDescription(`Vous venez de reset le pseudo de ${user}!`)
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
                            {name: "**Pseudo reset**:" , value: `${user}`}
                            )
                        .setTimestamp();
                    channel.send({embeds: [embedServerSetNickName]})
                }
            }
        }
        catch (err){
            const guild = message.guild;
            
            for (let i = 0; i < data.length; i++) {
                if(data[i].guildID == guild.id){
                    let user = args.getUser("member");
                    const embedInconnue = new Discord.EmbedBuilder()
                        .setTitle(`Allo houston, nous avons un problème...`)
                        .setColor(data[i].colorDanger)
                        .setDescription(`Une erreur s'est produite lors de la tentative de reset le pseudo de ${user}`)
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