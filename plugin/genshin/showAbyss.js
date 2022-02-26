const { GenshinKit } = require('@genshin-kit/core')
const App = new GenshinKit()


const { db } = require('../../../db/createDB')


module.exports.showAbyss = (body, res) => {

    const groupId = body['group_id']
    const rawMsg = body['raw_message']
    const userId = body['user_id']
    const nickname = body['sender']['card'] || body['sender']['nickname'] // 对方的昵称

    const sqlStr = 'SELECT * FROM genshin WHERE user_id=?'
    db.query(sqlStr, [userId], (err, results) => {
        if (err) {
            return res.sendMsg({
                msg: '错误',
                groupId
            })
        }

        if (results.length > 0) {
            const { uid, cookie } = results[0]
            const user = { uid, cookie }


            App.loginWithCookie(cookie)

            Promise.all([App.getCurrentAbyss(uid), App.getPreviousAbyss(uid)]).then(
                ([cur, prev]) => {

                    const msg = `[CQ:at,qq=${userId}] 深境螺旋\n当期: ${formatter(cur)}\n往期: ${formatter(prev)}`
                    res.sendMsg({
                        msg,
                        groupId
                    })
                }
            )
        } else {
            res.sendMsg({
                msg: '未查找到信息,请私聊智乃回复"原神"绑定uid',
                groupId
            })

        }
    })
}


// 获取深渊信息
function formatter({
    start_time,
    end_time,
    total_battle_times,
    total_win_times,
    max_floor,
    floors,
    total_star,
}) {
    function getTime(t) {
        return new Date(t * 1000).toISOString().replace('T', ' ').replace('.000Z', '')
    }

    const details = []

    for (let i = 0; i < floors.length; i++) {
        const item = floors[i]

        const str = `  第${item['index']}层 ${item['star']}/${item['max_star']}`

        details.push(str)
    }



    return [
        ``,
        `开始时间:\n${getTime(start_time)}`,
        `结束时间:\n${getTime(end_time)}`,
        `战斗次数:${total_battle_times}`,
        `胜利次数:${total_win_times}`,
        `到达层数:${max_floor}`,
        ...details,
        `总星数:${total_star}`

    ].join('\n')
}