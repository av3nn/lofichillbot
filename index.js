require('events').EventEmitter.defaultMaxListeners = 15;

const ytsr = require("ytsr");
const ytdl = require("ytdl-core");
const Discord = require("discord.js");
const botConfig = require('./botconfig.js');
const comando = require("./comandos.js");
const client = new Discord.Client();
  

/* <-- <-- <-- <-- <-- URLS YOUTUBE LOFIS --> --> --> --> -->  */
const lofigirlurl = 'https://www.youtube.com/watch?v=5qap5aO4i9A';
const bestlofiever = 'https://www.youtube.com/watch?v=wx2SmvQ8dtM';
const summervibes = 'https://www.youtube.com/watch?v=I3tgkBCZr2o';
const oldsongs = 'https://www.youtube.com/watch?v=BrnDlRmW5hs';
const escape = 'https://www.youtube.com/watch?v=qt_urUz42vI';
/////////////////////////////////////////////////////////////////////

let playing = false; 

client.on("ready", () => {
    console.log(`Bot iniciado, com ${client.users.size} usuários, em ${client.channels.size} canais, em ${client.guilds.size} servidores.`);   
    client.user.setActivity(`Catching a Vibe 🎵`);     
    let dispatcher;
    let queue = [];

    function checkandplay(m, message){
        const { voice } = message.member;

        if (!m.url){
            message.channel.send("Me diga um link válido!");
            return;
        }
        
        if (!voice.channelID){
            message.channel.send("Você precisa estar em um chat de voz!");
            return;
        }   
        
        if ((botConfig.fila) && (playing)) { 
            queue.push(m);
            message.channel.send(`Adicionado: ${m.title} à fila de reprodução.`);

        } else {
            voice.channel.join().then((connection) => {            
                play(m, connection, message); 
            });           
        }
    }

    function play(m, connection, message) {
        const stream = ytdl(m.url, { filter: "audioonly" });
        dispatcher = connection.play(stream, { volume: 1, seek: 0 });
        playing = true;
        message.channel.send(`Tocando: ${m.title}`);

        dispatcher.on('finish', () => {
            console.log('Terminou de Tocar!');
            dispatcher = '';
            playing = false;

            if ((queue.length > 0) && botConfig.fila) {
                play(queue[0].url, connection);
                queue.shift()
            }
          });
  
      } 

    comando(client, 'comandos',  message => {   
        message.channel.send
        (`Comandos disponíveis:

        Comandos Gerais:
        • ${botConfig.prefix}comandos (Mostra todos os comandos disponíveis)
        • ${botConfig.prefix}ping (Mostra o ping entre você e o bot)
        • ${botConfig.prefix}play <nome da música> (Toca qualquer música do YouTube)
        • ${botConfig.prefix}linkyt <link do youtube> (Toca qualquer link do YouTube)
        • ${botConfig.prefix}pause (Pausa a música que está tocando)
        • ${botConfig.prefix}resume (Continua a música de onde parou)
        • ${botConfig.prefix}fila (Mostra as músicas que estão na fila de reprodução)
        • ${botConfig.prefix}next (Passa para a próxima música da fila de reprodução)

        Lofies:
        • ${botConfig.prefix}lofigirl (Toca a Rádio da lofigirl) LIVE 📢
        • ${botConfig.prefix}catchthevibe (Toca o melhor lofi de todos ❤)
        • ${botConfig.prefix}summervibes (Toca o lofi Summer Vibes)
        • ${botConfig.prefix}oldsongs (Toca músicas antigas, porém lofi)
        • ${botConfig.prefix}escape (Toca música ambiente para sair da realidade) LIVE 📢

        Config:
        • ${botConfig.prefix}configs (Mostra todas as configurações atuais)
        • ${botConfig.prefix}setfila <true,false> (Habilita ou desabilita fila de reprodução)
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

        checkandplay(musica, message);      
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

    comando(client, 'resume', message => {  
        if (!dispatcher) {
            message.channel.send("Não estou tocando nenhuma música!");
            return; 
        } 
        dispatcher.resume(); 
    })   


    comando(client, 'setfila', message => {   
        let args = message.content.split(" ");
        //args[0] -> "!fila"
        //args[1] -> bool

        let setFila = args[1] == "true";

        botConfig.fila = setFila;

        if (setFila) {
            message.channel.send("A fila de reprodução foi Habilitada!"); 
        } else {
            message.channel.send("A fila de reprodução foi Desabilitada!"); 
        }
        
    })  

    comando(client, 'fila', message => {   
        if (botConfig.fila) {
            if (queue.length > 0){
                let lista = "";
                for (let i = 0; i < queue.length; i++) {
                    lista =  lista + (i+1) + ': ' + queue[i].title + "\n";
                    
                }
                message.channel.send("Lista de reprodução \n" + lista);
            } else {
                message.channel.send("A fila de reprodução está Vazia!");
            }

        } else {
            message.channel.send("A fila de reprodução está Desabilitada!");    
        }
        
    })     

    comando(client, 'next', message => {   
        if (botConfig.fila) {
            if (queue.length > 0){
                const { voice } = message.member;
                voice.channel.join().then((connection) => {
                    play(queue[0], connection, message);
                    queue.shift();    
                }); 
               
            } else {
                message.channel.send("A fila de reprodução está Vazia!");
            }

        } else {
            message.channel.send("A fila de reprodução está Desabilitada!");    
        }
        
    })     

    comando(client, 'config', message => {   
        message.channel.send(`
        Configurações Atuais:
        • fila: ${botConfig.fila}
        `);   
    })     

});
client.on("guildCreate", guild => {
    console.log(`O Bot entrou no servidor: ${guild.name} (id: ${guild.id}), com ${guild.memberCount} pessoas!`);
    
    const textchat = guild.channels.create(botConfig.chatname, {type: "text", topic: "Chat Dedicado ao Lofi Chill Bot! Utilize !comandos para obter ajuda."})
    .then(console.log)
    .catch(console.error);   

});

client.on("guildDelete", guild => {
    console.log(`O Bot foi removido do servidor: ${guild.name} (id: ${guild.id})`)
}); 

client.login(global.token);