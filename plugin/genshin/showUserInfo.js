const { GenshinKit } = require('@genshin-kit/core')
const App = new GenshinKit()
const path = require('path')
const imgPath = path.join(__dirname, '../../../../data/images/genshin')


const request = require('request')
const fs = require('fs')
const sharp = require('sharp')
    // const cookie = 'ltoken=0ZHpVi86Yqk35x2Goqqf6bh0AKDbJ5H4gldzgBPW; ltuid=284220871; cookie_token=JNpoY9BKz3iFa69VRw8lWv8fCQ7STKEMjo5jAipb; account_id=284220871'
    // const cookie = 'mi18nLang=zh-cn; _MHYUUID=f9f0e9a0-969f-46fb-a952-c9d956970507; _ga=GA1.2.222024202.1644204292; _gid=GA1.2.624331052.1644204293; _ga_Q3LKDGYS1J=GS1.1.1644204291.1.1.1644204308.0; UM_distinctid=17ed3dab9f1af-0bad72a7827eb8-f791539-144000-17ed3dab9f2bf4; CNZZDATA1275023096=1477200358-1644231204-%7C1644231204; ltoken=0ZHpVi86Yqk35x2Goqqf6bh0AKDbJ5H4gldzgBPW; ltuid=284220871; cookie_token=JNpoY9BKz3iFa69VRw8lWv8fCQ7STKEMjo5jAipb; account_id=284220871'

const { db } = require('../../../db/createDB')



module.exports.showUserInfo = function(body, res) {

    const groupId = body['group_id']
    const rawMsg = body['raw_message']
    const userId = body['user_id']
    const nickname = body['sender']['card'] || body['sender']['nickname'] // 对方的昵称



    if (rawMsg.toLowerCase().indexOf('uid') == 0) {
        const reg = /\d+/g
        const uid = rawMsg.match(reg)[0]
            // 查找
        const sqlStr = 'SELECT * FROM genshin WHERE uid=?'
        db.query(sqlStr, [uid], (err, results) => {
            if (err) return res.sendMsg({
                msg: err,
                groupId
            })
            if (results.length > 0) {

                const { uid, cookie } = results[0]
                const user = { uid, cookie }
                    // console.log(user);
                    // console.log(uid);


                App.loginWithCookie(cookie)

                App.getUserInfo(uid).then(data => {
                    // console.log(data)
                    // const data = require('./data')
                    const { avatars } = data
                    downloadImg(avatars)

                    setTimeout(() => {
                        createGenshin(data, nickname, uid).then(() => {
                            // console.log(123);
                            res.sendMsg({
                                groupId,
                                imgUrl: `genshin/temp/${uid}userinfo.png`
                            })
                        })
                    }, 1000)


                }).catch(err => {
                    res.sendMsg({
                        msg: err['message'],
                        groupId

                    })
                })
            } else {
                res.sendMsg({
                    msg: '未查找到信息,请私聊智乃回复"原神"绑定uid',
                    groupId
                })

            }
        })
    } else {
        const sqlStr = 'SELECT * FROM genshin WHERE user_id=?'
        db.query(sqlStr, [userId], (err, results) => {
            if (err) return res.sendMsg({
                msg: err,
                groupId
            })
            if (results.length > 0) {

                const { uid, cookie } = results[0]
                const user = { uid, cookie }


                App.loginWithCookie(cookie)

                App.getUserInfo(uid).then(data => {
                    // console.log(data)
                    // const data = require('./data')
                    const { avatars } = data
                    downloadImg(avatars)

                    setTimeout(() => {
                        createGenshin(data, nickname, uid).then(() => {
                            // console.log(123);
                            res.sendMsg({
                                groupId,
                                imgUrl: `genshin/temp/${uid}userinfo.png`
                            })
                        })
                    }, 1000)


                }).catch(err => {
                    res.sendMsg({
                        msg: err['message'],
                        groupId

                    })
                })
            } else {
                res.sendMsg({
                    msg: '未查找到信息,请私聊智乃回复"原神"绑定uid',
                    groupId
                })

            }
        })
    }
}

// 下载网络图片
function downloadImg(avatars) {
    avatars.forEach(item => {
        if (fs.existsSync(path.join(imgPath, `roles/${item['name']}.png`))) return

        let url = item['image']
        request(url).pipe(
            fs.createWriteStream(path.join(imgPath, `roles/${item['name']}old.png`))
            .on('close', () => {

                sharp(path.join(imgPath, `roles/${item['name']}old.png`))
                    .resize({
                        width: 165,
                    })
                    .toFile(path.join(imgPath, `roles/${item['name']}.png`))
            })
        )
    })
}


async function createGenshin(data, nickname, uid) {
    const { avatars } = data

    // 创建每个角色
    avatars.forEach(item => {
        createRoles(item, uid)
    })

    // console.log('创建角色成功');


    // 组合列表
    const backgroundList = []


    const svgData = drawData(data, nickname, uid)

    backgroundList.push(svgData)

    for (let i = 0; i < avatars.length; i++) {
        // 添加一行
        if (i % 6 == 0) {
            const line = {
                input: path.join(imgPath, 'background/line.png'),
                top: 1173 + 338 * (Math.floor(i / 6)),
                left: 0
            }
            backgroundList.push(line)
        }

        // 放入角色
        const role = {
            input: path.join(imgPath, `temp/${avatars[i]['name']}${uid}.png`),
            top: 1173 + 338 * (Math.floor(i / 6)),
            left: 110 + (i % 6) * 186
        }
        backgroundList.push(role)
    }

    // 放入尾部
    backgroundList.push({
        input: path.join(imgPath, 'background/bottom.png'),
        top: 1173 + 338 * (Math.ceil(avatars.length / 6)),
        left: 0
    })


    // 合成
    await sharp(path.join(imgPath, 'background/top.png'))
        .extend({
            // 扩展高度    行高 * 行数 + 尾部
            bottom: 338 * (Math.ceil(avatars.length / 6)) + 102,
            background: {
                r: 255,
                g: 255,
                b: 255,
                alpha: 1
            }
        }).composite(backgroundList).toFile(path.join(imgPath, `temp/${uid}userinfo.png`))

}




