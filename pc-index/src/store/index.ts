import Vue from "vue";
import Vuex from "vuex";
import { IM } from "@/im";

Vue.use(Vuex);
export interface SystemImageConfig {
    imagePrefix: Array<string> | null;
    imagesHost: string | null;
}
export interface State {
    userLoginStatus: boolean;
    currentUser: any;
    currentStudentIdeaModel?: any;
    systemImageConfig: SystemImageConfig;
    currentStudentIdeaId: string | null;
    imInstance: IM | null;
    websocketUrl: string;
    searchKey: string | null;
    footerShow: boolean;
    headerShow: boolean;
    returnType: boolean;// 定义返回方式是否为this.$router.go(-1)
    webTitle: string | null;
}
export default new Vuex.Store<State>({
    state: {
        userLoginStatus: false,
        currentUser: {},
        currentStudentIdeaModel: {},
        systemImageConfig: {
            imagePrefix: null,
            imagesHost: null
        },
        currentStudentIdeaId: null,
        imInstance: null,
        websocketUrl: "ws://api-test.yunxuebao.com",
        searchKey: null,
        footerShow: true,
        headerShow: true,
        returnType: false,
        webTitle: null
    },
    mutations: {
        handleReturnType(state) {
            state.returnType = true;
        }
    },
    actions: {},
    modules: {}
});
