<template>
    <div class="app-width app-content xy-between page-box al-start">
        <div class="yx-between al-str jf-start full-width left-box">
            <div class="content-card b-c-fff chapter-body body-padding">
                <div class="chapter-title fontSize67 bold f-c-333">
                    {{ homeworkName }}
                </div>
                <div class="xy-between progress">
                    <el-progress :percentage="progress" :show-text="false">
                    </el-progress>
                    <div class="progress-text fontSize5 f-c-666">
                        已做<span class="f-c-root already fontSize76 bold">{{
                            questionQuantity
                        }}</span
                        >/共{{ questionList.length }}
                    </div>
                </div>
            </div>
            <DoExercise
                :work-type="workType"
                :now-question="nowQuestion"
                :size="questionList.length"
                @change="questionChange"
                @after-question-in-enter="questionEnter"
                @ok-answer="pushRecords"
            />
        </div>
        <div class="card">
            <QuestionCard
                ref="questionCard"
                :showSelect="showSelect"
                :showClearBtn="showClearBtn"
                :showCollect="showCollect"
                :course-id="courseId"
                :classroom-id="classroomId"
                :test-page-rule-id="testPageRuleId"
                :work-type="workType"
                :work-types="workTypes"
                :now-question="nowQuestion"
                :question-data="nowQuestionData"
                :chapter-id="chapterId"
                @choose-index="chooseQuestionIndex"
                @click-return="clickReturn"
                @clear-records="clearRecords"
                @push-correction-input="pushCorrectionInput"
                @change-dialogVisible="changeDialogVisible"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Emit } from "vue-property-decorator";
import {
    homeworkQuestionList,
    homeworkRemoveLog,
    homeworkQuestionLog,
    chapterDetail,
    homeworkErrorCorrection
} from "@/action";
import { VueComponent, VuePage } from "@/vue";
import DoExercise from "@/components/question/DoExercise.vue";
import QuestionCard from "@/components/question/QuestionCard.vue";
import { mapState } from "vuex";
type workType =
    | "bt"
    | "lx"
    | "jc"
    | "see"
    | "sc_zsc"
    | "sc_scb"
    | "sc_ctb"
    | "sc_zct"
    | "fl_sc"
    | "fl_ct"
    | "showResult"
    // | "doHomework"
    | null;
const workTypesConf: any = {
    "0": {
        key: "lx",
        name: "练习模式"
    },
    "1": {
        key: "jc",
        name: "检测模式"
    },
    "2": {
        key: "bt",
        name: "背题模式"
    }
};
@Component({
    components: {
        QuestionCard,
        DoExercise
    }
})
export default class Index extends VuePage {
    overType: any = null;
    showSelect: boolean = true;
    showCollect:boolean = true;
    showClearBtn: boolean = true;
    timer: number = 0;
    overId: string | null = null;
    questionChapter: any = null;
    questionItem: any;
    collectList: any;
    questionItemIdx: number = 0;
    userRequestType: number = 0;
    originDataJson: string | null = null;
    originData: any = null;
    dialogVisible: boolean = false;
    chooseShowType: number = 0; // 用户选择的类型 0代表试题回顾 1代表试题重做
    questionData: any = {
        lx: null,
        bt: null,
        jc: null
    };
    chapterId: string = "";
    testPageRuleId: string = "";
    courseId: string = "";
    homeworkName: string = ";"
    classroomId: string = "";
    lectureId: string = "";
    homeworkId: string = "";
    workTypeFl: string = "";
    userInput: string = "";
    nowIndex: number = 0;
    showIndex: number = 0;
    workType: workType = null;
    workTypeBak: workType = null;
    workTypes: Array<any> = [];

    examTimer: number = 0;
    examLogId: string | null = null;

    flag: {
        [key: string]: boolean;
    } = {
        fetchQuestion: false
    };

