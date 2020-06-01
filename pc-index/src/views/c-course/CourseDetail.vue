<template>
    <div
        v-wechat-title="
            ((selectCourse || {}).name || '课程详情') + '-' + state.webTitle
        "
    >
        <div class="tabs-box">
            <div class="l-tabs">
                <el-breadcrumb
                    separator-class="el-icon-arrow-right"
                    style=" width: 50rem;margin: 0 auto;"
                >
                    <el-breadcrumb-item :to="{ path: '/' }"
                        ><span class="f-c-fff home"
                            >首页</span
                        ></el-breadcrumb-item
                    >
                    <el-breadcrumb-item :to="{ path: '/c-course' }"
                        ><span class="f-c-fff">课程</span></el-breadcrumb-item
                    >
                    <el-breadcrumb-item
                        ><span
                            class="f-c-fff pointer"
                            @click="selectLectureType = 'recommend'"
                            >课程详情</span
                        ></el-breadcrumb-item
                    >

                    <el-breadcrumb-item v-if="selectLectureType === 'video'"
                        ><span class="f-c-fff"
                            >录播播放</span
                        ></el-breadcrumb-item
                    >
                    <el-breadcrumb-item v-if="selectLectureType === 'live'"
                        ><span class="f-c-fff"
                            >直播视频</span
                        ></el-breadcrumb-item
                    >
                </el-breadcrumb>
            </div>
        </div>
        <div class="blackvideo-box">
            <div class="blackvideo" id="playerBox">
                <h5
                    class="fontSize67 pointer"
                    style="padding:1.33rem 0 0.9rem 0;width:fit-content"
                    @click="selectLectureType = 'recommend'"
                >
                    {{ title }}
                </h5>
                <div
                    v-if="selectLectureType === 'recommend'"
                    class="i-xy-between app-width al-str"
                    style="padding-bottom:1.88rem;"
                >
                    <div class="videobox yx-between al-str">
                        <div class="yx-between al-st jf-start full-width">
                            <Video
                                ref="video"
                                style="height:20.59rem;"
                                :course-id="selectCourse.id"
                                :lecture-id="selectLecture.id"
                                :course-sold-flag="selectCourse.soldFlag"
                                :curriculum="selectLecture.entity"
                                :auto-palyer="true"
                                @player-end="playerEnd"
                                @clickSold="createOrder"
                            >
                            </Video>
                            <div
                                class="collect pointer xy-center jf-start fontSize58 full-width"
                                :class="{
                                    'f-c-root': selectLecture.userCollection
                                }"
                                @click="
                                    clickCollection(
                                        'lecture',
                                        selectLecture.id,
                                        selectLecture
                                    )
                                "
                            >
                                <i
                                    class="icon iconfont fontSize5"
                                    :class="[
                                        selectLecture.userCollection
                                            ? 'icon-shoucang'
                                            : 'icon-shoucang1'
                                    ]"
                                />
                                <div class="text">
                                    {{
                                        selectLecture.userCollection
                                            ? "已收藏"
                                            : "收藏"
                                    }}
                                </div>
                            </div>
                        </div>
                        <!-- swiper -->
                        <div
                            v-if="
                                selectLectureType === 'recommend' ||
                                    selectLectureType === 'video'
                            "
                            class="swiper-container"
                        >
                            <div class="swiper-wrapper swiper">
                                <div
                                    v-for="(item, index) in showLectures"
                                    :key="index"
                                    style="width: 10.54rem;height:4.17rem;"
                                    class="swiper-slide f-c-fff xy-center yx-center pointer"
                                    :class="{
                                        active: selectLecture.id === item.id
                                    }"
                                >
                                    <div
                                        class="full-width full-height item yx-center"
                                        @click.stop="
                                            clickLecture({
                                                lecture: item,
                                                index,
                                                type: selectLectureType
                                            })
                                        "
                                    >
                                        <div class="fontSize67 title">
                                            {{ item.title }}
                                        </div>
                                        <div class="fontSize58 info">
                                            {{ item.info }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- Add Arrows -->
                            <div
                                class="swiper-button swiper-button-next xy-center"
                                slot="button-next"
                                style="width:1.25rem;height:2rem;background:#000;"
                            >
                                <span class="icon iconfont icon-arrow"></span>
                            </div>
                            <div
                                class="swiper-button swiper-button-prev xy-center"
                                slot="button-prev"
                                style="width:1.25rem;height:2rem;background:#000;"
                            >
                                <span
                                    class="icon iconfont icon-jiantou3"
                                ></span>
                            </div>
                        </div>
                    </div>
                    <div
                        class="videoright yx-between al-str"
                        style="width:12.5rem;flex-grow:inherit"
                    >
                        <div class="videointro f-c-fff">
                            <h5 class="fontSize67 h5">{{ title }}</h5>
                            <div class="xy-between" style="margin-top:0.92rem;">
                                <div class="font6" style="color:#FF4646">
                                    ￥
                                    <span style="font-size:1.02rem;">{{
                                        (selectCourse.price || 0).toFixed(2)
                                    }}</span>
                                </div>
                                <div class="fontSize5">
                                    {{ selectCourse.soldCount }}人已购买
                                </div>
                            </div>
                            <div class="fontSize5 subtit">
                                已选：{{ selectCourseTagName }}
                            </div>
                            <div class="line full-width"></div>
                            <div class="xy-between pointer">
                                <div
                                    class="orgbtn xy-center"
                                    @click="
                                        () => {
                                            if (!flag.loadNewCourse) {
                                                dialogVisible = true;
                                            }
                                        }
                                    "
                                >
                                    <i
                                        v-show="flag.loadNewCourse"
                                        class="el-icon-loading k-icon-l"
                                    />
                                    <div class="no-wrap-text">选择课程</div>
                                </div>
                                <div
                                    class="orgbtn xy-center redbtn"
                                    @click="createOrder"
                                >
                                    <i
                                        v-show="
                                            flag.createOrder ||
                                                flag.loadNewCourse
                                        "
                                        class="el-icon-loading k-icon-l"
                                    />
                                    <div class="no-wrap-text">立即购买</div>
                                </div>
                            </div>
                        </div>
                        <!-- 课程介绍 -->
                        <div class="introduce yx-between al-str auto-grow">
                            <div class="yx-center al-str">
                                <h5 class="fontSize67">课程介绍</h5>
                                <p class="fontSize58 p f-c-fff inc">
                                    {{ selectCourse.introduction }}
                                </p>
                            </div>
                            <div
                                v-show="
                                    selectCourse.teachers &&
                                        selectCourse.teachers.length > 0
                                "
                            >
                                <h5 class="fontSize67">老师介绍</h5>
                                <div
                                    class="xy-center al-str jf-start style-bar teach-box"
                                >
                                    <div
                                        v-for="(teacher,
                                        index) in selectCourse.teachers || []"
                                        :key="index"
                                        class="teach fontSize5 f-c-fff yx-center pointer"
                                        @click="
                                            go(
                                                '/TeacherDetails?id=' +
                                                    teacher.id
                                            )
                                        "
                                    >
                                        <a class="hidden" :href="'/TeacherDetails?id=' +  teacher.id">{{teacher.name}}</a>
                                        <img
                                            :src="coverImage(teacher.avatar)"
                                            :alt="teacher.name"
                                        />
                                        <div class="name no-wrap-text">
                                            {{ teacher.name }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Dialog
                            :visible.sync="dialogVisible"
                            width="40%"
                            :before-close="handleClose"
                            class="select-tag"
                        >
                            <div class="fontSize58">
                                <div
                                    v-for="(item, index) in tagList"
                                    :key="index"
                                    class="fle"
                                >
                                    <div class="tit no-wrap-text">
                                        {{ item.name }}：
                                    </div>
                                    <div
                                        class="ctag xy-center jf-start al-start"
                                    >
                                        <div
                                            v-for="(ctag, n) in item.children"
                                            :key="n"
                                            class="xy-center tag-item f-c-333"
                                            :class="{
                                                active: ctag.select,
                                                pointer: !ctag.disabled,
                                                disabled: ctag.disabled
                                            }"
                                            @click="clickTag(item, ctag)"
                                        >
                                            {{ ctag.name }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                slot="footer"
                                class="dialog-footer xy-center full-width"
                            >
                                <el-button
                                    type="primary"
                                    @click="okTag"
                                    :disabled="illTags"
                                    >确 定</el-button
                                >
                                <el-button @click="cancelSelectTag"
                                    >取 消</el-button
                                >
                            </div>
                        </Dialog>
                    </div>
                </div>
                <CourseVideoPlayer
                    v-if="selectLectureType === 'video'"
                    :select-course="selectCourse"
                    :select-classroom="selectClassroom"
                    :select-chapter="selectChapter"
                    :select-lecture="selectLecture"
                    :select-lecture-index="selectLectureIndex"
                    @click-lecture="clickLecture"
                    @click-chapter-open="clickChapterOpen"
                    @clickSold="createOrder"
                />
                <CourseLivePlayer
                    v-if="selectLectureType === 'live'"
                    :select-course="selectCourse"
                    :select-classroom="selectClassroom"
                    :select-chapter="selectChapter"
                    :select-lecture="selectLecture"
                    :select-lecture-index="selectLectureIndex"
                />
            </div>
        </div>
        <!-- 课程评论 -->
        <div class="CourseReview app-width xy-between">
            <div style="width:70%;align-self: baseline;">
                <CourseReview
                    ref="courseReview"
                    :id="id"
                    :course="selectCourse"
                    :select-lecture="selectLecture"
                    :select-lecture-type="selectLectureType"
                    :course-sold-flag="selectCourse.soldFlag"
                    :default-active-nav="activeNav"
                    :init-data="initData"
                    :select-classroom="selectClassroom"
                    @click-lecture="clickLecture"
                />
            </div>
            <div style="width:28%;align-self: end;" class="hotnews b-c-fff">
                <HotNews />
            </div>
        </div>
    </div>
</template>

<script>
import Video from "@/components/Video.vue";
import CourseReview from "@/components/curriculum/CourseReview.vue";
import HotNews from "@/components/HotNews.vue";
import Dialog from "@/components/Dialog.vue";
import { JsVuePage, JsVueComponent, JsVueBaseApi } from "@/vue";
import CourseVideoPlayer from "@/components/CourseVideoPlayer.vue";
import CourseLivePlayer from "@/components/CourseLivePlayer.vue";
import { mapState } from "vuex";
import {
    coursePackageCourseList,
    lectureDetail,
    curriculumDetail,
    collection,
    userHaveCollection,
    userHaveLike,
    selectUserAssets,
    getCurriculumWatchTime,
    createOrder,
    teacherListByCourse,
    lectureCourseTreeData
} from "@/action";

let is = (aArr = [], bArr = []) => {
    return (
        bArr.length <= aArr.length &&
        bArr.filter(c => !aArr.includes(c)).length === 0
    );
};
let mySwiper = null;
export default {
    mixins: [JsVueComponent, JsVuePage, JsVueBaseApi],
    components: {
        Video,
        CourseReview,
        HotNews,
        Dialog,
        CourseVideoPlayer,
        CourseLivePlayer
    },
    data() {
        return {
            courseList: [],
            selectCourse: {},
            flag: {
                loadNewCourse: false,
                createOrder: false
            },
            id: null,
            dialogVisible: false,
            tagList: [],
            showLectures: [],
            selectClassroom: {},
            selectChapter: {},
            selectLecture: {},
            selectLectureType: "recommend",
            selectLectureIndex: 0,
            activeNav: null,
            initData: {
                courseId: null,
                classroomId: null,
                chapterId: null,
                lectureId: null
            }
        };
    },
    created() {
        this.id = this.$route.query.id;
        this.activeNav = this.$route.query.activeNav;
        this.selectLectureType =
            this.$route.query.selectLectureType || "recommend";
        this.initData = {
            courseId: this.$route.query.id,
            classroomId: this.$route.query.classroomId || null,
            chapterId: this.$route.query.chapterId || null,
            lectureId: this.$route.query.lectureId || null
        };
        this.initLecture();
    },
    mounted() {
        this.loadCourseData(this.$route.query.id);
        document.body.scrollIntoView();
        mySwiper = null;
        // console.log(this.selectCourse, this.selectClassroom, this.selectLecture, 408888)
    },
    methods: {
        initLecture() {
            // if (this.initData && this.initData.lectureId) {
            //     if (!this.initData.classroomId || !this.initData.chapterId) {
            //         lectureCourseTreeData(this.initData.lectureId, this.id).then(result => {
            //             this.initData = result;
            //         });
            //     }
            // }
        },
        handleClose(done) {
            done();
            this.tagBack();
        },
        clickTag(parent, ctag) {
            if (!ctag.disabled) {
                ctag.select = !ctag.select;
            }
            this.applayTagCode();
        },
        clickChapterOpen({ chapter, chapters }) {
            this.$refs.courseReview.clickChapterOpen(chapter, chapters);
        },
        loadCourseData(id) {
            coursePackageCourseList(id).then(data => {
                this.courseList = data.course.map(c => {
                    return {
                        ...c,
                        soldFlag: false
                    };
                });
                this.processTag(data.tagCodes);
                this.processData(
                    this.courseList.filter(c => c.id === this.id)[0]
                );
            });
        },
        cancelSelectTag(done) {
            this.dialogVisible = false;
            this.tagBack();
        },
        createOrder() {
            // 立即购买  创建订单
            if (this.flag.createOrder || this.flag.loadNewCourse) {
                return;
            }
            this.flagPromise(
                createOrder(
                    [
                        {
                            entityType: "course",
                            entityId: this.selectCourse.id
                        }
                    ],
                    null,
                    null,
                    {
                        message: "创建订单失败",
                        gotoLogin: true
                    }
                ),
                "createOrder"
            ).then(order => {
                this.go(`/c-course/Buy?orderId=${order.id}`);
            });
        },
        tagBack() {
            let tagCodes = this.selectCourse.tagCode.split(",");
            this.tagList.forEach(p =>
                p.children.forEach(c => {
                    if (tagCodes.includes(c.code)) {
                        c.select = true;
                    }
                })
            );
            this.applayTagCode();
        },
        okTag() {
            this.dialogVisible = false;
            let alSelect = [];
            this.tagList.forEach(parent =>
                alSelect.push(
                    ...parent.children.filter(c => c.select).map(t => t.code)
                )
            );
            this.courseList.forEach(c => {
                let tags = c.tagCode.split(",");
                if (alSelect.length === tags.length && is(tags, alSelect)) {
                    this.id = c.id;
                }
            });
        },
        processTag(tagList = []) {
            let parent = tagList
                .filter(t => !t.parentId)
                .map(d => {
                    return {
                        ...d,
                        children: []
                    };
                });
            tagList
                .filter(t => t.parentId)
                .map(t => {
                    return {
                        ...t,
                        disabled: false,
                        select: false
                    };
                })
                .forEach(t => {
                    for (let i = 0; i < parent.length; i++) {
                        if (parent[i].id === t.parentId) {
                            parent[i].children.push(t);
                            break;
                        }
                    }
                });
            this.tagList = parent;
        },
        async processData(serverData) {
            if (!serverData) {
                return;
            }
            this.flag.loadNewCourse = true;
            // this.title = "才士网校 -" + serverData.name;
            // this.seoDescription("才士网校-课程简介");
            // 判断课程是否购买
            try {
                if (this.userLoginStatus) {
                    let pageResult = await selectUserAssets({
                        assetType: "course",
                        assetMappingId: serverData.id
                    });
                    serverData.soldFlag = pageResult.total > 0;
                } else {
                    serverData.soldFlag = false;
                }
            } catch (e) {}
            this.selectCourse = serverData;
            // console.log(this.selectCourse, "选择的课程")
            // console.log(this.selectCourse.soldFlag, "课程是否购买")
            // 设置推荐讲座
            Promise.all([
                this.settingRecommendLecture(
                    JSON.parse(serverData.recommendedLectureId || "[]"),
                    serverData
                ),
                this.settingCourseTeacher(serverData)
            ]).finally(() => {
                this.flag.loadNewCourse = false;
            });
            // 设置标签
            this.tagBack();
            this.seoKeywords(serverData.name);
            this.seoDescription(serverData.soldInstructions)
        },
        settingCourseTeacher(course) {
            if (course.teachers) {
                return Promise.resolve();
            }
            return teacherListByCourse(course.id, false).then(data => {
                course.teachers = data;
            });
        },
        settingRecommendLecture(lectureIds, course) {
            if (course.recommendLecture) {
                this.recommendLecture = course.recommendLecture;
                this.selectChapter = {
                    id: 1,
                    lectures: course.recommendLecture
                };
                return Promise.resolve();
            }
            return Promise.all(lectureIds.map(id => lectureDetail(id, true)))
                .then(result => {
                    for (let i in result) {
                        let lecture = result[i];
                        let titles = lecture.name.split(" ");
                        lecture.type = "recommend";
                        lecture.title = titles.length === 2 ? titles[0] : null;
                        lecture.info =
                            titles.length === 2 ? titles[1] : titles[0];
                    }
                    if (this.selectLectureType === "recommend") {
                        this.settingRecommondLecture(result, 0);
                    }
                    this.recommendLecture = result;
                    course.recommendLecture = result;
                    result.forEach(l => {
                        getCurriculumWatchTime(l.entity.videoId).then(
                            r => (l.entity.watchTime = r)
                        );
                    });
                    this.selectChapter = {
                        id: 1,
                        lectures: result
                    };
                })
                .catch(e => {
                    console.error(e);
                });
        },
        clickLecture({ classroom, chapter, lecture, index, type }) {
            if (this.selectLectureType === "recommend") {
                this.$refs.video.pushWatchData();
            }
            chapter = chapter || this.selectChapter;
            chapter.open = true;
            type = type || this.selectLectureType;
            index = index === undefined ? this.selectLectureIndex : index;
            classroom = classroom || this.selectClassroom;
            if (!lecture && index !== undefined) {
                lecture = chapter.lectures[index];
            }
            this.selectLectureIndex = index;
            this.selectChapter = chapter;
            this.selectLecture = lecture;
            this.selectLectureType = type;
            this.selectClassroom = classroom;
            if (this.selectLectureType === "recommend") {
                this.settingRecommondLecture(chapter.lectures, index);
            }
            document
                .getElementById("playerBox")
                .scrollIntoView({ block: "end" });
            setTimeout(() => {
                document.getElementById(lecture.id).scrollIntoViewIfNeeded({
                    behavior: "smooth",
                    block: "end"
                });
            }, 500);
        },
        playerEnd() {
            if (this.selectLectureType === "recommend") {
                let index = this.selectLectureIndex + 1;
                if (index < this.showLectures.length) {
                    this.clickLecture({
                        lecture: this.showLectures[index],
                        index
                    });
                }
            } else if (this.selectLectureType === "video") {
                let index = this.selectLectureIndex + 1;
                if (index < this.showLectures.length) {
                    this.clickLecture({
                        lecture: this.showLectures[index],
                        index
                    });
                } else {
                    for (
                        let i = 0;
                        i < this.selectClassroom.videoChapter.length - 1;
                        i++
                    ) {
                        if (
                            this.selectClassroom.videoChapter[i].id ===
                            this.selectChapter.id
                        ) {
                            let c = this.selectClassroom.videoChapter;
                            this.clickLecture({
                                chapter: c[i + 1],
                                index: 0
                            });
                            break;
                        }
                    }
                }
            }
        },
        settingRecommondLecture(showLectures, loopIndex = 0) {
            this.showLectures = showLectures;
            this.selectLecture = showLectures[loopIndex];
            if (!mySwiper) {
                mySwiper = new Swiper(".swiper-container", {
                    autoplay: false,
                    observer: true,
                    slidesPerView: 4,
                    centeredSlidesBounds: true,
                    observeSlideChildren: true,
                    navigation: {
                        nextEl: ".swiper-button-next",
                        prevEl: ".swiper-button-prev"
                    },
                    on: {
                        init: function() {
                            setTimeout(() => {
                                mySwiper.slideToLoop(loopIndex);
                            }, 10);
                        }
                    }
                });
            } else {
                mySwiper.update();
                mySwiper.slideToLoop(loopIndex);
            }
        },
        applayTagCode() {
            let illTags = this.courseList.map(course =>
                course.tagCode.split(",")
            );
            let alSelect = [];
            this.tagList.forEach(parent =>
                alSelect.push(
                    ...parent.children.filter(c => c.select).map(t => t.code)
                )
            );
            this.tagList.forEach(parent => {
                parent.children
                    .filter(t => !alSelect.includes(t.code))
                    .forEach(tag => {
                        let tags = [...alSelect, tag.code];
                        tag.disabled =
                            illTags.filter(arr => is(arr, tags)).length === 0;
                    });
            });
        },
        findLectureIndex(lectures = [], id) {
            let r = (lectures || []).map(l => l.id).indexOf(id);
            return r < 0 ? 0 : r + 1;
        },
        positioningCourse() {
            this.processData(this.courseList.filter(c => c.id === this.id)[0]);
        }
    },
    watch: {
        id(id) {
            if (this.initData && this.initData.courseId !== id) {
                this.initData = null;
            }
            this.positioningCourse();
        },
        selectLecture(selectLecture) {
            // console.log(selectLecture, "讲座")
            if (this.userLoginStatus && !selectLecture.userCollection) {
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
        },

        selectLectureType(selectLectureType) {
            if (selectLectureType === "recommend") {
                this.settingRecommondLecture(this.recommendLecture, 0);
            }
        }
    },
    computed: {
        ...mapState({
            userLoginStatus: state => state.userLoginStatus,
            webTitle: state => state.webTitle
        }),
        illTags() {
            let alSelect = [];
            this.tagList.forEach(parent =>
                alSelect.push(
                    ...parent.children.filter(c => c.select).map(t => t.code)
                )
            );
            return (
                this.courseList.filter(c => {
                    let tags = c.tagCode.split(",");
                    return (
                        alSelect.length === tags.length && is(tags, alSelect)
                    );
                }).length === 0
            );
        },
        selectCourseTagName() {
            if (this.selectCourse.id && this.tagList && this.tagList[0].id) {
                let tags = this.selectCourse.tagCode.split(",");
                return tags
                    .map(code => {
                        for (let i in this.tagList) {
                            for (let j in this.tagList[i].children) {
                                if (this.tagList[i].children[j].code === code) {
                                    return this.tagList[i].children[j].name;
                                }
                            }
                        }
                    })
                    .join("+");
            }
            return null;
        }
    }
};
</script>

<style scoped lang="scss">
.l-tabs {
    background-color: #333333;
    padding: 0.58rem 0;
    .home:hover {
        color: #96c322;
    }
}
.blackvideo-box {
    background: #191919;
    padding: 0 15.04rem;
    position: relative;
    .blackvideo {
        width: 50rem;
        margin: 0 auto;
        h5 {
            color: #dddddd;
        }
        .videobox {
            width: 36.63rem;
            .collect {
                padding: 0.54rem 0 0.54rem 0.96rem;
                background: #26262b;
                color: #999999;
                .text {
                    margin-left: 0.29rem;
                }
            }
            .swiper-container {
                width: 36.63rem;
                margin-top: 0.83rem;
            }
            .swiper {
                .swiper-slide {
                    width: 8.45rem !important;
                    max-width: 8.54rem !important;
                    margin-right: 0.7rem;
                    background-color: #26262b;
                    border-radius: 0.25rem;
                    .item {
                        padding: 0.79rem 0.96rem;
                    }
                    .info {
                        text-align: center;
                    }
                }
                .swiper-slide.active {
                    color: #ffffff;
                    background-color: #434446;
                }
            }
        }
        .videoright {
            flex-grow: 1;
            .videointro {
                padding: 0.83rem 0.88rem;
                margin-bottom: 0.79rem;
                background: #26262b;
                border-radius: 0.25rem;
                .h5 {
                    line-height: 1;
                }
                .subtit {
                    border-radius: 0.58rem;
                    border: 1px solid #f4f5f8;
                    margin: 1.17rem 0 0.79rem 0;
                    padding: 0.38rem 0.3rem 0.29rem 0.54rem;
                }
                .line {
                    border-bottom: 1px solid #575757;
                    margin-bottom: 1.04rem;
                }
            }
            .introduce {
                padding: 0.83rem 0.8rem;
                background: #26262b;
                border-radius: 0.25rem;
                .inc {
                    line-height: 0.75rem;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 10;
                    -webkit-box-orient: vertical;
                    color: #ababab;
                    margin: 0.75rem 0;
                    min-height: 12em;
                }
            }
            .font6 {
                font-size: 0.6rem;
            }
        }
        .chat-room {
            width: 12.5rem !important;
            flex-grow: inherit;
        }

        .video-classroom-box {
            background-color: #333333;
            max-height: 27.51rem;
            overflow-y: auto;
            border-radius: 0.08rem;
            .pad {
                padding: 0 0.75rem;
            }
            .chapter {
                .title-box {
                    height: 2.24rem;
                    border-bottom: 0.04rem solid #4a4a4a;
                }
                .lecture {
                    padding: 0.54rem 0.75rem;
                    .cover {
                        width: 3.67rem;
                        height: 2rem;
                        min-width: 3.67rem;
                    }
                    .content-box {
                        flex-grow: 1;
                        margin-left: 0.71rem;
                    }
                }
                .lecture:hover {
                    background-color: #666666;
                }
                .lecture.active {
                    background-color: #252525;
                }
            }
        }
    }
}
.CourseReview {
    margin: 0.8rem auto;
    .hotnews {
        padding: 1.08rem 0.71rem;
    }
}
.orgbtn,
.redbtn {
    height: 1.42rem;
    width: 5rem;
    border-radius: 0.71rem;
    font-size: 0.62rem;
}
.orgbtn {
    background: linear-gradient(
        94deg,
        rgba(254, 94, 7, 1) 0%,
        rgba(255, 123, 51, 1) 100%
    );
}
.redbtn {
    background: linear-gradient(
        95deg,
        rgba(255, 26, 31, 1) 0%,
        rgba(255, 80, 80, 1) 100%
    );
}
.tit {
    width: 3.1rem;
    text-align: right;
    color: #9598a2;
}
.ctag {
    margin-bottom: 1.42rem;
    flex-wrap: wrap;
    margin-left: 1.92rem;
    .tag-item {
        border: 1px solid #d2d2d2;
        margin-bottom: 0.58rem;
        height: 1.17rem;
        border-radius: 0.17rem;
        margin-right: 0.88rem;
        padding: 0 1.3em;
    }
    .tag-item.pointer:hover {
        border: 0.08rem solid $rootColor;
    }
    .tag-item.disabled {
        color: #dcdcdc;
        border: 1px solid #dcdcdc;
    }
    .tag-item.active {
        color: $rootColor;
        border: 0.08rem solid $rootColor;
    }
}
.fle {
    display: flex;
}
.icon {
    img {
        width: 0.75rem;
        height: 0.75rem;
    }
}
.teach-box {
    overflow-x: auto;
    .teach {
        margin-top: 0.4rem;
        margin-right: 0.92rem;
        img {
            width: 2rem;
            height: 2rem;
            border-radius: 50%;
        }
        .name {
            margin-top: 0.04rem;
        }
    }
}
.swiper-button {
    color: #ffffff;
}
</style>
<style>
.select-tag .el-dialog__footer {
    border-top: 0.04rem solid #e6e7ea;
}

.select-tag .el-dialog__body.dialog-body.b-c-app {
    background: #fff !important;
}
</style>
