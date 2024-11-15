import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useProductSearch = defineStore('search', () => {
    const type = ref('');
    const keyword = ref('');
    const category = ref('');

    const setSearchParams = (newType, newKeyword, newCategory) => {
        type.value = newType;
        keyword.value = newKeyword;
        category.value = newCategory;
    };

    const clean = () => {
        type.value = 'all';
        keyword.value = '';
        category.value = null;
    };

    return { type, keyword, category, setSearchParams, clean };
});

export default useProductSearch;
