const mongoose = require('mongoose');

const db = () => {
    mongoose.connect('https://brand-b-1.onrender.com/belk')
        .then(() => {
            console.log("MongoDB connected");
        })
        .catch((err) => {
            console.error("MongoDB connection error:", err);
        });
};

module.exports = db;
