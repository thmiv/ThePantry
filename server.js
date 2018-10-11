var express = require('express');
var app = express();
var path = require('path');
const PORT = 3000;

// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.listen(PORT, () =>
console.log(`Server is listening on PORT ${PORT}`));
