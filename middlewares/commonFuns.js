// 在这里为 res 绑定方法，使得不管在何处都可以调用
const sendMsg = require('./scripts/sendMsg')
const getGroupMemberInfo = require('./scripts/getGroupMenberInfo')
const getRandomReply = require('./scripts/getRandomReply')
const selectData = require('./scripts/dbFuns/selectData')
const updateData = require('./scripts/dbFuns/updateData')
const insertData = require('./scripts/dbFuns/insertData')

module.exports.commonFuns = (req, res, next) => {

    res.sendMsg = sendMsg
    res.getGroupMemberInfo = getGroupMemberInfo
    res.getRandomReply = getRandomReply
    res.selectData = selectData
    res.updateData = updateData
    res.insertData = insertData

    next()
}