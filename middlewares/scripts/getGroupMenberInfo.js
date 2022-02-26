const axios = require('axios')

/**
 * @function 获取群成员的信息
 * @param {int} groupId 群id
 * @param {int} userId 群成员id
 * @returns promise object 
 */
async function getGroupMemberInfo(groupId, userId) {
    let api = `http://127.0.0.1:5700/get_group_member_info?group_id=${groupId}&user_id=${userId}`
    let data
    await axios.get(api).then(response => {
        data = response['data']['data']
    }).catch(error => {
        console.error(error);
    })
    return data
}

module.exports = getGroupMemberInfo