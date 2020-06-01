<template>
    <div>
        <div v-if="showResult" class="main">
            <div class="body">
                <div class="top">{{ chapterName }}</div>
                <div class="middle">
                    <div class="mtop">
                        <div>检测结果</div>
                    </div>

                    <div class="m-bot">
                        <div class="mleft">
                            <div>
                                <el-progress
                                    type="dashboard"
                                    :percentage="accuracy"
                                    color="#96C321"
                                    :width="160"
                                    :stroke-width="8"
                                />
                            </div>
                            <div class="rightcount">正确率</div>
                        </div>
                        <div v-if="list !== ''" class="mright">
                            <div v-for="(item, n) in list" :key="n" class="mm">
                                <div class="mmleft">
                                    <div>{{ item.questionTypeName }}</div>
                                    <div>({{ item.totalScore }}题)</div>
                                </div>
                                <div class="mmright">
                                    正确
                                    <span>{{ item.score }}</span
                                    >题
                                </div>
                            </div>
                        </div>
                        <div v-else class="mright">还没有参加考试</div>
                    </div>
                </div>
                <div class="bottom xy-between">
                    <div class="b-left" @click="oncemore">
                        <i class="el-icon-house" />
                        <span>回到首页</span>
                    </div>
                    <a href="course/DoExercise" style="display:none;"></a>
                    <div class="b-mid">
                        <i class="el-icon-tickets" />
                        <span @click="handView('ckjx')">查看答案解析</span>
                    </div>

                    <div class="b-right" @click="oncemore">
                        <i class="el-icon-refresh-right" />
                        <span>重考一次</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import { examOver, examAnalysis } from "@/action";
import { mapState } from "vuex";
export default {
    data() {
        return {
            showResult: true,
            returnType: this.$store.state.returnType,
            chapterName: "",
            classroomId: "",
            courseId: "",
            testPageRuleId: "",
            chapterId: "",
            examLogId: "",
            timer: 0,
            percentage: 0,
            flag: false,
            list: [],
            accuracy: 0,
            chapterid: "",
            lmid: "",
            looklist: [],
            next: 0,
            errorQuestionIds: [] // 所有错题id,
        };
    },
    watch: {},
    created() {
        this.chapterName = this.$route.query.chapterName;
        this.classroomId = this.$route.query.classroomId;
        this.courseId = this.$route.query.courseId;
        this.testPageRuleId = this.$route.query.testPageRuleId;
        this.chapterId = this.$route.query.chapterId;
        this.examLogId = this.$route.query.examLogId;
        this.timer = parseInt(this.$route.query.timer);
        this.postExamOver();
    },
    methods: {
        handView(overType) {
            // console.log(this.examLogId)
            this.$router.push({
                path: "/course/DoExercise",
                query: {
                    overType: overType,
                    workType: "showResult",
                    timer: this.timer,
                    classroomId: this.classroomId,
                    courseId: this.courseId,
                    testPageRuleId: this.testPageRuleId,
                    chapterId: this.chapterId,
                    overId: this.examLogId
                }
            })
        },
        oncemore() {
            // 重考
            this.$router.go(-1);
        },
        postExamOver() {
            examOver({
                classroomId: this.classroomId,
                courseId: this.courseId,
                testPageRuleId: this.testPageRuleId,
                chapterId: this.chapterId,
                id: this.examLogId,
                timer: this.timer,
                getQuestionLog: true
            }).then(res => {
                // console.log(res, "检测结果");
                if (res.accuracy !== null) {
                    this.accuracy = parseInt(res.accuracy);
                }
                this.list = res.testPageQuestionCountList;
                this.errorQuestionIds = res.errorQuestionIds;
            });
        }
    }
};
</script>

<style>
.el-progress__text {
    font-size: 30px !important;
    color: #96c321;
}
</style>

<style lang="scss" scoped>
.main {
    padding: 50px 0;
    display: flex;
    align-items: center;
    background: #f5f8f6;
}
.body {
    width: 1200px;
    margin: 0 auto;
    min-height: 300px;
    background: white;
    padding: 20px;
    border-radius: 20px;
}
.top {
    width: 80%;
    margin: 0 auto;
    text-align: center;
    font-size: 17px;
    font-weight: 600;
    margin-top: 20px;
    margin-bottom: 20px;
}
.middle {
    padding: 5px;
    border-radius: 5px;
    margin: 0 auto;
    margin-top: 18px;
    margin-bottom: 18px;
    width: 80%;
    box-shadow: 0px 0px 6px #eee;
}
.rightcount {
    text-align: center;
    color: #96c321;
    font-weight: 600;
    font-size: 20px;
}
.m-bot {
    border-top: 1px solid #f5f5f5;
    padding: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.mright {
    width: 40%;
    margin-left: 80px;
    .mm:not(:last-of-type) {
        border-bottom: 1px solid #999999;
    }
}
.mmleft {
    div:nth-of-type(1) {
        font-size: 14px;
    }
    div:nth-of-type(2) {
        font-size: 15px;
        color: #999999;
        margin-left: 5px;
    }
}
.mm {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    .mmleft {
        display: flex;
        align-items: center;
    }
}
.mmright {
    color: #999999;
    font-size: 12px;
    span {
        color: #96c321;
        font-size: 15px;
        padding: 0 5px;
    }
}
.mtop {
    margin: 9px 0;
    font-size: 22px;
    font-weight: 600;
    text-align: center;
    margin-top: 20px;
    margin-bottom: 20px;
    div {
        border-bottom: 2px solid #96c321;
        width: 100px;
        margin: 0 auto;
        font-size: 16px;
    }
}
.bottom {
    width: 80%;
    margin: 0 auto;
    margin-top: 60px;
    margin-bottom: 50px;
    div {
        cursor: pointer;
    }
    .b-left {
        background: #96c321;
        color: white;
        padding: 6px 20px;
        border-radius: 5px;
    }
    .b-mid {
        background: #96c321;
        color: white;
        padding: 6px 20px;
        border-radius: 5px;
    }
    .b-right {
        background: #fd4852;
        color: white;
        padding: 6px 20px;
        border-radius: 5px;
    }
    div {
        font-size: 17px;
        display: flex;
        align-items: center;
        span {
            margin-left: 5px;
            font-size: 16px;
        }
    }
}
</style>
