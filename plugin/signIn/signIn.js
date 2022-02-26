const { createSignInImg } = require('./createSignInImg')
const { processData } = require('./processData')


function signIn(body, res) {
    const groupId = body['group_id'] // 群组的id
    const userId = body['sender']['user_id'] // 对方的id
    const nickname = body['sender']['card'] || body['sender']['nickname'] // 对方的昵称

    const user = {
        user_id: userId,
        group_id: groupId
    }

    res.selectData(user).then(results => {
        // 长度不为1,就是没有

        if (results.length !== 1) {

            //插入新数据
            res.insertData(user).then(results => {

                if (results.affectedRows == 1) {
                    const rawData = {
                        exp: 0, // 经验
                        level: 1, // 等级
                        coins: 0, // 硬币
                        checkInStatus: false, // 签到状态
                        checkInDays: 0, // 连续天数
                        notCheckInDays: 0, // 未签到天数
                        checkInRecords: 0, // 上次连续记录
                        goods: { g1: 0, g2: 0, g3: 0, g4: 0 }, // 我的商品
                        double: false, // 是否开启双倍经验
                        master: false, // 是否是主人
                    }
                    const { userInfo, flags } = processData(rawData)

                    const newData = {
                        data_json: JSON.stringify(userInfo)
                    }

                    res.updateData(user, newData).then(results => {
                        if (results.affectedRows == 1) {
                            createSignInImg({
                                userId,
                                groupId,
                                nickname,
                                data: userInfo,
                                flags
                            }).then(value => {
                                res.sendMsg({
                                    groupId,
                                    imgUrl: `signIn/temp/${groupId}and${userId}.jpg`
                                })
                            })
                        }
                    })
                }
            })
        } else {
            const result = results[0]
                // console.log(results);
            let rawData
            if (!result['data_json']) {
                rawData = {
                    exp: 0, // 经验
                    level: 1, // 等级
                    coins: 0, // 硬币
                    checkInStatus: false, // 签到状态
                    checkInDays: 0, // 连续天数
                    notCheckInDays: 0, // 未签到天数
                    checkInRecords: 0, // 上次连续记录
                    goods: { g1: 0, g2: 0, g3: 0, g4: 0 }, // 我的商品
                    double: false, // 是否开启双倍经验
                    master: false, // 是否是主人
                }
            } else {
                rawData = JSON.parse(result['data_json'])
            }


            const { userInfo, flags } = processData(rawData)
                // console.log(userInfo);

            const newData = {
                data_json: JSON.stringify(userInfo)
            }

            res.updateData(user, newData).then(results => {
                if (results.affectedRows == 1) {
                    createSignInImg({
                        userId,
                        groupId,
                        nickname,
                        data: userInfo,
                        flags
                    }).then(value => {
                        res.sendMsg({
                            groupId,
                            imgUrl: `signIn/temp/${groupId}and${userId}.jpg`
                        })
                    })
                }
            })



        }
    })


}
module.exports.signIn = signIn