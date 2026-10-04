const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('메시지를 대신 전송합니다.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator) // 🔒 관리자만 사용 가능
        .addStringOption(option =>
            option.setName('내용')
                .setDescription('보낼 메시지')
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('채널')
                .setDescription('보낼 채널 (선택)')
                .setRequired(false))
        .addBooleanOption(option =>
            option.setName('멘션허용')
                .setDescription('멘션 허용 여부 (기본: false)')
                .setRequired(false)),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        try {
            const content = interaction.options.getString('내용');
            const targetChannel = interaction.options.getChannel('채널') || interaction.channel;
            const allowMentions = interaction.options.getBoolean('멘션허용') ?? false;

            if (!targetChannel || !targetChannel.isTextBased()) {
                return await interaction.editReply('❌ 메시지를 보낼 수 없는 채널입니다.');
            }

            await targetChannel.send({
                content: content,
                allowedMentions: allowMentions
                    ? { parse: ['users', 'roles', 'everyone'] }
                    : { parse: [] }
            });

            await interaction.editReply(`✅ 메시지를 ${targetChannel} 채널에 전송했습니다.`);

        } catch (err) {
            console.error('❌ say 명령어 오류:', err);

            if (interaction.deferred || interaction.replied) {
                await interaction.editReply('❌ 메시지 전송 중 오류가 발생했습니다.');
            } else {
                await interaction.reply({
                    content: '❌ 메시지 전송 중 오류가 발생했습니다.',
                    ephemeral: true
                });
            }
        }
    }
};