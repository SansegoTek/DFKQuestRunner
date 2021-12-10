const fs = require('fs')

const ethers = require('ethers')
require('dotenv').config();

const config = require('./../config.json')
const abi = require('./abi.json')
const rewardLookup = require('./rewards.json')

const provider = new ethers.providers.JsonRpcProvider(getRpc())
const heroContract = new ethers.Contract(config.heroContract, abi, provider)
const questContract = new ethers.Contract(config.questContract, abi, provider)
const userHeroes = heroContract.getUserHeroes(config.wallet.address)

let wallet

async function main() {
    try {
        wallet = fs.existsSync(config.wallet.encryptedWalletPath)
            ? await getEncryptedWallet()
            : await createWallet()

        console.clear()
        wallet.connect(provider)
        checkForQuests()
    }
    catch(err) {
        console.clear()
        console.error(`Unable to run: ${err.message}`)
    }
}

async function getEncryptedWallet() {
    console.log('\nHi. You need to enter the password you chose previously.')
    let pw = await promptForInput('Enter your password: ', 'password')

    try {
        let encryptedWallet = fs.readFileSync(config.wallet.encryptedWalletPath, 'utf8')
        let decryptedWallet = ethers.Wallet.fromEncryptedJsonSync(encryptedWallet, pw)
        return decryptedWallet.connect(provider)
    }
    catch(err) {
        throw new Error('Unable to read your encrypted wallet. Try again, making sure you provide the correct password. If you have forgotten your password, delete the file "w.json" and run the application again.')
    }
}

async function createWallet() {
    console.log('\nHi. You have not yet encrypted your private key.')
    let pw = await promptForInput('Choose a password for encrypting your private key, and enter it here: ', 'password')
    let pk = await promptForInput('Now enter your private key: ', 'private key')

    try {
        let wallet = new ethers.Wallet(pk, provider)
        let enc = await wallet.encrypt(pw)
        fs.writeFileSync(config.wallet.encryptedWalletPath, enc)
        return wallet
    }
    catch(err) {
        throw new Error('Unable to create your wallet. Try again, making sure you provide a valid private key.')
    }
}

async function promptForInput(prompt, promptFor) {
    const readline = require('readline').createInterface({ input: process.stdin, output: process.stdout });

    try {
        let input = await new Promise(resolve => {
            readline.question(prompt, answer => resolve(answer))
        })
        if (!input) throw new Error(`No ${promptFor} provided. Try running the application again, and provide a ${promptFor}.`)
        return input
    }
    finally {
        readline.close()
    }
}


async function checkForQuests() {
    try
    {
        console.log('\nChecking for quests...\n')
        let activeQuests = await questContract.getActiveQuests(config.wallet.address)
        let doneQuests = activeQuests.filter(quest => quest.completeAtTime < Math.round(Date.now() / 1000))
        let runningQuests = activeQuests.filter(quest => !doneQuests.includes(quest))

        let questsToStart = await evaluateQuests(activeQuests);

        // Display the finish time for any quests in progress
        runningQuests.forEach(quest => console.log(`Quest led by hero ${quest.heroes[0]} is due to complete at ${displayTime(quest.completeAtTime)}`))

        // Complete any quests that need to be completed
        for(const quest of doneQuests) { await completeQuest(quest.heroes[0]) }

        // Start any quests needing to start
        for(const quest of questsToStart) { await startQuest(quest) }

        setTimeout(() => checkForQuests(), config.pollingInterval);
    }
    catch(err)
    {
        console.error(err)
    }
}

async function evaluateQuests(activeQuests) {
    var questsToStart = new Array()
    var questingHeroes = new Array()

    activeQuests.forEach(q => q.heroes.forEach(h => questingHeroes.push(Number(h))))

    for (const quest of config.quests) {
        if (quest.professionHeroes.length > 0
            && !questingHeroes.includes(quest.professionHeroes[0]))
            {
                var staminaGood = await evaluateQuestHeroesStamina(quest, config.professionMaxAttempts, true)
                if (staminaGood)
                {
                    questsToStart.push( {
                        name: quest.name,
                        address: quest.contractAddress,
                        professional: true,
                        heroes: quest.professionHeroes,
                        attempts: config.professionMaxAttempts
                    })
                }
            }

        if (quest.nonProfessionHeroes.length > 0
            && !questingHeroes.includes(quest.nonProfessionHeroes[0]))
            {
                var staminaGood = await evaluateQuestHeroesStamina(quest, config.nonProfessionMaxAttempts, false)
                if (staminaGood)
                {
                    questsToStart.push( {
                        name: quest.name,
                        address: quest.contractAddress,
                        professional: false,
                        heroes: quest.nonProfessionHeroes,
                        attempts: config.nonProfessionMaxAttempts
                    })
                }
            }
    }

    return questsToStart
}

