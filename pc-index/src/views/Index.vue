<template>
    <div class="yx-center full-width jf-start" v-wechat-title="state.webTitle">
        <!-- banner部分 -->
        <div class="banner full-width">
            <el-carousel
                indicator-position="inside"
                arrow="never"
                height="17rem"
            >
                <el-carousel-item
                    v-for="(item, index) in bannerList"
                    :key="index"
                >
                    <img :src="coverImage(item.content)" style="width:100%;" />
                </el-carousel-item>
            </el-carousel>
        </div>
        <!-- 右侧导航 -->
        <div class="sideBar">
            <div
                class="kf pointer"
                @mouseover="hoverFlag = 1"
                @mouseleave="hoverFlag = 0"
            >
                <div v-if="hoverFlag === 1" class="text" @click="toKf">
                    客服
                </div>
                <div v-else class="iconImg">
                    <img src="@/assets/img/kf.png" alt="" />
                </div>
            </div>
            <div class="downloadApp pointer">
                <div @mouseover="hoverFlag = 2" @mouseleave="hoverFlag = 0">
                    <div v-if="hoverFlag === 2" class="text">App</div>
                    <div v-else class="iconImg">
                        <img src="@/assets/img/ph.png" alt="" />
                    </div>
                </div>
                <div
                    v-show="hoverFlag === 2"
                    class="appcode"
                    style="box-shadow: 2px 2px 6px -1px rgba(0,0,0,0.67);"
                >
                    <img
                        :src="appQr"
                        alt=""
                        style="margin:0.6rem;width:105px;height:105px;"
                    />
                    <span
                        class="icon iconfont icon-shijiantouyou"
                        style="color:#dadce1;position:absolute;right:-19px;top:65px;font-size:1rem;"
                    ></span>
                </div>
            </div>
            <div class="gzh pointer">
                <div @mouseover="hoverFlag = 3" @mouseleave="hoverFlag = 0">
                    <div v-if="hoverFlag === 3" class="text">公众号</div>
                    <div v-else class="iconImg">
                        <img src="@/assets/img/gzh.png" alt="" />
                    </div>
                </div>
                <div
                    v-show="hoverFlag === 3"
                    class="gzhcode"
                    style="box-shadow: 2px 2px 6px -1px rgba(0,0,0,0.67);"
                >
                    <img
                        :src="zghQr"
                        alt=""
                        style="margin:0.6rem;width:105px;height:105px;"
                    />
                    <span
                        class="icon iconfont icon-shijiantouyou"
                        style="color:#dadce1;position:absolute;right:-19px;top:65px;font-size:1rem;"
                    ></span>
                </div>
            </div>
            <div
                v-show="showToTop"
                class="toTop fontSize5 f-c-333 FW600 pointer"
                @mouseover="hoverFlag = 4"
                @mouseleave="hoverFlag = 0"
            >
                <div v-if="hoverFlag === 4" class="text" @click="toTop">
                    返回顶部
                </div>
                <div v-else class="iconImg" style="text-align:center;">
                    <i
                        class="icon iconfont icon-jiantou-shang"
                        style="font-size:0.72rem;margin-left:0.1rem;text-align:center;"
                    ></i>
                    TOP
                </div>
            </div>
        </div>
        <!-- 产品分类 -->
        <div class="prd full-width">
            <div class="product xy-between al-str app-width marginAuto">
                <div
                    class="prdItem xy-between al-start jf-start prditem1 pointer"
                >
                    <div class="pic">
                        <img src="../assets/index/prd1.png" class="inimg" />
                        <img src="../assets/index/prd2.png" class="outimg" />
                    </div>
                    <div class="PrdText f-c-333">
                        <h4 class="fontSize67 ">智能教学</h4>
                        <p class="fontSize5 ">
                            学情分析，推荐优秀教师，定制专属课程
                        </p>
                    </div>
                </div>
                <div class="prdItem xy-between al-start prditem2 pointer">
                    <div class="pic">
                        <img src="../assets/index/prd3.png" class="inimg" />
                        <img src="../assets/index/prd4.png" class="outimg" />
                    </div>
                    <div class="PrdText f-c-333">
                        <h4 class="fontSize67 ">免费辅导</h4>
                        <p class="fontSize5 ">
                            专职老师全程学习辅导，让学习变简单
                        </p>
                    </div>
                </div>
                <div class="prdItem xy-between al-start prditem3 pointer">
                    <div class="pic">
                        <img src="../assets/index/prd5.png" class="inimg" />
                        <img src="../assets/index/prd6.png" class="outimg" />
                    </div>
                    <div class="PrdText f-c-333">
                        <h4 class="fontSize67 ">专业教师团队</h4>
                        <p class="fontSize5 ">
                            国际教师认真发展培训体系
                        </p>
                    </div>
                </div>
                <div class="prdItem xy-between al-start prditem4 pointer">
                    <div class="pic">
                        <img src="../assets/index/prd7.png" class="inimg" />
                        <img src="../assets/index/prd8.png" class="outimg" />
                    </div>
                    <div class="PrdText f-c-333">
                        <h4 class="fontSize67">贴心服务</h4>
                        <p class="fontSize5">
                            全程学习督导，追踪学习路径
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <!-- 推荐课程 -->
        <div class="full-width b-c-fff addList">
            <div class=" xy-between app-width marginAuto">
                <div
                    v-for="course in indexCourses"
                    :key="course.id"
                    class="additem pointer f-c-666"
                    @click="go('/c-course/courseDetail?id=' + course.id)"
                >
                    <a
                        :href="'/c-course/courseDetail?id=' + course.id"
                        :alt="course.name"
                        class="hidden"
                        >{{ course.name }}
                    </a>
                    <img
                        :src="coverImage(course.icon)"
                        class="icon full-width"
                    />
                    <h4 class="fontSize58">{{ course.name }}</h4>
                    <P calss="fontSize5 one-wrap">{{ course.introduction }}</P>
                </div>
            </div>
        </div>
        <!-- 免费试看 -->
        <div class="trySee full-width" style="background: #f5f5f5;">
            <div
                class="containTitle app-width marginAuto"
                style="padding-bottom:0.5rem;"
            >
                免费试看
            </div>
            <div class="contain xy-between al-start app-width marginAuto">
                <div class="left" style="width:70%;">
                    <div class="videoTitle xy-between al-start jf-start">
                        <div
                            v-for="(lecture, index) in indexLectures"
                            :key="lecture.id"
                        >
                            <div
                                v-if="lecture.subjects && index < 3"
                                class="vtitem fontSize58 xy-center pointer"
                                :class="{
                                    'b-c-root': activeLectureId === lecture.id
                                }"
                                @click="clickPlayerLecture(lecture)"
                            >
                                {{ lecture.subjects.name }}
                            </div>
                        </div>
                        <div
                            class="more pointer"
                            v-if="indexLectures.length > 3"
                        >
                            更多 >>
                        </div>
                    </div>
                    <div
                        class="video themeBgColor"
                        style="height:20.74rem"
                        @mouseover="showSoldHelp1 = true"
                        @mouseleave="showSoldHelp1 = false"
                    >
                        <Video
                            v-show="indexLectures.length > 0"
                            ref="video"
                            :lecture-id="activeLectureId"
                            :curriculum="lecturecurriculum"
                            :auto-palyer="true"
                            @clickSold="clickSold"
                            :show-sold-help1="showSoldHelp1"
                            @click="clickSold"
                            :player-status="playerStatus"
                        ></Video>
                    </div>
                </div>
                <div class="right" style="width:28%;">
                    <div class="notice b-c-root ">
                        <h4 class="fontSize67 textCenter FW300">
                            距离
                            {{ timeList.year || new Date().getFullYear() }}
                            {{ timeList.name }}考试还有：
                            <span class="FW600">{{ spaceTime }} 天</span>
                        </h4>
                        <h5 class="fontSize58 textCenter FW300">
                            考试时间 ：<span>{{ timeList.time }}</span>
                        </h5>
                        <hr style="background:#E2E2E2;" />
                        <!-- <div class="noticeList xy-between al-start flexWarp"> -->
                        <div class="noticeList" style="line-height:2.08rem;">
                            <el-carousel
                                height="2.08rem"
                                arrow="never"
                                indicator-position="none"
                            >
                                <el-carousel-item
                                    v-for="(item, index) in intrList"
                                    :key="index"
                                >
                                    <div
                                        class="listItem fontSize5 f-c-fff one-wrap pointer"
                                        @click="toArticleDetails(item)"
                                    >
                                        {{ item.title }}
                                        <a
                                            :href="toArticleDetailsPath(item)"
                                            style="display:none;"
                                        ></a>
                                    </div>
                                </el-carousel-item>
                            </el-carousel>
                        </div>
                    </div>
                    <div class="hotInfo">
                        <div
                            class="infoTitle b-c-fff fontSize5 xy-between pointer"
                        >
                            <div>热门资讯</div>
                            <div class="FW600" @click="toFound">></div>
                            <a href="/found" style="display:none;"></a>
                        </div>
                        <div class="infoList b-c-fff style-bar">
                            <div
                                class="hotInfoItem xy-between pointer"
                                v-for="(item, index) in hotInforList"
                                :key="index"
                                @click="toArticleDetails(item)"
                            >
                                <a
                                    :href="toArticleDetailsPath(item)"
                                    style="display:none;"
                                ></a>
                                <img
                                    :src="coverImage(item.hotInforImg)"
                                    alt=""
                                    v-if="item.images !== null"
                                />
                                <p class="one-wrap fontSize5 f-c-666">
                                    {{ item.title }}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="commentCarouse">
                        <el-carousel :interval="3000" arrow="never">
                            <el-carousel-item
                                v-for="(item, index) in messageInfo"
                                :key="index"
                            >
                                <div class="head xy-center jf-start">
                                    <img
                                        :src="item.headImg"
                                        alt=""
                                        class="headImg"
                                    />
                                    <div class="nickName fontSize58">
                                        {{ item.nikeName }}
                                    </div>
                                </div>
                                <div class="content fontSize5">
                                    {{ item.comment }}
                                </div>
                            </el-carousel-item>
                        </el-carousel>
                    </div>
                </div>
            </div>
        </div>
        <!-- 学习问题 -->
        <div class="full-width b-c-fff yx-center student-question-body">
            <div class="LearningProblems full-width marginAuto">
                <div class="contain app-width marginAuto">
                    <div class="containTitle textCenter">学习问题</div>
                    <P class="textCenter fontSize58"
                        >用户留下的<span>{{ messageCount }}</span
                        >条消息</P
                    >
                </div>
            </div>
            <div
                id="echarts-question"
                refs="echarts-question"
                class="app-width"
            >
                <img
                    v-for="(item, index) in imageBox"
                    :key="index"
                    class="echarts-item pointer"
                    :style="{
                        left: item.x + 'px',
                        top: item.y + 'px',
                        width: item.width + 'px',
                        height: item.width + 'px',
                        opacity: item.opacity
                    }"
                    @mouseover="
                        event => {
                            echartsMousemove(item);
                            helpBox.leaveStatus = 5;
                        }
                    "
                    @mouseleave="helpBoxLeave(true, helpBox.data.id)"
                    :src="item.img"
                />
                <transition
                    name="custom-classes-transition"
                    enter-active-class="animated fadeIn"
                >
                    <div
                        v-show="helpBox.show"
                        @mouseover="helpBox.leaveStatus = 4"
                        @mouseleave="helpBoxLeave(false, helpBox.data.id)"
                        :style="{
                            left: helpBox.x + 'px',
                            [helpBox.status % 2 === 1 ? 'bottom' : 'top']:
                                helpBox.y + 'px'
                        }"
                        class="bor-c-root help-box b-c-fff f-c-666 fontSize5 yx-center jf-start al-str"
                        :class="{
                            'help-box-left help-box-bottom':
                                helpBox.status === 1,
                            'help-box-left help-box-top': helpBox.status === 2,
                            'help-box-right help-box-bottom':
                                helpBox.status === 3,
                            'help-box-right help-box-top': helpBox.status === 4
                        }"
                    >
                        <div class="title">{{ helpBox.data.title }}</div>
                        <div class="line"></div>
                        <p class="full-width">{{ helpBox.data.content }}</p>
                    </div>
                </transition>
            </div>
        </div>
        <!-- 名师指导 -->
        <div class="teacher full-width" style="background: #f5f5f5;">
            <div class="contain app-width marginAuto">
                <div class="containTitle textCenter">名师指导</div>
                <P class="textCenter fontSize58"
                    >来自全国顶尖的师资团队在为您服务</P
                >
                <div class="teacherList xy-between al-str">
                    <div
                        class="teacherItem pointer yx-between al-str"
                        v-for="(item, index) in teacherInfo"
                        :key="index"
                    >
                        <div class="yx-center">
                            <a
                                :href="toTeacherDetailsPath(item, 0)"
                                style="display:none;"
                            ></a>
                            <img
                                :src="
                                    coverImage(item.recommendEntity.headerUrl)
                                "
                                alt=""
                                class="marginAuto"
                                style="width:6.25rem;height:6.25rem;"
                                @click="toTeacherDetails(item, 0)"
                            />
                            <div
                                class="tchInfo textCenter"
                                @click="toTeacherDetails(item, 0)"
                            >
                                <a
                                    href="/TeacherDetails"
                                    style="display:none"
                                ></a>
                                <h4 class="fontSize75">
                                    {{ item.recommendEntity.name }}
                                </h4>
                                <h5 class="fontSize5">
                                    {{ item.recommendEntity.jobTitle }}
                                </h5>
                                <p class="fontSize5 textJustify third-wrap">
                                    {{ item.recommendEntity.introduce }}
                                </p>
                            </div>
                        </div>
                        <div
                            class="lineCourse xy-between jf-start fontSize5 b-c-666 pointer"
                        >
                            <span
                                class="icon iconfont icon-_huabanfuben"
                                style="font-size: 0.75rem;color: #fff;margin-right:0.2rem;"
                            ></span>
                            <div
                                style="white-space:nowrap"
                                class="f-c-fff"
                                @click="toTeacherDetails(item, 1)"
                            >
                                在线课程
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 首页底部 -->
        <div class="full-width b-c-fff">
            <div class="pageBtm app-width xy-between al-start marginAuto">
                <div class="newArt">
                    <div class="artTitle containTitle">
                        最新文章
                    </div>
                    <hr style="background:#ddd;margin:0.7rem 0;" />
                    <div class="newArtList">
                        <div
                            style="display:block"
                            class="listItem fontSize5 pointer f-c-666 xy-between newArtListItem"
                            v-for="(item, index) in newInforListLeft.content"
                            :key="index"
                            @click="toArticleDetails(item)"
                        >
                            <a
                                :href="toArticleDetailsPath(item)"
                                style="display:none;"
                            ></a>
                            <span> [{{ item.contentType }}]</span>
                            <span style="margin-left:0.3rem" class="one-wrap">
                                {{ item.title }}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="newArt" style="margin-top: 2.75rem;">
                    <div class="newArtList">
                        <div
                            style="display:block"
                            class="listItem fontSize5 pointer f-c-666 xy-between newArtListItem"
                            v-for="(item, index) in newInforListRight.content"
                            :key="index"
                            @click="toArticleDetails(item)"
                        >
                            <a
                                :href="toArticleDetailsPath(item)"
                                style="display:none;"
                            ></a>
                            <span> [{{ item.contentType }}]</span>
                            <span style="margin-left:0.3rem" class="one-wrap">
                                {{ item.title }}
                            </span>
                        </div>
                    </div>
                </div>
                <!-- 互动学习 -->
                <div class="Interaction ">
                    <div class="containTitle textCenter">互动学习</div>
                    <img :src="zghQr" alt="" />
                    <p class="fontSize5 textCenter">关注公众号，学习更简单</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { Component } from "vue-property-decorator";
