const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType } = require('discord.js');
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
        .setName('학습제거')
        .setDescription('학습된 키워드에 연결된 응답을 선택하여 제거합니다.')
        .addStringOption(option =>
            option.setName('키워드')
                .setDescription('응답을 제거할 키워드')
                .setRequired(true)),

    async execute(interaction) {
        const keyword = interaction.options.getString('키워드').trim();
        const data = loadData();

        if (!data[keyword]) {
            return interaction.reply({
                content: `❗️ \`${keyword}\`에 해당하는 학습 내용이 없습니다.`,
                ephemeral: true
            });
        }

        const responses = data[keyword];

        // 응답이 하나뿐이면 바로 삭제
        if (responses.length === 1) {
            delete data[keyword];
            saveData(data);
            return interaction.reply(`✅ \`${keyword}\`의 유일한 응답 \`${responses[0]}\`이(가) 삭제되었습니다.`);
        }

        // 선택 메뉴 생성
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('unlearn_select')
            .setPlaceholder('제거할 응답을 선택하세요')
            .addOptions(responses.map((resp, index) => ({
                label: resp.slice(0, 100),
                description: `응답 ${index + 1}`,
                value: String(index)
            })));

        const row = new ActionRowBuilder().addComponents(selectMenu);

        // 🔥 메시지 객체 가져오기 (핵심)
        const message = await interaction.reply({
            content: `📝 \`${keyword}\`에 연결된 응답 중 제거할 항목을 선택하세요:`,
            components: [row],
            ephemeral: true,
            fetchReply: true
        });

        const collector = message.createMessageComponentCollector({
            componentType: ComponentType.StringSelect,
            time: 30000 // 30초
        });

        collector.on('collect', async i => {
            // 🔥 인터랙션 먼저 acknowledge
            await i.deferUpdate();

            const selectedIndex = parseInt(i.values[0], 10);
            const removed = responses.splice(selectedIndex, 1);

            if (responses.length === 0) {
                delete data[keyword];
            }

            saveData(data);

            await interaction.editReply({
                content: `✅ \`${keyword}\`에서 응답 \`${removed[0]}\`이(가) 제거되었습니다.`,
                components: []
            });

            collector.stop();
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                interaction.editReply({
                    content: '⏰ 시간 초과로 응답 선택이 취소되었습니다.',
                    components: []
                }).catch(() => {});
            }
        });
    }
};