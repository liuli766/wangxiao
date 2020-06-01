<template>
    <div  v-wechat-title="articleData.title+ ' - ' +  state.webTitle">
        <div class="yx-center main">
            <div class="xy-between al-start app-width marginAuto">
                <div class="mainLeft" style="width:70%;">
                    <!-- 文章详情 -->
                    <div class="Article b-c-fff">
                        <div class="title pointer">{{ articleData.title }}</div>
                        <div
                            class="ArticleInfo fontSize58 f-c-333"
                            v-html="articleData.content"
                        ></div>
                        <div class="source fontSize58 f-c-9b">
                            来源 ：{{state.webTitle}}
                        </div>
                    </div>
                    <!-- 评论部分 -->
                    <div class="comment b-c-fff">
                        <div v-if="!userLoginStatus" class="review fontSize58">
                            <button
                                class="b-c-root pointer f-c-fff"
                                @click="goLogin"
                                style="width:3.33rem;height:1.42rem;border-radius:0.17rem;margin-right:0.5rem;margin-bottom:0;"
                            >
                                登录</button
                            >后发布评论
                        </div>
                        <div
                            v-else
                            class="review1 fontSize58 xy-between al-str review-btn"
                        >
                            <el-input
                                type="textarea"
                                placeholder="请输入您的评论..."
                                v-model="inputComment"
                                maxlength="2000"
                                show-word-limit
                                resize="none"
                            />
                            <el-button
                                type="primary"
                                class="no-wrap-text"
                                @click="pusLectureComment"
                                :loading="flag.pushComment"
                                >提问</el-button
                            >
                        </div>
                        <Comment
                            ref="lectureComment"
                            :acl-source="articleData"
                            acl-type="article"
                        />
                    </div>
                </div>
                <div class="mainRight b-c-fff" style="width:28%;">
                    <HotNews />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { detail } from "@/action";
import { JsVuePage, JsVueComponent } from "@/vue";
import Comment from "@/components/Comment.vue";
import HotNews from "@/components/HotNews.vue";
import { mapState } from "vuex";

export default {
    mixins: [JsVuePage, JsVueComponent],
    components: {
        Comment,
        HotNews
    },
    data() {
        return {
            title: "",
            flag: {
                pushComment: false
            },
            articleId: "",
            articleData: {},
            selectLecture: {},
            inputComment: ""
        };
    },
    computed: {
        ...mapState({
            userLoginStatus: state => state.userLoginStatus
        })
    },
    created() {
        this.articleId = this.$route.query.articleId;
        this.articleDetails(this.articleId);
    },
    methods: {
        goLogin() {
            this.$router.push({
                path: "/Login"
            });
        },
        articleDetails(id) {
            detail(id).then(res => {
                // 获取文章详情
                // console.log(res, 25888);
                this.articleData = res;
                // this.seoDescription("才士网校-摘要");
            });
        },
        support(item) {
            // 点赞
            item.isSupport = true;
            item.support = parseInt(item.support) + 1;
        },
        cancel(item) {
            // 取消点赞
            item.isSupport = false;
            item.support = parseInt(item.support) - 1;
        },
        handleReply(item) {
            // 回复框显示与否
            item.isShowReply = !item.isShowReply;
        },
        pusLectureComment() {
            this.flagPromise(
                this.$refs.lectureComment.pushComment(
                    {
                        ...this.articleData,
                        commentInput: this.inputComment
                    },
                    "article"
                ),
                "pushComment"
            ).then(() => {
                this.$message.success("评论成功");
                this.inputComment = null;
            });
        }
    }
};
</script>
<style lang="css">
    .ArticleInfo p img{
        width:100% ;
        height:100% ;
    }
</style>

<style scoped lang="scss">
.main {
    margin: 1.68rem 0;
}
/* 文章部分 */
.Article {
    padding: 1.04rem;
}
.Article .title {
    font-size: 1.08rem;
    font-weight: 600;
    color: rgba(51, 51, 51, 1);
    line-height: 1.63rem;
}
.Article .title:hover {
    color: #96c321;
}
.Article .ArticleInfo {
    line-height: 0.83rem;
    margin: 1.5rem 0 1.4rem;
    text-indent: 2em;
}
/* 评论部分 */
.comment {
    padding: 1.25rem 1rem;
    margin-top: 0.05rem;
    display: block;
}
.comment textarea {
    width: 100%;
    padding: 0.5rem 0.8rem;
    height: 2.54rem;
    background: #f7f8fa;
    border: 1px solid #dddee1;
    color: #bfbfbf;
    resize: none;
    overflow: auto;
}
// .comment button {
//     width: 15%;
//     height: 2.2rem;
//     margin-bottom: 1rem;
//     border-radius: 0.08rem;
// }
.comDetail {
    border-top: 1px solid #ddd;
    margin-top: 1rem;
    padding-top: 1rem;
}
.commentItem {
    border-bottom: 1px solid #ddd;
    padding: 1.3rem 0;
}
.commentItem .headImg {
    width: 1.67rem;
    height: 1.67rem;
    border-radius: 50%;
    margin-right: 0.8rem;
}
.commentInfo {
    margin: 1.17rem 0 0 2.4rem;
}
.supportImg {
    position: relative;
    margin: 0 0.5rem;
    width: 16px;
    height: 16px;
}
/* 回复框 */
.reply {
    border: 1px solid #ddd;
    padding: 0.8rem;
    margin-top: 1rem;
}
.reply textarea {
    background: #fff !important;
}
/* 子评论部分 */

.subComment {
    background: #f7f8fa;
    margin: 1rem 0 0 1rem;
    padding: 0.6rem;
}
.subCommentLine {
    width: 100%;
    height: 1px;
    background: #ddd;
    margin: 0.8rem 0;
}
.subCommentItem {
    margin-top: 0.5rem;
}
.review-btn {
    button {
        padding: 0 1.17rem;
        border-radius: 0 0.17rem 0.17rem 0;
    }
}
.review-btn .el-textarea__inner {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
}
.review {
    background: #f8f8fa;
    text-align: center;
    padding: 0.5rem 0;
    border: 1px solid #dddee1;
    border-radius: 0.17rem;
    margin: 1rem;
    button {
        padding: 0.42rem 1.04rem;
        background: #96c321;
        border-radius: 0.17rem;
        margin-right: 0.46rem;
    }
}
.review1 {
    margin: 1rem 0;
}
</style>
