<template>
    <div>
        <!-- 资讯组件 -->
        <div
            class="l-bottom xy-between pointer"
            style="align-items: stretch;"
            v-for="(item, m) in ActList"
            :key="m"
        >
            <a :href="toArticleDetailsPath(item)" style="display:none;"></a>
            <img
                :src="coverImage(item.image)"
                alt=""
                class="img"
                style="width:25%;"
                @click="toArticleDetails(item)"
            />

            <div class="aintro yx-between al-str" style="width:70%;">
                <div
                    class="l-title fontSize75 f-c-333 FW600"
                    @click="toArticleDetails(item)"
                >
                    {{ item.title }}
                </div>
                <div
                    class="three-wrap digest fontSize58 f-c-9d"
                    @click="toArticleDetails(item)"
                >
                    {{ item.digest }}
                </div>
                <div class="space xy-between">
                    <div class="xy-center">
                        <span class="fontSize5 f-c-root"
                            >#{{ item.label }}#</span
                        >
                    </div>
                    <div class="flex">
                        <!-- 评论 -->
                        <div
                            class="comment pointer"
                            @click="toArticleDetails(item)"
                            style="margin-top:0.3rem;"
                        >
                            <img
                                src="@/assets/img/pinglun@2x.png"
                                alt=""
                                style="margin-right:0.3rem;"
                            />
                            <span class="fontSize58">{{
                                item.commentCount
                            }}</span>
                        </div>
                        <a :href="toArticleDetailsPath(item)" style="display:none;"></a>
                        <!-- 点赞 -->
                        <div
                            class="pointer"
                            @click="
                                clickLike('comment', item.id, item)
                            "
                        >
                            <i
                                style="font-size:0.8rem;"
                                class="icon iconfont k-icon-l"
                                :class="[
                                    item.userLike
                                        ? 'icon-dianzan f-c-root'
                                        : 'icon-dianzan1 f-c-9b'
                                ]"
                            /><span class="fontSize58 f-c-9d">{{ item.likeCount || 0 }}</span>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { JsVueComponent, JsVueBaseApi } from "@/vue";
import { likeCount, like } from "@/action";
export default {
    mixins: [JsVueComponent, JsVueBaseApi],
    props: ["ActList"],
    data() {
        return {
            givennum: 0,
            comm: false, // 评论状态
            hide: false
        };
    },
    created() {
    },
    mounted() {
        if (location.pathname === "/found") {
            this.hide = true;
        }
    },
    methods: {
        toArticleDetailsPath(item) {
            switch (item.constructionType) {
            case 1:
                return `/ArticleDetails?articleId=${item.id}`
            case 2:
                return item.link
            default:
                return ""
            }
        },
        toArticleDetails(item) {
            if (item.constructionType === 1) {
                this.$router.push({
                    path: "/ArticleDetails",
                    query: { articleId: item.id }
                });
            } else if (item.constructionType === 2) {
                let link = item.link;
                window.open(link);
            }
        },
        fonddetail() {
            this.$router.push({
                path: "/FoundDetails"
            });
        },
        handgiven() {}
    }
};
</script>

<style scoped lang="scss">
.l-bottom {
    align-items: end;
    padding: 0.5rem 0;
    .img {
        width: 8.75rem;
        height: 6.58rem;
    }
    .aintro {
        // margin-top: 1.08rem;
        .line {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            overflow: hidden;
            font-size: 0.58rem;
            line-height: 0.75rem;
        }
        .digest {
            margin-top: 0.5rem;
        }
    }
}
.comment {
    margin-right: 1.75rem;
}
.comment,
.givezan {
    align-items: center;
    display: flex;
    img {
        width: 0.75rem;
        height: 0.75rem;
    }
}
.zan-right {
    margin-right: 2rem;
}
.space {
    margin-top: 1.08rem;
}
.review {
    border: 1px solid #dddee1;
}
.review button {
    padding: 0.92rem 1.17rem;
    background: #96c321;
}
</style>
