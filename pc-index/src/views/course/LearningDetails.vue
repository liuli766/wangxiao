<template>
    <!-- 我的学习详情页面 -->
    <div v-wechat-title="title">
        <div class="root-breadcrumb app-width xy-center jf-start">
            <el-breadcrumb>
                <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
                <el-breadcrumb-item>
                    <span v-if="selectLectureType === 'learnDetail'"
                        >课程详情</span
                    >
                    <span
                        v-else
                        class="pointer root-hover f-c-333 blod"
                        @click="selectLectureType = 'learnDetail'"
                        >课程详情</span
                    ></el-breadcrumb-item
                >
                <el-breadcrumb-item v-if="selectLectureType === 'video'"
                    >视频</el-breadcrumb-item
                >
                <el-breadcrumb-item v-if="selectLectureType === 'live'"
                    >直播</el-breadcrumb-item
                >
            </el-breadcrumb>
        </div>
        <div
            v-if="selectLectureType !== 'learnDetail'"
            class="yx-between player-box full-width"
        >
            <div class="app-width" id="playerBox">
                <CourseVideoPlayer
                    v-if="selectLectureType === 'video'"
                    ref="videoClassroom"
                    :select-course="course"
                    :select-classroom="selectClassroom"
                    :select-chapter="selectChapter"
                    :select-lecture="selectLecture"
                    :select-lecture-index="selectLectureIndex"
                    :init-data="initData"
                    @click-lecture="clickLecture"
                    @click-chapter-open="clickChapterOpen"
                />
                <CourseLivePlayer
                    v-if="selectLectureType === 'live'"
                    :select-course="course"
                    :select-classroom="selectClassroom"
                    :select-chapter="selectChapter"
                    :select-lecture="selectLecture"
                    :select-lecture-index="selectLectureIndex"
                />
            </div>
        </div>
        <div class="xy-between al-start app-width marginAuto">
            <div
                class="mainLeft"
                :style="{
                    width: selectLectureType === 'learnDetail' ? '70%' : '100%'
                }"
            >
                <!-- 我的课程 -->
                <div
                    v-if="selectLectureType === 'learnDetail'"
                    class="full-width content-box yx-center jf-start al-str course-detial"
                >
                    <div class="course-title bold fontSize76 f-c-333">
                        我的课程
                    </div>
                    <div class="course-detail-box xy-between al-str">
                        <MyCourse
                            :btnType="false"
                            :my-course-data="course"
                            :showContinue="true"
                            @student="continueStudent"
                        />
                    </div>
                </div>
                <!-- 课程详情 -->
                <div class="xy-between al-start course-detail-player-box">
                    <div
                        class="courseDatails content-box"
                        :style="{
                            width:
                                selectLectureType === 'learnDetail'
                                    ? '100%'
                                    : '70%'
                        }"
                    >
                        <!-- 课程导航 -->
                        <CourseReview
                            ref="courseReview"
                            :course="course"
                            :select-lecture="selectLecture"
                            :select-lecture-type="selectLectureType"
                            :course-sold-flag="true"
                            :init-data="initData"
                            default-active-nav="courseDirectory"
                            @click-lecture="clickLecture"
                        />
                    </div>
                    <div
                        v-if="selectLectureType !== 'learnDetail'"
                        class="mainRight b-c-fff"
                        style="width:28%;"
                    >
                        <HotNews />
                    </div>
                </div>
                <!-- 推荐课程 -->
                <div
                    class="RecCourse b-c-fff"
                    v-if="recCourseData.length !== 0"
                >
                    <div class="recommendList xy-between">
                        <div class="contain  b-c-fff">
                            <div class="reCourseTitle fontSize92 FW600 b-c-fff">
                                推荐课程
                            </div>
                            <div class="listBox xy-between jf-start">
                                <div
                                    class="recourseItem pointer"
                                    v-for="(item, index) in recCourseData"
                                    :key="index"
                                    @click="
                                        go(
                                            `/c-course/courseDetail?id=${item.id}`
                                        )
                                    "
                                >
                                    <img
                                        :src="
                                            coverImage(
                                                item.recommendEntity.icon
                                            )
                                        "
                                        alt=""
                                    />
                                    <div class="text">
                                        <div class="recommendTitle xy-between">
                                            <div class="subType no-wrap-text">
                                                单科
                                            </div>
                                            <div
                                                class="subName fontSize58 two-wrap f-c-333"
                                            >
                                                {{ item.recommendEntity.name }}
                                            </div>
                                        </div>
                                        <div class="recommendInfo xy-between">
                                            <div class="price fontSize5">
                                                ￥
                                                <span class="fontSize92 FW600">
                                                    {{
                                                        item.recommendEntity
                                                            .price
                                                    }}
                                                </span>
                                            </div>
                                            <div
                                                class="sales fontSize53 f-c-9d"
                                            >
                                                <span
                                                    >{{
                                                        item.recommendEntity
                                                            .soldCount
                                                    }} </span
                                                >人已购买
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                v-if="selectLectureType === 'learnDetail'"
                class="mainRight b-c-fff"
                style="width:28%;"
            >
                <HotNews />
            </div>
        </div>
    </div>
