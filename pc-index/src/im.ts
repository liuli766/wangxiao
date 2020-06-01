import { get } from "@/request";
import { SystemComponent } from "./vue";
export interface JgUserInfo {
    username: string;
    password: string;
}
export interface JGConfig {
    appkey: string;
    signature: string;
    timestamp: number;
    // eslint-disable-next-line camelcase
    random_str: string;
}
export type IMRule = "group" | "friend" | "room";
export type UserImType =
    | "member"
    | "admin"
    | "teacher"
    | "ta"
    | "agent"
    | "tourists";
interface IMItem {
    [key: string]: any;
    type?: IMRule;
}
interface IMF {
    [key: string]: IMItem;
}
export interface ImMessage {
    avatar?: string | null;
    userImType?: UserImType;
    senderId?: string | number;
    messageSenderId?: string | number;
    time?: number;
    senderName?: string;
    receive?: string;
    // eslint-disable-next-line camelcase
    target_rid?: any;
    // eslint-disable-next-line camelcase
    target_username?: string;
    // eslint-disable-next-line camelcase
    target_nickname?: string;
    receiveName?: string;
    content: any;
    type: IMRule;
    extras?: any;
    imageUrl?: string;
    message?: any;
    chatType?: "file" | "image" | "text";
}
export interface ImListenerCallback {
    (message: ImMessage): void;
}
export type ImListener = {
    rule: IMRule;
    id: string | number;
    callback: ImListenerCallback;
};
export abstract class SendMessageHandler {
    jim: any;
    constructor(jim: any) {
        this.jim = jim;
    }
    abstract canHandler(message: ImMessage): boolean;
    abstract sendBase(message: ImMessage): Promise<ImMessage>;
    abstract sendPic(message: ImMessage): Promise<ImMessage>;
    work(message: ImMessage): Promise<ImMessage> {
        if (message.chatType === "file" || message.chatType === "image") {
            return this.sendPic(message);
        }
        return this.sendBase(message);
    }
}
export class IM extends SystemComponent {
    constructor(userInfo: JgUserInfo, extras: any) {
        super();
        // 初始化极光
        this.jgUserInfo = userInfo;
        this.extras = extras;
    }
    jgUserInfo: JgUserInfo;
    config: JGConfig | null = null;
    JIM: any = null;
    jimStatus: "init" | "error" | "online" | "offline" | null = null;
    // 群组
    groups: IMF = {};
    friends: IMF = {};
    rooms: IMF = {};
    listenerList: Array<ImListener> = [];
    member: any;
    extras: any = {};
    sendMessageHandlers: Array<SendMessageHandler> = [];
    public registerListener(
        rule: IMRule,
        id: string | number,
        callback: ImListenerCallback
    ) {
        console.log("添加监听器:", {
            rule,
            id
        });
        this.listenerList.push({
            rule,
            id,
            callback
        });
    }
    async initJGIM() {
        return new Promise((resolve, reject) => {
            // @ts-ignore
            this.JIM = new JMessage({ debug: false });
            this.JIM.onDisconnect(this.handleJGOnDisconnect);
            this.jimStatus = "init";
            get("/v3/api/sys/conf/jg/init-sign")
                .then((config: JGConfig) => {
                    this.config = config;
                    this.JIM.init({
                        ...config,
                        flag: 0
                    })
                        .onSuccess(async () => {
                            await this.jgLogin();
                            resolve();
                        })
                        .onFail((error: any) => {
                            console.error(error);
                            this.jimStatus = "error";
                            reject(error);
                        });
                })
                .catch(e => {
                    reject(e);
                });
        });
    }
    async jgLogin() {
        return new Promise((resolve, reject) => {
            this.JIM.login({
                username: this.jgUserInfo.username,
                password: this.jgUserInfo.password
            })
                .onSuccess(async (data: any) => {
                    console.debug("loginData:", data);
                    this.jimStatus = "online";
                    await this.initData();
                    await this.initListener();
                    resolve();
                })
                .onFail((error: any) => {
                    console.error(error);
                    this.jimStatus = "error";
                    reject(error);
                });
        });
    }
    // 极光断线
    handleJGOnDisconnect() {
        console.log("handleJGOnDisconnect");
        this.jimStatus = "offline";
    }
    // 初始化数据
    async initData() {
        return Promise.all([
            this.getMemberMessage(),
            this.jgGetGroups(),
            this.jgGetFriendList(),
            this.jgGetSelfChatrooms()
        ]);
    }
    // 获取自身信息
    async getMemberMessage() {
        return new Promise(resolve => {
            this.JIM.getUserInfo({
                username: this.jgUserInfo.username,
                appkey: (this.config || { appkey: null }).appkey
            })
                .onSuccess((data: any) => {
                    // eslint-disable-next-line camelcase
                    let { user_info } = data;
                    this.member = {
                        nickname: user_info.nickname,
                        avatar: this.coverImage(user_info.avatar),
                        id: user_info.username
                    };
                    resolve();
                })
                .onFail((error: any) => {
                    console.error(error);
                    resolve();
                });
        });
    }
    // 初始化监听器
    async initListener() {
        this.registerSendHandler(new GroupSendHandler(this.JIM));
        this.registerSendHandler(new RoomSendHandler(this.JIM));
        this.registerSendHandler(new FriendSendHandler(this.JIM));
        this.jgGetConversation();
        this.jgOnMsgReceive();
    }
    registerSendHandler(handler: SendMessageHandler) {
        this.sendMessageHandlers.push(handler);
    }
    // 加入聊天室
    public async enterChatroom(id: string) {
        return new Promise((resolve, reject) => {
            this.JIM.enterChatroom({
                id: parseInt(id)
            })
                .onSuccess(function(data: any) {
                    resolve(data);
                })
                .onFail(function(data: any) {
                    if (data.code === 881507) {
                        resolve(data);
                    } else {
                        reject(data);
                    }
                });
        });
    }
    // 退出聊天室
    public async exitChatroom(id: string | number) {
        return new Promise((resolve, reject) => {
            this.JIM.exitChatroom({
                id
            })
                .onSuccess(function(data: any) {
                    resolve(data);
                })
                .onFail(function(data: any) {
                    reject(data);
                });
        });
    }
    // 初始化群列表
    async jgGetGroups() {
        return new Promise(resolve => {
            this.JIM.getGroups()
                .onSuccess((data: any) => {
                    let groups: IMF = {};
                    data.group_list.forEach((group: any) => {
                        groups[group.gid] = {
                            type: "group",
                            groupName: group.name,
                            nickname: group.name,
                            id: group.gid,
                            avatar: this.coverImage(group.avatar),
                            list: []
                        };
                        this.JIM.getGroupMembers({
                            gid: group.gid
                        })
                            .onSuccess((data: any) => {
                                let list: any[] = [];
                                data.member_list.forEach((member: any) => {
                                    list.push({
                                        nickname: member.nickName,
                                        id: member.username,
                                        flag: member.flag,
                                        keepSilence: member.keep_silence,
                                        avatar: this.coverImage(member.avatar)
                                    });
                                });
                                groups[group.gid].list = list;
                            })
                            .onFail((error: any) => {
                                console.error(error);
                            });
                    });
                    this.groups = groups;
                    resolve();
                })
                .onFail((error: any) => {
                    console.error(error);
                    resolve();
                });
        });
    }
    // 获取好友
    async jgGetFriendList() {
        return new Promise(resolve => {
            this.JIM.getFriendList()
                .onSuccess((data: any) => {
                    let friends: IMF = {};
                    data.friend_list.forEach((friend: any) => {
                        friends[friend.username] = {
                            type: "friend",
                            username: friend.nickName,
                            nickname: friend.nickName,
                            id: friend.username,
                            avatar: this.coverImage(friend.avatar)
                        };
                    });
                    this.friends = friends;
                    resolve();
                })
                .onFail((error: any) => {
                    console.error(error);
                    resolve();
                });
        });
    }
    // 获取聊天室
    async jgGetSelfChatrooms() {
        return new Promise(resolve => {
            this.JIM.getSelfChatrooms()
                .onSuccess((data: any) => {
                    let messageRoom: IMF = {};
                    data.chat_rooms.forEach((room: any) => {
                        messageRoom[room.id] = {
                            nickname: room.name,
                            id: room.id,
                            type: "room",
                            avatar: null,
                            totalMemberCount: room.total_member_count,
                            maxMemberCount: room.max_member_count
                        };
                    });
                    this.rooms = messageRoom;
                    resolve();
                })
                .onFail((error: any) => {
                    console.error(error);
                    resolve();
                });
        });
    }
    // 获取离线消息
    jgGetConversation() {
        this.JIM.getConversation().onSuccess((data: any) => {
            let { conversations } = data;
            let messageMembers = {};
            // conversations.forEach((c:any) => {
            // if (c.type === 3) {
            //         if (!this.state.friends[c.username]) {
            //             this.addfriends({
            //                 nickname: c.nickName,
            //                 avatar: window.top.systemImageConvert(
            //                     c.avatar || this.state.defaultAvatar
            //                 ),
            //                 id: c.username
            //             });
            //         }
            //     }
            //     if (c.type === 4) {
            //         if (!this.state.groups[c.gid]) {
            //             this.addGroup({
            //                 groupName: c.name,
            //                 nickname: c.name,
            //                 avatar: window.top.systemImageConvert(
            //                     c.avatar || this.state.defaultAvatar
            //                 ),
            //                 id: c.gid
            //             });
            //         }
            //     }
            //     messageMembers[c.username || c.gid] = {
            //         id: c.username || c.gid,
            //         show: true,
            //         type: {
            //             3: "friend",
            //             4: "group"
            //         }[c.type],
            //         history: {
            //             size: 20,
            //             total: 0,
            //             records: []
            //         }
            //     };
            // });
            // this.state.messageMembers = {
            //     ...messageMembers,
            //     ...this.state.messageMembers
            // };
        });
    }
    // 消息监听
    jgOnMsgReceive() {
        this.JIM.onMsgReceive((data: any) => {
            data.messages.forEach((message: any) => {
                let extras = message.content.msg_body.extras;
                let sender;
                if (message.msg_type === 4) {
                    sender = this.groups[message.from_gid];
                } else {
                    sender = this.friends[message.from_username] || {
                        nickname: extras.nickname,
                        id: message.from_username,
                        avatar: this.coverImage(extras.headerUrl)
                    };
                }
                this.receiveMessage({
                    avatar: this.coverImage(extras.headerUrl || sender.avatar),
                    userImType: extras.userImType,
                    senderId: message.content.from_id,
                    messageSenderId: sender.id,
                    time: message.ctime_ms,
                    senderName: sender.nickname || sender.groupName,
                    content: message.content.msg_body.text,
                    // @ts-ignore
                    type: {
                        3: "friend",
                        4: "group"
                    }[message.msg_type],
                    extras,
                    message
                });
            });
        });
        this.JIM.onRoomMsg(async (data: any) => {
            let extras = data.content.msg_body.extras;
            this.receiveMessage({
                senderId: data.room_id,
                messageSenderId: data.content.from_id,
                senderName: extras.nickname,
                content: data.content.msg_body.text,
                time: data.ctime_ms,
                type: "room",
                avatar: this.coverImage(extras.headerUrl),
                userImType: extras.userImType,
                extras,
                message: data
            });
        });
    }
    async getResource(mediaId: any): Promise<string> {
        return new Promise((resolve, reject) => {
            this.JIM.getResource({
                media_id: mediaId
            })
                .onSuccess(function(data: any) {
                    resolve(data.url);
                })
                .onFail(function(data: any) {
                    reject(data);
                });
        });
    }

