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
            <div style="width:65%;padding-left:2.38rem">章节名称</div>
            <div style="width:37%;">已做 / 总题数</div>
        </div>
        <ChapterItem
            :numType="numType"
            v-for="(item, index) in chapterList"
            :key="index"
            :chapter-item="item"
            @start-question="startQuestion"
        />
    </div>
</template>

<script>
import ChapterItem from "@/components/courseDetails/ChapterItem";
import { chapterList } from "@/action";
export default {
    props: [
        "showReturn",
        "testPageRuleId",
        "courseId",
        "classroomId"
    ],
    components: {
        ChapterItem
    },
    data() {
        return {
            numType: "questionNum",
            chapterList: []
        };
    },
    created() {
        // console.log(this.testPageRuleId, 6111111)
        this.showChapterList();
    },

    methods: {
        returnItemBank() {
            // 返回题库
            this.$emit("returnItemBank");
        },
        showChapterList() {
            chapterList({
                testPageRuleId: this.testPageRuleId,
                courseId: this.courseId,
                classroomId: this.classroomId
            }).then(res => {
                this.chapterList = res.map(c => {
                    return {
                        ...c,
                        open: false,
                        children: null,
                        loadingStatus: 0
                    };
                });
            });
        },
        startQuestion(chapter) {
            // console.log(chapter, 733333.28)
            this.$emit("start-question", chapter);
        }
    }
};
</script>

<style scoped>
.Chapterbox {
    padding: 1.29rem 1.08rem;
    width: 100%;
    margin: 1rem 0;
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
    width: 95%;
}
.contentR {
    width: 30%;
}
.img {
    margin-right: 0.67rem;
    width: 1.08rem;
    height: 1.08rem;
}
.margin79 {
    margin-left: 1.79rem;
}
.margin4 {
    margin-left: 4rem;
}
.returnIcon,
.collect img {
    width: 0.83rem;
    height: 0.83rem;
}
</style>
