
import { defineStore } from 'pinia';
import { ref } from 'vue';

const usePage = defineStore('page', () => {
    const currentPage = ref(1)

    const setCurrentPage = (page) => {
        currentPage.value = page;
    }

    const clean = () => {
        currentPage.value = 1;
    };

    return { currentPage, setCurrentPage, clean };
})

export default usePage;