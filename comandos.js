//Execução de comandos in-chat

const botConfig = require('./botconfig.js');

module.exports = (client, aliases, callback) => {
    if (typeof aliases === 'string'){
        aliases = [aliases]
    }
     
    client.on("message", message => {
        if (message.channel.name != botConfig.chatname) return;

        const { content } = message;

        aliases.forEach(alias => {
            const command = `${botConfig.prefix}${alias}`
            if (content.startsWith(`${command}`) || content === command ){
                console.log(`Executando comando: ${command}`);
                callback(message);
            }
        });


    }
)};
