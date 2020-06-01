<template>
    <!-- 课程答疑 -->
    <div>
        <div v-if="!userLoginStatus" class="review fontSize58">
            <button class="f-c-ff pointer f-c-fff" @click="goLogin">
                登录</button
            >后发表提问
        </div>
        <div
            v-else
            class="review1 fontSize58 fontSize58 xy-between al-str review-btn"
        >
            <el-input
                type="textarea"
                placeholder="请输入您的问题..."
                v-model="inputQuestion"
                maxlength="2000"
                show-word-limit
                resize="none"
            />
            <el-button
                type="primary"
                class="no-wrap-text"
                @click="pusLectureQuestion"
                :loading="flag.pushComment"
                >提问</el-button
            >
        </div>

        <!-- <div class="label xy-between jf-start fontSize58 f-c-333">
            问题标签：
            <div class="labelItem f-c-root">#教师资格考试#</div>
        </div> -->
        <!-- <Comment
            ref="lectureComment"
            :acl-source="course"
            acl-type="course"
            :course="course"
        /> -->
        <div class="allcomments">
            <h5 class="fontSize58">
                全部答疑 <span class="f-c-9d">{{ mentoringList.total }}</span>
            </h5>
            <div
                class="xy-between al-start"
                v-for="(item, index) in mentoringList.content"
                :key="index"
                style="margin-top:1rem;"
            >
                <img :src="coverImage(item.questionAuthor.avatar)" alt="" />
                <div class="flex nameitme">
                    <div class="flex fontSize58 nameitme namebtm f-c-9b">
                        <span class="fontSize58">{{
                            item.questionAuthor.nickname
                        }}</span>
                        <span class="teacherTime">{{ item.createTime }}</span>
                    </div>
                    <div class="fontSize67">{{ item.question }}</div>
                    <!-- 老师回复 -->
                    <div class="answerBox xy-between jf-start al-str">
                        <img :src="coverImage(item.answerAuthor.avatar)" />
                        <div class="flex nameitme">
                            <div
                                class="flex fontSize58 nameitme namebtm f-c-9b"
                            >
                                <span class="fontSize58">{{
                                    item.answerAuthor.nickname
                                }}</span>
                                <span class="teacherTime">{{
                                    item.createTime
                                }}</span>
                            </div>
                            <div class="fontSize67">{{ item.answer }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { JsVuePage, JsVueComponent } from "@/vue";
import { mapState } from "vuex";
import { mentoringAsk } from "@/action";
import Comment from "@/components/Comment.vue";
export default {
    mixins: [JsVuePage, JsVueComponent],
    props: ["mentoringList", "id", "course"],
    components: {
        // Comment
    },
    data() {
        return {
            inputQuestion: "",
            flag: {
                pushComment: false
            }
        };
    },
    computed: {
        ...mapState({
            currentUser: state => state.currentUser,
            userLoginStatus: state => state.userLoginStatus
        })
    },
    created() {
        // console.log(this.mentoringList)
    },

    beforeUpdate() {
        // console.log(this.selectLecture, 11111)
    },
    methods: {
        pusLectureQuestion() {
            // 提交评论
            // console.log(this.course.soldFlag, "课程是否购买364");
            if (this.course.soldFlag) {
                this.flagPromise(
                    this.$refs.lectureComment.pushComment(
                        {
                            ...this.course,
                            commentInput: this.inputQuestion
                        },
                        "course"
                    ),
                    "pushComment"
                ).then(() => {
                    this.inputQuestion = null;
                    this.$message.success("提问成功,我们会尽快为您解答");
                });
            } else {
                this.$message.error("您还没有购买该课程,购买后才能评论哟");
            }
        }
    }
};
</script>

<style scoped lang="scss">
.answerBox {
    background: #f6f6f6;
    width: 30rem;
    height: 5.83rem;
    padding: 0.8rem;
    margin-top: 1rem;
    border-radius: 0.08rem;
}
.label {
    border-bottom: 1px solid #ddd;
    padding-bottom: 0.5rem;
}
.labelItem {
    padding: 0.25rem 0.58rem;
    // border-radius: 0.54rem;
}
.review {
    // background: #f7f8fa;
    text-align: center;
    padding: 0.5rem 0;
    // border: 1px solid #dddee1;
    margin: 1rem 0;
    button {
        padding: 0.42rem 1.04rem;
        background: #96c321;
        border-radius: 0.17rem;
        margin-right: 0.46rem;
    }
    textarea {
        width: 100%;
        background: #f7f8fa;
    }
}
.allcomments {
    padding: 0.79rem 0;
    border-top: solid 0.04rem #e6e7ea;
    h5 {
        margin-bottom: 1.92rem;
    }
    margin: 1.25rem 0;
    img {
        width: 1.67rem;
        height: 1.67rem;
        border-radius: 50%;
        margin-right: 0.5rem;
    }
    .nameitme {
        flex-direction: column;
    }
    .namebtm {
        margin-bottom: 1.17rem;
    }
}
.el-pagination {
    span {
        padding: 0.29rem 0.75rem !important;
    }
}
.review1 {
    // margin: 1rem 0;
    margin-top: 1rem;
}
.review-btn {
    button {
        padding: 0 1.17rem;
        border-radius: 0 0.17rem 0.17rem 0;
    }
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
</style>
