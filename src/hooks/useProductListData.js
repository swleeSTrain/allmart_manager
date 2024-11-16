import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const useProductListData = (listFn) => {
    const fn = listFn;
    const route = useRoute();
    const router = useRouter();
    const loading = ref(false);
    const refresh = ref(false);

    const currentPage = ref(parseInt(route.query.page, 10) || 1);

    const searchParams = ref({
        type: route.query.type || 'all',
        keyword: route.query.keyword || ''
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
        loading.value = true;

        const apiSearchParams = {
            ...searchParams.value,
            type: searchParams.value.type === 'all' ? 'name&sku' : searchParams.value.type,
            keyword: searchParams.value.keyword || null
        };

        const data = await fn(page, apiSearchParams);
        result.value = data;
        loading.value = false;

        currentPage.value = page;

        const query = {
            page,
            ...(searchParams.value.keyword && {
                type: searchParams.value.type,
                keyword: searchParams.value.keyword
            })
        };

        router.replace({
            path: route.path,
            query
        });
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
        const page = parseInt(route.query.page, 10) || currentPage.value;
        searchParams.value.type = route.query.type || 'all';
        searchParams.value.keyword = route.query.keyword || '';

        loadPageData(page);
    });

    watch(refresh, () => {
        loadPageData(currentPage.value);
    });

    const search = () => {
        loadPageData(1);
    };

    const onEnterKey = (event) => {
        if (event.key === 'Enter') {
            search();
        }
    };

    const cleanAndLoad = async () => {
        searchParams.value.type = 'all';
        searchParams.value.keyword = '';
        currentPage.value = 1;
        await loadPageData(1);
    };

    const moveToRead = (productID) => {
        const query = {
            page: currentPage.value,
            ...(searchParams.value.keyword && {
                type: searchParams.value.type,
                keyword: searchParams.value.keyword
            })
        };

        router.push({
            path: `/product/read/${productID}`,
            query
        });
    };

    const moveToAdd = () => {
        const query = {
            page: currentPage.value,
            ...(searchParams.value.keyword && {
                type: searchParams.value.type,
                keyword: searchParams.value.keyword
            })
        };

        router.push({
            path: `/product/add`,
            query
        });
    };

    return {
        loading, route, router, refresh, result,
        pageArr, loadPageData, searchParams, search,
        onEnterKey, cleanAndLoad, moveToRead, moveToAdd
    };
};

export default useProductListData;
