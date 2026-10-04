const {  ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder, ActivityType, Client, GatewayIntentBits, Events, Partials, Collection, EmbedBuilder, ClientUser, messageLink } = require('discord.js');
//const { token, logChannelId } = require('./config.json');
const path = require('path');
const { readdirSync } = require('fs');
const fs = require('fs');
require('dotenv/config');
const messageCreateHandler = require('./src/events/messageCreate'); // messageCreate 이벤트 핸들러 추가
// 아이템 스폰 관리 모듈 불러오기
const itemManager = require('./src/managers/itemManager');

// 클라이언트 초기화
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessageReactions, // 이모티콘 반응 감지
        GatewayIntentBits.GuildVoiceStates, // 보이스 감지
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.Reaction,
    ],
});

client.commands = new Collection();

// 설정 값 (필요시 process.env 또는 config 파일로 관리 가능)
const TARGET_CHANNEL_ID = '1148982021754986576';
const SPAWN_CHANCE = 0.01; // 등장 확률 (0.5 = 50%)

// item 폴더 안의 모든 .js 아이템 파일 로드 함수
function loadItems() {
    const itemDirPath = path.join(__dirname, 'item');
    if (!fs.existsSync(itemDirPath)) {
        fs.mkdirSync(itemDirPath);
    }

    const files = fs.readdirSync(itemDirPath).filter(file => file.endsWith('.js'));
    const items = [];

    for (const file of files) {
        delete require.cache[require.resolve(path.join(itemDirPath, file))];
        const item = require(path.join(itemDirPath, file));
        items.push(item);
    }
    return items;
}

// 에러 로그 함수 추가
async function sendErrorLog(errorMessage) {
    console.error(`[ERROR LOG] ${errorMessage}`);
    // 추가적인 로깅 로직이 필요하면 여기에 구현
    // 예: 특정 채널에 에러 메시지 전송
    // const logChannel = await client.channels.fetch(process.env.LOG_CHANNEL_ID);
    // if (logChannel) {
    //     await logChannel.send(`⚠️ 오류 발생: ${errorMessage}`);
    // }
}

// 명령어 파일 불러오기 - 절대 경로로 src/commands 지정
const commandsPath = path.join(__dirname, 'src', 'commands');
const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));

console.debug(`명령어 파일을 로드 중: ${commandFiles.length}개의 파일 발견`);

for (const file of commandFiles) {
    try {
        // 명령어 파일 로드 (src/commands 폴더에서)
        const command = require(path.join(commandsPath, file));
        if (command.data && command.data.name) {
            client.commands.set(command.data.name, command);
            console.debug(`명령어 로드 완료: ${command.data.name}`);
        } else {
            throw new Error(`명령어 파일 구조가 잘못되었습니다: ${file}`);
        }
    } catch (error) {
        console.error(`명령어 파일 로드 실패 (${file}):`, error);
        sendErrorLog(`명령어 파일 로드 실패 (${file}): ${error.message}`);
    }
}

// logs 폴더 안의 모든 파일을 읽어와서 모듈화된 코드로 실행
const logsPath = path.join(__dirname, 'src', 'logs');
fs.readdirSync(logsPath).forEach(file => {
    if (file.endsWith('.js')) {
        require(path.join(logsPath, file))(client);
    }
});


const securityPath = path.join(__dirname, "src", "security");
const securityFiles = fs.readdirSync(securityPath).filter(file => file.endsWith(".js"));

for (const file of securityFiles) {
    const securityEvent = require(path.join(securityPath, file));
    if (securityEvent.name) {
        client.on(securityEvent.name, (...args) => securityEvent.execute(...args));
    }
}


// 봇 준비 이벤트
client.once('ready', async () => {

    messageCreateHandler(client); // ✅ messageCreate 이벤트 핸들러 등록
    const messages = [
        '나의 작은 아기고양이(私の小さな子猫たち)',
        '개발자:흑룡'
    ];
    let current = 0;
    
    setInterval(() => {
        client.user.setPresence({
            activities: [{ name: `${messages[current]}`, type: ActivityType.Watching }],
            status: 'idle',
        });
        
        current = (current + 1) % messages.length;
    }, 7500);
    
    console.log(`${client.user.tag}로 로그인 되었습니다!`);
    console.debug(`현재 서버에 연결된 길드 수: ${client.guilds.cache.size}`);
});


