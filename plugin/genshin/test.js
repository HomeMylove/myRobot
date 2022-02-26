const { db } = require('../../db/createDB')



const sqlStr = 'DELETE FROM wish'

db.query(sqlStr, [], (err, results) => {
    if (err) {
        return console.error(err);
    }
    console.log(results);
})