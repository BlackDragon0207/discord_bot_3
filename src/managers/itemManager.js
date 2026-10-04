// src/managers/itemManager.js
const spawnedItems = new Map();
const activeTimers = new Map();

module.exports = {
    // 특정 채널에 전리품 스폰 및 10초 타이머 등록
    setSpawnedItem(channelId, item, onTimeout) {
        // 기존 진행 중인 타이머가 있다면 확실히 정리
        this.clearSpawnedItem(channelId);

        spawnedItems.set(channelId, item);

        // 10초 타이머 설정
        const timer = setTimeout(() => {
            if (spawnedItems.has(channelId)) {
                // 10초 미획득 시 스폰 상태 삭제
                this.clearSpawnedItem(channelId);
                
                if (typeof onTimeout === 'function') {
                    onTimeout();
                }
            }
        }, 10000);

        activeTimers.set(channelId, timer);
    },

    // 현재 채널에 등장해서 획득 대기 중인 전리품이 있는지 확인
    getSpawnedItem(channelId) {
        return spawnedItems.get(channelId);
    },

    // 유저가 전리품을 획득할 때 호출 (타이머 중지 및 스폰 상태 즉시 제거)
    claimItem(channelId) {
        const item = spawnedItems.get(channelId);
        if (item) {
            this.clearSpawnedItem(channelId); // 획득 즉시 삭제하여 추가 획득 및 중복 스폰 방지
            return item;
        }
        return null;
    },

    // 스폰 상태 및 타이머 완전히 초기화
    clearSpawnedItem(channelId) {
        if (activeTimers.has(channelId)) {
            clearTimeout(activeTimers.get(channelId));
            activeTimers.delete(channelId);
        }
        spawnedItems.delete(channelId);
    }
};