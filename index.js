const { CanvasSenpai } = require("canvas-senpai")
const canva = new CanvasSenpai();
const Discord = require('discord.js');
const { readdirSync } = require('fs');
const { prefixo } = require("./config.js")
const fs = require("fs");
const client = new Discord.Client();
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

client.on('ready', () => {
    console.log(`${client.user.username} ✅`)
})

require("./functions/quote.js")

const DisTube = require("distube")

// DisTube

client.distube = new DisTube(client, { searchSongs: true, emitNewSongOnly: true })

client.distube
  .on("playSong", (message, queue, song) => {
    const playSongEmbed = new Discord.MessageEmbed()
      .setTitle('Iniciando Batidão')
      .setDescription(`[${song.name}](${song.url})`)
      .addField('**Visualisações:**', song.views)
      .addField('**Duração:**', song.formattedDuration)
      .setImage(song.thumbnail)
      .setColor("BLUE")
    message.channel.send(playSongEmbed)
  })
  .on("addSong", (message, queue, song) =>
    message.channel.send(
      `✅ | Adicionando ${song.name} - \`${song.formattedDuration}\` a fila por ${song.user}`
    )
  )
  .on("playList", (message, queue, playlist, song) =>
    message.channel.send(
      `${client.emotes.play} | Play \`${playlist.title}\` playlist (${playlist.total_items
      } Musicas).\nPedido por: ${song.user}\nTocando agora \`${song.name}\` - \`${song.formattedDuration
      }\`\n${status(queue)}`
    )
  )
  .on("addList", (message, queue, playlist) =>
    message.channel.send(
      `✅ | Adicionando \`${playlist.title}\` playlist (${playlist.total_items
      } Musicas) a Fila\n${status(queue)}`
    )
  )
  .on("searchResult", (message, resultado) => {
  let i = 0;
  let Procura = new Discord.MessageEmbed()
  .setColor("BLUE")
  .setDescription(`**Escolha uma dessas opções abaixo para eu Tocar:\n${resultado.map(musica => `**${++i}**. \`${musica.name}\` - \`${musica.formattedDuration}\``).join("\n")}\n➕️ Para escolher digite o número do lado da música para cancelar digite qualquer coisa no chat**`)
  message.channel.send(Procura)
  })
  .on("initQueue", queue => {
    queue.autoplay = false;
    queue.volume = 100;
  })


client.distube.on("error", (message, err) => message.channel.send(
    "Houve um erro: " + err
));

const ascii = require('ascii-table')
let table = new ascii("Comandos");
table.setHeading('Comando', ' Status');
client.on("ready", () => {
    readdirSync('./commands/').forEach(dir => {
        const commands = readdirSync(`./commands/${dir}/`).filter(file => file.endsWith('.js'));
        for(let file of commands){
            let pull = require(`./commands/${dir}/${file}`);
            if(pull.name){
                client.commands.set(pull.name, pull);
                table.addRow(file,'✅')
            } else {
                table.addRow(file, '❌ -> Faltando alguma coisa coisa.')
                continue;
            }if(pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach(alias => client.aliases.set(alias, pull.name))
        }
    });
    console.log(table.toString());
})

client.on('ready', () => {
  let status = [
    `🍜 | Oi eu sou o soma e meu prefixo é s.`,
    `🍥 | ${client.users.cache.size} pessoas me conhecem e estou em ${client.guilds.cache.size} servidores!`,
    `🔝 | Vote em mim na top.gg!`
    ],
    i = 0;
    setInterval(() => client.user.setActivity(`${status[i++ % status.length]}`, {
      type: "WATCHING"
    }), 500 * 60); //os tipos são PLAYING, WATCHING, LISTENING, STREAMING
    client.user.setStatus("online") //vc pode altera para online, dnd, idle, invisible
    
let avatares = [
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScxoqPkInbqbwcUDRHeJZxhNFoT4J-Hs2ZTA&usqp=CAU',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRB4xRYE6zjM8hsW5QBfDJheYjwoDN_unegaw&usqp=CAU',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0j37jpEh1gO8MAGmFNYuG6I_-AcMEvQMyaw&usqp=CAU',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCBdaoUz1aWQNJv2y3cTtdMaD-LL4yVI6npQ&usqp=CAU',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6_nftLKaTPVjmvWZ_Y1If3UbRpMy2zyALJQ&usqp=CAU',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRD1M0P0Ndobxp6CNlo5TyQqkZhFOD6nFFtSw&usqp=CAU',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRV5Fl0prUvSrT6wVncLTz8hW24Twi2q6Eakw&usqp=CAU'
  ]
  let a = 0;
  setInterval( () => client.user.setAvatar(`${avatares[a++ % avatares.length]}`), 1200000)
    
    console.log('Bot Online')
})

readdirSync('./commands/').forEach(dir => {
    cmds = readdirSync(`./commands/${dir}/`).filter(file => file.endsWith('.js'));
    for (var file of cmds) {
        pull = require(`./commands/${dir}/${file}`);
        if (pull.name) {
            client.commands.set(pull.name, pull);
        } else {
            continue;
        }
        if (pull.aliases && Array.isArray(pull.aliases))
            pull.aliases.forEach(alias => client.aliases.set(alias, pull.name));
    }
});



client.on('message', async message => {
    let prefix;
    if (message.author.bot || message.channel.type === "dm") return;
        try {
            let fetched = await db.fetch(`prefix_${message.guild.id}`);
            if (fetched == null) {
                prefix = prefixo
            } else {
                prefix = fetched
            }
        } catch (e) {
            console.log(e)
    };
    if (
        message.content.startsWith(`<@!${client.user.id}>`) ||
        message.content.startsWith(`<@${client.user.id}>`)
    )
        return message.reply(
            `:tada: Meu prefixo é: \`${prefix}\`, use \`${prefix}help\` para ver meus comandos!`
        );
    if (!message.content.toLowerCase().startsWith(prefix)) return;
    var args = message.content
        .slice(prefix.length)
        .trim()
        .split(/ +/g);
    var cmd = args.shift().toLowerCase();
    if (cmd.length === 0) return;
    var command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));
    if (!command) return message.reply(`:x: Comando não encontrado \`${cmd}\`!`);
    try {
        if (command) command.run(client, message, args);
    } catch (e) {
        message.channel.send(
            `:x: Ocorreu um erro ao executar o comando \`${command.name}\`!\nErro: ${e}.`
        );
        console.log(e);
    }
});

