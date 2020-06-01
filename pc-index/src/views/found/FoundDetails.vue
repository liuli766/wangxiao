<template>
    <div class="app-width xy-between al-start" v-wechat-title="title">
        <div class="l-left-detail">
            <div class="top-detail flex b-c-fff">
                <div class="l-bottom xy-between pointer ">
                    <img
                        :src="coverImage(articleData.image)"
                        alt=""
                        style="width:32%; height:8.54rem;border-radius:0.42rem;"
                    />
                    <div class="aintro" style="width:65%;">
                        <div class="l-title fontSize75">
                            {{ articleData.title }}
                        </div>
                        <div class="color9d fontSize5 l-time">
                            活动时间：{{ articleData.createTime }} --
                            {{ articleData.modifyTime }}
                        </div>
                        <p
                            class="fontSize58 p  Color333"
                            v-if="articleData.digest === null"
                        >
                            活动介绍：暂无活动介绍
                        </p>
                        <p class="fontSize58 p  Color333" v-else>
                            {{ articleData.digest }}
                        </p>
                        <!-- <div>
                            <button
                                class="btn fontSize5 pointer"
                                style="border-radius:0.17rem"
                            >
                                立即参加
                            </button>
                        </div> -->
                    </div>
                </div>
            </div>
            <div class="bottom-detail  b-c-fff">
                <div class="l-detail-title fontSize75 f-c-333 FW600">
                    活动内容
                </div>
                <p v-html="articleData.content" class="articleData" style="margin-top:0.92rem;"></p>
                <hr
                    style="background: #ddd;height:0.04rem;margin-top: 2.13rem;"
                />
                <div
                    class="activityrules l-detail-title fontSize75 f-c-333 FW600"
                >
                    活动规则
                </div>
            </div>
        </div>
        <div class="l-right-detail b-c-fff">
            <h4 class="fontSize75 f-c-333 FW600">猜你喜欢</h4>
            <div
                class="activityList"
                v-for="(item, index) in activity.content"
                :key="index"
                @click="toFoundDetails(item)"
            >
                <a :href="toFoundDetailsPath(item)" style="display:none;"></a>
                <img :src="coverImage(item.image)" alt="" />
                <div class="f-c-fff pointer l-model fontSize5">
                    {{ item.title }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Component } from "vue-property-decorator";
import LoginAndRegister from "@/components/LoginAndRegister.vue";
import { JsVuePage, JsVueComponent } from "@/vue";
import { detail, findByIntentionAndType } from "@/action";
import { mapState } from "vuex";
export default {
    mixins: [JsVuePage, JsVueComponent],
    data() {
        return {
            title: "发现详情",
            articleId: "",
            articleData: {},
            activity: {
                contentType: "activity",
                currentPage: 1,
                pageSize: 5,
                content: []
            }
        };
    },
    computed: {
        ...mapState({
            currentStudentIdeaId: state => state.currentStudentIdeaId
        })
    },
    created() {
        this.articleId = this.$route.query.id;
        // console.log(this.articleId,544444)
        this.articleDetails(this.articleId);
        this.showFindByIntentionAndType(
            this.currentStudentIdeaId,
            this.activity
        );
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
            // console.log(item,1988888)
            if (item.constructionType === 1) {
                this.$router.push({
                    path: "/FoundDetails",
                    query: { id: item.id }
                });
            } else if (item.constructionType === 2) {
                let link = item.link;
                location.href = link;
            }
        },
        articleDetails(id) {
            detail(id).then(res => {
                // 获取文章详情
                // console.log(res, 622222)
                if (res.images !== null) {
                    res.image = res.images.split(",")[0];
                }
                this.articleData = res;
            });
        },
        showFindByIntentionAndType(currentStudentIdeaId, info) {
            let param = {
                studentIdeaId: currentStudentIdeaId,
                contentType: info.contentType,
                currentPage: info.currentPage,
                pageSize: info.pageSize
            };
            findByIntentionAndType(param).then(res => {
                res.content.forEach(item => {
                    if (item.images !== null) {
                        item.image = item.images.split(",")[0];
                    }
                });
                this.activity.content = res.content;
                //    console.log(res,84444)
            });
        }
    }
};
</script>
<style lang="css">
    .articleData p img{
        width: 100%;
        height: 100%;
    }
</style>

<style scoped lang="scss">
.l-left-detail {
    width: 69%;
    margin-top: 1rem;
    .top-detail {
        padding: 0.88rem 0.96rem;
    }
    .l-bottom {
        margin-right: 1rem;
        margin-bottom: 1rem;
        .aintro {
            .l-title {
                line-height: 0.75rem;
            }
            .l-time {
                margin: 0.71rem 0 1.17rem 0;
            }
            .btn {
                border: 0;
                outline: none;
                padding: 0.21rem 0.58rem;
                color: #fff;
                margin: 0.63rem;
                background: #96c321;
            }
        }
    }
    .bottom-detail {
        padding: 1.33rem 0.96rem;
        margin: 1rem 0 5.6rem;
        .activityrules {
            magin-top: 1.33rem;
        }
    }
}

.l-right-detail {
    padding: 0.75rem 0.92rem;
    margin-top: 1rem;
    width: 30%;
    img {
        border-radius: 0.42rem;
    }
}
.l-top-right-box {
    width: 11.5rem;
    height: 8.63rem;
}
.activityList {
    position: relative;
    img {
        margin-top: 0.88rem;
        width: 100%;
        height: 8.87rem;
        border-radius: 0.42rem;
    }
    .l-model {
        position: absolute;
        left: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        font-size: 0.51rem;
        padding: 0.46rem 0.67rem;
    }
}
</style>
