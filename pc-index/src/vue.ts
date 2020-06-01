import { Vue } from "vue-property-decorator";
import $store, { State, SystemImageConfig } from "@/store";
import router from "@/router";
import {
    logout,
    collection,
    like,
    userViewComment,
    PageResult,
    memberCount
} from "@/action";
import { DirectBroadcastModel, AclSourceType } from "./model";
const defaultTitle = "";
export class SystemComponent {
    coverImage(path: string): string {
        if (!path) {
            return path;
        }
        let systemImageConfig: SystemImageConfig =
            $store.state.systemImageConfig;
        let result = false;
        (systemImageConfig.imagePrefix || []).forEach(prefix => {
            if (!result) {
                result = path.startsWith(prefix);
            }
        });
        return result ? systemImageConfig.imagesHost + path : path;
    }
}
const systemComponent: SystemComponent = new SystemComponent();
export class VueComponent extends Vue {
    state: State = $store.state;
    flag: {
        [key: string]: boolean;
    } = {};
    go(url: string) {
        // @ts-ignore
        let { path } = this.$route;
        if (url !== path) {
            // @ts-ignore
            this.$router.push(url);
        }
    }
    goLogin(back: boolean = true) {
        if (router.currentRoute.query.redirect) {
            router.push({
                path: "/login?type=login",
                query: {
                    redirect: back ? router.currentRoute.query.redirect : "/"
                }
            });
        } else {
            router.push({
                path: "/login?type=login",
                query: { redirect: back ? router.currentRoute.fullPath : "/" }
            });
        }
    }
    goRegister() {
        if (router.currentRoute.query.redirect) {
            router.push({
                path: "/register",
                query: { redirect: router.currentRoute.query.redirect }
            });
        } else {
            router.push({
                path: "/register",
                query: { redirect: router.currentRoute.fullPath }
            });
        }
    }
    coverImage(path: string): string {
        return systemComponent.coverImage(path);
    }
    // logout 退出登录只需要将cookie清除 清除用户信息 跳转首页
    logout() {
        logout().then(() => {
            this.state.userLoginStatus = false;
            this.state.currentUser = null;
            this.go("/");
        });
    }
    flagPromise(fetchPromise: Promise<any>, flag: string): Promise<any> {
        if (flag) {
            this.flag[flag] = true;
        }
        return fetchPromise
            .then(r => r)
            .finally(() => {
                if (flag) {
                    this.flag[flag] = false;
                }
            });
    }
    time2MS(scends: number): Array<string> {
        return [
            this.prefixInteger(parseInt(scends / 60 + ""), 2),
            this.prefixInteger(parseInt((scends % 60) + ""), 2)
        ];
    }

    prefixInteger(num: number, length: number): string {
        return (Array(length).join("0") + num).slice(-length);
    }
}
/**
 * 子类对网页标题控制时重写mounted和beforeDestroy时需要执行super.mounted super.beforeDestroy
 */
export class VuePage extends VueComponent {
    title: string = defaultTitle;
    back() {
        // @ts-ignore
        this.$router.back();
    }

    seoDescription(description: string) {
        try {
            // @ts-ignore
            document.head
                // @ts-ignore
                .getElementsByTagName("meta").description.content = description;
        } catch (error) {
            console.error(error);
        }
    }

    seoKeywords(seoKeywords: string | Array<string>) {
        try {
            let b = Array.isArray(seoKeywords);
            let content = b
                ? (<Array<string>>seoKeywords).join(",")
                : seoKeywords;
            // @ts-ignore
            document.head
                // @ts-ignore
                .getElementsByTagName("meta").keywords.content = content;
        } catch (error) {
            console.error(error);
        }
    }

