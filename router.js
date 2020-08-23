var express = require('express')

var User = require('./models/user')
var md5 = require('blueimp-md5')




var router = express.Router()

router.get('/', function(req, res) {
    // console.log(req.session.user)
    res.render('index.html', {
        user: req.session.user
    })
})

router.get('/login', function(req, res) {
    res.render('login.html')
})

// router.post('/login', function(req, res) {
//     console.log(123)
// })

router.post('/login', function(req, res) {
    // 1.获取表单数据
    // 2·查询数据库用户名密码是否正确
    // 3.发送响应数据
    var body = req.body
        // console.log(md5(md5(body.password)))
    User.findOne({
        email: body.email,
        password: md5(md5(body.password))
    }, function(err, user) {
        console.log(md5(md5(body.password)))
        if (err) {
            return res.status(500).json({
                err_code: 500,
                message: err.message
            })
        }
        if (!user) {
            return res.status(200).json({
                err_code: 1,
                message: 'email or password is invalid'

            })
        }
        // 用户存在，登陆成功，通过Session记录登陆状态
        req.session.user = user

        res.status(200).json({
            err_code: 0,
            message: 'Ok'
        })
    })
})

router.get('/register', function(req, res) {
    res.render('register.html')
})

router.post('/register', function(req, res) {
    // 1.获取表单提交的数据
    // req.bdoy
    // 2·操作数据库
    // 判断改用户是否存在如果已存在，不允许注册
    // 如果不存在，注册新建用户
    // 3.发送响应
    var body = req.body
        // body.password = md5(md5(body.password))
        // new User(body).save(function(err) {
        //         if (err) {
        //             console.log(err);
        //         } else {
        //             console.log('meow');
        //         }
        //     })
    User.findOne({
        $or: [{
                email: body.email
            },
            {
                nickname: body.nickname
            }
        ]
    }, function(err, data) {


        if (err) {
            return res.status(500).json({
                err_code: 500,
                message: 'Internal error'
            })
        }
        if (data) {
            //Express提供了一个响应方法：json
            //该方法接收一个对象作为参数，它会自动帮你把对象转为字符串再发送给浏览器

            return res.status(200).json({
                err_code: 1,
                message: 'Email or nickname already exits'
            })
        }
        //对密码进行md5重复加密
        body.password = md5(md5(body.password))
        new User(body).save(function(err, user) {
            if (err) {
                return res.status(500).json({
                    err_code: 500,
                    message: 'internal error'
                })
            }
            req.session.user = user
            res.status(200).json({
                err_code: 0,
                message: 'Ok'
            })
        })

    })

})

router.get('/logout', function(req, res) {
    //清除登陆状态
    req.session.user = null
        //服务器端同步重定向到登录页
    res.redirect('/login')

})

module.exports = router