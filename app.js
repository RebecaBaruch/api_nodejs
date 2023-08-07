const express = require('express');
const app = express();

const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//string de conexão -> mongodb+srv://rebecabaruchg:<password>@clusterapi.xb8vzby.mongodb.net/?retryWrites=true&w=majority

const url = 'mongodb+srv://rebecabaruchg:dOnDrIWgv6YwwQTo@clusterapi.xb8vzby.mongodb.net/?retryWrites=true&w=majority';
const options = { 
    useNewUrlParser: true,
};

mongoose.connect(url, options);

mongoose.connection.on('error', (err) => {
    console.log('Erro na conexão com o banco de dados: ' + err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Aplicação desconectada do banco de dados');
});

mongoose.connection.on('connected', () => {
    console.log('Aplicação conectada ao banco de dados');
});

//BODY PARSE
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const indexRoute = require('./routes/index');
const usersRoute = require('./routes/users');

app.use('/', indexRoute);
app.use('/users', usersRoute);

app.get('/', (req, res) => {
    let obj = req.query;

    return res.send({message: `Tudo ok com o método GET! Você enviou o nome ${obj.nome} com idade de ${obj.idade}`});
})

app.post('/', (req,res) => {
    let obj = res.body;

    return res.send({message: `Tudo ok com o método POST!`});
})

app.listen(3000);

module.exports = app;