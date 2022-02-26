const path = require('path')
const fs = require('fs')

const sharp = require('sharp')

const { db } = require('../../db/createDB')


const imgPath = path.join(__dirname, '../../../data/images/genshin/wish')

const star5 = fs.readdirSync(path.join(imgPath, '/character/5star'))
const star4 = fs.readdirSync(path.join(imgPath, '/character/4star'))




// 定义图库
// 三星武器
const weapon3 = fs.readdirSync(path.join(imgPath, '/bar/weapon3'))
    // 当期五星
const event5 = fs.readdirSync(path.join(imgPath, '/bar/event5'))
    // 当期四星
const event4 = fs.readdirSync(path.join(imgPath, '/bar/event4'))
    // 常驻5星
const normal5 = fs.readdirSync(path.join(imgPath, '/bar/normal5'))
    // 常驻4星
const normal4 = fs.readdirSync(path.join(imgPath, '/bar/normal4'))

module.exports.wish = (body, res) => {

    const groupId = body['group_id']
    const userId = body['sender']['user_id'] // 对方的id
    const nickname = body['sender']['card'] || body['sender']['nickname']

    const rawMsg = body['raw_message']

    if (rawMsg == '抽卡') {
        let flag = Math.floor(Math.random() * 2)

        let file = flag ? star4 : star5
        let star = flag ? 4 : 5

        let img = file[Math.floor(Math.random() * file.length)]

        return res.sendMsg({
            groupId,
            imgUrl: `genshin/wish/character/${star}star/${img}`
        })
    } else {

        const sqlStr = 'SELECT * FROM wish WHERE user_id=? AND group_id=?'

        db.query(sqlStr, [userId, groupId], (err, results) => {
            if (err) {
                return res.sendMsg({
                    groupId,
                    msg: '查询错误'
                })
            }
            if (results.length == 1) {

                let data = JSON.parse(results[0]['wish_data'])

                // console.log(typeof data);
                tenWish({
                    data,
                    groupId,
                    userId,
                    nickname
                }).then(data => {

                    const sqlStr = 'UPDATE wish SET ? WHERE user_id=? AND group_id=?'

                    db.query(sqlStr, [{ wish_data: data }, userId, groupId], (err, results) => {
                        if (err) {
                            return res.sendMsg({
                                groupId,
                                msg: '写入错误'
                            })
                        }

                        if (results.affectedRows == 1) {
                            res.sendMsg({
                                groupId,
                                imgUrl: path.join(`genshin/wish/temp/${userId}${groupId}wish.png`)
                            })
                        }
                    })



                })

            } else {
                console.log('没数据');

                const sqlStr = 'INSERT INTO wish SET ?'

                db.query(sqlStr, [{ user_id: userId, group_id: groupId }], (err, results) => {
                    if (err) {
                        return res.sendMsg({
                            groupId,
                            msg: '添加信息错误'
                        })
                    }
                    if (results.affectedRows == 1) {
                        let data = {
                            gNum: 0,
                            total: 0,
                            pNum: 0,
                            gold: false, // 大小保底
                        }

                        tenWish({
                            data,
                            userId,
                            groupId,
                            nickname
                        }).then(data => {

                            const sqlStr = 'UPDATE wish SET ? WHERE user_id=? AND group_id=?'

                            db.query(sqlStr, [{ wish_data: data }, userId, groupId], (err, results) => {
                                if (err) {
                                    return res.sendMsg({
                                        groupId,
                                        msg: '写入错误'
                                    })
                                }

                                if (results.affectedRows == 1) {
                                    res.sendMsg({
                                        groupId,
                                        imgUrl: path.join(`genshin/wish/temp/${userId}${groupId}wish.png`)
                                    })
                                }
                            })



                        })
                    }
                })
            }
        })


    }
}




// module.exports.wish()





// 返回随机图片
function getOneImg(imgArr) {
    return imgArr[Math.floor(Math.random() * imgArr.length)]
}


