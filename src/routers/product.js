
const IndexPage = () => import("../pages/product/IndexPage.vue");
const ProductListPage = () => import("../pages/product/ProductListPage.vue");
const ProductAddPage = () => import("../pages/product/ProductAddPage.vue");
const ProductReadPage = () => import("../pages/product/ProductReadPage.vue");
const ProductEditPage = () => import("../pages/product/ProductEditPage.vue");

const productRouting ={
    path: '/product',
    component: IndexPage,
    meta: { requiresMartAdmin: true },
    children: [
        { path: 'list', component: ProductListPage },
        { path: 'add', component: ProductAddPage },
        { path: 'read/:productID', component: ProductReadPage },
        { path: 'edit/:productID', component: ProductEditPage },
    ]
}
export default productRouting;