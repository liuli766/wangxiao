<template>
    <div
        class="chat-room full-width yx-center jf-start al-str f-c-fff fontSize58"
    >
        <div class="fontSize67 title xy-center jf-start content-box">
            {{ (directBroadcast || {}).chatRoomName }}（{{ currentNumber }}人）
        </div>
        <div class="line full-width"></div>
        <div class="chat-box" ref="chatBox">
            <div
                v-for="(message, index) in chatHistory"
                :key="index"
                class="chat-box-item xy-center jf-start"
            >
                <img :src="message.avatar" class="header" />
                <div class="content">
                    <span class="nickname">{{ message.senderName }}：</span>
                    {{ message.content }}
                </div>
            </div>
        </div>
        <div class="input-box xy-between">
            <div class="like f-c-root yx-center">
                <div class="pointer" @click="clickLike">
                    <span
                        :class="{
                            'iconfont icon-dianzan': userHaveLike,
                            'iconfont icon-dianzan1': !userHaveLike
                        }"
                    ></span>
                </div>
                <div>{{ likeNumber || directBroadcast.likeCount }}</div>
            </div>
            <input
                class="input f-c-fff"
                placeholder="说点什么吧~"
                v-model="chatInput"
                v-on:keyup.enter="sendMessage"
            />
            <div class="btn1 b-c-root xy-center pointer" @click="sendMessage">
                <span v-show="messageSendFlag" class="el-icon-loading"></span
                >发送
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Emit } from "vue-property-decorator";
import { userImType } from "@/action";
import { VueComponent } from "@/vue";
import { DirectBroadcastModel } from "@/model";
import { IM, ImMessage } from "@/im";
import { tokenData } from "@/request";
@Component
export default class ChatRoom extends VueComponent {
    @Prop(Object) directBroadcast!: DirectBroadcastModel;
    @Prop(Boolean) userHaveLike!: boolean;
    @Prop({ type: Number, default: 0 }) likeNumber!: number;
    imInstance!: IM;
    currentNumber: number = 0;
    chatHistory: Array<ImMessage> = [];
    chatInput: string | null = "";
    messageSendFlag: boolean = false;
    websocket!: WebSocket;
    created() {
        // @ts-ignore
        this.imInstance = this.state.imInstance;
    }
    mounted() {
        window.addEventListener("beforeunload", this.leaveRoom);
        if (this.directBroadcast && this.imInstance) {
            this.registerRoomMessageListener();
        }
    }
    @Watch("state.imInstance")
    imInstanceWatch(imInstance: IM | null) {
        if (imInstance && this.directBroadcast) {
            this.imInstance = imInstance;
            this.registerRoomMessageListener();
        }
    }
    @Watch("directBroadcast")
    directBroadcastWatch(directBroadcast: DirectBroadcastModel) {
        if (directBroadcast && this.imInstance) {
            this.registerRoomMessageListener();
        }
    }
    // 点赞按钮
    @Emit("click-like")
    clickLike() {
        return this.directBroadcast.id;
    }
    // 注册消息监听器
    async registerRoomMessageListener() {
        await this.imInstance.enterChatroom(this.directBroadcast.chatRoomId);
        this.imInstance.registerListener(
            "room",
            parseInt(this.directBroadcast.chatRoomId),
            (message: ImMessage) => {
                this.pushMessage(message);
            }
        );
        let token = tokenData.token || "";
        let sessionId = this.$cookies.get("session-id");
        // 连接websocket
        this.websocket = new WebSocket(
            `${this.state.websocketUrl}/v3/live-number/${this.directBroadcast.id}`,
            [token, sessionId]
        );
        this.websocket.onmessage = (e: any) => {
            this.currentNumber = e.data;
        };
    }
    pushMessage(message: ImMessage) {
        this.chatHistory.push(message);
        setTimeout(() => {
            // @ts-ignore
            this.$refs.chatBox.scrollTop = this.$refs.chatBox.scrollHeight;
        }, 10);
    }
    async sendMessage() {
        if (this.chatInput && !this.messageSendFlag) {
            this.messageSendFlag = true;
            try {
                let message = await this.imInstance.sendMessage({
                    content: this.chatInput,
                    chatType: "text",
                    type: "room",
                    receive: this.directBroadcast.chatRoomId
                });
                this.pushMessage(message);
                this.chatInput = null;
            } catch (error) {}
            this.messageSendFlag = false;
        }
    }

    leaveRoom() {
        if (this.imInstance && this.directBroadcast) {
            this.imInstance.exitChatroom(this.directBroadcast.chatRoomId);
        }
        if (this.websocket) {
            this.websocket.close();
        }
    }
    beforeDestroy() {
        this.leaveRoom();
        window.removeEventListener("beforeunload", e => this.leaveRoom);
    }
}
</script>

<style scoped lang="scss">
.chat-room {
    background-color: #333333;
    border-radius: 0.08rem;
    width: 13.33rem;
    .content-box {
        padding: 0 0.67rem;
        border-bottom: 1px solid #4b4a4d;
    }
    .line {
        height: 0.04rem;
        background-color: #4a4a4a;
    }
    .title {
        height: 2.29rem;
        min-height: 2.29rem;
    }
    .chat-box {
        padding: 0 0.83rem 1rem;
        flex-grow: 1;
        overflow-y: auto;
        .chat-box-item {
            margin-top: 0.54rem;
            .header {
                height: 1.5rem;
                width: 1.5rem;
                min-width: 1.5rem;
                min-height: 1.5rem;
                border-radius: 50%;
                overflow: hidden;
                align-self: flex-start;
            }
            .content {
                margin-left: 0.63rem;
                line-height: 1.35rem;
                flex-flow: 1;
                .nickname {
                    color: #9b9b9b;
                }
            }
        }
    }
    .chat-box::-webkit-scrollbar {
        width: 0;
    }
    .input-box {
        height: 2.33rem;
        background-color: #4e4e4e;
        padding: 0.54rem 0.79rem;
        .like {
            .icon-dianzan1 {
                color: #9b9b9b;
            }
        }
        .input {
            height: 1.25rem;
            padding: 0 0.5rem;
            flex-grow: 1;
            margin: 0 0.5rem;
            background-color: #666666;
            width: 7.5rem;
        }
        .btn1 {
            height: 1.25rem;
            width: 2.08rem;
        }
    }
}
</style>
