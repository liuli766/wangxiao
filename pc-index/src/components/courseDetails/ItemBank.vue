<template>
    <div>
        <div v-show="!doExercise">
            <!-- 学习详情下边的题库部分 -->
            <div class="titletop xy-between jf-start">
                <el-menu
                    default-active="0"
                    class="el-menu-demo"
                    active-text-color="#96C321"
                    mode="horizontal"
                    text-color="#333333"
                >
                    <el-menu-item
                        class="pointer fontSize58"
                        :index="index + ''"
                        v-for="(item, index) in classrooms"
                        :key="index"
                        @click="clickClassroom(item)"
                    >
                        {{ item.name }}
                    </el-menu-item>
                </el-menu>
            </div>
            <div v-if="activeNav == 'defaultNav'">
                <div class="category xy-between jf-start fontSize58 f-c-fff ">
                    <div
                        class="xy-between pointer b-c-root"
                        @click="showCollection"
                    >
                        <img
                            src="@/assets/course/becoll.png"
                            alt=""
                            class="collectIcon"
                        />
                        <div>收藏夹</div>
                    </div>
                    <div
                        class="xy-between pointer b-c-root"
                        @click="showErrBank"
                    >
                        <img
                            src="@/assets/course/ct.png"
                            alt=""
                            class="errBankIcon"
                        />
                        <div>错题库</div>
                    </div>
                </div>
                <div class="categoryList xy-between flexWarp">
                    <div
                        class="listItem xy-between"
                        v-for="(item, index) in selectClassroom.tklist || []"
                        :key="index"
                        @click="selectType(item)"
                    >
                        <img
                            :src="coverImage(item.icon)"
                            class="categoryListIcon"
                        />
                        <div class="text">
                            <h5 class="fontSize67 FW600">
                                {{ item.name }}
                            </h5>
                            <P class="fontSize58">{{ item.remark }}</P>
                        </div>
                        <img
                            src="@/assets/course/right.png"
                            class="categoryListIconRight"
                        />
                    </div>
                </div>
            </div>
            <!-- 收藏夹部分 -->
            <Favorites
                v-if="activeNav === 'collection'"
                :showReturn="true"
                @returnItemBank="returnItemBank"
                :classroomId="classroomId"
                :courseId="courseId"
                :testPageRuleId="testPageRuleId"
                @start-question1="startQuestionFL"
            />
            <!-- 错题库部分 -->
            <ErrorList
                v-if="activeNav === 'errBank'"
                :showReturn="true"
                @returnItemBank="returnItemBank"
                :classroomId="classroomId"
                :courseId="courseId"
                :testPageRuleId="testPageRuleId"
                @start-question2="startQuestionCt"

            />
            <!-- 章节练习 -->
            <Chapter
                v-if="activeNav === 'chapter'"
                :showReturn="true"
                @returnItemBank="returnItemBank"
                :classroomId="classroomId"
                :courseId="courseId"
                :testPageRuleId="testPageRuleId"
                @start-question="startQuestion"
            />
        </div>

    </div>
</template>

<script>
import { JsVueComponent } from "@/vue";
import Favorites from "@/components/itembank/Favorites.vue";
import ErrorList from "@/components/itembank/ErrorList.vue";
import Chapter from "@/components/itembank/Chapter.vue";
import Truth from "@/components/itembank/Truth.vue";
import {
    courseClassrooms,
    questionColumn,
    chapterList,
    testPagerList
} from "@/action";
export default {
    props: {
        classrooms: {
            type: Array,
            required: false
        },
        courseId: { // 课程ID
            type: String,
            required: false
        }
    },
    mixins: [JsVueComponent],
    components: {
        Favorites,
        ErrorList,
        Chapter
    },
    data() {
        return {
            classroomId: null, // 课堂id
            selectClassroom: {},
            testPageRuleId: null, // 组卷id
            itemBankNav: [],
            activeNav: "defaultNav",
            chapterList: [],
            doExercise: false,
            questionChapter: null
        };
    },
    created() {
        if (this.classrooms) {
            this.clickClassroom(this.classrooms[0]);
        }
    },
    watch: {
        classrooms(classrooms) {
            this.clickClassroom(this.classrooms[0]);
        }
    },
    methods: {
        showCollection() {
            this.activeNav = "collection";
        },
        showErrBank() {
            this.activeNav = "errBank";
        },
        returnItemBank() {
            this.activeNav = "defaultNav";
        },
        clickClassroom(classroom) { // 课堂选择
            this.selectClassroom = classroom;
            this.classroomId = this.selectClassroom.id;
            if (classroom.tklist) {
                return;
            }
            questionColumn(classroom.id).then(res => {
                // console.log(res, "获取课堂下边的组卷2133")
                classroom.tklist = res.map(item => {
                    item.navName = "chapter";
                    if (item.type === "0" && item.icon === null) {
                        item.icon = require("@/assets/course/tk1.png");
                    } else if (item.type === "1" && item.icon === null) {
                        item.icon = require("@/assets/course/tk2.png");
                    }
                    return item;
                });
                this.testPageRuleId = classroom.tklist[0].id;
            });
        },
        selectType(item) {
            // 选择除收藏夹和错题库之外的题库类型
            this.activeNav = item.navName;
            this.testPageRuleId = item.id;
        },
        startQuestion({ chapter }) {
            // console.log(chapter, showType, 19666);
            this.questionChapter = chapter;
            this.$router.push({
                path: "/course/DoExercise",
                query: {
                    // chooseShowType: showType,
                    chapterId: this.questionChapter.id,
                    classroomId: this.classroomId,
                    testPageRuleId: this.testPageRuleId,
                    courseId: this.courseId
                }
            })
        },
        startQuestionFL({ chapter }, showType) {
            // console.log(chapter, showType, 19666);
            // this.questionChapter = chapter;
            this.$router.push({
                path: "/course/DoExercise",
                query: {
                    chooseShowType: showType,
                    chapterId: chapter.chapterId,
                    classroomId: this.classroomId,
                    testPageRuleId: this.testPageRuleId,
                    courseId: this.courseId,
                    workType: "fl_sc"
                }
            })
        },
        startQuestionCt({ chapter }, showType) {
            // console.log(chapter, showType, 19666);
            // this.questionChapter = chapter;
            this.$router.push({
                path: "/course/DoExercise",
                query: {
                    chooseShowType: showType,
                    chapterId: chapter.chapterId,
                    classroomId: this.classroomId,
                    testPageRuleId: this.testPageRuleId,
                    courseId: this.courseId,
                    workType: "fl_ct"
                }
            })
        }
    }
};
</script>

