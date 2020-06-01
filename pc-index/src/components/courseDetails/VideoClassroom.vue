<template>
    <el-tabs v-model="selectVideoClassroomIdData" @tab-click="clickClassroom">
        <el-tab-pane
            v-for="(classroom, index) in classrooms"
            :key="index"
            :label="classroom.name"
            :name="classroom.id"
        >
            <div
                v-if="
                    classroom.videoChapter && classroom.videoChapter.length > 0
                "
                class="classroom-body yx-center al-str jf-start"
            >
                <div
                    v-for="(chapter, index) in classroom.videoChapter"
                    :key="index"
                    class="chapter-item yx-between al-str"
                >
                    <div
                        class="title fontSize67 xy-between pointer"
                        :class="{
                            'bor-top': index > 0,
                            'bor-bottom': !chapter.open
                        }"
                        @click.stop="
                            clickChapterOpen(chapter, classroom.videoChapter)
                        "
                    >
                        <div>
                            {{ chapter.name }}（共{{
                                findLectureIndex(
                                    chapter.lectures,
                                    selectLecture ? selectLecture.id : null
                                )
                            }}/{{ (chapter.lectures || []).length }}讲）
                        </div>
                        <i v-if="chapter.loading" class="el-icon-loading" />
                        <i
                            v-else
                            class="icon iconfont"
                            :class="[
                                chapter.open
                                    ? 'icon-shijiantoushang f-c-root'
                                    : 'icon-shijiantouxia close'
                            ]"
                        />
                    </div>
                    <transition
                        name="custom-classes-transition"
                        enter-active-class="animated fadeInLeft"
                        leave-active-class="animated fadeOutRight"
                    >
                        <div
                            v-if="!chapter.loading && chapter.open"
                            class="lecture-box"
                        >
                            <div
                                class="no-data full-width"
                                v-if="
                                    !chapter.lectures ||
                                        chapter.lectures.length === 0
                                "
                            >
                                暂无数据
                            </div>
                            <div
                                v-else
                                class="full-width yx-between al-star"
                            ></div>
                            <div
                                v-for="(lecture, index) in chapter.lectures"
                                :key="index"
                                class="lecture-item xy-between full-width al-str"
                                :class="{
                                    'b-c-fff':
                                        selectLecture &&
                                        selectLecture.id === lecture.id
                                }"
                                @mouseover="lecture.hoverFlag = true"
                                @mouseleave="lecture.hoverFlag = false"
                            >
                                <div
                                    class="lecture-icon pointer"
                                    @click.stop="
                                        clickLecture(
                                            chapter,
                                            lecture,
                                            index,
                                            'video',
                                            classroom
                                        )
                                    "
                                >
                                    <img
                                        class="full-width full-height"
                                        :src="
                                            coverImage(lecture.entity.coverUrl)
                                        "
                                    />
                                    <div
                                        v-if="
                                            selectLecture &&
                                                selectLecture.id === lecture.id
                                        "
                                        class="player xy-center full-width full-height"
                                    >
                                        <i
                                            class="icon iconfont icon-ziyuanldpi xy-center f-c-root"
                                        />
                                    </div>

                                    <div
                                        v-if="
                                            lecture.hoverFlag &&
                                                selectLecture &&
                                                selectLecture.id !== lecture.id
                                        "
                                        class="player xy-center full-width full-height"
                                    >
                                        <i
                                            class="icon el-icon-video-play f-c-root"
                                        />
                                    </div>
                                    <div class="time fontSize5 f-c-fff">
                                        {{
                                            time2MS(lecture.entity.duration)[0]
                                        }}:{{
                                            time2MS(lecture.entity.duration)[1]
                                        }}
                                    </div>
                                </div>
                                <div class="content yx-between al-str">
                                    <div class="_title fontSize58 f-c-333">
                                        {{ lecture.name }}
                                    </div>
                                    <div
                                        v-if="showType === 'show'"
                                        class="_inc fontSize58 f-c-666"
                                    >
                                        {{ lecture.lectureIntroduction }}
                                    </div>
                                    <div
                                        v-if="showType === 'stu'"
                                        class="fontSize58 "
                                    >
                                        <div
                                            v-if="!lecture.entity.watchTime"
                                            class="f-c-9d"
                                        >
                                            未学习
                                        </div>
                                        <div v-else class="f-c-root">
                                            上次观看：{{
                                                time2MS(
                                                    parseFloat(
                                                        lecture.entity.watchTime
                                                    )
                                                )[0]
                                            }}:{{
                                                time2MS(
                                                    parseFloat(
                                                        lecture.entity.watchTime
                                                    )
                                                )[1]
                                            }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </transition>
                </div>
            </div>
            <div v-else class="no-data fontSize58">
                该科目暂无录播课程
            </div>
        </el-tab-pane>
    </el-tabs>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from "vue-property-decorator";
import { chapterLectures, getCurriculumWatchTime } from "@/action";
import { VueComponent } from "@/vue";
@Component
export default class VideoClassroom extends VueComponent {
    @Prop(Array) private classrooms!: Array<any>;
    @Prop(Boolean) private courseSoldFlag!: boolean;
    @Prop(Object) private selectLecture!: Object;
    @Prop(Object) private initData!: any;
    @Prop(String) private selectVideoClassroomId!: string;
    @Prop({
        type: String,
        default: "show"
    })
    private showType!: "stu" | "show";
    selectVideoClassroomIdData: string | null = null;

    created() {
        this.selectVideoClassroomIdData = this.selectVideoClassroomId;
    }

    get userLoginStatus(): boolean {
        return this.state.userLoginStatus;
    }
    @Watch("selectVideoClassroomId")
    selectVideoClassroomIdWatch(selectVideoClassroomId: string) {
        this.selectVideoClassroomIdData = selectVideoClassroomId;
    }

    @Watch("initData")
    initDataWatch(initData: any) {
        if (initData.classroomId && initData.chapterId && initData.lectureId) {
            this.initDataWork(initData);
        }
    }

    @Emit()
    clickLecture(chapter: any, lecture: any, index: number) {
        return {
            chapter,
            lecture,
            index,
            type: "video",
            classroom: this.classrooms.filter(
                c => c.id === this.selectVideoClassroomIdData
            )[0]
        };
    }

    clickClassroom({ name }: { name: string }) {
        this.$emit("update:selectVideoClassroomId", name);
    }
    clickChapterOpen(chapter: any, chapters: Array<any>) {
        // console.log("clickChapterOpen2");
        if (!chapter.loading) {
            chapter.open = !chapter.open;
            // console.log("chapter:", chapter);
            if (chapter.open) {
                chapter.open = true;
                this.openChapter(chapter);
            }
        }
    }
    openChapter(chapter: any) {
        let setVideoWatchTime = (lectures: Array<any>) => {
            if (this.userLoginStatus && this.courseSoldFlag) {
                // getCurriculumWatchTime()
                lectures.forEach(l => {
                    getCurriculumWatchTime(l.entity.videoId).then(
                        r => (l.entity.watchTime = r)
                    );
                });
            }
        };
        if (chapter.lectures) {
            return;
        }
        chapter.loading = true;
        chapterLectures({
            chapterId: chapter.id,
            children: true,
            currentPage: 1,
            pageSize: 1000
        })
            .then(data => {
                chapter.lectures = data.map((lecture: any) => {
                    let titles = lecture.name.split(" ");
                    return {
                        ...lecture,
                        type: "lecture",
                        hoverFlag: false,
                        title: titles.length === 2 ? titles[0] : null,
                        info: titles.length === 2 ? titles[1] : titles[0],
                        watchTime: null
                    };
                });
                if (this.initData && this.initData.lectureId) {
                    let index = 0;
                    let selectLecture;
                    chapter.lectures.forEach((l: any, i: number) => {
                        if (l.id === this.initData.lectureId) {
                            selectLecture = l;
                            index = i;
                        }
                    });
                    if (selectLecture) {
                        this.clickLecture(chapter, selectLecture, index);
                    }
                }
                if (chapter.type === "video") {
                    setVideoWatchTime(chapter.lectures);
                }
            })
            .finally(() => {
                chapter.loading = false;
            });
    }
    initDataWork(initData: any) {
        this.clickClassroom({ name: initData.classroomId });
        let chapter = this.classrooms
            .filter(c => c.id === initData.classroomId)[0]
            .videoChapter.filter((ch: any) => ch.id === initData.chapterId)[0];
        let index = 0;
        let lecture = null;
        chapter.lectures.forEach((le: any, i: number) => {
            if (le.id === initData.lectureId) {
                lecture = le;
                index = i;
            }
        });
        this.clickLecture(chapter, lecture, index);
    }
    findLectureIndex(lectures: Array<any> = [], id: string) {
        let r = (lectures || []).map(l => l.id).indexOf(id);
        return r < 0 ? 0 : r + 1;
    }
}
</script>

<style scoped lang="scss">
.no-data {
    height: 3em;
    line-height: 3em;
    text-align: center;
    color: #999999;
}
.classroom-body {
    .bor-btn {
        border-bottom: 0.04rem solid #e6e7ea;
    }
    .bor-top {
        border-top: 0.04rem solid #e6e7ea;
    }
    .chapter-item {
        .title {
            height: 2.5rem;
            color: #9d9d9d;
            .close {
                color: #c3c3c3;
            }
        }
        .lecture-box {
            background-color: #f7f8fa;
            margin-bottom: 1rem;
            .lecture-item {
                padding: 0.7rem 0.79rem;
                border-bottom: 0.04rem solid #e6e7ea;
                border-radius: 0.08rem;
                .lecture-icon {
                    width: 7.38rem;
                    height: 4.13rem;
                    position: relative;
                    .player {
                        position: absolute;
                        left: 0;
                        top: 0;
                        background-color: rgba(0, 0, 0, 0.2);
                        .icon {
                            font-size: 2rem;
                        }
                    }
                    .time {
                        position: absolute;
                        border-radius: 0.42rem;
                        background-color: rgba(0, 0, 0, 0.8);
                        padding: 0.1em 0.38rem 0.13em;
                        left: 0.5rem;
                        bottom: 0.29rem;
                    }
                    .live-player {
                        .status {
                            min-width: 6em;
                            height: 1.08rem;
                            border-radius: 0.08rem;
                            margin-top: 0.58rem;
                        }
                    }
                }
                .content {
                    padding: 0;
                    height: 4.13rem;
                    max-height: 4.13rem;
                    margin-left: 0.75rem;
                    flex-grow: 1;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                }
            }
        }
    }
}
</style>
