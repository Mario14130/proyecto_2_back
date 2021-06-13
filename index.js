const express = require('express');
const app = express();
const { router } = require('./routes/routes');

const port = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.send('API IS WORKING');
})

app.use('/api', router);

app.listen(port, function () {
    console.log(`Listening on port ${port}`);
})




