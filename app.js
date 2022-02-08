const express = require("express")
const app = express()
const moment = require('moment')
const porta = 3000
const Aluno = require('./models/Aluno')//model aluno, isere um aluno
const session = require('express-session')
const flash = require('connect-flash')


//template engine
app.set('view engine', 'ejs')
app.locals.moment = require('moment');

//bodyParser
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

//sessão
app.use(session({
    secret: "cursodenode",//chave de acesso
    resave: true,
    saveUninitialized: true
}))
app.use(flash())

//Middleware
app.use((req, res, next)=>{
    //declaração de variáveis globais
    res.locals.success_msg = req.flash('success_msg')// aqui são variáveis globais, criadas com res.locals e são visíveis dm qualquer parte do projeto
    res.locals.error_msg = req.flash('error_msg')
    //res.locals.user = req.user || null // req.user criado pelo passport que armazena dados do usuário logado
    next()
})

app.get('/', (req, res)=>{
    Aluno.findAll().then((alunos)=>{//recebe todos os alunos        
        res.render('home',{alunos: alunos})
    })
})
app.get('/cadastro', (req, res)=>{
    res.render("cadastro")
})
//rota para criar novo aluno
app.post("/criar_cadastro",(req, res)=>{// não consigo acessar pela url
    let erros = []
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null || req.body.nome.length < 2){
        erros.push({texto: "nome invalido"})
    }
    if(!req.body.sobreNome || typeof req.body.sobreNome == undefined || req.body.sobreNome == null || req.body.sobreNome.length < 2){
        erros.push({texto: "sobrenome invalido"})
        
    }
    if(erros.length > 0){
        req.flash("error_msg", "Nome ou e-mail inválidos! Tente novamente.")
        res.redirect('/cadastro')
        console.log(erros)
    }else{// verificar, por e-mail, se o usuário já está cadastrado
        Aluno.findOne({email: req.body.email}).then((aluno)=>{
            if(aluno){
                req.flash('error_msg', 'E-mail já cadastrado! Tente novamente.')
                res.redirect("/cadastro")
            }else{// se passou por todos os erros, pode cadastrar
                Aluno.create({
                    nome: req.body.nome,
                    sobreNome: req.body.sobreNome,
                    email: req.body.email
                }).then(()=>{
                    req.flash("success_msg", "Cadastro realizado")
                    res.redirect('/')
                }).catch((erro)=>{
                    req.flash("error_msg", "Erro ao cadastrar")
                    res.redirect("/404")
                })
            }
        })

    }
    

})

app.get('/deletar/:id', (req, res)=>{
    const { id } = req.params
    //Aluno.findOne({where: { id }})
    Aluno.destroy({where: { id }})
    res.redirect('/')    
})

/**
 * app.get('/deletar/:id', (req, res)=>{
    Aluno.destroy({where: {'id': req.params.id}}).then(()=>{
        res.redirect("/")
    }).catch(()=>{
        res.send("Erro ao excluir aluno")
    })
})
 */

// editando um cadastro de aluno
app.get('/editar/:id',(req, res)=>{
    id=req.params.id
    res.render('editar')
})
app.post('/editar',(req, res)=>{
    Aluno.update({
        nome: req.body.nome,
        sobreNome: req.body.sobreNome,
        email: req.body.email
    }, {
        where: {id: id},
    }).then(()=>{
        req.flash("success_msg", "Cadastro editado com sucesso!")
        res.redirect('/')
    }).catch((erro)=>{
        req.flash("error_msg", "Erro ao editar")
        res.redirect("/404")
    })
})
app.get('/404', (req, res)=>{
    res.render('404')
})


app.listen(porta, ()=>{
    console.log(`localhost:${porta}`)
})