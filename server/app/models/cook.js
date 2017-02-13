"use strict";

var config = require("../../config"),
    mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    uniqueValidator = require("mongoose-unique-validator"),
    consts = require('../../libs/consts'),
    ObjectId = Schema.Types.ObjectId;

module.exports = function() {
    var CookSchema = new Schema({
        createdBy : {
            id: { type: ObjectId, default: null },
            name: { type: String, trim: true, default: '' }
        },
        createrName: { type: String, trim: true, default: '' },
        cookDate : { type: Date, default: Date.now() },
        cookAt : [
            {
                id: { type: Number, default: 0 },
                name: { type: String, trim: true, default: '' }
            }
        ],
        realCookAt : { type: Date, default: Date.now() },
        duty: [
            {
                id: { type: ObjectId, default: null },
                name: { type: String, trim: true, default: '' }
            }
        ],
        category : [
            {
                id: { type: Number, default: 0 },
                name: { type: String, trim: true, default: '' }
            }
        ],
        directions : { type: String, trim: true, default: '' },
        result: { type: String, trim: true, default: '' },
        feedback : { type: String, trim: true, default: '' }
    });

    CookSchema.plugin(uniqueValidator, {message: "Error, expected {PATH} to be unique."});

    CookSchema.set("toJSON", { virtuals: true });
    CookSchema.set("toObject", { virtuals: true });

    mongoose.model("Cook", CookSchema);
}