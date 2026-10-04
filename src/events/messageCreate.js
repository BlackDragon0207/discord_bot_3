const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const SOURCE_CHANNEL_ID = process.env.ANNOUNCE_SOURCE_CHANNEL_ID;
const TARGET_CHANNEL_ID = process.env.ANNOUNCE_TARGET_CHANNEL_ID;
const dataPath = path.join(__dirname, '../../data.json');

const excludedChannels = ['1406665693205631138'];
const excludedUsers = ['1111279955398115378'];

module.exports = (client) => {
    client.on('messageCreate', async (message) => {
        if (message.author.bot) return;

        // 1. 방송 알림 리레이
        if (SOURCE_CHANNEL_ID && message.channel.id === SOURCE_CHANNEL_ID) {
            const targetChannel = message.client.channels.cache.get(TARGET_CHANNEL_ID);
            if (targetChannel && targetChannel.isTextBased()) {
                const firstImage = message.attachments.find(att => att.contentType?.startsWith('image/'));
                const embed = new EmbedBuilder()
                    .setColor('#ffabd7')
                    .setTitle('📢 방송알림')
                    .setDescription(message.content || '내용 없음')
                    .setAuthor({
                        name: message.author.tag,
                        iconURL: message.author.displayAvatarURL({ dynamic: true })
                    })
                    .setTimestamp();

                if (firstImage) embed.setImage(firstImage.url);
                await targetChannel.send({ embeds: [embed] });
            }
        }

        // 2. 키워드 응답
        if (excludedChannels.includes(message.channel.id)) return;
        if (excludedUsers.includes(message.author.id)) return;

        if (fs.existsSync(dataPath)) {
            try {
                const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
                const responses = data[message.content];
                if (responses && Array.isArray(responses) && responses.length > 0) {
                    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                    message.reply(randomResponse);
                }
            } catch (err) {
                console.error('data.json 읽기 오류:', err);
            }
        }
    });
};