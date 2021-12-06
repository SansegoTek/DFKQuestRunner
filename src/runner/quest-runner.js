const config = require("./../config.json")
const ethers = require("ethers")
const abi = require("./abi.json")
const rewardLookup = require("./rewards.json")
const fs = require('fs')

const provider = new ethers.providers.JsonRpcProvider(getRpc())
const wallet = new ethers.Wallet(getPrivateKey(), provider)
const heroContract = new ethers.Contract(config.heroContract, abi, provider)
const questContract = new ethers.Contract(config.questContract, abi, provider)
const userHeroes = heroContract.getUserHeroes(config.wallet.address)

async function checkForQuests() {
    try
    {
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
        // TODO: error handling throughout
        console.log(err)
    }
}

async function evaluateQuests(activeQuests) {
    var questsToStart = new Array()

    var questingHeroes = activeQuests.reduce((heroes, quest) => 
        quest.heroes.forEach(h => heroes.push(h)),
        [ -1]
    )

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

        console.log(quest.heroes)
        console.log(quest.contractAddress)
        console.log(quest.attempts)

        let transaction = await questContract.connect(wallet).startQuest(quest.heroes, quest.address, quest.attempts)
        let receipt = await transaction.wait()
        if (receipt.status !== 1) throw new Error(`StartQuest receipt had a status of ${receipt.status}`)

        console.log(`Started ${quest.professional ? "Professional" : "Non-professional" } ${quest.name} quest.`)
    }
    catch(err) {
        console.warn(`Error starting quest - this will be retried next polling interval`)
        console.error(err)
    }
}

async function completeQuest(heroId) {
    try {
        console.log(`Completing quest led by hero ${heroId}`)
        let transaction = await questContract.connect(wallet).completeQuest(heroId)
        let receipt = await transaction.wait()
        if (receipt.status !== 1) throw new Error(`Receipt had a status of ${receipt.status}`)

        // TODO: Newlines instead \n
        // TODO: console green for completed quests?
        console.log()
        console.log(`***** Completed quest led by hero ${heroId} *****`)  // TODO: Quest name

        let xpEvents = receipt.events.filter(e => e.event === 'QuestXP')
        console.log(`XP: ${xpEvents.reduce((total, result) => total + result.args.xpEarned, 0)}`)

        let suEvents = receipt.events.filter(e => e.event === 'QuestSkillUp')
        console.log(`SkillUp: ${suEvents.reduce((total, result) => total + result.args.skillUp, 0) / 10}`)

        let rwEvents = receipt.events.filter(e => e.event === 'QuestReward')
        rwEvents.forEach((result) => console.log(`${result.args.itemQuantity} x ${getRewardDescription(result.args.rewardItem)}`))

        console.log()
        console.log('*****')
        console.log()
    }
    catch(err) {
        console.warn(`Error completing quest for heroId ${heroId} - this will be retried next polling interval`)
        console.error(err)
    }
}


function getRewardDescription(rewardAddress) {
    let desc = rewardLookup['0x6e1bC01Cc52D165B357c42042cF608159A2B81c1']
    return desc ? desc : rewardAddress
}

function getPrivateKey() {
    try {
        return fs.readFileSync(config.wallet.pkFileLocation, 'utf8')
    }
    catch(err) {
        console.error(err)
        process.exit()
    }
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

checkForQuests();
