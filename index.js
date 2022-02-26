const app = require('./app')


// 全局函数
// 重置数据库
const resetSignIn = require('./plugin/signIn/resetSignIn')
resetSignIn()

app.use((req, res, next) => {
    res.send('ok')
    next()
})

const config = require('./config')

const nickNames = [config.robotName, ...config.robotNicknames]

app.use((req, res, next) => {


    let body = req['body']
    let groupId = body['group_id']


    let rawMsg = body['raw_message']

    if (rawMsg.indexOf('小乃子') == 0) {
        return res.sendMsg({
            groupId,
            imgUrl: 'mc/cry.jpg'
        })
    }


    /**
     * @function 获取语句中的起始名字
     * @param {String} rawMsg 原始语句
     * @returns 
     */
    res.nick = rawMsg => {

        let name = ''


        for (let i = 0; i < nickNames.length; i++) {

            let item = nickNames[i]

            if (rawMsg.indexOf(item) == 0 && item.length >= name.length) {



                name = item


                // console.log(name, i);

            }

        }

        return name

    }

    next()
})



// 帮助
const help = require('./plugin/help')
app.use(help)

const plugins = require('./plugin/index')








// callName
app.use(plugins.callName)

app.use(plugins.diceGame)

app.use(plugins.signIn)

app.use(plugins.randomAPI)

app.use(plugins.makePoem)

app.use(plugins.genshin)


const { reply } = require('./reply')

app.use((req, res, next) => {

    let body = req['body']
    let groupId = body['group_id']
    let rawMsg = body['raw_message']

    // console.log(rawMsg);

    let nick = res.nick(rawMsg)

    if (nick) {
        rawMsg = rawMsg.replace(nick, '').trim()

        for (let key in reply) {
            if (rawMsg == key) {
                console.log('确实有这句话');
                return res.sendMsg({
                    groupId,
                    ...reply[key]
                })
            }
        }
    }



    if (rawMsg == 'words') {

        const words = []

        for (let key in reply) {
            words.push(' 智乃' + key)
        }

        words.sort((a, b) => {
            return a.length - b.length
        })

        words.unshift('也许你可以对我说:')

        return res.sendMsg({
            groupId,
            msg: words.join('\n')
        })
    }












    next()
})


app.use(plugins.echo)


// 复读机
app.use(plugins.repeater)


// 自动回复
// app.use(plugins.autoChat)



















app.post('/', (req, res) => {
    let body = req.body
    let rawMsg = body['raw_message']
    console.log(rawMsg);
})


// 监听5701端口
app.listen(5701, () => {
    console.log('express server is running at 127.0.0.1');
})