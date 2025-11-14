require('dotenv').config();
const mongoose = require('mongoose');
const Donation = require('./models/Donation');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected');
    await Donation.deleteMany({});
    const data = [
      { title: 'Cooked rice and curry', description: 'Home-cooked rice, 5 plates', foodType: 'vegetarian', quantity: '5 plates', lat: 13.0827, lng: 80.2707, address: 'Chennai' },
      { title: 'Bread and fruit', description: '10 loaves + mixed fruits', foodType: 'vegan', quantity: '10 portions', lat: 12.9716, lng: 77.5946, address: 'Bengaluru' },
      { title: 'Packaged meals', description: 'Sealed meals, 20 packs', foodType: 'non-veg', quantity: '20 packs', lat: 13.0358, lng: 80.2445, address: 'Chennai - Central' }
    ];
    await Donation.insertMany(data);
    console.log('Seeded');
    process.exit(0);
  })
  .catch(err => console.error(err));
