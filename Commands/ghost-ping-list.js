const Discord = require("discord.js");
const data = require("../data.json");
const fs = require("fs");
const console = require("console");

module.exports = {

    name: "ghost-ping-list",
    description: "Affiche la liste des salons ghost ping ",
    permission: Discord.PermissionFlagsBits.ManageMessages,
    dm: false,
    category: "GhostPing",

    async run(bot, message, args){

        await message.deferReply();

        try {
            const guild = message.guild;
            for (let i = 0; i < data.length; i++) {
                if(data[i].guildID == guild.id){

                    message.followUp(`Ghost Ping:`);
                    const ghostPing =  require("../ghostping.json");
                    for (let i = 0; i < ghostPing.length; i++) {
                        if(ghostPing[i].guildID == guild.id){
                            message.channel.send(`<#${ghostPing[i].idsalon.id}>`)
                        }   
                    }
                }
            }
        } catch (err) {
            const guild = message.guild;
            for (let i = 0; i < data.length; i++) {
                if(data[i].guildID == guild.id){
                    const embedInconnue = new Discord.EmbedBuilder()
                        .setTitle(`Pas de salon ghostping! erreur`)
                        .setColor(data[i].colorDanger)
                        .setDescription(`Une erreur s'est porduite lors de la tantative d'afficher tous les salons ghost ping'`)
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