const IndexPage = () => import( "../pages/inventory/IndexPage.vue");
const InventoryListPage = () => import("../pages/inventory/InventoryListPage.vue");


const inventoryRouting = {
    path: '/inventories',
    component: IndexPage,
    meta: { requiresMartAdmin: true },
    children: [
        { path: 'list', component: InventoryListPage },
    ],
};

export default inventoryRouting;