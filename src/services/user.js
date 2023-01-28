

const {User} = require('../db/model/index')
const {formatUser} = require('./_format')
/**
 * 获取用户信息
 * @param {string} userName 用户名 
 * @param {string} password 密码
 */
async function getUserInfo(userName, password) {
    
     //查询条件
     const whereOpt = {
        userName
    }
    if (password) {
        Object.assign(whereOpt, {password})
    }

    //查询
    const result = await User.findOne({
        attributes:['id', 'userName', 'picture', 'city'],
        where:whereOpt
    })

    if (result == null) {
        //未找到
        return result
    }

    //格式化处理
    const formatRes = formatUser(result.dataValues)
    return formatRes
}

/**
 * 创建用户
 * @param {string} userName 
 * @param {string} password 
 * @param {number} gender 
 * @param {string} nickName 
 */

async function createUser({userName, password, gender = 3, nickName}) {
    const result = await User.create({
        userName,
        password,
        nickName:nickName?nickName:userName,
        gender
    })
    return result.dataValues
}


/**
 * 更新个人信息
 * @param {Object} param0 
 * @param {object} param1 
 */
async function updateUser(
    {newPassword, newNickname, newPictue, neWCity},
    {userName, password}
) {
    //拼接修改内容
    const updateData = {}
    if (newPassword) {
        updateData.password = newPassword
    }
    if (newNickname) {
        updateData.nickName = newNickname
    }
    if (newPictue) {
        updateData.picture = newPictue
    }
    if (neWCity) {
        updateData.city = neWCity
    }
    //拼接查询条件
    const whereData = {
        userName
    }
    if (password) {
        whereData.password = password
    }

    //执行修改
    const result = await User.update(updateData, {
        where:whereData
    })
    return result[0] > 0
}


module.exports = {
    getUserInfo,
    createUser,
    updateUser
}