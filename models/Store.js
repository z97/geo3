const mongoose = require('mongoose');
const geocoder = require('../utils/geocoder');

const StoreSchema = new mongoose.Schema({
  storeId: {
    type: String,
    required: [true, 'Please add a store ID'],
    unique: true,
    trim: true,
    maxlength: [10, 'Store ID must be less than 10 chars']
  },
  storeName: {
    type: String,
    required: [true, 'Please add a store name'],
    unique: true,
    trim: true,
    maxlength: [10, 'Store name must be less than 10 chars']
  },
  address: {
    type: String,
    required: [true, 'Please add an address']
  },
  location: {
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    },
    formattedAddress: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Geocode & create location
StoreSchema.pre('save', async function(next) {





  const crd;
  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };
  function success(pos) {
    crd = pos.coords;
    console.log('Your current position is:');
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);
  }
  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }
  navigator.geolocation.getCurrentPosition(success, error, options);
});

  
  
  
  
  
  
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: 'Point',
    coordinates: [crd.longitude, crd.latitude],
    formattedAddress: loc[0].formattedAddress
  };

  // Do not save address
  this.address = undefined;
  next();






module.exports = mongoose.model('Store', StoreSchema);