async function evaluateQuestHeroesStamina(quest, maxAttempts, professional) {
    let minStamina = professional ? 5 * maxAttempts : 7 * maxAttempts
    let heroes = professional ? quest.professionHeroes : quest.nonProfessionHeroes
    let lowestStamina = 100
    let lowestStaminaHero;

    for (const h of heroes) {
        var stamina = Number(await questContract.getCurrentStamina(h))
        if (stamina < lowestStamina) {
            lowestStaminaHero = h
            lowestStamina = stamina
        }
    };

    if (lowestStamina < 100 && lowestStamina >= minStamina) return true;

    // TODO: Contract error, fix
    //let hero = await questContract.getHero(lowestStaminaHero)
    //console.log(`${professional ? "Professional" : "Non-professional" } ${quest.name} quest due to start at ${displayTime(hero.state.staminaFullAt)}`)

    console.log(`${professional ? "Professional" : "Non-professional" } ${quest.name} quest is not ready to start. Lowest stamina is ${lowestStamina}`)

    return false;
}

async function startQuest(quest) {
    try {
        console.log(`Starting ${quest.professional ? "Professional" : "Non-professional" } ${quest.name} quest.`)

        let receipt = await tryTransaction(() => questContract.connect(wallet).startQuest(quest.heroes, quest.address, quest.attempts), 2)

        console.log(`Started ${quest.professional ? "Professional" : "Non-professional" } ${quest.name} quest.`)
    }
    catch(err) {
        console.warn(`Error starting quest - this will be retried next polling interval`)
    }
}

async function completeQuest(heroId) {
    try {
        console.log(`Completing quest led by hero ${heroId}`)

        let receipt = await tryTransaction(() => questContract.connect(wallet).completeQuest(heroId), 2)

        console.log(`\n***** Completed quest led by hero ${heroId} *****\n`)

        let xpEvents = receipt.events.filter(e => e.event === 'QuestXP')
        console.log(`XP: ${xpEvents.reduce((total, result) => total + Number(result.args.xpEarned), 0)}`)

        let suEvents = receipt.events.filter(e => e.event === 'QuestSkillUp')
        console.log(`SkillUp: ${suEvents.reduce((total, result) => total + Number(result.args.skillUp), 0) / 10}`)

        let rwEvents = receipt.events.filter(e => e.event === 'QuestReward')
        rwEvents.forEach((result) => console.log(`${result.args.itemQuantity} x ${getRewardDescription(result.args.rewardItem)}`))

        console.log('\n*****\n')
    }
    catch(err) {
        console.warn(`Error completing quest for heroId ${heroId} - this will be retried next polling interval`)
    }
}

async function tryTransaction(transaction, attempts) {
    for (let i=0; i < attempts; i++) {
        try {
            var tx = await transaction()
            let receipt = await tx.wait()
            if (receipt.status !== 1) throw new Error(`Receipt had a status of ${receipt.status}`)
            return receipt
        }
        catch(err) {
            if (i === attempts-1) throw err
        }
    }
}

function getRewardDescription(rewardAddress) {
    let desc = rewardLookup[rewardAddress]
    return desc ? desc : rewardAddress
}

function getRpc() {
    return config.useBackupRpc ? config.rpc.poktRpc : config.rpc.harmonyRpc;
}

function displayTime(timestamp) {
    var a = new Date(timestamp * 1000)
    var hour = a.getHours()
    var min = a.getMinutes()
    var sec = a.getSeconds()
    return hour + ':' + min + ':' + sec
}


main()

// TODO: Recover if failure (network down?)
// Merge some of farmertunes changes
