const { EmbedBuilder } = require('discord.js');

module.exports = {
    id: 'item_20',
    title: '딸부기의 등껍질',
    description: '딸부기 등에 있는 등껍질',
    image: 'https://cdn.discordapp.com/attachments/1505894518468116591/1545829566751440896/VB3CWTOVGktQTd26GtXmf-2yi577pk17bcfSeIpiLhJYiy67AJTC1IOHwguEXK40QWtTEhbKACDROGG7bG0lgw.png?ex=6a9d9178&is=6a9c3ff8&hm=bebbc6ff32959425b1fc83270b976b12ba550977d8e2101b6e832c16a023abdb&',
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
