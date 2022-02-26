const axios = require('axios')

module.exports.makePoem = (body, res) => {
    // 判断 关键词 出现的次数
    let rawMsg = body['raw_message']

    const groupId = body['group_id'] // 群组的id

    rawMsg = rawMsg.replace('藏头诗', '').trim()

    const reg = /\((\S+)\)/
        // let ab = rawMsg.substring(rawMsg.length - 2)

    let ab = rawMsg.match(reg)
        // console.log(rawMsg);
        // console.log(me);

    let msg, a, b

    if (ab) {
        msg = rawMsg.replace(ab[0], '')

        a = ab[1].indexOf('尾') !== -1 ? 0 : 1
        b = ab[1].indexOf('7') !== -1 ? 7 : 5
    } else {
        msg = rawMsg
        a = 1
        b = 5
    }


    let url = `http://api.wpbom.com/api/betan.php?msg=${msg}&a=${a}&b=${b}`
    http: //api.wpbom.com/api/betan.php?msg=我稀罕你&a=0&b=7

        url = encodeURI(url)

    axios.get(url).then(response => {

        // console.log(response);

        const msg = response['data'] || '作不出来,是不是太长了'

        res.sendMsg({
            groupId,
            msg
        })
    }).catch(error => {
        console.log(error)
        res.sendMsg({
            groupId,
            msg: '好像出了点儿问题'
        })
        console.error(error);
    })


}