const mongoose = require('mongoose');
const initData = require('./data');
const Listing = require('../models/listing');

const MONGO_URL = 'mongodb://127.0.0.1:27017/GlobeStay';
main().then(console.log("Connected to DB")).catch(err => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
}

const importData = async () => {
    
        await Listing.deleteMany();
        initData.data=initData.data.map((obj)=>({...obj,owner:'691b516278c113dcf64171cf'}))
        await Listing.insertMany(initData.data);
        console.log("Listings deleted!");
}
importData();
