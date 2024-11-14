
const IndexPage = () => import("../pages/category/IndexPage.vue");
const CategoryAddPage = () => import("../pages/category/CategoryAddPage.vue");
const CategoryListPage = () => import("../pages/category/CategoryListPage.vue");

const categoryRouting ={
    path: '/category',
    component: IndexPage,
    children: [
        { path: 'list', component: CategoryListPage },
        { path: 'add', component: CategoryAddPage },
    ]
}
export default categoryRouting;