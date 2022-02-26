const funs = require('./index')
const { robotName } = require('../config')


// 总列表,包含方法 和 格式
const helpList = []

for (let key in funs) {

    // console.log(key);
    const help = funs[key]['__help']

    if (help) {
        for (let i = 0; i < help.length; i++) {

            helpList.push(help[i])
        }
    }

}

// console.log(helpList);

// 打印功能列表
const functionList = []
const first = `${robotName}目前实现的功能:`
functionList.push(first)
for (let i = 0; i < helpList.length; i++) {
    const item = helpList[i]
    const status = item[item.length - 1] ? '● ' : '○ '
    functionList.push(' ' + status + (i + 1) + ' ' + item[0])
}
const last = `详情请回复\n  帮助 + 序号 | 帮助 + 功能名`
functionList.push(last)




module.exports = (req, res, next) => {
    let body = req['body']
    let groupId = body['group_id']
    let rawMsg = body['raw_message']

    if (rawMsg == '帮助') {
        return res.sendMsg({
            groupId,
            msg: functionList.join('\n')
        })
    } else if (rawMsg.indexOf('帮助') == 0) {
        const newMsg = rawMsg.replace('帮助', '').trim()
        let num = Number(newMsg)
        if (num) {
            if (num > 0 && num <= helpList.length) {
                if (!helpList[num - 1][2]) {
                    return res.sendMsg({
                        groupId,
                        msg: '本群尚未开启该功能'
                    })
                }

                const str = helpList[num - 1][0] + ' 格式\n' + helpList[num - 1][1]
                res.sendMsg({
                    groupId,
                    msg: str
                })
            } else {
                res.sendMsg({
                    groupId,
                    msg: '错误,请输入正确的序号'
                })
            }
        } else {
            for (let i = 0; i < helpList.length; i++) {
                const item = helpList[i]
                if (item[0] == newMsg) {
                    if (!item[2]) {
                        return res.sendMsg({
                            groupId,
                            msg: '本群尚未开启该功能'
                        })
                    }
                    return res.sendMsg({
                        groupId,
                        msg: item[0] + ' 格式\n' + item[1]
                    })
                }
            }

            return res.sendMsg({
                groupId,
                msg: '错误,请输入正确的名称'
            })


        }

    }








    next()
}