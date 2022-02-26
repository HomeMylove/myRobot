const { db } = require('../../../db/createDB')

/**
 * @function 更新用户的数据，返回promise
 * @param {object} userObj 要更新的用户对象
 * @param {int} userObj.user_id 用户的id
 * @param {int} userObj.group_id 群的id
 * @param {object} newData  更新要更新的数据
 * @returns <promise> 成功或失败
 */
function updateData(userObj, newData) {

    const sqlStr = 'UPDATE qq_robot SET ? WHERE user_id=? AND group_id=?'

    return new Promise((resove, reject) => {
        db.query(sqlStr, [newData, userObj.user_id, userObj.group_id], (err, results) => {
            if (err) reject(err)

            if (results.affectedRows == 1) {
                resove(results)
            } else {
                reject('失败')
            }
        })
    })
}

module.exports = updateData