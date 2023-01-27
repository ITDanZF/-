/**
 * @description json schema 校验
 * @author 玉
 */

const Ajv = require('ajv')
const ajv = new Ajv({
    // allErrors:true //输出所有的错误
})

/**
 * json schema校验
 * @param {object} schema json schema规则 
 * @param {object} data 待校验的数据
 */
function validate(schema, data = {}) {
    const valid = ajv.validate(schema, data)
    
    if (!valid) {
        return ajv.errors[0]
    }
}

module.exports = validate



