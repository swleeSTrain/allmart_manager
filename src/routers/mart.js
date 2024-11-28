const IndexPage = () => import( "../pages/inventory/IndexPage.vue");
const MartListPage = () => import("../pages/mart/MartListPage.vue");
const MartAddPage = () => import("../pages/mart/MartAddPage.vue");


const inventoryRouting = {
    path: '/mart',
    component: IndexPage,
    children: [
        { path: 'list', component: MartListPage },
        { path: 'add', component: MartAddPage },
    ],
};

export default inventoryRouting;