
const IndexPage = () => import("../pages/category/IndexPage.vue");
const CategoryAddPage = () => import("../pages/category/CategoryAddPage.vue");

const categoryRouting ={
    path: '/category',
    component: IndexPage,
    children: [
        { path: 'add', component: CategoryAddPage },
    ]
}
export default categoryRouting;