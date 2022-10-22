const Discord = require('discord.js');
const data = require("../data.json");

module.exports = {

    name: "ignore",
    description: "Le bot repond vue et ignoré avec succés",
    permission: Discord.PermissionFlagsBits.SendMessages,
    dm: false,
    category: "Information",

    async run(bot, message, args){

        try {
           message.channel.send("Vue et ignoré avec succés !");
        }
        catch (err){
        }
    }
}