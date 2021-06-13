const express = require('express');
const router = express.Router();
const { automataController } = require('./../controllers/automata');

router.post('/transform', automataController.transform());

module.exports = { router };