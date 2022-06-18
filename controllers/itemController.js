const async = require('async');
const Item = require('../models/item');
const Brand = require('../models/brand');
const itemInstance = require('../models/itemInstance');
const Category = require('../models/category');
const { body, validationResult } = require('express-validator');
const upload = require('../upload');
const fs = require('fs');
const path = require('path');

exports.index = function (req, res) {
    async.parallel({

        itemCount: function(callback) {
            Item.countDocuments({}, callback);
        },
        brandCount: function(callback) {
            Brand.countDocuments({}, callback)
        },
        instancesCount: function(callback) {
            itemInstance.countDocuments({ status: "Available" }, callback)
        }

    }, function(err, results) {
        res.render('collectionIndex', { title: "Collection Index Page", error: err, data: results });
    });
};

exports.item_list = function (req, res, next) {
    Item.find({}, 'name brand price bestseller img updateTime')
    .sort({bestseller: -1, updateTime: -1})
    .populate('brand')
    .exec(function (err, list_items) {
        if (err) { return next(err); }
        res.render('item_list', { title: 'Item List', item_list: list_items });
    });
};

exports.item_detail = function (req, res, next) {

    async.parallel({
        item: function(callback) {
            Item.findById(req.params.id)
            .populate('category')
            .populate('brand')
            .exec(callback);
        }
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.item==null) { 
            const err = new Error('Item not found');
            err.status = 404;
            return next(err);
        }
        res.render('item_detail', { item: results.item } );
    });
};

exports.item_delete_get = function (req, res, next) {
    async.parallel({
        item: function(callback) {
            Item.findById(req.params.id)
            .exec(callback);
        }
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.item==null) { 
            const err = new Error('Item not found');
            err.status = 404;
            return next(err);
        }
        res.render('item_delete', { item: results.item } );
    });
};

exports.item_delete_post = function (req, res, next) {
    
    async.parallel({
        item: function(callback) {
            Item.findById(req.body.item_id)
            .exec(callback);
        }
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.item==null) { 
            const err = new Error('Item not found');
            err.status = 404;
            return next(err);
        }
        try {
            fs.unlinkSync(path.join(global.appRoot, results.item.img.url));
        } catch (error) {
            console.log(error);
        }
        Item.findByIdAndRemove(req.body.item_id, function deleteItem(err) {
            res.redirect('/collection/all')
        });
    });
};

exports.item_create_get = function (req, res, next) {
    async.parallel({
        categories: function(callback) {
            Category.find(callback);
        },
        brands: function(callback) {
            Brand.find(callback);
        }
    }, function(err, results) {
        if (err) { return next(err); }
        res.render('item_create', { categories: results.categories, brands: results.brands });
    });
};

exports.item_create_post = [

    upload.single('image'),

    body('name', 'Item name must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('description', 'Item description must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('brand').escape(),
    body('category', 'Item category must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('sex', 'Item sex must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('price_value', 'Item price value must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('price_unit', 'Item price unit must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('bestseller').escape(),

    (req, res, next) => {
        const errors = validationResult(req);
        console.log(req.file)

        let extension = '';
        if(req.file.mimetype === 'image/jpeg') extension = '.jpeg';
        if(req.file.mimetype === 'image/png') extension = '.png';
        if(req.file.mimetype === 'image/gif') extension = '.gif';
        if(req.file.mimetype === 'image/webp') extension = '.webp';
        const filename = req.file.fieldname + '-' + Date.now() + (extension !== ''? extension : null );

        const item = new Item(
            { name: req.body.name,
              description: req.body.description,
              category: req.body.category,
              sex: req.body.sex,
              price: { value: req.body.price_value, unit: req.body.price_unit },
              img: { url: global.uploadDirectoryRelative + '/' + filename, contentType: req.file.mimetype },
             });
        if (req.body.brand !== '' || undefined) item.brand = req.body.brand;
        if (req.body.bestseller !== '' || undefined) item.bestseller = req.body.bestseller;

        console.log(item)
        if (!errors.isEmpty()) {

        } 
        else {
            fs.writeFileSync(path.join(global.uploadDirectory, filename), req.file.buffer);
            item.save(function(err) {
                if (err) { return next(err); }
                res.redirect('/collection/create_item')
            })
        }  
}];