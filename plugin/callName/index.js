const { remindMyName } = require('./remindMyName')
const { rememberMyName } = require('./rememberMyName')
const { robotName } = require('../../config')

let stauts = true

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

    let nick = res.nick(rawMsg)

    if (nick) {
        rawMsg = rawMsg.replace(nick, '').trim()


        if (rawMsg.indexOf(`以后叫我`) === 0) {

            body['raw_message'] = rawMsg
            return rememberMyName(body, res)

        } else if (rawMsg === `我是谁` || rawMsg === `你是我的谁`) {

            body['raw_message'] = rawMsg
            return remindMyName(body, res)

        }

    }




    next()

}


module.exports.__help = [
    ['记住我', `${robotName}以后叫我欧尼酱\n${robotName}我是谁 | ${robotName}你是我的谁`, stauts]
]