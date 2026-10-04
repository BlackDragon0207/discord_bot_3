// logs/emojiLogs.js
const { EmbedBuilder } = require('discord.js');

// 로그를 전송할 채널 ID와 특정 서버 ID 설정
const reactionLogChannelId = "1405555120233513020";
const targetGuildId = process.env.guildId;

module.exports = function(client) {
    // 이모티콘 반응 추가 로그
    client.on('messageReactionAdd', async (reaction, user) => {
        if (user.bot) return;

        if (reaction.partial) {
            try {
                await reaction.fetch();
            } catch (error) {
                console.error('에러 발생:', error);
                return;
            }
        }

        if (!reaction.message.guild || reaction.message.guild.id !== targetGuildId) return;
        if (reaction.message.author?.bot) return; // ✅ 봇 메시지에는 반응 로그 기록 X

        const logChannel = client.channels.cache.get(reactionLogChannelId);
        if (logChannel && logChannel.isTextBased()) {
            const messageLink = `https://discord.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${reaction.message.id}`;

            const embed = new EmbedBuilder()
                .setTitle('👍 이모티콘 반응 추가 로그')
                .setColor('#00FF00')
                .setDescription(`<@${user.id}> (${user.tag}) 이(가) 메시지에 반응을 추가했습니다.`)
                .addFields(
                    { name: '> **채널**', value: `<#${reaction.message.channel.id}> (${reaction.message.channel.id})` },
                    { name: '> **메시지**', value: `[바로가기](${messageLink})` },
                    { name: '> **이모티콘**', value: `${reaction.emoji.name}` },
                )
                .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                .setFooter({ text: `이모티콘이 추가되었습니다.` })
                .setTimestamp();

            await logChannel.send({ embeds: [embed] });
        }
    });

    // 이모티콘 반응 제거 로그
    client.on('messageReactionRemove', async (reaction, user) => {
        if (user.bot) return;

        if (reaction.partial) {
            try {
                await reaction.fetch();
            } catch (error) {
                console.error('에러 발생:', error);
                return;
            }
        }

        if (!reaction.message.guild || reaction.message.guild.id !== targetGuildId) return;
        if (reaction.message.author?.bot) return; // ✅ 봇 메시지에는 반응 로그 기록 X

        const logChannel = client.channels.cache.get(reactionLogChannelId);
        if (logChannel && logChannel.isTextBased()) {
            const messageLink = `https://discord.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${reaction.message.id}`;

            const embed = new EmbedBuilder()
                .setTitle('👎 이모티콘 반응 제거 로그')
                .setColor('#FF0000')
                .setDescription(`<@${user.id}> (${user.tag}) 이(가) 메시지에서 반응을 제거했습니다.`)
                .addFields(
                    { name: '> **채널**', value: `<#${reaction.message.channel.id}> (${reaction.message.channel.id})` },
                    { name: '> **메시지**', value: `[바로가기](${messageLink})` },
                    { name: '> **이모티콘**', value: `${reaction.emoji.name}` },
                )
                .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                .setFooter({ text: `이모티콘이 제거되었습니다.` })
                .setTimestamp();

            await logChannel.send({ embeds: [embed] });
        }
    });
};
