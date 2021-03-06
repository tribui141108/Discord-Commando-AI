const languageSchema = require('@schemas/language-schema')
const lang = require('../../system/data/language.json')

let guildLanguages = {}

const loadLanguages = async (client) => {
    let counter = 1
    console.log('[LANGUAGE] Languages on servers')
    let data = {}
    for (const guild of client.guilds.cache) {
        const guildId = guild[0]

        const { name } = client.guilds.cache.get(guildId)

        const result = await languageSchema.findOne({
            _id: guildId
        })

        data[counter] = {server: name, language: result ? result.language : 'english'}
        counter += 1

        guildLanguages[guildId] = result ? result.language : 'english'
    }

    counter = 1

    console.table(data)
}

const setLanguage = (guild, language) => {
    guildLanguages[guild.id] = language.toLowerCase()
}

module.exports = (guild, textId) => {
    if (!lang.translations[textId]) {
        throw new Error(`Unknown text ID "${textId}"`)
    }

    if (!guildLanguages[guild.id]) return

    const selectedLanguage = guildLanguages[guild.id]
    
    return lang.translations[textId][selectedLanguage]
}

module.exports.loadLanguages = loadLanguages
module.exports.setLanguage = setLanguage