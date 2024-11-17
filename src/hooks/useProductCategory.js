import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';

const useProductCategory = (listFn, includeAll = true) => {

    const route = useRoute(); // 쿼리스트링 접근

    const result = ref({
        dtoList: [],
        totalCount: 0,
    });

    const loading = ref(false);
    const currentPage = ref(1);
    const selectedCategoryID = ref(Number(route.query.categoryID) || null);
    const lastPage = ref(1);

    const loadCategoryPage = async (page) => {

        if (loading.value) return;

        loading.value = true;

        try {
            const data = await listFn(page);

            // "전체" 항목 추가, includeAll을 false로 호출하면 추가 안됨
            if (page === 1 && includeAll) {
                data.dtoList.unshift({ categoryID: null, name: '전체' });
            }

            result.value.dtoList =
                page === 1
                    ? data.dtoList
                    : [...result.value.dtoList, ...data.dtoList];
            result.value.totalCount = data.totalCount; // 값 띄우려면 여기 추가

            lastPage.value = Math.ceil(result.value.totalCount / 10);

        } catch (error) {
            console.error('카테고리 로드 실패:', error);
        } finally {
            loading.value = false;
        }
    };


    // 스크롤 관련 상태
    const scrollContainer = ref(null);
    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;

    const handleMouseDown = (e) => {
        isDragging = true;
        startX = e.pageX - scrollContainer.value.offsetLeft;
        scrollLeft = scrollContainer.value.scrollLeft;
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const x = e.pageX - scrollContainer.value.offsetLeft;
        const walk = (x - startX) * 2; // 스크롤 속도
        scrollContainer.value.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => (isDragging = false);

    const handleScroll = async () => {
        if (loading.value) return;

        const container = scrollContainer.value;
        const nearEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 10;

        if (nearEnd) {
            currentPage.value += 1;

            if(lastPage.value >= currentPage.value) {

                console.log("Last Page: " + lastPage.value);
                console.log("Current Page: " + currentPage.value);

                await loadCategoryPage(currentPage.value);
            }
        }
    };

    onMounted(async () => {

        await loadCategoryPage(1);

        const container = scrollContainer.value;

        if(container) {

            container.addEventListener('scroll', handleScroll);
            container.addEventListener('mousedown', handleMouseDown);
            container.addEventListener('mousemove', handleMouseMove);
            container.addEventListener('mouseup', handleMouseUp);
            container.addEventListener('mouseleave', handleMouseUp);
        }
    });

    onBeforeUnmount(() => {

        const container = scrollContainer.value;

        if(container) {

            container.removeEventListener('scroll', handleScroll);
            container.removeEventListener('mousedown', handleMouseDown);
            container.removeEventListener('mousemove', handleMouseMove);
            container.removeEventListener('mouseup', handleMouseUp);
            container.removeEventListener('mouseleave', handleMouseUp);
        }
    });

    const handleCategoryClick = (categoryID) => {

        selectedCategoryID.value = categoryID;
    };


    return {
        result, loading, selectedCategoryID, scrollContainer,
        handleCategoryClick, loadCategoryPage,
    };
};

export default useProductCategory;
