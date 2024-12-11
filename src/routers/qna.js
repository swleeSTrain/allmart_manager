

const IndexPage = () => import("../pages/qna/IndexPage.vue");
const QnaListPage = () => import("../pages/qna/QnaListPage.vue");
const QnaRegisterPage = () => import("../pages/qna/QnaRegisterPage.vue");
const QnaReadPage = () => import("../pages/qna/QnaReadPage.vue");
const QnaEditPage = () => import("../pages/qna/QnaEditPage.vue");

const qnaRouting = {
    path: "/qna",
    component: IndexPage,
    meta: { requiresMartAdmin: true },
    children: [
        { path: "list", component: QnaListPage },
        { path: "add", component: QnaRegisterPage },
        { path: "read/:qno", component: QnaReadPage },
        { path: "edit/:qno", component: QnaEditPage },
    ],
};

export default qnaRouting;
