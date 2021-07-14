const ytdl = require("ytdl-core");
const Discord = require("discord.js");
const config = require('./config.json');
const { prefix, chatname } = require('./config.json');
const comando = require("./comandos.js");
const client = new Discord.Client();
const path = require("path")


client.on("ready", () => {
    console.log(`Bot iniciado, com ${client.users.size} usuários, em ${client.channels.size} canais, em ${client.guilds.size} servidores.`);
    
    client.user.setActivity(`Catching a Vibe 🎵`);  
  
    comando(client, 'comandos',  message => {   
        message.channel.send
        (`Comandos disponíveis:
        • ${prefix}comandos (Mostra todos os comandos disponíveis)
        • ${prefix}ping (Mostra o ping entre você e o bot)
        • ${prefix}tocar <link do youtube>
        • ${prefix}radiolofigirl <Toca a Rádio da lofigirl>
        `
        );
    })

    comando(client, 'ping', async message => {   
        const m = await message.channel.send("Ping?");
        m.edit(`Pong! A Latência é de: ${m.createdTimestamp - message.createdTimestamp}ms.`);
    })


    comando(client, 'tocar', message => {   
        let args = message.content.split(" ");
        //args[0] -> "!tocar"
        //args[1] -> <url>
        const { voice } = message.member;

        if (!args[1]){
            message.channel.send("Me diga um link válido!");
            return;
        }
        
        if (!voice.channelID){
            message.channel.send("Você precisa estar em um chat de voz!");
            return;
        }       

        voice.channel.join()

        try {          
            const stream = ytdl(args[1], { filter: "audioonly" });

        } catch (error) {
            console.log(error);  
        }
    })


});
client.on("guildCreate", guild => {
    console.log(`O Bot entrou no servidor: ${guild.name} (id: ${guild.id}), com ${guild.memberCount} pessoas!`);
    
    const textchat = guild.channels.create(chatname, {type: "text", topic: "Chat Dedicado ao Lofi Chill Bot! Utilize !comandos para obter ajuda."})
    .then(console.log)
    .catch(console.error);   

});

client.on("guildDelete", guild => {
    console.log(`O Bot foi removido do servidor: ${guild.name} (id: ${guild.id})`)
}); 

client.login(config.token);