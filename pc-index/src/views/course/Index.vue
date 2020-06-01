<template>
    <!-- 我的课程 我的学习页面 -->
    <div class="yx-center main" v-wechat-title="'我的学习 - ' + state.webTitle">
        <div class="xy-between al-start app-width marginAuto">
            <div class="mainLeft" style="width:70%;">
                <!-- 我的课程 -->
                <div
                    class="full-width content-box yx-center jf-start al-str course-detial"
                    style="margin-bottom:1rem;"
                >
                    <div class="course-title bold fontSize76 f-c-333">
                        我的课程
                    </div>
                    <MyCourse
                        v-for="(course, index) in courseList"
                        :key="index"
                        :course="course"
                        :btnType="true"
                        :showContinue="false"
                        :my-course-data="course"
                    />
                </div>
                <!-- 推荐课程 -->
                <div class="RecCourse b-c-fff" v-if="recCourseData.length!==0">
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
                                    <img :src="coverImage(item.recommendEntity.icon)" alt="" />
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
                                                    {{ item.recommendEntity.price }}
                                                </span>
                                            </div>
                                            <div
                                                class="sales fontSize53 f-c-9d"
                                            >
                                                <span
                                                    >{{ item.recommendEntity.soldCount }} </span
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
            <div class="mainRight b-c-fff" style="width:28%;">
                <HotNews />
            </div>
        </div>
    </div>
</template>
<script>
import { JsVuePage, JsVueComponent } from "@/vue";
import {
    curriculumDetail,
    lectureDetail,
    selectUserAllCourse,
    selectCourseTags,
    recommendData,
    advLocationDetail
} from "@/action";
import MyCourse from "@/components/MyCourse.vue";
import HotNews from "@/components/HotNews.vue";
import { mapState } from "vuex";
let allCourseTagCache;
let defaultStuData = {
    questionTotalCount: 0,
    questionFailCount: 0,
    questionFinishCount: 0,
    questionAccuracy: 0,
    videoTotalCount: 0,
    videoFinishCount: 0,
    videoWatchTime: 0,
    videoCompleteAccuracy: 0
};
export default {
    mixins: [JsVuePage, JsVueComponent],
    components: {
        MyCourse,
        HotNews
    },
    data() {
        return {
            reCourseTitle: "推荐课程",
            curriculumDetail: null,
            lectureId: null,
            courseList: [],
            recCourseData: []
        };
    },
    computed: {
        ...mapState({
            currentStudentIdeaId: state => state.currentStudentIdeaId
        })
    },
    created() {
        this.loadUserCourse();
    },
    mounted() {
        // loadIndexMessage();
    },
    methods: {
        loadAllTag() {
            if (allCourseTagCache) {
                return Promise.resolve();
            }
            let allCourseTag = {};
            return selectCourseTags({
                all: true
            }).then(result => {
                result.forEach(tag => {
                    allCourseTag[tag.code] = tag;
                });
                allCourseTagCache = allCourseTag;
                return allCourseTagCache;
            });
        },

        async loadUserCourse() {
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
            await this.loadAllTag();
            selectUserAllCourse({
                gotoLogin: true
            }).then(courseList => {
                // console.log(courseList, 1388888);
                this.courseList = courseList.map(c => {
                    return {
                        status: c.status,
                        startTime: c.startTime,
                        endTime: c.endTime,
                        ...c.course,
                        soldFlag: true,
                        leaningTime: leaningTime(c.startTime),
                        surplusTime: surplusTime(c.endTime),
                        tagName: c.course.tagCode
                            .split(",")
                            .map(code => allCourseTagCache[code].name)
                            .join("+"),
                        stuData: {
                            video: {},
                            live: {},
                            question: {},
                            homework: {}
                        }
                    };
                });
            });
        },
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
        }
    }
};
</script>
<style scoped lang="css">
.main {
    margin-top: 1.68rem;
}
.RecCourse {
    margin: 0.8rem 0 6rem;
    border-radius: 0.42rem;
}
.content-box {
    border-radius: 0.42rem;
    background-color: #ffffff;
    overflow: hidden;
    padding: 0.83rem 0.96rem;
}
.contain{
    padding:0.88rem 1rem;
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
.sales{
    margin-right: 0.3rem;
}
.price {
    color: #ff4646;
}
</style>