</template>
<script>
import { JsVuePage, JsVueComponent } from "@/vue";
import {
    courseDetail,
    selectUserAssets,
    courseClassrooms,
    userHaveLike,
    userHaveCollection,
    mentoringList,
    mentoringAsk,
    advLocationDetail,
    recommendData,
    lastStudy,
    lectureCourseTreeData
} from "@/action";
import { mapState } from "vuex";
import RecCourse from "@/components/RecCourse.vue";
import HotNews from "@/components/HotNews.vue";
import CourseMentoring from "@/components/curriculum/CourseMentoring.vue";
import Favorites from "@/components/itembank/Favorites.vue";
import ErrorList from "@/components/itembank/ErrorList.vue";
import Chapter from "@/components/itembank/Chapter.vue";
import Truth from "@/components/itembank/Truth.vue";
import VideoClassroom from "@/components/courseDetails/VideoClassroom.vue";
import LiveClassroom from "@/components/courseDetails/LiveClassroom.vue";
import DataDownload from "@/components/courseDetails/DataDownload.vue";
import ItemBank from "@/components/courseDetails/ItemBank.vue";
import CourseVideoPlayer from "@/components/CourseVideoPlayer.vue";
import CourseLivePlayer from "@/components/CourseLivePlayer.vue";
import MyCourse from "@/components/MyCourse.vue";
import Comment from "@/components/Comment.vue";
import CourseReview from "@/components/curriculum/CourseReview.vue";
export default {
    mixins: [JsVuePage, JsVueComponent],
    components: {
        HotNews,
        MyCourse,
        CourseVideoPlayer,
        CourseLivePlayer,
        CourseReview
    },
    data() {
        return {
            selectLectureType: "learnDetail",
            title: "我的学习详情",
            curriculumDetail: null,
            lectureId: null,
            activeNav: null, // 课程顶部导航选中
            selectNum: 0, // 控制题库下边内容切换
            tit: "",
            course: {},
            courseId: null,
            courseNav: [],
            selectClassroom: null,
            selectChapter: null,
            selectLecture: null,
            selectLectureIndex: 0,
            classrooms: [],
            recCourseData: [],

            mentoringList: {
                // 本节答疑
                pageSize: 5,
                currentPage: 1,
                total: 0,
                content: []
            },
            tklist: [
                // 题库部分数据
                {
                    title: "章节练习",
                    info: "以练为学，各个击破",
                    iconimg: require("@/assets/course/tk1.png")
                },
                {
                    title: "历年真题",
                    info: "往年真题库",
                    iconimg: require("@/assets/course/tk2.png")
                },
                {
                    title: "模拟试卷",
                    info: "全真实战演练",
                    iconimg: require("@/assets/course/tk3.png")
                },
                {
                    title: "押题密卷",
                    info: "往年真题库",
                    iconimg: require("@/assets/course/tk4.png")
                }
            ],
            subNav: [],
            initData: {
                classroomId: null,
                chapterId: null,
                lectureId: null
            }
        };
    },
    computed: {
        ...mapState({
            currentUser: state => state.currentUser,
            currentStudentIdeaId: state => state.currentStudentIdeaId
        })
    },
    created() {
        this.courseId = this.$route.query.id;
        this.loadRecCourseData(this.currentStudentIdeaId);
    },
    mounted() {
        this.loadCourseDetail(this.$route.query.id);
    },
    watch: {
        activeNav(activeNav) {
            if (activeNav === "live") {
                this.$refs.liveClassroom.startMemberWork();
            } else {
                this.$refs.liveClassroom.stopMemberWork();
            }
        },
        selectLecture(selectLecture) {
            if (this.userLoginStatus && selectLecture.userCollection === null) {
                userHaveCollection("lecture", selectLecture.id).then(result => {
                    selectLecture.userCollection = result;
                });
                userHaveLike("lecture", selectLecture.id).then(result => {
                    selectLecture.userLike = result;
                });
            }
            if (selectLecture.lectureType === "live") {
                userHaveCollection("live", selectLecture.entity.id).then(
                    result => {
                        selectLecture.entity.userCollection = result;
                    }
                );
                userHaveLike("live", selectLecture.entity.id).then(result => {
                    selectLecture.entity.userLike = result;
                });
            }
        }
    },
    methods: {
        loadRecCourseData(studentIdeaId) {
            // 获取推荐课程
            if (studentIdeaId) {
                advLocationDetail("pc-learn-course").then(advLocation => {
                    recommendData(
                        "course",
                        studentIdeaId
                            ? [
                                {
                                    ownerType: "advertisementLocation",
                                    id: advLocation.id
                                },
                                {
                                    ownerType: "studentIdea",
                                    id: studentIdeaId
                                }
                            ]
                            : [
                                {
                                    ownerType: "advertisementLocation",
                                    id: advLocation.id
                                }
                            ]
                    ).then(res => {
                        // console.log(res, "推荐课程");
                        this.recCourseData = res;
                    });
                });
            }
        },
        handcoll() {
            this.coll = true;
            this.err = false;
            this.selectNum = 5;
        },
        handerr() {
            this.coll = false;
            this.err = true;
            this.selectNum = 5;
        },
        handletit(idx, str) {
            this.selectNum = idx + 1;
            this.coll = false;
            this.err = false;
        },

        clickChapterOpen({ chapter, chapters }) {
            this.$refs.courseReview.clickChapterOpen(chapter, chapters);
        },
        clickLecture({ classroom, chapter, lecture, index, type }) {
            chapter = chapter || this.selectChapter;
            chapter.open = true;
            index = index === undefined ? this.selectLectureIndex : index;
            classroom = classroom || this.selectClassroom;
            if (!lecture && index !== undefined) {
                lecture = chapter.lectures[index];
            }
            this.selectLectureIndex = index;
            this.selectChapter = chapter;
            this.selectLecture = lecture;
            this.selectClassroom = classroom;
            this.selectLectureType = type;
            let w = () => {
                document
                    .getElementById("playerBox")
                    .scrollIntoView({ block: "end" });
                setTimeout(() => {
                    document.getElementById(lecture.id).scrollIntoViewIfNeeded({
                        behavior: "smooth",
                        block: "end"
                    });
                }, 500);
            };
            try {
                w();
            } catch (error) {
                setTimeout(() => {
                    w();
                }, 1000);
            }
        },
        continueStudent(courseId) {
            lastStudy(courseId).then(lectureId => {
                lectureCourseTreeData(lectureId, courseId).then(result => {
                    console.log("result:", result);
                    this.initData = result;
                });
            });
        },
        loadCourseDetail(courseId) {
            let leaningTime = time => {
                return parseInt(
                    (new Date().getTime() - new Date(time).getTime()) /
                        (24 * 3600 * 1000)
                );
            };
            let surplusTime = time => {
                return parseInt(
                    (new Date(time).getTime() - new Date().getTime()) /
                        (24 * 3600 * 1000)
                );
            };
            Promise.all([
                courseDetail({
                    courseId
                }),
                selectUserAssets({
                    assetType: "course",
                    assetMappingId: courseId,
                    pageSize: 1
                })
            ]).then(([course, pageRseult]) => {
                let c = pageRseult.records[0];
                this.course = {
                    ...course,
                    status: c.status,
                    startTime: c.startTime,
                    endTime: c.endTime,
                    soldFlag: true,
                    leaningTime: leaningTime(c.startTime),
                    surplusTime: surplusTime(c.endTime)
                };
            });
        }
    }
};
</script>

<style scoped lang="css">
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
/* 题库下边的收藏部分 */
.questionBank > div {
    padding: 0.8rem 0 !important;
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
.contain {
    padding: 0.88rem 1rem;
    border-radius: 0.42rem;
}
img {
    width: 100%;
    height: 6.33rem;
    border-radius: 0.25rem 0.25rem 0 0.25rem;
}
.recourseItem {
    width: 11.25rem;
    margin-top: 0.8rem;
    margin-right: 1rem;
}
.recourseItem .text {
    /* width:11.25rem; */
    padding: 0.55rem;
    border: 1px solid #e5e6eb;
    border-top: none;
    border-radius: 0 0.25rem 0.25rem 0.25rem;
}

.recommendTitle {
    margin: 0.58rem 0 1.04rem;
}
.recommendTitle .subType {
    border: 0.04rem solid #ff3535;
    padding: 0.1rem 0.38rem;
    font-size: 0.45rem;
    border-radius: 0.37rem;
    margin-right: 0.25rem;
    align-self: flex-start;
}
.sales {
    margin-right: 0.3rem;
}
.price {
    color: #ff4646;
}
.RecCourse {
    border-radius: 0.45rem;
    margin-bottom: 1rem;
}
</style>
