const { db } = require('../../db/createDB')


module.exports.echo = (body, res) => {
    const groupId = body['group_id'] // 群组的id
    const userId = body['sender']['user_id'] // 对方的id

    const str = body['raw_message'].trim()

    const reg = /\s+(.*?)\s+/

    let question, answer


    try {
        question = str.match(reg)[1]

        answer = str.replace('echo', '').replace(question, '').trim()
    } catch {
        return res.sendMsg({
            groupId,
            msg: '你这么说智乃可记不住啊,重新考虑一下吧'
        })
    }

    const user = {
        user_id: userId,
        group_id: groupId,
        question,
        answer
    }

    const sqlStr = 'SELECT * FROM echo WHERE user_id=? AND group_id=? AND question=?'

    db.query(sqlStr, [userId, groupId, question], (err, results) => {
        if (err) {
            return res.sendMsg({
                groupId,
                msg: '查找信息错误'
            })
        }

        // 存在数据
        if (results.length == 1) {

            let id = results[0]['id']

            const sqlStr = 'UPDATE echo SET ? WHERE id = ?'

            db.query(sqlStr, [user, id], (err, results) => {
                if (err) {
                    return res.sendMsg({
                        groupId,
                        msg: '替换失败'
                    })
                }

                if (results.affectedRows == 1) {
                    return res.sendMsg({
                        groupId,
                        msg: `智乃记住了,以后你可以对我说 "${question}"`
                    })
                }
            })
        }

        // 不存在数据
        else {
            const sqlStr = 'SELECT * FROM echo WHERE user_id=? AND group_id=?'

            db.query(sqlStr, [userId, groupId], (err, results) => {
                if (err) {
                    return res.sendMsg({
                        groupId,
                        msg: '查找用户失败'
                    })
                }

                if (results.length < 10) {
                    const sqlStr = 'INSERT INTO echo SET ?'

                    db.query(sqlStr, user, (err, results) => {
                        if (err) {
                            return res.sendMsg({
                                groupId,
                                msg: '添加新的问答错误'
                            })
                        }

                        if (results.affectedRows == 1) {
                            return res.sendMsg({
                                groupId,
                                msg: `智乃记住了,以后你可以对我说 "${question}"`
                            })
                        }
                    })
                } else {

                    const lowestId = results[0]['id']
                    const questionOld = results[0]['question']

                    const sqlStr = 'UPDATE echo SET ? WHERE id = ?'

                    db.query(sqlStr, [user, lowestId], (err, results) => {
                        if (err) {
                            return res.sendMsg({
                                groupId,
                                msg: '替换旧问答失败'
                            })
                        }
                        if (results.affectedRows == 1) {
                            return res.sendMsg({
                                groupId,
                                msg: `智乃记住了,以后你可以对我说"${question}"\n但是智乃只能记住10句话哦,这句话替换了你的"${questionOld}"\n替换其他语句请使用\nupdate id=? question answer\n查看id请使用\nshow`
                            })
                        }
                    })



                }


            })
        }





    })






}