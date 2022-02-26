const { cookie } = require('request')
const { db } = require('../../../db/createDB')



module.exports.getUidCookie = (body, res) => {
    const rawMsg = body['raw_message']
    const userId = body['user_id']

    const __help = "uid不应超过9位数\ncookie应包含引号 ' '"

    const user = {
        user_id: userId
    }
    let uid
    let cookie

    if (rawMsg.toLowerCase().indexOf('uid') === 0) {
        const reg = /\d+/g
        uid = rawMsg.match(reg)[0]
        user['uid'] = uid
    } else {
        const reg = /\'(.*)\'/g
        cookie = rawMsg.match(reg)[0]
        user['cookie'] = cookie

    }
    // console.log(user);

    const sqlStr = 'SELECT * FROM genshin WHERE user_id=?'

    db.query(sqlStr, [userId], (err, results) => {
        if (err) return res.sendMsg({
            msg: err,
            userId
        })

        if (results.length !== 1) {
            const sqlStr = 'INSERT INTO genshin SET ?'
            db.query(sqlStr, user, (err, results) => {
                if (err) {
                    return res.sendMsg({
                        msg: '出现错误,请检查uid或cookie是否正确\n' + __help,
                        userId
                    })
                }

                if (results.affectedRows === 1) {
                    return res.sendMsg({
                        msg: uid ? '绑定uid成功' : '绑定cookie成功',
                        userId
                    })
                }
            })
        } else {
            const sqlStr = 'UPDATE genshin SET ? WHERE user_id=?'

            db.query(sqlStr, [user, userId], (err, results) => {
                if (err) {
                    return res.sendMsg({
                        msg: '出现错误,请检查uid或cookie是否正确\n' + __help,
                        userId
                    })
                }

                if (results.affectedRows === 1) {
                    return res.sendMsg({
                        msg: uid ? '更新uid成功' : '更新cookie成功',
                        userId
                    })
                }
            })

        }
    })


}