import LoginAndRegister from "@/components/LoginAndRegister.vue";
import { JsVuePage, JsVueComponent } from "@/vue";
import {
    recommendData,
    advLocationDetail,
    subjectDetail,
    curriculumDetail,
    configDetail,
    timeList,
    introductionList,
    findByIntentionAndRecommend,
    newArticle,
    userViewComment,
    mentoringCount,
    advDetailByLocationCode,
    createOrder,
    recommendCourse
} from "@/action";
import Video from "@/components/Video.vue";
import { mapState } from "vuex";
let maxWidth = 80;
export default {
    mixins: [JsVueComponent, JsVuePage],
    components: {
        Video
    },
    data() {
        return {
            banner: null,
            bannerList: [],
            indexCourses: [],
            indexLectures: [],
            activeLectureId: null,
            lecturecurriculum: null,
            lecturePalyer: true,
            playerStatus: null,
            showToTop: false,
            imageBox: [],
            timeList: {}, // 考试时间
            intrList: [], // 考试须知
            hotInforList: [],
            newInforListLeft: {
                currentPage: 1,
                content: [],
                recommend: "new",
                pageSize: 5
            },
            newInforListRight: {
                currentPage: 2,
                content: [],
                recommend: "new",
                pageSize: 5
            },
            hotInforImg: "",
            helpBox: {
                show: false,
                data: {},
                leaveStatus: 0
            },
            messageCount: 0,
            commentPage: {
                currentPage: 1,
                pageSize: 5,
                total: 0
            },
            teacherInfo: [],
            messageInfo: [
                {
                    headImg: require("@/assets/artDetails/headImg.png"),
                    nikeName: "爱吃水果的宋小姐",
                    comment:
                        " 张老师课程非常好理解，讲的由浅入深通俗易懂，小白用户非常推荐，张老师课程非常好理解，讲的由浅入深通俗易懂，小白用户非常推荐!"
                },
                {
                    headImg: require("@/assets/index/messHead.png"),
                    nikeName: "长颈鹿先生",
                    comment:
                        " 张老师课程非常好理解，讲的由浅入深通俗易懂，小白用户非常推荐，张老师课程非常好理解，讲的由浅入深通俗易懂，小白用户非常推荐!"
                },
                {
                    headImg: require("@/assets/img/headImg1.jpg"),
                    nikeName: "疯癫的科学家",
                    comment:
                        " 张老师课程非常好理解，讲的由浅入深通俗易懂，小白用户非常推荐，张老师课程非常好理解，讲的由浅入深通俗易懂，小白用户非常推荐!"
                },
                {
                    headImg: require("@/assets/img/headImg2.jpg"),
                    nikeName: "疯癫的科学家",
                    comment:
                        " 张老师课程非常好理解，讲的由浅入深通俗易懂，小白用户非常推荐，张老师课程非常好理解，讲的由浅入深通俗易懂，小白用户非常推荐!"
                }
            ],
            commentList: [],
            appQr: "",
            zghQr: "",
            showSoldHelp1: false,
            hoverFlag: 0,
            kfUrl: null
        };
    },
    created() {
        this.init(this.state.currentStudentIdeaId);
        this.loadComment();
        this.loadmentoringCount();
        this.loadIndexBanner();
        this.loadIndexTeacher();
    },
    mounted() {
        window.onscroll = () => {
            this.showToTop =
                (document.body.scrollTop ||
                    document.documentElement.scrollTop) > 100;
        };
        this.loadCanvas();
        this.loadIndexMessage();
    },
    methods: {
        toTop() {
            // 返回顶部
            document.body.scrollIntoView({ behavior: "smooth" });
        },
        clickSold() {
            // 立即购买跳转课程详情
            recommendCourse({
                lectureId: this.activeLectureId,
                studentIdeaId: this.currentStudentIdeaId
            }).then(courseDetail => {
                this.$router.push({
                    path: "/c-course/courseDetail",
                    query: {
                        id: courseDetail.id,
                        selectLectureType: "video",
                        lectureId: this.activeLectureId
                    }
                });
            });
        },
        init(studentIdeaId) {
            if (studentIdeaId) {
                this.loadStudentIdeaId = studentIdeaId;
                this.playerStatus = false;
                this.loadPcIndexCourse(studentIdeaId);
                this.loadPcIndexLecture(studentIdeaId);
                this.showExatime(this.currentStudentIdeaId);
                this.showIntroductionList(this.currentStudentIdeaId);
                this.showFindByIntentionAndRecommend(this.currentStudentIdeaId);
                this.showNewArticle(
                    this.currentStudentIdeaId,
                    this.newInforListLeft
                );
                this.showNewArticle(
                    this.currentStudentIdeaId,
                    this.newInforListRight
                );
                // this.loadRecourseList(studentIdeaId);
            }
        },

        toTeacherDetails(info, type) {
            this.$router.push({
                path: "/TeacherDetails",
                query: { id: info.recommendEntity.id, type: type }
            });
        },
        toTeacherDetailsPath(item, type) {
            return `/TeacherDetails?id=${item.recommendEntity.id}&type=${type}`;
        },
        toArticleDetails(item) {
            if (item.constructionType === 1) {
                this.$router.push({
                    path: "/ArticleDetails",
                    query: { articleId: item.id }
                });
            } else if (item.constructionType === 2) {
                let link = item.link;
                window.open(link);
            }
        },
        toArticleDetailsPath(item) {
            switch (item.constructionType) {
            case 1:
                return `/ArticleDetails?articleId=${item.id}`;
            case 2:
                return item.link;
            default:
                return "";
            }
        },
        loadComment() {
            // 获取学员评价
            userViewComment({
                ...this.commentPage,
                commentType: "commonComment",
                commentSourceType: "lecture ",
                commentSourceId: this.activeLectureId,
                detail: false,
                detailCount: 0,
                detailLike: false,
                relyDetailLike: false,
                currentUser: false,
                commentUserDetail: false,
                getTotalCount: false
            }).then(res => {
                // console.log(res, "学员评论");
            });
        },
        loadmentoringCount() {
            mentoringCount().then(res => {
                // console.log(res, "留言总数");
                this.messageCount = res.object;
            });
        },
        loadIndexBanner() {
            advDetailByLocationCode("pc-index-banner").then(res => {
                // console.log(res, "首页banner");
                this.bannerList = res;
            });
        },
        loadIndexTeacher() {
            // 获取老师信息
            advLocationDetail("pc-index-teacher").then(res => {
                recommendData("teacher", [
                    { ownerType: "advertisementLocation", id: res.id }
                ]).then(res => {
                    // console.log(res, "老师");
                    this.teacherInfo = res;
                });
            });
        },
        loadPcIndexCourse(studentIdeaId) {
            // 获取推荐课程
            if (studentIdeaId) {
                advLocationDetail("pc-index-course").then(advLocation => {
                    recommendData(
                        "course",
                        studentIdeaId
                            ? [
                                {
                                    ownerType: "advertisementLocation",
                                    id: advLocation.id
                                },
                                {
                                    ownerType: "studentIdea",
                                    id: studentIdeaId
                                }
                            ]
                            : [
                                {
                                    ownerType: "advertisementLocation",
                                    id: advLocation.id
                                }
                            ]
                    ).then(course => {
                        // console.log(course, "首页推荐课程")
                        this.indexCourses = course.map(
                            rec => rec.recommendEntity
                        );
                    });
                });
            }
        },
        loadPcIndexLecture(studentIdeaId) {
            if (studentIdeaId) {
                // 获取意向下的所有科目
                advLocationDetail("pc-index-subject-lecture").then(
                    advLocation => {
                        recommendData(
                            "lecture",
                            studentIdeaId
                                ? [
                                    {
                                        ownerType: "advertisementLocation",
                                        id: advLocation.id
                                    },

                                    {
                                        ownerType: "studentIdea",
                                        id: studentIdeaId
                                    }
                                ]
                                : [
                                    {
                                        ownerType: "advertisementLocation",
                                        id: advLocation.id
                                    }
                                ]
                        ).then(lectures => {
                            lectures = lectures.map(rec => {
                                return {
                                    ...rec.recommendEntity,
                                    subjects: null
                                };
                            });
                            // 设置讲座的科目
                            lectures.forEach(lecture => {
                                subjectDetail(lecture.subjectsId).then(
                                    subjects => {
                                        lecture.subjects = subjects;
                                    }
                                );
                            });
                            this.indexLectures = lectures;
                            this.lecturePalyer = true;
                            this.clickPlayerLecture(lectures[0]);
                        });
                    }
                );
            }
        },
        toKf() {
            window.open(this.kfUrl);
        },
        loadCanvas() {
            configDetail("pc-index-canvas-data").then(data => {
                this.drawEcharts1(data);
                this.canvasAction();
            });
        },
        clickPlayerLecture(lecture) {
            if (lecture && lecture.lectureType === "video") {
                curriculumDetail(lecture.entityId).then(curriculum => {
                    this.lecturecurriculum = curriculum;
                    this.activeLectureId = lecture.id;
                    this.playerStatus = true;
                });
            } else {
                this.lecturecurriculum = null;
                this.activeLectureId = null;
                this.lecturePalyer = false;
            }
        },
        drawEcharts1(sourceData) {
            let box = document.getElementById("echarts-question");
            let boxWidth = box.scrollWidth;
            let boxHeight = box.scrollHeight;
            let centerX = boxWidth / 2;
            let centerY = boxHeight / 2;
            let maxBoxWidth = boxWidth > boxHeight ? boxWidth : boxHeight;
            let minBoxWidth = boxWidth < boxHeight ? boxWidth : boxHeight;
            let sumI = Math.round(maxBoxWidth / 2 / maxWidth) - 1;
            // 环初始数据 保存可用弧度
            // 环占用数据 一个环的数据[[a,b],[a,b]] a位占用弧度位置 b为弧度宽度 根据a排序push
            let ringData = [];
            let ringInitData = [];
            for (let i = 0; i < sumI; i++) {
                let radius = (i + 1) * maxWidth;
                let b = minBoxWidth / 2;
                if (b >= radius) {
                    let c = Math.PI / 2;
                    ringInitData[i] = [
                        [-c, c],
                        [-c + Math.PI, c + Math.PI]
                    ];
                } else {
                    let a = Math.atan(b / Math.sqrt(radius * radius - b * b));
                    ringInitData[i] = [
                        [-a, a],
                        [-a + Math.PI, a + Math.PI]
                    ];
                }
                ringData[i] = [];
            }
            // 寻找可用范围 maxData环整体范围 useData环已使用范围(已排序) needWidth需求宽度
            let findAvailableData = (maxData, useData = [], needWidth) => {
                if (useData.length === 0) {
                    return maxData;
                }
                let result = [];
                let maxDataA = maxData[0];
                let maxDataB = maxData[1];
                for (let i = 0; i < useData.length; i++) {
                    let start = useData[i][0] - useData[i][1] / 2;
                    let end = useData[i][0] + useData[i][1] / 2;
                    // 0时前后都要比较
                    if (i === 0) {
                        if (maxDataA[1] > useData[i][0]) {
                            // 表明最大区间前区间已用
                            if (Math.abs(maxDataA[0] - start) >= needWidth) {
                                result.push([maxDataA[0], start]);
                            }
                        } else {
                            // 表明最大区间前区间未用
                            result.push(maxDataA);
                            // 那肯定时在后区间了
                            if (Math.abs(maxDataB[0] - start) >= needWidth) {
                                result.push([maxDataB[0], start]);
                            }
                        }
                    }
                    // 非零只向后比较
                    // 拿到后比较值
                    if (i < useData.length - 1) {
                        // 非最后一个块时拿后一个块的开始
                        // 判断后一个块是否和当前在同一区间
                        let spaceWidth;
                        let needEnd;
                        if (
                            (useData[i][0] < maxDataA[1] &&
                                useData[i + 1][0] < maxDataA[1]) ||
                            (useData[i][0] > maxDataB[0] &&
                                useData[i + 1][0] > maxDataB[0])
                        ) {
                            // 两个块在同一区间
                            spaceWidth =
                                useData[i + 1][0] - useData[i + 1][1] / 2 - end;
                            needEnd = useData[i + 1][0] - useData[i + 1][1] / 2;
                        } else {
                            spaceWidth = maxDataA[1] - end;
                            needEnd = maxDataA[1];
                        }
                        if (spaceWidth >= needWidth) {
                            result.push([end, needEnd]);
                        }
                    } else {
                        let comEnd;
                        // 最后一个块拿区间的最后
                        if (start > maxDataB[0]) {
                            // 最后一个在最大区间后区间
                            comEnd = maxDataB[1];
                        } else {
                            comEnd = maxDataA[1];
                            result.push(maxDataB);
                        }
                        if (comEnd - end >= needWidth) {
                            result.push([end, comEnd]);
                        }
                    }
                }
                return result;
            };
            let pushUsePoint = (index, location, width) => {
                let ringUserData = ringData[index];
                let status = false;
                let bak = [location, width];
                for (let i = 0; i < ringUserData.length; i++) {
                    let [a] = ringUserData[i];
                    if (a > location && !status) {
                        status = true;
                    }
                    if (status) {
                        let bak1 = ringUserData[i];
                        ringUserData[i] = bak;
                        bak = bak1;
                    }
                }
                ringUserData.push(bak);
                return location;
            };
            // 在换上寻找位置 找到返回角度，无返回null
            let findLocation = (index, width) => {
                let radius = (index + 1) * maxWidth;
                // 当前需求的角度
                let needRadius = Math.atan(width / radius) * 2;
                let ringUserData = ringData[index];
                // console.log("index:", index, " maxData:", ringInitData[index], " useData:", ringUserData, " needWidth:", needRadius);
                let canNeedData = findAvailableData(
                    ringInitData[index],
                    ringUserData,
                    needRadius
                );
                if (canNeedData.length === 0) {
                    // 未找到可用位置
                    return null;
                }
                let a3 = parseInt(Math.random() * canNeedData.length);
                let [start, end] = canNeedData[a3];
                start += needRadius / 2;
                end -= needRadius / 2;
                let result = start + Math.random() * (end - start);
                return pushUsePoint(
                    index,
                    start + Math.random() * (end - start),
                    needRadius
                );
            };
            let getXY = () => {
                // 随机到某个环上
                let index;
                // 头像随机宽度
                let count = 0;
                let a = 40;
                let b = 40;
                let itemWidth = parseInt(Math.random() * (a - count * 10) + b);
                // 去环上找空位
                let userIndex = [];
                // 拿到放置角度
                let resultRadius = null;
                for (; resultRadius === null;) {
                    if (userIndex.length >= sumI) {
                        count++;
                        if (count > 4) {
                            return null;
                        }
                        itemWidth = parseInt(
                            Math.random() * (a - count * 10) + b
                        );
                        userIndex = [];
                    }
                    index = parseInt(Math.random() * sumI);
                    if (userIndex.includes(index)) {
                        continue;
                    }
                    userIndex.push(index);
                    resultRadius = findLocation(index, itemWidth);
                }
                let ab = (maxWidth - itemWidth) / 2 - 5;
                ab = ab < 0 ? 0 : ab;
                // let randomWidth = (index + 1) * maxWidth;
                let randomWidth =
                    (index + 1) * maxWidth - ab + Math.random() * 2 * ab;
                let x = randomWidth * Math.cos(resultRadius);
                let y = randomWidth * Math.sin(resultRadius);
                return [centerX + x, centerY + y, itemWidth];
            };
            let id = 0;
            this.imageBox = sourceData
                .map(data => {
                    let result = getXY();
                    if (result) {
                        let [x, y, width] = result;
                        return {
                            x,
                            y,
                            width,
                            id: id++,
                            ...data,
                            img: this.coverImage(data.img)
                        };
                    } else {
                        console.warn("未找到位置");
                        return null;
                    }
                })
                .filter(ins => ins);
        },

        echartsMousemove(imageBox) {
            if (this.helpBox.show && this.helpBox.data.id === imageBox.id) {
                return;
            }
            this.helpBox.leaveStatus = 1;
            let { x, y, width } = imageBox;
            let box = document.getElementById("echarts-question");
            let boxWidth = box.scrollWidth;
            let boxHeight = box.scrollHeight;
            let fontSize = window
                .getComputedStyle(document.body, null)
                .fontSize.replace("px", "");
            let helpWidth = 10.38 * fontSize;
            // 计算提示框在箭头位置 1左下 2左上 3右下 4右上
            let status = 0;
            if (x + maxWidth + helpWidth > boxWidth) {
                // 右边溢出
                status = 2;
            }
            if (y > boxHeight / 2) {
                // 偏下边
                status += 1;
            } else {
                // 偏上边
                status += 2;
            }
            let helpBox = {
                data: imageBox,
                status,
                show: true,
                leaveStatus: 0
            };
            if (status < 3) {
                helpBox.x = x + maxWidth;
            } else {
                helpBox.x = x - helpWidth;
            }
            if (status % 2 === 1) {
                helpBox.y = boxHeight - y - 18 - maxWidth;
            } else {
                helpBox.y = y + maxWidth / 2 - 18;
            }
            this.helpBox = helpBox;
        },
        helpBoxLeave(type, id) {
            setTimeout(() => {
                if (id === this.helpBox.data.id) {
                    if (type) {
                        if (
                            this.helpBox.leaveStatus === 3 ||
                            this.helpBox.leaveStatus !== 4
                        ) {
                            this.helpBox.show = false;
                        }
                        this.helpBox.leaveStatus = 2;
                    } else {
                        if (
                            this.helpBox.leaveStatus === 2 ||
                            this.helpBox.leaveStatus === 4
                        ) {
                            this.helpBox.show = false;
                        }
                        this.helpBox.leaveStatus = 3;
                    }
                }
            }, 2);
        },
        canvasAction() {
            let old = {};
            let oldOpacity;
            let oldWidth;
            let work = () => {
                old.opacity = oldOpacity;
                old.width = oldWidth;
                let index = parseInt(Math.random() * this.imageBox.length);
                let imageBox = this.imageBox[index];
                if (imageBox.id === old.id) {
                    work();
                    return;
                }
                old = imageBox;
                oldOpacity = imageBox.opacity;
                oldWidth = imageBox.width;
                imageBox.opacity = 1;
                imageBox.width = maxWidth;
                this.echartsMousemove(imageBox);
                let i = 0;
                let interval = setInterval(() => {
                    i++;
                    if (
                        this.helpBox.leaveStatus !== 5 &&
                        this.helpBox.leaveStatus !== 4
                    ) {
                        if (i > 500) {
                            this.helpBox.show = false;
                            clearInterval(interval);
                            setTimeout(() => {
                                work();
                            }, 10);
                        }
                    } else {
                        old.opacity = oldOpacity;
                        old.width = oldWidth;
                    }
                }, 10);
            };
            work();
        },
        showExatime(studentIdeaId) {
            // console.log(studentIdeaId);
            if (studentIdeaId) {
                timeList(studentIdeaId).then(res => {
                    this.timeList = res;
                    // console.log(this.timeList, 9611111);
                });
            }
        },
        showIntroductionList(studentIdeaId) {
            let param = {
                studentIdeaId: studentIdeaId,
                currentPage: 1,
                pageSize: 9999
            };
            introductionList(param).then(res => {
                this.intrList = res.content;
                // console.log(this.intrList, "考试注意");
            });
        },
        showFindByIntentionAndRecommend(studentIdeaId) {
            let param = {
                studentIdeaId: studentIdeaId,
                recommend: "home",
                currentPage: 1,
                pageSize: 5
            };
            findByIntentionAndRecommend(param).then(res => {
                // 获取热门文章
                // console.log(res, 9900000);
                this.hotInforList = res.content;
                // console.log(this.hotInforList, 9888888);
                this.hotInforList.forEach(hotInforListItem => {
                    if (hotInforListItem.images !== null) {
                        let hotInforImg = hotInforListItem.images.split(",");
                        hotInforListItem.hotInforImg = hotInforImg[0];
                        let contentType = hotInforListItem.contentType;
                        if (contentType === "activity") {
                            contentType = "活动";
                        } else if (contentType === "information") {
                            contentType = "资讯";
                        } else if (contentType === "dynamic") {
                            contentType = "动态";
                        } else if (contentType === "instruction") {
                            contentType = "考试须知";
                        } else {
                            contentType = "发现";
                        }
                        hotInforListItem.contentType = contentType;
                    }
                });
            });
        },
        showNewArticle(studentIdeaId, info) {
            findByIntentionAndRecommend({
                studentIdeaId: studentIdeaId,
                recommend: info.recommend,
                currentPage: info.currentPage,
                pageSize: info.pageSize
            }).then(res => {
                // console.log(res, "文章列表")
                res.content.forEach(item => {
                    if (item.labels.length !== 0) {
                        let label = item.labels[0].name;
                        item.label = label;
                    }
                    if (item.images !== null) {
                        let image = item.images.split(",")[0];
                        item.image = image;
                    }
                    if (item.contentType === "activity") {
                        item.contentType = "活动";
                    } else if (item.contentType === "information") {
                        item.contentType = "资讯";
                    } else if (item.contentType === "dynamic") {
                        item.contentType = "动态";
                    } else if (item.contentType === "instruction") {
                        item.contentType = "考试须知";
                    } else {
                        item.contentType = "发现";
                    }
                });
                if (info.currentPage === 1) {
                    this.newInforListLeft.content = res.content;
                } else if (info.currentPage === 2) {
                    this.newInforListRight.content = res.content;
                }
            });
        },

        toFound() {
            this.$router.push({
                path: "/found"
            });
        },
        loadIndexMessage() {
            configDetail("pc-index-keywork-cswx").then(keywork => {
                this.seoKeywords(keywork || "");
            });
            configDetail("pc-index-description-cswx").then(description => {
                this.seoDescription(description);
            });
            configDetail("pc-footer-app-qr").then(appQr => {
                this.appQr = appQr;
            });
            configDetail("pc-zgh-qr").then(zghQr => {
                this.zghQr = zghQr;
            });
            configDetail("pc-index-contact-customer-service").then(kfUrl => {
                this.kfUrl = kfUrl;
            });
        }
    },
    watch: {
        "state.currentStudentIdeaId": function(studentIdeaId) {
            this.init(studentIdeaId);
        }
    },
    computed: {
        ...mapState({
            currentStudentIdeaId: state => state.currentStudentIdeaId
        }),
        spaceTime() {
            if (!this.timeList.time) {
                return 0;
            }
            let result = new Date(this.timeList.time) - new Date();
            return result < 0 ? 0 : parseInt(result / 24 / 3600 / 1000);
        }
    }
};
</script>

