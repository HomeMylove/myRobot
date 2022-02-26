/**
 * 
 * @param {object} rawData 签到情况的原始数据
 * @param {int} rawData.sign_in 签到情况
 * @param {int} rawData.exp 当前经验
 * @param {int} rawData.days 连续签到天数
 * @returns 
 */
function processData(rawData) {
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
    //     master: false, // 是否是主人
    //     fortune: 0,
    // }
    let { checkInStatus, exp, checkInDays, double, coins } = rawData
    let flags
    let userInfo

    if (!rawData['fortune']) {
        rawData['fortune'] = Math.ceil(Math.random() * 10)
    }

    if (checkInStatus) {
        flags = {
            checkIn: true,
            double
        }
        userInfo = rawData
        return {
            flags,
            userInfo
        } // 已经签到

    } else {
        // 改为已签到
        checkInStatus = true

        // 计算运势
        rawData['fortune'] = Math.ceil(Math.random() * 10)

        flags = {
            checkIn: false,
            double
        }

        // 签到次数+1
        checkInDays++
        // 每天都签到
        if (!rawData['notCheckInDays']) {
            // 历史次数+1
            rawData['checkInRecords']++
        }

        rawData['notCheckInDays'] = 0

        //增加经验
        let extra = double ? 2 : 1
        if (checkInDays <= 10) {
            exp = exp + Math.ceil((checkInDays / 2)) * extra
            coins = coins + Math.ceil((checkInDays / 2)) * 10
        } else {
            exp = exp + 5 * extra
            coins = coins + 5 * 10
        }

        if (exp >= 100) {
            rawData['level']++;

            exp = exp - 100
        }

        rawData['double'] = false

        userInfo = {...rawData, checkInStatus, exp, checkInDays, double, coins }



    }
    return { userInfo, flags }
}



module.exports.processData = processData