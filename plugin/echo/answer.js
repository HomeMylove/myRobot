const { db } = require('../../db/createDB')

const logger = require('../../log')


module.exports.answer = (body, res) => {
    const rawMsg = body['raw_message']
    const groupId = body['group_id'] // 群组的id
    const userId = body['sender']['user_id'] // 对方的id

    const sqlStr = 'SELECT * FROM echo WHERE group_id=? AND question=?'



    return new Promise((resove, reject) => {
        db.query(sqlStr, [groupId, rawMsg], (err, results) => {
            if (err) {

                // logger.error(err)

                // return res.sendMsg({
                //     groupId,
                //     msg: '查找失败'
                // })
                return

            }
            if (results.length > 0) {

                const reg = /[爹爷入爽日爸狗猪]/g

                for (let i = 0; i < results.length; i++) {

                    let item = results[i]

                    if (item['user_id'] == userId) {
                        console.log('找到了');


                        res.sendMsg({
                            groupId,
                            msg: item['answer'].replace(reg, '*')
                        })

                        return resove(true)

                    }
                }

                // logger.error('试一下')
                console.log('没有，默认的');
                res.sendMsg({
                    groupId,
                    msg: results[Math.floor(Math.random() * results.length)]['answer'].replace(reg, '*')
                })

                return resove(true)

            }

            resove(false)
        })
    })
}