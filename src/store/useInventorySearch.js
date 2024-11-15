import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useInventorySearch = defineStore('inventorySearch', () => {
    const type = ref('sku'); // 기본 검색 타입은 'sku'
    const keyword = ref('');

    const setSearchParams = (newType, newKeyword) => {
        type.value = newType;
        keyword.value = newKeyword;
    };

    const clean = () => {
        type.value = 'sku'; // 기본값으로 초기화
        keyword.value = '';
    };

    return { type, keyword, setSearchParams, clean };
});

export default useInventorySearch;
