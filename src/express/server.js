const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Config the dotenv object with the path to the .env file.
dotenv.config({ path: path.join(__dirname, '../../config.env') });

mongoose.set('strictQuery', false);

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@attendance-app.s2fxwlr.mongodb.net/attendance?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
}).then(() => {
    console.log('Connected to the attendance-app database in MongoDB Atlas!');
}).catch((err) => {
    console.log(err);
});

const app = require('./app');
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Express server is up on port: ${port}`);
})

