const Discord = require("discord.js");
const loadSlashCommands = require("../Loaders/loadSlashCommands");
const loadMessages = require("./messages.js");

module.exports = async bot => {

    await loadSlashCommands(bot);
    await loadMessages(bot);
    
    console.log(`${bot.user.username} est actuellement en ligne !`)
}