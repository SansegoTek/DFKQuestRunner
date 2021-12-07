# DFKQuestRunner
Keep your DeFi Kingdoms heroes questing without breaking a sweat.

DFKQuestRunner makes the most of your DFK heroes by sending them on quests automatically, as soon as they have the stamina for it.

Features:
 - Sends your heroes on group quests - your professionals can go together for five quests (25 stamina), your non-professionals can go together for 3 quests (21 stamina)
 - Works with individual heroes too
 - Your group is sent on a quest as soon as the minimum stamina requirements are set
 - Optimizes gas fees by waiting until stamina is highest, to maximize the number of attempts in a turn
 - Also allows you to send your heroes for only 1, 2, 3 or 4 attempts
 - Optimizes time questing by completing quests as soon as the heroes have finished questing
 - Logs all quest activity to the screen, including quest rewards/XP/SkillUps
 - Can be configured to log to a file, for people who don't sit in front of a screen all day :)
 - Can run locally on your main machine, or can be deployed to a server
 - Easy to switch to the POKT RPC network if Harmony RPC has issues
 - Unlocks 'locked' quests - sometimes heroes get stuck on a quest and it can't be cancelled or completed through the DFK UI. DFKQuestRunner will attempt to complete these locked quests


# Private Keys - Proceed with EXTREME CAUTION!
I'll be very blunt about this - if you are not extremely careful using this app, you run the risk of losing the entire contents of your wallet. Yes, thats right - every single hero, JEWEL, Egg, Goldvein etc that you've worked so hard to accumulate - all gone. Not only that, but any ONE, ETH, NFTs etc that reside in that wallet - somebody elses property. Scared? Good!

You're in DFK and on github, so you probably have a good understanding of why this risk exists. The reasons are spelled out below, but if any of this is news to you, you almost definitely shouldn't be using this app.

The reason this risk exists is because the app needs access to your private key. Private keys are like the main "password" to your wallet. Every time something significant (a "Transaction") happens in your wallet like sending coin to a different wallet, or sending a hero on a quest, your private key is used to ensure that you have personally signed-off on that transaction. MetaMask manages your private key for you and keeps it safe. When it pops up asking you to confirm a transaction, it's using your private key to sign that transaction.

The whole purpose of DFKQuestRunner is to run unattended. If you have to click a button every time a quest needs to start or complete, it defeats the purpose. So to manage this, it needs access to the private key so it can sign those transactions automatically. There is currently no way around this (although we're looking into options).

DFKQuestRunner ONLY uses your private key to sign transactions. It loads the private key from a file (more on that in a second) and uses it to configure the popular open-source "ethers.js" library, which is used to sign and run the transactions. You can verify this in the code yourself - in fact, I would wholeheartedly recommend that you do exactly that (and tell us fast if you find any issues!)

*Please be aware that what follows is not advice as to what you should do in your specific situation - if you want to use this app, you need to educate yourself on the risks, and find a level of risk that you're comfortable with.*

So, what are the risks? The main risk is that your private key will need to reside in a text file somewhere. If this is on your machine, it runs the risk of being discovered, either by another human or some malware. Even if you create the file, use the runner, and then delete the file, somebody could potentially use drive recovery tools to restore that deleted file and access your private key. Paranoid? Maybe. But this is real money we're talking about.

Some people are comfortable with that risk - maybe their drive is encrypted, they have strong passwords, 2FA, they lock their laptop in a safe when they are not using it. Other people would prefer that the private key file never touches their hard drive, and so create it on a secure USB drive which it never leaves. There are no doubt plenty of other methods. Again, education is key. 

THere is also a risk for source code contributors. If you were to inadvertently push your private key file into GitHub - well, let's just say - [it would be bad](https://www.youtube.com/watch?v=jyaLZHiJJnE). There are bots out in the wild that react to GitHub commits in public repos, and scan for anything resembling a private key. Your wallet would be emptied before you could say "total protonic reversal", and who ya gonna call to dig you out of that mess? Keep your private key file well away from the git folder structure.

Finally - if you've done your homework, found a level of risk you are comfortable with, and are happily using this app, don't be tempted to try out any similar-looking projects without first thoroughly investigating their code base. Sometimes people will fork GitHub projects, make some changes (e.g. like sending your private key to a web server that they control), and try and pass it off as the original by, say, casusally dropping a link to it in a discord somewhere.

*Listen - ultimately, you're running some random code off of the internet, written by some people you probably don't know, who are asking you for access to your private key. I can tell you that we're good guys, and won't scam you, and that's absolutely true - but I'd prefer it if you didn't believe me. Do your homework, read the code, be aware of the risks, and only go ahead if you're comfortable. Otherwise, stay away. You're on your own. No responsibility for losses can or will be accepted from anyone involved in the project*

If you've got this far and are still considering using the app, congratulation my friend. You're tougher than an Ironscale, and will be auto-questing faster than a Sailfish. It's a beautiful thing. Some say, more beautiful than a Shimmerscale...


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
Will loop untill stopped with Ctrl-C
Can redirect output to a file 


# Using with DeFiKingdoms App
May need to hard-refresh DFK in browser before seeing updated staminas/inventory - Ctrl-F5
Should be safe to leave running, while aslo doing quests in web app, but NOT TESTED!


# Tip Jar
If you're finding this valuable, any tips are gratefully received. They will be put to very good use in producing more useful DFK tools.

Tip jar: 0xE9A14204D102abbE82A243DC2082086022595044

Thanks, and enjoy!
