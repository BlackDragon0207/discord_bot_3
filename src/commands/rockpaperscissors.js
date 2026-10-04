const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('가위바위보')
    .setDescription('봇과 가위바위보를 합니다!'),

  async execute(interaction) {
    const emojiMap = {
      rock: '✊',
      paper: '✋',
      scissors: '✌️',
    };

    const options = [
      { label: '가위', value: 'scissors', emoji: '✌️' },
      { label: '바위', value: 'rock', emoji: '✊' },
      { label: '보', value: 'paper', emoji: '✋' },
    ];

    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('rps_select')
        .setPlaceholder('가위, 바위, 보 중 하나를 선택하세요!')
        .addOptions(options)
    );

    await interaction.reply({
      content: '가위바위보! 아래에서 선택하세요.',
      components: [row],
      ephemeral: true,
    });

    const collector = interaction.channel.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      time: 15000,
      max: 1,
    });

    collector.on('collect', async (i) => {
      if (i.user.id !== interaction.user.id) {
        return i.reply({ content: '이 선택 메뉴는 당신을 위한 것입니다.', ephemeral: true });
      }

      const userChoice = i.values[0];
      const choices = ['rock', 'paper', 'scissors'];
      const botChoice = choices[Math.floor(Math.random() * choices.length)];

      let result = '';
      if (userChoice === botChoice) result = '⚖️ 무승부';
      else if (
        (userChoice === 'rock' && botChoice === 'scissors') ||
        (userChoice === 'paper' && botChoice === 'rock') ||
        (userChoice === 'scissors' && botChoice === 'paper')
      ) {
        result = '🎉 승리';
      } else {
        result = '💥 패배';
      }

      await i.update({ content: '결과를 공개했습니다!', components: [] });

      const embed = new EmbedBuilder()
        .setTitle('🎮 가위바위보 결과')
        .setColor(0x00bfff)
        .addFields(
          { name: '도전자', value: `<@${i.user.id}>`, inline: true },
          { name: '유저 선택', value: `${emojiMap[userChoice]}`, inline: true },
          { name: '봇 선택', value: `${emojiMap[botChoice]}`, inline: true },
          { name: '결과', value: result, inline: false }
        )
        .setTimestamp();

      await interaction.channel.send({ embeds: [embed] });
    });

    collector.on('end', async (collected) => {
      if (collected.size === 0) {
        await interaction.editReply({ content: '시간 초과로 가위바위보가 취소되었습니다.', components: [] });
      }
    });
  },
};
