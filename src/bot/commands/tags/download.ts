import { Command } from 'discord-akairo';
import { Message, GuildMember } from 'discord.js';
import { Tags, Tag } from '../../structures/entities/Tags';

export default class TagDownloadCommand extends Command {
    public constructor() {
        super('tag-download', {
            category: 'tags',
            description: {
                content: 'Downloads a/all tag(s).',
                usage: '[member]'
            },
            channel: 'guild',
            ratelimit: 2,
            args: [
                {
                    id: 'member',
                    match: 'content',
                    type: 'member',
                    default: ''
                }
            ]
        });
    }

    public async exec(message: Message, { member }: { member: GuildMember }): Promise<Message | Message[] | void> {
        const where = member ? { user: member.id, guild: message.guild!.id } : { guild: message.guild!.id };
        const tags = await Tags.find(where);
        if (!tags.length) return;
        const output = tags.reduce((out: string, t: Tag) => {
            out += `Name: ${t.name}\r\nContent:\r\n${t.content.replace(/\n/g, '\r\n')}\r\n\r\n========================================\r\n\r\n`;
            return out;
        }, '');

        return message.util!.send('Your tags:', { files: [{ attachment: Buffer.from(output, 'utf8'), name: `${member ? `${member.displayName}s_tags` : 'all_tags'}.txt` }] });
    }
}