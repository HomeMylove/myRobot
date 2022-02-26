const { makePoem } = require('./makePoem')

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

    if (rawMsg.indexOf('藏头诗') == 0) {
        return makePoem(body, res)

    }

    next()
}

module.exports.__help = [
    ['藏头诗', `藏头诗 我稀罕你 (头/尾 5/7)\n默认5言藏头`, stauts]
]