// index.js (messageCreate 이벤트 부분)
// index.js (messageCreate 이벤트 부분)


client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const channelId = message.channel.id;
    const content = message.content.trim();

    // 1. [!획득] 명령어
    if (content === '!획득') {
        const claimCommand = client.commands.get('획득');
        if (claimCommand) {
            try {
                await claimCommand.execute(message);
            } catch (error) {
                console.error('획득 명령어 실행 중 오류:', error);
            }
        }
        return;
    }

    // 2. [!전리품] 명령어
    if (content === '!전리품') {
        const inventoryCommand = client.commands.get('전리품');
        if (inventoryCommand) {
            try {
                await inventoryCommand.execute(message);
            } catch (error) {
                console.error('아이템 목록 명령어 실행 중 오류:', error);
            }
        }
        return;
    }

    // 지정된 채널이 아니라면 스폰 로직을 건너뜀
    if (channelId !== TARGET_CHANNEL_ID) return;

    // 3. 🔥 핵심: 이미 채널에 획득되지 않은 전리품이 등장해 있다면 추가 스폰 방지
    if (itemManager.getSpawnedItem(channelId)) {
        return; // 현재 남아있는 아이템이 있으므로 더 이상 스폰하지 않고 종료
    }

    // 4. 전리품이 없는 상태일 때만 확률 체크 후 새로 스폰
    if (Math.random() < SPAWN_CHANCE) {
        const items = loadItems();
        if (items.length === 0) return;

        const selectedItem = items[Math.floor(Math.random() * items.length)];

        // 10초 타임아웃 발생 시 처리
        const onTimeout = async () => {
            try {
                await message.channel.send({
                    content: `⏰ 10초 동안 아무도 획득하지 않아 **[${selectedItem.title}]** 전리품이 사라졌습니다!`
                });
            } catch (error) {
                console.error('타임아웃 메시지 전송 실패:', error);
            }
        };

        // 스폰 등록 (아이템 등록 + 10초 타이머 가동)
        itemManager.setSpawnedItem(channelId, selectedItem, onTimeout);

        // 스폰 임베드 송신
        const spawnEmbed = selectedItem.createSpawnEmbed ? selectedItem.createSpawnEmbed() : null;
        if (spawnEmbed) {
            await message.channel.send({ embeds: [spawnEmbed] });
        }
    }
});

// 명령어 인터랙션 이벤트
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    console.debug(`명령어 실행 요청: ${interaction.commandName}`);

    const command = client.commands.get(interaction.commandName);

    if (!command) {
        console.debug(`명령어를 찾을 수 없음: ${interaction.commandName}`);
        return;
    }
    try {
        await command.execute(interaction);
        console.debug(`명령어 실행 성공: ${interaction.commandName}`);
    } catch (error) {
        console.error(`명령어 실행 중 오류 발생: ${interaction.commandName}`, error);
        sendErrorLog(`명령어 실행 중 오류 발생: ${error.message}\n\n명령어: ${interaction.commandName}`);
        await interaction.reply({ content: '명령어 실행 중 오류가 발생했습니다.', ephemeral: true });
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton() || !interaction.customId.startsWith('ms_')) return;

    const game = client.minesweeperGames?.get(interaction.message.id);
    if (!game || game.gameOver) {
        return interaction.reply({ content: '게임이 없거나 종료되었습니다.', ephemeral: true });
    }

    const [_, x, y] = interaction.customId.split('_');
    const cell = game.board[Number(y)][Number(x)];

    if (cell === '💣') {
        game.gameOver = true;
        return interaction.update({ content: '💥 지뢰를 밟았습니다! 게임 종료.', components: [] });
    }

    game.reveal(Number(x), Number(y));

    const { renderBoard } = require('./src/commands/minesweeper');
    const rows = renderBoard(game, false);

    if (game.victory) {
        return interaction.update({ content: '🎉 모든 안전 칸을 열었습니다! 승리!', components: rows });
    }

    await interaction.update({ content: '💣 지뢰찾기 진행 중...', components: rows });
});



// 클라이언트 로그인
client.login(process.env.token).then(() => {
    console.log('봇이 성공적으로 로그인 되었습니다.');
}).catch(error => {
    console.error('로그인 중 오류 발생:', error);
});

