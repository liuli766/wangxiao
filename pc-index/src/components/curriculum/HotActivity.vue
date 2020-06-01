<template>
    <!-- 热门活动 -->
    <div class="main">
        <div class="informationTitle FW600 xy-between">
            <h5 class="fontSize75">热门活动</h5>
        </div>
        <div class="informationList ">
            <div
                class="inforItem xy-between pointer"
                v-for="(item, index) in hotActlist"
                :key="index"
                @click="toArticleDetails(item)"
            >
                <a :href="toArticleDetailsPath(item)" style="display:none;"></a>
                <img
                    :src="coverImage(item.image)"
                    style="width:30%;"
                />
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
import { findByIntentionAndType } from "@/action";
import { mapState } from "vuex";
export default {
    mixins: [JsVueComponent],
    components: {},
    data() {
        return {
            hotActlist: []
        };
    },
    computed: {
        ...mapState({
            currentStudentIdeaId: state => state.currentStudentIdeaId
        })
    },
    created() {
        this.showfindByIntentionAndType(this.currentStudentIdeaId)
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
        showfindByIntentionAndType(studentIdeaId) {
            let param = {
                studentIdeaId: studentIdeaId,
                contentType: "activity",
                currentPage: 1,
                pageSize: 5
            }
            findByIntentionAndType(param).then(res => {
                res.content.forEach(item => {
                    if (item.images !== null) {
                        let image = item.images.split(",")[0];
                        item.image = image
                    }
                })
                // console.log(res, 60000)
                this.hotActlist = res.content;
            })
        }
    }
};
</script>

<style scoped lang="css">
.main {
    padding: 0.75rem 0.92rem;
}
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
