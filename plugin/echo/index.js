const { answer } = require('./answer')
const { echo } = require('./echo')
const { show } = require('./show')
const { update } = require('./update')
const { _delete } = require('./delete')



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

    // console.log(body);


    if (rawMsg.indexOf('echo') == 0) {
        return echo(body, res)
    } else if (rawMsg == 'show') {
        return show(body, res)
    } else if (rawMsg.indexOf('update') == 0) {
        return update(body, res)
    } else if (rawMsg.indexOf('delete') == 0) {
        return _delete(body, res)
    } else {
        answer(body, res).then(value => { if (!value) next() })
    }
}


module.exports.__help = [
    ['echo', 'echo 你是谁? 我是智乃。(请使用文明用语,构建和谐社会)\nupdate id=12 我是谁? 老公\nshow\ndelete id=12', stauts]
]