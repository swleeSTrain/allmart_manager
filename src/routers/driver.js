
const IndexPage = () => import("../pages/driver/IndexPage.vue");
const DriverListPage = () => import("../pages/driver/DriverListPage.vue");
const DriverAddPage = () => import("../pages/driver/DriverAddPage.vue");

const driverRouting ={
    path: '/driver',
    component: IndexPage,
    meta: { requiresMartAdmin: true },
    children: [
        { path: 'list', component: DriverListPage },
        { path: 'add', component: DriverAddPage }
    ]
}
export default driverRouting;