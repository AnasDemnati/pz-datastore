'use strict';

const mongoose = require('mongoose');

const leaderAccountSystemDB = mongoose.connect("mongodb://localhost/leaderAccountSystem", (err) => {
    if(err) console.log(err);

    console.log(`The connection has been established on mongodb://localhost/leaderAccountSystem`);
});

exports.leaderAccountSystemDB = leaderAccountSystemDB;
