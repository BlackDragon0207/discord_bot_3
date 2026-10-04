const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '../../data.json');

function loadData() {
    if (!fs.existsSync(dataFilePath)) {
        fs.writeFileSync(dataFilePath, '{}', 'utf8');
    }
    try {
        const raw = fs.readFileSync(dataFilePath, 'utf8');
        return raw ? JSON.parse(raw) : {};
    } catch (err) {
        console.error('❌ 데이터 파일 읽기 오류:', err);
        return {};
    }
}

function saveData(data) {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('학습')
        .setDescription('키워드에 대한 응답을 학습시킵니다.')
        .addStringOption(option =>
            option.setName('키워드')
                .setDescription('학습할 키워드')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('응답')
                .setDescription('저장할 응답')
                .setRequired(true)),

    async execute(interaction) {
        // 🔥 무조건 먼저 (3초 제한 방지)
        await interaction.deferReply({ ephemeral: true });

        try {
            const keyword = interaction.options.getString('키워드').trim();
            const response = interaction.options.getString('응답').trim();

            const data = loadData();

            if (!data[keyword]) {
                data[keyword] = [];
            }

            // 중복 방지
            if (data[keyword].includes(response)) {
                return await interaction.editReply(`⚠️ 이미 존재하는 응답입니다.`);
            }

            data[keyword].push(response);
            saveData(data);

            await interaction.editReply(`✅ \`${keyword}\`에 응답이 학습되었습니다:\n\`${response}\``);

        } catch (err) {
            console.error('❌ 학습 명령어 오류:', err);

            // 🔥 절대 reply 쓰지 말고 상태 체크 후 처리
            if (interaction.deferred || interaction.replied) {
                await interaction.editReply('❌ 명령어 실행 중 오류가 발생했습니다.');
            } else {
                await interaction.reply({
                    content: '❌ 명령어 실행 중 오류가 발생했습니다.',
                    ephemeral: true
                });
            }
        }
    }
};