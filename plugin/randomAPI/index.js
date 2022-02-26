const { getWallpaper } = require('./getWallpaper')
const { flattererDiary } = require('./flattererDiary')

const stauts = true

module.exports = (req, res, next) => {
    let body = req['body']
        // console.log(res);
        // console.log(body);
    let groupId = body['group_id']
    if (!stauts) {
        return res.sendMsg({
            groupId,
            msg: '本群未开启该功能'
        })
    }

    let rawMsg = body['raw_message']

    if (rawMsg.indexOf('随机壁纸') === 0) {
        return getWallpaper(body, res)
    } else if (rawMsg[0] == '舔' && rawMsg.substring(rawMsg.length - 2) == '日记') {
        return flattererDiary(body, res)
    }

    next()
}


module.exports.__help = [
    ['随机壁纸', '随机壁纸 美女|汽车|二次元|背景|动漫 (默认二次元)', stauts],
    ['舔狗日记', '舔狗日记 | 舔主人日记', stauts]
]