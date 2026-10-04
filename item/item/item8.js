const { EmbedBuilder } = require('discord.js');

module.exports = {
    id: 'item_8',
    title: '시로챤의 닌텐도 2',
    description: '섹시하고 귀엽고 엣치치한 고양이가 쓰던 닌텐도 2',
    image: 'https://cdn.discordapp.com/attachments/1505894518468116591/1545432241776238652/sp_1.png?ex=6a9c1f6f&is=6a9acdef&hm=5b6e5e64f78707e0e7998d4ccd176fd21fa5c52a3fbe3fcdaffddee6c713ffc1&', // 외부 URL 또는 로컬 경로
    color: '#eda3ff',

    // 스폰 시 Embed (이미지를 작은 썸네일 형식으로 설정)
    createSpawnEmbed() {
        const embed = new EmbedBuilder()
            .setTitle(`✨ 전리품이 떨어졌습니다! (20초 제한)`)
            .addFields(
                { name: '전리품명', value: this.title, inline: true },
                { name: '설명', value: this.description }
            )
            .setDescription(`⏱️ **20초 안에** \`/획득\` 또는 \`!획득\`을 입력해 획득하세요!`)
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