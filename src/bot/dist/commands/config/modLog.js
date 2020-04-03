"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const common_tags_1 = require("common-tags");
class ModLogChannelCommand extends discord_akairo_1.Command {
    constructor() {
        super('modLog', {
            aliases: ['modLog'],
            description: {
                content: common_tags_1.stripIndents `Available methods:
                 • get
                 • set [channel]
                 • clear
                Optional: \`[]\``,
                usage: '<method> [channel]',
                examples: [
                    'get',
                    'set',
                    'set #logs',
                    'set 584900639365267465',
                    'clear'
                ]
            },
            category: 'config',
            ratelimit: 2,
            channel: 'guild',
            userPermissions: ['MANAGE_GUILD'],
            args: [
                {
                    id: 'method',
                    type: 'lowercase'
                },
                {
                    id: 'channel',
                    type: 'textChannel',
                    default: (message) => message.channel
                }
            ]
        });
    }
    async exec(message, { method, channel }) {
        if (method === 'get') {
            const modLog = await this.client.settings.get(message.guild, 'modLog', '');
            if (modLog === '')
                return message.util.send('No mod log channel is set.');
            return message.util.send(`\`${message.guild.name}\`'s mod log channel is set to \`${modLog.name}\``);
        }
        else if (method === 'set') {
            await this.client.settings.set(message.guild, 'modLog', channel.id);
            return message.util.send(`\`${message.guild.name}\`'s mod log text channel is now \`${channel.name}\``);
        }
        else if (method === 'clear') {
            await this.client.settings.set(message.guild, 'modLog', '');
            return message.util.send(`\`${message.guild.name}\`'s mod log text channel was cleared.`);
        }
        else {
            const prefix = await this.handler.prefix(message);
            return message.util.send(common_tags_1.stripIndents `
                    That method doesn't exist on \`modLog\`;
                    Try \`${prefix}help modLog\` for help.`);
        }
    }
}
exports.default = ModLogChannelCommand;