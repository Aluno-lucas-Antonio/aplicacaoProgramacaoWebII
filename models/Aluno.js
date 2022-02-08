const db = require('./db')

const Aluno = db.sequelize.define('tabela_aluno',{
    nome: {
        type: db.Sequelize.STRING
    },
    sobreNome: {
        type: db.Sequelize.STRING
    },
    email: {
        type: db.Sequelize.STRING
    }
})

//Aluno.sync({force: true})//depois de criar, comentar ou apagar
module.exports = Aluno