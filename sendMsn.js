#!/usr/bin/node

//Adicione os números de telefone no arquivo list

const fs = require('fs');
const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');

const client = new Client();

const contentFile = 'list'
const msnBody = 'msnBody.json'

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');

    function sendMessages(listNumber, data){
        const lines = listNumber.split("\n")

        let i = 0;

        setInterval(() => {
            if(i >= lines.length) return

            if(lines[i].trim() != ''){
                console.log(lines[i]);

                const number = lines[i];

                const message = `${data.title}\nBom dia. Aqui é do corpo técnico ${data.institution}. Estamos enviando o link para o grupo de whatsapp dos alunos que servirá para o envio de materiais, avisos, dúvidas e etc.\n\nSeja bem vindo e bons estudos.\n\n${data.address}\n\n${data.whatsappGroup}`


                const notice = "Caso já faça parte do grupo desconsidere essa mensagem";

                const chatId = number + "@c.us";

                client.sendMessage(chatId, message);
                client.sendMessage(chatId, notice);

            }
            i++;
        }, 250)
    }

    try {
        const listNumber = fs.readFileSync(contentFile, 'utf8') //importa a lista de números do arquivo list
        const contentMsnBody = fs.readFileSync(msnBody, 'utf8')
        const data = JSON.parse(contentMsnBody)

        sendMessages(listNumber, data)

    } catch (e) {
        console.error('Erro ao importar o arquivo', e)
        return null
    }
});

client.initialize();

client.on('message', message => {

    console.log('');
    console.log(message.from);
    console.log(message.body);
    console.log(message.id.participant);

});