import { ErrorParam, get, post, tokenData } from "./request";
import {
    RecommendType,
    RecommendOwnerDo,
    DirectBroadcastModel,
    curriculumModel,
    AclSourceType,
    UserAssetsType,
    OrderStatus,
    PaymentStatus
} from "@/model";
import store from "./store";
import { UserImType } from "./im";

// ==================model==================== //
export interface Page {
    currentPage: number;
    pageSize: number;
    orderBy?: string;
    order?: "asc" | "desc";
    total?: number;
}
export interface PageResult<M> {
    records: Array<M>;
    total: number;
    size: number;
    current: number;
    pages: number;
}

/**
 * 获取首页套餐列表
 * @param param 参数
 */
export const packageList = (
    param?: {
        currentPage?: number;
        pageSize?: number;
        type?: "recommend" | "active" | "hotSold";
        searchKey?: string; // 搜索关键字
        studentIdeaId?: string; // 学习意向id
        CourseDetail?: string; // 是否获取课程详情
    },
    errorMsg: ErrorParam = {
        message: "获取套餐列表失败"
    }
): Promise<any> => {
    return get("/v3/api/kc/course/package-list", param, errorMsg);
};
/**
 * 登录接口
 * @param loginParam 登录参数
 */
export const login = (
    loginParam: {
        type?: "weixin" | "phone" | "username" | "qq";
        userAccount?: string;
        credential?: string;
        code?: string;
        userType?: "member" | "teacher";
        isBrowser: true;
    },
    errorMsg: ErrorParam = {
        message: "账号或密码错误"
    }
): Promise<any> => {
    return post(
        "/v3/api/login",
        {
            type: "username",
            userType: "member",
            isBrowser: true,
            ...loginParam
        },
        errorMsg
    ).then((data: any) => {
        tokenData.token = data.token;
        tokenData.wait = true;
        tokenData.status = true;
        store.state.currentStudentIdeaId = data.studentIdeaId;
        return data;
    });
};
/**
 * 注册
 */
export const register = (
    registerParam: {
        userAccount?: string;
        credential?: string;
        code?: string;
    },
    errorMsg: ErrorParam = {
        message: "注册失败"
    }
) => {
    return post(
        "/v3/api/register",
        {
            ...registerParam,
            deviceType: "pc"
        },
        errorMsg
    );
};
export const logout = () => {
    return get("/v3/api/logout");
};

export const phoneHaveUse = (
    phone: string,
    errorMsg: ErrorParam = {
        ignoreFalse: true
    }
) => {
    return get(
        "/v3/api/sys/user/phone-have-use",
        {
            phone
        },
        errorMsg
    );
};

/**
 * 重置密码
 * @param loginParam 表单信息
 * @param errorMsg 错误信息
 */
export const forgetPassword = (
    loginParam: {
        userAccount: string;
        credential: string;
        code: string;
    },
    errorMsg: ErrorParam = {
        message: "重置密码失败"
    }
) => {
    return post("/v3/api/forget-pass", loginParam, errorMsg);
};

export const currentUser = (_?: any, errorMsg?: ErrorParam) => {
    return get(
        {
            url: "/v3/api/sys/user/current-user"
        },
        _,
        {
            alterMessage: false,
            gotoLogin: false,
            ...errorMsg
        }
    ).then(data => {
        store.state.currentStudentIdeaId =
            store.state.currentStudentIdeaId || data.studentIdeaId;
        return data;
    });
};

export const studentIdeaDetail = (
    id: string,
    errorMsg: ErrorParam = {
        message: "意向设置获取失败"
    }
) => {
    return post(`/v3/api/kc/studentIdea/detail/${id}`, errorMsg);
};
/**
 * 获取短信验证码
 * @param phone 手机号
 * @param errorMsg 错误信息
 */
export const loginPhoneCode = (
    phone: string,
    angel: number,
    errorMsg: ErrorParam = {
        message: "获取验证码失败"
    }
) => {
    return get(
        `/v3/api/phone-code/${phone}`,
        {
            imageCheck: true,
            angel
        },
        errorMsg
    );
};
export const imageCodeCheck = (angel: number) => {
    return get(
        "/v3/api/image-code-check",
        { angel },
        {
            otherMessage: "验证失败"
        }
    );
};
/**
 * 获取系统配置
 * @param key 配置key
 */
export const configDetail = (key: string) => {
    return get(
        `/v3/api/sys/conf/value/${key}`,
        {},
        {
            alterMessage: false
        }
    );
};

