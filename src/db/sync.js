const seq = require('./seq')
require('./module/index')

//测试数据库链接
seq.authenticate().then(() => {
    console.log('ok');
}).catch(() => {
    console.log('err');
})

// 执行同步
//force:true:每次都会把表全部清空，然后重新建表
// seq.sync({force:true}).then(() => {
//     console.log('同步成功');
//     process.exit()
// })

seq.sync().then(() => {
    console.log('同步成功');
    process.exit()
})