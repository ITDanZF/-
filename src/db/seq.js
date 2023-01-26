// 创建数据库链接
const Sequelize = require('sequelize')
const {MYSQL_CONF} = require('../conf/db')
const {isProd, isTest} = require('../utils/env')

const confit =  {
    host:MYSQL_CONF.host,
    dialect:'mysql'
}


if(isTest) {
    confit.logging = () => {}
}

if (isProd) {
    //线上环境，连接池
    confit.pool = {
        max:5,
        min:0,
        idle:10000,//一个连接池10s后没有被使用的释放
    }

}

const seq = new Sequelize(MYSQL_CONF.database, MYSQL_CONF.user,MYSQL_CONF.password, confit)


module.exports = seq



