const Discord = require("discord.js");
const data = require("../data.json");

module.exports = {

    name: "recrutement",
    description: "Permet  d'envoyer un message pour allerter l'état de recrutement d'une cathegorie",
    permission: Discord.PermissionFlagsBits.Administrator,
    dm: false,
    category: "Inforamtion",
    options: [
        {
            type: "string",
            name: "etat",
            description: "Active ou désactive le recrutement",
            required: true,
            autocomplete: false,
        },
        {
            type: "string",
            name: "cathegorie",
            description: "Cathegorie de recrutement",
            required: true,
            autocomplete: false,
        }
    ],

    async run(bot, message, args){

        try {
            await message.deferReply();
            const guild = message.guild;

            for (let i = 0; i < data.length; i++) {
                if(data[i].guildID == guild.id){
                    const channel = message.guild.channels.cache.find(channel => channel.name === data[i].logs.name);
                    if(!channel) return;
                    let etat = args.getString("etat");
                    let cathegorie = args.getString("cathegorie");
                    if(!etat){
                        const embedInconnue = new Discord.EmbedBuilder()
                            .setTitle(`Inconnue`)
                            .setColor(data[i].colorWarn)
                            .setDescription(`Pas d'état.\nVeuillez préciser un état de recrutement`)
                            .setTimestamp();
                        return message.followUp({embeds: [embedInconnue]})
                        .then((send) => {
                            setTimeout(() => {
                                send.delete();
                            }, 3000);
                        });
                    }

                    if(!cathegorie){
                        const embedInconnue = new Discord.EmbedBuilder()
                            .setTitle(`Inconnue`)
                            .setColor(data[i].colorWarn)
                            .setDescription(`Pas de cathegorie.\nVeuillez préciser une cathégorie de recrutement`)
                            .setTimestamp();
                        return message.followUp({embeds: [embedInconnue]})
                        .then((send) => {
                            setTimeout(() => {
                                send.delete();
                            }, 3000);
                        });
                    }

                    if(etat != "on" && etat != "off") {
                        const embedInconnue = new Discord.EmbedBuilder()
                            .setTitle(`Etat inconnue`)
                            .setColor(data[i].colorWarn)
                            .setDescription(`Cette état n'existe pas\n Les état disponible son \`on\` ou \`off\``)
                            .setTimestamp();
                        return message.followUp({embeds: [embedInconnue]})
                        .then((send) => {
                            setTimeout(() => {
                                send.delete();
                            }, 3000);
                        });
                    }

                    if(etat == "on"){
                        const embedEnabled = new Discord.EmbedBuilder()
                            .setTitle(`Recrutement ouvert`)
                            .setColor(data[i].colorBase)
                            .setDescription(`Les recrutemement pour ètre **${cathegorie}** sont désormet **ouvert**`)
                            .setTimestamp();
                        await message.followUp({embeds: [embedEnabled]});
                        return channel.send({embeds: [embedEnabled]});

                    }

                    if(etat == "off"){
                        const embedDisable = new Discord.EmbedBuilder()
                            .setTitle(`Recrutement fermet`)
                            .setColor(data[i].colorBase)
                            .setDescription(`Les recrutemement pour ètre **${cathegorie}** sont désormet **fermet**`)
                            .setTimestamp();
                        await message.followUp({embeds: [embedDisable]});
                        return channel.send({embeds: [embedDisable]});
                    }
                }
            }
        }
        catch (err){
            const guild = message.guild;
            for (let i = 0; i < data.length; i++) {
                if(data[i].guildID == guild.id){
                    let etat = args.getString("etat");
                    let cathegorie = args.getString("cathegorie");
                    const embedInconnue = new Discord.EmbedBuilder()
                        .setTitle(`Pas d'état! erreur`)
                        .setColor(data[i].colorDanger)
                        .setDescription(`Une erreur c'est porduite lors de la tantative de passer a ${etat} le recrutement de ${cathegorie}.`)
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