export const fondPoster = (
    id: string,
    name: string,
    errorMsg: ErrorParam = {
        otherMessage: "推荐失败"
    }
) => {
    // 推荐页
    return get(
        `/v3/api/search/recommend/${id}/${name}`,
        {
            currentPage: 1,
            pageSize: 6
        },
        errorMsg
    );
};
export const consultation = (
    id: string,
    contentType: string,
    errorMsg: ErrorParam = {
        otherMessage: "失败"
    }
) => {
    // 资讯 活动
    return get(
        `v3/api/search/${id}/${contentType}`,
        {
            currentPage: 1,
            pageSize: 1
        },
        errorMsg
    );
};

// 获取老师动态
export const dynamic = (
    id: string,
    errorMsg: ErrorParam = {
        otherMessage: "失败"
    }
) => {
    return get(
        `/v3/api/teacher/dynamic/${id}}`,
        {
            currentPage: 1,
            pageSize: 1
        },
        errorMsg
    );
};

/**
 * 获取讲座播放凭证1
 * @param lectureId 讲座id
 */
export const getVideoPlayer1 = (
    videoId: string,
    errorMsg: ErrorParam = {
        otherMessage: "视频播放失败"
    }
) => {
    return get(`/v3/api/kc/video-auth/${videoId}`, {}, errorMsg);
};
/**
 * 获取讲座播放凭证
 * @param lectureId 讲座id
 */
export const getVideoPlayer = (
    lectureId: string,
    errorMsg: ErrorParam = {
        otherMessage: "视频播放失败"
    }
) => {
    return get(
        "/v3/api/kc/lecture-video-auth",
        {
            lectureId
        },
        errorMsg
    );
};

/**
 * 获取讲座详情
 */
export const lectureDetail = (
    lectureId: string,
    entityDetail: boolean,
    errorMsg: ErrorParam = {
        message: "获取视讲座详情失败"
    }
) => {
    return get(
        `/v3/api/kc/lecture/detail/${lectureId}`,
        {
            entityDetail
        },
        errorMsg
    );
};

/**
 * 获取视频详情
 */
export const curriculumDetail = (
    curriculumId: string,
    errorMsg: ErrorParam = {
        message: "获取视频详情失败"
    }
): Promise<curriculumModel> => {
    return get(`/v3/api/kc/curriculum/${curriculumId}`, {}, errorMsg);
};

/**
 * 根据广告code获取广告位详情
 */
export const advLocationDetail = (
    code: string,
    errorMsg: ErrorParam = {
        message: "获取广告位失败"
    }
) => {
    return get(`/v3/api/sys/adv/adv-location-detail/${code}`, {}, errorMsg);
};
/**
 * 获取推荐设置
 */
export const recommendData = (
    recommendType: RecommendType,
    dos: Array<RecommendOwnerDo>,
    errorMsg?: ErrorParam
) => {
    return post(
        `/v3/api/recommend/common-select`,
        {
            recommendType,
            dos
        },
        errorMsg
    );
};

/**
 * 获取视频详情
 */
export const subjectDetail = (subjectsId: string, errorMsg?: ErrorParam) => {
    return get(
        `/v3/api/kc/studentIdea/subject-detail/${subjectsId}`,
        {},
        errorMsg
    );
};

/**
 * 获取所有行业
 */
export const selectIndustry = (errorMsg?: ErrorParam) => {
    return get(`/v3/api/kc/studentIdea/industry`, {}, errorMsg);
};

/**
 * 获取行业下所有意向
 */
export const selectStudentIdea = (
    industryId: string,
    errorMsg?: ErrorParam
) => {
    return get(
        `/v3/api/kc/studentIdea/student-idea/${industryId}`,
        {},
        errorMsg
    );
};

/**
 * 获取所有行业并设置行业下所有意向
 */
export const selectStudentIdea1 = (errorMsg?: ErrorParam) => {
    return get(`/v3/api/kc/studentIdea/industry-student-idea`, {}, errorMsg);
};

/**
 * 获取所有行业并设置行业下所有意向
 */
export const memberChooseStudentIdea = (
    studentIdeaId: string,
    errorMsg: ErrorParam = {
        message: "意向选择失败"
    }
) => {
    return post(
        `/v3/api/kc/studentIdea/choose/${studentIdeaId}`,
        {},
        errorMsg
    ).then((studentIdeaModel: any) => {
        store.state.currentStudentIdeaId = studentIdeaId;
    });
};

/**
 * 获取用户IM身份信息
 */
export const userImType = (errorMsg?: ErrorParam): Promise<UserImType> => {
    return get(`/v3/api/sys/user/user-im-type`, {}, errorMsg);
};

/**
 * 获取直播详情
 */
export const directBroadcastDetail = (
    id: string,
    errorMsg: ErrorParam = {
        message: "直播信息获取失败"
    }
): Promise<DirectBroadcastModel> => {
    return get(`/v3/api/kc/direct-broadcast/detail/${id}`, {}, errorMsg);
};

