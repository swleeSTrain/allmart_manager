import { ref, onMounted, onBeforeUnmount } from 'vue';

const useMemberMart = (listFn, includeAll = true) => {
    const result = ref({
        dtoList: [],
        totalCount: 0,
    });

    const loading = ref(false);
    const currentPage = ref(1);
    const selectedMartID = ref(null);
    const lastPage = ref(1);

    const loadMartPage = async (page) => {
        if (loading.value) return;

        loading.value = true;

        try {
            const data = await listFn(page);

            result.value.dtoList =
                page === 1
                    ? data.dtoList
                    : [...result.value.dtoList, ...data.dtoList];
            result.value.totalCount = data.totalCount;
            lastPage.value = Math.ceil(result.value.totalCount / 10);
        } catch (error) {
            console.error('마트 리스트 로드 실패:', error);
        } finally {
            loading.value = false;
        }
    };

    const scrollContainer = ref(null);
    const handleScroll = async () => {
        const container = scrollContainer.value;
        if (loading.value || !container) return;

        const nearEnd =
            container.scrollLeft + container.clientWidth >=
            container.scrollWidth - 10;

        if (nearEnd && currentPage.value < lastPage.value) {
            currentPage.value += 1;
            await loadMartPage(currentPage.value);
        }
    };

    onMounted(async () => {
        await loadMartPage(1);

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

    const handleMartClick = (martID) => {
        selectedMartID.value = martID;
    };

    return { result, loading, scrollContainer, selectedMartID,
        handleMartClick, loadMartPage,
    };
};

export default useMemberMart;
