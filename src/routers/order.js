
const IndexPage = () => import("../pages/order/IndexPage.vue");
const OrderListPage = () => import("../pages/order/OrderListPage.vue");

const orderRouting ={
    path: '/order',
    component: IndexPage,
    children: [
        { path: 'list', component: OrderListPage },
    ]
}
export default orderRouting;