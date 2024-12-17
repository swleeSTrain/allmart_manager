const BoardListPage = () => import("../pages/board/BoardListPage.vue");
const BoardReadPage = () => import("../pages/board/BoardReadPage.vue");
const BoardAddPage = () => import("../pages/board/BoardAddPage.vue");
const BoardUpdatePage = () => import("../pages/board/BoardUpdatePage.vue");

const boardRouting={
    path: '/board',
    children: [
        { path: "list", component: BoardListPage},
        {
            path: "",
            redirect: (to) => {
                return { path: '/board/list', query: { page: to.query.page || '1', type: to.query.type || 'all', keyword: to.query.keyword || '' } };
            }
        },
        { path: "read/:bno", component: BoardReadPage,
            props: (route) => ({
                bno: route.params.bno,
                page: route.query.page,
                type: route.query.type,
                keyword: route.query.keyword
            }) },
        { path: "update/:bno", component: BoardUpdatePage, props: (route) => ({
                bno: route.params.bno,
                page: route.query.page,
                type: route.query.type,
                keyword: route.query.keyword
            }) },
        { path: "add", component: BoardAddPage}
    ]

}

export default boardRouting;