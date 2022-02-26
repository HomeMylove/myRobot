const axios = require('axios')


/**
 * @function 获取一张壁纸
 * @param {object} body 
 * @param {object} res 使用res上的方法
 */


function getWallpaper(body, res) {
    const groupId = body['group_id'] // 群组的id
    const rawMsg = body['raw_message']

    const keyWord = rawMsg.replace('随机壁纸', '').trim()

    const list = ['美女', '汽车', '二次元', '背景', '动漫']

    const apis = {
        '二次元动漫': 'https://www.dmoe.cc/random.php?return=json',
        'others': `https://api.uomg.com/api/rand.img1?sort=$name&format=json`
    }

    let url
    if (list.indexOf(keyWord) !== -1) {
        url = apis['others'].replace('$name', keyWord)
    } else {
        url = apis['二次元动漫']
    }

    // https://api.ixiaowai.cn/api/api.php?return=json

    url = encodeURI(url)

    axios.get(url).then(response => {

        // console.log(response);


        const imgUrl = response['data']['imgurl']

        res.sendMsg({
            groupId,
            imgUrl
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


module.exports.getWallpaper = getWallpaper