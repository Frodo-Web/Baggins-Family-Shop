const express = require('express');
const router = express.Router();

const item_controller = require('../controllers/itemController');

router.get('/', item_controller.index);
router.get('/all', item_controller.item_list);
router.get('/create_item', item_controller.item_create_get);
router.post('/create_item', item_controller.item_create_post);

module.exports = router;