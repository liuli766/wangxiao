<template>
    <div class="b-c-fff root-card">
        <el-menu
            :default-active="activeNav"
            class="el-menu-demo"
            active-text-color="#96C321"
            mode="horizontal"
            text-color="#333333"
            @select="key => (activeNav = key)"
            style="font-weight:600;padding: 0 0.5rem"
        >
            <el-menu-item
                :index="item.key"
                v-for="item in tablist"
                :key="item.key"
                style="font-size:0.67rem;"
            >
                {{ item.name }}
            </el-menu-item>
        </el-menu>
        <div class="l-line"></div>
        <el-menu>
            <!-- 课程评论 -->
            <div v-if="activeNav === 'courseComment'" class="nav-body">
                <div v-if="!userLoginStatus" class="review fontSize58">
                    <button class="b-c-root pointer f-c-fff" @click="goLogin">
                        登录</button
                    >后发布评论
                </div>
                <div
                    v-else
                    class="review1 fontSize58 xy-between al-str review-btn"
                >
                    <el-input
                        type="textarea"
                        placeholder="请输入您的评论..."
                        v-model="inputComment"
                        maxlength="2000"
                        show-word-limit
                        resize="none"
                    />
                    <el-button
                        type="primary"
                        class="no-wrap-text"
                        @click="pusLectureComment"
                        :loading="flag.pushComment"
                        >评论</el-button
                    >
                </div>
                <Comment
                    ref="lectureComment"
                    :acl-source="selectLecture"
                    acl-type="lecture"
                    :course="course"
                />
            </div>
            <!-- 本节答疑 -->
            <div v-if="activeNav === 'courseQ'" class="nav-body">
                <div v-if="!userLoginStatus" class="review fontSize58">
                    <button class="f-c-ff pointer f-c-fff" @click="goLogin">
                        登录</button
                    >后发表提问
                </div>
                <div
                    v-else
                    class="fontSize58 review1 xy-between al-str review-btn"
                >
                    <el-input
                        type="textarea"
                        placeholder="请输入您的问题..."
                        v-model="inputQuestion"
                        maxlength="2000"
                        show-word-limit
                        resize="none"
                    />
                    <el-button
                        type="primary"
                        class="no-wrap-text"
                        @click="pushQuestion"
                        >提问</el-button
                    >
                </div>
                <AnsweringQuestion
                    ref="mentoring"
                    :mentoringList="mentoringList"
                    :id="id"
                    :course="course"
                    :selectLecture="selectLecture"
                />
                <el-pagination
                    v-if="mentoringList.total !== 0"
                    background
                    layout="prev, pager, next"
                    prev-text="上一页"
                    next-text="下一页"
                    :page-size="mentoringList.pageSize"
                    :total="mentoringList.total"
                    style="text-align: right;margin:9rem 0 0.5rem;"
                    @current-change="mentoringChange"
                >
                </el-pagination>
            </div>
            <!-- 课后作业 -->
            <div
                v-if="activeNav === 'homework'"
                class="fontSize67 homework nav-body"
            >
                <div v-if="homeworkList.length !== 0 && classroomId">
                    <div
                        v-for="(item, index) in homeworkList"
                        :key="index"
                        class="xy-between homeworkListItem"
                    >
                        <div class="fontSize67 f-c-333">{{ item.name }}</div>
                        <div class="fontSize58">
                            <span class="f-c-333">{{ item.doCount }}</span>
                            <span class="f-c-999">/{{ item.count }}</span>
                        </div>
                        <div
                            class="hometext f-c-fff fontSize58 pointer"
                            @click="goExercise(item)"
                        >
                            立即做题
                        </div>
                    </div>
                </div>
                <div v-else class="fontSize72 f-c-9b" style="padding:1rem 0;">
                    <img
                        src="@/assets/img/zanwuzuoye.png"
                        alt=""
                        style="margin-left: 14rem;margin-top:5rem;"
                    />
                </div>
            </div>
            <!-- 课程目录 -->
            <VideoClassroom
                ref="videoClassroom"
                v-show="activeNav === 'courseDirectory'"
                class="nav-body classroom"
                :classrooms="course.classrooms"
                :select-lecture="selectLecture"
                :course-sold-flag="courseSoldFlag"
                :show-type="videoShowType"
                :select-video-classroom-id.sync="selectVideoClassroomId"
                :init-data="initData"
                @click-lecture="clickLecture"
            />
            <!-- 直播目录 -->
            <LiveClassroom
                ref="liveClassroom"
                v-show="activeNav === 'liveDirectory'"
                class="nav-body classroom"
                :classrooms="course.classrooms"
                :select-lecture="selectLecture"
                :course-sold-flag="courseSoldFlag"
                :select-live-classroom-id.sync="selectLiveClassroomId"
                @click-lecture="clickLecture"
            />
            <!-- 产品介绍 -->
            <div
                v-if="activeNav === 'productIntroduction'"
                class="introduction"
            >
                <div class="nav-body" v-html="course.detailsDesc"></div>
            </div>
            <!-- 题库部分 -->
            <ItemBank
                v-if="activeNav === 'questionBank'"
                class="questionBank b-c-fff content"
                :classrooms="course.classrooms"
                :courseId="course.id"
            />
            <!-- 资料下载 -->
            <DataDownload
                v-if="activeNav === 'download'"
                :courseId="course.id"
            />
        </el-menu>
    </div>
