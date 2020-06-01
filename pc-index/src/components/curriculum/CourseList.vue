<template>
    <!-- 课程列表 -->
    <div class="box">
        <div v-if="courseListProsess && courseListProsess.length > 0">
            <div
                v-for="(item, index) in courseListProsess"
                :key="index"
                class="xy-between b-c-fff CourseList-box pointer jf-start"
                @click="go(`/c-course/courseDetail?id=${item.id}`)"
            >
                <a
                    v-for="nav in [
                        'productIntroduction',
                        'courseDirectory',
                        'courseComment',
                        'courseQ',
                        'liveDirectory',
                        'homework'
                    ]"
                    :key="nav"
                    :href="
                        `/c-course/courseDetail?id=${item.id}&activeNav=${nav}`
                    "
                    :alt="item.name"
                    class="hidden"
                    >{{ item.name }}
                </a>
                <div class="l-CourseList-left">
                    <img
                        :src="coverImage(item.infoImg)"
                        alt=""
                        style="width:10.93rem;height:8rem;"
                    />
                </div>
                <div class="l-CourseList-right">
                    <div class="xy-center jf-start">
                        <span
                            class="fontSize5 elective one-wrap"
                            v-if="item.elective"
                            >{{ item.elective }}</span
                        >
                        <div class="fontSize67">{{ item.title }}</div>
                    </div>
                    <p class="fontSize58 paragraph two-wrap">
                        {{ item.intro }}
                    </p>
                    <div class="fontSize58">
                        <span
                            v-for="(course, n) in item.list"
                            :key="n"
                            class="radius"
                            >{{ course }}</span
                        >
                    </div>
                    <div class="xy-between">
                        <div class="price fontSize5">
                            ￥<span class="fontSize92 FW600">{{
                                item.price
                            }}</span>
                        </div>
                        <div class="fontSize58">{{ item.people }}人已购买</div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="full-width text-center no-data b-c-fff">
            没有可用课程
        </div>
    </div>
</template>

<script>
import { JsVuePage, JsVueComponent } from "@/vue";
export default {
    props: {
        courseList: {
            type: Array,
            require: true
        }
    },
    mixins: [JsVueComponent],
    data() {
        return {};
    },
    created() {},
    computed: {
        courseListProsess() {
            return this.courseList.map(course => {
                // console.log(course, "课程列表");
                return {
                    ...course,
                    infoImg: this.coverImage(course.icon),
                    elective: (
                        course.tagCodes.filter(t =>
                            t.code.startsWith("0002")
                        )[0] || {}
                    ).name,
                    title: course.name,
                    intro: course.introduction,
                    list: [],
                    price: course.price.toFixed(2),
                    people: course.soldCount
                };
            });
        }
    },
    methods: {}
};
</script>

<style scoped lang="scss">
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
