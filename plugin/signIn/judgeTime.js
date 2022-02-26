/**
 * @function 根据当前时间返回问候语
 * @returns {object} 
 */
function judgeTime() {
    const time = new Date()

    const hour = time.getHours()
    const min = time.getMinutes() / 60
    const month = time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1
    const day = time.getDate() < 10 ? '0' + time.getDate() : time.getDate()
        // console.log(hour + min);

    // 获得一个数字用于表示时间
    const hourMin = hour + min
        // console.log(hourMin);
    let greeting
    if ((0 < hourMin) && (hourMin <= 6.5)) {
        greeting = '凌晨好'
    } else if ((6.5 < hourMin) && (hourMin <= 8)) {
        greeting = '早上好'
    } else if ((8 < hourMin) && (hourMin <= 11.5)) {
        greeting = '上午好'
    } else if ((11.5 < hourMin) && (hourMin <= 14)) {
        greeting = '中午好'
    } else if ((14 < hourMin) && (hourMin <= 17.5)) {
        greeting = '下午好'
    } else {
        greeting = '晚上好'
    }

    return {
        greeting,
        date: `${month}/${day}`
    }

}

module.exports.judgeTime = judgeTime