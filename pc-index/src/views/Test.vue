<template>
    <div class="app-width app-content xy-between page-box al-start">
        <div class="yx-between al-str jf-start full-width left-box">
            <div class="content-card b-c-fff chapter-body body-padding">
                <div class="chapter-title fontSize67 bold f-c-333">
                    {{ questionChapter.chapterName }}
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
            />
        </div>
        <div class="card">
            <QuestionCard
                :course-id="courseId"
                :classroom-id="classroomId"
                :test-page-rule-id="testPageRuleId"
                :work-type="workType"
                :work-types="workTypes"
                :now-question="nowQuestion"
                :question-data="nowQuestionData"
                :question-chapter="questionChapter"
                @choose-index="chooseQuestionIndex"
                @chang-type="changeType"
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
    cancelLog
} from "@/action";
import { VueComponent, VuePage } from "@/vue";
import DoExercise from "@/components/question/DoExercise.vue";
import QuestionCard from "@/components/question/QuestionCard.vue";
type workType = "bt" | "lx" | "jc" | "see" | null;
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
export default class Test extends VuePage {
    questionChapter: any;
    originDataJson: string | null = null;
    originData: any = null;
    questionData: any = {
        lx: null,
        bt: null,
        jc: null
    };
    testPageRuleId: string = "";
    courseId: string = "";
    classroomId: string = "";

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
        let obj = {
            chapterName: "测试章节",
            id: "20200103103503-25404b6d-315b-4d9d-b96a-13a43e5b2dfe"
        };
        // @ts-ignore
        this.questionChapter = this.$route.query.chapter || obj;
        // @ts-ignore
        this.testPageRuleId =
            this.$route.query.testPageRuleId ||
            "20200317170428-e9e3e160-37f0-47b4-b2e7-8a4a4d5e4ee9";
        // @ts-ignore
        this.classroomId =
            this.$route.query.classroomId ||
            "20200108092937-6b0c86de-0ba6-4788-a3d8-90f313df9af1";
        // @ts-ignore
        this.courseId =
            this.$route.query.courseId ||
            "20200108105205-1e741c37-ba29-4ce6-82cd-0fba331f246c";
        // @ts-ignore
        this.workType = this.$route.query.workType || "lx";
        this.loadQuestionList(this.questionChapter);
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

    get chapterId() {
        return (this.questionChapter || {}).id;
    }
    get nowQuestion() {
        return this.questionList[this.showIndex] || null;
    }

    get questionQuantity() {
        return this.questionList.filter((q: any) => q.okAnswer).length;
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
    chooseQuestionIndex(index: number) {
        this.showIndex = index;
    }
    questionEnter(index: number) {
        this.nowIndex = index;
    }

    loadQuestionList(chapter: any) {
        this.flagPromise(
            questionList({
                courseId: this.courseId,
                classroomId: this.classroomId,
                testPageRuleId: this.testPageRuleId,
                chapterId: this.questionChapter.id
            }),
            "fetchQuestion"
        ).then((r: any) => {
            this.examLogId = r.memberExamLogId;
            for (let index = 0; index < r.questionList.length; index++) {
                r.questionList[index] = {
                    ...r.questionList[index],
                    index,
                    answerRightFlag: 0,
                    answerScore: 0
                };
            }
            let json = JSON.stringify(r);
            this.originDataJson = json;
            let workTypes = r.list.map((n: any) => {
                if (n.isDefault === 0) {
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

    pushRecords() {
        let question = this.nowQuestion;
        // console.log(this.workType, "当前的做题模式58999");
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
    settingInitData(key: string) {
        if (this.originDataJson) {
            let copyData = JSON.parse(this.originDataJson);
            let questionList = copyData.questionList.map((n: any) => {
                return {
                    ...n,
                    openAnalysis: key === "bt",
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

    examOver() {
        // let examTimer = this.hour * 3600 + this.minute * 60 + this.second;
        // this.examTimer = examTimer;
        // examOver({
        //     classroomId: this.classroomId,
        //     courseId: this.courseId,
        //     testPageRuleId: this.testPageRuleId,
        //     chapterId: this.chapterId,
        //     id: this.examLogId,
        //     timer: this.examTimer
        // });
    }
    changeType(chooseType: workType) {
        this.workType = chooseType;
        // 切换模式
        // let question = this.nowQuestion;
        // this.examTimer = examTimer;
        // // console.log(question, timer, 662);
        // if (this.workType === "lx") {
        //     rollbackLog({
        //         classroomId: this.classroomId,
        //         courseId: this.courseId,
        //         testPageRuleId: this.testPageRuleId,
        //         chapterId: this.chapterId,
        //         questionId: question.id
        //     });
        // }
        // let mondelMapping: any = {
        //     lx: 0,
        //     jc: 1,
        //     bt: 2
        // };
        // changeModule({
        //     classroomId: this.classroomId,
        //     courseId: this.courseId,
        //     testPageRuleId: this.testPageRuleId,
        //     chapterId: this.chapterId,
        //     questionId: question.id,
        //     answerModel: mondelMapping[chooseType || "lx"],
        //     preAnswerModel: mondelMapping[this.workTypeBak || "lx"],
        //     examLogId: this.examLogId || null,
        //     timer: this.examTimer |examOver| 0
        // }).then(res => {
        //     questionList({
        //         // 切换模式刷新试题
        //         courseId: this.courseId,
        //         classroomId: this.classroomId,
        //         testPageRuleId: this.testPageRuleId,
        //         chapterId: this.questionChapter.id
        //     }).then(res => {
        //         this.examLogId = res.memberExamLogId;
        //         this.disabledType = false;
        //     });
        // });
        this.workTypeBak = chooseType;
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
