<template>
    <!-- /** t题目类型： 0单选/1/多选/2/不定项选择题3/填空/4/材料/5/判断 */ -->
    <div class="full-width xy-between al-str">
        <div
            class="question-body yx-center jf-start al-str full-width"
            ref="questionBody"
        >
            <div
                class="xy-between al-str question-ani-box full-width"
                ref="questionAni"
            >
                <!-- 前置动画 -->
                <div class="ani-box new-ani-box">
                    <QuestionWrapper
                        :question="nowQuestion"
                        :work-type="workType"
                        :only-readly="true"
                    />
                </div>
                <!-- 本身题目 -->
                <div class="ani-box new-ani-box">
                    <QuestionWrapper
                        :question="showQuestion"
                        :work-type="workType"
                        @ok-answer="okAnswer"
                    />
                </div>
                <!-- 后置动画 -->
                <div class="ani-box new-ani-box">
                    <QuestionWrapper
                        :question="nowQuestion"
                        :work-type="workType"
                        :only-readly="true"
                    />
                </div>
            </div>
        </div>
        <div
            ref="operationBox"
            class="content-card f-c-333 fontSize67 xy-between operation-box body-padding b-c-fff"
        >
            <div
                class="pref pointer"
                :class="[
                    { 'f-c-9d': start },
                    flag.questionChange ? 'wait' : 'pointer'
                ]"
                @click="changeQuestion(false)"
            >
                <span class="icon iconfont icon-zuo k-icon-l"></span>上一题
            </div>
            <div
                class="bold f-c-000 xy-center operation pointer"
                v-show="workType === 'jc'"
                @click="examOver"
            >
                <span
                    class="icon iconfont icon-wancheng"
                    style="font-size: 0.8rem;margin-right:0.3rem;color:#333;"
                ></span>
                交卷
            </div>
            <div
                class="after pointer"
                :class="[
                    { 'f-c-9d': end },
                    flag.questionChange ? 'wait' : 'pointer'
                ]"
                @click="changeQuestion(true)"
            >
                下一题 <span class="icon iconfont icon-you k-icon-r"></span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Emit } from "vue-property-decorator";
import { VueComponent } from "@/vue";
import QuestionWrapper from "@/components/question/QuestionWrapper.vue";
@Component({
    components: {
        QuestionWrapper
    }
})
export default class DoExercise extends VueComponent {
    @Prop({
        type: String,
        default: "lx"
    })
    private workType!: any;

    @Prop({
        type: Object
    })
    private nowQuestion!: any;

    @Prop({
        type: Number
    })
    private size!: number;

    flag: {
        [key: string]: boolean;
    } = {
        changeQuestion: false
    };
    showQuestion: any = null;
    created() {
        this.showQuestion = this.nowQuestion;
    }

    mounted() {
        this.state.footerShow = false;
        document.body.style.paddingBottom = "3.08rem";
        document.body.style.left =
            // @ts-ignore
            this.$refs.questionBody.offsetLeft + "px";
        // @ts-ignore
        this.$refs.operationBox.style.width =
            // @ts-ignore
            this.$refs.questionBody.clientWidth + "px";
    }
    beforeDestroy() {
        document.body.style.paddingBottom = "0";
        this.state.footerShow = true;
    }

    @Watch("nowQuestion")
    nowQuestionWatch(nowQuestion: any) {
        if (nowQuestion) {
            this.chooseQuestionIndex(nowQuestion);
        }
    }

    get start(): boolean {
        return (this.nowQuestion || {}).index === 0;
    }

    get end(): boolean {
        return this.size === (this.nowQuestion || {}).index + 1;
    }

    @Emit("change")
    change(type: boolean) {
        return type;
    }
    @Emit("exam-over")
    examOver() {
        return {};
    }

    @Emit("after-question-in-enter")
    afterQuestionInEnter(newQuestion: any) {
        this.showQuestion = newQuestion;
        // @ts-ignore
        this.$refs.questionAni.style.transition = "none";
        // @ts-ignore
        this.$refs.questionAni.style.left = "-100%";
        this.flag.questionChange = false;
        return this.showQuestion.index;
    }

    @Emit("ok-answer")
    okAnswer() {
        return null;
    }

    changeQuestion(type: boolean) {
        if (this.flag.questionChange) {
            return;
        }
        if (type && this.end) {
            return;
        }
        if (!type && this.start) {
            return;
        }
        this.change(type);
    }

    chooseQuestionIndex(newQuestion: any) {
        if (!this.showQuestion) {
            this.showQuestion = newQuestion;
            return;
        }
        let time = 300;
        this.flag.questionChange = true;
        // @ts-ignore
        this.$refs.questionAni.style.transition = `left ${time / 1000}s`;
        // @ts-ignore
        this.$refs.questionAni.style.left =
            newQuestion.index > this.showQuestion.index ? "-200%" : "0px";
        setTimeout(() => {
            this.afterQuestionInEnter(newQuestion);
        }, time);
    }
}
</script>

<style scoped lang="scss">
.content-card {
    border-radius: 0.42rem;
}
.body-padding {
    padding-left: 1.08rem;
    padding-right: 1.17rem;
}
.question-body {
    overflow: hidden;
    .chapter-body {
        padding-top: 1.29rem;
        padding-bottom: 1.5rem;
        margin-bottom: 0.75rem;
    }
    .question-ani-box {
        position: relative;
        flex-grow: 1;
        min-height: 5rem;
        width: 300%;
        left: -100%;
        flex-grow: 1;
        .ani-box {
            min-width: 33.333333%;
        }
    }
}
.operation-box {
    height: 3.08rem;
    width: 100vw;
    position: fixed;
    bottom: 0;
    box-shadow: 1px 2px 24px -1px rgba(0, 0, 0, 0.15);
    .operation {
        .icon {
            color: #868686;
        }
    }
}
</style>
