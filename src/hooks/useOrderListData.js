import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePage } from '../store/usePage';
import { useOrderSearch } from '../store/useOrderSearch.js';

const useOrderListData = (listFn) => {
    const fn = listFn;
    const route = useRoute();
    const router = useRouter();
    const loading = ref(false);
    const refresh = ref(false);

    const pageStore = usePage();
    const searchStore = useOrderSearch();
    const currentPage = computed(() => pageStore.currentPage);

    const searchParams = ref({
        type: 'customerId',
        keyword: searchStore.keyword || ''
    });

    const result = ref({
        dtoList: [],
        pageNumList: [],
        pageRequestDTO: {
            page: 1,
            size: 10
        },
        totalCount: 0,
        totalPage: 0,
        current: 1,
        prev: false,
        next: false
    });

    const loadPageData = async (page) => {
        try {
            loading.value = true;

            const apiSearchParams = {
                ...searchParams.value,
                keyword: searchParams.value.keyword || null,
            };

            console.log('API 요청:', apiSearchParams); // API 요청 로그

            const data = await fn(page, apiSearchParams);

            console.log('API 응답:', data); // API 응답 로그

            result.value = data;
            loading.value = false;

            pageStore.setCurrentPage(page);
            searchStore.setSearchParams(searchParams.value.type, searchParams.value.keyword);

            // 항상 검색 조건 포함
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
        } catch (error) {
            console.error('API 요청 실패:', error); // 에러 로그
            loading.value = false;
        }
    };



    const pageArr = computed(() => {
        const currentPageValue = result.value.current;
        let lastPage = Math.ceil(currentPageValue / 10.0) * 10;
        const start = lastPage - 9;
        const prev = result.value.prev;
        const next = result.value.next;

        const pageArr = [];

        if (prev) {
            pageArr.push({ page: start - 1, label: 'PREV' });
        }

        result.value.pageNumList.forEach(page => {
            pageArr.push({ page, label: page });
        });

        if (next) {
            pageArr.push({ page: lastPage + 1, label: 'NEXT' });
        }

        return pageArr;
    });

    onMounted(() => {
        const page = route.query.page ? parseInt(route.query.page, 10) : pageStore.currentPage;
        searchParams.value.type = route.query.type || 'customerId';
        searchParams.value.keyword = route.query.keyword || searchStore.keyword || '';
        loadPageData(page);
    });

    watch(refresh, () => {
        loadPageData(route.query.page || 1);
    });



    const search = () => {
        searchStore.setSearchParams(searchParams.value.type, searchParams.value.keyword);
        loadPageData(1, true);
    };

    const onEnterKey = (event) => {
        if (event.key === 'Enter') {
            search();
        }
    };

    const cleanAndLoad = async () => {
        pageStore.clean();
        searchStore.clean();

        searchParams.value.keyword = searchStore.keyword;
        await loadPageData(1);
    };

    const moveToRead = (orderID) => {

        console.log(orderID);

        const query = {
            page: currentPage.value,
            ...(searchParams.value.keyword && {
                type: searchParams.value.type,
                keyword: searchParams.value.keyword
            })
        };

        router.push({
            path: `/order/read/${orderID}`,
            query
        });
    };

    return {
        loading, route, router, refresh,
        result, pageArr, loadPageData, searchParams,
        search, onEnterKey, cleanAndLoad, moveToRead
    };
};

export default useOrderListData;
