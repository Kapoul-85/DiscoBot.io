const Discord = require("discord.js");
const data = require("../data.json");

module.exports = {

    name: "kick-member-private-room",
    description: "Permet de kick un member de votre private room",
    permission: Discord.PermissionFlagsBits.SendMessages,
    dm: false,
    category: "PrivateRoom",
    options: [
        {
            type: "user",
            name: "member",
            description: "Le membre à ajouter dans votre private room",
            required: true,
            autocomplete: false,
        },
    ],

    async run(bot, message, args){

        try {
            await message.deferReply();
            const guild = message.guild;
            
            for (let i = 0; i < data.length; i++) {
                if(data[i].guildID == guild.id){
                    let utilisateur = args.getUser("member");
                    
                    if(!utilisateur){
                        const embedInconnue = new Discord.EmbedBuilder()
                            .setTitle(`Inconnue`)
                            .setColor(data[i].colorWarn)
                            .setDescription(`Pas de membre.\nVeuillez présiser un membre a ajouter dans votre private room`)
                            .setTimestamp();
                        return message.followUp({embeds: [embedInconnue]})
                        .then((send) => {
                            setTimeout(() => {
                                send.delete();
                            }, 3000);
                        });
                    }

                    const user = message.user.username.toLowerCase();

                    if(message.channel.name != `private-room-${user.toLowerCase()}`){
                        const embedWarn = new Discord.EmbedBuilder()
                            .setTitle(`Erreur!`)
                            .setColor(data[i].colorWarn)
                            .setDescription(`Vous n'ètes pas dans votre private room!`)
                            .setTimestamp();
                        return message.followUp({embeds: [embedWarn]})
                        .then((sent) => {
                            setTimeout(() => {
                                sent.delete();
                            }, 2500);
                        });
                    }
                    
                    if(message.member.user.username.toLowerCase() !=  user.toLowerCase()){
                        const embedDanger = new Discord.EmbedBuilder()
                            .setTitle(`Erreur!`)
                            .setColor(data[i].colorDanger)
                            .setDescription(`Vous n'ètes pas le fondateur du private room!`)
                            .setTimestamp();
                        return message.followUp({embeds: [embedDanger]})
                        .then((sent) => {
                            setTimeout(() => {
                                sent.delete();
                            }, 2500);
                        });
                    }

                    message.channel.permissionOverwrites.edit(utilisateur.id, { 
                        ViewChannel: false 
                    });

                    try {
                        const embedSucces = new Discord.EmbedBuilder()
                            .setTitle(`kick d'un private room !`)
                            .setColor(data[i].colorDanger)
                            .setDescription(`Tu as était kick d'un private room`)
                            .setTimestamp();
                        await bot.users.cache.get(user.id).send({embeds: [embedSucces]});
                    }
                    catch(err) {}

                    const embedSucces = new Discord.EmbedBuilder()
                        .setTitle(`Succes!`)
                        .setColor(data[i].colorBase)
                        .setDescription(`${utilisateur} a bien était kick de votre private room`)
                        .setTimestamp();
                    return message.followUp({embeds: [embedSucces]})
                    .then((sent) => {
                        setTimeout(() => {
                            sent.delete();
                        }, 2500);
                    });
                }  
            }
        }
        catch (err){
            const guild = message.guild;
            
            for (let i = 0; i < data.length; i++) {
                if(data[i].guildID == guild.id){
                    let utilisateur = args.getUser("member");
                    const embedInconnue = new Discord.EmbedBuilder()
                        .setTitle(`Pas de membre a kick! erreur`)
                        .setColor(data[i].colorDanger)
                        .setDescription(`Une erreur c'est porduite lors de la tantative de kick ${utilisateur} de votre private room`)
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