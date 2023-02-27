const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Config the dotenv object with the path to the .env file.
dotenv.config({ path: path.join(__dirname, '../../config.env') });

const app = require('./app');
const port = process.env.PORT || 3003;

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@attendance-app.s2fxwlr.mongodb.net/?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
}, () => {
    console.log('Connection Successful!');
});

app.listen(port, () => {
    console.log(`Express server is up on port: ${port}`);
})

