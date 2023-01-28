/**
 * @description utils 路由
 * @author 玉
 */

const router = require('koa-router')()
const {loginCheck} = require('../../middlewares/loginChecks')
const koaForam = require('formidable-upload-koa')
const {saveFile} = require('../../controller/utils')

router.prefix('/api/utils')

// 上传图片
router.post('/upload', loginCheck, koaForam(), async(ctx, next) => {
    const file = ctx.req.files['file']
    const {size, path, name, type} = file
    ctx.body =  await saveFile({
        name,
        type,
        size,
        filePath:path
    })
})



module.exports = router
