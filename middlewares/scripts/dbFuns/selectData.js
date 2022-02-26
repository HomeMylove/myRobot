const { db } = require('../../../db/createDB')


/**
 * 
 * @param {object} userObj 查询的用户的对象
 * @param {int} userObj.user_id 查询用户的id
 * @param {int} userObj.group_id 查询用户的群id
 * @returns <promise> 返回一个
 */
function selectData(userObj) {
    return new Promise((resove, reject) => {
        const sqlStr = 'SELECT * FROM qq_robot WHERE user_id=? AND group_id=?'

        db.query(sqlStr, [userObj.user_id, userObj.group_id], (err, results) => {
            if (err) reject(err)
            resove(results)

        })

    })

}

module.exports = selectData