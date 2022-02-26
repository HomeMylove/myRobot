const axios = require('axios')


/**
 * @function 舔狗日记
 * @param {object} body 
 * @param {object} res 使用res上的方法
 */


function flattererDiary(body, res) {
    const groupId = body['group_id'] // 群组的id

    const rawMsg = body['raw_message']

    const reg = /舔(.*?)日记/

    const keyword = rawMsg.match(reg)[1]

    const apis = {
        '舔狗日记': 'https://api.ixiaowai.cn/tgrj/index.php'
    }

    let url = apis['舔狗日记']


    url = encodeURI(url)

    axios.get(url).then(response => {

        // console.log(response);

        let msg
        if (keyword == '狗' || keyword == '') {
            msg = response['data']
        } else {
            msg = response['data'].replace(/你/g, keyword)
        }

        // return
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

module.exports.flattererDiary = flattererDiary