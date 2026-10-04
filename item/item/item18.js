const { EmbedBuilder } = require('discord.js');

module.exports = {
    id: 'item_18',
    title: '주작눈나의 빨간잡지',
    description: '주작눈나가 읽던 빨간잡지',
    image: 'https://cdn.discordapp.com/attachments/1505894518468116591/1546035917469515776/d705de3b-3dfb-4d9d-a915-146b3f154f44.png?ex=6a9e51a6&is=6a9d0026&hm=53ff62e8f13b4ab0a9e396289b575eeb11f1ab119aff56566e7b575713250da2&',
    color: '#FFD700',

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

        if (this.image && this.image.startsWith('http')) {
            embed.setThumbnail(this.image);
        }

        return embed;
    },

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
