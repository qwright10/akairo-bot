"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class MessageReactionAddListener extends discord_akairo_1.Listener {
    constructor() {
        super('messageReactionAdd', {
            emitter: 'client',
            category: 'client',
            event: 'messageReactionAdd'
        });
    }
    async exec(reaction, user) {
        if (reaction.emoji.name !== '🗑')
            return;
        if (reaction.message.createdTimestamp - Date.now() > 1209.6e6)
            return;
        const moderators = await this.client.settings.get(reaction.message.guild, 'moderators', [reaction.message.guild.owner.id]);
        if (reaction.message.author.id !== user.id && !moderators.includes(user.id))
            return;
        return reaction.message.delete();
    }
}
exports.default = MessageReactionAddListener;
