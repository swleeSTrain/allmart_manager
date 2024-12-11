


const IndexPage = () => import("../pages/flyer/IndexPage.vue")
const flyerUpload =  ()=> import("../pages/flyer/FlyerFileUploadPage.vue")
const flyerList = () => import("../pages/flyer/FlyerVideoOrImageListPage.vue")
const flyerRequestList = () => import("../pages/flyer/FlyerRequestListPage.vue")
const flyerRegister =  ()=> import("../pages/flyer/FlyerVideoRegisterPage.vue")

const flyerRouting = ({
    path: '/flyer',
    component: IndexPage,
    meta: { requiresSystemAdmin: true },
    children: [
        { path: 'upload', component: flyerUpload },
        { path: 'list', component: flyerList},
        { path: 'request', component: flyerRequestList},
        { path: 'register', component: flyerRegister},

    ]

})
export default flyerRouting