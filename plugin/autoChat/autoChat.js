const axios = require('axios')


module.exports.autoChat = (body, res) => {

    let rawMsg = body['raw_message']

    const groupId = body['group_id']

    // 请求api
    rawMsg = encodeURI(rawMsg)
    axios.get(`http://api.qingyunke.com/api.php?key=free&appid=0&msg=${rawMsg}`).then(response => {

        // 成功
        let msg = response['data']['content']

        // 替换 {br} 为换行符
        msg = msg.replace(/\{br\}/g, '\n').replace(/菲菲/g, '智乃')

        let reg = /\{face:([0-9]+)\}/
        const result = msg.match(reg)

        if (result) msg = msg.replace(reg, `[CQ:face,id=${result[1]}]`)

        res.sendMsg({
            groupId,
            msg
        })
    }).catch(error => {
        console.error(error);
        res.sendMsg({
            groupId,
            msg: '没听懂你在说什么'
        })
    })

}