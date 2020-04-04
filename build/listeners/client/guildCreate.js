"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const discord_js_1 = require("discord.js");
const common_tags_1 = require("common-tags");
class GuildCreateListener extends discord_akairo_1.Listener {
    constructor() {
        super('guildCreate', {
            emitter: 'client',
            category: 'client',
            event: 'guildCreate'
        });
    }
    async exec(guild) {
        return this.client.settings.guild(guild, {});
        if (this.client.settings.items.has(guild.id)) {
            await this.client.settings.clear(guild);
        }
        const guildGeneral = guild.channels.cache.filter(c => c.type === 'text').filter(c => {
            return c.name === 'general' || c.name === 'chat' || c.name === 'main';
        }).first();
        const updateChannel = this.client.channels.cache.get(await this.client.settings.get('global', 'modLog', ''));
        const guildOwner = await this.client.users.fetch(guild.ownerID);
        const logEmbed = new discord_js_1.MessageEmbed()
            .setColor(this.client.constants.guildAdd)
            .setAuthor(guild.name, guild.iconURL())
            .addField('ID', guild.id, true)
            .addField('Name', guild.name, true)
            .addField('Owner', guildOwner.tag, true)
            .addField('Region', guild.region, true)
            .addField('Channels', guild.channels.cache.size, true)
            .addField('Members', guild.members.cache.size, true)
            .addField('Humans', `~${guild.members.cache.filter(m => !m.user.bot).size}`, true)
            .addField('Bots', `~${guild.members.cache.filter(m => m.user.bot).size}`, true)
            .addField('​', '​', true)
            .setFooter('Joined Guild')
            .setTimestamp(Date.now());
        if (updateChannel && updateChannel.type === 'text')
            updateChannel.send(logEmbed);
        await this.client.settings.create(guild, {}).catch((err) => {
            if (err)
                this.client.logger.error(`Settings for ${guild.name} (${guild.id}) - ${guild.owner.user.tag} couldn't be created`);
            const embed = new discord_js_1.MessageEmbed()
                .setColor(this.client.constants.infoEmbed)
                .setAuthor(this.client.user.tag, this.client.user.displayAvatarURL())
                .setTimestamp(Date.now());
            if (guildGeneral) {
                embed.setTitle('Main Text Channel Set')
                    .setDescription(common_tags_1.stripIndents `
                    ${guildGeneral} has been set as the guild's
                    main text channel. If this is incorrect,
                    please use \`${process.env.prefix}main set\` in \`${guild.name}\`.`)
                    .setFooter('Main Channel Set');
            }
            else {
                embed.setTitle('Can\'t find main text channel');
                embed.setDescription(common_tags_1.stripIndents `
                Please send \`\`;main set\`\` in
                \`\`${guild.name}\`\`'s main text channel
                **ex: _;main set_ in #the-lounge**`);
                embed.setFooter('Error');
            }
            return guild.owner.send(embed);
        });
    }
}
exports.default = GuildCreateListener;
//# sourceMappingURL=guildCreate.js.map