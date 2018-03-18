const { Command } = require('discord.js-commando')
const { oneLine } = require('common-tags')

module.exports = class EnableCommandCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'enable',
      memberName: 'enable',
      group: 'utility',
      description: 'Enables a command or command group.',
      details: oneLine`
      The argument must be the name/ID (partial or whole) of a command or command group.
      Only server managers may use this command.
      `,
      examples: [
        'enable information',
        'enable Utility',
        'enable ping'
      ],
      userPermissions: [
        'MANAGE_GUILD'
      ],
      throttling: {
        usages: 2,
        duration: 10
      },
      args: [
        {
          key: 'cmdOrGrp',
          label: 'command/group',
          prompt: 'Which command or group would you like to enable?',
          type: 'command-or-group'
        }
      ],
      guarded: true
    })
  }

  hasPermission (message) {
    if (
      this.client.provider.get('global', 'developer', []).includes(message.author.id) ||
      this.client.provider.get('global', 'staff', []).includes(message.author.id) ||
      this.client.isOwner(message.author.id) ||
      message.member.hasPermission('MANAGE_GUILD')
    ) {
      return true
    } else {
      return 'Only users with `MANAGE_GUILD` or bot staff can use this command.'
    }
  }

  run (message, args) {
    if (args.cmdOrGrp.isEnabledIn(message.guild)) {
      return message.reply(
        `the \`${args.cmdOrGrp.name}\` ${args.cmdOrGrp.group ? 'command' : 'group'} is already enabled.`
      )
    }
    args.cmdOrGrp.setEnabledIn(message.guild, true)
    return message.reply(`enabled the \`${args.cmdOrGrp.name}\` ${args.cmdOrGrp.group ? 'command' : 'group'}.`)
  }
}