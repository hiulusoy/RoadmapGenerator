const express = require('express');

module.exports = [
    express.urlencoded({extended: true}),
    express.json({limit: '10mb'})
];
