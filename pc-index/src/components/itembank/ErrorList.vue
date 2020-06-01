<template>
    <div class="b-c-fff">
        <div
            class="top xy-between jf-start pointer"
            v-if="showReturn"
            @click="returnItemBank"
        >
            <img src="@/assets/course/return.png" class="returnIcon" />
            <div class="fontSize58 return">
                返回
            </div>
        </div>
        <el-menu
            default-active="0"
            class="el-menu-demo"
            active-text-color="#96C321"
            mode="horizontal"
            text-color="#333333"
        >
            <el-menu-item
                :index="n + ''"
                v-for="(item, n) in navList"
                :key="n"
                @click="changeErrorType(item)"
            >
                {{ item.name }}
            </el-menu-item>
        </el-menu>
        <el-menu>
            <!-- 最新错题部分 -->
            <div v-if="activeNav === 'newError'" class="fontSize58 contain">
                <div
                    v-for="(item, index) in newErrorList.content"
                    v-show="newErrorList.content.length !== 0"
                    :key="index"
                    style="border-bottom:1px solid #ddd;"
                >
                    <div class="xy-between containItem">
                        <div
                            class="pointer"
                            @click="toQuestionBankZct(item, index)"
                            style="width:95%;"
                        >
                            <div
                                class="xy-between jf-start"
                                style="max-height: 4rem;overflow-y: auto;"
                            >
                                <div
                                    class="fontSize58 f-c-333"
                                    style="width:5%;"
                                >
                                    {{ index + 1 }} 、
                                </div>
                                <div
                                    style="width:95%;"
                                    class="fontSize58 f-c-333 newErrorStem"
                                    v-html="item.stem"
                                ></div>
                            </div>
                            <div class="source fontSize5 f-c-9d">
                                {{ item.source }}
                            </div>
                        </div>
                        <!-- <div
                            style="width:5%;"
                            class="yx-center operation-item f-c-666 pointer"
                            @click="questionCollect(item)"
                        >
                            <i
                                class="icon iconfont icon-shoucang f-c-root"
                                v-show="item.collectFlag"
                            />
                            <i
                                class="icon iconfont icon-shoucang1"
                                v-show="!item.collectFlag"
                            />
                        </div> -->
                    </div>
                </div>
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :page-size="newErrorList.size"
                    :total="newErrorList.total"
                    v-if="newErrorList.total !== 0"
                    style="text-align: center; margin-top: 0.5rem;"
                    @current-change="newErrorChange"
                >
                </el-pagination>
                <div v-show="newErrorList.content.length === 0">暂无题目</div>
            </div>
            <!--错题分类部分 -->
            <div v-if="activeNav === 'classification'" class="fontSize58">
                <el-menu
                    default-active="0"
                    class="el-menu-demo"
                    active-text-color="#96C321"
                    mode="horizontal"
                    text-color="#333333"
                >
                    <el-menu-item
                        :index="index + ''"
                        v-for="(item, index) in classification.subNavList"
                        :key="index"
                        @click="handleClassification(item)"
                        >{{ item.name }}
                    </el-menu-item>
                </el-menu>
                <!-- 错题分类下边的内容 -->
                <div v-if="classification.content.length !== 0">
                    <div class="fontSize58 chaptit xy-between jf-start f-c-9d">
                        <div style="width:65%;padding-left:2.38rem;">
                            章节名称
                        </div>
                        <div style="width:35%;">收藏数</div>
                    </div>
                    <ChapterItem
                        :numType="numType"
                        :startBtnType="startBtnType"
                        v-for="(item, index) in classification.content"
                        :key="index"
                        :chapter-item="item"
                        @start-question1="startQuestion1"
                    />
                </div>
                <div v-else class="padding-1rem f-c-333">暂无题目</div>
            </div>
            <!-- 错题榜部分 -->
            <div v-if="activeNav === 'errorList'" class="fontSize58 contain">
                <div
                    v-for="(item, index) in errorList"
                    :key="index"
                    v-show="errorList.length !== 0"
                    class="xy-between containItem"
                >
                    <div
                        @click="toQuestionBankCtb(item, index)"
                        class="pointer"
                        style="width:100%;"
                    >
                        <div
                            class="xy-between jf-start"
                            style="max-height: 4rem;overflow-y: auto;"
                        >
                            <div class="fontSize58 f-c-333" style="width:5%;">
                                {{ index + 1 }} 、
                            </div>
                            <div
                                style="width:95%;"
                                class="fontSize58 f-c-333 errorListStem"
                                v-html="item.stem"
                            ></div>
                        </div>
                        <div class="source fontSize5 f-c-9d">
                            {{ item.source }}
                        </div>
                    </div>
                </div>
                <div v-show="errorList.length === 0">暂无题目</div>
            </div>
        </el-menu>
    </div>
</template>

