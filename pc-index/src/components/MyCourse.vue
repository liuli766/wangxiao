<template>
    <div class="full-width">
        <!-- 我的课程 -->
        <div class="myCourse b-c-fff yx-center al-str jf-start pointer">
            <!-- <h4 class="fontSize75 FW600">我的课程</h4> -->
            <div class="courseInfo xy-between al-str">
                <img :src="coverImage(myCourseData.icon)" alt="" />
                <div class="infoText yx-between al-str">
                    <h5 class="fontSize67 FW600 f-c-333">
                        {{ myCourseData.name }}
                    </h5>
                    <p class="fontSize58">
                        {{ myCourseData.introduction }}
                    </p>
                    <div class="infoTextBtm xy-between al-start">
                        <div class="infoTextBtmL">
                            <p class="fontSize5">
                                {{ myCourseData.tagName }}
                            </p>
                            <p class="fontSize5">
                                已学习
                                <span class="fontSize67 f-c-root">{{
                                    myCourseData.leaningTime
                                }}</span
                                >天， 距离到期还剩
                                <span
                                    class="fontSize67 f-c-root"
                                    v-if="myCourseData.surplusTime > 0"
                                    >{{ myCourseData.surplusTime }}</span
                                >
                                <span class="fontSize67 f-c-root" v-else
                                    >0</span
                                >
                                天
                            </p>
                        </div>
                        <div class="infoTextBtmR xy-between" v-if="btnType">
                            <button
                                class="fontSize58 f-c-root b-c-fff pointer"
                                @click="clickStuData(myCourseData)"
                            >
                                学习报告
                            </button>
                            <button
                                class="fontSize58 b-c-root f-c-fff pointer"
                                @click="toLearingDetails(myCourseData)"
                                v-if="myCourseData.surplusTime > 0"
                            >
                                去学习
                            </button>
                            <button
                                v-if="myCourseData.surplusTime <= 0"
                                class="fontSize58 f-c-fff pointer"
                                style="background:linear-gradient(95deg,rgba(255,26,31,1) 0%,rgba(255,80,80,1) 100%);border:1px solid red;"
                                @click="createOrder"
                            >
                                去购买
                            </button>
                        </div>
                        <div class="continueLearn">
                            <button
                                v-if="showContinue"
                                class="fontSize58 b-c-root f-c-fff pointer"
                                @click="continueLearn(myCourseData)"
                            >
                                继续上次学习
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Dialog title="数据报告" :visible.sync="dialogVisible" width="28.5rem">
            <div class="dialogContent">
                <div class="Toptitle">
                    <h3 class="fontSize75 f-c-333">{{ selectCourse.name }}</h3>
                    <div class="fontSize58 f-c-9d">
                        已学习
                        <span class="f-c-root">{{
                            selectCourse.leaningTime
                        }}</span>
                        天,距离到期还剩
                        <span class="f-c-root">{{
                            selectCourse.surplusTime
                        }}</span
                        >天
                    </div>
                </div>
                <div class="data-row Course fontSize58 f-c-9d xy-between">
                    <div class="f-c-333">课程统计：</div>
                    <div class="data-box auto-grow xy-between jf-start">
                        <div class="a">
                            总课时<span>{{
                                selectCourse.stuData.video.videoTotalCount || 0
                            }}</span
                            >讲
                        </div>
                        <div class="a">
                            已学习<span>{{
                                selectCourse.stuData.video.videoFinishCount || 0
                            }}</span
                            >讲
                        </div>
                        <div class="b">
                            累计学习时长<span>{{
                                (
                                    selectCourse.stuData.video.videoWatchTime ||
                                    0
                                ).toFixed(2)
                            }}</span
                            >小时
                        </div>
                        <div class="a">
                            完成率<span>{{
                                (
                                    selectCourse.stuData.video
                                        .videoCompleteAccuracy || 0
                                ).toFixed(2)
                            }}</span
                            >%
                        </div>
                    </div>
                </div>
                <div
                    class="data-row LiveBroadcast fontSize58 f-c-9d xy-between"
                >
                    <div class="f-c-333">直播讲堂：</div>
                    <div class="data-box auto-grow xy-between jf-start">
                        <div class="a">
                            总课时<span>{{
                                selectCourse.stuData.live.videoTotalCount || 0
                            }}</span
                            >讲
                        </div>
                        <div class="a">
                            已学习<span>{{
                                selectCourse.stuData.live.videoFinishCount || 0
                            }}</span
                            >讲
                        </div>
                        <div class="b">
                            累计学习时长<span>{{
                                (
                                    selectCourse.stuData.live.videoWatchTime ||
                                    0
                                ).toFixed(2)
                            }}</span
                            >小时
                        </div>
                        <div class="a">
                            完成率<span>{{
                                (
                                    selectCourse.stuData.live
                                        .videoCompleteAccuracy || 0
                                ).toFixed(2)
                            }}</span
                            >%
                        </div>
                    </div>
                </div>
                <div class="data-row ItemBank fontSize58 f-c-9d xy-between">
                    <div class="f-c-333">题库统计：</div>
                    <div class="data-box auto-grow xy-between jf-start">
                        <div class="a">
                            总数量<span>{{
                                selectCourse.stuData.question
                                    .questionTotalCount || 0
                            }}</span
                            >题
                        </div>
                        <div class="a">
                            已做<span>{{
                                selectCourse.stuData.question
                                    .questionFinishCount || 0
                            }}</span
                            >题
                        </div>
                        <div class="a">
                            完成率<span>{{
                                (
                                    (selectCourse.stuData.question
                                        .questionFinishCount || 0) /
                                    (selectCourse.stuData.question
                                        .questionTotalCount ||
                                        0 ||
                                        1)
                                ).toFixed(2)
                            }}</span
                            >%
                        </div>
                    </div>
                </div>
                <div class="data-row Homework fontSize58 f-c-9d xy-between">
                    <div class="f-c-333">课后作业：</div>
                    <div class="data-box auto-grow xy-between jf-start">
                        <div class="a">
                            总数量<span>{{
                                selectCourse.stuData.homework
                                    .questionTotalCount || 0
                            }}</span
                            >次
                        </div>
                        <div class="a">
                            已做<span>{{
                                selectCourse.stuData.homework
                                    .questionFinishCount || 0
                            }}</span
                            >题
                        </div>
                        <div class="a">
                            正确率<span>{{
                                (
                                    (selectCourse.stuData.homework
                                        .questionFinishCount || 0) /
                                    (selectCourse.stuData.homework
                                        .questionTotalCount ||
                                        0 ||
                                        1)
                                ).toFixed(2)
                            }}</span
                            >%
                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
    </div>
