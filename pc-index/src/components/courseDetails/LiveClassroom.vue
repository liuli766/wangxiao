<template>
    <el-tabs v-model="selectLiveClassroomIdData" @tab-click="clickClassroom">
        <el-tab-pane
            v-for="(classroom, index) in classrooms"
            :key="index"
            :label="classroom.name"
            :name="classroom.id"
        >
            <div
                v-if="classroom.liveChapter && classroom.liveChapter.length > 0"
                class="classroom-body yx-center al-str jf-start"
            >
                <div
                    v-for="(chapter, index) in classroom.liveChapter"
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
                            clickChapterOpen(chapter, classroom.liveChapter)
                        "
                    >
                        <div>{{ chapter.name }}</div>
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
                                class="no-data full-width xy-center f-c-666"
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
                            >
                                <div class="lecture-icon">
                                    <img
                                        class="full-width full-height"
                                        :src="
                                            coverImage(lecture.entity.videoImg)
                                        "
                                    />
                                    <!-- 直播中 -->
                                    <div
                                        v-if="
                                            lecture.entity.status === 'living'
                                        "
                                        class="player yx-center full-width full-height live-player pointer"
                                        @click.stop="
                                            clickLecture(
                                                chapter,
                                                lecture,
                                                index
                                            )
                                        "
                                    >
                                        <div class="text fontSize5 f-c-fff">
                                            {{
                                                lecture.entity.lookNumber || 0
                                            }}人正在观看
                                        </div>
                                        <div
                                            class="status f-c-fff fontSize58 xy-center"
                                            style="background-color:#FF3434"
                                        >
                                            正在直播
                                        </div>
                                    </div>
                                    <!-- 可以预约 -->
                                    <div
                                        v-if="
                                            lecture.entity.status ===
                                                'noReady' ||
                                                lecture.entity.status ===
                                                    'noPremiere'
                                        "
                                        class="player yx-center full-width full-height live-player"
                                    >
                                        <div class="text fontSize5 f-c-fff">
                                            {{
                                                lecture.entity.expectStartTime
                                            }}-{{
                                                lecture.entity.expectEndTime.split(
                                                    ":"
                                                )[2]
                                            }}
                                        </div>
                                        <div
                                            class="status f-c-fff fontSize58 xy-center pointer"
                                            style="background-color:#96C321"
                                        >
                                            预约
                                        </div>
                                    </div>
                                    <!-- 可回放 -->
                                    <div
                                        v-if="lecture.entity.videoId"
                                        class="player yx-center full-width full-height live-player"
                                    >
                                        <div class="text fontSize5 f-c-fff">
                                            {{
                                                lecture.entity.expectStartTime
                                            }}-{{
                                                lecture.entity.expectEndTime.split(
                                                    ":"
                                                )[2]
                                            }}
                                        </div>
                                        <div
                                            class="status f-c-fff fontSize58 xy-center pointer"
                                            style="background-color:#FD8923"
                                            @click.stop="
                                                clickLecture(
                                                    chapter,
                                                    lecture,
                                                    index
                                                )
                                            "
                                        >
                                            回放
                                        </div>
                                    </div>
                                </div>
                                <div class="content yx-between al-str">
                                    <div class="_title fontSize58 f-c-333">
                                        {{ lecture.name }}
                                    </div>
                                    <div class="_inc fontSize58 f-c-666">
                                        {{ lecture.lectureIntroduction }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </transition>
                </div>
            </div>
            <div v-else class="no-data fontSize58">
                该科目暂无直播课程
            </div>
        </el-tab-pane>
    </el-tabs>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from "vue-property-decorator";
import { chapterLectures, getCurriculumWatchTime } from "@/action";
import { VueComponent, JsVueBaseApi } from "@/vue";
@Component({
    mixins: [JsVueBaseApi]
})
export default class LiveClassroom extends VueComponent {
    @Prop(Array) private classrooms!: Array<any>;
    @Prop(Boolean) private courseSoldFlag!: boolean;
    @Prop(Object) private selectLecture!: Object;
    @Prop(String) private selectLiveClassroomId!: string;
    selectLiveClassroomIdData: string | null = null;

    mounted() {
        this.selectLiveClassroomIdData = this.selectLiveClassroomId;
    }

    get userLoginStatus(): boolean {
        return this.state.userLoginStatus;
    }
    @Watch("selectLiveClassroomId")
    selectLiveClassroomIdWatch(selectLiveClassroomId: string) {
        this.selectLiveClassroomIdData = selectLiveClassroomId;
    }

    @Emit()
    clickLecture(chapter: any, lecture: any, index: number) {
        return {
            chapter,
            lecture,
            index,
            type: "live",
            classroom: this.classrooms.filter(
                c => c.id === this.selectLiveClassroomIdData
            )[0]
        };
    }

    clickClassroom({ name }: { name: string }) {
        this.$emit("update:selectLiveClassroomId", name);
        this.startMemberWork();
    }
    clickChapterOpen(chapter: any, chapters: Array<any>) {
        if (!chapter.loading) {
            chapter.open = !chapter.open;
            if (chapter.open) {
                chapter.open = true;
                this.openChapter(chapter);
            }
        }
    }

    openChapter(chapter: any) {
        let addInterval = (lectures: any) => {
            // 直播的话添加人数监听
            lectures
                .filter((l: any) => l.entity.status === "living")
                .forEach((lecture: any) => {
                    // @ts-ignore
                    lecture.entity.lookNumberInterval = this.memberCount(
                        lecture.entity
                    );
                });
        };
        if (chapter.lectures) {
            addInterval(chapter.lectures);
            return;
        }
        chapter.loading = true;
        chapterLectures({
            chapterId: chapter.id,
            children: true,
            pageSize: 1000,
            currentPage: 1
        })
            .then(data => {
                chapter.lectures = data;
                addInterval(chapter.lectures);
            })
            .finally(() => {
                chapter.loading = false;
            });
    }
    clearLiveInterval() {
        (this.classrooms || []).forEach(c =>
            (c.liveChapter || []).forEach((c: any) => {
                (c.lectures || []).forEach((l: any) => {
                    if (l.entity.lookNumberInterval) {
                        clearInterval(l.entity.lookNumberInterval);
                    }
                });
            })
        );
    }
    startMemberWork() {
        (this.classrooms || [])
            .filter(c => c.id === this.selectLiveClassroomId)
            .forEach(c =>
                (c.liveChapter || []).forEach((ch: any) =>
                    (ch.lectures || []).forEach((l: any) => {
                        if (l.entity) {
                            l.entity.workCount = true;
                        }
                    })
                )
            );
        (this.classrooms || [])
            .filter(c => c.id !== this.selectLiveClassroomId)
            .forEach(c =>
                (c.liveChapter || []).forEach((ch: any) =>
                    (ch.lectures || []).forEach((l: any) => {
                        if (l.entity) {
                            l.entity.workCount = false;
                        }
                    })
                )
            );
    }
    stopMemberWork() {
        (this.classrooms || []).forEach(c =>
            (c.liveChapter || []).forEach((c: any) => {
                (c.lectures || []).forEach((l: any) => {
                    l.entity.workCount = false;
                });
            })
        );
    }
    beforeDestroy() {
        // 清除旧的直播人数监听
        this.clearLiveInterval();
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
