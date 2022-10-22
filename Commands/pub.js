const Discord = require("discord.js");
const data = require("../data.json");
const fs = require("fs");

module.exports = {

    name: "pub",
    description: "Affiche le pub du serveur",
    permission: Discord.PermissionFlagsBits.SendMessages,
    dm: false,
    category: "Pub",

    async run(bot, message, args){

        try {       
            await message.deferReply();

            const pub =  require("../pub.json");
            for(i = 0; i< pub.length; i++){
                if(message.guild.id == pub[i].guildId){
                    const embed = new Discord.EmbedBuilder()
                    .setTitle("Pub du serveur:")
                    .addFields(
                        {name: "Nom du serveur:", value: `${pub[i].titre}`}, 
                        {name: "Description du serveur (pub):", value: `${pub[i].desc}`},
                        {name: "Lien pour join:", value: `${pub[i].lien}`},
                        {name: "Nombre de membre:", value: `${bot.users.cache.size}`}
                        )
                    .setColor(pub[i].color)
                    .setTimestamp();  

                    message.followUp({embeds: [embed]});
                }
            }
        }
        catch (err){
            const embedInconnue = new Discord.EmbedBuilder()
                .setTitle(`Pas de pub à envoyer! erreur`)
                .setColor("#ff0000")
                .setDescription(`Une erreur c'est porduite lors de la tantative d'afficher la pub du serveur`)
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