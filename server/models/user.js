const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let rolesValid = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} do not is valid'
}

let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'The name is required']
    },
    mail: {
        type: String,
        required: [true, 'The name is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'The password is required']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValid
    },
    state: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false,
    }
});

userSchema.plugin(uniqueValidator, {message: '{PATH} must be unique'});

module.exports = mongoose.model('User', userSchema);