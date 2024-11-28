
const IndexPage = () => import("../pages/member/IndexPage.vue");
const MemberSignUp = () => import("../pages/member/MemberSingUpPage.vue");
const MemberSignIn = () => import("../pages/member/MemberSignInPage.vue");

const memberRouting ={
    path: '/member',
    component: IndexPage,
    children: [
        { path: 'signUp', component: MemberSignUp },
        { path: 'signIn', component: MemberSignIn },
    ]
}
export default memberRouting;