/**
 * 
 * @param {Number} percent 给出一个概率，返回布尔值
 * @returns 
 */
function judge(percent) {
    const v = percent * 10

    const real = Math.floor(Math.random() * 1000)

    return real < v
}


async function tenWish(userInfo) {

    // 存储一次十连的结果
    const {
        data,
        groupId,
        userId,
        nickname
    } = userInfo

    // console.log(typeof data);

    const result = []



    function ifGold(data) {

        let result

        if (data['gNum'] + 1 <= 73) {

            result = judge(0.6)
        } else {
            result = judge((data['gNum'] + 1 - 73) * 6 + 0.6)
        }

        return result
    }

    function ifPurple(data) {
        let result

        if ((data['pNum'] + 1) % 10 == 0) {
            result = true
        } else if ((data['pNum'] + 1) % 10 <= 8) {
            result = judge(5.1)
        } else {
            result = judge(56.1)
        }

        return result
    }

    // 5 event5
    // 4 normal5
    // 3 event4
    // 2 normal4
    // 1 weapon3

    for (let i = 0; i < 10; i++) {
        if (ifGold(data)) {
            if (data['gold']) { // 大保底
                result.push(5)
                data['gold'] = false
            } else { // 小保底
                if (judge(50)) { // 没歪
                    result.push(5)

                } else {
                    result.push(4) // 歪了
                    data['gold'] = true
                }
            }

            data['gNum'] = 0
        } else if (ifPurple(data)) {
            if (judge(50)) { // 没歪
                result.push(3)

            } else {
                result.push(2) // 歪了
            }
            data['pNum'] = 0
            data['gNum'] = data['gNum'] + 1
        } else {
            result.push(1)
            data['gNum'] = data['gNum'] + 1
            data['pNum'] = data['pNum'] + 1
        }
    }

    data['total'] = data['total'] + 10 || 10

    result.sort((a, b) => b - a)

    // console.log(result);
    const barList = []
    const width = 1920
    const height = 1080

    const svgImage = `
        <svg width="${width}" height="${height}">
        <style>
        <font>
        <font-face font-family="SimSun SimHei YouYuan"/>
        </font>
        .nickname{
            fill:white;
            font-size:75px;
            font-weight:400;
            font-family:"SimHei"
        }
        .data{
            fill:red;
            font-size:50px;
            font-weight:400;
            font-family:"SimHei"
        }
        .info{
            fill:white;
            font-size:50px;
            font-weight:400;
            font-family:"SimHei"
        }
        </style>
        <text x="100" y="100"  class="nickname" >@ ${nickname}</text>
        <text x="150" y="950"  class="info" >当前</text>
        <text x="260" y="950"  class="data" >${data['gNum']}</text>
        <text x="320" y="950"  class="info" >抽未出金</text>
        
        <text x="150" y="1000"  class="info" >总抽数</text>
        <text x="300" y="1000"  class="data" >${data['total']}</text>

        </svg>
        `

    const svgBuffer = Buffer.from(svgImage)

    barList.push({
        input: svgBuffer,
        left: 0,
        top: 0
    })

    for (let i = 0; i < result.length; i++) {
        const item = result[i]

        let img
        let top = 115

        if (item == 5) {
            img = 'bar/event5/' + getOneImg(event5)
        } else if (item == 4) {
            img = 'bar/normal5/' + getOneImg(normal5)
        } else if (item == 3) {
            img = 'bar/event4/' + getOneImg(event4)
        } else if (item == 2) {
            img = 'bar/normal4/' + getOneImg(normal4)
        } else {
            img = 'bar/weapon3/' + getOneImg(weapon3)
            top = 233
        }

        const position = {
            input: path.join(imgPath, img),
            top,
            left: 226 + 147 * i,
        }

        barList.push(position)
    }

    await sharp(path.join(imgPath, '/background/bg.png'))
        .composite(barList)
        .toFile(path.join(imgPath, 'temp', `${userId}${groupId}wish.png`))

    return JSON.stringify(data)
}