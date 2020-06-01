<template>
    <div
        class="full-width fontSize58 f-c-333 yx-center al-str jf-start chapter-item"
        :style="{ paddingLeft: 1.79 * level + 'rem' }"
    >
        <div
            class="fontSize58 f-c-333 xy-between cha-content"
            :class="{ end: !haveChildren && !top }"
        >
            <div class="contentL xy-between">
                <img
                    v-show="chapterItem.open && haveChildren"
                    src="../../assets/img/close.png"
                    alt=""
                    class="img pointer"
                    :class="[top ? 'f-img' : 'c-img']"
                    ref="pic"
                    @click="chapterItem.open = false"
                />
                <img
                    v-show="!chapterItem.open && haveChildren"
                    src="../../assets/img/open.png"
                    alt=""
                    class="img pointer"
                    :class="[top ? 'f-img' : 'c-img']"
                    ref="pic"
                    @click="chapterItem.open = true"
                />
                <span>{{ chapterItem.chapterName }}</span>
            </div>
            <div
                v-show="!haveChildren"
                class="contentR xy-between fontSize58 f-c-9d"
                :style="{
                    minWidth: 'calc(35% + ' + (1.79 * level + 'rem') + ')'
                }"
            >
                <div v-if="numType === 'questionNum'">
                    {{ chapterItem.questionQuantity }} /
                    {{ chapterItem.questionCount }}
                </div>
                <div v-if="numType === 'collNum'">
                    {{ chapterItem.errorNumber }}
                </div>
                <el-button
                    v-else
                    type="primary"
                    size="mini"
                    @click="startQuestion({ chapter: chapterItem })"
                    ><i class="el-icon-edit" />做题</el-button
                >
                <div v-if="startBtnType === 'twoBtn'">
                    <el-button
                        type="primary"
                        size="mini"
                        @click="startQuestion1({ chapter: chapterItem },0)"
                        ><i class="el-icon-edit" />错题回顾</el-button
                    >
                    <el-button
                        type="primary"
                        size="mini"
                        @click="startQuestion1({ chapter: chapterItem },1)"
                        ><i class="el-icon-edit" />错题重做</el-button
                    >
                </div>
            </div>
        </div>
        <div class="children">
            <ChapterItem
                v-show="showChildren"
                v-for="(item,index) in chapterItem.children"
                :key="index"
                :chapter-item="item"
                :level="level + 1"
                @start-question="startQuestion"
            />
        </div>
    </div>
</template>
<script>
import { chapterChildrenList } from "@/action";
export default {
    props: {
        chapterItem: {
            required: true,
            type: Object
        },
        level: {
            type: Number,
            default: 0
        },
        numType: {
            type: String,
            required: false
        },
        startBtnType: {
            type: String,
            required: false
        }
    },
    name: "ChapterItem",
    created() {
        // console.log(this.chapterItem, 101111)
        if (this.chapterItem.childrenFlag) {
            this.chapterItem.loadingStatus = 1;
            chapterChildrenList(this.chapterItem.id)
                .then(r => {
                    // console.log(r, 10666)
                    this.chapterItem.children = r.map(c => {
                        return {
                            ...c,
                            open: false,
                            children: null
                        };
                    });
                })
                .finally(() => {
                    this.chapterItem.loadingStatus = 2;
                });
        }
    },
    data() {
        return {};
    },
    watch: {},
    computed: {
        haveChildren() {
            return Boolean(this.chapterItem.childrenFlag);
        },
        showChildren() {
            return (
                this.chapterItem.open && this.chapterItem.loadingStatus === 2
            );
        },
        top() {
            return this.level === 0;
        }
    },
    methods: {
        startQuestion(chapter) {
            // console.log(chapter, showType, 1388888888);
            this.$emit("start-question", chapter);
        },
        startQuestion1(chapter, showType) {
            // console.log(chapter, showType, 1388888888);
            this.$emit("start-question1", chapter, showType);
        }
    }
};
</script>

<style scoped lang="scss">
.cha-content {
    height: 2.42rem;
    padding: 0 0.5rem;
}
.chapter-item {
    border-top: 0.04rem solid #e6e7ea;
}
.contentL {
    .img {
        margin-right: 0.75rem;
    }
    .c-img {
        width: 0.92rem;
        height: 0.92rem;
    }
    .f-img {
        width: 1.08rem;
        height: 1.08rem;
    }
}
.end {
    padding-left: 1.42rem;
}
</style>