/**
 * 获取意向下的全部课程标签
 * tree 结构
 */
export const fetchCourseTag = (
    studentIdeaId: string,
    tree: true,
    errorMsg: ErrorParam = {
        message: "标签获取失败"
    }
): Promise<any> => {
    return get(`/v3/api/kc/course-tags`, { studentIdeaId, tree }, errorMsg);
};

/**
 * 获取课程分页
 */
export const fetchCourse = (
    param: {
        page: Page;
        studentIdeaId?: string;
        tagList?: Array<string>;
        tagDetail: boolean;
    },
    errorMsg: ErrorParam = {
        message: "获取课程失败"
    }
): Promise<PageResult<any>> => {
    return post(
        `/v3/api/kc/course-page`,
        {
            ...param.page,
            studentIdeaId: param.studentIdeaId,
            tagList: param.tagList,
            tagDetail: param.tagDetail
        },
        errorMsg
    );
};
/**
 * 根据课程获取当前套餐
 * @param courseId 课程id
 * @param tagList 是否获取code列表
 * @param errorMsg 错误信息
 */
export const coursePackageCourseList = (
    courseId: string,
    tagList: boolean = true,
    errorMsg?: ErrorParam
): Promise<any> => {
    return get(
        `/v3/api/kc//course-package/1`,
        {
            courseId,
            tagList
        },
        errorMsg
    );
};
/**
 * 用户是否收藏
 * @param sourceType 资源类型
 * @param sourceId 资源id
 */
export const userHaveCollection = (
    sourceType: AclSourceType,
    sourceId: string
): Promise<boolean> => {
    return get(
        "/v3/api/acl/collection/have",
        {
            sourceType,
            sourceId
        },
        {
            alterMessage: false,
            ignoreFalse: true
        }
    );
};

/**
 * 用户是否点赞
 * @param sourceType 资源类型
 * @param sourceId 资源id
 */
export const userHaveLike = (
    sourceType: AclSourceType,
    sourceId: string
): Promise<boolean> => {
    return get(
        "/v3/api/acl/like/have",
        {
            sourceType,
            sourceId
        },
        {
            alterMessage: false,
            ignoreFalse: true
        }
    );
};

export const collection = (
    sourceType: AclSourceType,
    sourceId: string,
    errorMsg: ErrorParam = {
        message: "收藏失败"
    }
): Promise<boolean> => {
    return post(
        "/v3/api/acl/collection/click",
        {
            sourceType,
            sourceId
        },
        {
            ignoreFalse: true,
            ...errorMsg
        }
    );
};

export const like = (
    sourceType: AclSourceType,
    sourceId: string,
    errorMsg: ErrorParam = {
        message: "点赞失败"
    }
) => {
    return post(
        "/v3/api/acl/like/click",
        {
            sourceType,
            sourceId
        },
        {
            ignoreFalse: true,
            ...errorMsg
        }
    );
};

// 获取课堂
export const courseClassrooms = (
    param: {
        courseId: string;
        children?: boolean;
        classroomType?: boolean;
        typeOr?: boolean;
        subjectName?: boolean;
    } & Page,
    errorMsg?: ErrorParam
): Promise<any> => {
    return get(
        `/v3/api/kc/course/classroom/${param.courseId}`,
        param,
        errorMsg
    );
};

export const chapterLectures = (
    param: {
        chapterId: string;
        children?: boolean;
    } & Page,
    errorMsg?: ErrorParam
) => {
    return get(
        `/v3/api/kc/chapter/lecture/${param.chapterId}`,
        param,
        errorMsg
    );
};

export const userViewComment = (
    param: {
        commentType: "commonComment" | "question";
        commentSourceType: AclSourceType;
        commentSourceId: string;
        sourceDetail: boolean;
        commentUserDetail: boolean;
        detail: boolean;
        detailCount: number;
        detailLike: boolean;
        relyDetailLike: boolean;
        getTotalCount: boolean;
        currentUser: boolean;
    } & Page,
    errorMsg?: ErrorParam
): Promise<PageResult<any>> => {
    return get("/v3/api/acl/user/comment/view", param, errorMsg);
};

export const publishedComment = (
    param: {
        commentType: "commonComment" | "question";
        commentSourceType: AclSourceType;
        commentSourceId: string;
        // 二级评论回复评论id
        relay2TreeId: string;
        content: string;
        userDetail?: boolean;
    },
    errorMsg?: ErrorParam
): Promise<any> => {
    return post("/v3/api/acl/comment/published", param, errorMsg);
};

export const isSubscribe = (
    id: string,
    errorMsg?: ErrorParam
): Promise<boolean> => {
    return get(
        `/v3/api/kc/direct-broadcast/subscribe/${id}`,
        {},
        {
            ignoreFalse: true,
            ...errorMsg
        }
    );
};