</template>

<script>
import { JsVueComponent } from "@/vue";
import { courseStatistic, createOrder, lastStudy } from "@/action";
import Dialog from "@/components/Dialog.vue";
export default {
    props: ["btnType", "myCourseData", "index", "course", "showContinue"],
    mixins: [JsVueComponent],
    components: {
        Dialog
    },
    data() {
        return {
            dialogVisible: false,
            selectCourse: {
                stuData: {
                    video: {},
                    live: {},
                    question: {},
                    homework: {}
                }
            },
            flag: {
                loadNewCourse: false,
                createOrder: false
            }
        };
    },
    created() {},
    methods: {
        continueLearn(course) {
            this.$emit("student", course.id);
        },
        createOrder() {
            // 立即购买  创建订单
            this.flagPromise(
                createOrder(
                    [
                        {
                            entityType: "course",
                            entityId: this.course.id
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
        toLearingDetails(myCourseData) {
            this.$router.push({
                path: "/course/LearningDetails",
                query: {
                    id: myCourseData.id
                }
            });
            this.showBtn = false;
        },
        clickStuData(myCourseData) {
            this.dialogVisible = true;
            this.selectCourse = myCourseData;
            if (!myCourseData.stuData.video.ok) {
                courseStatistic({
                    type: "video",
                    courseId: myCourseData.id
                }).then(result => {
                    myCourseData.stuData.video = {
                        ...result,
                        ok: true
                    };
                });
            }
            if (!myCourseData.stuData.live.ok) {
                courseStatistic({
                    type: "live",
                    courseId: myCourseData.id
                }).then(result => {
                    myCourseData.stuData.live = {
                        ...result,
                        ok: true
                    };
                });
            }
            if (!myCourseData.stuData.question.ok) {
                courseStatistic({
                    type: "question",
                    courseId: myCourseData.id
                }).then(result => {
                    myCourseData.stuData.question = {
                        ...result,
                        ok: true
                    };
                });
            }
            if (!myCourseData.stuData.homework.ok) {
                courseStatistic({
                    type: "homework",
                    courseId: myCourseData.id
                }).then(result => {
                    myCourseData.stuData.homework = {
                        ...result,
                        ok: true
                    };
                });
            }
        }
    },
    mounted() {}
};
</script>

<style scoped>
.myCourse .courseInfo {
    margin-top: 1.2rem;
}
.myCourse .courseInfo img {
    width: 10.63rem;
    height: 8rem;
    border-radius: 5px;
}
.courseInfo .infoText {
    flex-grow: 1;
    margin-left: 0.71rem;
}
.courseInfo .infoText p {
    line-height: 0.79rem;
    margin: 0.5rem 0;
}
.infoTextBtmR {
    margin: 0.8rem 0;
}
.infoTextBtmR button,
.continueLearn button {
    width: 4.17rem;
    line-height: 1.17rem;
    margin: 0 0.5rem;
    border: 1px solid #96c321;
}
.infoText p {
    color: #9598a2;
}
.continueLearn button {
    border-radius: 0.25rem;
}
.infoTextBtmR button {
    border-radius: 0.08rem;
}
/* 弹框内容部分 */
.dialogContent > div {
    border-bottom: 1px solid #e6e7ea;
    padding: 1.2rem 0;
}
.Toptitle > div {
    margin-top: 0.6rem;
}
.dialogContent .Course span {
    color: #489aff;
}
.dialogContent .LiveBroadcast span {
    color: #ffb448;
}
.dialogContent .ItemBank span {
    color: #5ed488;
}
.dialogContent .Homework span {
    color: #ff6b6b;
}
.data-row .data-box {
    margin-left: 1.17rem;
}
.data-row .data-box .a {
    width: 20%;
}
.data-row .data-box .b {
    width: 40%;
}
</style>
