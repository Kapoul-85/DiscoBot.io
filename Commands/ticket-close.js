const Discord = require("discord.js");
const data = require("../data.json");

module.exports = {

    name: "ticket-close",
    description: "Permet de supprimer un ticket",
    permission: Discord.PermissionFlagsBits.SendMessages,
    dm: false,
    category: "Information",    
    options: [
        {
            type: "user",
            name: "member",
            description: "Le créateur du ticket",
            required: true,
            autocomplete: false,
        }
    ],

    async run(bot, message, args){

        try {
            await message.deferReply();
            const guild = message.guild;
            
            for (let i = 0; i < data.length; i++) {
                if(data[i].guildID == guild.id){
                    let user = args.getUser("member");

                    if(message.channel.name != `ticket-${user.username}`){
                        const embedWarn = new Discord.EmbedBuilder()
                            .setTitle(`Erreur!`)
                            .setColor(data[i].colorWarn)
                            .setDescription(`Vous n'ètes pas dans votre ticket!`)
                            .setTimestamp();
                        return message.followUp({embeds: [embedWarn]})
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