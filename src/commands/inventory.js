// src/commands/inventory.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const inventoryManager = require('../managers/inventoryManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('전리품')
        .setDescription('내가 보유한 전리품 목록을 확인합니다.'),

    name: '전리품', // !아이템 호환용

    async execute(interactionOrMessage) {
        const isInteraction = interactionOrMessage.isChatInputCommand && interactionOrMessage.isChatInputCommand();
        const user = isInteraction ? interactionOrMessage.user : interactionOrMessage.author;

        const inventory = inventoryManager.getInventory(user.id);

        const embed = new EmbedBuilder()
            .setTitle(`🎒 ${user.displayName}님의 전리품 가방`)
            .setColor('#3498DB')
            .setTimestamp();

        if (inventory.length === 0) {
            embed.setDescription('보유 중인 전리품이 없습니다. 채널에서 전리품을 획득해 보세요!');
        } else {
            const itemListStr = inventory
                .map((item, index) => `${index + 1}. **${item.title}** (x${item.count})\n└ *${item.description}*`)
                .join('\n\n');

            embed.setDescription(itemListStr);
        }

        if (isInteraction) {
            return interactionOrMessage.reply({ embeds: [embed] });
        } else {
            return interactionOrMessage.reply({ embeds: [embed] });
        }
    }
};