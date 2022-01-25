# --- DFK Bot Policy ---

The DFK team have recently taken a stance that bots like this one run the risk of damaging the game, by undermining the upcoming scholarship program. Accordingly, this project will no longer be maintained, and no PRs will be accepted. It is very likely that upcoming contract changes may render this bot inoperable, so usage is unadvisable.

The team are likely to introduce a policy that aims to curb the use of bots by applying a penalty to heroes or wallets that use them. Please bear that in mind if you are planning to use a bot in the game.

If you are still determined to use a bot, please make yourself aware of the risks by reading through the Private Key section below.

# DFKQuestRunner

Keep your DeFi Kingdoms heroes questing without breaking a sweat.

DFKQuestRunner makes the most of your DFK heroes by sending them on quests automatically, as soon as they have the stamina for it.

Features:

-   Sends your heroes on group quests - your professionals can go together for five quests (25 stamina), your non-professionals can go together for 3 quests (21 stamina)
-   Works with individual heroes too
-   Your group is sent on a quest as soon as the minimum stamina requirements are met
-   Optimizes gas fees by waiting until stamina is highest, to maximize the number of attempts in a turn
-   Also allows you to send your heroes for only 1, 2, 3 or 4 attempts
-   Optimizes time questing by completing quests as soon as the heroes have finished questing
-   Logs all quest activity to the screen, including quest rewards/XP/SkillUps
-   Can be configured to log to a file, for people who don't sit in front of a screen all day :)
-   Can run locally on your main machine, or can be deployed to a server
-   Easy to switch to the POKT RPC network if Harmony RPC has issues
-   Unlocks 'locked' quests - sometimes heroes get stuck on a quest and it can't be cancelled or completed through the DFK UI. DFKQuestRunner will attempt to complete these locked quests

# Private Keys - Proceed with EXTREME CAUTION!

I'll be very blunt about this - if you are not extremely careful using this app, you run the risk of losing the entire contents of your wallet. Yes, that's right - every single hero, JEWEL, Egg, Goldvein etc that you've worked so hard to accumulate - all gone. Not only that, but any ONE, ETH, NFTs etc that reside in that wallet - somebody else's property. Scared? Good!

You're in DFK and on GitHub, so you probably have a good understanding of why this risk exists. The reasons are spelled out below, but if any of this is news to you, you almost definitely shouldn't be using this app.

The reason this risk exists is because the app needs access to your private key. Private keys are like the main "password" to your wallet. Every time something significant (a "Transaction") happens in your wallet like sending coin to a different wallet, or sending a hero on a quest, your private key is used to ensure that you have personally signed-off on that transaction. MetaMask manages your private key for you and keeps it safe. When it pops up asking you to confirm a transaction, it's using your private key to sign that transaction.

