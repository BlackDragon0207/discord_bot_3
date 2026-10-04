const { EmbedBuilder } = require("discord.js");

const spamMap = new Map();
const SPAM_LIMIT = 10; // 허용 메시지 개수
const SPAM_TIME = 10000; // 10초 기준
const TIMEOUT_DURATION = 60000; // 1분 타임아웃

const SERVER_1_ID = process.env.SERVER_1_ID; // 서버 1 ID
const LOG_CHANNELS = {
    [SERVER_1_ID]: process.env.LOG_CHANNEL_1
};

module.exports = {
    name: "messageCreate",
    execute: async (message) => {
        if (message.author.bot || !message.guild) return;

        // 특정 2개의 서버에서만 작동
        if (![SERVER_1_ID].includes(message.guild.id)) return;

        const now = Date.now();
        const userSpam = spamMap.get(message.author.id) || [];

        userSpam.push(now);
        spamMap.set(message.author.id, userSpam.filter(time => now - time < SPAM_TIME));

        if (spamMap.get(message.author.id).length > SPAM_LIMIT) {
            await message.member.timeout(TIMEOUT_DURATION, "스팸 감지");
            await message.channel.send(`${message.author}, 🚨 **과도한 메시지 전송이 감지되어 1분 동안 타임아웃 되었습니다.**`);
            spamMap.delete(message.author.id);

            console.log(`[보안] ${message.author.tag} 스팸 감지 및 타임아웃`);

            // 서버별 로그 채널 ID 가져오기
            const logChannelId = LOG_CHANNELS[message.guild.id];
            if (logChannelId) {
                const logChannel = message.guild.channels.cache.get(logChannelId);
                if (logChannel) {
                    const embed = new EmbedBuilder()
                        .setColor("Orange")
                        .setTitle("🚨 과도한 메시지 전송 감지")
                        .setDescription(`**사용자:** ${message.author.tag} (${message.author.id})\n**채널:** ${message.channel}`)
                        .setTimestamp();
                    logChannel.send({ embeds: [embed] });
                }
            }
        }
    }
};
