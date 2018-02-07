const pluralize = require('pluralize')
const fs = require('fs')
const yaml = require('js-yaml')
const botListConfig = yaml.safeLoad(fs.readFileSync('./config/botlist.yml', 'utf8'))

module.exports = async (client) => {
  await client.log.info(`Logged in as ${client.user.tag} (${client.user.id})`, 'Discord')

  await setTimeout(function () {
    client.user.setStatus(client.provider.get('global', 'clientStatus', 'online')).then(
      client.user.setActivity(`${client.config.startConfig.commandPrefix}help | ${pluralize('Guild', client.guilds.size, true)} | ${pluralize('User', client.users.size, true)}${client.shard ? ` | Shard ${client.shard.id}` : ''}`)
    )
  }, 1000)

  await setInterval(function () {
    client.user.setStatus(client.provider.get('global', 'clientStatus', 'online')).then(
      client.user.setActivity(`${client.config.startConfig.commandPrefix}help | ${pluralize('Guild', client.guilds.size, true)} | ${pluralize('User', client.users.size, true)}${client.shard ? ` | Shard ${client.shard.id}` : ''}`)
    )
  }, 600000)
  await client.log.info(client.shard ? `Shard ${client.shard.id} ready!` : 'Client ready!', 'Client', 'bgGreen')

  // Webhook
  if (client.config.webhookConfig.enabled) {
    if (client.config.webhookConfig.clientEvents.ready) {
      client.webhook({
        content: '',
        username: client.user.username,
        avatarURL: client.user.displayAvatarURL(),
        embeds: [{
          author: { name: client.user.tag, icon_url: client.user.displayAvatarURL() },
          footer: { text: 'ready' },
          timestamp: new Date(),
          title: `ready${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}`,
          description: `${client.shard ? `Shard ${client.shard.id}` : 'Master'} is ready!`,
          color: 0x00AA00
        }]
      })
    }
  }

  /* ************************************************** */

  // Bot List
  if (botListConfig.DiscordBotsOrg.enabled === true) { client.discordbots(client) }
  if (botListConfig.BotsDiscordPw.enabled === true) { client.botsdiscordpw(client) }

  // Travis Tests
  if (client.travisTest === true) {
    await client.log.debug('Running in Travis CI mode, now exiting with 0 exit code in 5 seconds...', 'TRAVIS TEST')
    await setTimeout(() => { process.exit(0) }, 5000)
  }

  // Assign application owner as owner of the bot by default.
  client.fetchApplication().then(app => {
    let appOwner = client.config.startConfig.owner.indexOf(app.owner.id) > -1
    if (appOwner === false) {
      client.config.startConfig.owner.push(app.owner.id)
    }
  })
}
