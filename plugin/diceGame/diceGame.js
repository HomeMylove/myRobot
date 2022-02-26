// 导入配置
const config = require('../../config')

const { db } = require('../../db/createDB')


/**
 * 骰子对决,群成员与 robot 进行对决
 * @param {object} body post请求体
 */
module.exports.diceGame = (body, res) => {

    // 判断 关键词 出现的次数
    const rawMsg = body['raw_message']

    const groupId = body['group_id'] // 群组的id
    const userId = body['sender']['user_id'] // 对方的id
    const nickname = body['sender']['card'] || body['sender']['nickname'] // 对方的昵称
    const selfId = body['self_id'] // 我自己

    // 是否有艾特
    const reg = /\[CQ:at,qq=([0-9]+)\]/

    // 是否有多的词
    const str = rawMsg.replace(reg, '').replace('掷骰子', '').trim()

    // 是否有@
    const result = rawMsg.match(reg)
    let player

    if (result !== null) player = result[1]

    const myPoint = 999


    let winner, loser, draw


    // 有多的词
    if (str) {
        let msg = `[CQ:at,qq=${userId}]\n格式不对哦!\n可回复“帮助 掷骰子”`
        return res.sendMsg({
            groupId,
            msg
        })

        // 格式正确,挑战智乃
    } else if (rawMsg === '掷骰子' || player == selfId) {
        // 产生随机点数
        let number1 = Math.ceil(Math.random() * 6)
        let number2 = Math.ceil(Math.random() * 6)

        if (userId == config.SUPERUSER) {
            let msg = `[CQ:at,qq=${userId}]\n主人掷出了${myPoint}\n${config.robotName}掷出了${number1}\n主人获得了胜利 [CQ:face,id=21]`
            return res.sendMsg({ groupId, msg })
        }

        // 判断结果
        let result = null



        if (number1 > number2) {
            result = `${config.robotName}获得了胜利 [CQ:face,id=13]`

            winner = selfId
            loser = userId

        } else if (number1 < number2) {
            result = `${nickname}获得了胜利 [CQ:face,id=18]`

            winner = userId
            loser = selfId


        } else {
            result = '平局 [CQ:face,id=98]'

            draw = [userId, selfId]
        }
        // 生成 msg @ID result
        let msg = `[CQ:at,qq=${userId}]\n你掷出了${number2}\n${config.robotName}掷出了${number1}\n` + result

        res.sendMsg({ groupId, msg })

    } else {
        res.getGroupMemberInfo(groupId, parseInt(player)).then(
            response => {
                const nickname2 = response['card'] || response['nickname']
                    // 产生随机点数
                const number1 = Math.ceil(Math.random() * 6)
                const number2 = Math.ceil(Math.random() * 6)

                if (player == config.SUPERUSER) {
                    let msg = `[CQ:at,qq=${userId}]\n你掷出了${number1}\n我的主人掷出了${myPoint}\n主人获得了胜利 [CQ:face,id=99]`
                    return res.sendMsg({ groupId, msg })
                }

                if (userId == config.SUPERUSER) {
                    let msg = `[CQ:at,qq=${userId}]\n主人你掷出了${myPoint}\n[CQ:at,qq=${player}]你掷出了${number1}\n主人获得了胜利 [CQ:face,id=99]`
                    return res.sendMsg({ groupId, msg })
                }

                // 判断结果
                let result = null
                if (number1 > number2) {
                    result = `${nickname}获得了胜利`

                    winner = userId
                    loser = player

                } else if (number1 < number2) {
                    result = `${nickname2}获得了胜利`

                    winner = player
                    loser = userId


                } else {
                    result = '平局'

                    draw = [userId, player]
                }
                // 生成 msg @ID result
                let msg = `[CQ:at,qq=${userId}] 你掷出了${number1}\n[CQ:at,qq=${player}]你掷出了${number2}\n` + result

                res.sendMsg({ groupId, msg })
            }
        )

    }


    if (winner && loser) {
        winOrLose({ winner }).then(status => {
            winOrLose({ loser })
        })
    } else if (draw) {
        winOrLose({ drawer: draw[0] }).then(status => {
            winOrLose({ drawer: draw[1] })
        })
    }






    function winOrLose({ winner, loser, drawer }) {

        let player = winner || loser || drawer

        const sqlStr = 'SELECT * FROM qq_robot WHERE group_id=? AND user_id=?'

        return new Promise((resove, reject) => {

            db.query(sqlStr, [groupId, player], (err, results) => {
                if (err) {
                    return res.sendMsg({
                        groupId,
                        msg: '写入对局失败'
                    })
                }

                if (results.length == 1) {

                    let rawData

                    if (!results[0]['win_rate']) {

                        rawData = {
                            win: 0,
                            lose: 0,
                            draw: 0,
                            rate: 0
                        }
                    } else {
                        rawData = JSON.parse(results[0]['win_rate'])
                    }

                    let { win, lose, rate, draw } = rawData

                    if (winner) {
                        win += 1
                    } else if (loser) {
                        lose += 1
                    } else {
                        draw += 1
                    }

                    rate = win / (win + lose + draw)

                    const win_rate = JSON.stringify({
                        win,
                        lose,
                        rate,
                        draw
                    })

                    const user = {
                        group_id: groupId,
                        user_id: player,
                        win_rate
                    }

                    const sqlStr = 'UPDATE qq_robot SET ? WHERE group_id=? AND user_id=?'

                    db.query(sqlStr, [user, groupId, player], (err, results) => {
                        if (err) {
                            return res.sendMsg({
                                groupId,
                                msg: '写入对局失败'
                            })
                        }

                        if (results.affectedRows == 1) {
                            console.log('写入对局成功');

                            resove('ok')
                        }
                    })


                } else if (results.length == 0) {

                    const sqlStr = 'INSERT INTO qq_robot SET ?'

                    const data = {
                        win: 0,
                        lose: 0,
                        rate: 0,
                        draw: 0
                    }

                    if (winner) {
                        data['win'] += 1
                    } else if (loser) {
                        data['lose'] += 1
                    } else {
                        data['draw'] += 1
                    }

                    const win_rate = JSON.stringify(data)


                    const user = {
                        group_id: groupId,
                        user_id: player,
                        win_rate
                    }

                    db.query(sqlStr, [user], (err, results) => {
                        if (err) {
                            return res.sendMsg({
                                groupId,
                                msg: '写入对局失败'
                            })
                        }

                        if (results.affectedRows == 1) {
                            console.log('写入对局成功');

                            resove('ok')
                        }
                    })


                }
            })

        })




    }



}