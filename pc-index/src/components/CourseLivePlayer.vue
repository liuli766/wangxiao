<template>
    <div class="i-xy-between app-width al-str" style="padding-bottom:1.88rem;">
        <div class="videobox yx-between al-str">
            <Video
                ref="video"
                style="height:20.59rem;"
                :course-id="selectCourse.id"
                :lecture-id="selectLecture.id"
                :course-sold-flag="selectCourse.soldFlag"
                :direct-broadcast="selectLecture.entity"
                :auto-palyer="true"
            >
            </Video>
            <div class="live-h xy-center jf-start fontSize58">
                <div class="member ">
                    <i class="icon iconfont icon-renshu k-icon-l " />
                    {{ selectLecture.entity.lookNumber || 0 }}人在线
                </div>
                <div class="f xy-center pointer" @click="dialogVisible = true">
                    <i class="icon iconfont icon-bianji2 k-icon-l" />直播反馈
                </div>
            </div>
        </div>
        <ChatRoom
            :direct-broadcast="selectLecture.entity"
            :like-number="selectLecture.entity.likeCount"
            :user-have-like="selectLecture.entity.userLike"
            class="chat-room
                    videoright"
            @click-like="
                clickLike('live', selectLecture.entity.id, selectLecture.entity)
            "
        />
        <el-dialog
            :visible.sync="dialogVisible"
            width="28.5rem"
            :before-close="handleFeedbackClose"
            class="feedback"
        >
            <div slot="title" class="title fontSize58 f-c-333">直播反馈</div>
            <div class="body">
                <el-checkbox-group
                    v-model="checkList"
                    class="xy-between checkbox"
                >
                    <el-checkbox label="复选框 A"></el-checkbox>
                    <el-checkbox label="复选框 B"></el-checkbox>
                    <el-checkbox label="复选框 C"></el-checkbox>
                    <el-checkbox label="禁用"></el-checkbox>
                    <el-checkbox label="选中且禁用"></el-checkbox>
                </el-checkbox-group>
                <el-input
                    type="textarea"
                    :autosize="{ minRows: 4, maxRows: 6 }"
                    placeholder="请留下您宝贵的意见..."
                    v-model="feedbackInput"
                >
                </el-input>
            </div>
            <div slot="footer" class="xy-center footer">
                <el-button
                    type="primary"
                    size="mini"
                    @click="feedback"
                    :loading="flag.pushFeedbackFlag"
                    >提交</el-button
                >
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from "vue-property-decorator";
import { feedback } from "@/action";
import { VueComponent, JsVueBaseApi } from "@/vue";
import { AclSourceType } from "@/model";
import { ErrorParam } from "@/request";
import Video from "@/components/Video.vue";
import ChatRoom from "@/components/ChatRoom.vue";
@Component({
    components: {
        Video,
        ChatRoom
    },
    mixins: [JsVueBaseApi]
})
export default class CourseVideoPlayer extends VueComponent {
    @Prop(Object) private selectCourse!: any;
    @Prop(Object) private selectClassroom!: any;
    @Prop(Object) private selectChapter!: any;
    @Prop(Object) private selectLecture!: any;
    @Prop(Number) private selectLectureIndex!: any;
    flag: any = {
        pushFeedbackFlag: false
    };
    dialogVisible: boolean = false;
    feedbackInput: string | null = null;
    checkList: Array<string> = [];
    mounted() {}
    handleFeedbackClose(done: any) {
        this.$confirm("反馈还未提交，确认关闭吗", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        }).then(() => {
            done();
        });
    }
    feedback() {
        if (this.checkList.length === 0) {
            this.$message.error("请选择关键词");
            return;
        }
        if (!this.feedbackInput) {
            this.$message.error("请输入反馈内容");
            return;
        }
        this.flagPromise(
            feedback({
                content: this.feedbackInput,
                type: "live",
                typeId: this.selectCourse.entity.id
            }),
            "pushFeedbackFlag"
        ).then(() => {
            this.dialogVisible = false;
            this.$message.success("反馈成功");
            this.checkList = [];
            this.feedbackInput = null;
        });
    }
}
</script>

<style scoped lang="scss">
.videobox {
    width: 36.63rem;
    .live-h {
        background-color: #26262b;
        height: 1.67rem;
        color: #999999;
        padding-left: 0.96rem;
        .f {
            margin-left: 2.04rem;
        }
    }
}
.chat-room {
    width: 12.5rem !important;
    flex-grow: inherit;
}
</style>
<style>
.feedback .el-dialog__header {
    background-color: #f0f0f0;
}
.feedback .footer .el-button {
    padding: 0.38rem 1.92rem;
}
.feedback .body .checkbox {
    flex-wrap: wrap;
    justify-content: flex-start;
}
.feedback .body .checkbox .el-checkbox {
    width: 33.333333%;
    margin: 0.585rem 0;
}
.feedback .body .checkbox .el-checkbox .el-checkbox__inner {
    border-radius: 50%;
}
.feedback .el-dialog {
    border-radius: 0.42rem;
    overflow: hidden;
}
.feedback .el-textarea {
    margin-top: 0.7rem;
}
</style>
