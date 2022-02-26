const config = require('../../config')


module.exports.rememberMyName = (body, res) => {
    const rawMsg = body['raw_message']
    const groupId = body['group_id']
    const userId = body['sender']['user_id']

    let name = rawMsg.replace(`以后叫我`, '').trim()

    if (name.length >= 40) {
        return res.sendMsg({
            groupId,
            msg: '这么长智乃这么记得住嘛'
        })
    }

    // 屏蔽词
    const BANNED_WORD = ['爸', '爹', '爷', '祖宗']

    if (name === '主人' && userId != config.SUPERUSER) {
        return res.sendMsg({
            groupId,
            msg: `抱歉,${config.robotName}只有一个主人,你再这么说我可要生气了`,
            imgUrl: 'chino/okoru.jpg'
        })
    } else if (BANNED_WORD.find(item => rawMsg.indexOf(item) !== -1)) {
        return res.sendMsg({
            groupId,
            msg: `请不要欺负${config.robotName},不然${config.robotName}会把你加入黑名单哦`,
            imgUrl: 'chino/okoru.jpg'
        })
    }


    // 正常情况
    const user = {
            user_id: userId,
            group_id: groupId,
        }
        // 看看有没有 name

    res.selectData(user).then(results => {
        if (results.length == 1) {
            res.updateData(user, { name }).then(results => {
                if (results.affectedRows === 1) {
                    if (name === '主人') {
                        return res.sendMsg({
                            groupId,
                            msg: '好的主人,我...我记住啦'
                        })
                    }
                    if (name.length <= 3) {
                        name = [...name].join('~') + '~'
                    }
                    const msg = `${config.robotName}记住了，以后我就叫你${name}啦`
                    res.sendMsg({
                        groupId,
                        msg
                    })
                }
            })
        } else {
            res.insertData({...user, name }).then(results => {
                if (results.affectedRows === 1) {
                    if (name === '主人') {
                        return res.sendMsg({
                            groupId,
                            msg: '好的主人,我...我记住啦'
                        })
                    }
                    if (name.length <= 3) {
                        name = [...name].join('~') + '~'
                    }
                    const msg = `${config.robotName}记住了，以后我就叫你${name}啦`
                    res.sendMsg({
                        groupId,
                        msg
                    })
                }
            })
        }
    })

}