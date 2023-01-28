/**
 * @description json schema 验证中间件
 * @author 玉
 */

const {ErrorModule} = require('../model/ResModel')
const {jsonSchemaFileInfo} = require('../model/ErrorInfo')

/**
 * 生成函数的中间件
 */
function genValidator(validateFn) {

    // 定义中间件函数
    async function validator(ctx, next) {
        const data = ctx.request.body
        const error= validateFn(data)
        if (error) {
            //验证失败
            ctx.body = new ErrorModule(jsonSchemaFileInfo)
            return
        }
        // 验证成功
        await next()
    }
    //返回中间件
    return validator
}

module.exports = {
    genValidator
}