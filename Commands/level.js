const Discord = require("discord.js");
const data = require("../data.json");
const fs = require('fs');

module.exports = {

    name: "level",
    description: "Permet de voir ton niveau",
    permission: Discord.PermissionFlagsBits.SendMessages,
    category: "Information",
    dm: false,    
    options: [
        {
            type: "user",
            name: "member",
            description: "Le member dont vous souhaitez afficher le level",
            required: true,
            autocomplete: false,
        } 
    ],

    async run(bot, message, args) {

        try {
            await message.deferReply();
            const guild = message.guild;

            for (let i = 0; i < data.length; i++) {
                if(data[i].guildID == guild.id){
                    let user = args.getUser("member");
                    if(!user){
                        const embedInconnue = new Discord.EmbedBuilder()
                            .setTitle(`Membre inconnu`)
                            .setColor(data[i].colorWarn)
                            .setDescription(`Pas de membre à afficher le level\nVeuillez préciser un utilisateur présent sur le serveur.`)
                            .setTimestamp();
                        return message.followUp({embeds: [embedInconnue]})
                        .then((send) => {
                            setTimeout(() => {
                                send.delete();
                            }, 3000);
                        });
                    }
                    
                    let userLevel = JSON.parse(fs.readFileSync("./userLevel.json", 'utf8'));
                    const Level = userLevel[user.id].userLVL;
                    const Xp = userLevel[user.id].userXP;
                    const calcul1 = userLevel[user.id].userXP;
                    const calcul2 = userLevel[user.id].reqXP;
                    const RecXp = (calcul2 - calcul1);
                    const TotalXp = userLevel[user.id].userTOTAL;

                    const embedLvl = new Discord.EmbedBuilder()
                        .setTitle(`Son niveau actuel est:  ${Level}`)
                        .addFields(
                            {name: "Son xp actuel est de:" , value: `${Xp}`},
                            {name: "Son xp restant pour level up est de:" , value: `${RecXp}`},
                            {name: "Son xp total est de" , value: `${TotalXp}`}
                            )
                        .setColor(data[i].colorBase)
                        .setTimestamp();

                    await message.followUp({content: `Vous avez demandé le niveau de : ${user}`, embeds: [embedLvl]})            
                    .then((send) => {
                        setTimeout(() => {
                            send.delete();
                        }, 15000);
                    });
                }
            }
        }
        catch (err){

            const guild = message.guild;
            for (let i = 0; i < data.length; i++) {
                if(data[i].guildID == guild.id){
                    let user = args.getUser("member");
                    const embedInconnue = new Discord.EmbedBuilder()
                        .setTitle(`Allo houston, nous avons un problème...`)
                        .setColor(data[i].colorDanger)
                        .setDescription(`Une erreur s'est produite lors de la tentative de récupérer le niveau de ${user}`)
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