const express = require('express');
const app = express();

app.use(express.static('public'));

app.get('/game', function(request, response) {
  response.sendFile(__dirname + '/views/game.html');
});

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/solo.html');
});

const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