export const memberSubscribeLog = (
    param: {
        directId: string;
        courseId: string;
        type: boolean;
    },
    errorMsg?: ErrorParam
): Promise<boolean> => {
    return post("/v3/api/cu/log/member-subscribe-log", param, errorMsg);
};

export const memberCount = (id: string): Promise<number> => {
    return get(
        `/v3/api/kc/direct-broadcast/mem-count/${id}`,
        {},
        {
            alterMessage: false
        }
    );
};

export const dataLog = (
    param: {
        activeType: string;
        activeSourceType: string;
        activeSourceId: string;
        path?: string;
        actionStartTime?: string;
        actionEndTime?: string;
        topSourceType?: string;
        topSourceId?: string;
        remark?: string;
        watchTime?: string;
    },
    errorMsg?: ErrorParam
): Promise<any> => {
    return post("/v3/api/sys/dbp/log", param, errorMsg);
};
export const studyLog = (
    param: {
        activeType: string;
        activeSourceType: string;
        activeSourceId: string;
        path?: string;
        actionStartTime?: string;
        actionEndTime?: string;
        topSourceType?: string;
        topSourceId?: string;
        remark?: string;
        watchTime?: string;
    },
    errorMsg?: ErrorParam
): Promise<any> => {
    return post("/api/v3/api/sys/dbp/study/log", param, errorMsg);
};

export const getCurriculumWatchTime = (videoId: string): Promise<any> => {
    return get(`/v3/api/kc/curriculum-watch-time/${videoId}`, {});
};

export const selectUserAssets = (
    param: {
        assetType: UserAssetsType;
        assetMappingId: string;
        startTime: string;
        endTime: string;
    } & Page,
    errorMsg?: ErrorParam
): Promise<PageResult<any>> => {
    return get("/v3/api/cu/assets/list", param, errorMsg);
};

export const selectUserAllCourse = (
    errorMsg?: ErrorParam
): Promise<Array<any>> => {
    return get("/v3/api/cu/assets/course/list", {}, errorMsg);
};

export const selectCourseTags = (
    param: {
        studentIdeaId: string;
        tree: boolean;
        all: boolean;
    },
    errorMsg?: ErrorParam
) => {
    return get("/v3/api/kc/course-tags", param, errorMsg);
};

export const courseStatistic = (
    param: {
        type: "video" | "live" | "question" | "homework";
        courseId: string;
    },
    errorMsg?: ErrorParam
): Promise<any> => {
    return get(
        `/v3/api/kc/statistic/${param.type}/${param.courseId}`,
        {},
        errorMsg
    );
};

export const courseDetail = (
    param: {
        courseId: string;
        tagDetail: boolean;
        recommendLectureDetail: boolean;
    },
    errorMsg?: ErrorParam
): Promise<any> => {
    return get(`/v3/api/kc/course/detail/${param.courseId}`, param, errorMsg);
};

export const feedback = (
    param: {
        content: string;
        type: "bug" | "advice" | "live" | "other";
        typeId: string;
        connectMethod?: string;
        images?: string;
        keyWords?: string;
    },
    errorMsg?: ErrorParam
): Promise<any> => {
    return post("/v3/api/personal/feedback", param, errorMsg);
};

// 首页获取考试时间
export const timeList = (
    studentIdeaId: string,
    errorMsg?: ErrorParam
): Promise<any> => {
    return get(`/v3/api/instruction/time/${studentIdeaId}`, {}, errorMsg);
};

// 首页获取考试须知
export const introductionList = (
    param: {
        studentIdeaId: string;
        currentPage: number;
        pageSize: number;
    },
    errorMsg?: ErrorParam
): Promise<any> => {
    return get(`/v3/api/instruction/${param.studentIdeaId}`, param, errorMsg);
};

// 获取资讯列表，首页底部热门文章列表，发现页面的发现部分
export const findByIntentionAndRecommend = (
    param: {
        studentIdeaId: string;
        recommend: string;
        currentPage: number;
        pageSize: number;
    },
    errorMsg?: ErrorParam
): Promise<any> => {
    return get(
        `/v3/api/search/recommend/${param.studentIdeaId}/${param.recommend}`,
        param,
        errorMsg
    );
};

// 首页底部最新文章列表
export const newArticle = (
    param: {
        studentIdeaId: string;
        currentPage: number;
        pageSize: number;
    },
    errorMsg?: ErrorParam
): Promise<any> => {
    return get(
        `/v3/api/search/new/article/${param.studentIdeaId}`,
        param,
        errorMsg
    );
};