    receiveMessage(message: ImMessage) {
        // console.log("message:", message);
        this.listenerList
            .filter((listener: ImListener) => {
                return (
                    listener.rule === message.type &&
                    message.senderId === listener.id
                );
            })
            .forEach(async (listener: ImListener) => {
                try {
                    if (
                        message.message &&
                        message.message.content.msg_type === "image"
                    ) {
                        message.imageUrl = await this.getResource(
                            message.content.msg_body.media_id
                        );
                    }
                    listener.callback(message);
                } catch (error) {
                    console.error(error);
                }
            });
    }
    // 发送消息
    async sendMessage(message: ImMessage): Promise<ImMessage> {
        message = {
            senderId: this.member.id,
            messageSenderId: this.member.id,
            senderName: this.extras.nickname,
            userImType: this.extras.userImType,
            time: new Date().getTime(),
            extras: {
                ...this.extras,
                ...(message.extras || {})
            },
            avatar: this.coverImage(this.extras.headerUrl),
            message,
            ...message
        };
        return Promise.all(
            this.sendMessageHandlers
                .filter((handler: SendMessageHandler) =>
                    handler.canHandler(message)
                )
                .map((handler: SendMessageHandler) => handler.work(message))
        ).then(() => {
            return message;
        });
    }
}
class GroupSendHandler extends SendMessageHandler {
    // eslint-disable-next-line no-useless-constructor
    constructor(jim: any) {
        super(jim);
    }
    canHandler(message: ImMessage): boolean {
        return message.type === "group";
    }

