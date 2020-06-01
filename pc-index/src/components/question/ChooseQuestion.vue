<template>
<!-- 单选多选和不定项选择 -->
    <div
        class="yx-center jf-start al-str content-card chaoose-question-detail full-width full-height"
    >
        <div
            class="b-c-fff question-content body-padding fontSize67 full-height"
        >
            <div
                class="answer-item xy-center jf-start pointer"
                v-for="answer in question.answerList"
                :key="answer.option"
                :class="[answer.className, canChoose ? 'pointer' : 'no-mouse']"
                @click="chooseAnswer(answer)"
            >
                <div class="option xy-center">{{ answer.option }}</div>
                <div class="answer-content" v-html="answer.content"></div>
            </div>
        </div>
        <div v-if="showAnalysis" class="answer xy-between body-padding">
            <div class="xy-center fontSize67 f-c-666">
                <div>
                    参考答案：<span
                        v-for="item in rightAnswer"
                        :key="item"
                        class="f-c-root anster-item"
                        >{{ item }}</span
                    >
                </div>
                <div
                    class="onwer-answer"
                    v-show="question.okAnswer && userAnswer"
                    :class="[correctFlag ? 'f-c-root' : 'question-error']"
                >
                    您的答案：<span
                        v-for="item in userAnswer"
                        :key="item"
                        class="anster-item"
                        >{{ item }}</span
                    >
                </div>
            </div>
            <div
                v-if="question.openAnalysis"
                class="analysis xy-center pointer fontSize67 f-c-333"
                @click="question.openAnalysis = false"
            >
                收起解析<span class="icon iconfont icon-jiantou-xia"></span>
            </div>
            <div
                v-else
                class="analysis xy-center pointer fontSize67 f-c-333"
                @click="question.openAnalysis = true"
            >
                查看解析<span class="icon iconfont icon-jiantou-you"></span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Emit } from "vue-property-decorator";
