/**
 * @description 首页 
 * @author 玉
 */

const { SuccessModel ,ErrorModel} = require('../model/ResModel')
const {createBlogFailInfo} = require('../model/ErrorInfo')
const {createBlog} = require('../services/blog')

/**
 * @description 首页 controller
 * @author 玉
 */


const xss = require('xss')


/**
 * 创建微博
 * @param {Object} param0 
 * @returns 
 */
async function create({userId, content, image}) {
    try {
        // 创建微博
        const blog = await createBlog({
            userId,
            content:xss(content),
            image
        })
        return new SuccessModel(blog)
    } catch(ex) {
        console.error(ex.message, ex.stack);
        return new ErrorModel(createBlogFailInfo)
    }
}


module.exports = {
    create
}

