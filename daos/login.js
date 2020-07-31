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
        //console.log(user);
        return user;
    };
}

module.exports.login = async (creds) => {
    const user = await User.findOne({ email : creds.email }).lean();
    console.log(user);
    if (!user) { 
        return false; 
    };
    const passwordMatch = await bcrypt.compare(creds.password, user.password);
    //console.log(passwordMatch);
    if (passwordMatch == false) { 
        return false; 
    } else {
        const newToken = await Token.create({ token: uuid(), userId : creds.email });
        //console.log(newToken);
        return newToken; 
    }; 
}

module.exports.logout = async (creds) => {
    const token = await creds.split(' ')[1];
    console.log(creds);
    console.log(token);
    const success = await Token.findOne({ token : token });
    //console.log(success);
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
    //console.log(foundToken)
    if (!foundToken) {
        return false;
    } else {
        try {
            password = await bcrypt.hash(password, saltRounds);
            await User.updateOne({ 'email' : foundToken.userId }, { $set: { 'password' : password}});
            return true;
        } catch (err) {
            throw err;
        }
        
    };
}

class BadDataError extends Error {};
module.exports.BadDataError = BadDataError;