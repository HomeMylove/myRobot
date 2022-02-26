const { autoChat } = require('./autoChat')
const { robotName } = require('../../config')

const stauts = false

module.exports = (req, res, next) => {
    let body = req['body']
    let groupId = body['group_id']
    if (!stauts) {
        return res.sendMsg({
            groupId,
            msg: '本群未开启该功能'
        })
    }
    autoChat(body, res)
    next()
}

module.exports.__help = [
    ['对话', `${robotName}+任意语句`, stauts]
]