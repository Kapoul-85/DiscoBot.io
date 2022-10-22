const Discord = require("discord.js");
const intents = new Discord.IntentsBitField(3276799);
const bot = new Discord.Client({intents});
const loadCommands = require("./Loaders/loadCommands");
const loadEvents = require("./Loaders/loadEvents");
const token = require("./token.json");

bot.commands = new Discord.Collection();
bot.login(process.env.TOKEN);
loadCommands(bot);
loadEvents(bot);

const statuses = [
    () => "par 𝑨𝒍𝒇𝒂𝒕_𝑹𝒆𝒊𝒅𝒆𝒏#7669",  
    () => "Disco'Pub 🌭",
    () => `Présent sur ${bot.guilds.cache.size} serveurs`,
    () => `Pour servir ${bot.users.cache.size} personnes`,
    () => "/help",
]
let i = 0
setInterval(() => {
    bot.user.setActivity(statuses[i](), { type: Discord.ActivityType.Watching})
    i = ++i % statuses.length;
    console.log("Bot is online");
    bot.user.setPresence({
        status: 'dnd',
      });
}, 5000);

/*const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello Express app!')
});

app.listen(3000, () => {
  console.log('server started');
});*/
