<template>
    <div
        class="app-width yx-center"
        v-wechat-title="'课程列表 - ' + state.webTitle"
    >
        <div class="app-width">
            <CourseType @tag-change="courseTagChange"></CourseType>
            <div class="sort fontSize58">
                <span
                    :class="{ chosed: orderBy === 'sort' }"
                    @click="
                        orderBy = 'sort';
                        order = 'asc';
                    "
                    >默认</span
                >
                <span
                    :class="{ chosed: orderBy === 'price' }"
                    @click="
                        orderBy = 'price';
                        order = 'asc';
                    "
                    >价格</span
                >
                <span
                    :class="{ chosed: orderBy === 'sold_count' }"
                    @click="
                        orderBy = 'sold_count';
                        order = 'desc';
                    "
                    >人气</span
                >
            </div>
        </div>
        <div class="xy-between app-width al-start">
            <div style="width:70%;margin-right: 0.83rem;">
                <CourseList :course-list="courseList.content" />
                <a
                    v-for="page in Math.ceil(courseList.total / courseList.pageSize)"
                    :key="page"
                    class="hidden"
                    :href="`/c-course?page=${page}`"
                    >第{{ page }}页</a
                >
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :page-size="courseList.pageSize"
                    :current-page.sync="courseList.currentPage"
                    :total="courseList.total"
                    v-if="courseList.pages > 1"
                    style="text-align: center; margin-bottom:0.5rem;"
                    @current-change="courseListChange"
                >
                </el-pagination>
            </div>
            <div style="width:28%;">
                <div style="padding:0.75rem 0.92rem" class="b-c-fff">
                    <HotNews />
                </div>
                <div style="margin:1rem 0;" class="b-c-fff">
                    <HotActivity />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import CourseType from "@/components/curriculum/CourseType.vue";
import CourseList from "@/components/curriculum/CourseList.vue";
import HotNews from "@/components/HotNews.vue";
import HotActivity from "@/components/curriculum/HotActivity.vue";
import { JsVuePage, JsVueComponent } from "@/vue";
import { packageList, fetchCourse } from "@/action";
export default {
    mixins: [JsVueComponent, JsVuePage],
    components: {
        CourseType,
        CourseList,
        HotNews,
        HotActivity
    },
    data() {
        return {
            // title: "才士网校-课程列表",
            tags: null,
            studentIdeaId: null,
            orderBy: "sort",
            order: "asc",
            init: true,
            courseList: {
                currentPage: 1,
                pageSize: 5,
                total: 0,
                pages: 0,
                content: []
            }
        };
    },
    created() {
        this.courseList.currentPage = parseInt(this.$route.query.page) || 1;
    },
    watch: {
        orderBy() {
            this.loadCourse();
        }
    },
    methods: {
        courseTagChange({ tags, studentIdeaId }) {
            this.tags = tags;
            this.studentIdeaId = studentIdeaId;
            this.courseList.currentPage = this.init ? this.courseList.currentPage : 1;
            this.init = false;
            this.loadCourse(this.courseList);
        },
        loadCourse(courseList) {
            let { tags, studentIdeaId } = this;
            let param = {
                page: {
                    orderBy: this.orderBy,
                    order: this.order,
                    currentPage: courseList.currentPage,
                    pageSize: courseList.pageSize,
                    total: courseList.total
                },
                tagDetail: true,
                studentIdeaId: studentIdeaId
            };
            if (tags && tags.length > 0) {
                param.tagList = tags.map(d => d.code);
            }
            fetchCourse(param).then(res => {
                // console.log(res, "课程列表");
                this.courseList.total = res.total;
                this.courseList.content = res.records;
                this.courseList.pages = res.pages;
            });
        },
        courseListChange(idx) {
            this.courseList.currentPage = idx;
            this.loadCourse(this.courseList);
        }
        // loadCourse() {
        //     let { tags, studentIdeaId } = this;
        //     let param = {
        //         page: {
        //             orderBy: this.orderBy,
        //             order: this.order
        //         },
        //         tagDetail: true,
        //         studentIdeaId: studentIdeaId
        //     };
        //     if (tags && tags.length > 0) {
        //         param.tagList = tags.map(d => d.code);
        //     }
        //     fetchCourse(param).then(result => {
        //         // console.log("result:", result);
        //         this.courseList = result.records;
        //     });
        // }
    }
};
</script>
<style scoped lang="scss">
.sort {
    margin: 0.88rem 1.38rem;
    span {
        margin-right: 1.67rem;
        cursor: pointer;
    }
    .chosed {
        color: #96c321;
    }
}
</style>