// 首页底部关于我们
export const aboutUs = (
    param: {
        currentPage: number;
        pageSize: number;
    },
    errorMsg?: ErrorParam
): Promise<any> => {
    return get(`/v3/api/search/about-us`, param, errorMsg);
};

// 发现页面获取活动 资讯
export const findByIntentionAndType = (
    param: {
        studentIdeaId: string;
        contentType: string;
        currentPage: number;
        pageSize: number;
    },
    errorMsg?: ErrorParam
): Promise<any> => {
    return get(
        `/v3/api/search/${param.studentIdeaId}/${param.contentType}`,
        param,
        errorMsg
    );
};

export const createOrder = (
    details: Array<{
        entityType: UserAssetsType;
        entityId: string;
        totalCount: number;
    }>,
    remark: string = "",
    addressId: string = "",
    errorMsg: ErrorParam = {
        message: "订单创建失败",
        gotoLogin: true
    }
): Promise<any> => {
    return post(
        "/v3/api/cu/order/create-order",
        {
            details,
            remark,
            addressId
        },
        errorMsg
    );
};

export const userOrderDetail = (
    orderId: string,
    errorMsg: ErrorParam = {
        message: "获取订单失败",
        gotoLogin: true
    }
): Promise<any> => {
    return get(`/v3/api/cu/order/user-order-detail/${orderId}`, {}, errorMsg);
};

export const userOrderDetailBySn = (
    orderSn: string,
    errorMsg: ErrorParam = {
        message: "获取订单失败",
        gotoLogin: true
    }
): Promise<any> => {
    console.log(`/v3/api/cu/order/user-order-detail-by-sn/${orderSn}`);
    return get(`/v3/api/cu/order/user-order-detail-by-sn/${orderSn}`, {}, errorMsg);
};

export const paySign = (
    type: string,
    orderId: string,
    aType: string,
    paymentChannel: string = "pc",
    errorMsg: ErrorParam = {
        message: "支付失败",
        gotoLogin: true
    }
): Promise<any> => {
    return get(
        "/v3/api/cu/pay/sign",
        {
            type,
            orderId,
            aType,
            paymentChannel
        },
        errorMsg
    );
};

// 发现页面获取发现动态
export const findDynamic = (
    param: {
        teacherId: string;
        currentPage: number;
        pageSize: number;
    },
    errorMsg?: ErrorParam
): Promise<any> => {
    return get(`/v3/api/teacher/dynamic/${param.teacherId}`, param, errorMsg);
};
/**
 * 获取用户订单 无限分页
 * @param param 参数
 * @param errorMsg 异常配置
 */
export const userOrder = (
    param: {
        orderStatus?: OrderStatus;
        payStatus?: PaymentStatus;
        detail?: boolean;
        payDetail?: boolean;
        addressDetail?: boolean;
    } & Page,
    errorMsg?: ErrorParam
) => {
    return post("/v3/api/cu/order/user-order", param, errorMsg);
};
// 教师主页 获取教师信息
export const teacherInfo = (
    teacherId: string,
    errorMsg?: ErrorParam
): Promise<any> => {
    return get(`/v3/api/teacher/info/${teacherId}`, {}, errorMsg);
};
// 获取老师标签
export const teacherLabels = (
    teacherId: string,
    errorMsg?: ErrorParam
): Promise<any> => {
    return get(`/v3/api/teacher/label/${teacherId}`, {}, errorMsg);
};
// 获取教师主页在线课堂
export const pcFindCourse = (
    param: {
        teacherId: string;
        currentPage: number;
        pageSize: number;
    },
    errorMsg?: ErrorParam
): Promise<any> => {
    return get(`/v3/api/kc/course/pc/${param.teacherId}`, param, errorMsg);
};

export const teacherListByCourse = (
    courseId: string,
    isSingle?: boolean,
    errorMsg?: ErrorParam
) => {
    return get(`/v3/api/teacher/list/${courseId}`, { isSingle }, errorMsg);
};
// 获取文章详情
export const detail = (id: string, errorMsg?: ErrorParam): Promise<any> => {
    return get(`/v3/api/acl/detail/${id}`, {}, errorMsg);
};

// 点击做题按钮获取试题列表
export const questionList = (
    param: {
        courseId?: string;
        classroomId?: string;
        testPageRuleId?: string;
        chapterId?: string;
        // questionId?: string;
        // showType?: number;
    },
    errorMsg?: ErrorParam
): Promise<any> => {
    return post("/v3/api/question/list", param, errorMsg);
};

// 题库部分收藏或者取消收藏

export const addMemberQuestionLog = (
    param: {
        courseId: string;
        classroomId: string;
        testPageRuleId: string;
        chapterId: string;
        questionId: string;
    },
    errorMsg?: ErrorParam
) => {
    return post("/v3/api/question/member/collect", param, errorMsg);
};

