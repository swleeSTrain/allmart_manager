import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePage } from '../store/usePage';
import { useInventorySearch } from '../store/useInventorySearch';

const useInventoryListData = (listFn) => {
    const route = useRoute();
    const router = useRouter();

    const inventorySearch = useInventorySearch();
    const pageStore = usePage();

    const loading = ref(false);
    const result = ref({
        dtoList: [],
        pageNumList: [], // 항상 빈 배열로 초기화
        totalPage: 0,
        currentPage: 1,
        totalCount: 0,
        prev: false,
        next: false,
    });

    const searchParams = computed(() => ({
        type: inventorySearch.type,
        keyword: inventorySearch.keyword,
    }));

    const currentPage = computed(() => pageStore.currentPage);

    const loadPageData = async (page) => {
        loading.value = true;

        const apiSearchParams = {
            type: searchParams.value.type,
            keyword: searchParams.value.keyword || null,
        };

        try {
            const data = await listFn(page, apiSearchParams);
            result.value = data;
        } catch (error) {
            console.error('Error loading inventory data:', error);
        } finally {
            loading.value = false;
        }

        pageStore.setCurrentPage(page);

        const query = {
            page,
            ...(searchParams.value.keyword && {
                type: searchParams.value.type,
                keyword: searchParams.value.keyword,
            }),
        };

        router.replace({
            path: route.path,
            query,
        });
    };

    const pageArr = computed(() => {
        const pageNumList = result.value.pageNumList || []; // undefined일 경우 빈 배열 사용
        const currentPageValue = result.value.currentPage;
        const prev = result.value.prev;
        const next = result.value.next;

        const pageArr = [];

        if (prev) {
            pageArr.push({ page: currentPageValue - 1, label: 'PREV' });
        }

        pageNumList.forEach((page) => {
            pageArr.push({ page, label: page });
        });

        if (next) {
            pageArr.push({ page: currentPageValue + 1, label: 'NEXT' });
        }

        return pageArr;
    });

    onMounted(() => {
        const page = route.query.page ? parseInt(route.query.page, 10) : pageStore.currentPage;
        inventorySearch.setSearchParams(route.query.type || 'sku', route.query.keyword || '');
        loadPageData(page);
    });

    const search = () => {
        loadPageData(1);
    };

    const cleanAndLoad = async () => {
        inventorySearch.clean();
        pageStore.clean();
        await loadPageData(1);
    };

    return {
        loading,
        result,
        searchParams,
        currentPage,
        pageArr,
        loadPageData,
        search,
        cleanAndLoad,
    };
};

export default useInventoryListData;
