
const IndexPage = () => import("../pages/product/IndexPage.vue");
const ProductListPage = () => import("../pages/product/ProductListPage.vue");
const ProductAddPage = () => import("../pages/product/ProductAddPage.vue");

const productRouting ={
    path: '/product',
    component: IndexPage,
    children: [
        { path: 'list', component: ProductListPage },
        { path: 'add', component: ProductAddPage },
    ]
}
export default productRouting;