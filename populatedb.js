#! /usr/bin/env node

require('dotenv').config();

const async = require('async');
const Item = require('./models/item');
const Brand = require('./models/brand');
const Category = require('./models/category');
const ItemInstance = require('./models/itemInstance');


const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true}, err => { console.log("Connected to MongoDB")});
mongoose.Promise = global.Promise;

let brands = []
let categories = []
let items = []
let itemInstances = []

function brandCreate(name, img, cb) {
  brandDetail = { name, img }
  
  const brand = new Brand(brandDetail);
       
  brand.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Brand: ' + brand);
    brands.push(brand)
    cb(null, brand)
  }  );
}

function categoryCreate(name, cb) {
    categoryDetail = { name }
    
    const category = new Category(categoryDetail);
         
    category.save(function (err) {
      if (err) {
        cb(err, null)
        return
      }
      console.log('New Category: ' + category);
      categories.push(category)
      cb(null, category)
    }  );
  }

function itemCreate(name, description, brand, category, sex, price, bestseller, img, cb) {
  itemDetail = { 
    name, description, sex, price, bestseller, img
  }
  if (brand !== false) itemDetail.brand = brand;
  if (category !== false) itemDetail.category = category;

  const item = new Item(itemDetail);    
  item.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Item: ' + item);
    items.push(item)
    cb(null, item)
  }  );
}


function itemInstanceCreate(item, size, status, cb) {
  itemInstanceDetail = { 
    item, size, status
  }    
    
  const itemInstance = new ItemInstance(itemInstanceDetail);    
  itemInstance.save(function (err) {
    if (err) {
      console.log('ERROR CREATING itemInstance: ' + itemInstance);
      cb(err, null)
      return
    }
    console.log('New Item Instance: ' + itemInstance);
    itemInstances.push(itemInstance)
    cb(null, itemInstance)
  }  );
}


function createBrandsCategories(cb) {
    async.series([
        function(callback) {
          brandCreate('Abibas', { url: 'public/images/uploads/abibasLogo.jpg', contentType: 'image/jpeg' }, callback);
        },
        function(callback) {
          brandCreate('Coma', { url: 'public/images/uploads/comaLogo.jpg', contentType: 'image/jpeg' }, callback);
        },
        function(callback) {
          brandCreate('Fake', { url: 'public/images/uploads/fakeLogo.jpg', contentType: 'image/jpeg' }, callback);
        },
        function(callback) {
          brandCreate('Mike', { url: 'public/images/uploads/mikeLogo.jpg', contentType: 'image/jpeg' }, callback);
        },
        function(callback) {
            categoryCreate('Shirt', callback);
        },
        function(callback) {
            categoryCreate('Dress', callback);
        },
        function(callback) {
            categoryCreate('Jacket', callback);
        },
        function(callback) {
            categoryCreate('Pants', callback);
        },
        ],
        // optional callback
        cb);
}


function createItems(cb) {
    async.parallel([
        function(callback) {
          itemCreate('Woolrich Flannel Shirt', 'Flannel Shirt for Women', false, false, 'women', { value: '10', unit: 'usd' }, true, { url: 'public/images/uploads/woolrichFlannelShirt.jpg', contentType: 'image/jpeg' }, callback);
        },
        function(callback) {
          itemCreate('Leather Bomber Jacket with Hood (Red)', 'A popular leather jacket for men', brands[2], categories[2], 'men', { value: '80', unit: 'usd' }, true, { url: 'public/images/uploads/leatherBomberJacketwithHoodRed.jpg', contentType: 'image/jpeg' }, callback);
        },
        function(callback) {
          itemCreate('Pier 17 Button Down Shirt', 'Classic shirt with buttons down for women', brands[3], categories[0], 'women', { value: '30', unit: 'usd' }, true, { url: 'public/images/uploads/pier17ButtonDownShirt.jpg', contentType: 'image/jpeg' }, callback);
        },
        function(callback) {
          itemCreate('TAN V-neck T-shirt', 'A brown T-shirt for men', brands[0], categories[0], 'men', { value: '15', unit: 'usd' }, true, { url: 'public/images/uploads/tanVneckTshirt.jpg', contentType: 'image/jpeg' }, callback);
        },
        function(callback) {
          itemCreate('Unisex Black Pants', 'Popular pants model for everyone', false, categories[3], 'unisex', { value: '20', unit: 'usd' }, true, { url: 'public/images/uploads/unisexPantsBlack.jpg', contentType: 'image/jpeg' }, callback);
        },
        ],
        // optional callback
        cb);
}


function createitemInstances(cb) {
    async.parallel([
        function(callback) {
          itemInstanceCreate(items[0], 'M', 'Available', callback)
        },
        function(callback) {
          itemInstanceCreate(items[1], 'XL', 'Available', callback)
        },
        function(callback) {
          itemInstanceCreate(items[1], 'M', 'Sold', callback)
        },
        function(callback) {
          itemInstanceCreate(items[2], 'S', 'Available', callback)
        },
        function(callback) {
          itemInstanceCreate(items[3], 'XXL', 'Available', callback)
        },
        function(callback) {
          itemInstanceCreate(items[3], 'XXL', 'Maintance', callback)
        },
        function(callback) {
          itemInstanceCreate(items[4], 'M', 'Available', callback)
        },
        function(callback) {
          itemInstanceCreate(items[4], 'M', 'Sold', callback)
        },
        function(callback) {
          itemInstanceCreate(items[4], 'M', 'Maintance', callback)
        },
        ],
        // Optional callback
        cb);
}



async.series([
    createBrandsCategories,
    createItems,
    createitemInstances
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('itemInstances: '+itemInstances);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});




