const { default: nganuConnect, useMultiFileAuthState, DisconnectReason, jidNormalizedUser, fetchLatestBaileysVersion, generateForwardMessageContent, prepareWAMessageMedia, generateWAMessageFromContent, generateMessageID, downloadContentFromMessage, makeInMemoryStore, jidDecode, proto, delay } = require("@adiwajshing/baileys")
const pino = require('pino')
const { Boom } = require('@hapi/boom')
const fs = require('fs')
const chalk = require('chalk')
const FileType = require('file-type')
const path = require('path')
const fetch = require('node-fetch')
const figlet = require("figlet");
const axios = require('axios')
const PhoneNumber = require('awesome-phonenumber')
const { imageToWebp, videoToWebp, writeExif, writeExifImg, writeExifVid } = require('./lib/exif')
const {
   toAudio,
   toPTT,
   toVideo
} = require('./lib/converter')
const { getRandom, smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetchJson, await, sleep } = require('./lib/myfunc')
const { toBuffer, toDataURL } = require('qrcode')
const express = require ('express')

let app = express()
const { createServer } = require ('http')
let server = createServer(app)
let _qr = 'invalid'
let PORT = 3000 || 8000 || 8080

//require("http").createServer((_, res) => res.end("Uptime!")).listen(8080)

//libb
const { TelegraPh } = require('./lib/uploader')
const { isSetWelcome, getTextSetWelcome } = require('./lib/setwelcome');
const { isSetLeft, getTextSetLeft } = require('./lib/setleft');

//setting 
let set_welcome_db = JSON.parse(fs.readFileSync('./database/set_welcome.json'));
let set_left_db = JSON.parse(fs.readFileSync('./database/set_left.json'));
let setting = JSON.parse(fs.readFileSync('./config.json'));
let _welcome = JSON.parse(fs.readFileSync('./database/welcome.json'))
let _left = JSON.parse(fs.readFileSync('./database/left.json'))
let antidelete = JSON.parse(fs.readFileSync('./database/antidelete.json'));
let antionce = JSON.parse(fs.readFileSync('./database/antionce.json'));
let session = `./${setting.sessionName}.json`

const startnganu = async() => {
  
global.db = JSON.parse(fs.readFileSync('./database/database.json'))
if (global.db) global.db.data = {
    sticker: {},
    database: {},
    game: {},
    others: {},
    users: {},
    chats: {},
    settings: {},
    anonymous:{},
    ...(global.db.data || {})
}

function title() {
    console.log(chalk.bold.green(figlet.textSync('nganu Bot', {
        font: 'Standard',
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: 80,
        whitespaceBreak: false
    })))
    console.log(chalk.yellow(`\n${chalk.yellow('Created By KyurzyBotz')}\n`))
}
const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })

const {
      state,
      saveCreds
   } = await useMultiFileAuthState(`./${setting.sessionName}`)
const {
		version,
		isLatest
	} = await fetchLatestBaileysVersion()

function nocache(module, cb = () => { }) {
    fs.watchFile(require.resolve(module), async () => {
        await uncache(require.resolve(module))
        cb(module)
    })
}

