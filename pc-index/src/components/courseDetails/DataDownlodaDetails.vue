<template>
    <div>
        <div>
            <div class="top xy-between jf-start pointer" @click="returnBack">
                <img src="@/assets/course/return.png" class="returnIcon" />
                <div class="fontSize58 return">
                    返回
                </div>
            </div>
            <div class="dataList">
                <div
                    v-for="(item, index) in dataList"
                    :key="index"
                    class="xy-between fontSize58"
                >
                    <div class="f-c-333">{{ item.name }}</div>
                    <!-- <div class="f-c-9d">{{ item.createTime }}</div> -->
                    <el-button
                        type="primary"
                        size="mini"
                        @click="startDownLoad(item)"
                        >立即下载
                    </el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { JsVuePage, JsVueComponent } from "@/vue";
export default {
    mixins: [JsVueComponent, JsVuePage],
    props: ["dataList"],
    data() {
        return {};
    },
    created() {
        // this.loadDataInstanceList()
    },
    methods: {
        returnBack() {
            this.$emit("returnBack");
        },
        startDownLoad(item) {
            window.open(this.coverImage(item.path));
        }
    }
};
</script>

<style>
.dataList {
    padding: 0.5rem;
}
.dataList>div{
    margin-top: 0.5rem;
}
</style>
