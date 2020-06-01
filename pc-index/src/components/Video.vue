<template>
    <div
        class="full-width full-height video-player-body yx-center"
        v-loading="flag.videoAuth || flag.videoInit"
        element-loading-text="视频加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
    >
        <div class="full-width full-height" id="J_prismPlayer"></div>
        <div
            class="sold-help yx-center full-height full-width"
            v-show="showSoldHelp || showSoldHelp1"
        >
            <div class="title f-c-fff">{{ (lectureModel || {}).name }}</div>
            <div class="title f-c-fff" v-if="otherHelp">{{ otherHelp }}</div>
            <div
                class="pointer btn bold xy-center f-c-fff b-c-root"
                @click="clickSold"
            >
                立即购买
            </div>
        </div>
        <div
            v-if="lookPrompt && !showBar"
            class="look-prompt xy-center full-width fontSize67 f-c-fff"
        >
            此内容收费，可免费观看{{ time2MS(maxSeconds)[0] }}:{{
                time2MS(maxSeconds)[1]
            }}分钟
        </div>
        <div
            v-if="errorType"
            class="xy-center error-t f-c-fff full-height full-width"
        >
            {{ errorType }}
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Emit } from "vue-property-decorator";
import { getVideoPlayer, getVideoPlayer1, dataLog } from "@/action";
import { VueComponent } from "@/vue";
import {
    UserVideoAuthVo,
    LectureModel,
    curriculumModel,
    DirectBroadcastModel
} from "@/model";

let startWatchTime: Date | null = null;
let startInTime: Date | null = null;
let videoWtachTime: number = 0;
// 视频播放进度
let nowTime: number = 0;
// 播放实例
let playerInstance: any;
@Component
export default class Video extends VueComponent {
    @Prop(String) private lectureId!: string;
    @Prop(String) private courseId!: string;
    @Prop(Object) private curriculum!: curriculumModel;
    @Prop(Object) private directBroadcast!: DirectBroadcastModel;
    @Prop({ default: false }) private autoPalyer?: boolean;
    @Prop(Boolean) private playerStatus?: boolean;
    @Prop({ default: false }) private courseSoldFlag?: boolean;
    @Prop({ default: false }) private showSoldHelp1?: boolean;

    flag = {
        videoAuth: false,
        videoInit: false
    };
    errorType: string = "";
    // 是否显示否购买提示
    showSoldHelp: boolean = false;
    // 最大观看时长
    maxSeconds: number = 0;
    // 播放讲座
    lectureModel: LectureModel | null = null;
    // 播放凭证数据
    stsMsg?: UserVideoAuthVo;
    otherHelp: string | null = null;
    showBar: boolean = false;
    pageActive: boolean = true;
    status: "no" | "stop" | "init" | "player" | "end" = "no";
    mounted() {
        window.addEventListener("beforeunload", this.pushWatchData);
        this.playerLive(this.directBroadcast);
        this.playerVideo(this.curriculum);
    }

    @Watch("lectureId")
    lectureIdWatch(lectureId: string | null) {
        nowTime = 0;
        videoWtachTime = 0;
        this.showSoldHelp = false;
        if (playerInstance) {
            playerInstance.dispose();
        }
        if (lectureId && this.curriculum) {
            this.getVideoPlayerSts();
        }
        if (!lectureId) {
            this.stop();
        }
    }
    @Watch("playerStatus")
    playerStatusWatch(playerStatus: boolean) {
        if (playerInstance) {
            if (playerStatus === true && this.status === "stop") {
                playerInstance.play();
                startWatchTime = new Date();
            } else if (playerStatus === false && this.status === "player") {
                this.pushWatchData();
                playerInstance.pause();
            }
        }
    }
    @Watch("directBroadcast")
    directBroadcastWtach(directBroadcast: DirectBroadcastModel) {
        this.playerLive(directBroadcast);
    }

    @Watch("showSoldHelp")
    showSoldHelpWatch(showSoldHelp: boolean) {
        // 监听视频播放时长  超过6分钟时  如果处于全屏播放则退出全屏
        if (showSoldHelp === true) {
            playerInstance.fullscreenService.cancelFullScreen();
        }
    }

