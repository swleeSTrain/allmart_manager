
const IndexPage = () => import("../pages/product/IndexPage.vue");
const ProductListPage = () => import("../pages/product/ProductListPage.vue");

const productRouting ={
    path: '/product',
    component: IndexPage,
    children: [
        { path: 'question/list', component: ProductListPage }
    ]
}
export default productRouting;