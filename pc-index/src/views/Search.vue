<template>
    <div>
        <!-- 搜索结果页面 -->
        <div
            style="min-height:14.38rem;"
            v-if="
                informationList.content.length === 0 &&
                    courseList.content.length === 0
            "
        >
            <img
                src="@/assets/img/zanwu.png"
                alt=""
                style="margin-top: 6rem;"
            />
        </div>
        <div class="course app-width marginAuto" v-else>
            <!-- 课程部分 -->
            <div class="RecCourse" v-if="courseList.content.length !== 0">
                <div class="recommendList">
                    <RecCourse
                        :recCourseData="courseList.content"
                        :reCourseTitle="reCourseTitle"
                    ></RecCourse>
                </div>
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :page-size="courseList.pageSize"
                    :total="courseList.total"
                    style="text-align: center;margin:0.5rem 0;"
                    @current-change="courseChange"
                >
                </el-pagination>
            </div>
            <!-- 资讯部分 -->
            <div
                class="information b-c-fff padding-1rem"
                v-if="informationList.content.length !== 0"
            >
                <h4 class="fontSize92 FW600 f-c-333">资讯</h4>
                <ActList :ActList="informationList.content" />
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :page-size="informationList.pageSize"
                    :total="informationList.total"
                    style="text-align: center;margin:0.5rem 0;"
                    @current-change="informationChange"
                >
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import { JsVuePage, JsVueComponent } from "@/vue";
import RecCourse from "@/components/RecCourse.vue";
import ActList from "@/components/itembank/ActList.vue";
import { pcCourseList } from "@/action";

export default {
    mixins: [JsVuePage, JsVueComponent],

    components: {
        RecCourse,
        ActList
    },
    data() {
        return {
            reCourseTitle: "课程",
            courseList: {
                pageSize: 5,
                currentPage: 1,
                type: "pc-course",
                total: 0,
                content: []
            },
            informationList: {
                pageSize: 5,
                currentPage: 1,
                total: 0,
                type: "information",
                content: []
            }
        };
    },
    created() {},
    mounted() {},
    watch: {
        "$route.query.searchKey": {
            immediate: true,
            handler(searchKey) {
                this.showPcSearchList(searchKey, this.courseList);
                this.showPcSearchList(searchKey, this.informationList);
            }
        }
    },
    methods: {
        showPcSearchList(searchKey, info) {
            pcCourseList({
                searchKey: searchKey,
                currentPage: info.currentPage,
                pageSize: info.pageSize,
                type: info.type
            }).then(res => {
                // console.log(res, "搜索结果");
                if (info.type === this.courseList.type) {
                    // 搜索课程
                    this.courseList.content = res.records;
                    this.courseList.total = res.total;
                } else if (info.type === this.informationList.type) {
                    // 搜索资讯
                    res.content.forEach(element => {
                        // console.log(element, 1100000);
                        element.image = element.images;

                        if (element.labels.length !== 0) {
                            element.label = element.labels[0].name;
                        }
                    });
                    this.informationList.content = res.content;
                    this.informationList.total = res.totalElements;
                }
            });
        },
        courseChange(idx) {
            this.courseList.currentPage = idx;
            this.showPcSearchList(this.searchKey, this.courseList);
        },
        informationChange(idx) {
            this.informationList.currentPage = idx;
            this.showPcSearchList(this.searchKey, this.informationList);
        }
    }
};
</script>

<style scoped lang="css">
.RecCourse {
    margin: 1rem 0;
}
.RecCourse h4 {
    padding: 0.8rem 1rem;
    margin-bottom: 1rem;
}
.information {
    margin: 1rem 0 2rem;
    border-radius: 0.42rem;
}
</style>
