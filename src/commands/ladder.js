const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('사다리')
        .setDescription('사다리 타기 게임을 합니다.')
        .addStringOption(option =>
            option.setName('유저들')
                .setDescription('참여할 유저 멘션들을 띄어쓰기로 구분')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('선택수')
                .setDescription('당첨될 인원 수')
                .setRequired(true)
                .setMinValue(1)
        ),

    async execute(interaction) {
        const userInput = interaction.options.getString('유저들');
        const selectCount = interaction.options.getInteger('선택수');

        // 멘션에서 유저 ID 추출
        const userMentions = userInput.match(/<@!?(\d+)>/g);
        if (!userMentions || userMentions.length === 0) {
            return interaction.reply({ content: '유효한 유저 멘션을 입력해주세요!', ephemeral: true });
        }

        const participants = [...new Set(userMentions)]; // 중복 제거

        if (selectCount > participants.length) {
            return interaction.reply({ content: '선택 수가 참가자 수보다 많습니다!', ephemeral: true });
        }

        // 사다리 결과 랜덤 선택
        const winners = participants.sort(() => Math.random() - 0.5).slice(0, selectCount);
        const losers = participants.filter(user => !winners.includes(user));

        const resultMessage = `🎯 **사다리 결과** 🎯\n\n` +
            `✅ 당첨 (${selectCount}명): ${winners.join(', ')}\n` +
            `❌ 탈락: ${losers.length > 0 ? losers.join(', ') : '없음'}`;

        await interaction.reply(resultMessage);
    }
};
