const { db } = require('../../db/createDB')

const logger = require('../../log')


module.exports.answer = (body, res) => {
    const rawMsg = body['raw_message']
    const groupId = body['group_id'] // 群组的id
    const userId = body['sender']['user_id'] // 对方的id

    const sqlStr = 'SELECT * FROM echo WHERE user_id=? AND group_id=? AND question=?'



    return new Promise((resove, reject) => {
        db.query(sqlStr, [userId, groupId, rawMsg], (err, results) => {
            if (err) {

                // logger.error(err)

                // return res.sendMsg({
                //     groupId,
                //     msg: '查找失败'
                // })

            }
            if (results.length == 1) {
                const reg = /[爹爷入爽日爸狗猪]/g

                // logger.error('试一下')

                res.sendMsg({
                    groupId,
                    msg: results[0]['answer'].replace(reg, '*')
                })

                resove(true)

            }

            resove(false)
        })
    })
}