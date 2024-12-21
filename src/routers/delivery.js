import DeliveryDashboardPage from "../pages/delivery/DeliveryDashboardPage.vue";

const IndexPage = () => import("../pages/delivery/IndexPage.vue");


const deliveryRouting ={
    path: '/delivery',
    component: IndexPage,
    meta: { requiresMartAdmin: true },
    children: [
        {path: 'dashboard', component: DeliveryDashboardPage},

    ]
}
export default deliveryRouting;