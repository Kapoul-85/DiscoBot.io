const Discord = require("discord.js");
const data = require("../data.json");
const fs = require("fs");

module.exports = {

    name: "embedbuilder",
    description: "Crée un embed personnaliser",
    permission: Discord.PermissionFlagsBits.ManageMessages,
    dm: false,
    category: "Moderation",

    async run(bot, message, args){

        try {
            const modal = new Discord.ModalBuilder()
                .setCustomId("embend-builder-modal")
                .setTitle("Embed personaliser");

            const titleInput = new Discord.TextInputBuilder()
                .setLabel('Titre de l\'embed')
                .setCustomId('titleInput')
                .setStyle(Discord.TextInputStyle.Short)
                .setPlaceholder("Un nouveau event arrive!")
                .setRequired(true)

            const descriptionInput = new Discord.TextInputBuilder()
                .setLabel('Description de l\'embed')
                .setCustomId('descriptionInput')
                .setStyle(Discord.TextInputStyle.Paragraph)
                .setPlaceholder("Cette event sera dispaunible a partir du\n --/--/--au --/--/--/\nProfitsant.")
                .setRequired(true)
                
            const colorInput = new Discord.TextInputBuilder()
                .setLabel('Couleur de l\'embed')
                .setCustomId('colorInput')
                .setStyle(Discord.TextInputStyle.Short)
                .setPlaceholder("#0008e0")
                .setRequired(true)
            
            const salonInput = new Discord.TextInputBuilder()
                .setLabel('Salon a envoyer l\'embed')
                .setCustomId('salonInput')
                .setStyle(Discord.TextInputStyle.Short)
                .setPlaceholder("012345678901234")
                .setRequired(true)
                    
            const titleRow = new Discord.ActionRowBuilder().addComponents(titleInput);
            const descriptionRow = new Discord.ActionRowBuilder().addComponents(descriptionInput);
            const colorRow = new Discord.ActionRowBuilder().addComponents(colorInput);
            const salonRow = new Discord.ActionRowBuilder().addComponents(salonInput);

            modal.addComponents(titleRow, descriptionRow, colorRow, salonRow);

            await message.showModal(modal);

            bot.on('interactionCreate', async interaction => {
                if(interaction.isModalSubmit()){
                    if(interaction.customId == "embend-builder-modal"){

                        const title = interaction.fields.getTextInputValue("titleInput");
                        const description = interaction.fields.getTextInputValue("descriptionInput");
                        const color = interaction.fields.getTextInputValue("colorInput");
                        const salon = interaction.fields.getTextInputValue("salonInput");

                        interaction.reply({ content: `Votre embed viens d'ètre envoyer dans le salon <#${salon}>.`, ephemeral: true });

                        const embedbuilder =  require("../embed.json");
    
                            let dataembed = {
                                guildId : message.guild.id,
                                titre: title,
                                desc: description,
                                color: color,
                                salonID: salon
                            };
            
                            embedbuilder.push(dataembed);
                    
                        fs.writeFile("embed.json", JSON.stringify(embedbuilder), err => {
                            
                            if (err) throw err; 
            
                        });
                        
                        for(i = 0; i< embedbuilder.length; i++){
                            if(title == embedbuilder[i].titre && message.guild.id == embedbuilder[i].guildId){
                                const embed = new Discord.EmbedBuilder()
                                .setTitle("**" + title + " (" + interaction.member.displayName + ") **")
                                .setDescription(embedbuilder[i].desc)
                                .setColor(embedbuilder[i].color)
                                .setTimestamp();     
        
                                bot.channels.cache.get(salon).send({embeds: [embed]});
                            }
                        }
                    }
                }
            });
        }
        catch (err){
            const guild = message.guild;
            for (let i = 0; i < data.length; i++) {
                if(data[i].guildID == guild.id){
                    const embedInconnue = new Discord.EmbedBuilder()
                        .setTitle(`Pas d'embed a envoyer! erreur`)
                        .setColor(data[i].colorDanger)
                        .setDescription(`Une erreur c'est porduite lors de la tantative de créée un embed`)
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
    }
}