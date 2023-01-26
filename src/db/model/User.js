const seq = require('../seq')
const {STRING, DECIMAL} = require("../types")


const User = seq.define('user', {
    userName:{
        type:STRING,
        allowNull:true,
        unique:true,
        comment:'用户名'
    },
    password:{
        type:STRING,
        allowNull:false,
        comment:'密码'
    },
    nickName:{
        type:STRING,
        allowNull:false,
        comment:'名称'
    },
    gender:{
        type:DECIMAL,
        allowNull:false,
        defaultValue:3,
        comment:'性别',
    },
    picture:{
        type:STRING,
        comment:'头像'
    },
    city:{
        type:STRING,
        comment:'城市'
    }
})

module.exports = User