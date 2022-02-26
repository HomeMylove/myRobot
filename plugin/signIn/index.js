const { signIn } = require('./signIn')

const stauts = true

module.exports = (req, res, next) => {
    let body = req['body']
    let groupId = body['group_id']
    if (!stauts) {
        return res.sendMsg({
            groupId,
            msg: '本群未开启该功能'
        })
    }
    let rawMsg = body['raw_message']
    if (rawMsg == '签到') {
        return signIn(body, res)
    }

    next()
}


module.exports.__help = [
    ['签到', '签到', stauts]
]