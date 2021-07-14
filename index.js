    /* 
        APPLICATION ID
        864836990481334272

        PUBLIC KEY
        60fcd5997fbbc720b96def0b94a2bf6b750a57a50a7e403519e5ffd398ad3485

        TOKEN
        ODY0ODM2OTkwNDgxMzM0Mjcy.YO7QNg.st65pDWbdJG7HAVTL29wSWckJwo
    */
const ytdl = require("ytdl-core");
const Discord = require("discord.js");
const config = require('./config.json');
const { chatname } = require('./config.json');
const comando = require("./comandos.js");
const client = new Discord.Client();


client.on("ready", () => {
    console.log(`Bot iniciado, com ${client.users.size} usuários, em ${client.channels.size} canais, em ${client.guilds.size} servidores.`);
    
    client.user.setActivity(`Catching a Vibe 🎵`);  

    comando(client, 'ping', async message => {   
        const m = await message.channel.send("Ping?");
        m.edit(`Pong! A Latência é de: ${m.createdTimestamp - message.createdTimestamp}ms.`);
    })
    
    comando(client, 'comandos',  message => {   
        message.channel.send
        ("Comandos disponíveis: \n" 
        + "!comandos (Mostra todos os comandos disponíveis)\n"
        + "!ping (Mostra o ping entre você e o bot)\n"
        + "!tocar <> \n"
        + "!ping \n"

        );
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