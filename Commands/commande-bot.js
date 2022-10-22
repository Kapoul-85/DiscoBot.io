const Discord = require("discord.js");
const data = require("../data.json");
const fs = require("fs");

module.exports = {

    name: "commande-bot",
    description: "Permet de commander un bot.",
    permission: Discord.PermissionFlagsBits.SendMessages,
    category: "Information",
    dm: true,
    autocomplete: false,

    async run(bot, message, args){

        try {
            const modal = new Discord.ModalBuilder()
                .setCustomId("commande-bot-modal")
                .setTitle("Commander son bot.");

            const NameInput = new Discord.TextInputBuilder()
                .setLabel('Nom du bot')
                .setCustomId('NameInput')
                .setStyle(Discord.TextInputStyle.Short)
                .setPlaceholder("DiscoPubBot!")
                .setRequired(true)

            const ProfileInput = new Discord.TextInputBuilder()
                .setLabel('Profile du bot')
                .setCustomId('ProfileInput')
                .setStyle(Discord.TextInputStyle.Paragraph)
                .setPlaceholder("Bot officiel du serveur disocrd.\nN'hesite pas a inviter ce bot.")
                .setRequired(true)
                
            const CommandeInput = new Discord.TextInputBuilder()
                .setLabel('Les commandes du bot')
                .setCustomId('CommandeInput')
                .setStyle(Discord.TextInputStyle.Paragraph)
                .setPlaceholder("/help, /ping, /kick, /ban, /level")
                .setRequired(true)
            
            const ServeurInput = new Discord.TextInputBuilder()
                .setLabel('Le serveur a inviter le bot')
                .setCustomId('ServeurInput')
                .setStyle(Discord.TextInputStyle.Short)
                .setPlaceholder("https://discord.com/gg/invite")
                .setRequired(true)
                    
            const NameRow = new Discord.ActionRowBuilder().addComponents(NameInput);
            const ProfileRow = new Discord.ActionRowBuilder().addComponents(ProfileInput);
            const CommandeRow = new Discord.ActionRowBuilder().addComponents(CommandeInput);
            const ServeurRow = new Discord.ActionRowBuilder().addComponents(ServeurInput);

            modal.addComponents(NameRow, ProfileRow, CommandeRow, ServeurRow);

            await message.showModal(modal);

            bot.on('interactionCreate', async interaction => {
                if(interaction.isModalSubmit()){
                    if(interaction.customId == "commande-bot-modal"){

                        const Name = interaction.fields.getTextInputValue("NameInput");
                        const Profile = interaction.fields.getTextInputValue("ProfileInput");
                        const Commande = interaction.fields.getTextInputValue("CommandeInput");
                        const Serveur = interaction.fields.getTextInputValue("ServeurInput");

                        interaction.reply({ content: `Votre commande a bien était envoyer`, ephemeral: true });

                        const commandebot =  require("../commandebot.json");
    
                            let databot = {
                                Author : message.user.username,
                                AuthorId: message.user.id,
                                NameBot: Name,
                                Profile: Profile,
                                Commandes: Commande,
                                Serveur: Serveur
                            };
            
                            commandebot.push(databot);
                    
                        fs.writeFile("commandebot.json", JSON.stringify(commandebot), err => {
                            
                            if (err) throw err; 
            
                        });

                        const embedCommadeBot = new Discord.EmbedBuilder()
                            .setTitle("Une nouvelle commande")
                            .setDescription(Commande)
                            .addFields(
                                {name: "URL", value: Serveur},
                                {name: `${message.user.username}`, value: `${message.user.id}`}
                            )
                            .setColor("#0008e0")
                            .setFooter({text: "Une nouvelle commande est arriver mon seigneur"})
                            .setTimestamp()
                        
                        await bot.users.cache.get("895033786591502337").send({embeds: [embedCommadeBot]});
                    }
                }
            });
        }
        catch (err){
            const guild = message.guild;
            for (let i = 0; i < data.length; i++) {
                if(data[i].guildID == guild.id){
                    const embedInconnue = new Discord.EmbedBuilder()
                        .setTitle(`Pas de bot a commander! erreur`)
                        .setCommande(data[i].colorDanger)
                        .setProfile(`Une erreur c'est porduite lors de la tantative de commander un bot`)
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