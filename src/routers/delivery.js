import DeliveryDashboardPage from "../pages/delivery/DeliveryDashboardPage.vue";
import DeliveryOrdersPage from "../pages/delivery/DeliveryOrdersPage.vue";

const IndexPage = () => import("../pages/delivery/IndexPage.vue");


const deliveryRouting ={
    path: '/delivery',
    component: IndexPage,
    children: [
        {path: 'dashboard', component: DeliveryDashboardPage},
        {path: "orders", component: DeliveryOrdersPage},
    ]
}
export default deliveryRouting;