const schedule = require('node-schedule');
const { db } = require('../../db/createDB')


const resetSignIn = () => {
    //每分钟的第30秒定时执行一次:
    `
    * * * * * *
    ┬ ┬ ┬ ┬ ┬ ┬
    │ │ │ │ │ |
    │ │ │ │ │ └ day of week (0 - 7) (0 or 7 is Sun)
    │ │ │ │ └───── month (1 - 12)
    │ │ │ └────────── day of month (1 - 31)
    │ │ └─────────────── hour (0 - 23)
    │ └──────────────────── minute (0 - 59)
    └───────────────────────── second (0 - 59, OPTIONAL)
    `
    schedule.scheduleJob('0 0 0 * * *', () => {


        // const rawData = {

        //      master: false // 是否是主人

        //     checkInStatus: false, // 签到状态

        //     checkInDays: 0, // 连续天数

        //     notCheckInDays: 0, // 未签到天数
        //     checkInRecords: 0, // 上次连续记录


        // }



        // 如果未签到，天数改为0
        const sqlStr1 = "UPDATE qq_robot SET data_json = JSON_SET(data_json, '$.checkInDays',0,'$.notCheckInDays',(json_extract(data_json, '$.notCheckInDays') + 1)) WHERE data_json->'$.checkInStatus'=false"
            // 将最高记录归零
        const sqlStr2 = "UPDATE qq_robot SET data_json = JSON_SET(data_json, '$.checkInRecords', 1) WHERE data_json->'$.notCheckInDays'=2"
            // 将 签到状态 和 主人卡 重置
        const sqlStr3 = "UPDATE qq_robot SET data_json = JSON_SET(data_json, '$.checkInStatus', false, '$.master', false)"

        db.query(sqlStr1, (err, results) => {
                // return
                if (err) {
                    return console.log('重置天数和主人失败' + new Date(), err);
                }
                console.log('重置天数和主人成功');
                db.query(sqlStr2, (err, results) => {
                    if (err) { return console.log('重置最高记录失败' + new Date()); }

                    console.log('重置最高记录成功');
                    db.query(sqlStr3, (err, results) => {
                        if (err) { return console.log('重置签到状态失败' + new Date()); }

                        console.log('重置签到状态成功');
                    })
                })
            })
            // console.log('签到情况重置' + new Date());
    });
}

module.exports = resetSignIn