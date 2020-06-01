<template>
<!-- 推荐课程组件 -->
    <div class="contain  b-c-fff">
        <div class="reCourseTitle fontSize92 FW600 b-c-fff">{{reCourseTitle}}</div>
        <div class="listBox xy-between jf-start">
            <div
                class="recourseItem pointer"
                v-for="(item, index) in recCourseData"
                :key="index"
                @click="go(`/c-course/courseDetail?id=${item.id}`)"
            >
                <img :src="coverImage(item.icon)" alt="" />
                <div class="text">
                    <div class="recommendTitle xy-between">
                        <div class="subType no-wrap-text">
                            单科
                        </div>
                        <div class="subName fontSize58 two-wrap f-c-333">
                            {{ item.name }}
                        </div>
                    </div>
                    <div class="recommendInfo xy-between">
                        <div class="price fontSize5">
                            ￥
                            <span class="fontSize92 FW600">
                                {{ item.price }}
                            </span>
                        </div>
                        <div class="sales fontSize53 f-c-9d">
                            <span>{{ item.soldCount }}
                                </span
                            >人已购买
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { JsVueComponent } from "@/vue";
import { curriculumDetail, lectureDetail } from "@/action";
export default {
    mixins: [JsVueComponent],
    components: {},
    props: ["recCourseData", "index", "reCourseTitle"],
    data() {
        return {};
    },
    created() {},
    mounted() {},
    methods: {
    }
};
</script>

<style scoped>
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
