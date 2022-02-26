const { db } = require('../../../db/createDB')

/**
 * 
 * @param {object} user  新用户的信息,至少要给出 userId和groupId
 * @returns <promise>
 */
function insertData(user) {
    const sqlStr = 'INSERT INTO qq_robot SET ?'

    return new Promise((resove, reject) => {
        db.query(sqlStr, user, (err, results) => {
            if (err) reject(err)


            resove(results)

        })
    })
}
module.exports = insertData