import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSearch = defineStore('search', () => {
    const type = ref('all');  // 기본값을 'all'로 설정
    const keyword = ref('');
    const tags = ref([]); // 태그 상태 추가

    const setSearchParams = (newType, newKeyword, newTags) => {
        type.value = newType;
        keyword.value = newKeyword;
        tags.value = newTags; // 태그 업데이트
    };

    const clean = () => {
        type.value = 'all';
        keyword.value = '';
        tags.value = []; // 태그 초기화
    };

    return { type, keyword, tags, setSearchParams, clean };
});

export default useSearch;
