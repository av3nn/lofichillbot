require('events').EventEmitter.defaultMaxListeners = 15;

const ytsr = require("ytsr");
const ytdl = require("ytdl-core");
const Discord = require("discord.js");
const config = require('./config.json');
const { prefix, chatname } = require('./config.json');
const comando = require("./comandos.js");
const client = new Discord.Client();


/* <-- <-- <-- <-- <-- URLS YOUTUBE LOFIS --> --> --> --> -->  */
const lofigirlurl = 'https://www.youtube.com/watch?v=5qap5aO4i9A';
const bestlofiever = 'https://www.youtube.com/watch?v=wx2SmvQ8dtM';
const summervibes = 'https://www.youtube.com/watch?v=I3tgkBCZr2o';
const oldsongs = 'https://www.youtube.com/watch?v=BrnDlRmW5hs';
const escape = 'https://www.youtube.com/watch?v=qt_urUz42vI';
/////////////////////////////////////////////////////////////////////

let fila

client.on("ready", () => {
    console.log(`Bot iniciado, com ${client.users.size} usuários, em ${client.channels.size} canais, em ${client.guilds.size} servidores.`);   
    client.user.setActivity(`Catching a Vibe 🎵`);     
    let dispatcher;


    function checkandplay(url, message){
        const { voice } = message.member;

        if (!url){
            message.channel.send("Me diga um link válido!");
            return;
        }
        
        if (!voice.channelID){
            message.channel.send("Você precisa estar em um chat de voz!");
            return;
        }   
        
        voice.channel.join().then((connection) => {
            play(url, connection); 
        });
  
    }

    function play(url, connection) {
        playing = true;
        const stream = ytdl(url, { filter: "audioonly" });
        dispatcher = connection.play(stream, { volume: 1, seek: 0 });

        dispatcher.on('finish', () => {
            console.log('Terminou de Tocar!');
            dispatcher = '';
          });
  
      } 

    comando(client, 'comandos',  message => {   
        message.channel.send
        (`Comandos disponíveis:

        Comandos Gerais:
        • ${prefix}comandos (Mostra todos os comandos disponíveis)
        • ${prefix}ping (Mostra o ping entre você e o bot)
        • ${prefix}play <nome da música> (Toca qualquer música do YouTube)
        • ${prefix}linkyt <link do youtube> (Toca qualquer link do YouTube)
        • ${prefix}pause (Pausa a música que está tocando)
        • ${prefix}resume (Continua a música de onde parou)

        Lofies:
        • ${prefix}lofigirl (Toca a Rádio da lofigirl) LIVE 📢
        • ${prefix}catchthevibe (Toca o melhor lofi de todos ❤)
        • ${prefix}summervibes (Toca o lofi Summer Vibes)
        • ${prefix}oldsongs (Toca músicas antigas, porém lofi)
        • ${prefix}escape (Toca música ambiente para sair da realidade) LIVE 📢
        `
        );
    })

    comando(client, 'ping', async message => {   
        const m = await message.channel.send("Ping?");
        m.edit(`Pong! A Latência é de: ${m.createdTimestamp - message.createdTimestamp}ms.`);
    })

    comando(client, 'play', async message => {   
        const search = message.content.replace(/!play/gi, '').trim();
        message.channel.send(`Pesquisando por: ${search}`);
        const result = await ytsr(search, { limit: "1" });
        const musica = result.items[0]; 
        message.channel.send(`Tocando: ${musica.title}`);
        checkandplay(musica.url, message);
        
    })
    

    comando(client, 'linkyt', message => {   
        let args = message.content.split(" ");
        //args[0] -> "!play"
        //args[1] -> <url>       
        checkandplay(args[1], message);
    })

    comando(client, 'lofigirl', message => {   
        checkandplay(lofigirlurl, message);  
    })

    comando(client, 'catchthevibe', message => {   
        checkandplay(bestlofiever, message);
        message.channel.send("Amo essa! ❤");    
    })

    comando(client, 'summervibes', message => {   
        checkandplay(summervibes, message);  
    })

    comando(client, 'oldsongs', message => {   
        checkandplay(oldsongs, message);  
    })   

    comando(client, 'escape', message => {   
        checkandplay(escape, message);  
    })  

    comando(client, 'pause', message => {   
        if (!dispatcher) {
            message.channel.send("Não estou tocando nenhuma música!");
            return; 
        } 
        dispatcher.pause(); 
    })   

    comando(client, 'resume', async message => {  
        if (!dispatcher) {
            message.channel.send("Não estou tocando nenhuma música!");
            return; 
        } 
        dispatcher.resume(); 
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