<template>
    <div>
        <!-- 课程选课 -->
        <div class="course-type-box b-c-fff yx-center al-str fontSize58">
            <div
                v-for="pTag in courseTag"
                :key="pTag.id"
                class="xy-center jf-start course-tag al-start"
            >
                <div class="title">{{ pTag.name }}</div>
                <div class="children xy-between jf-start">
                    <div
                        v-for="cTag in pTag.children"
                        :key="cTag.id"
                        class="f-c-333 item pointer"
                        :class="{
                            'f-c-root active':
                                (pTag.select || {}).id === cTag.id
                        }"
                        @click="clickTag(pTag, cTag)"
                    >
                        {{ cTag.name }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { JsVueComponent } from "@/vue";
import { fetchCourseTag } from "@/action";
import { mapState } from "vuex";
export default {
    mixins: [JsVueComponent],
    data() {
        return {
            courseTag: null
        };
    },
    created() {
        if (this.state.currentStudentIdeaId) {
            this.loadStudentIdeaCourseTags(this.state.currentStudentIdeaId);
        }
    },
    watch: {
        "state.currentStudentIdeaId"(currentStudentIdeaId) {
            this.loadStudentIdeaCourseTags(currentStudentIdeaId);
        }
    },
    methods: {
        loadStudentIdeaCourseTags(studentIdeaId) {
            fetchCourseTag(studentIdeaId, true).then(tag => {
                this.courseTag = tag.map(d => {
                    return {
                        ...d,
                        select: null
                    };
                });
                this.selectTagChange();
            });
        },
        clickTag(pTag, cTag) {
            if (pTag.select && pTag.select.id === cTag.id) {
                pTag.select = null;
            } else {
                pTag.select = cTag;
            }
            this.selectTagChange();
        },
        selectTagChange() {
            this.$emit("tag-change", {
                tags: this.courseTag.map(t => t.select).filter(d => d),
                studentIdeaId: this.state.currentStudentIdeaId
            });
        }
    }
};
</script>

<style scoped lang="scss">
.course-type-box {
    margin: 1.46rem 0 auto;
    width: 50rem;
    padding: 1.08rem 1.21rem;
    border-radius: 0.42rem;
    .course-tag {
        .title {
            white-space: nowrap;
            width: 8em;
            min-width: 8em;
            text-align: right;
            padding: 0.29rem 0;
        }
        .children {
            flex-wrap: wrap;
            margin-left: 2em;
            .item {
                white-space: nowrap;
                margin-left: 1.88rem;
                margin-bottom: 1.42rem;
                box-sizing: border-box;
                padding: 0.29rem 0.67rem;
                border-radius: 0.17rem;
                border: 1px solid #ffffff;
            }
            .active {
                border: 1px solid $rootColor;
            }
        }
    }
}
</style>
