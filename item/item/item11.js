const { EmbedBuilder } = require('discord.js');

module.exports = {
    id: 'item_11',
    title: '단팥눈나의 단팥빵',
    description: '단팥눈나가 가지고 있던 단팥빵',
    image: 'https://cdn.discordapp.com/attachments/1505894518468116591/1545826503428677762/2014-2-20_event7.png?ex=6a9d8e9e&is=6a9c3d1e&hm=9b118777e7e121991006d054d72ac96b8b71709e058b382b8ecc9327daecb5fd&',
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
