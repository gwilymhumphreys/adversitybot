import Discord from 'discord.js'
import { adversity, adversityLong, adversityShort } from './adversity'


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
    if (!(message.channel.type === 'DM' || message.channel.name.toLowerCase().replace(/\s/g, '') === 'adversitybot')) return

    // console.log('got message', message)

    const args = message.content.slice(prefix.length).split(' ')
    const command = args.shift().toLowerCase()

    if (command === 'help') {
      await message.channel.send(
        'To check a teams history give the bot one of the following commands:\n' +
        '\n`!adversity` or `!a` <team name>' +
        '```!a My lovely team name```' +
        '\n`!adversityshort` or `!as` <team name>' +
        '```!as My lovely team name```' +
        '\n`!adversitylong` or `!al` <team name>' +
        '```!al My lovely team name```' +
        ' \n\n ',
      )
      await message.channel.send(`\n\n----------------\n\nTo add adversitybot to your channel head to  https://discordapp.com/oauth2/authorize?client_id=747055885645381662&scope=bot`)
      await message.channel.send(`It's well behaved and will only respond to DMs or messages from a channel named 'adversitybot'`)
      return
    }

    const teamName = args.join(' ')
    let results
    if (!teamName) return message.channel.send('Enter a team name to check after the command, e.g. ```!a My lovely team name```')
    message.channel.send(`Checking team '${teamName}'`)

    if (command === 'as' || command === 'adversityshort') results = await adversityShort(teamName)
    else if (command === 'al' || command === 'adversitylong') results = await adversityLong(teamName)
    else results = await adversity(teamName)

    const {
      table,
      summary,
    } = results

    const wrappedTable = '```json\n'+table+'```'
    await message.channel.send(summary)

    console.log(await message.channel.send(wrappedTable, {split: {prepend: '```json\n', append: '```'}}))
  }
  catch (err) {
    console.log(err)
    message.channel.send(err.message)
  }
}

try {
  console.log(`adversitybot starting, token ${!!token}, prefix '${prefix}'`)
  const client = new Discord.Client()

  client.on('ready', () => {
    console.log(`adversitybot logged in as ${client.user.tag}!`)
  })

  client.on('message', handleMessage)

  client.login(token)
}
catch (err) {
  console.log(err)
}