const { GiveawaysManager } = require('discord-giveaways');
const db = require('quick.db');
if (!db.get('giveaways')) db.set('giveaways', []);

const GiveawayManagerWithOwnDatabase = class extends GiveawaysManager {
	async getAllGiveaways() {
		return db.get('giveaways');
	}
	
	async saveGiveaway(messageID, giveawayData) {
		// Add the new one
		db.push('giveaways', giveawayData);
		// Don't forget to return something!
		return true;
	}

	async editGiveaway(messageID, giveawayData) {
		// Gets all the current giveaways
		const giveaways = db.get('giveaways');
		// Remove the old giveaway from the current giveaways ID
		const newGiveawaysArray = giveaways.filter(
			giveaway => giveaway.messageID !== messageID
		);
		// Push the new giveaway to the array
		newGiveawaysArray.push(giveawayData);
		// Save the updated array
		db.set('giveaways', newGiveawaysArray);
		// Don't forget to return something!
		return true;
	}

	// This function is called when a giveaway needs to be deleted from the database.
	async deleteGiveaway(messageID) {
		// Remove the giveaway from the array
		const newGiveawaysArray = db
			.get('giveaways')
			.filter(giveaway => giveaway.messageID !== messageID);
		// Save the updated array
		db.set('giveaways', newGiveawaysArray);
		// Don't forget to return something!
		return true;
	}
};

// Create a new instance of your new class
const manager = new GiveawayManagerWithOwnDatabase(client, {
	storage: false,
	updateCountdownEvery: 5000,
	default: {
		botsCanWin: false,
		exemptPermissions: ['MANAGE_MESSAGES', 'ADMINISTRATOR'],
		embedColor: '#FF0000',
		reaction: '🎉'
	}
});
client.giveawaysManager = manager;

require('dotenv').config();

const { env } = require('process');
const express = require('express');
const app = express();
app.get('/', (request, response) => {
	console.log('Ping recebido!');
	response.sendStatus(200);
});
app.listen(process.env.PORT);

client.on('guildMemberAdd', async member => {
	const { createCanvas, loadImage } = require('canvas');
	const channel = await db.fetch(`welcome_${member.guild.id}`);
    if (!channel) return;
    
    let data = await canva.welcome(member, { link: "https://wallpapercave.com/wp/wp5128415.jpg" })
 
    const attachment = new Discord.MessageAttachment(
      data,
      "entrada.png"
    );
    
    member.guild.channels.cache.get(channel).send(`${member}, Entrou no Servidor!`, attachment);
});

client.on('guildMemberRemove', async member => {
const { createCanvas, loadImage } = require('canvas');
	const channel = await db.fetch(`welcome_${member.guild.id}`);
    if (!channel) return;
    
    let data = await canva.welcome(member, { link: "https://wallpapercave.com/wp/wp5128415.jpg" })
 
    const attachment = new Discord.MessageAttachment(
      data,
      "saida.png"
    );
    
    member.guild.channels.cache.get(channel).send(`${member}, Saiu do Servidor!`, attachment);
});

let contentStart;
let contentEnd;