<style scoped lang="scss">
/* 产品板块 */
// 侧边栏
.sideBar {
    position: fixed;
    right: 0;
    bottom: 10%;
    right: 5%;
    bottom: 1%;
    z-index: 9999999;
}
.sideBar > div {
    margin: 0.5rem 0;
    position: relative;
}
.sideBar .text,
.sideBar .iconImg {
    border-radius: 0.08rem;
    width: 2.08rem;
    height: 2.08rem;
}
.iconImg img {
    width: 100%;
    height: 100%;
}
.sideBar .text {
    box-sizing: border-box;
    font-size: 0.5rem;
    color: #fff;
    background: #96c321;
    text-align: center;
    line-height: 2.08rem;
    // position: absolute;
    // top: 0;
}
.sideBar .iconImg {
    border: 1px solid #f7f8fa;
    padding: 0.5rem;
    background: #fff;
}
.kf:hover .iconImg,
.toTop:hover .iconImg {
    opacity: 0;
}
.kf:hover .text,
.toTop:hover .text {
    opacity: 1;
}
.sideBar .appcode,
.sideBar .gzhcode {
    position: absolute;
    width: 5.58rem;
    height: 6.17rem;
    background: rgba(255, 255, 255, 1);
    box-shadow: 1px 1px 1px #ddd;
    right: 78px;
}
.sideBar .appcode {
    top: -41px;
}
.sideBar .gzhcode {
    top: -43px;
}
// .downloadApp:hover .appcode {
//     opacity: 1;
// }

