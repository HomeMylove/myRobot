const autoChat = require('./autoChat/index')
const callName = require('./callName/index')
const diceGame = require('./diceGame/index')
const signIn = require('./signIn/index')
const randomAPI = require('./randomAPI/index')
const makePoem = require('./makePoem/index')
const genshin = require('./genshin/index')
const echo = require('./echo/index')


const { repeater } = require('./repeater/repeater')

module.exports = {
    signIn,
    diceGame,
    callName,
    randomAPI,
    autoChat,
    makePoem,
    genshin,
    echo,



    repeater
}