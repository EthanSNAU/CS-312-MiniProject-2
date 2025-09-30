const express = require('express');
const app = express();
const axios = require('axios');
const path = require('path'); 


// setting up the biew engine
app.set('view engine', 'ejs');


// grabbing data from the joke API
app.get('/', async (req, res) => {
    
    // setting up joke object for HTML
    let joke = {
        setup: "",
        punchline: ""
    }; 

    // putting everything in try just in case something breaks
    try 
    {
        const response = await axios.get('https://v2.jokeapi.dev/joke/Any?safe-mode');
        const jokeData = response.data;

        // if the joke is a one-parter just update .setup and make .punchline empty, 
        // update both otherwise
        if (jokeData.type === 'single') 
        {
            joke.setup = jokeData.joke;
            joke.punchline = " "; 
        } 
        else if (jokeData.type === 'twopart')     
        {
            joke.setup = jokeData.setup;
            joke.punchline = jokeData.delivery;
        }

    } 
    catch (error) 
    {
        // just in case something breaks
        console.error("Something ain't right", error.message);
    }

    // using . render to send it do the index html so that I can use the values in joke
    res.render('index', { joke: joke });
});


// for getting my clown image
app.use('/API_STUFF/img', express.static(path.join(__dirname, 'img')));


// directing to index.ejs
app.get('/', (req, res) => {
  res.render('index');
});


// for hosting
app.listen(3000);