    @Watch("showSoldHelp1")
    showSoldHelp1Watch(showSoldHelp1: boolean) {
        // 监听视频播放时长  超过6分钟时  如果处于全屏播放则退出全屏
        // if (showSoldHelp1 === true) {
        //     playerInstance.pause();
        // } else {
        //     playerInstance.play();
        // }
    }
    get lookPrompt() {
        return !this.courseSoldFlag;
    }
    @Emit("clickSold")
    clickSold() {
        if (this.stsMsg) {
            return this.stsMsg.recommendCourseId;
        }
        return null;
    }
    @Emit("player-end")
    playerEnd() {
        return {};
    }
    playerLive(directBroadcast: DirectBroadcastModel) {
        if (directBroadcast && directBroadcast.broadUrlJson) {
            let urls: Array<any> = JSON.parse(
                directBroadcast.broadUrlJson || "[]"
            );
            let result = urls.filter(u => u.default)[0] || urls[0];
            if (result) {
                directBroadcast.playerUrl = result.url;
            }
            this.livePalyer(directBroadcast);
        }
    }
    playerVideo(curriculum: curriculumModel) {
        if (this.lectureId && curriculum) {
            this.getVideoPlayerSts();
        }
    }
    getVideoPlayerSts() {
        this.flagPromise(getVideoPlayer(this.lectureId), "videoAuth").then(
            (r: UserVideoAuthVo) => {
                this.lectureModel = r.lectureModel;
                if (this.courseSoldFlag) {
                    this.maxSeconds = r.seconds;
                } else {
                    this.maxSeconds = r.lectureModel.freeSeconds;
                }

                this.stsMsg = r;
                this.alipayer({
                    ...r,
                    ...this.curriculum
                });
            }
        );
    }
    livePalyer(directBroadcast: DirectBroadcastModel) {
        this.errorType = "";
        // 录播播放模式
        if (directBroadcast.videoId) {
            getVideoPlayer1(directBroadcast.videoId).then(
                (r: UserVideoAuthVo) => {
                    this.alipayer({
                        ...r,
                        name: directBroadcast.title,
                        coverUrl: directBroadcast.videoImg,
                        videoId: directBroadcast.videoId || "",
                        id: ""
                    });
                }
            );
        } else {
            this.flag.videoInit = true;
            // @ts-ignore
            playerInstance = new Aliplayer({
                id: "J_prismPlayer",
                width: "100%",
                height: "100%",
                autoplay: false,
                source: directBroadcast.playerUrl,
                cover: directBroadcast.videoImg,
                region: "cn-shanghai",
                isLive: true,
                controlBarVisibility: "click",
                skinLayout: false
            });
            playerInstance.on("ready", () => {
                if (this.autoPalyer) {
                    setTimeout(() => {
                        this.flag.videoInit = false;
                        if (this.pageActive) {
                            playerInstance.play();
                        }
                    }, 100);
                } else {
                    this.flag.videoInit = false;
                }
            });
            playerInstance.on("error", () => {
                this.flag.videoInit = false;
                this.errorType = "直播加载失败！！！";
            });
        }
    }
    alipayer(stsMsg: UserVideoAuthVo & curriculumModel) {
        this.errorType = "";
        this.status = "init";
        this.flag.videoInit = true;
        // @ts-ignore
        playerInstance = new Aliplayer({
            id: "J_prismPlayer",
            width: "100%",
            height: "100%",
            cover: stsMsg.coverUrl,
            encryptType: 1, // 当播放私有加密流时需要设置。
            // 播放方式四：使用STS方式播放
            vid: stsMsg.videoId,
            accessKeyId: stsMsg.accessKeyId,
            securityToken: stsMsg.securityToken,
            accessKeySecret: stsMsg.accessKeySecret,
            region: "cn-shanghai",
            isLive: false,
            autoplay: false,
            showBarTime: "5000",
            definition: "FD,LD,SD",
            defaultDefinition: "FD",
            controlBarVisibility: "hover"
        });
        playerInstance.on("timeupdate", this.timeupdate);
        playerInstance.on("error", this.playError);
        playerInstance.on("ended", this.ended);
        playerInstance.on("showBar", () => {
            this.showBar = true;
        });
        playerInstance.on("hideBar", () => {
            this.showBar = false;
        });
        playerInstance.on("play", () => {
            startWatchTime = new Date();
            this.status = "player";
        });

        playerInstance.on("pause", () => {
            this.status = "stop";
            if (startWatchTime) {
                videoWtachTime +=
                    new Date().getTime() - startWatchTime.getTime();
                startWatchTime = null;
            }
        });

        playerInstance.on("ready", () => {
            playerInstance.seek(nowTime);
            if (this.autoPalyer) {
                setTimeout(() => {
                    this.flag.videoInit = false;
                    if (this.pageActive) {
                        playerInstance.play();
                    }
                    startWatchTime = new Date();
                }, 100);
            } else {
                this.flag.videoInit = false;
            }
            if (this.courseSoldFlag && stsMsg.watchTime) {
                this.$message("已为您跟进上次观看进度");
                playerInstance.seek(parseFloat(stsMsg.watchTime || "0"));
            }
        });
        startInTime = new Date();
    }
    // 视频播放进度事件
    timeupdate() {
        let maxSeconds: number = this.maxSeconds;
        nowTime = playerInstance.getCurrentTime();
        if (maxSeconds < nowTime) {
            // 不允许播放
            // 暂停播放
            playerInstance.pause();
            // 回调到允许播放的位置
            playerInstance.seek(maxSeconds);
            // 显示购买提示
            this.showSoldHelp = true;
            this.otherHelp = "免费观看时长已结束";
        }
    }
    // 视频播放错误
    playError(error: any) {
        // 凭证过期
        // console.log("error:", error);
        if (error.code === 4002) {
            this.getVideoPlayerSts();
        } else {
            this.errorType = "视频播放异常，请重试！！！";
        }
    }
    // 视频播放结束

