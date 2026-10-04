const { EmbedBuilder } = require('discord.js');

module.exports = {
    id: 'item_12',
    title: '루팡눈나의 월급',
    description: '루팡눈나가 떨어뜨린 월급',
    image: 'https://cdn.discordapp.com/attachments/1505894518468116591/1545430341211127819/bills-money-dollar_24877-84044.png?ex=6a9c1daa&is=6a9acc2a&hm=29e8234c32327ca50ebe579a70920d3c1b2769da7b684664e054db6deb7189be&',
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