<style scoped lang="scss">
/* 课程详情部分 */
.course-detail-player-box {
    padding: 1.2rem 0;
}
.courseNav {
    width: 100%;
    padding: 0 1rem;
}
.courseNavItem {
    text-align: center;
    font-size: 0.67rem;
    margin-right: 1rem !important;
}
.el-menu.el-menu--horizontal {
    border: none !important;
}
.titActive {
    color: #96c321;
}
.titletop {
    padding-bottom: 0.5rem;
}
.titletop > div {
    margin: 0 0.5rem;
}

.content .subTitle {
    margin: 0.5rem 0.8rem;
}
.content .subInfo,
.courseInfo,
.former {
    padding: 0.8rem;
}
.former h4 {
    padding-bottom: 0.8rem;
}
.content .subInfo .subItem,
.content .former .formerItem {
    background: #f7f8fa;
    margin-top: 1px;
    padding: 0.8rem;
}
.content .subInfo .text,
.content .former .text {
    margin-left: 1.58rem;
}
.content .subInfo .text h5,
.content .former .text h5 {
    margin: 0.5rem 0;
}
.coverMap {
    position: relative;
}
.coverMap .time {
    padding: 0.2rem 0.38rem;
    /* width: 2.08rem; */
    height: 0.83rem;
    background: rgba(0, 0, 0, 1);
    opacity: 0.6;
    border-radius: 0.42rem;
    position: absolute;
    top: 3rem;
    left: 0.5rem;
    font-size: 0.42rem;
    line-height: 0.42rem;
}
.coverMap .visitors,
.type {
    position: absolute;
    left: 50%;
    margin-left: -1.9rem;
    top: 3rem;
}
.coverMap .type {
    width: 3.75rem;
    line-height: 1.08rem;
    background: rgba(255, 65, 65, 1);
    border-radius: 0.08rem;
    top: 1.5rem;
}
/* 题库部分 */
.category {
    margin-top: 0.5rem;
}
.category > div {
    /* width: 5.21rem; */
    border-radius: 1rem;
    padding: 0.46rem 1.2rem;
    margin: 0 1rem;
}
.categoryList {
    padding: 1.5rem 1rem;
}
.categoryList .active {
    border: 1px solid #96c321;
}
.categoryList .listItem {
    width: 46%;
    margin: 0.6rem 0;
    padding: 1.2rem 1rem;
    box-shadow: 0px 0px 5px #ddd;
    cursor: pointer;
}
.categoryList .listItem p {
    margin-top: 0.5rem;
}
.category .collectIcon,
.errBankIcon {
    width: 0.75rem;
    height: 0.75rem;
}
.categoryListIcon {
    width: 1.58rem;
    height: 1.58rem;
}
.categoryListIconRight {
    width: 0.58rem;
    height: 0.58rem;
}

/* 资料下载部分 */
.download .return {
    margin-left: 0.5rem;
}
.download > div {
    padding: 0.8rem !important;
    border-bottom: 1px solid #ddd;
}
.fileList button {
    width: 3.04rem;
    line-height: 1.17rem;
    border-radius: 0.17rem;
}
.Downloaded {
    background: #cecece;
}
.Download {
    background: #96c321;
}
.content-box {
    border-radius: 0.42rem;
    background-color: #ffffff;
    overflow: hidden;
}
.course-detial {
    padding: 0.83rem 0.96rem 1.54rem;
}
.course-detail-box .img {
    width: 10.58rem;
    height: 5.96rem;
    margin-right: 0.75rem;
    border-radius: 0.25rem;
    overflow: hidden;
}
.course-detail-box .intr {
    margin-top: 0.63rem;
    max-height: 2.57rem;
}
.nav-content {
    padding: 0 0.96rem;
}
.courseDatails .hr {
    background-color: #e6e7ea;
    margin: 0.58rem 0;
}
.player-box {
    background-color: #191919;
}
.video-breadcrumb {
    padding-left: 0.5em;
    height: 2em;
    line-height: 2em;
}
.root-breadcrumb {
    height: 1.67rem;
}
</style>
