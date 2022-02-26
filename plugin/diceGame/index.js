const { diceGame } = require('./diceGame')
const { showWinRate } = require('./showWinRate')

const stauts = true

module.exports = (req, res, next) => {
    let body = req['body']
    let groupId = body['group_id']


    let rawMsg = body['raw_message']

    if (rawMsg.indexOf('掷骰子') !== -1) {

        if (!stauts) {
            return res.sendMsg({
                groupId,
                msg: '本群未开启该功能'
            })
        }

        return diceGame(body, res)

    } else if (rawMsg == '我的胜率') {
        return showWinRate(body, res)
    }


    next()
}

module.exports.__help = [
    ['掷骰子', `掷骰子 | 掷骰子@×× | @×× 掷骰子`, stauts]
]