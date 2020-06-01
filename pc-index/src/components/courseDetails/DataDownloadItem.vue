<template>
    <div
        class="full-width fontSize58 f-c-333 yx-center al-str jf-start chapter-item"
        :style="{ paddingLeft: 1.79 * level + 'rem' }"
    >
        <div
            class="fontSize58 f-c-333 xy-between cha-content"
            :class="{ end: !hasChildren && !top }"
        >
            <div class="contentL xy-between">
                <img
                    v-show="fillItem.open && fillItem.hasChildren"
                    src="../../assets/img/close.png"
                    alt=""
                    class="img pointer"
                    :class="[top ? 'f-img' : 'c-img']"
                    ref="pic"
                    @click="fillItem.open = false"
                />
                <img
                    v-show="!fillItem.open && fillItem.hasChildren"
                    src="../../assets/img/open.png"
                    alt=""
                    class="img pointer"
                    :class="[top ? 'f-img' : 'c-img']"
                    ref="pic"
                    @click="fillItem.open = true"
                />
                <span class="f-c-333 fontSize58">{{ fillItem.name }}</span>
            </div>
            <div
                v-show="!fillItem.hasChildren"
                class="contentR xy-between fontSize58 f-c-9d"
                :style="{
                    minWidth: 'calc(35% + ' + (1.79 * level + 'rem') + ')'
                }"
            >
                <div>
                    {{ fillItem.createTime }}
                </div>
                <el-button
                    type="primary"
                    size="mini"
                    @click="startdownLoad(fillItem.id)"
                    >去下载
                </el-button>
            </div>
        </div>
        <div class="children">
            <DataDownloadItem
                v-show="fillItem.open && fillItem.hasChildren"
                :fill-item="item"
                :level="level + 1"
                v-for="(item, index) in fillItem.children"
                :key="index"
                @showdetails="startdownLoad"
            />
        </div>
    </div>
</template>
<script>
import { getGroupDataClassifyChildrenList } from "@/action";
export default {
    props: {
        fillItem: {
            required: true,
            type: Object
        },
        level: {
            type: Number,
            default: 0
        }
    },
    name: "DataDownloadItem",
    data() {
        return {
        };
    },
    created() {
        this.classifyId = this.fillItem.id;
        if (this.fillItem.hasChildren) {
            this.fillItem.loadingStatus = 1;
            getGroupDataClassifyChildrenList(this.fillItem.id)
                .then(r => {
                    // console.log(r, "下级列表77");
                    this.fillItem.children = r.map(c => {
                        return {
                            ...c,
                            open: c.hasChildren
                        };
                    });
                })
                .finally(() => {
                    this.fillItem.loadingStatus = 2;
                });
        }
        // console.log(this.fillItem, 9666);
    },

    watch: {},
    computed: {
        hasChildren() {
            return Boolean(this.fillItem.childrenFlag);
        },
        showChildren() {
            return this.fillItem.open && this.fillItem.loadingStatus === 2;
        },
        top() {
            return this.level === 0;
        }
    },
    methods: {
        startdownLoad(classifyId) {
            // console.log("item组件:", classifyId);
            this.$emit("showdetails", classifyId);
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
