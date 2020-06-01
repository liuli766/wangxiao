<template>
    <div
        class="app-body app-width yx-center al-start jf-start active-page "
        v-wechat-title="'资讯列表 - ' + state.webTitle"
    >
        <!-- 广告推荐部分 -->
        <div class="margin-top-box full-width">
            <div class="xy-between full-width margin-top-box">
                <div class="l-top-left l-top-adv border-box-42 pointer">
                    <el-carousel arrow="never" height="18.25rem">
                        <el-carousel-item
                            v-for="(item, index) in informationBanner.content"
                            :key="index"
                        >
                            <a
                                :href="toFoundDetailsPath(item)"
                                style="display:none;"
                            ></a>
                            <img
                                :src="coverImage(item.image)"
                                @click="toFoundDetails(item)"
                            />
                            <div
                                class="l-modal  i-xy-center f-c-fff fontSize67"
                                @click="toFoundDetails(item)"
                            >
                                {{ item.title }} >
                            </div>
                        </el-carousel-item>
                    </el-carousel>
                </div>
                <div class="l-top-right l-top-adv xy-between al-str">
                    <div
                        class="l-top-right-box flex l-top-adv-box border-box-42 pointer"
                        v-for="(item, index) in activityBanner.content"
                        :key="index"
                        :class="{ 'flex-end': index > 1 }"
                        @click="toFoundDetails(item)"
                    >
                        <a
                            :href="toFoundDetailsPath(item)"
                            style="display:none;"
                        ></a>
                        <img :src="coverImage(item.image)" alt="" />
                        <div class="l-modal i-xy-center f-c-fff fontSize5">
                            {{ item.title }} >
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 发现 资讯 活动 -->
        <div class="l-find-box margin-top-box full-width xy-between al-start">
            <div
                class="tabs border-box-25 b-c-fff"
                style="min-height:20rem;padding:0.5rem;"
            >
                <el-menu
                    default-active="0"
                    class="el-menu-demo"
                    active-text-color="#96C321"
                    mode="horizontal"
                    text-color="#333333"
                >
                    <el-menu-item
                        style="font-size:0.75rem;font-weight:600;"
                        :index="index + ''"
                        v-for="(item, index) in navList"
                        :key="index"
                        @click="handelNav(item)"
                    >
                        <a href="/found" style="display:none;"></a>
                        {{ item }}
                    </el-menu-item>
                </el-menu>
                <!-- 发现 -->
                <div class="content" v-show="activeNav === 'find'">
                    <ActList :ActList="discover.content" />
                    <a
                        v-for="page in Math.ceil(
                            discover.total / discover.size
                        )"
                        :key="page"
                        class="hidden"
                        :href="`/found?activeNav=find&page=${page}`"
                        >第{{ page }}页</a
                    >
                    <div>
                        <el-pagination
                            v-if="discover.total !== 0"
                            background
                            layout="prev, pager, next"
                            :page-size="discover.size"
                            :total="discover.total"
                            :current-page.sync="discover.currentPage"
                            style="text-align: center;"
                            @current-change="discoverChange"
                        >
                        </el-pagination>
                    </div>
                </div>
                <!-- 资讯 -->
                <div class="content" v-show="activeNav === 'information'">
                    <ActList :ActList="information.content" />
                    <a
                        v-for="page in Math.ceil(
                            information.total / information.size
                        )"
                        :key="page"
                        class="hidden"
                        :href="`/found?activeNav=information&page=${page}`"
                        >第{{ page }}页</a
                    >
                    <div>
                        <el-pagination
                            v-show="information.total !== 0"
                            background
                            layout="prev, pager, next"
                            :page-size="information.size"
                            :total="information.total"
                            :current-page.sync="information.currentPage"
                            style="text-align: center;"
                            @current-change="informationChange"
                        >
                        </el-pagination>
                    </div>
                </div>
                <!-- 活动 -->
                <div
                    class="content l-activity xy-between"
                    v-show="activeNav === 'activity'"
                >
                    <div v-if="activity.content.length !== 0">
                        <div
                            class="l-activity-list"
                            v-for="(item, index) in activity.content"
                            :key="index"
                            @click="toFoundDetails(item)"
                        >
                            <a
                                v-for="page in Math.ceil(
                                    activity.total / activity.size
                                )"
                                :key="page"
                                class="hidden"
                                :href="
                                    `/found?activeNav=activity&page=${page}`
                                "
                                >第{{ page }}页</a
                            >
                            <img :src="coverImage(item.image)" alt="" />
                            <div
                                class="l-activity-title fontSize67 f-c-333 FW600 one-wrap"
                            >
                                {{ item.title }}
                            </div>
                            <div class="fontSize5 color9d">
                                <button class="btn fontSize5">
                                    进行中
                                </button>
                            </div>
                        </div>
                        <div>
                            <el-pagination
                                v-show="activity.total !== 0"
                                background
                                layout="prev, pager, next"
                                :page-size="activity.size"
                                :total="activity.total"
                                style="text-align: center;"
                                :current-page.sync="activity.currentPage"
                                @current-change="activityChange"
                            >
                            </el-pagination>
                        </div>
                    </div>
                    <div v-else class="fontSize67 f-c-333">暂无活动</div>
                </div>
            </div>``
            <div class="hot yx-center al-str jf-start border-box-25 b-c-fff">
                <div style="padding:0.75rem 0.92rem"><HotNews /></div>
            </div>
        </div>
    </div>
