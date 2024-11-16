
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useProductPage = defineStore('page', () => {
    const currentPage = ref(1)

    const setCurrentPage = (page) => {
        currentPage.value = page;
    }

    const clean = () => {
        currentPage.value = 1;
    };

    return { currentPage, setCurrentPage, clean };
})

export default useProductPage