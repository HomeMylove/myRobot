const express = require('express')
    // 创建app
const app = express()
    // 解决跨域问题(如果有的话)
const cors = require('cors')
app.use(cors())
    // 提取 post 请求的 body 数据
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//引入中间件 为 res 绑定 公共方法
const { commonFuns } = require('./middlewares/commonFuns')
app.use(commonFuns)

module.exports = app