// 获取课堂下边的组卷
export const questionColumn = (classroomId: string, errorMsg?: ErrorParam) => {
    return get(`/v3/api/kc/question/column/${classroomId}`, {}, errorMsg);
};

// 获取章节
export const chapterList = (
    param: {
        testPageRuleId: string;
        courseId: string;
        classroomId: string;
    },
    errorMsg?: ErrorParam
) => {
    return get(`/v3/api/chapter/list`, param, errorMsg);
};

// 获取章节下边的子章节
export const chapterChildrenList = (
    chapterId: string,
    errorMsg?: ErrorParam
) => {
    return get(`/v3/api/chapter/children/list`, { chapterId }, errorMsg);
};

// 获取试卷
export const testPagerList = (
    param: {
        testPageRuleId: string;
        courseId: string;
        classroomId: string;
    },
    errorMsg?: ErrorParam
) => {
    return get(`/v3/api/chapter/test-pager/list`, param, errorMsg);
};
// 获取最新收藏
export const collectList = (
    param: {
        courseId: string;
        classroomId: string;
        currentPage: number;
        pageSize: number;
    },
    errorMsg?: ErrorParam
) => {
    return get(`/v3/api/question/collect/list`, param, errorMsg);
};

// 获取收藏榜
export const collectRank = (
    param: {
        courseId: string;
        classroomId: string;
    },
    errorMsg?: ErrorParam
) => {
    return post(`/v3/api/question/collect/rank`, param, errorMsg);
};

// 获取最新错题
export const errorList = (
    param: {
        courseId: string;
        classroomId: string;
        currentPage: number;
        pageSize: number;
    },
    errorMsg?: ErrorParam
) => {
    return get(`/v3/api/question/error/list`, param, errorMsg);
};
// 错题分类 下边的章节
export const chapterErrorList = (
    param: {
        testPageRuleId: string;
        courseId: string;
        classroomId: string;
        currentPage: number;
        pageSize: number;
    },
    errorMsg?: ErrorParam
) => {
    return get(`/v3/api/chapter/error/list`, param, errorMsg);
};

// 错题榜
export const errorRank = (
    param: {
        courseId: string;
        classroomId: string;
    },
    errorMsg?: ErrorParam
) => {
    return post(`/v3/api/question/error/rank`, param, errorMsg);
};
// 订单状态修改
export const orderCancel = (
    param: {
        orderId: string;
        type: string;
    },
    errorMsg?: ErrorParam
) => {
    return post(`/v3/api/cu/order/status-change`, param, errorMsg);
};

// 获取用户收藏
export const userCollection = (
    param: {
        sourceType: string;
        sourceDetail: boolean;
    } & Page,
    errorMsg?: ErrorParam
) => {
    return get(`/v3/api/acl/user/collection`, param, errorMsg);
};

// 更换头像图片的后台地址
// /v3/api/upload/image

// 更改用户信息
export const updateInfo = (
    param: {
        headerUrl: string;
        nickname: string;
        sex: string;
        birthday: string;
    },
    errorMsg?: ErrorParam
) => {
    return post(`/v3/api/personal/update/info`, param, errorMsg);
};

// 个人中心意见反馈
export const personalFeedBack = (
    param: {
        content: string;
        type: string;
        connectMethod: string;
    } & Page,
    errorMsg?: ErrorParam
) => {
    return post(`/v3/api/personal/feedback`, param, errorMsg);
};
// 获取系统消息
export const messageSystem = (
    param: {
        currentPage: number;
        pageSize: number;
    } & Page,
    errorMsg?: ErrorParam
) => {
    return get(`/v3/api/chat/message/system/msg/list`, param, errorMsg);
};

// 切换做题模式
export const changeModule = (
    param: {
        classroomId: string;
        courseId: string;
        testPageRuleId: string;
        chapterId: string;
        questionId: string;
        answerModel: number;
        preAnswerModel: number;
        examLogId?: string | null; // 模式为检测模式必传
        timer?: number; // 模式为检测模式必传
    },
    errorMsg?: ErrorParam
) => {
    return post(`/v3/api/question/change/module`, param, errorMsg);
};

// 练习模式增加用户做题记录
export const questionLog = (
    param: {
        classroomId: string;
        courseId: string;
        testPageRuleId: string;
        chapterId: string;
        questionId: string;
        rightFlag: number;
        answer: string;
    },
    errorMsg: ErrorParam = {
        alterMessage: false
    }
) => {
    return post(`/v3/api/question/add/member/question/log`, param, errorMsg);
};

