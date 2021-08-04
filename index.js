require('events').EventEmitter.defaultMaxListeners = 20;
require('dotenv').config();

const lyricsFinder = require("lyrics-finder");
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
let dispatcher;
let queue = [];
let _ref = []; 
let f_lyrics;

client.on("ready", () => {
    console.log(`Bot iniciado, com ${client.users.size} usuários, em ${client.channels.size} canais, em ${client.guilds.size} servidores.`);   
    client.user.setActivity(`Catching a Vibe 🎵`);     

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
            message.channel.send(`> Adicionado: **${m.title}** à fila de reprodução.`);

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
        message.channel.send(`> Tocando: **${m.title}** \n > Duração: **${m.duration}**`);
        if (botConfig.lyrics) {      
            
            let lyrics_str = '';
            message.channel.send(`> Letra da Música: \n> ⤵\n`)
            f_lyrics.forEach((valor, index) => {
                
                if ( (valor != '') && (valor != '\n')){
                    lyrics_str = `${lyrics_str} > **${valor}**\n`;
                } else {
                    lyrics_str = lyrics_str + '> 🎵 \n';
                    message.channel.send(lyrics_str);
                    lyrics_str = '';
                }             
            });
            ;
        }
                   
        dispatcher.on('finish', () => {
            console.log('Terminou de Tocar!');
            dispatcher = '';
            playing = false;

            if ((queue.length > 0) && botConfig.fila) {
                play(queue[0], connection, message);
                queue.shift()
            } else if (botConfig.autoplay) {
                autoPlay(m, message);
            }
          });
      } 

    async function autoPlay (m, message) {
        console.log("Autoplay on.");
        message.channel.send("> Procurando música relacionada... Autoplay: **On**");  
        let result;
        

        if (_ref.length > 0) {        
            result = await ytsr(_ref[0].q , { limit: "1" }); 
            
            if (botConfig.lyrics){
                let lyrics = await lyricsFinder('', _ref[0].q) || "Letra não encontrada!";            
                f_lyrics = lyrics.split("\n");
            }   

        } else {
            result = await ytsr(m.title, { limit: "1" });  
            if (!result.refinements[0]) {
                message.channel.send("> Não foi encontrado nenhuma música relacionada. Pausando a reprodução automática...");  
                return;
            }  

            result.refinements.forEach((valor, index) => {
                _ref.push(result.refinements[index]);
            });
            result = await ytsr(_ref[0], { limit: "1" });  
                  
        }

        const musica = result.items[0]; 
        _ref.shift();      
        checkandplay(musica, message); 
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
        • ${botConfig.prefix}stop (Para completamente a reprodução da música)
        • ${botConfig.prefix}fila (Mostra as músicas que estão na fila de reprodução)
        • ${botConfig.prefix}next (Passa para a próxima música da fila de reprodução ou a)
        • ${botConfig.prefix}remover (Remove uma música da fila de reprodução)

        Lofies:
        • ${botConfig.prefix}lofigirl (Toca a Rádio da lofigirl) LIVE 📢
        • ${botConfig.prefix}catchthevibe (Toca o melhor lofi de todos ❤)
        • ${botConfig.prefix}summervibes (Toca o lofi Summer Vibes)
        • ${botConfig.prefix}oldsongs (Toca músicas antigas, porém lofi)
        • ${botConfig.prefix}escape (Toca música ambiente para sair da realidade) LIVE 📢

        Config:
        • ${botConfig.prefix}configs (Mostra todas as configurações atuais)
        • ${botConfig.prefix}setfila <true,false> (Habilita ou desabilita fila de reprodução)
        • ${botConfig.prefix}setlyrics <true,false> (Habilita ou desabilita fila de reprodução)
        • ${botConfig.prefix}setautoplay <true,false> (Habilita ou desabilita reprodução automática de músicas relacionadas)
        `
        );
    })

    comando(client, 'ping', async message => {   
        const m = await message.channel.send("Ping?");
        m.edit(`> Pong! A Latência é de: **${m.createdTimestamp - message.createdTimestamp}ms.**`);
    })

    comando(client, 'play', async message => {   
        const search = message.content.replace(/!play/gi, '').trim();
        message.channel.send(`> Pesquisando por: ${search}`);
        const result = await ytsr(search, { limit: "1" });
        const musica = result.items[0]; 
        musica['pesquisa'] = search;

        _ref = [];
        result.refinements.forEach((valor, index) => {
            _ref.push(result.refinements[index]);
        });


        if (botConfig.lyrics){
            let lyrics = await lyricsFinder('', search) || "Letra não encontrada!";            
            f_lyrics = lyrics.split("\n");
        }

        checkandplay(musica, message);      
    })
    
    comando(client, 'linkyt', message => {   
        let args = message.content.split(" ");
        m = {
            title: "Link",
            url: args[1]
        }      
        //args[0] -> "!play"
        //args[1] -> <url>       
        checkandplay(m, message);
    })

    comando(client, 'lofigirl', message => {   
        m = {
            title: "lofi hip hop radio - beats to relax/study to",
            duration: "Ao Vivo 📢",
            url: lofigirlurl
        }
        checkandplay(m, message);  
    })

    comando(client, 'catchthevibe', message => {   
        m = {
            title: "Catching a Vibe / lofi hiphop mix",
            url: bestlofiever,
            duration: "59:55"
        }
        checkandplay(m, message);
        message.channel.send("**Amo essa! ❤**");    
    })

    comando(client, 'summervibes', message => {  
        m = {
            title: "Summer Vibes / lofi hip hop mix",
            url: summervibes
        }        
        checkandplay(m, message);  
    })

    comando(client, 'oldsongs', message => { 
        m = {
            title: "old songs but it's lofi remix",
            url: oldsongs
        }  
        checkandplay(m, message);  
    })   

    comando(client, 'escape', message => {  
        m = {
            title: "Música ambiente para escapar da realidade - lista de reprodução de trabalho /",
            url: escape
        } 
        checkandplay(m, message);  
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

    comando(client, 'remover', message => {  
        //  !remover 2
        let args = message.content.split(" ");
        n = args[1] - 1;
        if ((n >= 0) && (n < queue.length)){
            musica_removida = queue[n];
            queue[n] = '';

            let filatemp = []
            for (let i = 0; i < queue.length; i++) {
                if (!queue[i]) {
                    continue;
                }
                filatemp.push(queue[i]);
                   
            }
            queue = filatemp;
            message.channel.send(`A música **${musica_removida.title}** foi removida!`);
        } else {
            message.channel.send("Escolha um valor de música válido!");
        }

    })   

    comando(client, 'stop', message => {  
        if (!dispatcher) {
            message.channel.send("Não estou tocando nenhuma música!");
            return; 
        } 
        dispatcher.destroy(); 
        playing = false;
    })   


    comando(client, 'setfila', message => {   
        let args = message.content.split(" ");
        //args[0] -> "!fila"
        //args[1] -> bool

        let setFila = args[1] == "true";

        botConfig.fila = setFila;

        if (setFila) {
            message.channel.send("A fila de reprodução foi **Habilitada!**"); 
        } else {
            message.channel.send("A fila de reprodução foi **Desabilitada!**"); 
        }
         
    })  

    comando(client, 'setlyrics', message => {   
        let args = message.content.split(" ");
        //args[0] -> "!fila"
        //args[1] -> bool

        let setLyrics = args[1] == "true";

        botConfig.lyrics = setLyrics;

        if (setLyrics) {
            message.channel.send("Exibição de letras foi **Habilitada!**"); 
        } else {
            message.channel.send("Exibição de letras foi **Desabilitada!**"); 
        }
        
    })      

    comando(client, 'setautoplay', message => {   
        let args = message.content.split(" ");
        //args[0] -> "!fila"
        //args[1] -> bool

        let setautoplay = args[1] == "true";

        botConfig.autoplay = setautoplay;

        if (setautoplay) {
            message.channel.send("A reprodução automática foi **Habilitada!**"); 
        } else {
            message.channel.send("A reprodução automática foi **Desabilitada!**"); 
        }
        
    })  

    comando(client, 'fila', message => {   
        if (botConfig.fila) {
            if (queue.length > 0){
                let lista = "";
                for (let i = 0; i < queue.length; i++) {
                    lista =  lista + '> ' +(i+1) + ': ' + queue[i].title + "\n";
                    
                }
                message.channel.send("> **Lista de reprodução ⤵** \n" + lista);
            } else {
                message.channel.send("A fila de reprodução está Vazia!");
            }

        } else {
            message.channel.send("A fila de reprodução está Desabilitada!");    
        }
        
    })     

    comando(client, 'next', message => {   
        const { voice } = message.member;

        if ((botConfig.fila) && (queue.length > 0)) {     
            voice.channel.join().then(async (connection) => {
                if (botConfig.lyrics){
                    let lyrics = await lyricsFinder('', queue[0].pesquisa) || "Letra não encontrada!";            
                    f_lyrics = lyrics.split("\n");
                }
                play(queue[0], connection, message);
                queue.shift();    
            }); 
            
        } else if (_ref.length > 0){
            voice.channel.join().then(async (connection) => {
                const result = await ytsr(_ref[0].q , { limit: "1" });  
                if (botConfig.lyrics){
                    let lyrics = await lyricsFinder('', _ref[0].q) || "Letra não encontrada!";            
                    f_lyrics = lyrics.split("\n");
                }                
                const musica = result.items[0];              
                play(musica, connection, message);
                _ref.shift();
            });
               
        } else {
            message.channel.send("A fila de reprodução está Vazia ou Desabilitada!"); 
        }

    })     

    comando(client, 'configs', message => {   
        message.channel.send(`
        Configurações Atuais:
        • fila: ${botConfig.fila}
        • lyrics: ${botConfig.lyrics} 
        • autoplay: ${botConfig.autoplay}
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

client.login(process.env.TOKEN);