</template>

<script lang="js">
import { Component, Watch } from "vue-property-decorator";
import LoginAndRegister from "@/components/LoginAndRegister.vue";
import TeacherIntro from "@/components/curriculum/TeacherIntro.vue";
import HotNews from "@/components/HotNews.vue";
import ActList from "@/components/itembank/ActList.vue";
import { JsVuePage, JsVueComponent } from "@/vue";
import { mapState } from "vuex";
import {
    packageList,
    fondPoster,
    consultation,
    findByIntentionAndType,
    findByIntentionAndRecommend,
    advLocationDetail,
    recommendData
}
    from "@/action";
export default {
    mixins: [JsVuePage, JsVueComponent],
    components: { HotNews, ActList },
    data() {
        return {
            hrefFound: "",
            navList: ["发现", "资讯", "活动"],
            activeNav: "find",
            state: this.$store.state,
            studentIdeaId: this.$store.state.currentUser.studentIdeaId,
            recommend: [],
            dataconsultation: {},
            findid: "",
            informationBanner: {
                size: 5,
                total: 0,
                contentType: "information",
                currentPage: 1,
                type: "banner",
                content: []
            },
            activityBanner: {
                size: 4,
                total: 0,
                contentType: "activity",
                currentPage: 1,
                type: "banner",
                content: []
            },
            discover: {
                size: 5,
                total: 0,
                currentPage: 1,
                recommend: "discover",
                content: []
            },
            information: {
                size: 5,
                total: 0,
                contentType: "information",
                currentPage: 1,
                content: [],
                type: "list"
            },
            activity: {
                size: 2,
                total: 0,
                contentType: "activity",
                currentPage: 1,
                type: "list",
                content: []
            }

        }
    },
    computed: {
        ...mapState({
            currentStudentIdeaId: state => state.currentStudentIdeaId
        })
    },
    created() {
        this.activeNav = this.$route.query.activeNav || "find";
        let page = parseInt(this.$route.query.page || 1);
        this.discover.currentPage = page;
        this.information.currentPage = page;
        this.activity.currentPage = page;
        this.init(this.state.currentStudentIdeaId);
    },
    watch: {
        "state.currentStudentIdeaId": function(studentIdeaId) {
            this.init(studentIdeaId);
        }
    },
    methods: {
        toFoundDetailsPath(item) {
            switch (item.constructionType) {
            case 1:
                return `/FoundDetails?id=${item.id}`
            case 2:
                return item.link
            default:
                return ""
            }
        },
        toFoundDetails(item) {
            if (item.constructionType === 1) {
                this.$router.push({
                    path: "/FoundDetails",
                    query: { id: item.id }
                });
            } else if (item.constructionType === 2) {
                let link = item.link;
                window.open(link);
            }
        },
        handelNav(item) {
            if (item === "发现") {
                this.activeNav = "find";
            } else if (item === "资讯") {
                this.activeNav = "information";
            } else if (item === "活动") {
                this.activeNav = "activity";
            }
        },
        handelNavA(item) {
            switch (item) {
            case "发现":
                return "find";
            case "资讯":
                return "information";
            case "活动":
                return "activity";
            default:
                return "";
            }
        },
        init(studentIdeaId) {
            if (studentIdeaId) {
                this.loadInformationBanner();
                this.loadActivityBanner();
                this.showFindByIntentionAndRecommend(this.currentStudentIdeaId, this.discover); // 发现列表
                this.showfindByIntentionAndType(this.currentStudentIdeaId, this.information);// 资讯列表
                this.showfindByIntentionAndType(this.currentStudentIdeaId, this.activity);// 活动列表
            }
        },
        loadInformationBanner() {
            advLocationDetail("pc-discovery-information").then(res => {
                recommendData("article", [
                    { ownerType: "advertisementLocation", id: res.id },
                    { ownerType: "studentIdea", id: this.currentStudentIdeaId }
                ]).then(res => {
                    // console.log(res, "第一个 ")
                    res.forEach(item => {
                        if (item.recommendEntity.images) {
                            item.recommendEntity.image = item.recommendEntity.images.split(",")[0];
                        } else {
                            item.recommendEntity.image = require("@/assets/img/default.png")
                        }
                        this.informationBanner.content.push(item.recommendEntity);
                    });
                });
            })
            advLocationDetail("pc-discovery-information-no-idea").then(res => {
                recommendData("article", [
                    { ownerType: "advertisementLocation", id: res.id }
                ]).then(res => {
                    // console.log(res, "第二个")
                    res.forEach(item => {
                        if (item.recommendEntity.images) {
                            item.recommendEntity.image = item.recommendEntity.images.split(",")[0];
                        } else {
                            item.recommendEntity.image = require("@/assets/img/default.png")
                        }
                        this.informationBanner.content.push(item.recommendEntity);
                    });
                });
            })
        },
        loadActivityBanner() {
            advLocationDetail("pc-discovery-activity").then(res => {
                recommendData("article", [
                    { ownerType: "advertisementLocation", id: res.id }
                ]).then(res => {
                    if (res.length > 4) {
                        res = res.slice(0, 4)
                    }
                    res.forEach(item => {
                        if (item.recommendEntity.images) {
                            item.recommendEntity.image = item.recommendEntity.images.split(",")[0];
                        } else {
                            item.recommendEntity.image = require("@/assets/img/default.png")
                        }
                        this.activityBanner.content.push(item.recommendEntity);
                    });
                });
            })
        },

        toArticleDetails(item) {
            if (item.constructionType === 1) {
                this.$router.push({
                    path: "/ArticleDetails",
                    query: { articleId: item.id }
                });
            } else if (item.constructionType === 2) {
                let link = item.link;
                location.href = link;
            }
        },

        showfindByIntentionAndType(studentIdeaId, info) {
            let param = {
                studentIdeaId: studentIdeaId,
                contentType: info.contentType,
                currentPage: info.currentPage,
                pageSize: info.size
            };
            findByIntentionAndType(param).then(res => {
                res.content.forEach(item => {
                    // console.log(item.labels, 2388888)
                    if (item.labels.length !== 0) {
                        let label = item.labels[0].name;
                        item.label = label;
                    }
                    if (item.images !== null || "") {
                        let image = item.images.split(",")[0];
                        item.image = image
                    } else {
                        item.image = require("@/assets/img/default.png")
                    }
                })
                if (param.contentType === this.information.contentType && info.type === "list") {
                    this.information.total = res.totalElements;
                    this.information.content = res.content;
                    // console.log(this.information.content, "资讯列表")
                } else if (param.contentType === this.activity.contentType && info.type === "list") {
                    this.activity.total = res.totalElements;
                    this.activity.content = res.content;
                    // console.log(this.activity.content, "活动列表")
                } else if (param.contentType === this.activityBanner.contentType && info.type === "banner") {
                    this.activityBanner.content = res.content;
                    // console.log(this.activityBanner.content, "活动banner")
                } else if (param.contentType === this.informationBanner.contentType && info.type === "banner") {
                    this.informationBanner.content = res.content
                    // console.log(this.informationBanner.content, "资讯banner")
                }
            })
        },
        showFindByIntentionAndRecommend(studentIdeaId, info) {
            let param = {
                studentIdeaId: studentIdeaId,
                recommend: info.recommend,
                currentPage: info.currentPage,
                pageSize: info.size
            };
            findByIntentionAndRecommend(param).then(res => {
                // console.log(res, 2255555)
                res.content.forEach(item => {
                    if (item.labels.length !== 0) {
                        let label = item.labels[0].name;
                        item.label = label;
                    }
                    if (item.images !== null) {
                        let image = item.images.split(",")[0];
                        item.image = image
                    }
                })
                this.discover.content = res.content;
                // console.log(this.discover.content, "发现列表")
                this.discover.total = res.totalElements;
            })
        },
        discoverChange(idx) {
            this.discover.currentPage = idx;
            this.showFindByIntentionAndRecommend(this.currentStudentIdeaId, this.discover);
        },
        informationChange(idx) {
            this.information.currentPage = idx;
            this.showfindByIntentionAndType(this.currentStudentIdeaId, this.information);
        },
        activityChange(idx) {
            this.activity.currentPage = idx;
            this.showfindByIntentionAndType(this.currentStudentIdeaId, this.activity);
        }
    }
};
</script>
<style>
.el-carousel .el-carousel__indicators .el-carousel__indicator--horizontal {
    padding: 2px 4px !important;
}
</style>
<style scoped lang="scss">
.l-fond-top {
    height: 4.17rem;
    background: pink;
}
.margin-top-box {
    margin-top: 1rem;
}
.border-box-42 {
    border-radius: 0.42rem;
    overflow: hidden;
}
.border-box-25 {
    border-radius: 0.25rem;
    overflow: hidden;
}
.l-top-adv {
    position: relative;
    height: 18.25rem;
    z-index: 0;
    .l-top-adv-box {
        position: relative;
    }
    .l-top-adv-box.end {
        align-self: flex-end;
    }
    .l-modal {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 2.08rem;
        background: rgba(0, 0, 0, 0.5);
        padding: 0.46rem 0.67rem;
    }
}
.l-top-left {
    width: 49%;
    height: 18.25rem;
}
.l-top-left img {
    width: 100%;
    height: 100%;
}
.l-top-right {
    width: 49%;
    align-items: stretch;
    flex-wrap: wrap;
    .l-top-right-box {
        width: 49%;
        height: 8.63rem;
        img {
            width: 100%;
            height: 100%;
        }
    }
}

