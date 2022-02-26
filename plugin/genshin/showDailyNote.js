const { GenshinKit } = require('@genshin-kit/core')
const App = new GenshinKit()
const path = require('path')
const imgPath = path.join(__dirname, '../../../../data/images/genshin')


const request = require('request')
const fs = require('fs')
const sharp = require('sharp')
    // const cookie = 'ltoken=0ZHpVi86Yqk35x2Goqqf6bh0AKDbJ5H4gldzgBPW; ltuid=284220871; cookie_token=JNpoY9BKz3iFa69VRw8lWv8fCQ7STKEMjo5jAipb; account_id=284220871'
    // const cookie = 'mi18nLang=zh-cn; _MHYUUID=f9f0e9a0-969f-46fb-a952-c9d956970507; _ga=GA1.2.222024202.1644204292; _gid=GA1.2.624331052.1644204293; _ga_Q3LKDGYS1J=GS1.1.1644204291.1.1.1644204308.0; UM_distinctid=17ed3dab9f1af-0bad72a7827eb8-f791539-144000-17ed3dab9f2bf4; CNZZDATA1275023096=1477200358-1644231204-%7C1644231204; ltoken=0ZHpVi86Yqk35x2Goqqf6bh0AKDbJ5H4gldzgBPW; ltuid=284220871; cookie_token=JNpoY9BKz3iFa69VRw8lWv8fCQ7STKEMjo5jAipb; account_id=284220871'

const { db } = require('../../../db/createDB')

const data = require('./data')



module.exports.showDailyNote = (body, res) => {

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
            App.getDailyNote(uid)
                .then(data => {
                    res.sendMsg({
                        msg: dailyNoteFormat(data,userId),
                        groupId
                    })

                })
                .catch(err => {
                    res.sendMsg({
                        msg: err['message'],
                        groupId

                    })
                })
        } else {
            res.sendMsg({
                msg: '未查找到信息,请私聊智乃回复"原神"绑定uid',
                groupId
            })

        }
    })
}


function dailyNoteFormat(data,userId) {

    const {
        current_resin,
        max_resin,
        resin_recovery_time,
        finished_task_num,
        total_task_num,
        is_extra_task_reward_received,
        remain_resin_discount_num,
        resin_discount_num_limit,
        current_expedition_num,
        max_expedition_num,
        expeditions,
        current_home_coin,
        max_home_coin,
        home_coin_recovery_time,
    } = data

    function getTime(t) {
        // let newTime = t * 1000 + new Date().getTime()
        // return new Date(newTime)
        let sec = t % 60
        sec = sec < 10 ? '0' + sec : sec
        let min = Math.floor(t / 60) % 60
        min = min < 10 ? '0' + min : min
        let hour = Math.floor(t / 3600)
        hour = hour < 10 ? '0' + hour : hour

        return `${hour}小时${min}分钟${sec}秒`
    }

    const expeditionList = []

    for (let i = 0; i < expeditions.length; i++) {
        const item = expeditions[i]
        const reg = /UI_AvatarIcon_Side_([a-zA-Z]+).png/
        const name = item['avatar_side_icon'].match(reg)[1]
        const time = getTime(item['remained_time'])
        const str = `  ${name}: ${time}`

        expeditionList.push(str)
    }


    return [
	`[CQ:at,qq=${userId}] 当前状态`,
        `树脂:${current_resin}/${max_resin}`,
        `树脂回复时间:${getTime(resin_recovery_time)}`,
        `每日委托:${finished_task_num}/${total_task_num}`,
        `每日委托奖励:${is_extra_task_reward_received?'已领取':'未领取'}`,
        `消耗减半次数:${remain_resin_discount_num}/${resin_discount_num_limit}`,
        `探索派遣:${current_expedition_num}/${max_expedition_num}`,
        ...expeditionList,
        `洞天宝钱:${current_home_coin}/${max_home_coin}`,
        `洞天宝钱回复时间:${getTime(home_coin_recovery_time)}`,
    ].join('\n')


}

// console.log(dailyNoteFormat(data));
