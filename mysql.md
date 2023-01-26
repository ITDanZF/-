# 1.mysql基本操作

```mysql
select * from users;
select * from blogs;
-- 增加
insert into users(username, password, nickname) values('zhangsan','123','张三');
insert into users(username, password, nickname) values('lisi','123','里斯');
insert into blogs(title, content, userid) values('标题1', '内容1', 1);
insert into blogs(title, content, userid) values('标题2', '内容2', 2);
insert into blogs(title, content, userid) values('标题3', '内容3', 3);
insert into blogs(title, content, userid) values('标题4', '内容4', 4);
insert into blogs(title, content, userid) values('标题5', '内容5', 5);

-- 删除
delete from blogs where id = 4;

-- 更新
update blogs set content='内融' where id = 1;
-- 总数
select count(id) as sum from blogs;

-- 分页
select * from blogs order by id desc limit 2; 

-- 跳过两行
select * from blogs order by id desc limit 2 offset 2;


-- 连表查询
select * from blogs inner join users on users.id = blogs.userid;
select blogs.* ,users.username, users.nickname from blogs inner join users on users.id = blogs.userid


```

# 2.sequelize使用

```javascript
-- 初始化
npm init -y

-- npm下载
npm i mysql2 sequelize -d


// 创建数据库链接
const Sequelize = require('sequelize')
const confit =  {
    host:'localhost',
    dialect:'mysql'
}

const seq = new Sequelize('koa_weibo', 'root', '123456',confit)

// 测试数据库链接
seq.authenticate().then(() => {
    console.log('ok');
}).catch(() => {
    console.log('err');
})

module.exports = seq






```

## 2.1创建模型

```javascript
const Sequelize = require('sequelize')
const seq = require('./seq')


// 创建user模型
//默认设置为users表名
const User = seq.define('user', {
    //id会自动创建，并设置为主键
    userName: {
        type:Sequelize.STRING,//VARCHAR(255)
        allowNull:false,//是否允许为空
    },
    password: {
        type: Sequelize.STRING,
        allowNull:false
    },
    nickName: {
        type: Sequelize.STRING,
        allowNull:false,
        comments:'昵称'
    }
})
//创建Blog模型
const Blog = seq.define('blog', {
    title:{
        type:Sequelize.STRING,
        allowNull:false, 
    },
    content:{
        type:Sequelize.STRING,
        allowNull:false, 
    },
    userId:{
        type:Sequelize.INTEGER,
        allowNull:false, 
    }
})



// 外键关联
//一个Blog对应多个User
// 外键：Blog.userId
// 主键：User.id
// 两种方法二选一，最好两个都写，方便查询

//创建外键 Blog.userId -> User.id
Blog.belongsTo(User, {
    foreignKey:'userId'
})
//创建外键 Blog.userId -> User.id
User.hasMany(Blog, {
    foreignKey:'userId'
})


module.exports = {
    User,
    Blog
}
```

## 2.2同步执行

```javascript
const seq = require('./seq')
require('./module')

//测试数据库链接
seq.authenticate().then(() => {
    console.log('ok');
}).catch(() => {
    console.log('err');
})

// 执行同步
seq.sync({force:true}).then(() => {
    console.log('同步成功');
    process.exit()
})
```

## 2.3插入

```javascript
const {Blog, User} = require('./module')  
//创建用户
    const zhangsan = await User.create({
        userName:'zhangsan',
        password:'132',
        nickName:'张三'
    })
    console.log('占山', zhangsan.dataValues);


```

## 2.4基本查询

```javascript
    //条件查询
    const zhangsan = await User.findOne({
        where: {
            userName:'zhangsan'
        }
    })

    console.log(zhangsan.dataValues);

    //查询特定的列
    const zhangsanName = await User.findOne({
        attributes:['userName', 'nickName'],
        where: {
            userName:'zhangsan'
        }
    })
    console.log(zhangsanName.dataValues);

    //查询一个列表
    const zhangsanList = await Blog.findAll({
        where: {
            userId:1
        },
        order:[
            ['id', 'desc']
        ]
    })

    //返回结果：[{},{},{},{}]
    console.log('张三list', zhangsanList.map( blog => blog.dataValues));

    //分页(查第四页)
    //limit:n
    //offset: (页数 - 1) * n
    const blogPageList = await Blog.findAll({
        limit:2,//限制本次查询2条
        offset:6,//跳过多少条
        order:[
            ['id', 'desc']
        ]
    })
    console.log(blogPageList.map(blog => blog.dataValues));


    //查询总数
    const blogListAndCount = await Blog.findAndCountAll({
        limit:2,
        offset:0,
        order:[
            ['id', 'desc']
        ]      
    })
    console.log(
        blogListAndCount.count,//所有的总数，不考虑分页
        blogListAndCount.rows.map(blog => blog.dataValues),

    );

```

2.5连表查询

```javascript
 //连表查询1
    const blogListWithUser = await Blog.findAndCountAll({
        order:[
            ['id', 'desc']
        ],
        include: [
            {
                module: User,
                attributes:['userName', 'nickName'],
                where: {
                    userName:'zhangsan'
                }
            }
        ]
    })
    console.log(
        blogListWithUser.count,
        blogListWithUser.rows.map(blog => {
            const blogVal = blog.dataValues
            blogVal.user = blog.user.dataValues
            return blogVal
        }),
    );

    //连表查询2
    const userListWithBlog = await User.findAndCountAll({
        attributes:['userName', 'nickName'],
        include:[
            {
                module:Blog
            }
        ]
    })
    console.log(
        userListWithBlog.count,
        userListWithBlog.rows.map(user => {
            const userVal = user.dataValues
            userVal.blogs = user.blogs.map(blog =>blog.dataValues)
            return userVal
        }),
        );
```

## 2.5更新

```javascript
    const updateRes = await User.update({
        nickName:'张三'
    },{
        where:{
            userName:'zhangsan'
        }
    })

    console.log(updateRes);
```

## 2.6删除

```javascript
    const delBlog = await Blog.destroy({
        where:{
            id:4
        }
    })

    console.log(delBlog);
```
