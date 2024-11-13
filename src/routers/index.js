import {createRouter, createWebHistory} from "vue-router";
import productRouting from "./product.js";

const MainPage = () => import("../pages/MainPage.vue")


const routeConfig = createRouter({
    history: createWebHistory(),
    routes: [
        {path: "/", component: MainPage},
        productRouting
    ]
})

export default routeConfig;