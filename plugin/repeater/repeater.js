// 复读机
const MESSAGE = {}

module.exports.repeater = (req, res, next) => {

    const REPEAT_TIME = 2
    const PAUSE_TIME = 4


    let body = req['body']
        // console.log(body);
    let groupId = body['group_id']
    let rawMsg = body['raw_message']


    // 在消息列表中添加群组
    if (!MESSAGE[groupId]) {
        // 以群组的id作为对象的 键
        // rawMsg 原消息
        // num 消息出现的次数
        // 上一次重复的消息 (避免在复读一次之后继续复读)
        MESSAGE[groupId] = { rawMsg, num: 1 }


        // 消息列表中存在群组的情况下
    } else {
        if (MESSAGE[groupId]['rawMsg'] == rawMsg) {

            MESSAGE[groupId]['num']++

                if (MESSAGE[groupId]['num'] == REPEAT_TIME) {

                    return res.sendMsg({
                        msg: rawMsg,
                        groupId
                    })
                } else
            if (MESSAGE[groupId]['num'] == PAUSE_TIME) {
                return res.sendMsg({
                    groupId,
                    msg: '打断施法!!!'
                })
            }

        } else {
            MESSAGE[groupId]['rawMsg'] = rawMsg
            MESSAGE[groupId]['num'] = 1
        }
    }
    next()
}