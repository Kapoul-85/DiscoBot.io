const Discord = require("discord.js");
const data = require("../data.json");

module.exports = {

    name: "destroy-private-room",
    description: "Permet de suprimer votre private room",
    permission: Discord.PermissionFlagsBits.SendMessages,
    dm: false,
    category: "PrivateRoom",

    async run(bot, message, args){

        try {
            await message.deferReply();
            const guild = message.guild;
            
            for (let i = 0; i < data.length; i++) {
                if(data[i].guildID == guild.id){
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

                    message.channel.delete();
                }  
            }
        }
        catch (err){
            const guild = message.guild;
            
            for (let i = 0; i < data.length; i++) {
                if(data[i].guildID == guild.id){
                    const embedInconnue = new Discord.EmbedBuilder()
                        .setTitle(`Pas de private room a supprimer! erreur`)
                        .setColor(data[i].colorDanger)
                        .setDescription(`Une erreur c'est porduite lors de la tantative de supprimer votre private room`)
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