</template>

<script>
import { JsVueComponent, JsVueBaseApi } from "@/vue";
import { mapState } from "vuex";
import VideoClassroom from "@/components/courseDetails/VideoClassroom.vue";
import LiveClassroom from "@/components/courseDetails/LiveClassroom.vue";
import Comment from "@/components/Comment.vue";
import AnsweringQuestion from "@/components/curriculum/AnsweringQuestion.vue";
import DataDownload from "@/components/courseDetails/DataDownload.vue";
import ItemBank from "@/components/courseDetails/ItemBank.vue";
// import { Message } from "element-ui";
import {
    courseClassrooms,
    chapterLectures,
    userViewComment,
    publishedComment,
    like,
    getCurriculumWatchTime,
    mentoringList,
    mentoringAsk,
    homeworkList,
    homeworkQuestionList
} from "@/action";

export default {
    props: {
        id: {
            type: String
        },
        course: {
            type: Object
        },
        selectLecture: {
            type: Object
        },
        selectLectureType: {
            type: String
        },
        courseSoldFlag: {
            type: Boolean,
            default: false
        },
        defaultActiveNav: {
            type: String,
            required: false
        },
        selectClassroom: {
            type: Object
        },
        initData: {
            type: Object,
            required: false
        }
    },
    mixins: [JsVueComponent, JsVueBaseApi],
    components: {
        VideoClassroom,
        LiveClassroom,
        Comment,
        AnsweringQuestion,
        DataDownload,
        ItemBank
    },
    data() {
        return {
            flag: {
                pushComment: false
            },
            activeNav: null,
            subnavnum: 0,
            classrooms: [],
            selectVideoClassroomId: null,
            selectLiveClassroomId: null,
            tablist: [],
            homeworkList: [],
            inputComment: null,
            inputQuestion: null,
            classroomId: null,
            commentPage: {
                pageSize: 5,
                currentPage: 1,
                total: 0
            },
            commentList: [],
            mentoringList: {
                // 本节答疑
                pageSize: 5,
                currentPage: 1,
                total: 0,
                content: []
            }
        };
    },
    created() {
        this.activeNav = this.defaultActiveNav;
        this.updateLectureType(this.selectLectureType);
        if (this.course) {
            this.loadMentoringList(this.mentoringList, this.course.id);
            this.loadClassroom(this.course.id);
        }
        if (this.course && this.selectLecture) {
            this.loadHomeworkList(this.course.id, this.selectLecture.id);
        }
    },
    watch: {
        course(course) {
            this.loadClassroom(course.id);
            this.loadMentoringList(this.mentoringList, course.id);
        },
        selectLectureType(selectLectureType) {
            this.updateLectureType(selectLectureType);
        },
        activeNav(activeNav) {
            if (activeNav === "liveDirectory" && this.$refs.liveClassroom) {
                this.$refs.liveClassroom.startMemberWork();
            } else {
                if (this.$refs.liveClassroom) {
                    this.$refs.liveClassroom.stopMemberWork();
                }
            }
        },
        selectLecture(selectLecture) {
            this.loadHomeworkList(this.course.id, selectLecture.id);
        },
        selectClassroom(selectClassroom) {
            this.classroomId = selectClassroom.id;
        }
    },
    computed: {
        ...mapState({
            userLoginStatus: state => state.userLoginStatus,
            currentUser: state => state.currentUser
        }),
        videoShowType() {
            if (
                this.selectLectureType === "learnDetail" ||
                this.selectLectureType === "learnPlayer"
            ) {
                return "stu";
            }
            return "show";
        }
    },
    methods: {
        chosed(n) {
            this.subnavnum = n;
        },
        updateLectureType(selectLectureType) {
            if (selectLectureType === "learnDetail") {
                this.tablist = [
                    {
                        key: "courseDirectory",
                        name: "课程"
                    },
                    {
                        key: "liveDirectory",
                        name: "直播"
                    },
                    {
                        key: "questionBank",
                        name: "题库"
                    },
                    {
                        key: "courseQ",
                        name: "答疑"
                    },
                    {
                        key: "download",
                        name: "资料下载"
                    }
                ];
            }
            if (selectLectureType === "learnPlayer") {
                this.tablist = [
                    {
                        key: "courseComment",
                        name: "课程评论"
                    },
                    {
                        key: "courseQ",
                        name: "本节答疑"
                    },
                    {
                        key: "homework",
                        name: "课后作业"
                    },
                    {
                        key: "courseDirectory",
                        name: "课程目录"
                    },
                    {
                        key: "liveDirectory",
                        name: "直播目录"
                    }
                ];
            }
            if (
                selectLectureType === "recommend" ||
                selectLectureType === "video"
            ) {
                this.tablist = [
                    {
                        key: "productIntroduction",
                        name: "产品介绍"
                    },
                    {
                        key: "courseComment",
                        name: "课程评论"
                    },
                    {
                        key: "courseQ",
                        name: "本节答疑"
                    },
                    {
                        key: "homework",
                        name: "课后作业"
                    },
                    {
                        key: "courseDirectory",
                        name: "课程目录"
                    },
                    {
                        key: "liveDirectory",
                        name: "直播目录"
                    }
                ];
            } else if (selectLectureType === "live") {
                this.tablist = [
                    {
                        key: "homework",
                        name: "直播作业"
                    },
                    {
                        key: "liveDirectory",
                        name: "课程目录"
                    }
                ];
            }
            if (this.activeNav) {
                if (!this.tablist.map(n => n.key).includes(this.activeNav)) {
                    this.activeNav = this.tablist[0].key;
                }
            } else {
                this.activeNav = this.tablist[0].key;
            }
        },

        clickChapterOpen(chapter, chapters) {
            if (this.$refs.videoClassroom) {
                this.$refs.videoClassroom.clickChapterOpen(chapter, chapters);
            }
        },
        clickLecture({ chapter, lecture, index, type, classroom }) {
            this.$emit("click-lecture", {
                classroom,
                chapter,
                lecture,
                index,
                type
            });
        },
        // 加载课堂
        loadClassroom(courseId) {
            if (this.$refs.liveClassroom) {
                this.$refs.liveClassroom.clearLiveInterval();
            }
            courseClassrooms({
                pageSize: 1000,
                courseId,
                children: true,
                classroomType: 4,
                subjectName: true
            }).then(classrooms => {
                classrooms.forEach(classroom => {
                    classroom.tklist = null;
                    (classroom.chapters || []).forEach(c => {
                        c.open = false;
                        c.loading = false;
                    });
                });
                classrooms.forEach(classroom => {
                    classroom.videoChapter = (classroom.chapters || []).filter(
                        c => c.type === "video"
                    );
                    classroom.liveChapter = (classroom.chapters || []).filter(
                        c => c.type === "live"
                    );
                    classroom.questionChapter = (
                        classroom.chapters || []
                    ).filter(c => c.type === "questionBank");
                });
                this.classrooms = classrooms;
                if (this.classrooms && this.classrooms.length > 0) {
                    this.selectVideoClassroomId =
                        this.selectClassroomId || this.classrooms[0].id;
                    this.selectLiveClassroomId =
                        this.selectClassroomId || this.classrooms[0].id;
                    this.course.classrooms = classrooms;
                    (
                        (this.classrooms[0].videoChapter || [])[0] || {}
                    ).open = true;
                    (
                        (this.classrooms[0].liveChapter || [])[0] || {}
                    ).open = true;
                    classrooms.forEach(c => {
                        (c.videoChapter || []).forEach(ch =>
                            this.$refs.videoClassroom.openChapter(ch)
                        );
                        if (c.id === this.selectVideoClassroomId) {
                            if (this.selectChapterId) {
                                (
                                    (c.videoChapter || []).filter(
                                        chapter =>
                                            chapter.id === this.selectChapterId
                                    )[0] || {}
                                ).open = true;
                            } else {
                                ((c.videoChapter || [])[0] || {}).open = true;
                            }
                        }
                    });
                    classrooms.forEach(c => {
                        (c.liveClassroom || []).forEach(ch =>
                            this.$refs.liveClassroom.openChapter(ch)
                        );
                        if (c.id === this.selectLiveClassroomId) {
                            if (this.selectChapterId) {
                                (
                                    (c.liveClassroom || []).filter(
                                        chapter =>
                                            chapter.id === this.selectChapterId
                                    )[0] || {}
                                ).open = true;
                            } else {
                                ((c.liveClassroom || [])[0] || {}).open = true;
                            }
                        }
                    });
                }
            });
        },
        pusLectureComment() {
            // 提交评论
            // console.log(this.course.soldFlag, "课程是否购买364");
            if (this.course.soldFlag) {
                this.flagPromise(
                    this.$refs.lectureComment.pushComment(
                        {
                            ...this.selectLecture,
                            commentInput: this.inputComment
                        },
                        "lecture"
                    ),
                    "pushComment"
                ).then(() => {
                    this.inputComment = null;
                });
            } else {
                this.$message.error("您还没有购买该课程,购买后才能评论哟");
            }
        },
        loadMentoringList(info, courseId) {
            // 加载答疑
            mentoringList({
                currentPage: info.currentPage,
                pageSize: info.pageSize,
                type: "course",
                sourceId: courseId,
                action: "common"
            }).then(res => {
                this.mentoringList.total = res.total;
                this.mentoringList.content = res.records;
                // console.log(res, "答疑507");
            });
        },
        mentoringChange(idx) {
            // 答疑分页
            this.mentoringList.currentPage = idx;
            this.loadMentoringList(this.mentoringList, this.course.id);
        },
        pushQuestion() {
            // 提交答疑
            if (this.inputQuestion) {
                if (this.course.soldFlag) {
                    mentoringAsk({
                        question: this.inputQuestion,
                        questionAuthorId: this.currentUser.id,
                        questionSourceId: this.course.id,
                        questionSourceType: 2
                    }).then(res => {
                        this.inputQuestion = null;
                        this.$message.success(
                            "您的问题已提交，我们会尽快为您解答"
                        );
                        this.loadMentoringList(
                            this.mentoringList,
                            this.course.id
                        );
                    });
                } else {
                    this.$message.error("您还没有购买该课程,购买后才能评论哟");
                }
            } else {
                this.$message.error("请输入您的问题");
            }
        },
        loadHomeworkList(courseId, selectLectureId) {
            // 课后作业
            // console.log(courseId, selectLectureId, "两个id");
            homeworkList({
                courseId: courseId,
                lectureId: selectLectureId
            }).then(res => {
                // console.log(res, "课后作业取id");
                this.homeworkList = res;
            });
        },
        goExercise(homeworkItem) {
            if (this.course.soldFlag) {
                if (this.selectClassroom) {
                    this.classroomId = this.selectClassroom.id;
                } else {
                    if (this.course.classrooms.length === 1) {
                        this.classroomId = this.course.classrooms[0].id;
                    } else {
                        try {
                            this.course.classrooms.forEach(classroom => {
                                classroom.chapters.forEach(chapter => {
                                    chapter.lectures.forEach(lecture => {
                                        if (
                                            lecture.id === this.selectLecture.id
                                        ) {
                                            this.classroomId = classroom.id;
                                            throw new Error("End");
                                        }
                                    });
                                });
                            });
                        } catch (e) {}
                    }
                }
                // console.log(this.classroomId, 61666666)
                this.$router.push({
                    path: "/c-course/DoHomework",
                    query: {
                        // workType: "doHomework",
                        homeworkName: homeworkItem.name,
                        courseId: this.course.id,
                        classroomId: this.classroomId,
                        lectureId: this.selectLecture.id,
                        homeworkId: homeworkItem.id
                    }
                });
            } else {
                this.$message.error("您还没有购买该课程，请购买后做题");
            }
        }
    }
};
</script>
<style lang="css">
    .nav-body p img{
        width: 100%;
        height: 100%;
    }