client.on("message", async (message) => {
    let nqn = db.get(`nqn_${message.guild.id}`)
    
    if (nqn === "off") return;
  
    if(message.author.bot) return;
    let substringArray = get_substrings_between(message.content, ":", ":");
    let msg = message.content;
    if(!substringArray.length) return;

    substringArray.forEach(m => {
        let emoji = client.emojis.cache.find(x => x.name === m);
        var replace = `:${m}:`;
        var rexreplace = new RegExp(replace, 'g');

        if(emoji && !msg.split(" ").find(x => x === emoji.toString()) && !msg.includes(`<a${replace}${emoji.id}>`)) msg = msg.replace(rexreplace, emoji.toString());
    })
    

    if(msg === message.content) return;

    let webhook = await message.channel.fetchWebhooks();
    webhook = webhook.find(x => x.name === "Zeyron");

    if(!webhook) {
        webhook = await message.channel.createWebhook(`Zeyron`, {
            avatar: client.user.displayAvatarURL({dynamic: true})
        });
    }

    await webhook.edit({
        name: message.member.nickname ? message.member.nickname : message.author.username,
        avatar: message.author.displayAvatarURL({dynamic: true})
    })

    message.delete().catch(m => {})

    webhook.send(msg).catch( m => {});

    await webhook.edit({
        name: `Soma`,
        avatar: client.user.displayAvatarURL({dynamic:true})
    })

 
})

function get_substrings_between(str, startDelimiter, endDelimiter) {
    var contents = [];
    var startDelimiterLength = startDelimiter.length;
    var endDelimiterLength = endDelimiter.length;
    var startFrom = contentStart = contentEnd = 0;
  
    while (false !== (contentStart = strpos(str, startDelimiter, startFrom))) {
      contentStart += startDelimiterLength;
      contentEnd = strpos(str, endDelimiter, contentStart);
      if (false === contentEnd) {
        break;
      }
      contents.push(str.substr(contentStart, contentEnd - contentStart));
      startFrom = contentEnd + endDelimiterLength;
    }
  
    return contents;
  }
  
  
  function strpos(haystack, needle, offset) {
    var i = (haystack + '').indexOf(needle, (offset || 0));
    return i === -1 ? false : i;
  }
  
const AntiSpam = require('discord-anti-spam');
 
const antiSpam = new AntiSpam({
  warnThreshold: 3, // Amount of messages sent in a row that will cause a warning.
  kickThreshold: 7, // Amount of messages sent in a row that will cause a ban.
  banThreshold: 7, // Amount of messages sent in a row that will cause a ban.
  maxInterval: 2000, // Amount of time (in milliseconds) in which messages are considered spam.
  warnMessage: '⚠️ {@user}, Peço que pare de spammar.', // Message that will be sent in chat upon warning a user.
  kickMessage: '⚠️ **{user_tag}** Foi expulso por spammar', // Message that will be sent in chat upon kicking a user.
  banMessage: '⚠️ **{user_tag}** Foi banido por spammar.', // Message that will be sent in chat upon banning a user.
  maxDuplicatesWarning: 7, // Amount of duplicate messages that trigger a warning.
  maxDuplicatesKick: 10, // Amount of duplicate messages that trigger a warning.
  maxDuplicatesBan: 12, // Amount of duplicate messages that trigger a warning.
  exemptPermissions: [ 'ADMINISTRATOR'], // Bypass users with any of these permissions.
  ignoreBots: true, // Ignore bot messages.
  verbose: true, // Extended Logs from module.
  ignoredUsers: [], // Array of User IDs that get ignored.
  // And many more options... See the documentation.
});
 
client.on("message", async message => {
  let On = await db.fetch(`AntiSpamOn_${message.guild.id}`);
  if (On === "On") {
    antiSpam.message(message); 
  }
});

if (!db.get('starboards')) db.set('starboards', []);

const StarboardsManager = require('discord-starboards');
const StarboardsManagerCustomDb = class extends StarboardsManager {
    // This function is called when the manager needs to get all the starboards stored in the database.
    async getAllStarboards() {
        // Get all the starboards in the database
        return db.get('starboards');
    }

    // This function is called when a starboard needs to be saved in the database (when a starboard is created or when a starboard is edited).
    async saveStarboard(data) {
        // Add the new one
        db.push('starboards', data);
        // Don't forget to return something!
        return true;
    }

    // This function is called when a starboard needs to be deleted from the database.
    async deleteStarboard(channelID, emoji) {
        // Remove the starboard from the array
        const newStarboardsArray = db.get('starboards').filter((starboard) => !(starboard.channelID === channelID && starboard.options.emoji === emoji));
        // Save the updated array
        db.set('starboards', newStarboardsArray);
        // Don't forget to return something!
        return true;
    }

    // This function is called when a starboard needs to be edited in the database
    async editStarboard(channelID, emoji, data) {
        // Gets all the current starboards
        const starboards = db.get('starboards');
        // Remove the old starboard from the db
        const newStarboardsArray = starboards.filter((starboard) => !(starboard.channelID === channelID && starboard.options.emoji === emoji));
        // Push the new starboard to the array
        newStarboardsArray.push(data);
        // Save the updated array
        db.set('starboards', newStarboardsArray);
        // Don't forget to return something!
        return true;
    }
};

// Create a new instance of your new class
const kapa = new StarboardsManagerCustomDb(client, {
    storage: false, // Important - use false instead of a storage path
});
// We now have a starboardsManager property to access the manager everywhere!
client.starboardsManager = kapa;

client.login(process.env.TOKEN)