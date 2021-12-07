import express from 'express';
import checkForQuests from './src/runner/quest-runner.js';
import dotenv from 'dotenv';
let app = express();
dotenv.config();

checkForQuests();



app.listen(process.env.PORT || 3000, function(){
    console.log('listening on port 3000');
});