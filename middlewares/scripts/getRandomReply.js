/**
 * @function 返回一句随机回复
 * @param {arrary} arr 传入包含若干回复的数组
 * @returns 随机元素
 */
function getRandomReply(arr) {
    let num = arr.length
    num = Math.floor(Math.random() * num)
    return arr[num]
}

module.exports = getRandomReply