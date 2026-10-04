const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// 💡 여기에 개발자(본인)의 디스코드 유저 ID를 입력하세요.
const DEVELOPER_ID = '435800525389430804';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('전리품등록')
        .setDescription('[개발자 전용] 새로운 전리품 아이템을 등록합니다.')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('전리품 이름을 입력하세요')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('description')
                .setDescription('전리품 설명을 입력하세요')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('image')
                .setDescription('전리품 이미지 링크(URL)를 입력하세요')
                .setRequired(true)),

    async execute(interaction) {
        // 1. 개발자 권한 검증
        if (interaction.user.id !== DEVELOPER_ID) {
            return interaction.reply({
                content: '❌ 이 명령어는 봇 개발자만 사용할 수 있습니다.',
                ephemeral: true
            });
        }

        const name = interaction.options.getString('name');
        const description = interaction.options.getString('description');
        const imageUrl = interaction.options.getString('image');

        const itemDirPath = path.join(__dirname, '..', '..', 'item');

        // item 폴더가 없다면 생성
        if (!fs.existsSync(itemDirPath)) {
            fs.mkdirSync(itemDirPath, { recursive: true });
        }

        // 2. item 폴더 내 기존 파일들을 탐색하여 다음 순번(숫자) 결정
        const files = fs.readdirSync(itemDirPath);
        let maxIndex = 0;

        files.forEach(file => {
            // item1.js, item10.js 등에서 숫자 부분만 추출
            const match = file.match(/^item(\d+)\.js$/);
            if (match) {
                const currentIndex = parseInt(match[1], 10);
                if (currentIndex > maxIndex) {
                    maxIndex = currentIndex;
                }
            }
        });

        const nextIndex = maxIndex + 1;
        const fileName = `item${nextIndex}.js`;
        const filePath = path.join(itemDirPath, fileName);
        const itemId = `item_${nextIndex}`;

        // 3. 새로 생성될 아이템 파일 내용 템플릿
        const fileContent = `const { EmbedBuilder } = require('discord.js');

module.exports = {
    id: '${itemId}',
    title: '${name}',
    description: '${description}',
    image: '${imageUrl}',
    color: '#FFD700',

    createSpawnEmbed() {
        const embed = new EmbedBuilder()
            .setTitle(\`✨ 전리품이 떨어졌습니다! (10초 제한)\`)
            .addFields(
                { name: '전리품명', value: this.title, inline: true },
                { name: '설명', value: this.description }
            )
            .setDescription(\`⏱️ **10초 안에** \\\`/획득\\\` 또는 \\\`!획득\\\`을 입력해 획득하세요!\`)
            .setColor(this.color)
            .setTimestamp();

        if (this.image && this.image.startsWith('http')) {
            embed.setThumbnail(this.image);
        }

        return embed;
    },

    createClaimEmbed(user) {
        const embed = new EmbedBuilder()
            .setTitle(\`🎉 전리품 획득 성공!\`)
            .setDescription(\`<@\${user.id}>님이 **[\${this.title}]**을(를) 가장 먼저 획득하셨습니다!\`)
            .addFields({ name: '전리품 설명', value: this.description })
            .setColor('#00FF7F')
            .setTimestamp();

        if (this.image && this.image.startsWith('http')) {
            embed.setThumbnail(this.image);
        }

        return embed;
    }
};
`;

        // 4. 파일 생성
        try {
            fs.writeFileSync(filePath, fileContent, 'utf-8');
            
            return interaction.reply({
                content: `✅ 성공적으로 새 전리품이 등록되었습니다!\n📄 **파일명**: \`${fileName}\`\n🏷️ **아이템명**: ${name}`,
                ephemeral: true
            });
        } catch (error) {
            console.error('전리품 등록 중 파일 생성 오류:', error);
            return interaction.reply({
                content: '❌ 전리품 파일 생성 중 오류가 발생했습니다.',
                ephemeral: true
            });
        }
    }
};