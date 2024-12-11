import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const useQnaListData = (listFn) => {
    const route = useRoute();
    const router = useRouter();

    const loading = ref(false);
    const result = ref({
        dtoList: [],
        pageNumList: [],
        totalPage: 0,
        currentPage: 1,
        totalCount: 0,
        prev: false,
        next: false,
    });

    const searchParams = ref({
        type: 'title',
        keyword: '',
    });

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
            console.error('Error loading Q&A data:', error);
        } finally {
            loading.value = false;
        }

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
        const pageNumList = result.value.pageNumList || [];
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
        const page = route.query.page ? parseInt(route.query.page, 10) : 1;
        searchParams.value.type = route.query.type || 'title';
        searchParams.value.keyword = route.query.keyword || '';
        loadPageData(page);
    });

    const search = () => {
        loadPageData(1);
    };

    const cleanAndLoad = async () => {
        searchParams.value = { type: 'title', keyword: '' };
        await loadPageData(1);
    };

    return {
        loading,
        result,
        searchParams,
        pageArr,
        loadPageData,
        search,
        cleanAndLoad,
    };
};

export default useQnaListData;
