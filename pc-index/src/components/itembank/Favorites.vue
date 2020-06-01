<template>
    <div class="b-c-fff" style="min-height:10rem;">
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
                @click="changeCollectType(item)"
            >
                {{ item.name }}
            </el-menu-item>
        </el-menu>
        <el-menu>
            <!-- 最新收藏部分 -->
            <div
                v-if="activeNav === 'newCollection'"
                class="fontSize58 contain"
            >
                <div
                    class="xy-between containItem pointer"
                    v-for="(item, index) in newCollectList.content"
                    :key="index"
                    style="border-bottom:1px solid #ddd;"
                    v-show="newCollectList.content.length !== 0"
                >
                    <div
                        @click="toQuestionBankNew(item, index)"
                        style="width:95%;"
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
                                class="fontSize58 f-c-333 newCollectionStem"
                                v-html="item.stem"
                            ></div>
                        </div>
                        <div class="source fontSize5 f-c-9d">
                            {{ item.source }}
                        </div>
                    </div>
                    <div
                        class="yx-center operation-item f-c-666 pointer"
                        @click="questionCollect(item)"
                        style="width:5%;"
                    >
                        <i
                            class="icon iconfont icon-shoucang f-c-root"
                            v-show="item.collectFlag"
                        />
                        <i
                            class="icon iconfont icon-shoucang1"
                            v-show="!item.collectFlag"
                        ></i>
                    </div>
                </div>
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :page-size="newCollectList.size"
                    :total="newCollectList.total"
                    style="text-align: center;margin-top: 0.5rem;"
                    @current-change="newCollectChange"
                    v-if="'newCollectList.total' === 0"
                >
                </el-pagination>
                <div v-show="newCollectList.content.length === 0">暂无题目</div>
            </div>

            <!--收藏分类部分 -->
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
                <!-- 收藏分类下边的内容 -->
                <div v-if="classification.content.length !== 0">
                    <div class="fontSize58 chaptit xy-between jf-start f-c-9d">
                        <div style="width:64%;padding-left:2.38rem">
                            章节名称
                        </div>
                        <div style="width:36%;">收藏数</div>
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
            <!-- 收藏榜部分 -->
            <div
                v-if="activeNav === 'collectionList'"
                class="fontSize58 contain"
            >
                <div
                    class="containItem pointer"
                    v-for="(item, index) in collectionList"
                    :key="index"
                    style="border-bottom:1px solid #ddd;"
                    v-show="collectionList.length !== 0"
                    @click="toQuestionBankScb(item, index)"
                >
                    <div style="width:100%;">
                        <div
                            class="xy-between jf-start"
                            style="max-height: 4rem;overflow-y: auto;"
                        >
                            <div class="fontSize58 f-c-333" style="width:5%;">
                                {{ index + 1 }} 、
                            </div>
                            <div
                                style="width:95%;"
                                class="fontSize58 f-c-333 collectionListStem"
                                v-html="item.stem"
                            ></div>
                        </div>
                        <div class="source fontSize5 f-c-9d">
                            {{ item.source }}
                        </div>
                    </div>
                </div>
                <div v-show="collectionList.length === 0">暂无题目</div>
            </div>
        </el-menu>
    </div>
</template>

