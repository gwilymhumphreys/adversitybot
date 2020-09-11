import Discord from 'discord.js'
import { adversity, adversityLong, adversityShort, compFromSeason } from './adversity'
import readme from './readme'


const prepend = '```json\n'
const append = '```'
const codeBlock = text => prepend+text+append

const prefix = process.env.PREFIX || '!'
const token = process.env.DISCORD_BOT_TOKEN
if (!token) {
  console.log('Missing process.env.DISCORD_BOT_TOKEN')
  console.log('Get this from your discord application page via https://discord.com/developers/applications')
  process.exit(0)
}

export async function handleMessage(message) {
  try {
    if (!message.content.startsWith(prefix) || message.author.bot) return
    if (!((message.channel.type || '').toLowerCase() === 'dm' || (message.channel.name || '').toLowerCase().replace(/\s/g, '') === 'adversitybot')) return

    // console.log('got message', message)

    const args = message.content.slice(prefix.length).split(' ')
    const command = args.shift().toLowerCase()

    if (command === 'help') {
      const helpText = await readme()
      await message.channel.send(helpText)
      return
    }

    const argsString = args.join(' ')
    let season = 34
    let teamName = argsString

    const matches = argsString.match(/-s (\d\d)\s(.*)/)
    if (matches && matches[1]) {
      season = matches[1]
      teamName = matches[2]
    }
    const compName = compFromSeason(season)

    let results
    if (!teamName) return message.channel.send('Enter a team name to check after the command, e.g. ```!a My lovely team name```')

    message.channel.send(`Checking team \`${teamName}\` in competition \`${compName}\`...`)


    if (command === 'as' || command === 'adversityshort') results = await adversityShort(teamName)
    else if (command === 'al' || command === 'adversitylong') results = await adversityLong(teamName)
    else results = await adversity(teamName)

    const {
      resultsTable,
      summary,
    } = results

    message.channel.send(codeBlock(summary))
    message.channel.send(' ')
    await message.channel.send(codeBlock(resultsTable), {split: {prepend, append}})
  }
  catch (err) {
    console.log(err)
    message.channel.send(err.message)
  }
}

try {
  if (process.env.PAUSE_BOT) {
    console.log('Bot is PAUSED, delete the PAUSE_BOT env variable and restart to enable')
  }
  else {
    console.log(`adversitybot starting, token ${!!token}, prefix '${prefix}'`)
    const client = new Discord.Client()

    client.on('ready', () => {
      console.log(`adversitybot logged in as ${client.user.tag}!`)
    })

    client.on('message', handleMessage)

    client.login(token)
  }
}
catch (err) {
  console.log(err)
}
