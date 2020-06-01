<template>
    <div>
        <!-- 学习详情下边的题库部分 -->
        <div class="titletop xy-between jf-start">
            <el-menu
                default-active="0"
                class="el-menu-demo"
                active-text-color="#96C321"
                mode="horizontal"
                text-color="#333333"
            >
                <el-menu-item
                    class="pointer fontSize58"
                    :index="index + ''"
                    v-for="(item, index) in subNav"
                    :key="index"
                    >{{ item }}</el-menu-item
                >
            </el-menu>
        </div>
        <div class="category xy-between jf-start fontSize58 f-c-fff ">
            <div class="xy-between pointer b-c-root" @click="handcoll">
                <img
                    src="@/assets/course/becoll.png"
                    alt=""
                    class="collectIcon"
                />
                <div>收藏夹</div>
            </div>
            <div class="xy-between pointer b-c-root" @click="handerr">
                <img src="@/assets/course/ct.png" alt="" class="errBankIcon" />
                <div>错题库</div>
            </div>
        </div>
        <div class="categoryList xy-between flexWarp">
            <div
                class="listItem xy-between"
                v-for="(item, index) in tklist"
                :key="index"
                :class="[index == titnum ? 'active' : '']"
                @click="handletit(index, item)"
            >
                <img :src="item.iconimg" class="categoryListIcon" />
                <div class="text">
                    <h5 class="fontSize67 FW600">
                        {{ item.title }}
                    </h5>
                    <P class="fontSize58">{{ item.info }}</P>
                </div>
                <img
                    src="@/assets/course/right.png"
                    class="categoryListIconRight"
                />
            </div>
        </div>

    </div>
</template>

<script>
export default {
    data() {
        return {
            subNav: [],
            tklist: [
                {
                    title: "章节练习",
                    info: "以练为学，各个击破",
                    iconimg: require("@/assets/course/tk1.png")
                },
                {
                    title: "历年真题",
                    info: "往年真题库",
                    iconimg: require("@/assets/course/tk2.png")
                },
                {
                    title: "模拟试卷",
                    info: "全真实战演练",
                    iconimg: require("@/assets/course/tk3.png")
                },
                {
                    title: "押题密卷",
                    info: "往年真题库",
                    iconimg: require("@/assets/course/tk4.png")
                }
            ]
        };
    }
};
</script>

<style></style>
