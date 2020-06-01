/* eslint-disable no-extend-native */
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueCookies from "vue-cookies";
import ElementUI from "element-ui";
import "@/static/css/common.css";
import "@/static/css/color.css";
import "@/static/css/animate.min.css";
import "@/static/scss/common.scss";
import "@/static/css/reset.css";
import "babel-polyfill"
// import "@/static/icon/iconfont.css";
Vue.config.productionTip = false;
Vue.use(VueCookies);
Vue.use(ElementUI);
// @ts-ignore
Date.prototype.Format = function(fmt) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "H+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        S: this.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
            RegExp.$1,
            (this.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1,
                // @ts-ignore
                RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
            );
        }
    }
    return fmt;
};
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");