<script>
import { JsVuePage, JsVueComponent } from "@/vue";
import { mapState } from "vuex";
import {
    collectList,
    questionColumn,
    chapterCollectList,
    collectRank,
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
            activeNav: "newCollection",
            startBtnType: "twoBtn", // 按钮类型是回顾和重做两个按钮 和章节练习的做题按钮区分
            navList: [
                {
                    name: "最新收藏",
                    navName: "newCollection"
                },
                {
                    name: "收藏分类",
                    navName: "classification"
                },
                {
                    name: "收藏榜",
                    navName: "collectionList"
                }
            ],
            newCollectList: {
                // 最新收藏
                size: 5,
                total: 0,
                currentPage: 1,
                content: [],
                exerciseType: "newCollect"
            },
            classification: {
                // 收藏分类部分
                subNavList: [],
                content: []
            },
            collectionList: [] // 收藏榜
        };
    },
    created() {
        this.loadCollectList(this.newCollectList);
    },
    watch: {
        classroomId() {
            this.loadCollectList(this.newCollectList);
        }
    },
    methods: {
        returnItemBank() {
            // 返回题库
            this.$emit("returnItemBank");
        },
        changeCollectType(collectType) {
            this.activeNav = collectType.navName;
            if (collectType.navName === "newCollection") {
                this.loadCollectList(this.newCollectList);
            } else if (collectType.navName === "classification") {
                this.loadQuestionColumn();
            } else if (collectType.navName === "collectionList") {
                this.loadCollectionList();
            }
        },
        loadCollectList(info) {
            collectList({
                // 获取最新收藏
                courseId: this.courseId,
                classroomId: this.classroomId,
                currentPage: info.currentPage,
                pageSize: 5
            }).then(res => {
                // console.log(res, "最新收藏");
                this.newCollectList.total = res.total;
                this.newCollectList.content = res.records.map(questionItem => {
                    questionItem.collectFlag = 1;
                    return questionItem;
                });
            });
        },
        newCollectChange(idx) {
            // 最新收藏分页
            this.newCollectList.currentPage = idx;
            this.loadCollectList(this.newCollectList);
        },
        loadQuestionColumn() {
            // 收藏分类
            questionColumn(this.classroomId).then(res => {
                // console.log(res, "收藏分类下的组卷");
                this.classification.subNavList = res; // 收藏分类下边的组卷
                this.handleClassification(res[0]);
            });
        },
        handleClassification(classification) {
            // 切换收藏分类下的组卷获取章节
            let testPageRuleId = classification.id;
            chapterCollectList({
                testPageRuleId: testPageRuleId,
                courseId: this.courseId,
                classroomId: this.classroomId
            }).then(res => {
                this.classification.content = res;
                // console.log(
                //     this.classification.content,
                //     "收藏分类下边的章节列表"
                // );
            });
        },
        loadCollectionList() {
            // 收藏榜
            collectRank({
                courseId: this.courseId,
                classroomId: this.classroomId
            }).then(res => {
                // console.log(res, "收藏榜列表265555");
                this.collectionList = res;
            });
        },
        questionCollect(item) {
            // 收藏星星
            addMemberQuestionLog({
                type: !item.collectFlag * 1,
                questionId: item.questionId,
                classroomId: item.classroomId,
                courseId: item.courseId,
                testPageRuleId: item.testPageRuleId,
                chapterId: item.chapterId
            }).then(() => {
                item.collectFlag = !item.collectFlag * 1;
            });
        },
        startQuestion1(chapter, showType) {
            this.$emit("start-question1", chapter, showType);
        },
        toQuestionBankNew(item, idx) {
            // 最新收藏跳题页面
            this.$router.push({
                path: "/course/DoExercise",
                query: {
                    chapterId: item.chapterId,
                    idx: idx,
                    classroomId: this.classroomId,
                    testPageRuleId: this.testPageRuleId,
                    courseId: this.courseId,
                    workType: "sc_zsc"
                }
            });
        },
        toQuestionBankScb(item, idx) {
            // 收藏榜跳做题页面
            this.$router.push({
                path: "/course/DoExercise",
                query: {
                    chapterId: item.chapterId,
                    idx: idx,
                    classroomId: this.classroomId,
                    testPageRuleId: this.testPageRuleId,
                    courseId: this.courseId,
                    workType: "sc_scb"
                }
            });
        }
    }
};
</script>
<style lang="css">
    .newCollectionStem p img,
    .collectionListStem p img{
        width: 100%;
        height: 100%;
    }
</style>
<style scoped lang="scss">
.Favorites {
    width: 100%;
    margin-top: 2.71rem;
}
.contain {
    padding: 0.5rem;
    .containItem {
        padding: 0.5rem;
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