import { questionList } from "@/action";
import { VueComponent } from "@/vue";
import QuestionType from "./QuestionType";
const answerStatusClass: {
    [key: number]: string;
} = {
    0x00: "",
    0x01: "question-error error",
    0x10: "miss",
    0x11: "right",
    0xff: ""
};
@Component({})
export default class ChooseQuestion extends VueComponent
    implements QuestionType {
    @Prop({
        type: Object,
        required: false
    })
    private question!: any;

    @Prop({
        type: String,
        default: "lx"
    })
    private workType!: "bt" | "lx" | "jc" | "see";

    @Prop({
        type: Boolean,
        required: false
    })
    private onlyReadly!: boolean;

    flag: {
        [key: string]: boolean;
    } = {
        changeQuestion: false,
        fetchQuestion: false
    };
    rightAnswer: Array<string> = []; // 正确答案

    created() {
        this.questionWatch(this.question);
    }

    @Watch("question.userAnswer")
    userAnswerWatch() {
        if (!this.onlyReadly) {
            this.flushChooseClass();
        }
    }

    @Watch("question")
    questionWatch(question: any) {
        if (question && !this.onlyReadly) {
            this.rightAnswer = this.question.answerList
                .filter((a: any) => a.rightFlag === "1")
                .map((n: any) => n.option);
            if (this.workType === "see") {
                question.userAnswer = question.userAnswer || "未做答";
            } else if (this.workType === "bt") {
                question.userAnswer = "";
            }
            this.question.answerList = this.question.answerList.map(
                (n: any) => {
                    return {
                        ...n,
                        className: n.className || ""
                    };
                }
            );
            if (this.workType === "jc") {
                question.rightFlag = 1;
            } else {
                this.okAnswerFinsh(question.okAnswer, false);
            }
        }
    }

    get correctFlag(): boolean {
        let userAnswer = (this.question.userAnswer || "").split("|");
        return (
            userAnswer.sort().toString() === this.rightAnswer.sort().toString()
        );
    }

    get userAnswer(): Array<string> | null {
        if (this.question && this.question.userAnswer) {
            return this.question.userAnswer.split("|");
        }
        return null;
    }

    get showAnalysis(): boolean {
        if (this.workType === "bt" || this.workType === "see") {
            return true;
        } else if (
            (this.workType === "lx" || this.workType.startsWith("sc_")) &&
            this.question.okAnswer
        ) {
            return true;
        }
        return false;
    }

    get canChoose() {
        return this.workType === "jc" || !this.question.okAnswer;
    }
    @Emit("ok-answer")
    okAnswer(): any {
        this.question.answerRightFlag = this.correctFlag;
        if (this.workType === "lx") {
            this.question.openAnalysis = true;
        }

        return null;
        // this.question.answerScore = this.question.fraction;
    }

    chooseAnswer(answer: any) {
        // console.log(answer, 18222);
        if (!this.canChoose) {
            return;
        }
        if (this.question.questionType.type === "0") {
            // 单选
            this.question.userAnswer = answer.option;
            this.question.okAnswer = true;
            if (this.workType !== "jc") {
                // 练习模式
                this.okAnswerFinsh(true, true);
            } else {
                // 检测模式
                this.okAnswer();
            }
        } else {
            // 多选和不定项选择
            if (this.workType === "jc" || !this.question.okAnswer) {
                if (this.userAnswer) {
                    if (this.userAnswer.includes(answer.option)) {
                        this.question.userAnswer = this.userAnswer
                            .filter(n => n !== answer.option)
                            .join("|");
                    } else {
                        this.question.userAnswer += `|${answer.option}`;
                    }
                } else {
                    this.question.userAnswer = answer.option;
                }
            }
        }
    }

    okAnswerFinsh(okAnswer: boolean, emit: boolean = true) {
        if (okAnswer) {
            this.flushChooseClass();
            if (emit) {
                this.okAnswer();
            }
            this.question.rightFlag = this.correctFlag ? 1 : 0;
        }
    }

    flushChooseClass() {
        this.question.answerList.forEach((n: any) => {
            n.className = this.getAnswerNowStatusClass(n);
        });
    }

    getAnswerNowStatusClass(item: any) {
        let a = item.rightFlag === "1" ? 0x10 : 0x00;
        let b = this.userAnswer
            ? this.userAnswer.includes(item.option)
                ? 0x01
                : 0x00
            : 0x00;
        let c = a | b;
        if (this.workType === "bt") {
            c = a | (a >> 4);
        }
        if (this.workType === "jc" || !this.question.okAnswer) {
            c = b | (b << 4);
        }
        return answerStatusClass[c];
    }
}
</script>

<style scoped lang="scss">
.content-card {
    border-radius: 0.42rem;
}
.chaoose-question-detail {
    .question-content {
        padding-top: 1.17rem;
        padding-bottom: 1.17rem;
        color: #2d2d2d;
        .answer-item {
            margin-top: 0.88rem;
        }
        .miss {
            color: $rootColor;
        }
        .option {
            border-radius: 50%;
            width: 1rem;
            height: 1rem;
            border: 0.04rem solid #c4c4c4;
            margin-right: 0.92rem;
        }
        .right {
            .option {
                border-color: $rootColor;
                background-color: $rootColor;
                color: $rootColor;
            }
            .option::before {
                content: "\e6da";
                color: #ffffff;
                font-family: element-icons !important;
                position: absolute;
            }
        }
        .error {
            .option {
                background-color: #ff4d24;
                border-color: #ff4d24;
                color: #ff4d24;
            }
            .option::before {
                content: "\e6db";
                color: #ffffff;
                font-family: element-icons !important;
                position: absolute;
            }
        }
        .miss {
            .option {
                border-color: $rootColor;
            }
        }
    }
    .answer {
        height: 2.92rem;
        .onwer-answer {
            margin-left: 2rem;
        }
        .analysis {
            .icon {
                margin-left: 0.42rem;
            }
        }
    }
}
</style>
