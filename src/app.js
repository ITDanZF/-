const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const session = require('koa-generic-session')
const redisStore = require('koa-redis')
const KoaStztic = require('koa-static')
const path = require('path')

// 引入配置文件
const {REDIS_CONF} = require('./conf/db')
const {isProd} = require('./utils/env')
const {SESSION_SECRET_KEY} = require('./conf/secretKeys')

//映入路由文件
const profileAPIRouter = require('./routes/api/blog-profile')
const blogHomeAPIRouter = require('./routes/api/blog_home')
const blogViewRouter = require('./routes/view/blog')
const utilsAPIRouter = require('./routes/api/utils')
const userViewRouter = require('./routes/view/user')
const userAPIRouter = require("./routes/api/user")
const errorViewRouter = require('./routes/view/error')



// error handler
//错误路由处理
let onerrorConf = {}
if (isProd) {
  onerrorConf = {
    redirect:'/error'
  }
}
onerror(app, onerrorConf)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(KoaStztic(__dirname + '/public'))
app.use(KoaStztic(path.join(__dirname, '..',  'uploadFiles')))

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))



//session 配置
app.keys = [SESSION_SECRET_KEY]
app.use(session({
  key:'weibo.sid',//cookie name
  prefix:'weibo:sess',//redis key 的前缀
  cookie:{
    path:'/',
    httpOnly:true,
    maxAge:24 * 60 * 60 * 1000
  },
  store: redisStore({
    all:`${REDIS_CONF.host}:${REDIS_CONF.port}`,
  })
}))


// routes
app.use(profileAPIRouter.routes(), profileAPIRouter.allowedMethods())
app.use(blogHomeAPIRouter.routes(), blogHomeAPIRouter.allowedMethods())
app.use(blogViewRouter.routes(), blogViewRouter.allowedMethods())
app.use(userViewRouter.routes(), userViewRouter.allowedMethods())
app.use(utilsAPIRouter.routes(), utilsAPIRouter.allowedMethods())
app.use(userAPIRouter.routes(), userAPIRouter.allowedMethods())
app.use(errorViewRouter.routes(), errorViewRouter.allowedMethods()) //404路由注册必须在最下main

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
