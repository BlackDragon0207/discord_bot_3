// src/managers/inventoryManager.js
const fs = require('fs');
const path = require('path');

// 프로젝트 최상위 루트에 있는 data/inventory.json 지정
// (src/managers -> src -> 최상위 루트 -> data)
const dataDirPath = path.join(__dirname, '..', '..', 'data');
const dataFilePath = path.join(dataDirPath, 'inventory.json');

// 데이터 폴더 및 파일 존재 확인 및 자동 생성
function ensureDataFile() {
    if (!fs.existsSync(dataDirPath)) {
        fs.mkdirSync(dataDirPath, { recursive: true });
    }
    if (!fs.existsSync(dataFilePath)) {
        fs.writeFileSync(dataFilePath, JSON.stringify({}, null, 2), 'utf-8');
    }
}

// 파일에서 인벤토리 데이터 불러오기
function loadData() {
    ensureDataFile();
    try {
        const fileData = fs.readFileSync(dataFilePath, 'utf-8');
        return JSON.parse(fileData);
    } catch (error) {
        console.error('인벤토리 데이터 로드 실패:', error);
        return {};
    }
}

// 파일에 인벤토리 데이터 저장하기
function saveData(data) {
    ensureDataFile();
    try {
        fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error('인벤토리 데이터 저장 실패:', error);
    }
}

module.exports = {
    // 아이템 추가 및 데이터 저장
    addItem(userId, item) {
        const inventories = loadData();

        if (!inventories[userId]) {
            inventories[userId] = [];
        }

        const userInventory = inventories[userId];
        const existingItem = userInventory.find(i => i.id === item.id);

        if (existingItem) {
            existingItem.count += 1;
        } else {
            userInventory.push({
                id: item.id,
                title: item.title,
                description: item.description,
                count: 1
            });
        }

        saveData(inventories);
    },

    // 유저의 인벤토리 목록 반환
    getInventory(userId) {
        const inventories = loadData();
        return inventories[userId] || [];
    }
};