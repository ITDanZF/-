/**
 * @description utils controller
 * @author 玉
 */

const { ErrorModel, SuccessModel } = require("../model/ResModel")
const {uploadFileSizeFailInfo}  =require('../model/ErrorInfo')
const fse = require('fs-extra') 
const path = require('path')

//存储目录
const DIST_FOLDER_PATH = path.join(__dirname, '..', '..', 'uploadFiles')

//文件最大体积1M
const MAX_SIZE = 1024 * 1024 * 1024


//是否需要创建目录
fse.pathExists(DIST_FOLDER_PATH).then(exist => {
    if (!exist) {
        fse.ensureDir(DIST_FOLDER_PATH)
    }
})


/**
 * 保存文件
 * @param {*} param0 
 * @returns 
 */
async function saveFile({name, type, size, filePath}) {
    if (size > MAX_SIZE) {
        await fse.remove(filePath)
        return new ErrorModel(uploadFileSizeFailInfo)
    }

    //移动文件
    const fileName = Date.now() + '.' + name
    const distFilePath = path.join(DIST_FOLDER_PATH, fileName)
    await fse.move(filePath, distFilePath)
    
    //返回信息
    return new SuccessModel({
        url:'/' + fileName,

    })
}

module.exports = {
    saveFile
}