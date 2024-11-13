import {createRouter, createWebHistory} from "vue-router";
import productRouting from "./product.js";
import categoryRouting from "./category.js";

const MainPage = () => import("../pages/MainPage.vue")


const routeConfig = createRouter({
    history: createWebHistory(),
    routes: [
        {path: "/", component: MainPage},
        productRouting,
        categoryRouting
    ]
})

export default routeConfig;