const Discord = require("discord.js");
const data = require("../data.json");

module.exports = {

    name: "nuke",
    description: "clear entièrement le salon",
    permission: Discord.PermissionFlagsBits.ManageMessages,
    dm: false,
    category: "Moderation",

    async run(bot, message, args) {

        try {
            await message.deferReply();
            const guild = message.guild;

            for (let i = 0; i < data.length; i++) {
                if(data[i].guildID == guild.id){
                    const channel = message.guild.channels.cache.find(channel => channel.name === data[i].logs.name);
                    if(!channel) return;
                    const row = new Discord.ActionRowBuilder()
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId('clear-all-messages')
                            .setLabel('Exploser ce salon !')
                            .setEmoji(`💣`)
                            .setStyle(Discord.ButtonStyle.Danger),
                    );

                    await message.followUp({ content: 'Etes vous sur de vouloir faire tomber une bombe sur ce salon ?', components: [row] });

                    bot.on('interactionCreate', async interaction => {
                        if(interaction.isButton()){
                            if(interaction.customId == "clear-all-messages"){
                                
                                await message.followUp('Nuke in progress...')
                                message.channel.clone().then((ch) =>{
                                    ch.setParent(message.channel.parent.id);
                                    ch.setPosition(message.channel.position);
                                    message.channel.delete();
                                    ch.send('Le salon a bien été explosé puis recréé à l\'identique.');

                                    const guild = message.guild;
                                    for (let i = 0; i < data.length; i++) {
                                        if(data[i].guildID == guild.id){
                                            const embedNukeLogs = new Discord.EmbedBuilder()
                                                .setTitle(`Salon nuke !`)
                                                .setColor(data[i].colorBase)
                                                .setDescription(`Le salon ${ch} a bien était exploser puis recréée comme l\'initiale.!`)
                                                .setTimestamp();
                                            return channel.send({embeds: [embedNukeLogs]})
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
        }
        catch (err){
            const guild = message.guild;
            for (let i = 0; i < data.length; i++) {
                if(data[i].guildID == guild.id){
                    const embedInconnue = new Discord.EmbedBuilder()
                        .setTitle(`Allo houston, nous avons un problème...`)
                        .setColor(data[i].colorDanger)
                        .setDescription(`Une erreur s'est produite lors de la tentative de faire tomber une nuck sur le salon °_°`)
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