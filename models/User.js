const {Schema, model, Types} = require('mongoose')

const sсhema = new Schema({
    email : {type: String, required: true, unique: true},
    password: {type: String, required: true, unique: true},
    links: [{type: Types.ObjectId, ref: 'Link'}],
    flag: {type: String, default: '1', required: true},
    code_unt: {type: String, required: true},
    activ: {type: Boolean, default: false, required: true}
})

module.exports = model('User', sсhema)