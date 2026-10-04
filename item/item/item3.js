const { EmbedBuilder } = require('discord.js');

module.exports = {
    id: 'item_3',
    title: '공기님의 가위',
    description: '공기님이 무언가를 자를 때 쓰는 가위',
    image: 'https://cdn.discordapp.com/attachments/1505894518468116591/1545430062457688185/833fa88eae073a583699cc737f0b8a91.png?ex=6a9c1d67&is=6a9acbe7&hm=c1402eabd1658203a90882ef96a81f7c742791a6a3305faa18c8209f24c9a72d&', // 외부 URL 또는 로컬 경로
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