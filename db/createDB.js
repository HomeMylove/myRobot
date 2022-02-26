const mysql = require('mysql')
const { database } = require('../config')

const db = mysql.createPool(database)

module.exports = {
    db
}