// Imports
require('module-alias/register')

const { MongoClient } = require('mongodb')
const { MongoDBProvider } = require('commando-provider-mongo')

const Commando = require('discord.js-commando')
const path = require('path')
const Time = new Date(0)
const config = require('./config.json')
const loadCommands = require('@commands/load-commands')
const mongo = require('@commands/mongo')
const TicTacToe = require('discord-tictactoe')
const interactions = require('discord-slash-commands-client')

// Create Tic Tac Toe Bot
const bot = new TicTacToe({
    clientId: config.clientId,
    token: config.token,
    language: config.language,
    command: 'Tic-Tac-Toe'
})

bot.connect().then(console.log('[INFO] Created Tic Tac Toe Command!')).catch(() => console.error("Cannot connect TicTacToe bot"));

// Features
const prefix = config.prefix
const inviteNotify = require('@features/invite-notification')
const Polls = require('@features/poll')
const antiAd = require('@features/anti-ad')
const vulgarities = require('@features/anti-swear')
const advancedPolls = require('@features/advanced-poll')
const advancedSuggestions = require('@features/advanced-suggestions')
const msgs = require('@features/msgs')
const thanksLeaderboard = require('@features/thanks-leaderboard')
const mute = require('@features/mute')
const modLogs = require('@features/mod-logs')
const { Channel } = require('discord.js')


// Create Commando Bot
const client = new Commando.CommandoClient({
    owner: config.ownerId,
    commandPrefix: prefix
})

client.setProvider(
    MongoClient.connect(config.mongoPath, {
        useUnifiedTopology: true,
      })
        .then((client) => {
            return new MongoDBProvider(client, 'S1-SD5-Central')
        }).catch((err) => {
            console.error(err)
        })
)

// Events
client.on('ready', async () => {

// Start MongoDB connection
    await mongo()
    
// When Discord Bot is ready, do something
    console.log("[INFO] Bot is ready.")


// Register Commands
    client.registry
        .registerGroups([
            ['school', 'School Matters'],
            ['math', 'Mathematics Calculation'],
            ['moderation', 'Moderator'],
            ['evaluation', 'Evaluation'],
            ['channels', 'Set Channels'],
            ['polling', 'Polling'],
            ['giveaway', 'Bot Giveaway'],
            ['games', 'Game Content'],
            ['role', 'Manage Roles'],
            ['server', 'Server Commands'],
            ['settings', 'System Settings'],
            ['outside', 'Happening Outside'],
            ['documentation', 'Discord.JS Documentation'],
            ['suggestions', 'Suggestions'],
            ['thanks', 'Thanks people']
        ])
        .registerDefaults()
        .registerCommandsIn(path.join(__dirname, 'cmds'))

// Features
    // Check for messages and shortcuts from members
    msgs(client)

    // Invite Notification
    inviteNotify(client)

    // Anti-Advertisement
    antiAd(client)

    // Stop Vulgarities
    vulgarities(client)

    // Polls & Advanced Polls (Choose one)
    advancedPolls(client)
    Polls(client)

    // Advanced Suggestions
    advancedSuggestions(client)
    
    // Thanks Leaderboard
    thanksLeaderboard(client)

    // Check for mutes from members in MongoDB
    mute(client)

    // Moderation Logging
    modLogs(client)
})
client.login(config.token)