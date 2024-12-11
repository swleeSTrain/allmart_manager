
const IndexPage = () => import("../pages/category/IndexPage.vue");
const CategoryAddPage = () => import("../pages/category/CategoryAddPage.vue");
const CategoryListPage = () => import("../pages/category/CategoryListPage.vue");
const CategoryEditPage = () => import("../pages/category/CategoryEditPage.vue");

const categoryRouting ={
    path: '/category',
    component: IndexPage,
    meta: { requiresSystemAdmin: true },
    children: [
        { path: 'list', component: CategoryListPage },
        { path: 'add', component: CategoryAddPage },
        { path: 'edit/:categoryID', component: CategoryEditPage },
    ]
}
export default categoryRouting;