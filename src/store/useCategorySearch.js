import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCategorySearch = defineStore('search', () => {
    const type = ref('name');
    const keyword = ref('');

    const setSearchParams = (newType, newKeyword, newTags) => {
        type.value = newType;
        keyword.value = newKeyword;
    };

    const clean = () => {
        type.value = 'all';
        keyword.value = '';
    };

    return { type, keyword, setSearchParams, clean };
});

export default useCategorySearch;
