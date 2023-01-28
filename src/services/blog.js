/**
 * @description 微博
 * @author 玉
 */



const {Blog} = require('../db/model/Blog')

/**
 * 创建微博
 * @param {Object} param0 
 */
async function createBlog({userId, content, image}) {
    const result = await Blog.create({
        userId,
        content,
        image
    })
    return result.dataValues
}

module.exports = {
    createBlog
}

