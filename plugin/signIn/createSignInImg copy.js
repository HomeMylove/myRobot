const sharp = require('sharp')
const { judgeTime } = require('./judgeTime')
const path = require('path')
const fs = require('fs')

const imgPath = path.join(__dirname, '../../../data/images/signIn')


/**
 * 
 * @param {object} userInfo 传入生成图片需要的用户参数
 * @param {int} userInfo.groupId 群组id，用于生成图片名称
 * @param {int} userInfo.userId 用户id，用于生成图片名称
 * @param {string} userInfo.nickname 用户名，出现在图片上
 */
async function createSignInImg(userInfo) {
    // const rawData = {
    //     exp: 18, // 经验
    //     level: 10, // 等级
    //     coins: 100, // 硬币
    //     checkInStatus: false, // 签到状态
    //     checkInDays: 10, // 连续天数
    //     notCheckInDays: 0, // 未签到天数
    //     checkInRecords: 10, // 上次连续记录
    //     goods: { g1: 0, g2: 0, g3: 0, g4: 0 }, // 我的商品
    //     double: true, // 是否开启双倍经验
    //     master: false // 是否是主人
    // }
    const {
        userId,
        groupId,
        nickname,
        data,
        flags
    } = userInfo

    const width = 1854
    const height = 759


    const { greeting, date } = judgeTime()
    const { exp, level, checkInDays } = data

    const { checkIn, double } = flags

    let result
    if (checkIn) {
        result = '已经签到过啦'
    } else {
        let add = checkInDays <= 10 ? Math.ceil(checkInDays / 2) : 5
        if (double) {
            result = `经验+${add}*2 金币+${add*10}`
        } else {
            result = `经验+${add} 金币+${add*10}`
        }
    }

    const bar = Math.ceil(exp * 0.6)


    const svgImage = `
        <svg width="${width}" height="${height}">
        <style>
        <font>
        <font-face font-family="SimSun SimHei YouYuan"/>
        </font>
        .title{
            fill:black;
            font-size:200px;
            font-weight:400;
            font-family:"SimHei"
        }
        .content{
            fill:rgb(33,33,33);
            font-size:60px;
            font-weight:100;
            font-family:"YouYuan"
        }
        </style>
        <text x="10%" y="30%"  class="title" >${greeting}</text>
        <text x="65%" y="30%"  class="title" >${date}</text>
        <text x="10%" y="45%"  class="content" >@${nickname} ${result}</text>
        <text x="10%" y="59%"  class="content" >已连续签到${checkInDays}天</text>
        <text x="10%" y="73%"  class="content" >LEVEL:${level}</text>

        <rect x="10%" y="78%" width="60%" height="14%" fill="rgb(151, 151, 151)"/>
        <rect x="10%" y="78%" width="${bar}%" height="14%" fill="rgb(102, 102, 102)"/>
        <text x="73%" y="88%" class="content">${exp}/100</text>
        </svg>
        `

    const svgBuffer = Buffer.from(svgImage)
        // const num = Math.ceil(Math.random() * 10)
    const files = fs.readdirSync(path.join(imgPath, '/background'))

    // console.log(files);
    const imgName = files[Math.floor(Math.random() * files.length)]



    // return
    await sharp(path.join(imgPath, `/background/${imgName}`))
        .resize({
            width: 1854,
            height: 1088
        })
        .extend({
            bottom: 759,
            background: {
                r: 255,
                g: 255,
                b: 255,
                alpha: 1
            }
        })
        .composite([{
            input: svgBuffer,
            top: 1088,
            left: 0
        }])
        .toFile(path.join(imgPath, `/${groupId}and${userId}.jpg`))

}

module.exports.createSignInImg = createSignInImg