// 练习模式添加回显记录
export const rollbackLog = (
    param: {
        classroomId: string;
        courseId: string;
        testPageRuleId: string;
        chapterId: string;
        questionId: string;
    },
    errorMsg: ErrorParam = {
        alterMessage: false
    }
) => {
    return post(`/v3/api/question/member/rollback/log`, param, errorMsg);
};

// 检测模式增加用户考试做题记录
export const testingLog = (
    param: {
        classroomId: string;
        courseId: string;
        testPageRuleId: string;
        chapterId: string;
        questionId: string;
        rightFlag: number;
        answer: string;
        score: string;
        examLogId: string | null;
    },
    errorMsg?: ErrorParam
) => {
    return post(`/v3/api/question/member/testing/log`, param, errorMsg);
};

// 检测模式交卷日志
export const examOver = (
    param: {
        classroomId: string;
        courseId: string;
        testPageRuleId: string;
        chapterId: string;
        id: string | null; // 考试id
        timer: number;
        getQuestionLog: boolean;
    },
    errorMsg?: ErrorParam
) => {
    return post(`/v3/api/question/exam/over`, param, errorMsg);
};

// 检测模式交卷后回看答案解析
export const examAnalysis = (
    param: {
        classroomId: string;
        courseId: string;
        testPageRuleId: string;
        chapterId: string;
        id: string | null; // 考试id
        timer: number;
        getQuestionLog: boolean;
    },
    errorMsg?: ErrorParam
) => {
    return post(`/v3/api/question/exam/analysis`, param, errorMsg);
};

// 清除做题记录
export const cancelLog = (
    param: {
        classroomId: string;
        courseId: string;
        testPageRuleId: string;
        chapterId: string;
    },
    errorMsg?: ErrorParam
) => {
    return post(`/v3/api/question/member/cancel/rollback/log`, param, errorMsg);
};

// 收藏部分、错题部分的最新以及收藏榜试题详情
export const questionDetail = (
    param: {
        classroomId: string;
        courseId: string;
        testPageRuleId: string;
        chapterId: string;
        questionId: string;
    },
    errorMsg?: ErrorParam
) => {
    return post(`/v3/api/question/detail`, param, errorMsg);
};

// 获取收藏分类下边章节
export const chapterCollectList = (
    param: {
        testPageRuleId: string;
        courseId: string;
        classroomId: string;
        currentPage: number;
        pageSize: number;
    },
    errorMsg?: ErrorParam
) => {
    return get(`/v3/api/chapter/collect/list`, param, errorMsg);
};

// 获取收藏章节试题列表（OK）
export const chapterQuestionCollectList = (
    param: {
        classroomId: string;
        courseId: string;
        testPageRuleId: string;
        chapterId: string;
        showType: number; // 类型 0试题回顾 1试题重做
    },
    errorMsg?: ErrorParam
) => {
    return post(`/v3/api/question/chapter/collect/list`, param, errorMsg);
};

// 获取错题章节试题列表（OK）
export const chapterQuestionErrorList = (
    param: {
        classroomId: string;
        courseId: string;
        testPageRuleId: string;
        chapterId: string;
        showType: number; // 类型 0试题回顾 1试题重做
    },
    errorMsg?: ErrorParam
) => {
    return post(`/v3/api/question/chapter/error/list`, param, errorMsg);
};

// 根据章节id获取章节详情
export const chapterDetail = (
    param: {
        id: string;
    },
    errorMsg?: ErrorParam
) => {
    return get(`/v3/api/chapter/detail`, param, errorMsg);
};

// 资料下载 一级
export const getCourseDataClassifyList = (
    courseId: string,
    errorMsg?: ErrorParam
) => {
    return get(
        `/v3/api/chat/group/course/data/classify/list/${courseId}`,
        {},
        errorMsg
    );
};
// 获取资料下级分类
export const getGroupDataClassifyChildrenList = (
    classifyId: string,
    errorMsg?: ErrorParam
) => {
    return get(
        `/v3/api/chat/group/data/classify/children/list/${classifyId}`,
        {},
        errorMsg
    );
};

// 获取资料列表
export const getGroupDataInstanceList = (
    classifyId: string,
    errorMsg?: ErrorParam
) => {
    return get(
        `/v3/api/chat/group/data/instance/list/${classifyId}`,
        {},
        errorMsg
    );
};

