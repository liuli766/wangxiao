import Vue from "vue";
import VueRouter, { Route } from "vue-router";
import store from "@/store";
// @ts-ignore
import VueWechatTitle from "vue-wechat-title";
Vue.use(VueRouter);
Vue.use(VueWechatTitle);
const routes = [
    {
        path: "/",
        name: "index",
        component: () => import("../views/Index.vue")
    },
    {
        path: "/login",
        name: "login",
        component: () => import("../views/Login.vue")
    },
    {
        path: "/register",
        name: "register",
        component: () => import("../views/Register.vue")
    },
    {
        path: "/search",
        name: "search",
        component: () => import("../views/Search.vue")
    },
    {
        path: "/ArticleDetails",
        name: "ArticleDetails",
        component: () => import("../views/ArticleDetails.vue")
    },
    {
        path: "/TeacherDetails",
        name: "TeacherDetails",
        component: () => import("../views/TeacherDetails.vue")
    },
    {
        path: "/PersonalCenter",
        name: "PersonalCenter",
        component: () => import("../views/PersonalCenter.vue")
    },
    {
        path: "/c-course",
        name: "c-course",
        component: () => import("../views/c-course/Index.vue")
    },
    {
        path: "/c-course/courseDetail",
        name: "CourseDetail",
        component: () => import("../views/c-course/CourseDetail.vue")
    },
    {
        path: "/c-course/LiveBroadcast",
        name: "LiveBroadcast",
        component: () => import("../views/c-course/LiveBroadcast.vue")
    },
    {
        path: "/c-course/RecordBroadcast",
        name: "RecordBroadcast",
        component: () => import("../views/c-course/RecordBroadcast.vue")
    },
    {
        path: "/c-course/Buy",
        name: "Buy",
        component: () => import("../views/c-course/Buy.vue")
    },
    {
        path: "/c-course/PaymentSuccessful",
        name: "PaymentSuccessful",
        component: () => import("../views/c-course/PaymentSuccessful.vue")
    },
    {
        path: "/c-course/DoHomework",
        name: "DoHomework",
        component: () => import("../views/c-course/DoHomework.vue")
    },
    {
        path: "/course",
        name: "course",
        component: () => import("../views/course/Index.vue")
    },
    {
        path: "/course/LearningDetails",
        name: "LearningDetails",
        component: () => import("../views/course/LearningDetails.vue")
    },
    {
        path: "/course/DoExercise",
        name: "DoExercise",
        component: () => import("../views/course/DoExercise.vue")
    },
    {
        path: "/course/ExamResult",
        name: "ExamResult",
        component: () => import("../views/course/ExamResult.vue")
    },
    // {
    //     path: "/question-bank/index",
    //     name: "question-bank-index",
    //     component: () => import("../views/question-bank/Index.vue")
    // },
    // {
    //     path: "/question-bank/ExamResult",
    //     name: "question-bank-examResult",
    //     component: () => import("../views/question-bank/ExamResult.vue")
    // },
    {
        path: "/found",
        name: "found",
        component: () => import("../views/found/Index.vue")
    },
    {
        path: "/FoundDetails",
        name: "FoundDetails",
        component: () => import("../views/found/FoundDetails.vue")
    },
    {
        path: "/test",
        name: "test",
        component: () => import("../views/Test.vue")
    }
];

const router = new VueRouter({
    mode: "history",
    base: "/",
    routes
});

// // 使用钩子函数对路由进行权限跳转
router.beforeEach((to: any, from: any, next: any) => {
    if (
        store.state.userLoginStatus &&
        (to.path === "/login" || to.path === "/register")
    ) {
        next("/");
    } else {
        // console.log("to.meta::", to.meta);
        // if (to.meta.title) {
        //     document.title = to.meta.title;
        // } else {
        //     document.title = defaultTitle;
        // }
        next();
    }
});
const routerPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location: any) {
    // @ts-ignore
    return routerPush.call(this, location).catch((error: Error) => error);
};
router.afterEach((to: Route, from: Route) => {});
export default router;