.l-find-box {
    margin-bottom: 5.63rem;
    z-index: 0;
    .content {
        box-sizing: border-box;
    }
    .tabs {
        width: 35.5rem;
        .l-bottom {
            border-top: 1px solid rgba(230, 231, 234, 1);
            align-items: end;
            padding-top: 0.96rem;
            .img {
                width: 8.75rem;
                height: 6.58rem;
            }
            .aintro {
                margin-top: 1.08rem;
                .line {
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 3;
                    overflow: hidden;
                    font-size: 0.58rem;
                    line-height: 0.75rem;
                }
            }
        }
    }
    .hot {
        width: 13.58rem;
    }
    .l-activity {
        .btn {
            border: 0;
            outline: none;
            padding: 0.21rem 0.58rem;
            color: #fff;
            margin: 0.63rem;
            background: #96c321;
            border-radius: 0.17rem;
        }
    }
}
.space {
    display: flex;
    justify-content: space-between;
}
.l-activity-list {
    width: 49%;
    flex-wrap: wrap;
}
.l-activity-list img {
    width: 16.25rem;
    height: 12.21rem;
}
.l-activity-title {
    margin: 0.8rem 0;
}
.flex-end {
    align-self: flex-end;
}
.content {
    padding: 1rem;
}
</style>
