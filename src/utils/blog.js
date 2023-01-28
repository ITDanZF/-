/**
 * @description 微博工具渲染
 */


const fs = require('fs')
const ejs = require('ejs')
const path = require('path')




// 获取 blog-list.ejs 的文件内容
const BLOG_LIST_TPL = fs.readFileSync(
    path.join(__dirname, '..', 'views', 'widgets', 'blog-list.ejs')
).toString()

/**
 * 根据 blogList 渲染出 html 字符串
 * @param {Array} blogList 微博列表
 * @param {boolean} canReply 是否可以回复
 */
function getBlogListStr(blogList = [], canReply = false) {
    return ejs.render(BLOG_LIST_TPL, {
        blogList,
        canReply
    })
}

module.exports = {
    getBlogListStr
}


