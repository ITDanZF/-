/**
 * 用户名是否存在
 * @param {string} userName 
 */

const {getUserInfo, createUser, updateUser} = require('../services/user')
const {ErrorModel, SuccessModel} = require('../model/ResModel')
const { registerUserNameNotExistInfo, 
     registerUserNameExistInfo,
     registerFailInfo,
     loginFailInfo,
     changeInfoFailInfo,
     changePasswordFailInfo} = require('../model/ErrorInfo')

const doCrypto = require('../utils/cryp')

/**
 * 用户是否存在
 * @param {string} userName 用户名
 */
async function isExist(userName) {
   
    const userInfo = await getUserInfo(userName)
   
   
   if (userInfo) {
        return new SuccessModel(userInfo)
   } else {
        return new ErrorModel(registerUserNameNotExistInfo)
   }
}

/**
 * 注册
 * @param {string} userName 
 * @param {string} password 
 * @param {number} gender 
 */
async function register({userName, password, gender}) {
     const userInfo = await getUserInfo(userName)
     if (userInfo) {
          //用户名已存在
          return ErrorModel(registerUserNameExistInfo)
     }
     try {
          await createUser({
               userName,
               password:doCrypto(password),
               gender
          })
          return new SuccessModel()
     } catch(ex) {
          console.error(ex.message, ex.stack);
          return new ErrorModel(registerFailInfo)
     }
}

/**
 * 登录
 * @param {Object} ctx koa2 ctx 
 * @param {string} userName 用户名 
 * @param {string} password 密码
 */
async function login(ctx, userName, password) {
     
     //获取用户信息
     const userInfo = await getUserInfo(userName, doCrypto(password))

     if (!userInfo) {
          //登陆失败
          return new ErrorModel(loginFailInfo)
     }

     //登录成功
     if (ctx.session.userInfo == null) {
          ctx.session.userInfo = userInfo
     }
     return new SuccessModel()
}

/**
 * 修改个人信息
 * @param {Object} ctx 
 * @param {Obkect} param1 
 */
async function changeInfo(ctx, {nickName, city, picture}) {
     const userName = ctx.session.userInfo
     if (!nickName) {
          nickName = userName
     }
     const result = await updateUser(
          {
               newNickname:nickName,
               newCity:city,
               newPicture:picture
          },
          {userName}
     )

     //执行成功
     if (result) {
          Object.assign(ctx.session.userInfo, {
               nickName,
               city,
               picture
          })
      return new SuccessModel()
     }
     //失败
     return new ErrorModel(changeInfoFailInfo)
}

/**
 * 修改个人密码
 * @param {Object} param0 
 */
async function changePassword({userName, password, newPassword}) {
     const result = await updateUser(
          {
               newPassword:doCrypto(newPassword)
          },
          {
               userName,
               password:doCrypto(password)
          }
     )

     if (result) {
          return new SuccessModel()
     }

     return new ErrorModel(changePasswordFailInfo)
}


/**
 * 推出登录
 * @param {Object} ctx 
 * @returns 
 */
async function logout(ctx) {
     delete ctx.session.userInfo
     return new SuccessModel()
}

module.exports =  {
    isExist,
    register,
    login,
    changeInfo,
    changePassword,
    logout
}

