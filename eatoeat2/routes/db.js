
var mongoose = require('mongoose');
mongoose.connect('mongodb://admin:root@ds127399.mlab.com:27399/eatoeat');
var _connection = null;

var db = mongoose.connection;
 
db.on('error', function (err) {
console.log('connection error', err);
});
db.once('open', function () {
console.log('connected.');
});

