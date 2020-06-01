<template>
    <!-- 本节答疑 -->
    <div>
        <!-- <div class="label xy-between jf-start fontSize58 f-c-333">
            问题标签：
            <div class="labelItem f-c-root">#教师资格考试#</div>
        </div> -->
        <div class="allcomments">
            <h5 class="fontSize58">
                全部答疑 <span class="f-c-9d">{{ mentoringList.total }}</span>
            </h5>
            <div
                class="xy-between al-str jf-start"
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
                    <div class="answerBox xy-between jf-start al-str" v-if="item.answerAuthor">
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
export default {
    mixins: [JsVuePage, JsVueComponent],
    props: ["mentoringList", "id"],
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
    created() {},
    methods: {}
}
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
</style>
