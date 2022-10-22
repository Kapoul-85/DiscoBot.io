const Discord = require("discord.js");
const data = require("../data.json");

module.exports = {

    name: "invite",
    description: "Permet de recevoir un lien d'invitation.",
    permission: Discord.PermissionFlagsBits.SendMessages,
    category: "Information",
    dm: false,
    autocomplete: false,

    async run(bot, message) {

        await message.deferReply();
        const guild = message.guild;
        for (let i = 0; i < data.length; i++) {
            if(data[i].guildID == guild.id){
                const embedPing = new Discord.EmbedBuilder()
                    .setTitle(`Lien d'invitation`)
                    .setColor(data[i].colorBase)
                    .addFields(
                        {name: "Inviter le bot:" , value: `https://discord.com/oauth2/authorize?client_id=1023558835559993385&permissions=8&scope=bot`},
                        {name: "Lien d'invitation pour le serveur:" , value: `${data[i].lien}`},
                        {name: "Lien du serveur du bot: " , value: `https://discord.gg/GFNWT6gY4w`},
                        {name: "Lien du serveur du créateur: " , value: `https://discord.gg/6zUaSBaTzc`}
                        )
                    .setTimestamp();
                await message.followUp({embeds: [embedPing]})
                .then((send) => {
                    setTimeout(() => {
                        send.delete();
                    }, 15000);
                });
            }
        }
    }
}