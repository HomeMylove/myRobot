const { db } = require('../../db/createDB')



module.exports.showWinRate = (body, res) => {
    let groupId = body['group_id']

    let userId = body['user_id']

    const sqlStr = 'SELECT * FROM qq_robot WHERE group_id=?'

    db.query(sqlStr, [groupId], (err, results) => {
        if (err) {
            return res.sendMsg({
                groupId,
                msg: '查询错误'
            })
        }

        // 剔除没有数据的
        const rank = []

        for (let i = 0; i < results.length; i++) {
            if (results[i]['win_rate']) {

                const u = JSON.parse(results[i]['win_rate'])
                u['user_id'] = results[i]['user_id']

                rank.push(u)
            }
        }

        // 排序
        const newRank = rank.sort((a, b) => {
            return b['rate'] - a['rate']
        })

        for (let i = 0; i < newRank.length; i++) {

            const item = newRank[i]

            if (item['user_id'] == userId) {

                const { win, lose, rate, draw } = item

                const words = []

                words.push(`[CQ:at,qq=${userId}]`)

                words.push(`胜利 ` + win)
                words.push(`失败 ` + lose)
                words.push(`平局 ` + draw)
                words.push(`总胜率 ` + Math.round(rate * 100) + '%')
                words.push(`本群排行第${i+1}名`)

                return res.sendMsg({
                    groupId,
                    msg: words.join('\n')
                })

            }


        }

        return res.sendMsg({
            groupId,
            msg: `[CQ:at,qq=${userId}]\n没有查询到你的对战记录`
        })







    })

}