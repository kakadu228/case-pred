const moment = require('moment')
var mongoose = require('mongoose')
require('mongoose-double')(mongoose);

var SchemaTypes = mongoose.Schema.Types;

const schema = new mongoose.Schema({
    fut: {type: SchemaTypes.Double},
    date: {type: String, default: moment().format('L')},
    owner: {type: mongoose.Types.ObjectId, ref: 'User'},
    delete: {type: String, default:'удалить', required: true}
})

module.exports = mongoose.model('Link', schema)


