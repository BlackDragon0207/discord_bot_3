const { 
    SlashCommandBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle 
} = require('discord.js');

const SIZE = 5; // 5x5 보드
const EMPTY = '🔶';
const PLAYER_X = '⚫';
const PLAYER_O = '⚪';

let games = new Map(); // 게임 상태 저장

module.exports = {
    data: new SlashCommandBuilder()
        .setName('오목')
        .setDescription('상대와 오목을 진행합니다.')
        .addUserOption(option =>
            option.setName('상대')
                .setDescription('대결할 상대를 선택하세요')
                .setRequired(true)
        ),

    async execute(interaction) {
        const opponent = interaction.options.getUser('상대');

        if (opponent.bot) {
            return interaction.reply({ content: '봇과는 오목을 할 수 없습니다!', ephemeral: true });
        }
        if (opponent.id === interaction.user.id) {
            return interaction.reply({ content: '자기 자신과는 오목을 할 수 없습니다!', ephemeral: true });
        }

        // 이미 게임 중인지 체크
        if (games.has(interaction.user.id) || games.has(opponent.id)) {
            return interaction.reply({ content: '이미 진행 중인 오목 게임이 있습니다!', ephemeral: true });
        }

        // 수락/거절 버튼 표시
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`accept_${interaction.user.id}_${opponent.id}`)
                .setLabel('✅ 수락')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId(`decline_${interaction.user.id}_${opponent.id}`)
                .setLabel('❌ 거절')
                .setStyle(ButtonStyle.Danger)
        );

        await interaction.reply({
            content: `${opponent}, ${interaction.user.username}님이 오목 대결을 신청했습니다! (30초 안에 선택하세요)`,
            components: [row]
        });

        // 버튼 대기 (상대방만 가능)
        const filter = i => 
            (i.customId.startsWith('accept_') || i.customId.startsWith('decline_')) 
            && i.user.id === opponent.id;

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 30000, max: 1 });

        collector.on('collect', async i => {
            const [action, challengerId, opponentId] = i.customId.split('_');

            if (action === 'decline') {
                return i.update({ content: `❌ ${opponent.username}님이 오목 대결을 거절했습니다.`, components: [] });
            }

            if (action === 'accept') {
                await i.update({ content: `✅ ${opponent.username}님이 오목 대결을 수락했습니다!\n게임을 시작합니다.`, components: [] });
                startGame(interaction, interaction.user, opponent);
            }
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                interaction.editReply({ content: `⏰ ${opponent.username}님이 응답하지 않아 게임이 취소되었습니다.`, components: [] });
            }
        });
    }
};

// 게임 시작
function startGame(interaction, challenger, opponent) {
    const board = Array.from({ length: SIZE }, () => Array(SIZE).fill(EMPTY));
    let turn = challenger.id; // 챌린저부터 시작
    const players = {
        [challenger.id]: PLAYER_X,
        [opponent.id]: PLAYER_O
    };

    games.set(challenger.id, { board, turn, challenger, opponent, players });
    games.set(opponent.id, { board, turn, challenger, opponent, players });

    renderBoard(interaction, challenger, opponent);
}

// 보드 UI 생성
function renderBoard(interaction, challenger, opponent) {
    const game = games.get(challenger.id);
    const { board, turn, players } = game;

    const createBoardComponents = (board) => {
        return board.map((row, y) => {
            const actionRow = new ActionRowBuilder();
            row.forEach((cell, x) => {
                actionRow.addComponents(
                    new ButtonBuilder()
                        .setCustomId(`omok_${challenger.id}_${opponent.id}_${x}_${y}`)
                        .setLabel(cell)
                        .setStyle(ButtonStyle.Secondary)
                );
            });
            return actionRow;
        });
    };

    interaction.followUp({
        content: `<@${turn}> (${players[turn]}) 차례입니다!`,
        components: createBoardComponents(board)
    });

    const filter = i => i.customId.startsWith(`omok_${challenger.id}_${opponent.id}_`) 
        && (i.user.id === challenger.id || i.user.id === opponent.id);

    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 600000 });

    collector.on('collect', async i => {
        const [_, cid, oid, x, y] = i.customId.split('_');
        const game = games.get(challenger.id);
        const { board, turn, players } = game;

        if (i.user.id !== turn) {
            return i.reply({ content: '지금은 당신 차례가 아닙니다!', ephemeral: true });
        }

        const xNum = parseInt(x);
        const yNum = parseInt(y);

        if (board[yNum][xNum] !== EMPTY) {
            return i.reply({ content: '이미 놓은 자리입니다!', ephemeral: true });
        }

        // 돌 두기
        board[yNum][xNum] = players[i.user.id];
        game.turn = (turn === cid) ? oid : cid;

        // 승리 체크
        const winner = checkWinner(board);
        if (winner) {
            games.delete(challenger.id);
            games.delete(opponent.id);
            return i.update({ content: `🎉 <@${i.user.id}> (${players[i.user.id]}) 승리!`, components: renderFinalBoard(board) });
        }

        // 무승부 체크 (빈칸 없음)
        if (board.flat().every(cell => cell !== EMPTY)) {
            games.delete(challenger.id);
            games.delete(opponent.id);
            return i.update({ content: '🤝 무승부! 보드가 가득 찼습니다.', components: renderFinalBoard(board) });
        }

        await i.update({ content: `<@${game.turn}> (${players[game.turn]}) 차례입니다!`, components: createBoardComponents(board) });
    });

    collector.on('end', () => {
        games.delete(challenger.id);
        games.delete(opponent.id);
    });
}

// 최종 보드 (버튼 비활성화, customId 고유하게 부여)
function renderFinalBoard(board) {
    return board.map((row, y) => {
        const actionRow = new ActionRowBuilder();
        row.forEach((cell, x) => {
            actionRow.addComponents(
                new ButtonBuilder()
                    .setCustomId(`final_${x}_${y}`) // 고유 ID
                    .setLabel(cell)
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(true)
            );
        });
        return actionRow;
    });
}

// 승리 체크 함수
function checkWinner(board) {
    for (let y = 0; y < SIZE; y++) {
        for (let x = 0; x < SIZE; x++) {
            const cell = board[y][x];
            if (cell === EMPTY) continue;

            // 가로
            if (x + 4 < SIZE && Array.from({ length: 5 }, (_, i) => board[y][x + i]).every(c => c === cell)) return cell;
            // 세로
            if (y + 4 < SIZE && Array.from({ length: 5 }, (_, i) => board[y + i][x]).every(c => c === cell)) return cell;
            // 대각선 \
            if (x + 4 < SIZE && y + 4 < SIZE && Array.from({ length: 5 }, (_, i) => board[y + i][x + i]).every(c => c === cell)) return cell;
            // 대각선 /
            if (x - 4 >= 0 && y + 4 < SIZE && Array.from({ length: 5 }, (_, i) => board[y + i][x - i]).every(c => c === cell)) return cell;
        }
    }
    return null;
}
