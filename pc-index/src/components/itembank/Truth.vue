<template>
    <div class="b-c-fff Chapterbox">
        <div
            class="top xy-between jf-start pointer"
            v-if="showReturn"
            @click="returnItemBank"
        >
            <img src="@/assets/course/return.png" class="returnIcon" />
            <div class="fontSize58 return">
                返回
            </div>
        </div>
        <div class="fontSize58 chaptit xy-between jf-start f-c-9d">
            <div style="width:60%;padding-left:2.38rem">真题名称</div>
            <div style="width:40%;">题数</div>
        </div>
        <div class="content fontSize58 f-c-333">
            <div
                v-for="(item, index) in pagerList"
                :key="index"
                class="xy-center Chapterlist"
            >
                <div style="width:100%">
                    <div style="width:100%" class="line">
                        <div class="contents xy-between pointer">
                            <div class="contentL xy-center">
                                <!-- <span>{{ item.chapterName }}</span> -->
                            </div>
                            <div class="contentC f-c-9b">
                                <span>本卷共{{ item.questionCount }}题</span>
                            </div>
                            <el-button
                                type="primary"
                                size="mini"
                                @click="startQuestion({ chapter: chapterItem })"
                            >
                                <i class="el-icon-edit" />做题
                            </el-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { testPagerList } from "@/action";
export default {
    props: [
        "showReturn",
        "showTitle",
        "testPageRuleId",
        "courseId",
        "classroomId"
    ],
    data() {
        return {
            pagerList: []
        };
    },
    created() {
        this.loadTestPagerList();
    },
    methods: {
        returnItemBank() {
            // 返回题库
            this.$emit("returnItemBank");
        },
        loadTestPagerList() {
            testPagerList({
                testPageRuleId: this.testPageRuleId,
                courseId: this.courseId,
                classroomId: this.classroomId
            }).then(res => {
                this.pagerList = res;
                // console.log(res, 966666);
            });
        },
        startQuestion(value) {
            // console.log("startQuestion:value:", value)
            this.$emit("start-question", value);
        }
    }
};
</script>

<style scoped>
.Chapterbox {
    padding: 1.29rem 1.08rem;
}
.Chapterbox h5 {
    margin-bottom: 1.5rem;
}
.chaptit {
    padding: 1rem 0;
}

.Chapterlist.xy-center {
    justify-content: flex-start;
    line-height: 2.58rem;
    border-top: 1px solid #e6e7ea;
}
.line {
    line-height: 2.58rem;
    border-top: 1px solid #e6e7ea;
}
.contents {
    width: 90%;
}
.contentL {
    width: 50%;
    justify-content: flex-start;
}
.returnIcon,
.collect img {
    width: 0.83rem;
    height: 0.83rem;
}
.top {
    margin-bottom: 0.5rem;
}
</style>