async function createRoles(role, uid) {
    const width = 186
    const height = 338
    const { name, fetter, level, actived_constellation_num } = role

    const svgImage = `
    <svg width="${width}" height="${height}">
    <style>
    <font>
    <font-face font-family="SimSun SimHei YouYuan"/>
    </font>
    .common{
        font-family:"SimHei"
    }
    .name{
        font-size:20px;
        font-weigt:800;
    }
    .ming{
        font-size:18px;
        font-weigt:800;
    }
    .level,
    .fetter{
        font-size:22px;
        font-weight:800
    }
    .level{
        fill:rgb(15, 165, 86)
    }
    .fetter{
        fill:rgb(232, 31, 168)
    }
    </style>
    <text x="52%" y="66%" text-anchor="middle" class="common name" >${name}</text>
    <text x="52%" y="73%" text-anchor="middle" class="common ming" >命之座:${actived_constellation_num}层</text>
    <text x="42%" y="82%" text-anchor="middle" class="common level">LV.${level}</text>
    <text x="76%" y="82%" text-anchor="middle" class="common fetter">${fetter}</text>
    </svg>
    `

    const svgBuffer = Buffer.from(svgImage)

    await sharp(path.join(imgPath, `background/space.png`))
        .composite([{
            input: path.join(imgPath, `roles/${role['name']}.png`),
            top: 15,
            left: 15
        }, {
            input: svgBuffer,
            top: 0,
            left: 0
        }]).toFile(path.join(imgPath, `temp/${role['name']}${uid}.png`))
}


// 将 stats 数据绘制到图片
function drawData(data, nickname, uid) {
    const { stats, world_explorations } = data

    nickname = nickname.length < 8 ? nickname : nickname.substring(0, 8) + '...'

    const width = 1356
    const height = 1173

    const {
        active_day_number, // 活跃天数
        achievement_number, // 成就数
        win_rate,
        anemoculus_number, // 风神瞳
        geoculus_number,
        avatar_number, // 角色数
        way_point_number,
        domain_number,
        spiral_abyss,
        precious_chest_number,
        luxurious_chest_number,
        exquisite_chest_number,
        common_chest_number,
        electroculus_number,
        magic_chest_number
    } = stats

    const world = {}

    world_explorations.forEach(item => {
        world[item['name']] = item
    })


    const svgImage = `
    <svg width="${width}" height="${height}">
    <style>
    <font>
    <font-face font-family="SimSun SimHei YouYuan"/>
    </font>
    .common{
        font-family:"SimHei";
        font-size:42px;
        font-weight:900;
    }

    .white{
        font-family:"SimHei";
        font-size:38px;
        font-weight:900;
        fill:rgb(255,255,255)
    }
    .nickname{
        font-family:"SimHei";
        font-size:36px;
        font-weight:900;
    }
    .uid{
        font-family:"SimHei";
        font-size:28px;
        font-weight:900;
        fill:rgb(60, 175, 109)
    }
    
    </style>
    <text x="320" y="358" text-anchor="middle" class="nickname">${nickname}</text>
    <text x="320" y="390" text-anchor="middle" class="uid">UID:${uid}</text>


    <text x="566" y="153" text-anchor="middle" class="common">${active_day_number}</text>
    <text x="730" y="153" text-anchor="middle" class="common">${achievement_number}</text>
    <text x="888" y="153" text-anchor="middle" class="common">${avatar_number}</text>
    <text x="1050" y="153" text-anchor="middle" class="common">${spiral_abyss}</text>

    <text x="570" y="256" text-anchor="middle" class="common">${luxurious_chest_number}</text>
    <text x="730" y="256" text-anchor="middle" class="common">${precious_chest_number}</text>
    <text x="886" y="256" text-anchor="middle" class="common">${exquisite_chest_number}</text>
    <text x="1046" y="256" text-anchor="middle" class="common">${common_chest_number}</text>

    <text x="570" y="358" text-anchor="middle" class="common">${magic_chest_number}</text>
    <text x="715" y="358" text-anchor="middle" class="common">${anemoculus_number}</text>
    <text x="875" y="358" text-anchor="middle" class="common">${geoculus_number}</text>
    <text x="1035" y="358" text-anchor="middle" class="common">${electroculus_number}</text>


    <text x="420" y="550" class="white">${world['蒙德']['exploration_percentage']/10}%</text>
    <text x="420" y="607" class="white">${world['蒙德']['level']}</text>

    <text x="420" y="740" class="white">${world['龙脊雪山']['exploration_percentage']/10}%</text>
    <text x="420" y="797" class="white">${world['龙脊雪山']['level']}</text>

    <text x="420" y="930" class="white">${world['璃月']['exploration_percentage']/10}%</text>
    <text x="420" y="987" class="white">${world['璃月']['level']}</text>

    <text x="1000" y="550" class="white">${world['稻妻']['exploration_percentage']/10}%</text>
    <text x="1000" y="607" class="white">${world['稻妻']['level']}</text>

    <text x="1000" y="772" class="white">${world['渊下宫']['exploration_percentage']/10}%</text>
    
    
    </svg>
    `

    return {
        input: Buffer.from(svgImage),
        top: 0,
        left: 0
    }
}