// .gzh:hover .gzhcode {
//     opacity: 1;
// }

.prd .prdItem {
    padding: 0.5rem;
    width: 25%;
    box-sizing: border-box;
}
.prdItem:hover .PrdText {
    color: #fff !important;
}

.prditem1 {
    border-top: 0.13rem solid #32bdcd;
}
.prditem1:hover {
    background: #32bdcd;
}
.prditem1:hover .PrdText {
    color: #fff;
}
.prditem2 {
    border-top: 0.13rem solid #cdc032;
}
.prditem2:hover {
    background: #cdc032;
}
.prditem3 {
    border-top: 0.13rem solid #ce3286;
}
.prditem3:hover {
    background: #ce3286;
}
.prditem4 {
    border-top: 0.13rem solid #82cd32;
}
.prditem4:hover {
    background: #82cd32;
}
.prdItem .PrdText {
    margin-left: 0.83rem;
}
.PrdText h4 {
    line-height: 0.8rem;
}
.PrdText p {
    margin-top: 0.38rem;
}
.inimg {
    position: absolute;
    opacity: 0;
}
.prdItem:hover .inimg {
    opacity: 1;
}
/* 广告部分 */
.addList {
    padding: 2.08rem 0 2.25rem;
}
.additem {
    width: 15.83rem;
    // height: 5.33rem;
    margin-bottom: 2.25rem;
}
.additem img {
    height: 200px;
}
.additem h4 {
    margin: 0.5rem 0;
    line-height: 0.7rem;
}
.additem p {
    line-height: 0.75rem;
    font-size: 0.5rem;
}
.contain {
    margin-top: 1rem;
}
.containTitle {
    font-size: 1rem;
}

