<template>
    <div
        v-if="question"
        class="yx-center jf-start al-str content-card question-detail full-width full-height"
    >
        <div class="question-title xy-center jf-start al-start body-padding" style="max-height:12rem;overflow-y:auto;">
            <span class="f-c-333 q-index">{{ question.index + 1 }}</span>
            <div class="xy-center jf-start al-start title-body fontSize75">
                <div class="type bold">
                    [{{ (question.questionType || {}).name }}]
                </div>
                <div class="content" v-html="question.stem" ></div>
            </div>
        </div>
        <!-- 单选多选和不定项选择 -->
        <ChooseQuestion
            v-if="
                question.questionType.type === '0' ||
                    question.questionType.type === '1' ||
                    question.questionType.type === '2'
            "
            :question="question"
            :work-type="workType"
            @ok-answer="okAnswer"
            :only-readly="onlyReadly"
        />
        <!-- 填空和材料题 -->
        <FillBlankQuestion
            v-if="
                question.questionType.type === '3' ||
                    question.questionType.type === '4'
            "
            :question="question"
            :work-type="workType"
            @ok-answer="okAnswer"
            :only-readly="onlyReadly"
        />
        <!-- 判断 -->
        <JudgeQuestion
            v-if="question.questionType.type === '5'"
            :question="question"
            :work-type="workType"
            @ok-answer="okAnswer"
            :only-readly="onlyReadly"
        />
        <div
            v-show="question.openAnalysis"
            class="b-c-fff parsing yx-center jf-start al-str body-padding"
        >
            <div class="f-c-root fontSize67 bold">【解析】</div>
            <div
                class="parsing-html f-c-333 fontSize58"
                v-html="question.analysis"
            ></div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Emit } from "vue-property-decorator";
import { questionList } from "@/action";
import { VueComponent } from "@/vue";
import ChooseQuestion from "./ChooseQuestion.vue";
import FillBlankQuestion from "./FillBlankQuestion.vue";
import JudgeQuestion from "./JudgeQuestion.vue";

@Component({
    components: {
        ChooseQuestion,
        FillBlankQuestion,
        JudgeQuestion
    }
})
export default class QuestionWrapper extends VueComponent {
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

    @Emit("ok-answer")
    okAnswer() {
        return null;
    }

    @Emit("submit-answer")
    submitAnswer() {
        return null;
    }
}
</script>

<style scoped lang="scss">
.content-card {
    border-radius: 0.42rem;
}
.question-detail {
    background-color: #f1f3f6;
    overflow: hidden;
    .question-title {
        padding-top: 1.08rem;
        padding-bottom: 1.13rem;

        .q-index {
            font-size: 0.83rem;
        }
        .title-body {
            margin-left: 0.67rem;
            flex-wrap: wrap;
            .type {
                margin-right: 0.3em;
            }
        }
    }
    .parsing {
        padding-top: 1.08rem;
        padding-bottom: 2.58rem;
        padding-left: 0.75rem;
    }
}
</style>