function uncache(module = '.') {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(module)]
            resolve()
        } catch (e) {
            reject(e)
        }
    })
}	
    const nganu = nganuConnect({
      version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: true,
        patchMessageBeforeSending: (message) => {
         const requiresPatch = !!(
            message.buttonsMessage ||
            message.templateMessage ||
            message.listMessage
         );
         if (requiresPatch) {
            message = {
               viewOnceMessage: {
                  message: {
                     messageContextInfo: {
                        deviceListMetadataVersion: 2,
                        deviceListMetadata: {},
                     },
                     ...message,
                  },
               },
            };
         }
         return message;
      },
        browser: ['nganu Multi Device','Safari','1.0.0'],
        auth: state
    })
    
  require("./command/case")
  nocache('./command/case', module => console.log(chalk.greenBright('[ UPDATED ]  ') + new Date() + chalk.cyanBright(` "${module}" Telah diupdate!`)))
  
  if (nganu.user && nganu.user.id) nganu.user.jid = jidNormalizedUser(nganu.user.id)
    
 	nganu.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr} = update	    
        if (qr){
          app.use(async (req, res) => {
        res.setHeader('content-type', 'image/png')
        res.end(await toBuffer(qr))
    })
app.use(express.static(path.join(__dirname, 'views')))
  server.listen(PORT, () => {
        console.log('App listened on port', PORT)
  })
        }
        if (connection === 'close') {
        let reason = new Boom(lastDisconnect?.error)?.output.statusCode
            if (reason === DisconnectReason.badSession) { console.log(`Bad Session File, Please Delete Session and Scan Again`); nganu.logout(); }
            else if (reason === DisconnectReason.connectionClosed) { console.log("Connection closed, reconnecting...."); startnganu(); }
            else if (reason === DisconnectReason.connectionLost) { console.log("Connection Lost from Server, reconnecting..."); startnganu(); }
            else if (reason === DisconnectReason.connectionReplaced) { console.log("Connection Replaced, Another New Session Opened, Please Close Current Session First"); nganu.logout(); }
            else if (reason === DisconnectReason.loggedOut) { console.log(`Device Logged Out, Please Scan Again And Run.`); nganu.logout(); }
            else if (reason === DisconnectReason.restartRequired) { console.log("Restart Required, Restarting..."); startnganu(); }
            else if (reason === DisconnectReason.timedOut) { console.log("nganuection TimedOut, Reconnecting..."); startnganu(); }
            else nganu.end(`Unknown DisconnectReason: ${reason}|${connection}`)
        }
        if (update.connection == "open" || update.receivedPendingNotifications == "true") {
				console.log('Connect, welcome owner!')
				console.log(`Connected to = ` + JSON.stringify(nganu.user, null, 2))
			}
    })
    store.bind(nganu.ev)
    
    nganu.ev.on('call', async (celled) => {
    let botNumber = await nganu.decodeJid(nganu.user.id)
    let koloi = setting.anticall
    if (!koloi) return
    console.log(celled)
    for (let kopel of celled) {
    if (kopel.isGroup == false) {
    if (kopel.status == "offer") {
    let nomer = await nganu.sendTextWithMentions(kopel.from, `*${nganu.user.name}* tidak bisa menerima panggilan ${kopel.isVideo ? `video` : `suara`}. Maaf @${kopel.from.split('@')[0]} kamu akan diblokir. Silahkan hubungi Owner membuka blok !`)
    nganu.sendContact(kopel.from, setting.ownerNumber.map( i => i.split("@")[0]), nomer)
    await sleep(8000)
    await nganu.updateBlockStatus(kopel.from, "block")
    }
    }
    }
    })
    
    nganu.ev.on('messages.upsert', async chatUpdate => {
        try {
        //mek = chatUpdate.messages[0]
        for (let mek of chatUpdate.messages) {
        if (!mek.message) return
        mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
        if (mek.key && mek.key.remoteJid === 'status@broadcast') return
        if (!nganu.public && !mek.key.fromMe && chatUpdate.type === 'notify') return
        if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return
        const m = smsg(nganu, mek, store)
        require("./command/case")(nganu, m, chatUpdate, mek, store, setting, isSetWelcome, getTextSetWelcome, set_welcome_db, set_left_db, isSetLeft, getTextSetLeft, _welcome, _left, antidelete, antionce)
        }
        } catch (err) {
            console.log(err)
        }
    })
    
    
    nganu.ev.on('group-participants.update', async (anu) => {
        const { welcome } = require ('./lib/welcome')
        const iswel = _welcome.includes(anu.id)
        const isLeft = _left.includes(anu.id)
        welcome(iswel, isLeft, nganu, anu)
    })
    nganu.ev.on("message.delete", async (anu) => {
  const { aDelete } = require ("./lib/welcome");
		aDelete(setting, nganu, anu)
	})
	nganu.ev.on("viewOnceMessage", async (anu) => {
	  const { oneTime } = require ("./lib/welcome");
		oneTime(setting, nganu, anu)
	})
	
	nganu.ev.process(
		async (events) => {
			if (events['presence.update']) {
				await nganu.sendPresenceUpdate('available')
			}
			if (events['messages.upsert']) {
				const upsert = events['messages.upsert']
  			for (let msg of upsert.messages) {
					if (msg.key.remoteJid === 'status@broadcast') {
					if (msg.message?.protocolMessage) return
						await delay(3000)
						await nganu.readMessages([msg.key])
					}
				}
			}
		if (events['creds.update']) {
				await saveCreds()
			}
		}
	)
	
    // Setting
    nganu.decodeJid = (jid) => {
        if (!jid) return jid
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {}
            return decode.user && decode.server && decode.user + '@' + decode.server || jid
        } else return jid
    }
    
    nganu.ev.on('contacts.update', update => {
        for (let contact of update) {
            let id = nganu.decodeJid(contact.id)
            if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }
        }
    })

    nganu.getName = (jid, withoutContact  = false) => {
        id = nganu.decodeJid(jid)
        withoutContact = nganu.withoutContact || withoutContact 
        let v
        if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
            v = store.contacts[id] || {}
            if (!(v.name || v.subject)) v = nganu.groupMetadata(id) || {}
            resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
        })
        else v = id === '0@s.whatsapp.net' ? {
            id,
            name: 'WhatsApp'
        } : id === nganu.decodeJid(nganu.user.id) ?
            nganu.user :
            (store.contacts[id] || {})
            return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
    }
    
    nganu.sendContact = async (jid, kon, quoted = '', opts = {}) => {
	let list = []
	for (let i of kon) {
	    list.push({
	    	displayName: await nganu.getName(i + '@s.whatsapp.net'),
	    	vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await nganu.getName(i + '@s.whatsapp.net')}\nFN:${await nganu.getName(i + '@s.whatsapp.net')}\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Ponsel\nitem2.EMAIL;type=INTERNET:email@gmail.com\nitem2.X-ABLabel:Email\nitem3.URL:https://youtube.com/\nitem3.X-ABLabel:Instagram\nitem4.ADR:;;Indonesia;;;;\nitem4.X-ABLabel:Region\nEND:VCARD`
	    })
	}
	nganu.sendMessage(jid, { contacts: { displayName: `${list.length} Kontak`, contacts: list }, ...opts }, { quoted })
    }
    
    nganu.setStatus = (status) => {
        nganu.query({
            tag: 'iq',
            attrs: {
                to: '@s.whatsapp.net',
                type: 'set',
                xmlns: 'status',
            },
            content: [{
                tag: 'status',
                attrs: {},
                content: Buffer.from(status, 'utf-8')
            }]
        })
        return status
    }
    
	  nganu.prefa = 'apasih'
    nganu.public = true
    nganu.serializeM = (m) => smsg(nganu, m, store)


    
      nganu.reSize = async (image, width, height) => {
       let jimp = require('jimp')
       var oyy = await jimp.read(image);
       var kiyomasa = await oyy.resize(width, height).getBufferAsync(jimp.MIME_JPEG)
       return kiyomasa
      }

