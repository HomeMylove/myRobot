// 导入配置
const config = require('../../config')
const reply = require('./reply')



module.exports.remindMyName = (body, res) => {
    const groupId = body['group_id']
    const userId = body['sender']['user_id']
    const card = body['sender']['card'] || body['sender']['nickname']

    const user = {
        user_id: userId,
        group_id: groupId
    }

    res.selectData(user).then(results => {
        const rawMsg = body['raw_message']
        const flag = rawMsg === `我是谁` ? true : false
        if (results[0] && results[0]['name']) {
            let name = results[0]['name']

            if (name == '主人') {
                return res.sendMsg({
                    groupId,
                    msg: `${config.robotName}怎么会忘记呢,你是我的主人呀`
                })
            }


            let msg
            if (flag) {
                // 判断名字的长度
                // if (name.length <= 3) {
                //     name = [...name].join('~') + '~'
                // }

                console.log(res.getRandomReply(reply), 'looklook');
                msg = res.getRandomReply(reply[0]).replace(/\$name/g, name)
            } else {
                if (name.length >= 2) {
                    name = name.substring(0, 1) + '...' + name
                }
                msg = res.getRandomReply(reply[1]).replace(/\$name/g, name)
            }
            res.sendMsg({
                groupId,
                msg
            })
        } else {
            const msg = `嗯~~你就是${card}对吧`
            res.sendMsg({ groupId, msg })
        }
    })
}