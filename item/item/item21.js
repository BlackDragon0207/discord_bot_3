const { EmbedBuilder } = require('discord.js');

module.exports = {
    id: 'item_21',
    title: '단팥눈나의 야겜',
    description: '단팥눈나가 하던 야겜',
    image: 'https://cdn.discordapp.com/attachments/1505894532430954526/1546180505698050078/video-game-emoji-clipart-xl.png?ex=6a9ed84f&is=6a9d86cf&hm=006267949cd77a3e3bd76db360e1b9e647d90c68ed2e053ef550e3bc1bdd95e3&',
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
