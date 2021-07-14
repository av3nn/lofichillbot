    /* 
        APPLICATION ID
        864836990481334272

        PUBLIC KEY
        60fcd5997fbbc720b96def0b94a2bf6b750a57a50a7e403519e5ffd398ad3485

        TOKEN
        ODY0ODM2OTkwNDgxMzM0Mjcy.YO7QNg.st65pDWbdJG7HAVTL29wSWckJwo
    */

const Discord = require("discord.js");
const config = require("./config.json")
    
const client = new Discord.Client();
const GCM = new Discord.GuildChannelManager();

client.on("ready", () => {
    console.log(`Bot iniciado, com ${client.users.size} usuários, em ${client.channels.size} canais, em ${client.guilds.size} servidores.`);
    client.user.setActivity(`Catching a Vibe 🎵`);

    
});
client.on("guildCreate", guild => {
    console.log(`O Bot entrou no servidor: ${guild.name} (id: ${guild.id}), com ${guild.memberCount} pessoas!`);
    client.on("message", async message => {
        message.channel.send("Para saber meus comandos Digite /comandos!");
    });
    GCM.create("Lofi-Chill-Bot",{topic: "Chat dedicado ao bot."})
    .then(console.log)
    .catch(console.error);

});

client.on("guildDelete", guild => {
    console.log(`O Bot foi removido do servidor: ${guild.name} (id: ${guild.id})`)
}); 

client.on("message", async message => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const comando = args.shift().toLowerCase();

    if (comando === "comandos"){
        message.channel.send
    (`
    Meus Comandos são:
        /ping
        /comandos

    `);
    }

    if (comando === "ping") {
        const m = await message.channel.send("Ping?");
        m.edit(`Pong! A Latência é de: ${m.createdTimestamp - message.createdTimestamp}ms.`);
    }
    
}); 

client.login(config.token);