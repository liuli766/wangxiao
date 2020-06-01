<template>
    <div class="main">
        <!-- 教师主页 -->
        <div class="app-width marginAuto">
            <!-- 教师基本信息 -->
            <div class="header b-c-fff xy-between jf-start">
                <img
                    :src="coverImage(teacherInfo.headerUrl)"
                    alt=""
                    class="headerImg"
                />
                <div class="teacherInfo">
                    <h4 class="f-c-333">{{ teacherInfo.name }}</h4>
                    <!-- <span
                        v-show="teacherInfo.labels !== null"
                        class="f-c-root fontSize58"
                        v-for="(item, index) in teacherInfo.labels"
                        :key="index"
                    >
                        #{{ item }}#
                    </span> -->
                </div>
            </div>
            <!-- 导航 -->
            <div class="teacherNav xy-between jf-start b-c-fff">
                <el-menu
                    default-active="0"
                    class="el-menu-demo"
                    active-text-color="#96C321"
                    mode="horizontal"
                    text-color="#333333"
                >
                    <el-menu-item
                        style="font-size:0.75rem;"
                        class="courseNavItem fontSize75 FW600"
                        :index="index + ''"
                        v-for="(item, index) in teacherNav"
                        :key="index"
                        @click="choose(item, index)"
                        >{{ item }}
                    </el-menu-item>
                </el-menu>
            </div>
            <div class="content b-c-fff">
                <!-- 教师动态 -->
                <!-- <div class="dynamic" v-show="activeNav === 'dynamic'">
                    <TeacherIntro />
                </div> -->
                <!-- 在线课堂 -->
                <div class="classroom" v-show="activeNav === 'classroom'">
                    <!-- <CourseList :courseList="courseData.content " /> -->
                    <div class="box">
                        <div v-if="(courseData.content || []).length !== 0">
                            <div
                                v-for="(item, index) in courseData.content"
                                :key="index"
                                class="xy-between b-c-fff CourseList-box pointer jf-start al-str"
                                @click="
                                    go(`/c-course/courseDetail?id=${item.id}`)
                                "
                            >
                                <div></div>
                                <a
                                    :href="
                                        `/c-course/courseDetail?id=${item.id}`
                                    "
                                    :alt="item.name"
                                    class="hidden"
                                    >{{ item.name }}
                                </a>
                                <div class="l-CourseList-left">
                                    <img
                                        :src="coverImage(item.icon)"
                                        alt=""
                                        style="width:10.93rem;height:6.13rem"
                                    />
                                </div>
                                <div class="l-CourseList-right">
                                    <div class="xy-center jf-start">
                                        <!-- <span class="fontSize5 elective">{{
                                            item.elective
                                        }}</span> -->
                                        <div class="fontSize67">
                                            {{ item.name }}
                                        </div>
                                    </div>
                                    <!-- <div v-html="item.soldInstructions"></div> -->
                                    <p class="fontSize58 paragraph two-wrap">
                                        {{ item.introduction }}
                                    </p>
                                    <div class="fontSize58">
                                        <span
                                            v-for="(items, n) in item.tagCodes"
                                            :key="n"
                                            class="radius"
                                            >{{ items.name }}</span
                                        >
                                    </div>
                                    <div class="xy-between">
                                        <div class="price fontSize5">
                                            ￥<span class="fontSize92 FW600">{{
                                                item.price
                                            }}</span>
                                        </div>
                                        <div class="fontSize58">
                                            {{ item.soldCount }}人已购买
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            v-else
                            class="full-width text-center no-data b-c-fff"
                        >
                            没有可用课程
                        </div>
                    </div>
                    <el-pagination
                        v-if="courseData.pages > 2"
                        background
                        layout="prev, pager, next"
                        :page-size="courseData.pageSize"
                        :total="courseData.total"
                        style="text-align: center;"
                        @current-change="courseChange"
                    >
                    </el-pagination>
                </div>
                <!-- 教师介绍 -->
                <div
                    class="introduce fontSize67 f-c-333"
                    v-show="activeNav === 'introduce'"
                >
                    {{ teacherInfo.introduce }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { JsVuePage, JsVueComponent } from "@/vue";
import CourseList from "@/components/curriculum/CourseList.vue";
import TeacherIntro from "@/components/curriculum/TeacherIntro.vue";
import { teacherInfo, dynamic, teacherLabels, pcFindCourse } from "@/action";

export default {
    mixins: [JsVuePage, JsVueComponent],
    components: {
        // CourseList
        // TeacherIntro
    },
    data() {
        return {
            activeNav: "classroom",
            defaultActive: "0",
            teacherId: "",
            type: 0,
            teacherInfo: {},
            teacherNav: ["在线课堂", "教师介绍"],
            courseData: {
                currentPage: 1, // 页码
                pageSize: 5, // 每页显示的数据条数
                total: 0,
                pages: 0,
                content: []
            }
        };
    },
    created() {
        let teacherId = this.$route.query.id;
        this.teacherId = teacherId;
        this.type = this.$route.query.type;
        if (this.type === 1) {
            this.activeNav = "classroom";
            // this.defaultActive = "1";
        }
        this.showTeacherInfo(this.teacherId);
        this.showTeacherLabels(this.teacherId);
        this.showPcFindCourse(this.teacherId, this.courseData);
    },
    methods: {
        choose(item, index) {
            this.navNum = index;
            if (item === "在线课堂") {
                this.activeNav = "classroom";
            } else if (item === "教师介绍") {
                this.activeNav = "introduce";
            }
        },
        showTeacherInfo(teacherId) {
            // 教师信息
            teacherInfo(teacherId).then(res => {
                // console.log(res, "教师基本信息");
                this.teacherInfo = res;
            });
        },
        showTeacherLabels(teacherId) {
            // 教师标签 暂为空
            teacherLabels(teacherId).then(res => {
                // console.log(res, "教师标签")
            });
        },
        showPcFindCourse(teacherId, info) {
            pcFindCourse({
                teacherId: teacherId,
                currentPage: info.currentPage,
                pageSize: info.pageSize
            }).then(res => {
                // console.log(res, "教师主页在线课堂");
                this.courseData.total = res.total;
                this.courseData.content = res.records;
                this.courseData.pages = res.pages;
            });
        },
        courseChange(idx) { // 课程分页
            this.courseData.currentPage = idx;
            this.showPcFindCourse(this.teacherId, this.courseData);
        }
    }
};
</script>

<style scoped lang="scss">
.content {
    margin-bottom: 1rem;
}
.content .classroom,
.content .introduce{
    min-height: 15rem;
}
.content > div {
    padding: 1rem;
}
.header {
    padding: 1.08rem 1.7rem;
    margin: 1rem 0;
    border-radius: 0.25rem;
}
.header .teacherInfo {
    margin-left: 0.8rem;
}
.header .teacherInfo h4 {
    font-size: 0.83rem;
    font-weight: 600;
}
.header .teacherInfo span {
    margin-right: 0.5rem;
}

.header .headerImg {
    width: 2.92rem;
    height: 2.92rem;
    border-radius: 50%;
}
/* 教师动态部分 */
.dynamic {
    padding: 1rem 3rem !important;
}
.dynamicItem .teacherInfo {
    margin-left: 0.8rem;
}
.dynamicItem .pic {
    margin: 2rem 0;
}
.dynamicItem .pic img {
    width: 4.33rem;
    height: 4.33rem;
}
.dynamicDetails {
    padding: 1.2rem 3.75rem;
}
/* 在线课堂部分 */
/* 教师介绍部分 */
.introduce {
    text-indent: 2em;
}
.teacherNav {
    padding: 0 0.5rem;
}
.CourseList-box {
    padding: 1.08rem 1.04rem 1.21rem 0.92rem;
    margin-bottom: 0.83rem;
    .l-CourseList-left {
        margin-right: 1.13rem;
        img {
            border-radius: 0.25rem;
        }
    }
    .l-CourseList-right {
        flex-grow: 1;
        .paragraph {
            margin: 0.83rem 0;
        }
        .radius {
            border-radius: 0.17rem;
            padding: 0.21rem 0.25rem;
            background: #eff0f4;
            margin-right: 1.08rem;
        }
        .elective {
            margin-right: 0.25rem;
            display: block;
            text-align: center;
            border: 1px solid rgba(255, 53, 53, 1);
            border-radius: 0.4rem;
            padding: 0.13rem 0.42rem;
        }
        .price {
            color: #ff4646;
            margin-top: 0.79rem;
        }
    }
}
.no-data {
    height: 2em;
    line-height: 2em;
}
</style>