    work(message: ImMessage): Promise<ImMessage> {
        message.target_rid = message.receive;
        return super.work(message);
    }

    sendPic(message: ImMessage): Promise<any> {
        return new Promise((resolve, reject) => {
            let fd = new FormData();
            fd.append("fileName", message.content);
            this.jim
                .sendGroupPic({
                    ...message,
                    image: fd
                })
                .onSuccess(function(data: any) {
                    resolve({
                        ...data,
                        content: "",
                        msg_id: data.msg_id
                    });
                })
                .onFail(function(data: any) {
                    reject(data);
                });
        });
    }
    sendBase(message: ImMessage): Promise<any> {
        return new Promise((resolve, reject) => {
            this.jim
                .sendGroupMsg(message)
                .onSuccess((data: any, msg: any) => {
                    resolve({
                        ...data,
                        msg_id: data.msg_id
                    });
                })
                .onFail(function(data: any) {
                    reject(message);
                });
        });
    }
}
class RoomSendHandler extends SendMessageHandler {
    // eslint-disable-next-line no-useless-constructor
    constructor(jim: any) {
        super(jim);
    }
    canHandler(message: ImMessage): boolean {
        return message.type === "room";
    }
    work(message: ImMessage): Promise<ImMessage> {
        message.target_rid = parseInt(message.receive || "0");
        console.log("发送聊天室消息:", message);
        return super.work(message);
    }
    sendBase(message: ImMessage): Promise<any> {
        return new Promise((resolve, reject) => {
            this.jim
                .sendChatroomMsg(message)
                .onSuccess((data: any, msg: any) => {
                    resolve({
                        ...data,
                        msg_id: data.msg_id
                    });
                })
                .onFail(function(data: any) {
                    reject(data);
                });
        });
    }
    sendPic(message: ImMessage): Promise<ImMessage> {
        return Promise.resolve(message);
    }
}
class FriendSendHandler extends SendMessageHandler {
    // eslint-disable-next-line no-useless-constructor
    constructor(jim: any) {
        super(jim);
    }
    canHandler(message: ImMessage): boolean {
        return message.type === "friend";
    }
    work(message: ImMessage): Promise<ImMessage> {
        message.target_username = message.receive;
        message.target_nickname = message.receiveName;
        return super.work(message);
    }
    sendBase(message: ImMessage): Promise<any> {
        return new Promise((resolve, reject) => {
            this.jim
                .sendSingleMsg(message)
                .onSuccess((data: any, msg: any) => {
                    resolve({
                        ...data,
                        msg_id: data.msg_id
                    });
                })
                .onFail(function(data: any) {
                    reject(data);
                });
        });
    }
    sendPic(message: ImMessage): Promise<any> {
        return new Promise((resolve, reject) => {
            let fd = new FormData();
            fd.append("fileName", message.content);
            this.jim
                .sendSinglePic({
                    ...message,
                    image: fd
                })
                .onSuccess(function(data: any) {
                    resolve({
                        ...data,
                        content: "",
                        msg_id: data.msg_id
                    });
                })
                .onFail(function(data: any) {
                    reject(data);
                });
        });
    }
}
