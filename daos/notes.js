const mongoose = require('mongoose');

const Note = require('../models/note');
const Token = require('../models/token');
const User = require('../models/user');

let uuid = require('uuid-random');

module.exports = {};

//validate token return user
module.exports.validateToken = async (token) => {
    const thisToken = token.split(' ')[1];
    // if (!uuid.test(thisToken)) {
    //     return false;
    // }
    const foundToken = await Token.findOne({ token : thisToken });
    if (!foundToken) {
        return false;
    } else {
        const user = await User.findOne({ _id : foundToken.userId });
        return user._id;
    };
}

module.exports.createNote = async (note, userId) => {
    const newNote = await Note.create({ 'text' : note, 'userId' : userId });
    return newNote;  
}

module.exports.getNotesByUserId = async (userId) => {
    const notes = await Note.find({ userId : userId });
    return notes;
}

module.exports.getById = async (noteId, userId) => {
    if (!mongoose.Types.ObjectId.isValid(noteId)) {
        //return null;
        throw new BadDataError('Not valid book id');
    } else {
        const note = await Note.findOne({ _id : noteId, userId : userId }).lean();
        return note;
    }
    
}

class BadDataError extends Error {};
module.exports.BadDataError = BadDataError;