var express = require('express')

var path = require('path')

var session = require('express-session')
var router = require('./router')
var bodyParser = require('body-parser')

var app = express()


app.use('/public/', express.static(path.join(__dirname, './public/')))
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')))

app.engine('html', require('express-art-template'))
app.set('views', path.join(__dirname, './views/')) //默认是views

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// 在Express这个框架中，默认不支持Session和Cookie但是我们可以使用第三方中间件：express-session来解决
// 1.npm install express-session
// 2．配置（一定要在app.use（router）之前）
// 3.使用
// 当把这个插件配置好之后，我们就可以通过req.session来发访问和设置Session成员添加Session数据：req.session.foo ='bar访问Session数据：req.session.fod 
app.use(session({

    secret: 'keyboard cat', // 配置加密字符串，它会在原有加密基础之上和这个字符串拼起来去加密目的是为了增加安全性，防止客户端恶意伪造
    resave: false,
    saveUninitialized: true //无论你是否使用Session，我都默认直接给你分配一把钥是
}))

app.use(router)


app.listen(3000, function() {
    console.log('running......')
})