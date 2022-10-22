const Discord = require("discord.js");
const data = require("../data.json");

module.exports = {

    name: "help",
    description: "Permet de voir la liset des commandes présant sur ce bot",
    permission: Discord.PermissionFlagsBits.SendMessages,
    dm: true,
    category: "Information",
    options: [
        {
            type: "string",
            name: "commande",
            description: "La commande à afficher",
            required: false,
            autocomplete: true,
        }
    ],

    async run(bot, message, args) {

        await message.deferReply();
        const guild = message.guild;

        for (let i = 0; i < data.length; i++) {
            if(data[i].guildID == guild.id){
                let command;
                if(args.getString("commande")){
                    command = bot.commands.get(args.getString("commande"));
                    if(!command) {
                        const embedInconnue = new Discord.EmbedBuilder()
                        .setTitle(`Inconnue`)
                        .setColor(data[i].colorWarn)
                        .setDescription(`Pas de commande.\nVeuillez présiser une commande`)
                        .setTimestamp();
                        return message.followUp({embeds: [embedInconnue]})
                        .then((send) => {
                            setTimeout(() => {
                                send.delete();
                            }, 3000);
                        });
                    }
                }
        
                if(!command) {
                    let categorys = [];
                    bot.commands.forEach(command =>{
                        if(!categorys.includes(command.category)) categorys.push(command.category);
                    });
        
                    let embed = new Discord.EmbedBuilder()
                        .setColor(data[i].colorBase)
                        .setTitle(`Command du bot`)
                        .setThumbnail(bot.user.displayAvatarURL({ dynamic: true }))
                        .setDescription(`Command disponibles : \`${bot.commands.size}\`\nCategories disponibles : \`${categorys.length}\``)
                        .setTimestamp()
                        .setFooter({text: "Command du bot"});
        
                    await categorys.sort().forEach(async cat => {
                        
                        let commands = bot.commands.filter(cmd => cmd.category == cat);
                        embed.addFields({name: `${cat}`, value: `${commands.map(cmd => `\`${cmd.name}\` : ${cmd.description}`).join("\n")}`});
                    })
        
                    await message.followUp({embeds: [embed]})
                    .then((send) => {
                        setTimeout(() => {
                            send.delete();
                        }, 120000);
                    });
                }
                else {
                    let embed = new Discord.EmbedBuilder()
                        .setColor(data[i].colorBase)
                        .setTitle(`Command ${command.name}`)
                        .setThumbnail(bot.user.displayAvatarURL({ dynamic: true }))
                        .setDescription(`Nom : \`${command.name}\`\nDescription : \`${command.description}\`\nPermission requise : \`${typeof command.permission != "bigint" ? command.permission : new Discord.PermissionsBitField(command.permission).toArray(false)}\`\nCommande en DM: \`${command.dm ? "Oui" : "Non"}\`\nCatégorie: \`${command.category}\``)
                        .setTimestamp()
                        .setFooter({text: "Command du bot"});
        
                    await message.followUp({embeds: [embed]})
                    .then((send) => {
                        setTimeout(() => {
                            send.delete();
                        }, 60000);
                    });
                }
            }
            }
        }
}