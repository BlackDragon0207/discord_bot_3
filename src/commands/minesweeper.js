const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const MinesweeperGame = require('../games/minesweeperEngine');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('지뢰찾기')
        .setDescription('버튼으로 즐기는 지뢰찾기 게임! (5x5 고정)')
        .addIntegerOption(opt =>
            opt.setName('지뢰')
                .setDescription('지뢰 개수 (1~15)')
                .setMinValue(1)
                .setMaxValue(15)),

    async execute(interaction) {
        // 게임 저장 Map 초기화
        interaction.client.minesweeperGames ??= new Map();

        const minesInput = interaction.options.getInteger('지뢰') || 5;
        const mines = Math.min(Math.max(minesInput, 1), 15); // 1~15 제한

        const width = 5;
        const height = 5;
        const game = new MinesweeperGame(width, height, mines);

        // 버튼 메시지 생성
        const rows = renderBoard(game, true);
        const msg = await interaction.reply({ 
            content: `💣 지뢰찾기 시작! (5x5, 지뢰 ${mines}개)`, 
            components: rows,
            fetchReply: true
        });

        // 메시지 ID 기준으로 게임 저장 → 모든 사용자 참여 가능
        interaction.client.minesweeperGames.set(msg.id, game);
    }
};

// 버튼 UI로 보드 렌더링
function renderBoard(game, hidden = true) {
    const rows = [];
    for (let y = 0; y < game.height; y++) {
        const row = new ActionRowBuilder();
        for (let x = 0; x < game.width; x++) {
            const cell = game.board[y][x];
            const revealed = game.revealed[y][x];

            let label = '⬜';
            if (!hidden && revealed) {
                if (cell === '💣') label = '💣';
                else if (cell === 0) label = '\u200b';
                else label = String(cell);
            }

            row.addComponents(
                new ButtonBuilder()
                    .setCustomId(`ms_${x}_${y}`)
                    .setLabel(label)
                    .setStyle(ButtonStyle.Secondary)
            );
        }
        rows.push(row);
    }
    return rows;
}

module.exports.renderBoard = renderBoard;