nganu.sendButLoc = async (jid , text = '' , footer = '', lok, but = [], ments = [],  options = {}) =>{
      let bb = await nganu.reSize(lok, 300, 150)
      const buttonMessage = {
    location: { jpegThumbnail: bb },
    caption: text,
    footer: footer,
    buttons: but,
    headerType: 'LOCATION'
}
 nganu.sendMessage(jid, buttonMessage, options)
      }
      
nganu.send5ButLoc = async (jid , text = '' , footer = '', lok, but = [], options = {}) =>{
      let bb = await nganu.reSize(lok, 300, 150)
      nganu.sendMessage(jid, { location: { jpegThumbnail: bb }, caption: text, footer: footer, templateButtons: but, ...options })
      }
nganu.send5ButImg = async (jid , text = '' , footer = '', img, but = [], ments, options = {}) =>{
    nganu.sendMessage(jid, { image: img, caption: text, footer: footer, viewOnce: true, templateButtons: but,mentions: ments ? ments : [], ...options })
    }
nganu.sendButImage = async (jid, ppuser, but = [] , text = '' , footer = '', ments = [], quoted) => {
let pp_user = await getBuffer(ppuser)
const buttonMessage = {
    image: pp_user,
    caption: text,
    footer: footer,
    buttons: but,
    headerType: 'IMAGE',
	mentions: ments
}

nganu.sendMessage(jid, buttonMessage, quoted)
}
nganu.sendButMessage = async (jid , desc = '' , footer = '' ,  but = [] , options = {}) =>{
const buttonMessage = {
    text: desc,
    footer: footer,
    buttons: but,
    headerType: 1
}

nganu.sendMessage(jid, buttonMessage, options)
}

