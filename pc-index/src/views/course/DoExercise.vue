<template>
    <div class="app-width app-content xy-between page-box al-start">
        <div class="yx-between al-str jf-start full-width left-box">
            <div
                v-show="!isSc && !isFl"
                class="content-card b-c-fff chapter-body body-padding"
            >
                <div class="chapter-title fontSize67 bold f-c-333">
                    {{ (questionChapter || {}).chapterName }}
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
                @exam-over="examOver"
                @after-question-in-enter="questionEnter"
                @ok-answer="pushRecords"
            />
        </div>
        <div class="card">
            <QuestionCard
                ref="exercise"
                :showSelect="showSelect"
                :showClearBtn="showClearBtn"
                :show-card="!isSc && !isFl"
                :course-id="courseId"
                :classroom-id="classroomId"
                :test-page-rule-id="testPageRuleId"
                :work-type="workType"
                :work-types="workTypes"
                :now-question="nowQuestion"
                :question-data="nowQuestionData"
                :chapter-id="chapterId"
                @choose-index="chooseQuestionIndex"
                @change-type="changeType"
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
    questionList,
    addMemberQuestionLog,
    errorCorrection,
    questionLog,
    changeModule,
    rollbackLog,
    testingLog,
    examOver,
    cancelLog,
    questionDetail,
    collectList,
    chapterDetail,
    collectRank,
    errorList,
    errorRank,
    chapterQuestionCollectList,
    chapterQuestionErrorList,
    examAnalysis,
    homeworkQuestionList
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
    chooseShowType: number = 0; // 用户选择的类型 0代表试题回顾 1代表试题重做
    questionData: any = {
        lx: null,
        bt: null,
        jc: null
    };
    chapterId: string = "";
    testPageRuleId: string = "";
    courseId: string = "";
    classroomId: string = "";
    lectureId: string = "";
    homeworkId: string = "";
    workTypeFl: string = "";
    userInput: string = "";
    nowIndex: number = 0;
    showIndex: number = 0;
    dialogVisible: boolean = false;
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
        this.chapterId = this.$route.query.chapterId;
        // @ts-ignore
        this.testPageRuleId = this.$route.query.testPageRuleId;

        // @ts-ignore
        this.classroomId = this.$route.query.classroomId;
        // @ts-ignore
        this.courseId = this.$route.query.courseId;
        // @ts-ignore
        this.workType = this.$route.query.workType || "lx";

        // @ts-ignore
        this.workTypeFl = this.$route.query.workType || "lx";

        // @ts-ignore
        this.chooseShowType = this.$route.query.chooseShowType;
        // @ts-ignore
        this.nowIndex = parseInt(this.$route.query.idx);
        // @ts-ignore
        this.overType = this.$route.query.overType;
        // @ts-ignore
        this.timer = parseInt(this.$route.query.timer);
        // @ts-ignore
        this.overId = this.$route.query.overId;
        // @ts-ignore
        this.lectureId = this.$route.query.lectureId;
        // @ts-ignore
        this.homeworkId = this.$route.query.homeworkId;
        this.init(this.chapterId);
    }
    mounted() {
        if (this.returnType) {
            this.workType = "bt";
        }
    }
    init(chapterId: string) {
        if (this.isSc) {
            this.loadCollectList(this.workType);
        } else if (this.isFl) {
            this.loadChapterQuestionList(this.workType);
        } else if (this.isShowResult) {
            this.loadChapter(chapterId);
            this.loadExamAnalysis(this.workType);
        } else if (this.isDohomework) {
            this.loadChapter(chapterId);
            this.loadHomeworkQuestionList(this.workType);
        } else {
            // 获取章节详情
            this.loadChapter(chapterId);
            this.loadQuestionList(chapterId);
        }
    }

    get isSc() {
        return this.workType && this.workType.startsWith("sc_");
    }
    get isShowResult() {
        return this.workType && this.$route.query.workType === "showResult";
    }
    get isDohomework() {
        return this.workType && this.$route.query.workType === "doHomework";
    }
    get isFl() {
        return (
            (this.workType && this.workType.startsWith("fl_")) ||
            this.workTypeFl.startsWith("fl_")
        );
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
        if (!this.questionChapter) {
            return 0;
        }
        return (this.questionQuantity / this.questionList.length || 0) * 100;
    }

    get nowQuestion() {
        let question = this.questionList[this.showIndex];
        return !question || question.load === false ? null : question;
    }

    get questionQuantity() {
        return this.questionList.filter((q: any) => q.okAnswer).length;
    }

    get returnType() {
        return this.$store.state.returnType;
    }

    pushCorrectionInput({ errorCorrectionInput, errorCorrectionCheck }:{errorCorrectionInput:any;errorCorrectionCheck:any}) { // 试题纠错
        let question = this.nowQuestion;
        this.flagPromise(
            errorCorrection({
                categoryId: "",
                testPageRuleId: this.testPageRuleId,
                chapterId: this.chapterId,
                questionId: question.id,
                errorMark: errorCorrectionInput || "",
                errorType: errorCorrectionCheck || ""
            }),
            "pushErrorCorrectionFlag"
        ).then(() => {
            this.$message.success("纠错反馈成功");
            // @ts-ignore
            this.$refs.exercise.closeCorrection();
        });
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
            this.showClearBtn = false;
        });
    }
    loadExamAnalysis(workType: workType) {
        // 测试结束查看答案解析
        examAnalysis({
            classroomId: this.classroomId,
            courseId: this.courseId,
            testPageRuleId: this.testPageRuleId,
            chapterId: this.chapterId,
            id: this.overId,
            timer: this.timer,
            getQuestionLog: true
        }).then(r => {
            // console.log(r, "查看解析结果");
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
            this.showClearBtn = false;
        });
    }
    clearRecords() {
        // 清除做题记录
        this.$confirm("确认清除当前模式的做题记录吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        }).then(() => {
            cancelLog({
                classroomId: this.classroomId,
                courseId: this.courseId,
                testPageRuleId: this.testPageRuleId,
                chapterId: this.chapterId
            }).then(res => {
                this.$message.success("做题记录已清空");
                this.loadQuestionList(this.chapterId);
            })
        });
    }
    loadChapter(chapterId: string) {
        chapterDetail({ id: this.chapterId }).then(res => {
            this.questionChapter = res;
        });
    }
    getQuestionTypeData(type: string) {
        let data: Array<string> = [];
        this.questionList.forEach((q: any) => {
            if (q.questionType.name === type) {
                data.push(q.questionType.name);
            }
        });
        return data;
    }
    clickReturn() {
        this.$router.go(-1);
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
            let q = await this.loadQuestionDetail(
                this.questionList[index].id,
                this.questionList[index].testPageRuleId,
                this.questionList[index].chapterId
            );
            // console.log(q, 3055);
            this.questionList[index] = {
                ...this.questionList[index],
                ...q,
                load: true,
                openAnalysis: q.userAnswer,
                okAnswer: Boolean(q.userAnswer)
            };
            this.showIndex = index;
        } else {
            this.showIndex = index;
        }
    }
    questionEnter(index: number) {
        this.nowIndex = index;
    }

    changeDialogVisible() {
        this.dialogVisible = true;
    }

    loadCollectList(workType: workType) {
        let w = (res: any) => {
            let ids = res.records.map((item: any, index: number) => {
                return {
                    id: item.questionId,
                    index,
                    load: false,
                    testPageRuleId: item.testPageRuleId,
                    chapterId: item.chapterId
                };
            });
            this.questionData = {
                [workType || "lx"]: {
                    questionList: ids,
                    allType: {}
                }
            };
            this.showIndex = -1;
            this.chooseQuestionIndex(this.nowIndex);
        };
        let h = (res: any) => {
            let ids = res.map((item: any, index: number) => {
                return {
                    id: item.questionId,
                    index,
                    load: false,
                    testPageRuleId: item.testPageRuleId,
                    chapterId: item.chapterId
                };
            });
            this.questionData = {
                [workType || "lx"]: {
                    questionList: ids,
                    allType: {}
                }
            };
            this.showIndex = -1;
            this.chooseQuestionIndex(this.nowIndex);
        };
        if (workType === "sc_zsc") {
            collectList({
                // 获取最新收藏
                courseId: this.courseId,
                classroomId: this.classroomId,
                currentPage: 1,
                pageSize: 5
            }).then(res => {
                // console.log(res, "最新收藏试题列表")
                w(res);
            });
        } else if (workType === "sc_scb") {
            collectRank({
                // 收藏榜
                courseId: this.courseId,
                classroomId: this.classroomId
            }).then(res => {
                // console.log(res, "收藏榜")
                h(res);
            });
        } else if (workType === "sc_zct") {
            errorList({
                // 最新错题
                courseId: this.courseId,
                classroomId: this.classroomId,
                currentPage: 1,
                pageSize: 5
            }).then(res => {
                // console.log(res, "最新错题")
                w(res);
            });
        } else if (workType === "sc_ctb") {
            errorRank({
                // 错题榜
                courseId: this.courseId,
                classroomId: this.classroomId
            }).then(res => {
                h(res);
            });
        }
    }
    async loadQuestionDetail(
        questionId: string,
        testPageRuleId: string,
        chapterId: string
    ) {
        // console.logtestPageRuleId, 3966)
        return questionDetail({
            courseId: this.courseId,
            classroomId: this.classroomId,
            testPageRuleId: testPageRuleId,
            chapterId: chapterId,
            questionId: questionId
        });
    }
    loadQuestionList(chapterId: string) {
        this.flagPromise(
            questionList({
                courseId: this.courseId,
                classroomId: this.classroomId,
                testPageRuleId: this.testPageRuleId,
                chapterId
            }),
            "fetchQuestion"
        ).then((r: any) => {
            // console.log(r, "列表");
            this.examLogId = r.memberExamLogId;
            r.questionList = r.questionList.map((q: any, index: number) => {
                return {
                    ...q,
                    index,
                    answerRightFlag: 0,
                    answerScore: 0,
                    answerList: q.answerList.map(
                        (c:any, idx:any) => {
                            return {
                                ...c,
                                userInput: (q.userAnswer || "").split("|").length <= idx ? "" : (q.userAnswer || "").split("|")[idx]
                            }
                        }
                    )
                };
            });
            let json = JSON.stringify(r);
            this.originDataJson = json;
            // console.log(this.originDataJson, 356666)
            let workTypes = r.list.map((n: any) => {
                if (n.isDefault === 0 && !this.returnType) {
                    this.workType = workTypesConf[n.answerModel].key;
                }
                return workTypesConf[n.answerModel];
            });
            this.workTypes = workTypes;
            for (let k in workTypes) {
                this.settingInitData(workTypes[k].key);
            }
        });
    }
    loadChapterQuestionList(workType: workType) {
        // 获取收藏分类和错题分类下边试题详情
        let handelRes = (r: any) => {
            this.examLogId = r.memberExamLogId;
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
            if (this.chooseShowType === 0) {
                this.workType = "bt";
                this.settingInitDataFl(this.workType);
            } else if (this.chooseShowType === 1) {
                this.workType = "lx";
                this.settingInitDataFl(this.workType);
            }
        };
        if (workType === "fl_sc") {
            chapterQuestionCollectList({
                courseId: this.courseId,
                classroomId: this.classroomId,
                testPageRuleId: this.testPageRuleId,
                chapterId: this.chapterId,
                showType: this.chooseShowType
            }).then(r => {
                // console.log(r, "收藏分类试题详情");
                handelRes(r);
            });
        } else if (workType === "fl_ct") {
            chapterQuestionErrorList({
                courseId: this.courseId,
                classroomId: this.classroomId,
                testPageRuleId: this.testPageRuleId,
                chapterId: this.chapterId,
                showType: this.chooseShowType
            }).then(r => {
                // console.log(r, "错题分类详情");
                handelRes(r);
            });
        }
    }
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
    pushRecords() {
        // 用户选择答案后触发
        let question = this.nowQuestion;
        // console.log(this.workType, "当前的做题模式58999");
        // console.log(question, "当前题目");
        // console.log(question.userAnswer, "当前题目用户答案");
        if (this.workType === "lx") {
            questionLog({
                classroomId: this.classroomId,
                courseId: this.courseId,
                testPageRuleId: this.testPageRuleId,
                chapterId: this.chapterId,
                questionId: question.id,
                rightFlag: question.answerRightFlag * 1,
                answer: question.userAnswer
            });
        } else if (this.workType === "jc") {
            testingLog({
                classroomId: this.classroomId,
                courseId: this.courseId,
                testPageRuleId: this.testPageRuleId,
                chapterId: this.chapterId,
                questionId: question.id,
                rightFlag: question.answerRightFlag * 1,
                answer: question.userAnswer,
                score: question.fraction,
                examLogId: this.examLogId
            });
        }
    }
    changeType({
        chooseType,
        examTime
    }: {
        chooseType: workType;
        examTime: number;
    }) {
        if (chooseType === this.workType) {
            return;
        }
        this.examTimer = examTime;
        // console.log(this.examTimer, "考试时间529")
        let question = this.nowQuestion;
        let mondelMapping: any = {
            lx: 0,
            jc: 1,
            bt: 2
        };
        changeModule({
            classroomId: this.classroomId,
            courseId: this.courseId,
            testPageRuleId: this.testPageRuleId,
            chapterId: this.chapterId,
            questionId: question.id,
            answerModel: mondelMapping[chooseType || "lx"],
            preAnswerModel: mondelMapping[this.workTypeBak || "lx"],
            examLogId: this.examLogId || null,
            timer: this.examTimer | 0
        }).then(res => {
            // 切换模式后必须重新拉取试题
            this.loadQuestionList(this.chapterId);
        });
        if (this.workType === "lx") {
            rollbackLog({
                classroomId: this.classroomId,
                courseId: this.courseId,
                testPageRuleId: this.testPageRuleId,
                chapterId: this.chapterId,
                questionId: question.id
            });
        } else if (this.workType === "jc") {
            examOver({
                classroomId: this.classroomId,
                courseId: this.courseId,
                testPageRuleId: this.testPageRuleId,
                chapterId: this.chapterId,
                id: this.examLogId,
                timer: this.examTimer | 0,
                getQuestionLog: true
            });
        }

        this.workTypeBak = chooseType;
    }
    examOver() {
        // 交卷按钮
        this.$confirm("确定要交卷？", "提示信息", {
            distinguishCancelAndClose: true,
            cancelButtonText: "取消",
            confirmButtonText: "确认"
        }).then(() => {
            // @ts-ignore
            this.$refs.exercise.changeType(this.workType);
            // @ts-ignore
            let examTime = this.$refs.exercise.examTime;
            // console.log(examTime, 58333)
            this.$router.push({
                path: "/course/ExamResult",
                query: {
                    chapterName: this.questionChapter.chapterName,
                    classroomId: this.classroomId,
                    courseId: this.courseId,
                    testPageRuleId: this.testPageRuleId,
                    chapterId: this.chapterId,
                    examLogId: this.examLogId,
                    timer: examTime + ""
                }
            });
        });
    }
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
