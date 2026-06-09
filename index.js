const mineflayer = require('mineflayer');

const config = {
    host: 'SFHGaming25-qFoV.aternos.me', 
    port: 16680,                         
    username: 'yazan_noob'
};

let bot;
let chatInterval;

function createBot() {
    console.log(`[Handshake] Starting connection sequence to ${config.host}:${config.port}...`);
    
    bot = mineflayer.createBot({
        host: config.host,
        port: config.port,
        username: config.username,
        version: false, 
        checkTimeoutInterval: 60000, 
        physicsEnabled: true 
    });

    bot.once('spawn', () => {
        console.log(`[SUCCESS] ${bot.username} has stabilized inside the chunk map.`);
        
        setTimeout(() => {
            if (bot && bot.entity) {
                bot.look(Math.random() * Math.PI, 0, true);
            }
        }, 1500);

        clearInterval(chatInterval);
        chatInterval = null;

        setTimeout(() => {
            if (!chatInterval) startChatLoop();
        }, 15000);
    });

    bot.on('time', () => {
        if (!bot || !bot.time) return;
        if (bot.time.timeOfDay >= 13000 && bot.time.timeOfDay < 23000) {
            if (!bot.isSleeping) {
                findAndSleepInBed();
            }
        }
    });

    bot.on('error', (err) => {
        console.log(`[Error Frame Logged]: ${err.message}`);
    });

    bot.on('end', (reason) => {
        console.log(`[Termination Event]: Status details: ${reason}. Pausing 20 seconds before auto-reconnect...`);
        clearInterval(chatInterval);
        chatInterval = null;
        setTimeout(createBot, 20000); 
    });
}

function startChatLoop() {
    const messages = [
        "kya hall hai",
        "me to ek normal person hun yarr"
    ];
    let index = 0;

    chatInterval = setInterval(() => {
        if (bot && bot.entity && !bot.isSleeping) {
            bot.chat(messages[index]);
            index = (index + 1) % messages.length; 
        }
    }, 900000); 
}

async function findAndSleepInBed() {
    if (!bot || !bot.registry) return; 
    try {
        const bedIds = bot.registry.blocksArray
            .filter(b => b.name.includes('bed'))
            .map(b => b.id);

        if (bedIds.length === 0) return;

        const bedBlock = bot.findBlock({
            matching: bedIds,
            maxDistance: 20
        });

        if (bedBlock) {
            console.log(`[Action Triggered] Found bed block at location ${bedBlock.position}. Engaging...`);
            await bot.sleep(bedBlock);
        }
    } catch (err) {
        console.log(`[Bed Block Log]: Interaction skipped: ${err.message}`);
    }
}

createBot();
