import { Listener } from 'discord-akairo';
import { Message, MessageReaction, User } from 'discord.js';

export default class MessageReactionAddListener extends Listener {
    public constructor() {
        super('messageReactionAdd', {
            emitter: 'client',
            category: 'client',
            event: 'messageReactionAdd'
        });
    }

    public async exec(reaction: MessageReaction, user: User): Promise<Message | void> {
        if (reaction.emoji.name !== '🗑' || user.bot) return;
        if (reaction.message.createdTimestamp - Date.now() > 1209.6e6 || !reaction.message.deletable) return;
        if (reaction.message.channel.type === 'dm') return reaction.message.delete();

        const moderators = await this.client.settings.get(reaction.message.guild!, 'moderators', [reaction.message.guild!.owner!.id]);
        if (reaction.message.author!.id !== user.id && !moderators.includes(user.id)) return;
        return reaction.message.delete();
    }
}