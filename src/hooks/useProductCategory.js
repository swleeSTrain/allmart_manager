import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';

const useProductCategory = (listFn, includeAll = true) => {
    const route = useRoute();

    const result = ref({
        dtoList: [],
        totalCount: 0,
    });

    const loading = ref(false);
    const currentPage = ref(1);
    const selectedCategoryID = ref(Number(route.query.categoryID) || null);
    const lastPage = ref(1);

    const scrollContainer = ref(null); // 드롭다운 컨테이너 참조

    const loadCategoryPage = async (page) => {
        if (loading.value) return;

        loading.value = true;
        try {
            const data = await listFn(page);

            // "전체" 항목 추가 (첫 페이지에서만 추가)
            if (page === 1 && includeAll) {
                data.dtoList.unshift({ categoryID: null, name: '전체' });
            }

            result.value.dtoList = page === 1
                ? data.dtoList
                : [...result.value.dtoList, ...data.dtoList];

            result.value.totalCount = data.totalCount;
            lastPage.value = Math.ceil(data.totalCount / 10);
        } catch (error) {
            console.error('카테고리 로드 실패:', error);
        } finally {
            loading.value = false;
        }
    };

    const handleScroll = async () => {
        if (loading.value) return;

        const container = scrollContainer.value;
        if (!container) return;

        const nearBottom =
            container.scrollTop + container.clientHeight >= container.scrollHeight - 10;

        if (nearBottom && currentPage.value < lastPage.value) {
            currentPage.value += 1;
            await loadCategoryPage(currentPage.value);
        }
    };

    onMounted(async () => {
        await loadCategoryPage(1);

        const container = scrollContainer.value;
        if (container) {
            container.addEventListener('scroll', handleScroll);
        }
    });

    onBeforeUnmount(() => {
        const container = scrollContainer.value;
        if (container) {
            container.removeEventListener('scroll', handleScroll);
        }
    });

    const handleCategoryClick = (categoryID) => {
        selectedCategoryID.value = categoryID;
    };

    return {
        result, loading, selectedCategoryID, scrollContainer,
        handleCategoryClick, loadCategoryPage
    };
};

export default useProductCategory;
