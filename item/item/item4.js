const { EmbedBuilder } = require('discord.js');

module.exports = {
    id: 'item_4',
    title: '루팡눈나의 월급',
    description: '루팡눈나가 떨어뜨린 월급',
    image: 'https://cdn.discordapp.com/attachments/1505894518468116591/1545430341211127819/bills-money-dollar_24877-84044.png?ex=6a9c1daa&is=6a9acc2a&hm=29e8234c32327ca50ebe579a70920d3c1b2769da7b684664e054db6deb7189be&', // 외부 URL 또는 로컬 경로
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