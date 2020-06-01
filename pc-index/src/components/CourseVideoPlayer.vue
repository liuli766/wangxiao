<template>
    <div class="i-xy-between app-width al-str" style="padding-bottom:1.88rem;">
        <div class="videobox yx-between al-str">
            <div class="yx-between al-st jf-start full-width">
                <Video
                    ref="video"
                    style="height:20.59rem;"
                    :course-id="selectCourse.id"
                    :lecture-id="selectLecture.id"
                    :course-sold-flag="selectCourse.soldFlag"
                    :curriculum="selectLecture.entity"
                    :auto-palyer="true"
                    @player-end="playerEnd"
                    @clickSold="clickSold"
                >
                </Video>
                <div
                    class="collect pointer xy-center jf-start fontSize58 full-width"
                    :class="{
                        'f-c-root': selectLecture.userCollection
                    }"
                    @click="
                        clickCollection(
                            'lecture',
                            selectLecture.id,
                            selectLecture
                        )
                    "
                >
                    <i
                        class="icon iconfont fontSize5"
                        :class="[
                            selectLecture.userCollection
                                ? 'icon-shoucang'
                                : 'icon-shoucang1'
                        ]"
                    />
                    <div class="text">
                        {{ selectLecture.userCollection ? "已收藏" : "收藏" }}
                    </div>
                </div>
            </div>
            <!-- swiper -->
            <div class="video-swiper-container swiper-container">
                <div class="swiper-wrapper swiper">
                    <div
                        v-for="(item, index) in showLectures"
                        :key="index"
                        style="width: 10.54rem;height:4.17rem;"
                        class="swiper-slide f-c-fff xy-center yx-center pointer"
                        :class="{
                            active: selectLecture.id === item.id
                        }"
                    >
                        <div
                            class="full-width full-height item yx-center"
                            @click.stop="
                                clickLecture(selectChapter, item, index)
                            "
                        >
                            <div class="fontSize67 title">
                                {{ item.title }}
                            </div>
                            <div class="fontSize58 info">
                                {{ item.info }}
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Add Arrows -->
                <div
                    class="swiper-button video-swiper-button-next swiper-button-next xy-center"
                    slot="button-next"
                    style="width:1.25rem;height:2rem;background:#000;"
                >
                    <span class="icon iconfont icon-arrow"></span>
                </div>
                <div
                    class="swiper-button video-swiper-button-prev swiper-button-prev xy-center"
                    slot="button-prev"
                    style="width:1.25rem;height:2rem;background:#000;"
                >
                    <span class="icon iconfont icon-jiantou3"></span>
                </div>
            </div>
        </div>
        <div class="videoright video-classroom-box">
            <div
                v-for="(classroom, index) in selectCourse.classrooms || []"
                :key="index"
                class="classroom yx-between al-str"
            >
                <div
                    v-for="(chapter, index) in classroom.videoChapter || []"
                    :key="index"
                    class="chapter yx-between al-str jf-start"
                >
                    <div
                        class="xy-between fontSize67 title-box pad pointer"
                        :class="[chapter.open ? 'f-c-fff' : 'f-c-9d']"
                        @click="
                            clickChapterOpen(chapter, classroom.videoChapter)
                        "
                    >
                        <div class="chapter-title one-wrap">
                            {{ classroom.name }}-{{ chapter.name }}（共{{
                                findLectureIndex(
                                    chapter.lectures,
                                    selectLecture.id
                                )
                            }}/{{ (chapter.lectures || []).length }}讲）
                        </div>
                        <i v-if="chapter.loading" class="el-icon-loading" />
                        <i
                            v-else
                            class="icon iconfont"
                            :class="[
                                chapter.open
                                    ? 'icon-shijiantoushang f-c-fff'
                                    : 'icon-shijiantouxia close'
                            ]"
                        />
                    </div>
                    <div
                        v-show="chapter.open"
                        v-for="(lecture, index) in chapter.lectures"
                        :key="index"
                        :id="lecture.id"
                        class="lecture xy-between pointer al-str pointer"
                        :class="[
                            lecture.id === selectLecture.id
                                ? 'f-c-fff active'
                                : 'f-c-d6d'
                        ]"
                        @click="clickLecture(chapter, lecture, index)"
                    >
                        <img
                            :src="coverImage(lecture.entity.coverUrl)"
                            class="cover"
                        />
                        <div class="content-box yx-between al-str">
                            <div class="fontSize58">
                                {{ lecture.name }}
                            </div>
                            <div class="fontSize5 f-c-666">
                                {{ parseInt(lecture.entity.duration / 60) }}分{{
                                    parseInt(lecture.entity.duration % 60)
                                }}秒
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from "vue-property-decorator";
import {} from "@/action";
import { VueComponent, JsVueBaseApi } from "@/vue";
import { AclSourceType } from "@/model";
import { ErrorParam } from "@/request";
import Video from "@/components/Video.vue";
let videSwiper: any;
@Component({
    components: {
        Video
    },
    mixins: [JsVueBaseApi]
})
export default class CourseVideoPlayer extends VueComponent {
    @Prop(Object) private selectCourse!: any;
    @Prop(Object) private selectClassroom!: any;
    @Prop(Object) private selectChapter!: any;
    @Prop(Object) private selectLecture!: any;
    @Prop(Number) private selectLectureIndex!: any;
    showLectures: Array<any> = [];
    mounted() {
        videSwiper = null;
        this.selectChapterWatch(this.selectChapter);
    }
    @Watch("selectChapter")
    selectChapterWatch(selectChapter: any) {
        this.showLectures = selectChapter.lectures;
        let that = this;
        if (!videSwiper) {
            // @ts-ignore
            videSwiper = new Swiper(".swiper-container", {
                autoplay: false,
                observer: true,
                slidesPerView: 4,
                centeredSlidesBounds: true,
                observeSlideChildren: true,
                navigation: {
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev"
                },
                on: {
                    init: function() {
                        setTimeout(() => {
                            videSwiper.slideToLoop(that.selectLectureIndex);
                        }, 10);
                    }
                }
            });
        } else {
            setTimeout(() => {
                videSwiper.update();
                videSwiper.slideToLoop(that.selectLectureIndex);
            }, 10);
        }
    }
    @Watch("selectLectureIndex")
    selectLectureIndexWatch(selectLectureIndex: number) {
        videSwiper.slideToLoop(selectLectureIndex);
    }