<script>
import { JsVuePage, JsVueComponent } from "@/vue";
import { mapState } from "vuex";
import {
    errorList,
    questionColumn,
    chapterErrorList,
    errorRank,
    addMemberQuestionLog
} from "@/action";
import ChapterItem from "@/components/courseDetails/ChapterItem";
export default {
    mixins: [JsVueComponent, JsVuePage],
    components: {
        ChapterItem
    },
    props: ["showReturn", "courseId", "classroomId"],
    data() {
        return {
            numType: "collNum",
            activeNav: "newError",
            startBtnType: "twoBtn", // 按钮类型是回顾和重做两个按钮 和章节练习的做题按钮区分
            navList: [
                {
                    name: "最新错题",
                    navName: "newError"
                },
                {
                    name: "错题分类",
                    navName: "classification"
                },
                {
                    name: "错题榜",
                    navName: "errorList"
                }
            ],
            newErrorList: {
                // 最新错题
                size: 5,
                total: 0,
                currentPage: 1,
                content: []
            },
            classification: {
                // 错题分类部分
                subNavList: [],
                content: []
            },
            errorList: [] // 收藏榜
        };
    },
    created() {
        this.loadErrorList(this.newErrorList);
    },
    methods: {
        startQuestion1(chapter, showType) {
            this.$emit("start-question2", chapter, showType);
        },
        toQuestionBankZct(item, idx) {
            this.$router.push({
                path: "/course/DoExercise",
                query: {
                    chapterId: item.chapterId,
                    idx: idx,
                    classroomId: this.classroomId,
                    testPageRuleId: this.testPageRuleId,
                    courseId: this.courseId,
                    workType: "sc_zct"
                }
            });
        },
        toQuestionBankCtb(item, idx) {
            this.$router.push({
                path: "/course/DoExercise",
                query: {
                    chapterId: item.chapterId,
                    idx: idx,
                    classroomId: this.classroomId,
                    testPageRuleId: this.testPageRuleId,
                    courseId: this.courseId,
                    workType: "sc_ctb"
                }
            });
        },
        returnItemBank() {
            // 返回题库
            this.$emit("returnItemBank");
        },
        changeErrorType(errorType) {
            this.activeNav = errorType.navName;
            if (errorType.navName === "newError") {
                this.loadErrorList(this.newErrorList);
            } else if (errorType.navName === "classification") {
                this.loadQuestionColumn();
            } else if (errorType.navName === "errorList") {
                this.loaderrorList();
            }
        },
        loadErrorList(info) {
            errorList({
                // 最新错题
                courseId: this.courseId,
                classroomId: this.classroomId,
                currentPage: info.currentPage,
                pageSize: 5
            }).then(res => {
                // console.log(res, "获取最新错题列表");
                this.newErrorList.total = res.total;
                this.newErrorList.content = res.records.map(item => {
                    // item.collectFlag = 1;
                    return item;
                });
            });
        },
        newErrorChange(idx) {
            // 最新收藏分页
            this.newErrorList.currentPage = idx;
            this.loadErrorList(this.newErrorList);
        },
        loadQuestionColumn() {
            // 错题分类
            questionColumn(this.classroomId).then(res => {
                // console.log(res, "错题分类下的组卷");
                this.classification.subNavList = res; // 收藏分类下边的组卷
                this.handleClassification(res[0]);
            });
        },
        handleClassification(classification) {
            // 根据切换错题分类下的组卷获取章节
            let testPageRuleId = classification.id;
            chapterErrorList({
                testPageRuleId: testPageRuleId,
                courseId: this.courseId,
                classroomId: this.classroomId
            }).then(res => {
                this.classification.content = res;
                // console.log(this.classification.content, "错题分类下边的章节");
            });
        },
        loaderrorList() {
            // 错题榜
            errorRank({
                courseId: this.courseId,
                classroomId: this.classroomId
            }).then(res => {
                // console.log(res, "错题榜列表");
                this.errorList = res;
            });
        },
        questionCollect(questionItem) {
            // 点击取消收藏
            // console.log(questionItem, 24777777);
            addMemberQuestionLog({
                // type: !questionItem.collectFlag * 1,
                questionId: questionItem.questionId,
                classroomId: questionItem.classroomId,
                courseId: questionItem.courseId,
                testPageRuleId: questionItem.testPageRuleId,
                chapterId: questionItem.chapterId
            }).then(() => {
                questionItem.collectFlag = !questionItem.collectFlag * 1;
            });
        }
        // startQuestion(value) {

        //     this.$emit("start-question", value);
        // }
    }
};
</script>
<style lang="css">
    .newErrorStem p img,
    .errorListStem p img{
        width: 100%;
        height: 100%;
    }

</style>
<style scoped lang="scss">
.el-menu--horizontal > .el-menu-item.is-active {
    // border-bottom: 2px solid #fff !important;
}
.Favorites {
    width: 100%;
    margin-top: 2.71rem;
}
.contain {
    padding: 0.5rem;
    .containItem {
        padding: 0.5rem;
        border-bottom: 1px solid #ddd;
        .source {
            margin: 0.7rem 0 0 0.7rem;
        }
    }
}

.width50 {
    width: 50%;
}
.width25 {
    width: 25%;
}
.mar-l {
    margin-left: 7.17rem;
}
.mar-r {
    margin-right: 6.2rem;
}
.collect {
    position: relative;
    margin: 0 0.5rem;
    width: 0.83rem;
    height: 0.83rem;
}
.returnIcon,
.collect img {
    width: 0.83rem;
    height: 0.83rem;
}
.top {
    margin-top: 0.5rem;
}
.chaptit {
    padding: 1rem 0;
}
</style>
