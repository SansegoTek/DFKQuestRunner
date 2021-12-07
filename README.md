# DFKQuestRunner
Keep your DeFi Kingdoms heroes questing without breaking a sweat.

(App description here)


# Private Keys
(Large warning about exposing private keys!) 

If you are absolutely sure you want to go ahead and use DFKQuestRunner, keep reading! 


# Installation
Mac/windows/linux sections
Install node etc
Download code
npm install


# Configuration
PK needs to be stored in a text file
File should ideally be stored on USB, especially secure USB like IronKeye
config.json

Each config section has a "professionHeroes" and a "nonProfessionHeroes" field. You should add your heroes with the relevant profession to "professionHeroes", and any others (e.g. miners or gardeners) that you would still like to use for fishing/foraging to "nonProfessionHeroes"

useBackupRPC is currently set to true as there are ongoing issues with Harmony RPC


# Running
Run using node
    - `node --experimental-json-modules index.js`

Will loop untill stopped with Ctrl-C
Can redirect output to a file 

# Deployment
Create a Heroku account and follow the steps down below once you have the Heroku-Cli installed on your computer. This is allow your bot to run 24/7 without running on your physical machine. You can check the logs on your Bot's dashboard on Heroku.
[Link to Heroku-Cli download instructions](https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up)
    - `git a .`
    - `git checkout -m "configured files"`
    - `heroku create`
    - `git push heroku main`
    - `heroku ps:scale web=1` 
    - `heroku open`


# Using with DeFiKingdoms App
May need to hard-refresh DFK in browser before seeing updated staminas/inventory - Ctrl-F5
Should be safe to leave running, while aslo doing quests in web app, but NOT TESTED!


# Tip Jar
If you're finding this valuable, any tips are gratefully received. They will be put to very good use in producing more useful DFK tools.

Tip jar for Sansego: 0xE9A14204D102abbE82A243DC2082086022595044

Tip jar for Tune: 0xd999D0d791eC54281426DB408f6858C1923476Cc

Thanks, and enjoy!
