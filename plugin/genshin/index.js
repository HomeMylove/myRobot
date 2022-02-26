const { wish } = require('./wish')


let stauts = true

const BAN = ['797991867', '906026830']

module.exports = (req, res, next) => {
    let body = req['body']

    let groupId = body['group_id']



    let rawMsg = body['raw_message']


    if (rawMsg == '抽卡' || rawMsg == '十连') {
        if (BAN.indexOf(groupId.toString()) !== -1) {
            stauts = false
        }

        if (!stauts) {
            return res.sendMsg({
                groupId,
                msg: '本群未开启该功能'
            })
        }
        return wish(body, res)
    }

    next()

}



module.exports.__help = [
    ['祈愿', '抽卡\n十连', stauts],
]