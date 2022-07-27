const { Client } = require('discord.js-selfbot-v13');
const fs = require('fs');
require('dotenv').config();
const client = new Client();
const prefix = "./cards"
const axios = require('axios');
const cardChannel = {
    rg: { chanID: "993974111707594914", oldestMsgID: "994007229776793681" },// channel id and oldest message id 
    aihs2: { chanID: "607148922057785344", oldestMsgID: "616927278529773571" },
    koi: { chanID: "456109250893185026", oldestMsgID: "457519525986828298" }
}
const modeChoice = { rg: 'rg', aihs2: 'aihs2', koi: "koi" }
let mode = modeChoice.rg

client.on('ready', async () => {
    console.log(`${client.user.username} is ready!`);
    mode = process.argv[3] == undefined ? mode : process.argv[3]
    console.log(mode)
    switch (mode) {
        case modeChoice.rg:
            fetchFromChan(client.channels.cache.get(cardChannel.rg.chanID), undefined, cardChannel.rg.oldestMsgID)
            break
        case modeChoice.aihs2:
            fetchFromChan(client.channels.cache.get(cardChannel.aihs2.chanID), undefined, cardChannel.aihs2.oldestMsgID)
            break
        case modeChoice.koi:
            fetchFromChan(client.channels.cache.get(cardChannel.koi.chanID), undefined, cardChannel.koi.oldestMsgID)
            break
    }
})
function fetchFromChan(channel, before, oldestMsgID) {
    if (before == undefined) {
        let lastmsgid = ""
        channel.messages.fetch({ limit: 100, }).then(messages => { //fetch each message in channel
            messages.forEach(message => {
                lastmsgid = message.id
                message.reactions.cache.forEach(react => { //check whether you react to it or not
                    if (react.me) {
                        console.log("discordtag:" + message.author.username + "#" + message.author.discriminator);
                        console.log("link to msg:" + message.url)
                        downloadCard(message)
                    }
                })
            })
            fetchFromChan(channel, lastmsgid, oldestMsgID)
        })

    }
    else {
        console.log("before :" + before)
        if (before == oldestMsgID || before == "") { //reach the oledest message stop fetching
            console.log("reach limit") 
            return
        }
        let lastmsgid = ""
        channel.messages.fetch({ limit: 100, before: before }).then(messages => {
            messages.forEach(message => {
                lastmsgid = message.id
                message.reactions.cache.forEach(react => {
                    if (react.me) {
                        console.log("discordtag:" + message.author.username + "#" + message.author.discriminator);
                        console.log("link to msg:" + message.url)
                        downloadCard(message)
                    }
                })
            })
            fetchFromChan(channel, lastmsgid, oldestMsgID)
        })
    }
}
function downloadCard(message) {
    if (message.attachments.first() != undefined) {
        let isDownloaded = false
        message.attachments.forEach(a => {
            if (a.height == 352 && a.width == 252) {
                isDownloaded = true
                if (fs.existsSync(prefix + '/' + message.author.username + "#" + message.author.discriminator)) {
                    axios({
                        url: a.url,
                        method: 'GET',
                        responseType: 'stream'
                    }).then((res) => {
                        const writer = fs.createWriteStream(prefix + '/' + message.author.username + "#" +
                            message.author.discriminator + "/" + a.name);
                        res.data.pipe(writer);
                    })
                }
                else {
                    fs.mkdirSync(prefix + '/' + message.author.username + "#" + message.author.discriminator)
                    axios({
                        url: a.url,
                        method: 'GET',
                        responseType: 'stream'
                    }).then((res) => {
                        const writer = fs.createWriteStream(prefix + '/' + message.author.username + "#" +
                            message.author.discriminator + "/" + a.name);
                        res.data.pipe(writer);
                    })
                }
                const url = {
                    name: a.name,
                    sender: message.author.username + "#" + message.author.discriminator,
                    messageUrl: message.url,
                    message: message.content
                }
                const surl = JSON.stringify(url)
                fs.writeFileSync("./downloadlog.json", surl + ",\n", { flag: 'a+' })//keep log for card that has been downloaded
            }
        });
        if (!isDownloaded) {
            const url = {
                sender: message.author.username + "#" + message.author.discriminator,
                messageUrl: message.url,
                message: message.content
            }
            const surl = JSON.stringify(url)
            fs.writeFileSync("./list.json", surl + ",\n", { flag: 'a+' }) //keep log for what message you cant download
        }
    }

}

try {
    client.login(process.argv[2])// you should provide discord login token inorder to login
    fs.mkdirSync(prefix)
}
catch (err) {
    console.log(err)
}
//Instruction
//run npm or yarn or pnpm install first
//then run "$node app.js <discord login token> <mode>" in cmd ,the mode you may select is rg(room girl),aihs2(ai shoujo and hiney selct2),koi(koikatu) 
//if you provide no discord login token or invalid one ,the program return error
//if you provide no mode ,it run using rg as mode 
//guide to get discord login token https://www.npmjs.com/package/discord.js-selfbot-v13 
//WARNING!!! keep the token safe do not let anyone see it


//The download does not work when the message you react contain no card or card it contain is not the standard size(252 x 352).
//In that case, the logs of the message which contain its link and author are recorded is side file name "list.json"
//In case of success, the logs are kept in file name "downloadlog.json"

//contact me 01110111#2033 for more information



