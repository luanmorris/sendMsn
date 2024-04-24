#!/usr/bin/node

//Adicione os números de telefone no arquivo list

const fs = require('fs');
const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');

const client = new Client();

const listNumber = 'list'

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');

    function enviarScript(scriptText){
        const lines = scriptText.split("\n");

        let i = 0;

        setInterval(() => {
            if(i >= lines.length) return

            if(lines[i].trim() != ''){
                console.log(lines[i]);

                const number = lines[i];

                const title = '*NOME DO CURSO*'; //Coloque entre ** para negrito
                const institution = 'da Instituição'; //Coloque junto com a preposição
                const address = 'Endereço: Tv. Vitorino Freire, s/n , Areal, Coroatá - MA';
                const whatsappGroup = "https://chat.whatsapp.com/0000000000000000000000";

                const message = `${title}\nBom dia. Aqui é do corpo técnico ${institution}. Estamos enviando o link para o grupo de whatsapp dos alunos que servirá para o envio de materiais, avisos, dúvidas e etc.\n\nSeja bem vindo e bons estudos.\n\n${address}\n\n${whatsappGroup}`;

                const notice = "Caso já faça parte do grupo desconsidere essa mensagem";

                const chatId = number + "@c.us";

                client.sendMessage(chatId, message);
                client.sendMessage(chatId, notice);

            }
            i++;
        }, 250)
    }

    try {
        const contentFile = fs.readFileSync(listNumber, 'utf8') //importa a lista de números do arquivo list
        enviarScript(contentFile)
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