    ended() {
        this.status = "end";
        // 免费视频提示购买课程
        if (this.lectureModel && this.lectureModel.isFree) {
            this.showSoldHelp = true;
        }
        this.playerEnd();
    }
    pushWatchData() {
        if (this.curriculum && this.courseSoldFlag) {
            this.curriculum.watchTime = nowTime + "";
            if (startWatchTime) {
                videoWtachTime +=
                    new Date().getTime() - startWatchTime.getTime();
                startWatchTime = null;
            }
            let data: {
                [key: string]: any;
            } = {
                activeType: "player",
                activeSourceType: "video",
                activeSourceId: this.curriculum.videoId,
                topSourceType: "course",
                topSourceId: this.courseId,
                watchTime: this.curriculum.watchTime,
                // @ts-ignore
                actionStartTime: startInTime.Format("yyyy-MM-dd HH:mm:ss"),
                // @ts-ignore
                actionEndTime: new Date().Format("yyyy-MM-dd HH:mm:ss"),
                remark: videoWtachTime
            };
            var fd = new FormData();
            for (let key in data) {
                fd.append(key, data[key]);
            }
            navigator.sendBeacon("/api/v3/api/sys/dbp/study/log", fd);
        }
    }
    stop() {
        if (playerInstance) {
            this.pushWatchData();
            playerInstance.pause();
        }
    }

    beforeDestroy() {
        this.pageActive = false;
        this.pushWatchData();
        window.removeEventListener("beforeunload", e => this.pushWatchData);
    }
}
</script>

<style scoped lang="scss">
.video-player-body {
    position: relative;
    #J_prismPlayer {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 0;
    }
    .sold-help {
        z-index: 2;
        background-color: rgba(0, 0, 0, 0.6);
        .title {
            font-size: 0.75rem;
            margin-bottom: 0.75rem;
        }
        .btn {
            font-size: 0.67rem;
            width: 8.33rem;
            height: 1.83rem;
            border-radius: 0.08rem;
        }
    }
    .look-prompt {
        z-index: 1;
        background-color: rgba(0, 0, 0, 0.4);
        position: absolute;
        left: 0;
        bottom: 0;
        height: 3em;
    }
    .error-t {
        z-index: 1;
        background-color: #000;
        position: absolute;
        top: 0;
        left: 0;
    }
}
</style>