    @Emit()
    clickChapterOpen(chapter: any, chapters: any) {
        return { chapter, chapters };
    }

    @Emit("clickSold")
    clickSold() {
        return null;
    }

    @Emit()
    clickLecture(chapter: any, lecture: any, index: number) {
        videSwiper.slideToLoop(index);
        // @ts-ignore
        this.$refs.video.pushWatchData();
        return {
            chapter,
            lecture,
            index,
            type: "video"
        };
    }
    playerEnd() {
        let index = this.selectLectureIndex + 1;
        if (index < this.showLectures.length) {
            this.clickLecture(null, this.showLectures[index], index);
        } else {
            for (
                let i = 0;
                i < this.selectClassroom.videoChapter.length - 1;
                i++
            ) {
                if (
                    this.selectClassroom.videoChapter[i].id ===
                    this.selectChapter.id
                ) {
                    let c = this.selectClassroom.videoChapter;
                    this.clickLecture(c[i + 1], null, 0);
                    break;
                }
            }
        }
    }

    findLectureIndex(lectures: Array<any> = [], id: string) {
        let r = (lectures || []).map(l => l.id).indexOf(id);
        return r < 0 ? 1 : r + 1;
    }
}
</script>

<style scoped lang="scss">
.chapter:after,
.video-classroom-box:after,
.app-width:after {
    content: "";
    display: block;
    clear: both;
    height: 0;
    overflow: hidden;
    visibility: hidden;
}
.videobox {
    width: 36.63rem;
    .collect {
        padding: 0.54rem 0 0.54rem 0.96rem;
        background: #26262b;
        color: #999999;
        .text {
            margin-left: 0.29rem;
        }
    }
    .video-swiper-container {
        width: 36.63rem;
        margin-top: 0.83rem;
    }
    .swiper {
        .swiper-slide {
            width: 8.45rem !important;
            max-width: 8.54ren !important;
            margin-right: 0.7rem;
            background-color: #26262b;
            border-radius: 0.25rem;
            .item {
                padding: 0.79rem 0.96rem;
            }
            .info {
                text-align: center;
            }
        }
        .swiper-slide.active {
            color: #ffffff;
            background-color: #434446;
        }
    }
}

.video-classroom-box {
    flex-grow: 1;
    background-color: #333333;
    max-height: 27.51rem;
    overflow-y: auto;
    border-radius: 0.08rem;
    .pad {
        padding: 0 0.75rem;
    }
    .chapter {
        .title-box {
            height: 2.24rem;
            border-bottom: 0.04rem solid #4a4a4a;
        }
        .lecture {
            padding: 0.5rem;
            min-height: 3.67rem;
            .cover {
                width: 3.67rem;
                height: 2rem;
                min-width: 3.67rem;
            }
            .content-box {
                flex-grow: 1;
                margin-left: 0.71rem;
                height: 2rem;
            }
        }
        .lecture:hover {
            background-color: #666666;
        }
        .lecture.active {
            background-color: #252525;
        }
    }
}
.swiper-button {
    color: #ffffff;
}
</style>
