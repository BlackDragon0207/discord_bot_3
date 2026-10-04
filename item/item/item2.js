const { EmbedBuilder } = require('discord.js');

module.exports = {
    id: 'item_2',
    title: '시로챤의 빤스',
    description: '섹시하고 귀엽고 엣치치한 고양이의 빤쓰',
    image: 'https://cdn.discordapp.com/emojis/1403360100399452162.png', // 외부 URL 또는 로컬 경로
    color: '#eda3ff',

    // 스폰 시 Embed (이미지를 작은 썸네일 형식으로 설정)
    createSpawnEmbed() {
        const embed = new EmbedBuilder()
            .setTitle(`✨ 전리품이 떨어졌습니다! (10초 제한)`)
            .addFields(
                { name: '전리품명', value: this.title, inline: true },
                { name: '설명', value: this.description }
            )
            .setDescription(`⏱️ **10초 안에** \`/획득\` 또는 \`!획득\`을 입력해 획득하세요!`)
            .setColor(this.color)
            .setTimestamp();

        // setImage 대신 setThumbnail을 사용하여 이미지를 작게 표시
        if (this.image && this.image.startsWith('http')) {
            embed.setThumbnail(this.image);
        }

        return embed;
    },

    // 획득 시 Embed
    createClaimEmbed(user) {
        const embed = new EmbedBuilder()
            .setTitle(`🎉 전리품 획득 성공!`)
            .setDescription(`<@${user.id}>님이 **[${this.title}]**을(를) 가장 먼저 획득하셨습니다!`)
            .addFields({ name: '전리품 설명', value: this.description })
            .setColor('#00FF7F')
            .setTimestamp();

        if (this.image && this.image.startsWith('http')) {
            embed.setThumbnail(this.image);
        }

        return embed;
    }
};