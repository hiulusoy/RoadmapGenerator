const express = require('express');

const clientFolderPath = './client';

module.exports = express.static(clientFolderPath);