    seoLocation(province: string, city: string) {
        try {
            // @ts-ignore
            document.head.getElementsByTagName(
                "meta"
                // @ts-ignore
            ).location.content = `province=${province};city=${city}`;
        } catch (error) {
            console.error(error);
        }
    }
}
let vueTsObject: VuePage = new VuePage();
export const JsVueComponent = {
    data() {
        return {
            state: $store.state
        };
    },
    methods: {
        go(url: string) {
            vueTsObject.go.bind(this)(url);
        },
        goLogin() {
            vueTsObject.goLogin.bind(this)();
        },
        goRegister() {
            vueTsObject.goRegister.bind(this)();
        },
        coverImage(path: string): string {
            return systemComponent.coverImage(path);
        },
        logout() {
            vueTsObject.logout.bind(this)();
        },
        flagPromise(fetchPromise: Promise<any>, flag: string): Promise<any> {
            return vueTsObject.flagPromise.bind(this)(fetchPromise, flag);
        },
        time2MS(scends: number): Array<string> {
            return vueTsObject.time2MS.bind(this)(scends);
        },
        prefixInteger(num: number, length: number): string {
            return vueTsObject.prefixInteger.bind(this)(num, length);
        }
    }
};
export const JsVuePage = {
    ...JsVueComponent,
    data() {
        return {
            ...JsVueComponent.data,
            title: defaultTitle
        };
    },
    methods: {
        ...JsVueComponent.methods,
        back() {
            vueTsObject.back.bind(this)();
        },

        seoDescription(description: string) {
            vueTsObject.seoDescription.bind(this)(description);
        },

        seoKeywords(seoKeywords: string | Array<string>) {
            vueTsObject.seoKeywords.bind(this)(seoKeywords);
        },

        seoLocation(province: string, city: string) {
            vueTsObject.seoLocation.bind(this)(province, city);
        }
    }
};

export const JsVueBaseApi = {
    methods: {
        // 点赞
        clickLike(sourceType: AclSourceType, sourceId: string, model: any) {
            if (!$store.state.userLoginStatus) {
                model.userLike = !model.userLike;
                if (model.userLike) {
                    model.likeCount++;
                } else {
                    model.likeCount--;
                }
                return;
            }
            like(sourceType, sourceId).then((r: boolean) => {
                model.userLike = r;
                if (r) {
                    model.likeCount++;
                } else {
                    model.likeCount--;
                }
            });
        },
        // 收藏
        clickCollection(
            sourceType: AclSourceType,
            sourceId: string,
            model: any = {}
        ) {
            if (!$store.state.userLoginStatus) {
                model.userCollection = !model.userCollection;
                return;
            }
            return collection(sourceType, sourceId).then((r: boolean) => {
                model.userCollection = r;
                return r;
            });
        },
        // 加载评论
        loadComment(
            param: {
                commentType: "commonComment" | "question";
                commentSourceType: AclSourceType;
                commentSourceId: string;
                sourceDetail: boolean;
                commentUserDetail: boolean;
                detail: boolean;
                detailCount: number;
                detailLike: boolean;
                relyDetailLike: boolean;
                getTotalCount: boolean;
                currentUser: boolean;
            },
            model: {
                pageSize: number;
                currentPage: number;
                comment: PageResult<any>;
                commentLoading: boolean;
                [key: string]: any;
            }
        ) {
            model.commentLoading = true;
            userViewComment({
                ...param,
                pageSize: model.pageSize,
                currentPage: model.currentPage
            })
                .then((result: PageResult<any>) => {
                    model.currentPage++;
                    if (model.comment) {
                        let old = model.comment.records;
                        old.push(...result.records);
                        model.comment = {
                            ...result,
                            records: old
                        };
                    } else {
                        model.comment = result;
                    }
                })
                .finally(() => {
                    model.commentLoading = false;
                });
        },
        // 监听直播人数
        memberCount(directBroadcastModel: DirectBroadcastModel) {
            let work = () => {
                if (directBroadcastModel.workCount) {
                    memberCount(directBroadcastModel.id).then(
                        r => (directBroadcastModel.lookNumber = r || 0)
                    );
                }
            };
            work();
            return setInterval(() => work(), 1000);
        }
    }
};
