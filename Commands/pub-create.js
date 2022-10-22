const Discord = require("discord.js");
const data = require("../data.json");
const fs = require("fs");

module.exports = {

    name: "pub-create",
    description: "Crée la pub du serveur",
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

                        interaction.reply({ content: `Votre pub viens d'ètre envoyer.`, ephemeral: true });
    
                        const guild = message.guild;
                        for (let i = 0; i < data.length; i++) {
                            if(data[i].guildID == guild.id){
                                const pub = require("../pub.json");
                                const lien = data[i].lien;
                                for (let i = 0; i < pub.length; i++) {
                                    if(pub[i].guildID != guild.id){
                                        let datapub = {
                                            guildId : message.guild.id,
                                            titre: title,
                                            desc: description,
                                            color: color,
                                            lien: lien
                                        };
                        
                                        pub.push(datapub);
                                    
                                        fs.writeFile("pub.json", JSON.stringify(pub), err => {
                                            
                                            if (err) throw err; 
                            
                                        });
                                    }
                                    else{
                                        const embedexistant= new Discord.EmbedBuilder()
                                            .setTitle(`Existante pub`)
                                            .setColor(data[i].colorWarn)
                                            .setDescription(`Se serveur possède déjà une pub.\nUtiliser **/pub** pour voirs la pub du serveur.\nUtiliser **/pub-modif** pour modifier la pub du serveur.`)
                                            .setTimestamp();
                                        return message.followUp({embeds: [embedexistant]})
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
                }
            });
        }
        catch (err){
            const embedInconnue = new Discord.EmbedBuilder()
                .setTitle(`Pas d'embed a envoyer! erreur`)
                .setColor(data[i].colorDanger)
                .setDescription(`Une erreur c'est porduite lors de la tantative de créée la pub du serveur`)
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