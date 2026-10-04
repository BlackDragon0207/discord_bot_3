const { EmbedBuilder } = require('discord.js');

module.exports = {
    id: 'item_10',
    title: '주작눈나의 깃털',
    description: '주작눈나가 흘린 깃털',
    image: 'https://cdn.discordapp.com/attachments/1505894518468116591/1545826075236630688/79589aa6608665ceefb2b085a256b7437d3a3afeaf92440e0fa5aa1493e3c3bc.png?ex=6a9d8e38&is=6a9c3cb8&hm=fa5cc638fcb323f0a232be07a65b22ff01203abbe84cfa60bf5eaaec6574b392&',
    color: '#FFD700',

    createSpawnEmbed() {
        const embed = new EmbedBuilder()
            .setTitle(`✨ 전리품이 떨어졌습니다! (20초 제한)`)
            .addFields(
                { name: '아이템명', value: this.title, inline: true },
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
