const Discord = require('discord.js');
const fs = require("fs");
const data = require("../data.json");

module.exports = {

    name: "pub-modif",
    description: "Permet de modifier la pub du serveur",
    permission: Discord.PermissionFlagsBits.ManageMessages,
    dm: false,
    category: "Pub",

    async run(bot, message, args){

        try {
            const modal = new Discord.ModalBuilder()
                .setCustomId("pub-builder-modal")
                .setTitle("Pub du serveur");

            const titleInput = new Discord.TextInputBuilder()
                .setLabel('Titre de la pub')
                .setCustomId('titleInput')
                .setStyle(Discord.TextInputStyle.Short)
                .setPlaceholder("Nom du serveur")
                .setRequired(true)

            const descriptionInput = new Discord.TextInputBuilder()
                .setLabel('Description de la pub')
                .setCustomId('descriptionInput')
                .setStyle(Discord.TextInputStyle.Paragraph)
                .setPlaceholder("C'est un serveur RP de détante avec des minis jeux... ")
                .setRequired(true)
                
            const colorInput = new Discord.TextInputBuilder()
                .setLabel('Couleur de la pub')
                .setCustomId('colorInput')
                .setStyle(Discord.TextInputStyle.Short)
                .setPlaceholder("#0008e0")
                .setRequired(true)
                    
            const titleRow = new Discord.ActionRowBuilder().addComponents(titleInput);
            const descriptionRow = new Discord.ActionRowBuilder().addComponents(descriptionInput);
            const colorRow = new Discord.ActionRowBuilder().addComponents(colorInput);

            modal.addComponents(titleRow, descriptionRow, colorRow);

            await message.showModal(modal);

            bot.on('interactionCreate', async interaction => {
                if(interaction.isModalSubmit()){
                    if(interaction.customId == "pub-builder-modal"){

                        const title = interaction.fields.getTextInputValue("titleInput");
                        const description = interaction.fields.getTextInputValue("descriptionInput");
                        const color = interaction.fields.getTextInputValue("colorInput");

                        interaction.reply({ content: `Votre pub viens d'ètre modifier.`, ephemeral: true });

                        const guild = message.guild;
                        for (let i = 0; i < data.length; i++) {
                            if(data[i].guildID == guild.id){
                                const pubModif = require("../pub.json");

                                for (let i = 0; i < pubModif.length; i++) {
                                    if(pubModif[i].guildId == guild.id) {
                                        pubModif[i].titre = title,
                                        pubModif[i].desc = description, 
                                        pubModif[i].color = color,
                                        pubModif[i].lien = data[i].lien,
        
                                        fs.writeFile("pub.json", JSON.stringify(pubModif), err => {
                                
                                            if (err) throw err; 
                            
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
            });
        }
        catch (err){
            const embedInconnue = new Discord.EmbedBuilder()
                .setTitle(`Pas d'embed a envoyer! erreur`)
                .setColor("#ff0000")
                .setDescription(`Une erreur c'est porduite lors de la tantative de modifier la pub`)
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