<template>
    <div class="allcomments full-width">
        <h5 class="fontSize58">
            全部评论
            <span class="f-c-9d">{{ aclSource.commentCount }}</span>
        </h5>
        <div
            v-for="(comment, index) in commentList"
            :key="index"
            class="xy-between al-start"
            @mouseover="comment.showRecomment = true"
            @mouseleave="comment.showRecomment = false"
        >
            <img :src="coverImage(comment.commentUser.header)" alt="" />
            <div class="yx-center jf-start al-str nameitme">
                <div class="fontSize58 namebtm yx-between al-str">
                    <div class="fontSize58 xy-between">
                        <div>
                            {{ comment.commentUser.nickname }}
                        </div>
                        <div
                            class="pointer"
                            @click="clickLike('comment', comment.id, comment)"
                        >
                            <i
                                class="icon iconfont k-icon-l"
                                :class="[
                                    comment.userLike
                                        ? 'icon-dianzan f-c-root'
                                        : 'icon-dianzan1 f-c-9b'
                                ]"
                            /><span>{{ comment.likeCount }}</span>
                        </div>
                    </div>
                    <span class="teacherTime">{{ comment.releaseTime }}</span>
                </div>
                <div
                    class="fontSize67 content yx-between al-str"
                    :class="{
                        content1: false
                    }"
                >
                    <div>{{ comment.content }}</div>
                    <div
                        v-if="true"
                        class="re-comment xy-between fontSize58 f-c-root"
                    >
                        <div
                            class="pointer k-icon-l"
                            @click.stop="
                                () => {
                                    comment.openReComment = !comment.openReComment;
                                    if (comment.openReComment && !comment.subCommentOpen) {
                                        openCommentRe(comment);
                                    }
                                }
                            "
                        >
                            回复
                        </div>
                        <div
                            class="pointer k-icon-r"
                            @click.stop="openCommentRe(comment)"
                        >
                            {{
                                comment.subCommentOpen
                                    ? "收起评论"
                                    : "共" + comment.comment.total + "条回复"
                            }}
                        </div>
                    </div>
                </div>
                <!-- 评论回复输入框 -->
                <div
                    v-show="comment.openReComment || comment.pushCommentFlag"
                    class="xy-center jf-start al-str review-btn"
                >
                    <el-input
                        type="textarea"
                        placeholder="请输入您的评论..."
                        v-model="comment.commentInput"
                        maxlength="2000"
                        show-word-limit
                    />
                    <el-button
                        type="primary"
                        class="no-wrap-text"
                        @click="pushComment(comment, 'comment', null)"
                        :loading="comment.pushCommentFlag"
                        >回复</el-button
                    >
                </div>

                <!-- 子评论 -->
                <div
                    v-if="comment.subCommentOpen"
                    class="sub-comment full-width yx-between jf-start al-str"
                >
                    <div
                        v-for="(subComment, index) in comment.comment.records"
                        :key="index"
                        class="xy-between al-start"
                    >
                        <img
                            :src="coverImage(subComment.commentUser.header)"
                            alt=""
                        />
                        <div class="flex nameitme">
                            <div class="fontSize58 namebtm yx-between al-str">
                                <div class="fontSize58 xy-between">
                                    <div>
                                        {{ subComment.commentUser.nickname }}
                                    </div>
                                    <div
                                        class="pointer"
                                        @click="
                                            clickLike(
                                                'comment',
                                                subComment.id,
                                                subComment
                                            )
                                        "
                                    >
                                        <i
                                            class="icon iconfont k-icon-l"
                                            :class="[
                                                subComment.userLike
                                                    ? 'icon-dianzan f-c-root'
                                                    : 'icon-dianzan1 f-c-9b'
                                            ]"
                                        /><span>{{
                                            subComment.likeCount || 0
                                        }}</span>
                                    </div>
                                </div>
                                <span class="teacherTime">{{
                                    subComment.releaseTime
                                }}</span>
                            </div>
                            <div class="fontSize67 content content1">
                                {{ subComment.content }}
                            </div>
                        </div>
                    </div>
                    <div
                        v-if="comment.comment.pages >= comment.currentPage"
                        class="xy-center sub-mode fontSize58 f-c-root pointer"
                        @click="loadCommentRe(comment)"
                    >
                        加载更多
                        <i
                            v-show="comment.commentLoading"
                            class="el-icon-loading k-icon-r"
                        />
                    </div>
                </div>
            </div>
        </div>
        <!-- 分页 -->
        <el-pagination
            v-if="commentPage.total !== 0"
            background
            layout="prev, pager, next"
            prev-text="上一页"
            next-text="下一页"
            :total="commentPage.total"
            :page-size="commentPage.pageSize"
            style="text-align: right;margin-top:9rem;"
            :current-page.sync="commentPage.currentPage"
            @current-change="loadCommentList(aclSource, aclType)"
        >
        </el-pagination>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from "vue-property-decorator";
