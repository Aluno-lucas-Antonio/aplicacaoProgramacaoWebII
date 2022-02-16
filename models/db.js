const Sequelize = require("sequelize")

//conexão com o banco de dados
const sequelize = new Sequelize('cadastro','postgres','15080429',{
    host: "localhost",  // local do banco
    dialect: "postgres"    // tipo do banco de dados
}) 

sequelize.authenticate().then(()=>{// verificando se a conexão foi feita.
    console.log("***********conectado com sucesso ao banco***************")
}).catch((erro)=>{ //caso ocorrer algum erro
    console.log("*********falha ao se conectar ao banco****************: "+erro)
})  

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}



