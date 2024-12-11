

const IndexPage = () => import("../pages/banner/IndexPage.vue");
const bannerImage = () => import("../pages/banner/BannerPage.vue");

const bannerRouting ={
    path: '/banner',
    component: IndexPage,
    children: [
        {path: 'image', component: bannerImage},

    ]
}
export default bannerRouting;