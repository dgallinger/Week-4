const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const saltRounds = 10;

let uuid = require('uuid-random');

const User = require('../models/user');
const Token = require('../models/token');

module.exports = {};

module.exports.signUp = async (creds) => {
    let user = await User.findOne({ email : creds.email });
    if (user) {
        return false;
    } else {
        creds.password = await bcrypt.hash(creds.password, saltRounds);
        user = await User.create(creds);
        return user;
    };
}

module.exports.login = async (creds) => {
    const user = await User.findOne({ email : creds.email }).lean();
    if (!user) { 
        return false; 
    };
    const passwordMatch = await bcrypt.compare(creds.password, user.password);
    if (passwordMatch == false) { 
        return false; 
    } else {
        const newToken = await Token.create({ token: uuid(), userId : user._id });
        return newToken; 
    }; 
}

module.exports.logout = async (creds) => {
    const token = await creds.split(' ')[1];
    const success = await Token.findOne({ token : token });
    if (!success) {
        return false;
    } else {
        await Token.deleteOne({ token: token });
        return true;
    };
}

module.exports.changePassword = async (auth, password) => {
    const token = await auth.split(' ')[1];
    const foundToken = await Token.findOne({ token : token });
    if (!foundToken) {
        return false;
    } else {
        try {
            password = await bcrypt.hash(password, saltRounds);
            await User.updateOne({ _id : foundToken.userId }, { $set: { 'password' : password}});
            return true;
        } catch (err) {
            throw err;
        }
        
    };
}

// class BadDataError extends Error {};
// module.exports.BadDataError = BadDataError;