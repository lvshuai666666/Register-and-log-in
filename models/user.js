var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/test', { useMongoClient: true }).then(() => {
        console.log("连接数据库成功");
    })
    .catch(err => {
        console.log(err);
    })
var Schema = mongoose.Schema

var userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    created_time: {
        type: Date,
        //注意：这里不要写Date.now（）因为会即刻调用这里直接给了一个方法：Date.now当你去new Mode1的时候，如果你没有传递create-time，则mongoose就会调用
        default: Date.now
    },
    last_modified_time: {
        type: Date,
        //注意：这里不要写Date.now（）因为会即刻调用这里直接给了一个方法：Date.now当你去new Mode1的时候，如果你没有传递create-time，则mongoose就会调用
        default: Date.now
    },
    avatar: {
        type: String,
        default: '/public/img/avatar-max-img.png'
    },
    bio: {
        type: String,
        default: ''
    },
    gender: {
        type: String,
        enum: [-1, 0, 1],
        default: -1
    },
    birthday: {
        type: Date
    },
    status: {
        type: Number,
        //0没有权限1限制不可以评论2不可以登陆
        enum: [0, 1, 2],
        default: 0
    }
})

module.exports = mongoose.model('User', userSchema)