const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('프로필')
    .setDescription('프로필을 출력합니다.'),
  
  async execute(interaction) {
    try {
      const folderPath = path.join(__dirname, '..', 'profiles');
      const files = fs.readdirSync(folderPath)
        .filter(file => file.endsWith('.jpg'))
        .slice(0, 2);

      if (files.length < 2) {
        return interaction.reply({ content: '파일이 2개 이상 필요합니다.', ephemeral: true });
      }

      const attachments = files.map(file => new AttachmentBuilder(path.join(folderPath, file)));

      const embed1 = new EmbedBuilder()
        .setTitle('시로챤 프로필')
        .setColor('#ffabd7')
        .setImage(`attachment://${files[0]}`);

      const embed2 = new EmbedBuilder()
        .setColor('#ffabd7')
        .setImage(`attachment://${files[1]}`);

      await interaction.reply({ embeds: [embed1, embed2], files: attachments });

    } catch (error) {
      console.error(error);
      await interaction.reply({ content: '파일 전송 중 오류가 발생했습니다.', ephemeral: true });
    }
  }
};
