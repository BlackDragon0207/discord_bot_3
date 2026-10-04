const { EmbedBuilder } = require('discord.js');

module.exports = {
    id: 'item_13',
    title: '히트눈나의 여우꼬리',
    description: '히트눈나의 꼬리 중 하나',
    image: 'https://cdn.discordapp.com/attachments/1505894518468116591/1545827205962272908/pngtree-fox-tail-closeup-png-image_16586563.png?ex=6a9d8f45&is=6a9c3dc5&hm=be8c73c21e0381283b069b9c0f9880e1673882f2a9edca62f7483dbe9c4f13a9&',
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
