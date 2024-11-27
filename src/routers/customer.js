


const IndexPage = () => import( "../pages/customer/IndexPage.vue");
const CustomerRegisterPage = () => import("../pages/customer/CustomerRegisterPage.vue");
const CustomerListPage = () => import( "../pages/customer/CustomerListPage.vue");


const customerRouting = {
    path: '/customer',
    component: IndexPage,
    children: [
        { path: 'register', component: CustomerRegisterPage },
        { path: '', component: CustomerListPage},
    ],
};

export default customerRouting;