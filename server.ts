import express from 'express';
import dotenv from 'dotenv';
import connectToDatabase from './database/db';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

connectToDatabase(`${process.env.MONGO_URI}/${process.env.MONGO_DB}`)
.then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})