const axios = require('axios')


/**
 * @function 发送一条消息
 * @param {object} msgContent 发送的对象
 * @param {int} msgContent.groupId 发送到群组
 * @param {int} msgContent.userId 发送给好友
 * @param {string} msgContent.msg 信息主体
 * @param {string} msgContent.imgUrl 图片url，多张图片请在写在msg中
 */
function sendMsg(msgContent) {

    let { groupId, userId, msg, imgUrl } = msgContent

    msg = msg || ''
    if (imgUrl) msg = msg + `[CQ:image,file=${imgUrl}]`

    msg = encodeURI(msg)

    let path = null

    if (userId) {

        path = `http://127.0.0.1:5700/send_private_msg?user_id=${userId}&message=${msg}&auto_escape=false`

    } else if (groupId) {

        path = `http://127.0.0.1:5700/send_group_msg?group_id=${groupId}&message=${msg}&auto_escape=false`

    } else {
        return
    }
    axios.get(path).then(
        console.log('==============发送成功:=============\n', msg)
    ).catch(error => {
        console.error('==============发送失败:===============\n', error);
    })
}

module.exports = sendMsg