The whole purpose of DFKQuestRunner is to run unattended. If you have to click a button every time a quest needs to start or complete, it defeats the purpose. So to manage this, it needs access to the private key so it can sign those transactions automatically. There is currently no way around this (although we're looking into options).

DFKQuestRunner ONLY uses your private key to sign transactions. The first time you run it, it will prompt you for your private key and a password, and it will save the private key in an encrypted form, to a file called 'w.json' (by default, but you can change this). Only somebody who knows the password will be able to decrypt it. The private key is then used to configure the popular open-source "ethers.js" library, which is used to sign and run the transactions. The app itself will not save the private key in it's unencrypted form. You can verify this in the code yourself - in fact, I would wholeheartedly recommend that you do exactly that (and tell us fast if you find any issues!)

_Please be aware that what follows is not advice as to what you should do in your specific situation - if you want to use this app, you need to educate yourself on the risks, and find a level of risk that you're comfortable with._

So, what are the risks? The main risk is that your encrypted private key will reside in a file somewhere. It runs the risk of being discovered, either by another human or some malware. There's a chance they could know or guess your password and be able to access it. Even if you create the file, use the runner, and then delete the file, somebody could potentially use drive recovery tools to restore that deleted file and access your private key. Paranoid? Maybe. But this is real money we're talking about.

Some people are comfortable with that risk - their password is strong, maybe their drive is encrypted, they use 2FA on their OS, they lock their laptop in a safe when they are not using it. Other people would prefer that the private key file never touches their hard drive, and so create it on a secure USB drive which it never leaves (you can configure this - see the configuration section below). There are no doubt plenty of other methods. Again, education is key.

When you export your private key from MetaMask, you might be tempted to copy/paste it into the application. Are you absolutely sure you don't have any malware on your machine that could read the contents of your clipboard? And there's the possibility of leaving the private key lying around in your clipboard, and then accidentally pasting it into a discord. Typing it in to the application, rather than copy/pasting, would be safer. Yes, it takes longer and is more error prone, but you only have to do it once.

There is also a risk for source code contributors. If you were to inadvertently push your _unencrypted_ private key file into GitHub - well, let's just say - [it would be bad](https://www.youtube.com/watch?v=jyaLZHiJJnE). There are bots out in the wild that react to GitHub commits in public repos, and scan for anything resembling a private key. Your wallet would be emptied before you could say "total protonic reversal", and who ya gonna call to dig you out of that mess? Don't be tempted to copy/paste your private key and save it unencrypted anywhere near the git folder structure.

Finally - if you've done your homework, found a level of risk you are comfortable with, and are happily using this app, don't be tempted to try out any similar-looking projects without first thoroughly investigating their code base. Sometimes people will fork GitHub projects, make some changes (e.g. like sending your private key to a web server that they control), and try and pass it off as the original by, say, casually dropping a link to it in a discord somewhere.

_Listen - ultimately, you're running some random code off of the internet, written by some people you probably don't know, who are asking you for access to your private key. WTF???!!??! I can tell you that we're good guys, and won't scam you, and that's absolutely true - but I'd prefer it if you didn't believe me. Do your homework, read the code, be aware of the risks, and only go ahead if you're comfortable. Otherwise, stay away. You're on your own. No responsibility for losses can or will be accepted from anyone involved in the project_

If you've got this far and are still considering using the app, congratulations my friend. You're tougher than an Ironscale, and will be auto-questing faster than a Sailfish. It's a beautiful and powerful thing. Some say, even more beautiful and powerful than a Shimmerscale...

# Installation

If you're wanting to get your hands dirty with the source code and maybe contribute something back, follow the instructions for Developers below. If you just want to run the application, follow the instructions for Non-developers. It's still a bit technical at this stage, but the included links for Mac and Windows should get you there (if you are a \*nix user I'm assuming you won't need links).

## Developers

-   Install [Node and NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
-   Install [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
-   Create a folder for the source code, navigate to the folder in your terminal of choice, and clone the DFKQuestRunner repo into it

`git clone https://github.com/SansegoTek/DFKQuestRunner.git`

-   Navigate into the repo folder and install the application dependencies

`npm install`

## Non-developers

-   Install [Node and NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
-   Click the green "Code" button at the top of this page, and select "download zip". This will download a file called "DFKQuestRunner-main.zip"
-   Unzip the zip file to a location you're happy with. [Mac](https://www.businessinsider.com/how-to-unzip-files-on-mac?r=US&IR=T) | [Windows](https://support.microsoft.com/en-us/windows/zip-and-unzip-files-f6dde0a7-0fec-8294-e1d3-703ed85e7ebc)
-   Open up a terminal window. [Mac](https://www.businessinsider.com/how-to-open-terminal-on-mac?r=US&IR=T) | [Windows](https://www.businessinsider.com/how-to-open-command-prompt)
-   In the terminal window, navigate to the location you unzipped the file to. Your terminal should be in the "DFKQuestRunner-main" folder. [Mac](https://www.macworld.com/article/221277/command-line-navigating-files-folders-mac-terminal.html) | [Windows](https://www.howtogeek.com/659411/how-to-change-directories-in-command-prompt-on-windows-10/)
-   In the terminal window, run the command to install the application dependencies

`npm install`

# Configuration

Configuration is handled in `config.json`. The key configuration settings to be aware of are:

```
wallet
 - address - your 0x wallet address used with Defi Kingdoms
 - encryptedWalletPath - the file path to your encrypted primary key file. This defaults to a file called "w.json" in the root of the source code, but can be changed to e.g. point to a location on a secure USB drive

professionMaxAttempts - the number of attempts that your professional heroes (e.g. fishers on a fishing quest) should try
nonProfessionMaxAttempts - the number of attempts that your non-professional heroes (e.g. miners on a foraging quest) should try
maxQuestGroupSize - the maximum size a quest group should be. DFK doesn't support more than 6 heroes on a quest

pollingInterval - how often, in milliseconds, the app checks for new work to do

quests
 - <quest>
   - professionHeroes - Comma-separated list of the Ids of the professional heros that you are sending on this quest. Make sure the heroes profession matches the quests profession
   - nonProfessionHeroes - Comma-separated list of the Ids of the non-professional heroes that you are sending on this quest. Make sure the heroes profession doesn't match the quests profession

useBackupRpc - false to use the Harmony RPC, true to use the POKT RPC when Harmony RPC has issues
```

# Running

_If you haven't read the private key section above, go back and read it!_

The first time you run the application, it will prompt you for a password, and a private key. Your private key will be encrypted with the password you provide, so for subsequent runs you will need to enter the same password. Follow the instructions here to [Export your private key](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-Export-an-Account-Private-Key) from MetaMask.

Assuming your terminal is still in the DFKQuestRunner folder, run the app using:

`npm start`

Enter your password, and if you are running it for the first time, export your private key from MetaMask, and enter it into the app when prompted.

The app will loop indefinitely, checking for quests to start or complete every interval defined by the `pollingInterval` config entry

# Using with DeFi Kingdoms App

DFKQuestRunner doesn't communicate directly with the DeFi kingdoms app in your browser - so you may need to hard-refresh (Ctrl-F5) the browser before you see updated stamina and inventory items.

If you are planning on running quests manually, it would be best to stop DFKQuestRunner from running first. Running manually and automatically at the same time has not been tested.

# Tip Jar

If you're finding DFKQuestRunner valuable, any tips are gratefully received. They will be put to very good use in producing more useful DFK tools.

Tip jar: 0xE9A14204D102abbE82A243DC2082086022595044

Thanks, and enjoy!
