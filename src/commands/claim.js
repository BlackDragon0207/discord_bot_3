const { SlashCommandBuilder } = require('discord.js');
const itemManager = require('../managers/itemManager');
const inventoryManager = require('../managers/inventoryManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('획득')
        .setDescription('현재 채널에 등장한 전리품 획득을 시도합니다. (성공 확률 50%)'),

    name: '획득',

    async execute(interactionOrMessage) {
        const isInteraction = typeof interactionOrMessage.isChatInputCommand === 'function' && interactionOrMessage.isChatInputCommand();
        const channelId = interactionOrMessage.channel.id;
        const user = isInteraction ? interactionOrMessage.user : interactionOrMessage.author;

        // 1. 현재 채널에 스폰된 아이템 확인 (아이템을 소멸시키지 않고 조회만 진행)
        const currentItem = itemManager.getSpawnedItem(channelId);

        if (!currentItem) {
            const failMessage = '❌ 현재 이 채널에 등장한 전리품이 없거나, 이미 다른 유저가 선점했거나 10초가 지났습니다!';
            if (isInteraction) {
                return interactionOrMessage.reply({ content: failMessage, ephemeral: true });
            } else {
                return interactionOrMessage.reply({ content: failMessage, allowedMentions: { repliedUser: false } });
            }
        }

        // 2. 획득 확률 검사 (50% 확률: 0.5 미만)
        const isSuccess = Math.random() < 0.3;

        if (!isSuccess) {
            // 실패 시: 아이템을 채널에 유지하고 실패 메시지 출력
            const failChanceMessage = `🎲 **[30% 확률 실패!]** <@${user.id}>님이 **[${currentItem.title}]** 획득에 실패했습니다! (남은 시간 내 재시도 가능)`;
            
            if (isInteraction) {
                return interactionOrMessage.reply({ content: failChanceMessage });
            } else {
                return interactionOrMessage.reply({ content: failChanceMessage, allowedMentions: { repliedUser: false } });
            }
        }

        // 3. 50% 확률 성공 시: 아이템을 소멸시키고 획득 처리
        const claimedItem = itemManager.claimItem(channelId);

        if (!claimedItem) {
            // 주사위 굴리는 사이에 타임아웃이나 타 유저 선점이 일어난 경우 예외 처리
            const takenMessage = '❌ 아쉽게도 찰나의 순간에 아이템이 사라졌거나 다른 유저가 먼저 획득했습니다!';
            if (isInteraction) {
                return interactionOrMessage.reply({ content: takenMessage, ephemeral: true });
            } else {
                return interactionOrMessage.reply({ content: takenMessage, allowedMentions: { repliedUser: false } });
            }
        }

        // 유저 인벤토리에 아이템 저장
        inventoryManager.addItem(user.id, claimedItem);

        // 성공 Embed 생성
        const claimEmbed = claimedItem.createClaimEmbed
            ? claimedItem.createClaimEmbed(user)
            : null;

        if (isInteraction) {
            return interactionOrMessage.reply({ embeds: claimEmbed ? [claimEmbed] : [] });
        } else {
            return interactionOrMessage.reply({ embeds: claimEmbed ? [claimEmbed] : [] });
        }
    },
};