    created() {
        // @ts-ignore
        this.courseId = this.$route.query.courseId;
        // @ts-ignore
        this.classroomId = this.$route.query.classroomId;
        // @ts-ignore
        this.homeworkId = this.$route.query.homeworkId;
        // @ts-ignore
        this.lectureId = this.$route.query.lectureId;
        // @ts-ignore
        this.chapterId = this.$route.query.chapterId;
        // @ts-ignore
        this.homeworkName = this.$route.query.homeworkName;
        this.init();
        this.showCollect = false;
    }
    init() {
        this.loadChapter(this.homeworkId);
        this.loadHomeworkQuestionList(this.workType);
    }
    get nowQuestionData() {
        return this.questionData[this.workType || "lx"] || {};
    }
    get questionList() {
        if (this.workType) {
            return this.nowQuestionData.questionList || [];
        }
        return [];
    }
    get progress(): number {
        if (!this.homeworkName) {
            return 0;
        }
        return (this.questionQuantity / this.questionList.length || 0) * 100;
    }

    get questionQuantity() {
        return this.questionList.filter((q: any) => q.okAnswer).length;
    }

    get nowQuestion() {
        let question = this.questionList[this.showIndex];
        return !question || question.load === false ? null : question;
    }

    get returnType() {
        return this.$store.state.returnType;
    }
    loadHomeworkQuestionList(workType: workType) {
        homeworkQuestionList({
            courseId: this.courseId,
            classroomId: this.classroomId,
            lectureId: this.lectureId,
            homeworkId: this.homeworkId
        }).then(r => {
            // console.log(r, "课后作业试题列表");
            for (let index = 0; index < r.length; index++) {
                r[index] = {
                    ...r[index],
                    index,
                    answerRightFlag: 0,
                    answerScore: 0
                };
            }
            let json = JSON.stringify(r);
            this.originDataJson = json;
            // console.log(this.originDataJson, 39000);
            this.workType = "lx";
            this.settingInitDataFl(this.workType);
            this.showSelect = false;
            // this.showClearBtn = false;
        });
    }
    clearRecords() {
        // 清除做题记录
        this.$confirm("确认清除当前模式的做题记录吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        }).then(() => {
            homeworkRemoveLog({
                homeworkId: this.homeworkId,
                courseId: this.courseId,
                lectureId: this.lectureId
            }).then(res => {
                this.$message.success("做题记录已清空");
                this.loadHomeworkQuestionList(this.workType);
            })
        });
    }
    pushRecords() {
        // 用户选择答案后触发
        let question = this.nowQuestion;
        // console.log(question, "当前课后作业题目")
        homeworkQuestionLog({
            homeworkId: this.homeworkId,
            courseId: this.courseId,
            questionId: question.id,
            lectureId: this.lectureId,
            rightFlag: question.answerRightFlag * 1,
            answer: question.userAnswer
        })
    }
    loadChapter(chapterId: string) {
        // 加载章节名称
        chapterDetail({ id: this.homeworkId }).then(res => {
            // console.log(res, "课后作业的章节名称结果为空")
            // this.questionChapter = res;
        });
    }
    clickReturn() {
        this.$router.go(-1);
    }
    changeDialogVisible() {
        this.dialogVisible = true;
    }

    pushCorrectionInput({ errorCorrectionInput, errorCorrectionCheck }:{errorCorrectionInput:any;errorCorrectionCheck:any}) { // 试题纠错
        let question = this.nowQuestion;
        this.flagPromise(
            homeworkErrorCorrection({
                homeworkId: this.homeworkId,
                courseId: this.courseId,
                lectureId: this.lectureId,
                questionId: question.id,
                errorMark: errorCorrectionInput || "",
                errorType: errorCorrectionCheck || ""
            }),
            "pushErrorCorrectionFlag"
        ).then(() => {
            this.$message.success("纠错反馈成功");
            // @ts-ignore
            this.$refs.questionCard.closeCorrection();
        });
    }

    questionChange(type: boolean) {
        this.chooseQuestionIndex(
            type ? this.showIndex + 1 : this.showIndex - 1
        );
    }
    async chooseQuestionIndex(index: number) {
        if (
            this.questionList[index] &&
            this.questionList[index].load === false
        ) {
            // let q = await this.loadQuestionDetail(
            //     this.questionList[index].id,
            //     this.questionList[index].testPageRuleId,
            //     this.questionList[index].chapterId
            // );
            // // console.log(q, 3055);
            // this.questionList[index] = {
            //     ...this.questionList[index],
            //     ...q,
            //     load: true,
            //     openAnalysis: q.userAnswer,
            //     okAnswer: Boolean(q.userAnswer)
            // };
            this.showIndex = index;
        } else {
            this.showIndex = index;
        }
    }
    questionEnter(index: number) {
        this.nowIndex = index;
    }

    // async loadQuestionDetail(
    //     questionId: string,
    //     testPageRuleId: string,
    //     chapterId: string
    // ) {
    //     console.logtestPageRuleId, 3966)
    //     return questionDetail({
    //         courseId: this.courseId,
    //         classroomId: this.classroomId,
    //         testPageRuleId: testPageRuleId,
    //         chapterId: chapterId,
    //         questionId: questionId
    //     });
    // }

    settingInitDataFl(key: string) {
        if (this.originDataJson) {
            // console.log(this.originDataJson, 1111);
            let copyData = JSON.parse(this.originDataJson);
            let questionList = copyData.map((n: any) => {
                return {
                    ...n,
                    openAnalysis: key === "bt" || n.userAnswer,
                    okAnswer: key === "bt" || Boolean(n.userAnswer)
                };
            });
            let allType: Array<string> = [];
            questionList.forEach((q: any) => {
                if (!allType.includes(q.questionType.name)) {
                    allType.push(q.questionType.name);
                }
            });
            this.questionData[key] = {
                ...copyData,
                questionList,
                allType: allType.map((name: string) => {
                    return {
                        name,
                        list: questionList.filter(
                            (q: any) => q.questionType.name === name
                        )
                    };
                })
            };
        }
    }
    settingInitData(key: string) {
        if (this.originDataJson) {
            let copyData = JSON.parse(this.originDataJson);
            let questionList = copyData.questionList.map((n: any) => {
                return {
                    ...n,
                    openAnalysis: key === "bt" || n.userAnswer,
                    okAnswer: key === "bt" || Boolean(n.userAnswer)
                };
            });
            let allType: Array<string> = [];
            questionList.forEach((q: any) => {
                if (!allType.includes(q.questionType.name)) {
                    allType.push(q.questionType.name);
                }
            });
            this.questionData[key] = {
                ...copyData,
                questionList,
                allType: allType.map((name: string) => {
                    return {
                        name,
                        list: questionList.filter(
                            (q: any) => q.questionType.name === name
                        )
                    };
                })
            };
        }
    }

    // let question = this.nowQuestion;
    // console.log(question, "当前题目");
    // console.log(question.userAnswer, "当前题目用户答案");
    // if (this.workType === "lx") {
    //     questionLog({
    //         classroomId: this.classroomId,
    //         courseId: this.courseId,
    //         testPageRuleId: this.testPageRuleId,
    //         chapterId: this.chapterId,
    //         questionId: question.id,
    //         rightFlag: question.answerRightFlag * 1,
    //         answer: question.userAnswer
    //     });
    // } else if (this.workType === "jc") {
    //     testingLog({
    //         classroomId: this.classroomId,
    //         courseId: this.courseId,
    //         testPageRuleId: this.testPageRuleId,
    //         chapterId: this.chapterId,
    //         questionId: question.id,
    //         rightFlag: question.answerRightFlag * 1,
    //         answer: question.userAnswer,
    //         score: question.fraction,
    //         examLogId: this.examLogId
    //     });
    // }
}
</script>

<style scoped lang="scss">
.page-box {
    margin-top: 1.13rem;
}
.content-card {
    border-radius: 0.42rem;
}
.body-padding {
    padding-left: 1.08rem;
    padding-right: 1.17rem;
}
.card {
    width: 27.16%;
}
.left-box {
    width: 71.16%;
}

.chapter-body {
    padding-top: 1.29rem;
    padding-bottom: 1.5rem;
    margin-bottom: 0.75rem;
}
</style>
<style>
.chapter-body .el-progress {
    margin-right: 1.29rem;
    flex-grow: 1;
    padding-top: 0.2rem;
}
</style>
