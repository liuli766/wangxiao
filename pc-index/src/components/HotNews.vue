<template>
    <div>
        <!-- 热门资讯 -->
        <div class="informationTitle FW600 xy-between">
            <h5 class="fontSize75">热门资讯</h5>
            <p class="fontSize58 pointer" @click="go('/found')">更多>
            <a href="/found" class="hidden"></a>
            </p>
        </div>
        <div class="informationList ">
            <div
                class="inforItem xy-between pointer"
                v-for="(item, index) in information.content"
                :key="index"
                @click="toArticleDetails(item)"
            >
                <a :href="toArticleDetailsPath(item)" style="display:none;"></a>
                <img
                    :src="coverImage(item.image)"
                    style="width:30%;"
                />
                <!-- <img v-else src="@/assets/img/default.png" alt=""> -->
                <div class="text" style="width:66%;">
                    <h5 class="fontSize58 one-wrap">
                        {{ item.title }}
                    </h5>
                    <p class="fontSize5 two-wrap">
                        {{ item.digest }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { JsVueComponent } from "@/vue";
import {
    curriculumDetail,
    lectureDetail,
    findByIntentionAndType,
    findByIntentionAndRecommend
} from "@/action";
import { mapState } from "vuex";

export default {
    mixins: [JsVueComponent],
    components: {},
    data() {
        return {
            information: {
                size: 5,
                total: 0,
                recommend: "hot",
                currentPage: 1,
                content: []
            }
        };
    },
    computed: {
        ...mapState({
            currentStudentIdeaId: state => state.currentStudentIdeaId
        })
    },
    created() {
        this.init(this.state.currentStudentIdeaId);
    },
    methods: {
        toArticleDetailsPath(item) {
            switch (item.constructionType) {
            case 1:
                return `/ArticleDetails?articleId=${item.id}`
            case 2:
                return item.link
            default:
                return ""
            }
        },
        toArticleDetails(item) {
            if (item.constructionType === 1) {
                this.$router.push({
                    path: "/ArticleDetails",
                    query: { articleId: item.id }
                });
            } else if (item.constructionType === 2) {
                let link = item.link;
                window.open(link)
            }
        },
        init(studentIdeaId) {
            if (studentIdeaId) {
                this.showFindByIntentionAndRecommend(this.currentStudentIdeaId, this.information);// 资讯列表
            }
        },
        showFindByIntentionAndRecommend(studentIdeaId, info) {
            let param = {
                studentIdeaId: studentIdeaId,
                recommend: info.recommend,
                currentPage: info.currentPage,
                pageSize: info.size
            };
            findByIntentionAndRecommend(param).then(res => {
                // console.log(res, 2255555)
                res.content.forEach(item => {
                    if (item.labels.length !== 0) {
                        let label = item.labels[0].name;
                        item.label = label;
                    }
                    if (item.images !== null) {
                        let image = item.images.split(",")[0];
                        item.image = image
                    }
                })
                this.information.content = res.content;
                // console.log(this.discover.content, "发现列表")
                this.information.total = res.totalElements;
            })
        }
    },
    watch: {
        "state.currentStudentIdeaId": function(studentIdeaId) {
            this.init(studentIdeaId);
        }
    }
};
</script>

<style>
.mainRight {
    padding: 0.75rem 0.92rem;
}
.informationList .inforItem {
    margin-top: 0.5rem;
}
.informationList p {
    margin-top: 0.5rem;
    line-height: 0.75rem;
    color: #a6a6a6;
}
.inforItem img{
    width: 3rem;
    height: 3rem;
    border-radius: 0.08rem;
}
</style>
