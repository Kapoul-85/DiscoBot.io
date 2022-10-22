const Discord = require("discord.js");
const fs = require("fs");
const data = require("../data.json");

module.exports = async (bot, message) => {
    if(message.author.bot) return;

    let userLevel = JSON.parse(fs.readFileSync("./userLevel.json", 'utf8'));

    if (!userLevel[message.author.id]) {
        userLevel[message.author.id] = {
        userXP: 0,
        userTOTAL: 0,
        reqXP: 20,
        userLVL: 0,
        }
        fs.writeFile('userLevel.json',JSON.stringify(userLevel,null,5),err=>{
            if (err) throw err; 
        })
    }
    
    let xp = 1; //Math.floor(Math.random() * 2);
    userLevel[message.author.id].userXP += xp;
    userLevel[message.author.id].userTOTAL += xp;
    const newlevel = userLevel[message.author.id].reqXP * 1.5; 

    if(userLevel[message.author.id].userXP > userLevel[message.author.id].reqXP){
        userLevel[message.author.id].userXP -= userLevel[message.author.id].reqXP;
        userLevel[message.author.id].userLVL += 1;
        userLevel[message.author.id].reqXP = Math.round(newlevel);
        const calcul1 = userLevel[message.author.id].userXP;
        const calcul2 = userLevel[message.author.id].reqXP;
        const newRecXp = (calcul2 - calcul1);
        const newlvl = userLevel[message.author.id].userLVL;
        const newXp = userLevel[message.author.id].userXP;
        const newTotalXp = userLevel[message.author.id].userTOTAL;

        const guild = message.guild;
            
        for (let i = 0; i < data.length; i++) {
            if(data[i].guildID == guild.id){
                const embedLevelUp = new Discord.EmbedBuilder()
                    .setTitle(`Level Up !`)
                    .setColor(data[i].colorBase)
                    .addFields(
                        {name: "Vous ètes désormais niveau:" , value: `${newlvl}`},
                        {name: "Votre xp actuel est de:" , value: `${newXp}`},
                        {name: "Votre xp restant pour level up est de:" , value: `${newRecXp}`},
                        {name: "Votre xp total est de" , value: `${newTotalXp}`}
                        )
                    .setFooter({text: `${message.author.username}`})
                    .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
                    .setTimestamp();
                message.channel.send({embeds: [embedLevelUp]})
                .then((send) => {
                    setTimeout(() => {
                        send.delete();
                    }, 15000);
                });
            }
        }
    }

    fs.writeFile('userLevel.json',JSON.stringify(userLevel,null,5),err=>{
        if (err) throw err; 
    })

    let user = message.mentions.users.first();
        if(user == "1023558835559993385"){
            const guild = message.guild;
            for (let i = 0; i < data.length; i++) {
                if(data[i].guildID == guild.id){
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

                    await message.channel.send({embeds: [embed]})
                    .then((send) => {
                        setTimeout(() => {
                            send.delete();
                        }, 120000);
                    });
                }
            }
        } 
        else{
            return;
        }
}