/* 试看部分 */
.trySee {
    padding: 1.5rem 0;
}
.videoTitle {
    padding: 0.63rem;
    background: #000;
    color: #fff;
    font-size: 0.58rem;
}
.videoTitle .vtitem {
    width: 5.42rem;
    height: 1.25rem;
    border-radius: 0.63rem;
}
.vtitem:hover {
    background-color: #82cd32;
}
.notice {
    padding: 0.92rem 0.58rem;
    color: #fff;
}
.notice h5 {
    margin: 0.6rem 0;
}
.hotInfo {
    margin-top: 0.5rem;
}
.infoTitle {
    padding: 0.3rem 0.55rem;
}
.infoTitle span {
    margin-left: 8rem;
}
.infoList {
    margin-top: 1px;
    padding: 0.42rem 0.5rem;
    height: 9.87rem;
    overflow-y: auto;
}
.infoList .hotInfoItem {
    margin-top: 0.5rem;
}
.infoList img {
    width: 18%;
    height: 2.08rem;
}
.infoList p {
    margin-left: 0.2rem;
    width: 80%;
}
.message {
    margin-top: 0.42rem;
    padding: 0.33rem 0.5rem;
}
.nickName {
    line-height: 2.08rem;
    margin-left: 0.6rem;
}
/* 学习问题 */
.LearningProblems {
    padding: 3.2rem 0 4.2rem;
}
/* 名师指导 */
.teacher {
    padding: 2.2rem 0;
}
.teacherList {
    margin-top: 2.25rem;
}
.teacherItem {
    width: 22%;
}
.tchInfo {
    margin-top: 1rem;
}
.tchInfo h5 {
    margin: 0.3rem 0 0.6rem;
}
.tchInfo p {
    line-height: 1rem;
}
.share {
    margin-top: 0.67rem;
}
.share .left .s-icon {
    margin-right: 0.58rem;
}
.s-icon > img {
    width: 1.04rem;
    height: 1.04rem;
}
.lineCourse {
    width: 3.67rem;
    height: 1rem;
    padding: 0.2rem 0.38rem;
    margin-left: 3.6rem;
    margin-top: 0.5rem;
}
.lineCourse:hover {
    background: #96c321;
}
.lineCourse img {
    width: 0.67rem;
    height: 0.63rem;
    margin-right: 0.2rem;
}
/* 文章部分 */
.pageBtm {
    padding: 3rem 0;
}
.Interaction img {
    width: 6.25rem;
    height: 6.25rem;
    border: 1px dashed #333;
    margin: 0.8rem 0;
}
.student-question-body {
    padding-bottom: 3rem;
}
#echarts-question {
    height: 17rem;
    position: relative;
    z-index: 0;
}
.echarts-item {
    position: absolute;
    border-radius: 50%;
    overflow: hidden;
    transition: width, height, opacity 0.5s, 0.5s, 1s;
}
.echarts-item:hover {
    opacity: 1 !important;
    width: 80px !important;
    height: 80px !important;
}
.newArtListItem:hover {
    color: #96c321;
}

