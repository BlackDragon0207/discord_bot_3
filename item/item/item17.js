const { EmbedBuilder } = require('discord.js');

module.exports = {
    id: 'item_17',
    title: '골댕눈나의 옷',
    description: '골댕눈나가 입던 옷',
    image: 'https://cdn.discordapp.com/attachments/1505894518468116591/1545828308967759903/5220564.png?ex=6a9d904c&is=6a9c3ecc&hm=2dc7d5d41087e0e7446255d10016b3750df15b21643b1a370bb33dada3996b28&',
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
