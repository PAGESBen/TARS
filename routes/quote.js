const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const quoteCtrl = require('../controllers/quote');

// router.get('/', auth, quoteCtrl.getAllQuote );
// router.get('/:id', auth, quoteCtrl.getOneQuote );
// router.post('/', auth, multer, quoteCtrl.postOneSQuote );
// router.put('/:id', auth, multer, quoteCtrl.modifyOneQuote );
// router.delete('/:id', auth, quoteCtrl.deleteOneQuote ); 
// router.post('/:id/like', auth, quoteCtrl.like );

module.exports = router;