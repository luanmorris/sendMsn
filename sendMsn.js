#!/usr/bin/node

//Adicione os números de telefone no arquivo list

const fs = require('fs')
const qrcode = require('qrcode-terminal')
const { Client, LocalAuth } = require('whatsapp-web.js')

const client = new Client({
    authStrategy: new LocalAuth()
})

const contentFileGroup = 'listGroup'
const contentFileNumber = 'listNumber'
const msnBody = 'msnBody.json'

client.on('qr', qr => {
    qrcode.generate(qr, {small: true})
})

client.on('ready', () => {
    console.log('Client is ready!')

    const min = 2000;
    const max = 5000;

    const randomTime = Math.floor(Math.random() * (max - min + 1)) + min;

    // Obtenha e liste todos os grupos com seus IDs
    function findGroups() {
        client.getChats().then(chats => {
            const groups = chats.filter(chat => chat.isGroup);
            console.log('Groups:');
            groups.forEach(group => {
                console.log(`ID: ${group.id._serialized}, Name: ${group.name}`);
            });
        });
    }

    function sendMessages(listNumber, listGroup, data){
        const list = listNumber + listGroup
        const lines = list.split("\n")

        for (let i in lines) {
            if(lines[i].trim() === '') continue
            setTimeout(async () => {
                console.log(lines[i])

                const chatId = (lines[i].trim().length < 14) ? lines[i].trim() + "@c.us" : lines[i].trim() + "@g.us"

                const message = `*${data.title}*\n\n ${data.body}.\n\n${data.address}\n\n${data.link}`

                await client.sendMessage(chatId, message)
                await delay(2000)

            }, i * randomTime)
        }
    }

    try {
        const listGroup = fs.readFileSync(contentFileGroup, 'utf8') //importa a lista de grupos do arquivo listGroup
        const listNumber = fs.readFileSync(contentFileNumber, 'utf8') //importa a lista de números do arquivo listNumber
        const contentMsnBody = fs.readFileSync(msnBody, 'utf8') //importa a mensagem de um arquivo json
        const data = JSON.parse(contentMsnBody)

        sendMessages(listNumber, listGroup, data)
        //findGroups()

    } catch (e) {
        console.error('Erro ao importar o arquivo', e)
        return null
    }

})

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

client.initialize()

client.on('message', message => {

    console.log('')
    console.log(message.from)
    console.log(message.body)
    console.log(message.id.participant)

})