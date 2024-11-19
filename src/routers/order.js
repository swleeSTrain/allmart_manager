
const IndexPage = () => import("../pages/order/IndexPage.vue");
const OrderListPage = () => import("../pages/order/OrderListPage.vue");
const OrderReadPage = () => import("../pages/order/OrderReadPage.vue");

const orderRouting ={
    path: '/order',
    component: IndexPage,
    children: [
        { path: 'list', component: OrderListPage },
        { path: 'read/:orderId', component: OrderReadPage },
    ]
}
export default orderRouting;