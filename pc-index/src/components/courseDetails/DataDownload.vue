<template>
    <div>
        <div v-if="firstDataList.length !== 0">
            <DataDownloadItem
                v-for="(item, index) in firstDataList"
                :key="index"
                :fill-item="item"
                v-show="defaultShow === 'showDataDownloadItem'"
                @showdetails="details"
            />
            <DataDownlodaDetails
                :courseId="courseId"
                v-show="defaultShow === 'showDataDownloadDetails'"
                @returnBack="returnBack"
                :dataList="dataList"
            />
        </div>
        <div v-else class="fontSize67 f-c-333 text-center" style="margin-top:0.5rem;">暂无下载资料</div>
    </div>
</template>

<script>
import DataDownloadItem from "@/components/courseDetails/DataDownloadItem";
import DataDownlodaDetails from "@/components/courseDetails/DataDownlodaDetails";
import { getCourseDataClassifyList, getGroupDataInstanceList } from "@/action";
export default {
    props: ["courseId"],
    components: {
        DataDownloadItem,
        DataDownlodaDetails
    },
    data() {
        return {
            firstDataList: [],
            defaultShow: "showDataDownloadItem",
            dataList: []
        };
    },
    created() {
        this.loadCourseDataClassifyList();
    },
    methods: {
        loadCourseDataClassifyList() {
            getCourseDataClassifyList(this.courseId).then(res => {
                console.log(res, "第一层文件");
                this.firstDataList = res.map(obj => {
                    return {
                        ...obj,
                        open: obj.hasChildren,
                        loadingStatus: 0
                    };
                });
            });
        },
        details(classifyId) {
            // console.log(classifyId, "子组件的id");
            // this.classifyId = classifyId;
            this.defaultShow = "showDataDownloadDetails";
            getGroupDataInstanceList(classifyId).then(res => {
                this.dataList = res;
                // console.log(res, 40000);
            });
        },
        returnBack() {
            this.defaultShow = "showDataDownloadItem";
        }
    }
};
</script>

<style></style>