</style>
<style scoped lang="scss">
.el-menu.el-menu--horizontal {
    border-bottom: solid 1px #fff !important;
}
.l-line {
    margin-top: 0.71rem;
    border-bottom: 1px solid #dddee1;
}
.review {
    background: #f8f8fa;
    text-align: center;
    padding: 0.5rem 0;
    border: 1px solid #dddee1;
    border-radius: 0.17rem;
    margin: 1rem;
    button {
        padding: 0.42rem 1.04rem;
        background: #96c321;
        border-radius: 0.17rem;
        margin-right: 0.46rem;
    }
}
.review1 {
    margin: 1rem 0;
}
.el-pagination {
    span {
        padding: 0.29rem 0.75rem !important;
    }
}
.homework {
    padding: 1.21rem 0.96rem;
    .hometext {
        padding: 0.29rem 0.63rem;
        background: #96c321;
        border-radius: 0.21rem;
    }
}
.homeworkListItem {
    padding: 0.5rem 0;
    border-bottom: 1px solid #ddd;
}
.subTitle {
    margin-top: 0.88rem;
}
hr {
    margin: 0.79rem 1rem 0 1rem;
}
.subInfo,
.courseInfo {
    padding: 0.8rem;
}
.subInfo .subItem {
    background: #f7f8fa;
    margin-top: 1px;
    padding: 0.8rem;
}
.subInfo .text {
    margin-left: 1.58rem;
}
.subInfo .text h5 {
    margin: 0.5rem 0;
}
.coverMap {
    position: relative;
    .modelblack {
        background: rgba(0, 0, 0, 0.5);
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
    .modelblacktext {
        padding: 0.25rem 0.46rem;
        background: #ff3434;
        border-radius: 0.08rem;
        margin-top: 0.58rem;
    }
}
.root-card {
    border-radius: 0.42rem;
    overflow: hidden;
    padding: 0 0.3rem;
    min-height: 21rem;
}
.nav-body {
    padding: 0 1rem;
}

.review-btn {
    button {
        padding: 0 1.17rem;
        border-radius: 0 0.17rem 0.17rem 0;
    }
}
</style>
<style>
.nav-body.classroom .el-tabs__header {
    margin: 0;
}
.nav-body.classroom .el-tabs__item {
    font-size: 0.58rem;
}
.review-btn .el-textarea__inner {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
}
.el-menu {
    border-right: none;
}
.introduction p img{
    width: 100%;
}
</style>
