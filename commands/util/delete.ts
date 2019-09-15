import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';

export default class DeleteCommand extends Command {
    public constructor() {
        super('delete', {
            aliases: ['delete'],
            description: {
                content: 'Deletes a specific number of messages.',
                usage: '<amount>'
            },
            category: 'util',
            clientPermissions: ['MANAGE_MESSAGES'],
            userPermissions: ['MANAGE_MESSAGES'],
            ratelimit: 2,
            args: [
                {
                    id: 'amount',
                    type: 'integer',
                    prompt: {
                        start: (message: Message): string => `${message.author}, how many message would you like to delete?`,
                        retry: (message: Message): string => `${message.author}, please enter a valid integer.`
                    }
                }
            ]
        });
    }

    public async exec(message: Message, { amount }: { amount: number }): Promise<Message | Message[] | void> {
        if (amount < 1 || amount > 100) return message.util!.send('You can only delete between 1 and 100 messages.');
        
        try {
            message.channel.bulkDelete(amount + 1, true).then((msgs) => {
                const embed = new MessageEmbed()
                    .setColor([155, 200, 200])
                    .setDescription(`${msgs.size} ${msgs.size > 1 ? 'messages were' : 'message was'} deleted`);

                message.util!.send(embed).then(m => {
                    // @ts-ignore
                    m.delete({ timeout: 3000 });
                });
            });
        } catch {
            const fail = new MessageEmbed()
                .setColor([245, 155, 55])
                .setDescription('Something went wrong.');

            return message.util!.send(fail);
        }

    }
}