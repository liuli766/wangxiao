<template>
<!-- 填空和材料题 -->
    <div
        class="yx-center jf-start al-str content-card chaoose-question-detail full-width full-height"
    >
        <div
            class="b-c-fff question-content body-padding fontSize67 full-height"
        >
            <div
                class="answer-item yx-center jf-start al-str"
                v-for="(answer, index) in question.answerList"
                :key="answer.option"
            >
                <div class="option">请作答（{{ index + 1 }}）</div>
                <el-input
                    class="user-input"
                    type="textarea"
                    resize="none"
                    :autosize="{ minRows: 3, maxRows: 8 }"
                    placeholder="请输入您的答案"
                    v-model="answer.userInput"
                    :disabled="question.okAnswer && workType !== 'jc'"
                    @change="userAnswerChange"
                >
                </el-input>
            </div>
            <div class="xy-center btn">
                <el-button
                    type="primary"
                    @click="okAnswerFinsh(true, true)"
                    :disabled="okAnswerDisabled"
                    :loading="flag.pushAnswer"
                    >提交答案</el-button
                >
            </div>
        </div>
        <div v-if="showAnalysis" class="answer xy-between body-padding">
            <div class="xy-center fontSize67 f-c-666"></div>
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
@Component({})
export default class FillBlankQuestion extends VueComponent
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
        pushAnswer: false
    };

    created() {
        this.questionWatch(this.question);
    }

    @Watch("question")
    questionWatch(question: any) {
        if (question && !this.onlyReadly) {
            this.question.rightFlag = 1;
            question.answerList = question.answerList.map((n: any) => {
                return {
                    ...n,
                    userInput: n.userInput || ""
                };
            });
        }
    }
    get showAnalysis(): boolean {
        if (this.workType === "bt" || this.workType === "see") {
            return true;
        } else if (this.workType === "lx" && this.question.okAnswer) {
            return true;
        }
        return false;
    }

    get okAnswerDisabled() {
        return (
            this.question.answerList.filter((a: any) => !a.userInput).length > 0
        );
    }

    get submitShow() {
        return !this.question.okAnswer && (this.workType === "lx" || this.workType.startsWith("sc_"));
    }

    @Emit("ok-answer")
    okAnswer(): any {
        if (this.workType === "lx") {
            this.question.openAnalysis = true;
        }
        return null;
    }

    okAnswerFinsh(okAnswer: boolean, emit: boolean = true) {
        if (okAnswer) {
            this.question.okAnswer = okAnswer;

            this.question.userAnswer = this.question.answerList
                .map((a: any) => a.userInput)
                .join("|");
            if (emit) {
                this.okAnswer();
            }
        }
    }

    userAnswerChange() {
        if (this.workType === "jc") {
            this.question.userAnswer = this.question.answerList
                .map((a: any) => a.userInput)
                .join("|");
            this.question.okAnswer =
                this.question.answerList.filter((i: any) => !i.userInput)
                    .length === 0;
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
        .option {
            margin-bottom: 0.42rem;
        }
        .user-input {
            margin-bottom: 1rem;
        }
        .btn {
            margin-top: 1rem;
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
