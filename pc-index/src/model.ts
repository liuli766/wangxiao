export type RecommendType =
    | "industry"
    | "studentIdea"
    | "subjects"
    | "coursePackage"
    | "course"
    | "classroom"
    | "Chapter"
    | "lecture"
    | "curriculum"
    | "directBroadcast"
    | "advertisement"
    | "questionBank"
    | "advertisementLocation";
export interface AdvItem {
    id: string;
    url: string;
}
export type AclSourceType =
    | "course"
    | "classroom"
    | "lecture"
    | "article"
    | "comment"
    | "live"
    | "question";

export type UserAssetsType =
    | "course"
    | "notes"
    | "testPaper"
    | "questionBank"
    | "mentionCode";

export type OrderStatus =
    | "waitPay"
    | "waitSend"
    | "waitSign"
    | "success"
    | "fail"
    | "delete"
    | "cancel"
    | "expired";
export type PaymentStatus =
    | "waitPay"
    | "paySuccess"
    | "payFail"
    | "refunding"
    | "refundSuccess"
    | "refundFail";
// 获取视频播放凭证model
export interface UserVideoAuthVo {
    haveAuth: boolean;
    lectureModel: LectureModel;
    seconds: number;
    recommendCourseId?: string;
    soldFlag: boolean;
    accessKeyId: string;
    accessKeySecret: string;
    securityToken: string;
    expiration: string;
}
export interface curriculumModel {
    id: string;
    name: string;
    coverUrl: string;
    videoId: string;
    subjectsId?: string;
    duration?: number;
    watchTime?: string;
    lookNumber?: number;
}
export interface LectureModel {
    id: string;
    lectureIntroduction: string;
    teacherId?: string;
    lectureType: "video" | "live" | "questionBank";
    entityId: string;
    name: string;
    isFree: boolean;
    freeSeconds: number;
    likeCount: number;
    commentCount: number;
}

export interface DirectBroadcastModel {
    id: string;
    title: string;
    expectStartTime: string;
    expectEndTime: string;
    lookNumber: number;
    /**
     * json格式字符串
     */
    broadUrlJson: string;
    playerUrl?: string;
    status: "noReady" | "noPremiere" | "living" | "delay" | "over" | "invalid";
    subscribeNumber: number;
    videoId?: string;
    videoImg: string;
    chatRoomId: string;
    chatRoomName: string;
    teacherId: string;
    /**
     * 科目id 公共直播时可以是行业 意向 科目
     */
    subjectsId?: string;
    /**
     * 是否是公共直播
     * 0000 0000
     * - - - -  - - - -
     * - - - (1 公共直播 非公共直播) - - （1 mappingId保存意向id） （1 mappingId保存行业id）
     */
    publicFlag: number;
    workCount?: boolean;
}
export interface RecommendOwnerDo {
    ownerType: RecommendType;
    id: string;
}
export interface AdvertisementLocationModel {
    id: string;
    code: string;
    name: string;
    contentType: "image" | "text" | "video";
    width: number;
    height: number;
}
