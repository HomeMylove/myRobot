const { db } = require('../../db/createDB')


module.exports.show = (body, res) => {
    // 判断 关键词 出现的次数
    const rawMsg = body['raw_message']

    const groupId = body['group_id'] // 群组的id
    const userId = body['sender']['user_id'] // 对方的id

    const sqlStr = 'SELECT * FROM echo WHERE user_id=? AND group_id=?'

    db.query(sqlStr, [userId, groupId], (err, results) => {
        if (err) {
            return res.sendMsg({
                groupId,
                msg: "查询信息错误"
            })
        }

        const msgList = []
        msgList.push(`[CQ:at,qq=${userId}] 智乃可以回复如下问题`)
        msgList.push(`id  Question`)

        for (let i = 0; i < results.length; i++) {
            const item = results[i]

            const { id, question, answer } = item

            const str = `${id}  ${question}`

            msgList.push(str)
        }

        return res.sendMsg({
            groupId,
            msg: msgList.join('\n')
        })
    })


}