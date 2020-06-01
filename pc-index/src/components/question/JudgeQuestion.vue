<template>
<!-- 判断题 -->
    <div
        class="yx-center jf-start al-str content-card chaoose-question-detail full-width full-height"
    >
        <div
            class="b-c-fff question-content body-padding fontSize67 full-height"
        >
            <div
                v-for="item in ['1', '0']"
                :key="item"
                class="answer-item xy-center jf-start pointer"
                @click="chooseAnswer(item)"
                :class="[
                    canChoose ? 'pointer' : 'no-mouse',
                    {
                        'question-error error':
                            checkAnswer &&
                            question.userAnswer === item &&
                            !correctFlag,
                        right:
                            checkAnswer &&
                            question.userAnswer === item &&
                            correctFlag
                    }
                ]"
            >
                <div
                    class="option xy-center"
                    :class="{
                        active: question.userAnswer === item && !checkAnswer
                    }"
                ></div>
                <div class="answer-content">
                    {{ item === "1" ? "正确" : "错误" }}
                </div>
            </div>
        </div>
        <div v-if="showAnalysis" class="answer xy-between body-padding">
            <div class="xy-center fontSize67 f-c-666">
                <div>
                    参考答案：<span class="f-c-root">{{ rightAnswer }}</span>
                </div>
                <div
                    class="onwer-answer"
                    v-show="question.okAnswer && userAnswer"
                    :class="[correctFlag ? 'f-c-root' : 'question-error']"
                >
                    您的答案：{{ userAnswer }}
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
    0x01: "question-error error",
    0x11: "right",
    0xff: ""
};
@Component({})
export default class JudgeQuestion extends VueComponent
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

    created() {
        this.questionWatch(this.question);
    }

    @Watch("question")
    questionWatch(question: any) {
        if (question && !this.onlyReadly) {
            if (this.workType === "see") {
                question.userAnswer = question.userAnswer || "未做答";
            } else if (this.workType === "bt") {
                question.userAnswer = this.question.answerList[0].rightFlag;
            }
        }
    }

    get correctFlag(): boolean {
        return this.rightAnswer === this.userAnswer;
    }

    get rightAnswer() {
        return this.question.answerList[0].rightFlag === "0" ? "错误" : "正确";
    }

    get userAnswer(): string | null {
        if (this.question && this.question.userAnswer) {
            let obj: any = {
                "0": "错误",
                "1": "正确"
            };
            return obj.hasOwnProperty(this.question.userAnswer)
                ? obj[this.question.userAnswer]
                : this.question.userAnswer;
        }
        return null;
    }

    get showAnalysis(): boolean {
        if (this.workType === "bt" || this.workType === "see") {
            return true;
        } else if (this.workType === "lx" && this.question.okAnswer) {
            return true;
        }
        return false;
    }

    get checkAnswer(): boolean {
        if (this.question.okAnswer) {
            if (
                this.workType === "lx" ||
                this.workType === "bt" ||
                this.workType === "see"
            ) {
                return true;
            }
        }
        return false;
    }

    get canChoose() {
        return this.workType === "jc" || !this.question.okAnswer;
    }

    @Emit("ok-answer")
    okAnswer(): any {
        if (this.workType === "lx") {
            this.question.openAnalysis = true;
        }
        return null;
    }
    chooseAnswer(answer: any) {
        if (!this.canChoose) {
            return;
        }
        this.question.userAnswer = answer;
        this.question.okAnswer = true;
        if (this.workType === "jc") {
            this.question.rightFlag = 1;
            this.okAnswer();
        } else {
            this.question.rightFlag = this.correctFlag ? 1 : 0;
            this.okAnswer();
        }
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
        .option {
            border-radius: 50%;
            width: 1rem;
            height: 1rem;
            border: 0.04rem solid #c4c4c4;
            margin-right: 0.92rem;
        }
        .option.active::before {
            content: " ";
            width: 0.5rem;
            height: 0.5rem;
            border-radius: 50%;
            background-color: $rootColor;
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
