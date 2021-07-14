//Execução de comandos in-chat

const { prefix, chatname } = require('./config.json');

module.exports = (client, aliases, callback) => {
    if (typeof aliases === 'string'){
        aliases = [aliases]
    }
     
    client.on("message", message => {
        if (message.channel.name != chatname) return;

        const { content } = message;

        aliases.forEach(alias => {
            const command = `${prefix}${alias}`
            if (content.startsWith(`${command}`) || content === command ){
                console.log(`Executando comando: ${command}`);
                callback(message);
            }
        });


    }
)};