.pageBtm .listItem {
    line-height: 1.25rem;
    border-bottom: 1px solid #ddd !important;
}
.help-box-root {
    z-index: 1;
    position: absolute;
    width: calc(10.38rem + 20px);
}
.help-box {
    z-index: 1;
    position: absolute;
    padding: 0.54rem;
    width: 10.38rem;
    border-width: 1px;
    border-style: solid;
}
.help-box .line {
    width: 100%;
    height: 1px;
    background-color: #f5f5f5;
    margin: 0.42rem 0;
}

.help-box-left::before {
    content: " ";
    border-left: 10px solid transparent;
    border-top: 10px solid transparent;
    border-right: 10px solid #96c321;
    border-bottom: 10px solid transparent;
    position: absolute;
    left: -20px;
}

.help-box-left::after {
    content: " ";
    border-left: 10px solid transparent;
    border-top: 10px solid transparent;
    border-right: 10px solid #ffffff;
    border-bottom: 10px solid transparent;
    position: absolute;
    left: -19px;
}
.help-box-right::before {
    content: " ";
    border-left: 10px solid #96c321;
    border-top: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid transparent;
    position: absolute;
    right: -20px;
}

.help-box-right::after {
    content: " ";
    border-left: 10px solid #ffffff;
    border-top: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid transparent;
    position: absolute;
    right: -19px;
}
.help-box-top::before {
    top: 18px;
}
.help-box-top::after {
    top: 18px;
}

.help-box-bottom::before {
    bottom: 18px;
}
.help-box-bottom::after {
    bottom: 18px;
}
.commentCarouse {
    height: 5rem;
    margin-top: 0.42rem;
    background: #fff;
    padding: 0.5rem;
}

.el-carousel__arrow el-carousel__arrow--left {
    display: none !important;
}
.commentCarouse {
    .headImg {
        width: 2.08rem;
        height: 2.08rem;
        border-radius: 50%;
    }
}
</style>
