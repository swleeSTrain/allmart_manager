
const IndexPage = () => import( "../pages/mart/IndexPage.vue");
const MartListPage = () => import("../pages/mart/MartListPage.vue");
const MartAddPage = () => import("../pages/mart/MartAddPage.vue");
const MartReadPage = () => import("../pages/mart/MartReadPage.vue");
const MartEditPage = () => import("../pages/mart/MartEditPage.vue");

const martRouting = {
    path: '/mart',
    component: IndexPage,
    meta: { requiresSystemAdmin: true }, // SYSTEMADMIN 권한 필요
    children: [
        { path: 'list', component: MartListPage },
        { path: 'add', component: MartAddPage },
        { path: 'read/:martID', component: MartReadPage },
        { path: 'edit/:martID', component: MartEditPage },
    ],
};

export default martRouting;