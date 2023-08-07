const express = require('express');
const router = express.Router();
const Users = require('../model/user');
const bcrypt = require('bcrypt');

router.get('/', (req, res) => {
    Users.find({})
        .exec()
        .then((data) => {
            return res.send(data);
        })
        .catch((err) => {
            return res.send({ error: 'Erro na consulta de usuários!' });
        });
});

router.post('/create', (req, res) => {
    const { email, password } = req.body

    if(!email || !password) return res.send({ error: 'Dados insuficientes!' });

    Users.findOne({ email })
        .exec()
        .then((data) => {
            if (data) {
                return res.send({ error: 'Usuário já registrado!' });
            }

            Users.create(req.body)
                .then((data) => {
                    data.password = undefined;
                    return res.send(data);
                })
                .catch((err) => {
                    return res.send({ error: 'Erro ao criar usuário!' });
                });
        })
        .catch((err) => {
            return res.send({ error: 'Erro ao buscar usuário!' });
        });
});

router.post('/auth', (req,res) => {
    const { email, password } = req.body;

    if(!email || !password) return res.send({ error: 'Dados insuficientes' });

    Users.findOne({email})
        .select('+password')
        .exec()
        .then((data) => {
            if (!data) return res.send({ error: 'Usuário não registrado!' });

            bcrypt.compare(password, data.password, (err, same) => {
                if(!same) return res.send({ error: 'Erro ao autenticar usuário!' });

                return res.send(data);
            });
        })
        .catch((err) => {
            return res.send({ error: 'Erro ao buscar usuário!' });
        });
});

module.exports = router