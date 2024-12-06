


const IndexPage = () => import("../pages/flyer/IndexPage.vue")
const flyerUpload =  ()=> import("../pages/flyer/FlyerFileUploadPage.vue")
const flyerList = () => import("../pages/flyer/FlyerVideoOrImageListPage.vue")
const flyerRequestList = () => import("../pages/flyer/FlyerRequestListPage.vue")

const flyerRouting = ({
    path: '/flyer',
    component: IndexPage,
    children: [
        { path: 'upload', component: flyerUpload },
        { path: 'list', component: flyerList},
        { path: 'request', component: flyerRequestList},
    ]

})
export default flyerRouting