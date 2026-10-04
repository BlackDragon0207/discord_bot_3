const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const TARGET_CHANNEL_ID = '1410916679101317161';
const MENTION_USER_ID = '435800525389430804'; // 🔥 멘션할 유저 ID

module.exports = {
    data: new SlashCommandBuilder()
        .setName('문의')
        .setDescription('문의 내용을 전송합니다.')
        .addStringOption(option =>
            option.setName('내용')
                .setDescription('문의 내용')
                .setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        try {
            const content = interaction.options.getString('내용');
            const user = interaction.user;

            const targetChannel = interaction.client.channels.cache.get(TARGET_CHANNEL_ID);

            if (!targetChannel || !targetChannel.isTextBased()) {
                return await interaction.editReply('❌ 문의 채널을 찾을 수 없습니다.');
            }

            // 📦 Embed 생성
            const embed = new EmbedBuilder()
                .setColor(0x5865F2)
                .setTitle('📩 새로운 문의')
                .addFields(
                    { name: '👤 유저', value: `${user.tag} (${user.id})`, inline: false },
                    { name: '💬 내용', value: content, inline: false }
                )
                .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                .setTimestamp();

            // 📩 유저 멘션 + embed 전송
            await targetChannel.send({
                content: `<@${MENTION_USER_ID}>`,
                embeds: [embed],
                allowedMentions: {
                    users: [MENTION_USER_ID] // 🔥 이 유저만 멘션 허용
                }
            });

            await interaction.editReply('✅ 문의가 정상적으로 전달되었습니다.');

        } catch (err) {
            console.error('❌ 문의 명령어 오류:', err);

            if (interaction.deferred || interaction.replied) {
                await interaction.editReply('❌ 문의 전송 중 오류가 발생했습니다.');
            } else {
                await interaction.reply({
                    content: '❌ 문의 전송 중 오류가 발생했습니다.',
                    ephemeral: true
                });
            }
        }
    }
};