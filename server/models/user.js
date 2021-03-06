const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const roles = require('../config/roles')

let Schema = mongoose.Schema;

let rolesValid = {
    values: [roles.admin, roles.user],
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

userSchema.methods.toJSON = function () {
    let obj = this;
    
    let userObject = obj.toObject();

    delete userObject.password;

    return userObject;
}

userSchema.plugin(uniqueValidator, { message: '{PATH} must be unique' });

module.exports = mongoose.model('User', userSchema);