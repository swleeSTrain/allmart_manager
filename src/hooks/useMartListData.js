import { computed, ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const useMartListData = (listFn) => {
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
        pageRequestDTO: { page: 1, size: 10 },
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
            type: searchParams.value.type === 'all' ? 'martName&phoneNumber' : searchParams.value.type,
            keyword: searchParams.value.keyword || null
        };

        const data = await fn(page, apiSearchParams);
        result.value = data;
        currentPage.value = page;

        const query = {
            page,
            ...(searchParams.value.type !== 'all' && searchParams.value.type ? { type: searchParams.value.type } : {}),
            ...(searchParams.value.keyword && { keyword: searchParams.value.keyword })
        };
        router.replace({ path: route.path, query });
        loading.value = false;
    };

    const pageArr = computed(() => {
        const currentPageValue = result.value.current;
        const lastPage = Math.ceil(currentPageValue / 10.0) * 10;
        const start = lastPage - 9;
        const pageArr = [];
        if (result.value.prev) pageArr.push({ page: start - 1, label: 'PREV' });
        result.value.pageNumList.forEach((page) => pageArr.push({ page, label: page }));
        if (result.value.next) pageArr.push({ page: lastPage + 1, label: 'NEXT' });
        return pageArr;
    });

    onMounted(() => {
        const page = parseInt(route.query.page, 10) || 1;
        searchParams.value = {
            type: route.query.type || 'all',
            keyword: route.query.keyword || ''
        };
        loadPageData(page);
    });

    watch(refresh, () => loadPageData(currentPage.value));

    const search = () => loadPageData(1);

    const onEnterKey = (event) => {
        if (event.key === 'Enter') search();
    };

    const cleanAndLoad = async () => {
        searchParams.value.type = 'all';
        searchParams.value.keyword = '';
        await loadPageData(1);
    };

    const moveToRead = (martID) => {
        const query = {
            page: currentPage.value,
            type: searchParams.value.type,
            ...(searchParams.value.keyword && { keyword: searchParams.value.keyword })
        };
        router.push({ path: `/mart/read/${martID}`, query });
    };

    const moveToAdd = () => {
        const query = {
            page: currentPage.value,
            type: searchParams.value.type,
            ...(searchParams.value.keyword && { keyword: searchParams.value.keyword })
        };
        router.push({ path: `/mart/add`, query });
    };

    return {
        loading, result, pageArr, searchParams, loadPageData,
        search, onEnterKey, cleanAndLoad, moveToRead, moveToAdd
    };
};

export default useMartListData;
