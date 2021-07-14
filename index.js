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

client.on("ready", () => {
    console.log(`Bot iniciado, com ${client.users.size} usuários, em ${client.channels.size} canais, em ${client.guilds.size} servidores.`);
    client.user.setGame(`Eu estou em ${client.guilds.size} servidores`)
});

client.on("guildCreate", guild => {
    console.log(`O Bot entrou no servidor: ${guild.name} (id: ${guild.id}), com ${guild.memberCount} pessoas!`);
    client.user.setActivity(`Estou em ${client.guilds.size} servidores`)
});

client.on("guildDelete", guild => {
    console.log(`O Bot foi removido do servidor: ${guild.name} (id: ${guild.id})`)
    client.user.setActivity(`Estou em ${client.guilds.size} servidores`)
}); 

client.on("message", async message => {

}); 

client.login(config.token);