nganu.sendFile = async (jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) => {
      let type = await nganu.getFile(path, true)
      let {
         res,
         data: file,
         filename: pathFile
      } = type
      if (res && res.status !== 200 || file.length <= 65536) {
         try {
            throw {
               json: JSON.parse(file.toString())
            }
         }
         catch (e) {
            if (e.json) throw e.json
         }
      }
      let opt = {
         filename
      }
      if (quoted) opt.quoted = quoted
      if (!type) options.asDocument = true
      let mtype = '',
         mimetype = type.mime,
         convert
      if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) mtype = 'sticker'
      else if (/image/.test(type.mime) || (/webp/.test(type.mime) && options.asImage)) mtype = 'image'
      else if (/video/.test(type.mime)) mtype = 'video'
      else if (/audio/.test(type.mime))(
         convert = await toAudio(file, type.ext),
         file = convert.data,
         pathFile = convert.filename,
         mtype = 'audio',
         mimetype = 'audio/ogg; codecs=opus'
      )
      else mtype = 'document'
      if (options.asDocument) mtype = 'document'

      delete options.asSticker
      delete options.asLocation
      delete options.asVideo
      delete options.asDocument
      delete options.asImage

      let message = {
         ...options,
         caption,
         ptt,
         [mtype]: {
            url: pathFile
         },
         mimetype,
         fileName: filename || pathFile.split('/').pop()
      }
      let m
      try {
         m = await nganu.sendMessage(jid, message, {
            ...opt,
            ...options
         })
      }
      catch (e) {
         //console.error(e)
         m = null
      }
      finally {
         if (!m) m = await nganu.sendMessage(jid, {
            ...message,
            [mtype]: file
         }, {
            ...opt,
            ...options
         })
         file = null
         return m
      }
   }

     nganu.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
      let mime = '';
      let res = await axios.head(url)
      mime = res.headers['content-type']
      if (mime.split("/")[1] === "gif") {
     return nganu.sendMessage(jid, { video: await getBuffer(url), caption: caption, gifPlayback: true, ...options}, { quoted: quoted, ...options})
      }
      let type = mime.split("/")[0]+"Message"
      if(mime === "application/pdf"){
     return nganu.sendMessage(jid, { document: await getBuffer(url), mimetype: 'application/pdf', caption: caption, ...options}, { quoted: quoted, ...options })
      }
      if(mime.split("/")[0] === "image"){
     return nganu.sendMessage(jid, { image: await getBuffer(url), caption: caption, ...options}, { quoted: quoted, ...options})
      }
      if(mime.split("/")[0] === "video"){
     return nganu.sendMessage(jid, { video: await getBuffer(url), caption: caption, mimetype: 'video/mp4', ...options}, { quoted: quoted, ...options })
      }
      if(mime.split("/")[0] === "audio"){
     return nganu.sendMessage(jid, { audio: await getBuffer(url), caption: caption, mimetype: 'audio/mpeg', ...options}, { quoted: quoted, ...options })
      }
      }

    nganu.sendTextWithMentions = async (jid, text, quoted, options = {}) => nganu.sendMessage(jid, { text: text, mentions: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'), ...options }, { quoted })

    nganu.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        let buffer
        if (options && (options.packname || options.author)) {
            buffer = await writeExifImg(buff, options)
        } else {
            buffer = await imageToWebp(buff)
        }

        await nganu.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
        return buffer
    }
    nganu.sendMediaAsSticker = async (jid, path, quoted, options = {}) => {
	let { ext, mime, data } = await nganu.getFile(path)
	let media = {}
let buffer
media.data = data
	media.mimetype = mime
if (options && (options.packname || options.author)) {
buffer = await writeExif(media, options)
} else {
buffer = /image/.test(mime) ? await imageToWebp(data) : /video/.test(mime) ? await videoToWebp(data) : ""
}
	await nganu.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
return buffer
}

    nganu.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        let buffer
        if (options && (options.packname || options.author)) {
            buffer = await writeExifVid(buff, options)
        } else {
            buffer = await videoToWebp(buff)
        }

        await nganu.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
        return buffer
    }
	nganu.sendImage = async (jid, path, caption = '', quoted = '', options) => {
        let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await fetch(path)).buffer() : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        return await nganu.sendMessage(jid, { image: buffer, caption: caption, ...options }, { quoted })
    }
    nganu.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
        let quoted = message.msg ? message.msg : message
        let mime = (message.msg || message).mimetype || ''
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
        const stream = await downloadContentFromMessage(quoted, messageType)
        let buffer = Buffer.from([])
        for await(const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
	let type = await FileType.fromBuffer(buffer)
        trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
        // save to file
        await fs.writeFileSync(trueFileName, buffer)
        return trueFileName
    }

    nganu.downloadMediaMessage = async (message) => {
        let mime = (message.msg || message).mimetype || ''
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
        const stream = await downloadContentFromMessage(message, messageType)
        let buffer = Buffer.from([])
        for await(const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
	}
        
	return buffer
     } 
     
    nganu.sendAudio = async (jid, path, quoted = '', ptt = false, options) => {
        let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await fetch(path)).buffer() : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        return await nganu.sendMessage(jid, { audio: buffer, ptt: ptt, ...options }, { quoted })
    }
    
    nganu.sendVideo = async (jid, path, gif = false, caption = '', quoted = '', options) => {
        let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await fetch(path)).buffer() : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        return await nganu.sendMessage(jid, { video: buffer, caption: caption, gifPlayback: gif, ...options }, { quoted })
    }

    nganu.sendMedia = async (jid, path, fileName = '', caption = '', quoted = '', options = {}) => {
        let types = await nganu.getFile(path, true)
           let { mime, ext, res, data, filename } = types
           if (res && res.status !== 200 || file.length <= 65536) {
               try { throw { json: JSON.parse(file.toString()) } }
               catch (e) { if (e.json) throw e.json }
           }
       let type = '', mimetype = mime, pathFile = filename
       if (options.asDocument) type = 'document'
       if (options.asSticker || /webp/.test(mime)) {
        let media = { mimetype: mime, data }
        pathFile = await writeExif(media, { packname: options.packname ? options.packname : global.packname, author: options.author ? options.author : global.author, categories: options.categories ? options.categories : [] })
        await fs.promises.unlink(filename)
        type = 'sticker'
        mimetype = 'image/webp'
        }
       else if (/image/.test(mime)) type = 'image'
       else if (/video/.test(mime)) type = 'video'
       else if (/audio/.test(mime)) type = 'audio'
       else type = 'document'
       await nganu.sendMessage(jid, { [type]: { url: pathFile }, caption, mimetype, fileName, ...options }, { quoted, ...options })
       return fs.promises.unlink(pathFile)
       }

       nganu.copyNForward = async (jid, message, forceForward = false, options = {}) => {
  let vtype
	if (options.readViewOnce) {
		message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined)
		vtype = Object.keys(message.message.viewOnceMessage.message)[0]
		delete(message.message && message.message.ignore ? message.message.ignore : (message.message || undefined))
		delete message.message.viewOnceMessage.message[vtype].viewOnce
		message.message = {
			...message.message.viewOnceMessage.message
	}}

	let mtype = Object.keys(message.message)[0]
	let content = await generateForwardMessageContent(message, forceForward)
	let ctype = Object.keys(content)[0]
	let context = {}
	if (mtype != "conversation") context = message.message[mtype].contextInfo
	content[ctype].contextInfo = {
				...context,
				...content[ctype].contextInfo
	}
	const waMessage = await generateWAMessageFromContent(jid, content, options ? {
		...content[ctype],
		...options,
		...(options.contextInfo ? {
		contextInfo: {
				...content[ctype].contextInfo,
				...options.contextInfo
				}
		} : {})
	} : {})
	await nganu.relayMessage(jid, waMessage.message, { messageId: waMessage.key.id })
	return waMessage
}

   
    
    nganu.sendButtonText = (jid, buttons = [], text, footer, quoted = '', options = {}) => {
        let buttonMessage = {
            text,
            footer,
            buttons,
            headerType: 2,
            ...options
        }
        nganu.sendMessage(jid, buttonMessage, { quoted, ...options })
    }
	nganu.sendText = (jid, text, quoted = '', options) => nganu.sendMessage(jid, { text: text, ...options }, { quoted, ...options })

    nganu.cMod = (jid, copy, text = '', sender = nganu.user.id, options = {}) => {
        //let copy = message.toJSON()
		let mtype = Object.keys(copy.message)[0]
		let isEphemeral = mtype === 'ephemeralMessage'
        if (isEphemeral) {
            mtype = Object.keys(copy.message.ephemeralMessage.message)[0]
        }
        let msg = isEphemeral ? copy.message.ephemeralMessage.message : copy.message
		let content = msg[mtype]
        if (typeof content === 'string') msg[mtype] = text || content
		else if (content.caption) content.caption = text || content.caption
		else if (content.text) content.text = text || content.text
		if (typeof content !== 'string') msg[mtype] = {
			...content,
			...options
        }
        if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
		else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
		if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid
		else if (copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid
		copy.key.remoteJid = jid
		copy.key.fromMe = sender === nganu.user.id

        return proto.WebMessageInfo.fromObject(copy)
    }


    /**
     * 
     * @param {*} path 
     * @returns 
     */
    nganu.getFile = async (PATH, returnAsFilename) => {
      let res, filename
      const data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,` [1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await fetch(PATH)).buffer() : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
      if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
      const type = await FileType.fromBuffer(data) || {
         mime: 'application/octet-stream',
         ext: '.bin'
      }
      if (data && returnAsFilename && !filename)(filename = path.join(__dirname, './media/' + new Date * 1 + '.' + type.ext), await fs.promises.writeFile(filename, data))
      return {
         res,
         filename,
         ...type,
         data,
         deleteFile() {
            return filename && fs.promises.unlink(filename)
         }
      }
   }

    return nganu
}

startnganu()


let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update ${__filename}`))
	delete require.cache[file]
	require(file)
})
