const Discord = require("discord.js");
const data = require("../data.json");

module.exports = async bot =>{

    bot.on('messageDelete', messageDelete =>{
        if(messageDelete.author.bot) return;

        const guild = messageDelete.guild;
        for (let i = 0; i < data.length; i++) {
            if(data[i].guildID == guild.id){
                const channel = messageDelete.guild.channels.cache.find(channel => channel.name === data[i].logs.name);
                if(!channel) return;
                const embedLogMessageDelete = new Discord.EmbedBuilder()
                    .setColor(data[i].colorBase)
                    .setTitle("Message supprimé")
                    .setThumbnail(messageDelete.author.displayAvatarURL({dynamic: true}))
                    .setDescription(`Dans le [salon](${messageDelete.url}), ${messageDelete.author.tag} à **supprimé** le messages.\n**Message supprimé:**\n${messageDelete.content ? messageDelete.content: "None"}`.slice(0, 4096))
            
                    if(messageDelete.attachments.size >= 1){
                        embedLogMessageDelete.addField(`Attachments:`, `${messageDelete.attachments.map(a => a.url)}`, true);
                    }
                channel.send({ embeds: [embedLogMessageDelete] });
            }
        }
    });
    
    bot.on('guildMemberAdd', member =>{
    
        const user = bot.users.fetch(member.id);

        const guild = member.guild;
        for (let i = 0; i < data.length; i++) {
            if(data[i].guildID == guild.id){
                const channel = member.guild.channels.cache.find(channel => channel.name === data[i].arriver.name);
                if(!channel) return;
                const embedJoin = new Discord.EmbedBuilder()
                    .setTitle(`Bienvenue sur ${member.guild.name} !`)
                    .setColor(data[i].colorBase)
                    .setDescription(`${member} vien de nous rejoindre.\nToute l'équipe de ${member.guild.name} et sa communauté te souhaite la bienvenue !`)
                    .addFields(
                        {name: "Total members" , value: `${member.guild.memberCount}`}
                    )  
                    .setFooter({text: "N'oubliez pas de respecter les règles du serveur Discord."})
                    .setThumbnail(user.displayName)
                    .setThumbnail(member.displayAvatarURL({dynamic: true}))
                    .setTimestamp();
                channel.send({embeds: [embedJoin]});

                const embedJoinDM = new Discord.EmbedBuilder()
                    .setTitle(`Bienvenue sur ${member.guild.name} !`)
                    .setColor(data[i].colorBase)
                    .setDescription(`${member} vien de nous rejoindre.\nToute l'équipe de ${member.guild.name} et sa communauté te souhaite la bienvenue !`)
                    .addFields(
                        {name: "Total members" , value: `${member.guild.memberCount}`}
                    )  
                    .setFooter({text: "N'oubliez pas de respecter les règles du serveur Discord."})
                    .setThumbnail(user.displayName)
                    .setThumbnail(member.display)
                member.send({embeds: [embedJoinDM]});

                const ghostping = require("../ghostping.json");
                for(i = 0; i< ghostping.length; i++){
                    if(ghostping[i].guildID == guild.id){
                        console.log(ghostping[i].idsalon.id);
                        member.guild.channels.cache.get(ghostping[i].idsalon.id).send(`${member}`)
                        .then((send) => {
                            setTimeout(() => {
                                send.delete();
                            }, 1000);
                        });
                    }
                }
            }
        }
    });
    
    bot.on('guildMemberRemove', member =>{
        const user = bot.users.fetch(member.id);
        
        const guild = member.guild;
        for (let i = 0; i < data.length; i++) {
            if(data[i].guildID == guild.id){
                const channel = member.guild.channels.cache.find(channel => channel.name === data[i].depart.name);
                if(!channel) return;
                const embedLeave = new Discord.EmbedBuilder()
                    .setTitle(`Bienvenue sur ${member.guild.name} !`)
                    .setColor(data[i].colorBase)
                    .setDescription(`${member} vien de nous quitter.\nToute l'équipe de ${member.guild.name} et sa communauté est triste de te voir partire !`)
                    .addFields(
                        {name: "Total members" , value: `${member.guild.memberCount}`},
                        {name: "Total users" , value: `${member.guild.members.cache.filter(member => !member.user.bot).size}`}
                    )  
                    .setFooter({text: "N'oubliez pas de respecter les règles du serveur Discord."})
                    .setThumbnail(user.displayName)
                    .setThumbnail(member.displayAvatarURL({dynamic: true}))
                    .setTimestamp();
                channel.send({embeds: [embedLeave]});
            }
        }
    });

    bot.on('messageReactionAdd', async (reaction, user) => {
        const guild = reaction.message;
        if(reaction.message.partial) await reaction.message.fetch();
        if(reaction.partial) await reaction.fetch();
        if(user.bot) return;
        if(!reaction.message.guild) return;

        for (let i = 0; i < data.length; i++) {
            if(data[i].guildID == guild.guildId){
                if(reaction.message.channel.id == guild.channel)
                {
                    if(reaction.emoji.name === data[i].emoji)
                    {
                        await reaction.message.guild.members.cache.get(user.id).roles.add(data[i].role);
                    }
                    else
                    {
                        return;
                    }
                }
            }
        }
    });
}