// 获取首页留言数
export const mentoringCount = (errorMsg?: ErrorParam) => {
    return get(`/v3/api/mentoring/count`, {}, errorMsg);
};
// 搜索结果
// 需要显示type为information和type为pc-course的两种类型
export const pcCourseList = (
    param: {
        searchKey: string;
        currentPage: number;
        pageSize: number;
        type: string;
    },
    errorMsg?: ErrorParam
): Promise<any> => {
    return get(`/v3/api/search/${param.type}`, param, errorMsg);
};
// 获取本节答疑
// type为group，course或者lecture
export const mentoringList = (
    param: {
        currentPage: number;
        pageSize: number;
        type: string;
        sourceId: string;
        action: string;
    },
    errorMsg?: ErrorParam
): Promise<any> => {
    return get(
        `/v3/api/mentoring/list/${param.type}/${param.sourceId}/${param.action}`,
        param,
        errorMsg
    );
};
// 提交答疑
// type为group，course或者lecture
export const mentoringAsk = (
    param: {
        question: string;
        questionAuthorId: string;
        questionSourceId: string;
        questionSourceType: number;
    },
    errorMsg?: ErrorParam
): Promise<any> => {
    return post(`/v3/api/mentoring/ask`, param, errorMsg);
};
// 首页获取banner
export const advDetailByLocationCode = (
    code: string,
    errorMsg?: ErrorParam
): Promise<any> => {
    return get(`/v3/api/sys/adv/adv-code/${code}`, {}, errorMsg);
};
// 获取讲座的课后作业

export const homeworkList = (
    param: {
        courseId: string;
        lectureId: string;
    },
    errorMsg?: ErrorParam
): Promise<any> => {
    return get(`/v3/api/homework/list`, param, errorMsg);
};

// 获取课后作业的试题列表
export const homeworkQuestionList = (
    param: {
        courseId: string;
        classroomId: string;
        lectureId: string;
        homeworkId: string;
    },
    errorMsg?: ErrorParam
): Promise<any> => {
    return get(`/v3/api/homework/question/list`, param, errorMsg);
};

// 获取点赞数
export const likeCount = (
    param: {
        sourceType: string;
        sourceId: string;
    },
    errorMsg?: ErrorParam
): Promise<any> => {
    return get(`/v3/api/acl/like/count`, param, errorMsg);
};

// 首页讲座点击购买 跳到课程详情
export const recommendCourse = (
    param: {
        lectureId: string;
        studentIdeaId: string;
    },
    errorMsg?: ErrorParam
): Promise<any> => {
    return get(`/v3/api/kc/lecture/recommend/course`, param, errorMsg);
};

// 课后作业增加用户做题记录（ok）
export const homeworkQuestionLog = (
    param: {
        homeworkId: string;
        courseId: string;
        questionId: string;
        lectureId: string;
        rightFlag: number;
        answer: string;
    },
    errorMsg: ErrorParam = {
        alterMessage: false
    }
) => {
    return post(`/v3/api/homework/add/member/question/log`, param, errorMsg);
};
// 课后作业删除全部做题记录(ok)
export const homeworkRemoveLog = (
    param: {
        homeworkId: string;
        courseId: string;
        lectureId: string;
    },
    errorMsg: ErrorParam = {
        alterMessage: false
    }
) => {
    return post(`/v3/api/homework/remove/member/question/log`, param, errorMsg);
};
// 试题纠错
export const errorCorrection = (
    param: {
        categoryId: string;
        testPageRuleId: string;
        chapterId: string;
        questionId: string;
        errorMark: string;
        errorType: string;
    },
    errorMsg?: ErrorParam
) => {
    return post("/v3/api/question/error/correction", param, errorMsg);
};
// 课后作业试题纠错
export const homeworkErrorCorrection = (
    param: {
        homeworkId: string;
        courseId: string;
        lectureId: string;
        questionId: string;
        errorMark: string;
        errorType: string;
    },
    errorMsg: ErrorParam = {
        alterMessage: false
    }
) => {
    return post(`/v3/api/homework/error/correction`, param, errorMsg);
};

// 课后作业解析纠错
export const homeworkAnalysisCorrection = (
    param: {
        homeworkId: string;
        lectureId: string;
        questionId: string;
        analysisContent: string;
        auditMark: string;
    },
    errorMsg: ErrorParam = {
        alterMessage: false
    }
) => {
    return post(`/v3/api/homework/analysis/correction`, param, errorMsg);
};

// 学习中心  继续上次学习
export const lastStudy = (
    courseId: string,
    errorMsg: ErrorParam = {
        alterMessage: false
    }
) => {
    return get(`/v3/api/kc/last/study/${courseId}`, {}, errorMsg);
};

export const lectureCourseTreeData = (
    lectureId: string,
    courseId?: string,
    errorMsg: ErrorParam = {
        alterMessage: false
    }
) => {
    return get(
        `/v3/api/kc/lecture/course/tree`,
        {
            lectureId,
            courseId
        },
        errorMsg
    );
};

export const payPreSuccess = (
    orderSn: string,
    errorMsg: ErrorParam = {
        alterMessage: false
    }
) => {
    return get("/v3/api/cu/pay/pre-success", { orderSn }, errorMsg)
};