import {
    chapterLectures,
    getCurriculumWatchTime,
    userViewComment,
    Page,
    PageResult,
    publishedComment
} from "@/action";
import { VueComponent, JsVueBaseApi } from "@/vue";
import { AclSourceType } from "@/model";
import { ErrorParam } from "@/request";
@Component({
    mixins: [JsVueBaseApi]
})
export default class Comment extends VueComponent {
    @Prop(Object) private aclSource!: any;
    @Prop(String) private aclType!: AclSourceType;
    @Prop({ type: Number, default: 5 }) private pageSize!: number;
    commentList: Array<any> = [];
    commentPage: Page = {
        currentPage: 1,
        pageSize: this.pageSize,
        total: 0
    };
    created() {
        if (this.aclSource.id) {
            this.loadCommentList(this.aclSource, this.aclType);
        }
    }
    @Watch("aclSource")
    aclSourceWatch() {
        this.loadCommentList(this.aclSource, this.aclType);
    }
    get userLoginStatus(): boolean {
        return this.state.userLoginStatus;
    }

    openCommentRe(comment: any) {
        if (!comment.comment.total) {
            return;
        }
        if (comment.subCommentOpen) {
            comment.subCommentOpen = false;
            comment.openReComment = false;
            return;
        }
        comment.subCommentOpen = true;
        if (comment.currentPage === 0) {
            comment.currentPage = 1;
            this.loadCommentRe(comment);
        }
    }
    loadCommentList(aclSource: any, aclType: AclSourceType) {
        userViewComment({
            ...this.commentPage,
            commentType: "commonComment",
            commentSourceType: aclType,
            commentSourceId: aclSource.id,
            sourceDetail: false,
            commentUserDetail: true,
            detail: true,
            detailCount: 0,
            detailLike: true,
            relyDetailLike: true,
            getTotalCount: false,
            currentUser: false
        }).then((result: PageResult<any>) => {
            this.commentPage.total = result.total;
            this.commentList = result.records.map(r => {
                return {
                    ...r,
                    showRecomment: false,
                    subCommentOpen: false,
                    currentPage: 0,
                    pageSize: 5,
                    commentLoading: false,
                    commentInput: null,
                    openReComment: false,
                    pushCommentFlag: false
                };
            });
        });
    }
    loadCommentRe(comment: any) {
        // @ts-ignore
        this.loadComment(
            {
                commentType: "commonComment",
                commentSourceType: "comment",
                commentSourceId: comment.id,
                sourceDetail: false,
                commentUserDetail: true,
                detail: false,
                detailCount: 0,
                detailLike: true,
                relyDetailLike: false,
                getTotalCount: false,
                currentUser: false
            },
            comment
        );
    }
    // 发表评论
    pushComment(
        model: {
            id: string;
            commentInput?: string | null;
            pushCommentFlag?: boolean;
            [key: string]: any;
        },
        commentSourceType: AclSourceType,
        relay2TreeId: string,
        param: {
            [key: string]: any;
        },
        errorMsg?: ErrorParam
    ) {
        if (!this.userLoginStatus) {
            this.goLogin();
            return null;
        }
        if (model) {
            model.pushCommentFlag = true;
        }
        if (model.commentInput) {
            return publishedComment(
                {
                    commentType: "commonComment",
                    commentSourceType,
                    commentSourceId: model.id,
                    relay2TreeId,
                    content: model.commentInput,
                    userDetail: true,
                    ...param
                },
                errorMsg
            )
                .then((comment: any) => {
                    model.commentInput = null;
                    if (commentSourceType === "comment") {
                        model.comment.records.unshift(comment);
                        model.comment.total++;
                        model.openReComment = false;
                    } else {
                        this.commentPage.currentPage = 1;
                        this.loadCommentList(this.aclSource, this.aclType);
                    }
                    model.commentCount++;
                    return comment;
                })
                .finally(() => {
                    if (model) {
                        model.pushCommentFlag = false;
                    }
                });
        } else {
            this.$message.error("请输入内容");
        }
    }
}
</script>

<style scoped lang="scss">
.allcomments {
    padding: 0.79rem 0;
    border-top: solid 0.04rem #e6e7ea;
    h5 {
        margin-bottom: 1.92rem;
    }
    img {
        width: 1.67rem;
        min-width: 1.67rem;
        height: 1.67rem;
        border-radius: 50%;
        margin-right: 0.5rem;
    }
    .nameitme {
        flex-direction: column;
        flex-grow: 1;
        margin-bottom: 1.38rem;
    }
    .namebtm {
        margin-bottom: 1.17rem;
        color: #9b9b9b;
    }
    .content {
        color: #2b333b;
        padding-bottom: 0.25rem;
        border-bottom: 0.04rem solid #e6e7ea;
    }
    .re-comment {
        height: 1rem;
        justify-content: flex-end;
    }
    .content1 {
        padding-bottom: 1.25rem;
    }
    .sub-comment {
        margin-top: 1.3em;
        .sub-mode {
            height: 1rem;
        }
    }
}
.review-btn {
    button {
        padding: 0 1.17rem;
        border-radius: 0 0.17rem 0.17rem 0;
    }
}
</style>
<style>
.review-btn .el-textarea__inner {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
}
.allcomments .el-pagination.is-background .btn-prev,
.el-pagination.is-background .btn-next {
    padding: 0 0.5em;
}
</style>
