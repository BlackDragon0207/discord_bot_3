const { EmbedBuilder } = require('discord.js');

module.exports = {
    id: 'item_19',
    title: '레이챤의 귀',
    description: '레이챤의 양쪽 귀',
    image: 'https://cdn.discordapp.com/attachments/1505894518468116591/1545829346818916363/5d7ec361d53aa0d8f60f0fb286590c84.png?ex=6a9d9144&is=6a9c3fc4&hm=3303c29f0d5c1328b442fc58da4a4eb05afda8174ac8c660facdbac22530de3e&',
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
