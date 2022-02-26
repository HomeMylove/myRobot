const { db } = require('../../db/createDB')


module.exports._delete = (body, res) => {
    const rawMsg = body['raw_message']
    const groupId = body['group_id'] // 群组的id
    const userId = body['sender']['user_id'] // 对方的id

    const reg = /id=(\d+)/

    let id

    try {
        id = rawMsg.match(reg)[1]
    } catch {
        return res.sendMsg({
            groupId,
            msg: '格式错误 正确格式\nupdete id=123'
        })
    }

    const sqlStr = 'SELECT * FROM echo WHERE user_id=? AND group_id=? AND id=?'

    db.query(sqlStr, [userId, groupId, id], (err, results) => {
        if (err) {
            return res.sendMsg({
                groupId,
                msg: '查找失败'
            })
        }
        if (results.length == 1) {

            const question = results[0]['question']
            const sqlStr = 'DELETE FROM echo WHERE id=?'

            db.query(sqlStr, [id], (err, results) => {
                if (err) {
                    return res.sendMsg({
                        groupId,
                        msg: '删除失败'
                    })
                }
                if (results.affectedRows == 1) {
                    return res.sendMsg({
                        groupId,
                        msg: `成功删除,智乃以后不会回应你的 ${question}`
                    })
                }
            })
        } else {
            return res.sendMsg({
                groupId,
                msg: '这句话不属于你,请使用 show 确认id'
            })
        }

    })



}