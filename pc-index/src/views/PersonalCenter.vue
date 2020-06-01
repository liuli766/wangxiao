<template>
    <div class="app-width xy-center jf-start al-start">
        <div class="sideBar b-c-fff" ref="sideBar">
            <div
                class="boxlist"
                v-for="(item, index) in activeNavs"
                :key="index"
            >
                <h5 class="fontSize75 FW600">{{ item.name }}</h5>
                <div
                    class="fontSize58 subtit pointer"
                    v-for="(subitem, n) in item.children"
                    :key="n"
                    @click="activeNav = subitem.key"
                    :class="{ borderleft: subitem.key === activeNav }"
                >
                    {{ subitem.name }}
                </div>
            </div>
        </div>
        <div
            class="Contant b-c-fff"
            style="width:80%;"
            :class="{ Contant1: clientMax }"
        >
            <!-- 我的订单 -->
            <div v-show="activeNav === 'myOrder'">
                <h4 class="fontSize92 f-c-333 FW600">我的订单</h4>
                <el-tabs v-model="orderPayStatus">
                    <el-tab-pane
                        v-for="tab in orderTab"
                        :key="tab.key"
                        :label="tab.name"
                        :name="tab.key"
                        :before-leave="haveLoading"
                    >
                        <div
                            class="l-content order-content"
                            style="overflow:auto"
                        >
                            <div
                                class="lineheight46 fontSize58 xy-between f-c-9d"
                            >
                                <span class="width50 kc">订单详情</span>
                                <div class="width50 sp xy-between">
                                    <span class="auto-grow xy-center"
                                        >价格</span
                                    >
                                    <span class="auto-grow xy-center"
                                        >状态</span
                                    >
                                    <span class="auto-grow xy-center"
                                        >操作</span
                                    >
                                </div>
                            </div>
                            <div
                                v-for="(order, index) in orderListData[tab.key]
                                    .data"
                                :key="index"
                                class="xy-between shoplist-box"
                            >
                                <div class="flex l-shop  width50">
                                    <img
                                        :src="coverImage(order.course.icon)"
                                        alt=""
                                        style="width:5.08rem; height:2.83rem;"
                                    />
                                    <div>
                                        <h4 class="FW600 fontSize58 f-c-333">
                                            {{ order.course.name }}
                                        </h4>
                                        <div class="fontSize5 f-c-666">
                                            {{ order.createTime }}
                                        </div>
                                    </div>
                                </div>
                                <div class="width50 sp fontSize58 xy-between">
                                    <span class="f-c-333 auto-grow xy-center">
                                        ￥{{ (order.oldPrice || 0).toFixed(2) }}
                                    </span>
                                    <span
                                        class="f-c-9d auto-grow xy-center"
                                        :style="{
                                            color:
                                                orderStatus[order.orderStatus]
                                                    .color
                                        }"
                                    >
                                        {{
                                            orderStatus[order.orderStatus].desc
                                        }}
                                    </span>
                                    <div
                                        class="auto-grow f-c-9d yx-center"
                                        v-loading="order.loading"
                                    >
                                        <el-button
                                            @click="deleteOrder(order)"
                                            v-show="
                                                order.orderStatus ===
                                                    'waitPay' ||
                                                    order.orderStatus ===
                                                        'expired' ||
                                                    order.orderStatus === 'fail'
                                            "
                                            type="text"
                                            style="color:#FF3434;"
                                            >删除</el-button
                                        >
                                        <el-button
                                            v-show="
                                                order.orderStatus ===
                                                    'success' ||
                                                    order.orderStatus ===
                                                        'end' ||
                                                    order.orderStatus ===
                                                        'waitSign'
                                            "
                                            type="text"
                                            style="color:#333;"
                                            >评价</el-button
                                        >
                                        <el-button
                                            @click="
                                                go(
                                                    '/c-course/courseDetail?id=' +
                                                        order.orderDetail[0]
                                                            .entityId
                                                )
                                            "
                                            v-show="
                                                order.orderStatus ===
                                                    'success' ||
                                                    order.orderStatus ===
                                                        'end' ||
                                                    order.orderStatus ===
                                                        'waitSign' ||
                                                    order.orderStatus === 'fail'
                                            "
                                            type="text"
                                            style="color:#333;"
                                            >再次购买</el-button
                                        >
                                        <el-button
                                            @click="
                                                go(
                                                    '/c-course/Buy?orderId=' +
                                                        order.id
                                                )
                                            "
                                            v-show="
                                                order.orderStatus === 'waitPay'
                                            "
                                            type="text"
                                            style="color:#333;"
                                            >立即付款</el-button
                                        >
                                    </div>
                                </div>
                            </div>
                            <div
                                v-if="orderListData[tab.key].orderLoad"
                                class="order-load xy-center fontSize75 f-c-root"
                            >
                                <span class="el-icon-loading"></span>加载中···
                            </div>
                            <div
                                v-if="
                                    orderListData[tab.key].noMore &&
                                        orderListData[tab.key].data.length > 0
                                "
                                class="order-load xy-center fontSize75 f-c-root"
                            >
                                没有更多了
                            </div>

                            <div
                                v-if="
                                    orderListData[tab.key].data.length === 0 &&
                                        orderListData[tab.key].work
                                "
                                class="order-load xy-center fontSize75 f-c-root"
                            >
                                没有数据
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <!-- 我的收藏 -->
            <div v-show="activeNav === 'myCollection'">
                <h4 class="fontSize92 f-c-333">我的收藏</h4>
                <hr style="background:#E2E2E2; margin-top:0.92rem" />
                <div class="l-content collent">
                    <div class="lineheight46 fontSize58 xy-between">
                        <span class="width50 kc">视频名称</span>
                        <div class="width50 sp">
                            <span>收藏时间</span><span>收藏</span>
                        </div>
                    </div>
                    <div
                        v-for="(item, index) in collectionList"
                        :key="index"
                        class="xy-between shoplist-box"
                    >
                        <div
                            v-if="item.sourceModel"
                            class="flex l-shop  width50"
                        >
                            <img
                                :src="
                                    coverImage(item.sourceModel.entity.coverUrl)
                                "
                                alt=""
                                style="width:5.08rem; height:2.83rem;border-radius:0.25rem;"
                            />
                            <div class="fontSize58">
                                <h4 class="FW600">
                                    {{ item.sourceModel.name }}
                                </h4>
                                <div>2019-09-25</div>
                            </div>
                        </div>
                        <div class="width50 sp fontSize58 xy-center">
                            <span class="f-c-9d">{{ item.createTime }}</span>
                            <el-button
                                @click="cancelCollection(item)"
                                type="text"
                                :loading="item.clickCancelLoading"
                                style="color:#333;"
                                >取消收藏</el-button
                            >
                        </div>
                    </div>
                </div>
            </div>
            <!-- 个人资料 -->
            <div v-show="activeNav === 'personalData'">
                <h4 class="fontSize92 f-c-333">个人资料</h4>
                <hr style="background:#E2E2E2; margin: 1rem 0" />
                <el-form ref="userInfo" :model="userInfo">
                    <div class="fontSize58 xy-between jf-start perdata">
                        <div class="title">头像：</div>
                        <div class="headbox">
                            <el-upload
                                class="avatar-uploader"
                                action="/api/v3/api/upload/image"
                                :show-file-list="false"
                                :on-success="handleAvatarSuccess"
                            >
                                <img
                                    :src="coverImage(userInfo.headerUrl)"
                                    class="avatar"
                                />
                                <div
                                    class="headport f-c-fff fontSize5"
                                    style="margin-top:0.3rem;"
                                >
                                    更换头像
                                </div>
                            </el-upload>
                        </div>
                    </div>
                    <div class="fontSize58 xy-between jf-start perdata">
                        <div class="title">用户名：</div>
                        <div style="width:13.58rem;">
                            <el-input v-model="userInfo.nickname"></el-input>
                        </div>
                    </div>
                    <div class="fontSize58 xy-between jf-start perdata">
                        <div class="title">性别：</div>
                        <el-radio v-model="userInfo.sex" label="boy"
                            >男</el-radio
                        >
                        <el-radio v-model="userInfo.sex" label="girl"
                            >女</el-radio
                        >
                    </div>
                    <div class="fontSize58 xy-between jf-start perdata">
                        <div class="title">生日：</div>
                        <el-date-picker
                            v-model="userInfo.birthday"
                            type="date"
                            placeholder="选择日期"
                            value-format="yyyy-MM-dd">
                        >
                        </el-date-picker>
                    </div>
                    <el-button
                        type="primary"
                        size="medium"
                        class="btn"
                        @click="updateInfo"
                        >保存设置</el-button
                    >
                </el-form>
            </div>
            <!-- 评论点赞 -->
            <!-- <div v-show="activeNav === 'commentLike'">
                <h4 class="fontSize92 f-c-333">评论点赞</h4>
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="赞" name="first">
                        <div class="l-content fontSize58">
                            <div class="lineheight46 f-c-9d xy-between">
                                <span class="width50 kc">帖子名称</span>
                                <div class="width50 sp"><span>操作</span></div>
                            </div>
                            <div
                                v-for="(item, index) in shoplist"
                                :key="index"
                                class="xy-between shoplist-box f-c-333"
                            >
                                <div class="flex l-shop  width50">
                                    <div class="fontSize58">
                                        <p>中级教师资格理论培训.doc</p>
                                    </div>
                                </div>
                                <div class="width50 sp fontSize58">
                                    <img src="" alt="" />
                                    <span>樊老师</span>
                                    <span class="f-c-9d"
                                        >评论了你的帖子：很好</span
                                    >
                                </div>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="评论" name="second"></el-tab-pane>
                </el-tabs>
            </div> -->
            <!-- 意见反馈 -->
            <div v-show="activeNav === 'feedBack'">
                <h4 class="fontSize92 f-c-333">意见反馈</h4>
                <hr style="background:#E2E2E2; margin:0.92rem 0" />
                <div class="fontSize58 xy-between jf-start perdata">
                    <div class="title">反馈类型：</div>
                    <div style="width:13.58rem;">
                        <el-radio-group v-model="feedBack.type">
                            <el-radio label="bug">bug</el-radio>
                            <el-radio label="advice">意见</el-radio>
                            <el-radio label="other">其它</el-radio>
                        </el-radio-group>
                    </div>
                </div>

                <el-form
                    :model="feedBack"
                    status-icon
                    :rules="rules"
                    ref="feedBack"
                    label-width="100px"
                >
                    <div style="width:13.58rem;">
                        <el-form-item label="姓名:" prop="name">
                            <el-input
                                v-model="feedBack.name"
                                autocomplete="off"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="联系方式:" prop="contact">
                            <el-input
                                v-model="feedBack.contact"
                                autocomplete="off"
                            ></el-input>
                        </el-form-item>
                    </div>
                    <div style="width:35.42rem;">
                        <el-form-item label="内容:" prop="content">
                            <el-input
                                type="textarea"
                                rows="10"
                                v-model="feedBack.content"
                                placeholder="请填写您的意见，我们将为您提供更优质的服务"
                                resize="none"
                                autocomplete="off"
                            ></el-input>
                        </el-form-item>
                    </div>
                    <el-form-item>
                        <el-button
                            type="primary"
                            size="medium"
                            class="btn"
                            style="margin-left:18.58rem"
                            @click="submitFeedBack('feedBack')"
                            >提交</el-button
                        >
                    </el-form-item>
                </el-form>
            </div>
            <!-- 系统消息 -->
            <div v-show="activeNav === 'systemMessage'">
                <h4 class="fontSize92 f-c-333">系统消息</h4>
                <hr style="background:#E2E2E2; margin-top:0.92rem" />
                <div class="l-content collent">
                    <div
                        v-for="(item, index) in systemMessage.content"
                        :key="index"
                        class="xy-between shoplist-box"
                        @click="showSystemMessage(index)"
                    >
                        <div class="l-shop" style="width:100%;">
                            <div class="fontSize58 xy-center">
                                <div
                                    style="width:20%;"
                                    class="fontSize5 f-c-9d"
                                >
                                    {{ item.createDate }}
                                </div>
                                <p
                                    class="fontSize58 f-c-333 pointer one-wrap"
                                    style="width:80%;"
                                >
                                    {{ item.noticeBody }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <el-pagination
                    style="margin-top:0.5rem;text-align: center;"
                    background
                    layout="prev, pager, next"
                    :page-size="systemMessage.size"
                    :total="systemMessage.total"
                    @current-change="systemMessageChange"
                >
                </el-pagination>
            </div>
            <Dialog title="系统消息" :visible.sync="dialogVisible" width="40%">
                <div class="dialog fontSize58 f-c-333">
                    <p style="margin:1.79rem 0 1.5rem 0">
                        标题 ： {{ systemMessage.itemContent.typeName }}通知
                    </p>
                    <p>内容 ： {{ systemMessage.itemContent.noticeBody }}</p>
                    <div class="time">
                        {{ systemMessage.itemContent.createTime }}
                    </div>
                    <div
                        slot="footer"
                        class="dialog-footer xy-center full-width"
                    >
                        <el-button
                            style="width:6.67rem"
                            type="primary"
                            @click="dialogVisible = false"
                            >确 定
                        </el-button>
                    </div>
                </div>
            </Dialog>
        </div>
    </div>
</template>
<script>
import Dialog from "@/components/Dialog.vue";
import { JsVuePage, JsVueComponent, JsVueBaseApi } from "@/vue";
import { mapState } from "vuex";
import {
    userOrder,
    courseDetail,
    orderCancel,
    userCollection,
    lectureDetail,
    personalFeedBack,
    messageSystem,
    updateInfo
} from "@/action";
export default {
    mixins: [JsVueComponent, JsVuePage, JsVueBaseApi],
    components: {
        Dialog
    },
    data() {
        return {
            title: "个人中心",
            activeNav: null,
            activeNavs: [
                {
                    name: "订单管理",
                    children: [
                        {
                            key: "myOrder",
                            name: "我的订单"
                        }
                    ]
                },
                {
                    name: "学习管理",
                    children: [
                        {
                            key: "myCollection",
                            name: "我的收藏"
                        }
                    ]
                },
                {
                    name: "其他",
                    children: [
                        {
                            key: "personalData",
                            name: "个人资料"
                        },
                        // {
                        //     key: "commentLike",
                        //     name: "评论点赞"
                        // },
                        {
                            key: "feedBack",
                            name: "意见反馈"
                        },
                        {
                            key: "systemMessage",
                            name: "系统消息"
                        }
                    ]
                }
            ],
            orderStatus: {
                waitPay: {
                    color: "#f9a23b",
                    desc: "等待支付"
                },
                waitSend: {
                    color: "#e8dc1c",
                    desc: "待发货"
                },
                waitSign: {
                    color: "#d451ff",
                    desc: "待签收"
                },
                success: {
                    color: "#43bd51",
                    desc: "成功"
                },
                end: {
                    color: "#43bd51",
                    desc: "成功"
                },
                fail: {
                    color: "#fb4e4e",
                    desc: "失败"
                },
                expired: {
                    color: "#b1b3b7",
                    desc: "已过期"
                },
                delete: {
                    color: "#d451ff",
                    desc: "用户删除"
                },
                cancel: {
                    color: "#e8dc1c",
                    desc: "已取消"
                }
            },
            activeName: "first",
            dialogVisible: false,
            collectionList: [],
            shoplist: [
                {
                    img: require("../assets/img/1.png"),
                    title: "笔试精讲班【推荐】-教育知识【幼儿】",
                    ypricce: "368",
                    yh: 0,
                    price: 368
                }
            ],
            headerOpenData: {
                head: false
            },
            flag: {},
            orderPayStatus: "all",
            orderTab: [
                {
                    name: "全部订单",
                    key: "all"
                },
                {
                    name: "待付款",
                    key: "waitPay"
                },
                {
                    name: "已付款",
                    key: "paySuccess"
                }
            ],
            orderListData: {
                all: {
                    data: [],
                    noMore: false,
                    currentPage: 1,
                    pageSize: 5,
                    orderLoad: false,
                    work: false
                },
                waitPay: {
                    data: [],
                    noMore: false,
                    currentPage: 1,
                    pageSize: 5,
                    orderLoad: false,
                    work: false
                },
                paySuccess: {
                    data: [],
                    noMore: false,
                    currentPage: 1,
                    pageSize: 5,
                    orderLoad: false,
                    work: false
                }
            },
            clientMax: true,
            userInfo: {},
            feedBack: {
                type: "bug",
                name: "",
                contact: "",
                content: ""
            },
            rules: {
                name: [
                    {
                        required: false,
                        message: "请输入您的姓名",
                        trigger: "blur"
                    }
                ],
                contact: [
                    {
                        required: false,
                        message: "请输入您的联系方式",
                        trigger: "blur"
                    }
                ],
                content: [
                    {
                        required: true,
                        message: "请填写您的反馈意见",
                        trigger: "blur"
                    }
                ]
            },
            systemMessage: {
                size: 6,
                total: 0,
                currentPage: 1,
                content: [],
                itemContent: {}
            }
        };
    },

    computed: {
        ...mapState({
            userLoginStatus: state => state.userLoginStatus,
            currentUser: state => state.currentUser
        })
    },
    created() {
        this.userInfo = null;
        this.activeNav = this.$route.query.activeNav || "myOrder";
        // console.log(this.currentUser, 664888888)
        let userInfo1 = JSON.stringify(this.currentUser);
        this.userInfo = JSON.parse(userInfo1);
        // console.log(this.userInfo, 71666666);
    },
    mounted() {
        this.loadOrder();
        this.registerScrollEvent();
        this.sideBar();
    },
    watch: {
        orderPayStatus() {
            this.loadOrder();
        },
        activeNav(activeNav) {
            if (activeNav === "myCollection") {
                this.loadMyColloection();
            } else if (activeNav === "systemMessage") {
                this.loadSystemMessage(this.systemMessage);
            }
        }
    },
    methods: {
        showSystemMessage(index) {
            this.dialogVisible = true;
            // console.log(item, "消息详情7444")
            this.systemMessage.itemContent = this.systemMessage.content[index];
            // console.log(this.itemContent)
        },
        haveLoading() {
            return !(
                this.orderListData.all.data.filter(o => o.loading).length > 0 ||
                this.orderListData.waitPay.data.filter(o => o.loading).length >
                    0 ||
                this.orderListData.paySuccess.data.filter(o => o.loading)
                    .length > 0
            );
        },
        deleteOrder(order) {
            order.loading = true;
            orderCancel({
                orderId: order.id,
                type: "delete"
            })
                .then(res => {
                    setTimeout(() => {
                        this.orderListData.all.data = this.orderListData.all.data.filter(
                            o => o.id !== order.id
                        );
                        this.orderListData.waitPay.data = this.orderListData.waitPay.data.filter(
                            o => o.id !== order.id
                        );
                        this.orderListData.paySuccess.data = this.orderListData.paySuccess.data.filter(
                            o => o.id !== order.id
                        );
                    }, 5000);
                })
                .catch(e => {
                    this.$message.error("订单删除失败");
                })
                .finally(() => {
                    setTimeout(() => {
                        order.loading = false;
                    }, 5000);
                });
        },
        sideBar() {
            // 侧边栏滚动监听
            let sideBar = this.$refs.sideBar;
            let sideBarHeight =
                sideBar.scrollHeight +
                9.08 *
                    window
                        .getComputedStyle(document.body)
                        .fontSize.split("px")[0];
            let sideTop = sideBar.offsetTop;
            let client = document.documentElement.clientHeight;
            // console.log(sideBarHeight, sideTop, client, 4611111);
            if (client < sideBarHeight + sideTop) {
                sideBar.style.position = "static";
                sideBar.style.marginBottom = "0.75rem";
                this.clientMax = false;
            } else {
                let header = document.getElementById("appHeader");
                let footer = document.getElementById("appFooter");
                let contentHeight =
                    document.documentElement.clientHeight -
                    header.scrollHeight -
                    footer.scrollHeight;
                let domHeight =
                    contentHeight -
                    2 *
                        window
                            .getComputedStyle(document.body)
                            .fontSize.split("px")[0];
                sideBar.style.height = domHeight + "px";
            }
        },
        cancelCollection(item) {
            item.clickCancelLoading = true;
            this.clickCollection(
                item.collectionSourceType,
                item.collectionSourceId
            )
                .then(r => {
                    this.collectionList = this.collectionList.filter(
                        c => c.id !== item.id
                    );
                })
                .finally(() => {
                    item.clickCancelLoading = false;
                });
        },
        handSubtit(index, n) {
            // 侧边栏切换
            this.subnum = n;
            this.prenum = index;
            // console.log(index, n);
        },
        handleClick(tab, event) {
            // console.log(tab, event);
        },
        clickOrderTab(orderPayStatus) {},
        registerScrollEvent() {
            window.onscroll = () => {
                var marginBot = 0;
                if (document.documentElement.scrollTop) {
                    var X = document.documentElement.scrollHeight;
                    var Y =
                        document.documentElement.scrollTop +
                        document.body.scrollTop;
                    var Z = document.documentElement.clientHeight;
                    marginBot = X - Y - Z;
                } else {
                    var J = document.body.scrollHeight;
                    var I = document.body.scrollTop;
                    var K = document.body.clientHeight;
                    marginBot = J - I - K;
                }
                if (marginBot <= 0) {
                    this.loadOrder();
                }
            };
        },
        loadMyColloection() {
            userCollection({
                sourceType: "lecture",
                sourceDetail: false
            }).then(res => {
                this.collectionList = res.records.map(c => {
                    return {
                        ...c,
                        clickCancelLoading: false
                    };
                });
                this.collectionList.forEach(async collection => {
                    collection.sourceModel = await lectureDetail(
                        collection.collectionSourceId,
                        true
                    );
                });
            });
        },
        loadOrder() {
            let orderData = this.orderListData[this.orderPayStatus];
            if (orderData.orderLoad || orderData.noMore) {
                return;
            }
            orderData.orderLoad = true;
            userOrder({
                currentPage: orderData.currentPage,
                pageSize: orderData.pageSize,
                payStatus:
                    this.orderPayStatus === "all" ? null : this.orderPayStatus,
                detail: true
            })
                .then(async result => {
                    let list = result;
                    // console.log(list, 5400000);
                    if (list && list.length > 0) {
                        return Promise.all(
                            list.map(async order => {
                                let course = {};
                                if (
                                    order.orderDetail[0].entityType === "course"
                                ) {
                                    course = await courseDetail({
                                        courseId: order.orderDetail[0].entityId,
                                        tagDetail: true
                                    });
                                }
                                return {
                                    ...order,
                                    course,
                                    loading: false
                                };
                            })
                        )
                            .then(data => {
                                orderData.data.push(...data);
                                orderData.currentPage++;
                                // 是否继续加载
                                if (
                                    document.documentElement.scrollHeight <=
                                    document.documentElement.clientHeight
                                ) {
                                    orderData.orderLoad = false;
                                    this.loadOrder();
                                }
                            })
                            .finally(() => {
                                orderData.orderLoad = false;
                                orderData.work = true;
                            });
                    } else {
                        orderData.noMore = true;
                        orderData.orderLoad = false;
                        orderData.work = true;
                    }
                })
                .catch(() => {
                    orderData.orderLoad = false;
                    orderData.noMore = true;
                    orderData.work = true;
                });
        },
        handleAvatarSuccess(res, file) {
            this.userInfo.headerUrl = res.object;
            // console.log(this.currentUser.headerUrl, 89222);
            // this.currentUser.headerUrl = res.object;
        },
        updateInfo() {
            // console.log(this.userInfo.birthday, 898888)
            updateInfo({
                headerUrl: this.userInfo.headerUrl,
                nickname: this.userInfo.nickname,
                sex: this.userInfo.sex,
                birthday: this.userInfo.birthday
            }).then(res => {
                this.$message.success("修改成功");
                this.currentUser = this.userInfo;
                location.reload();
            });
        },
        submitFeedBack(feedBack) {
            // 提交意见反馈
            this.$refs[feedBack].validate(valid => {
                if (valid) {
                    personalFeedBack({
                        content: this.feedBack.content,
                        type: this.feedBack.type,
                        connectMethod: this.feedBack.contact
                    }).then(() => {
                        this.$message({
                            message: "意见反馈成功",
                            type: "success"
                        });
                        this.feedBack.content = null;
                    });
                } else {
                    return false;
                }
            });
        },
        loadSystemMessage(systemMessage) {
            // 加载系统消息
            messageSystem({
                currentPage: systemMessage.currentPage,
                pageSize: systemMessage.size
            }).then(res => {
                // console.log(res, "系统消息列表");
                this.systemMessage.content = res.records.reverse();
                this.systemMessage.total = res.total;
                this.systemMessage.content.forEach(item => {
                    item.createDate = item.createTime.split(" ")[0];
                });
            });
        },
        systemMessageChange(nowPage) {
            // 系统消息分页
            this.systemMessage.currentPage = nowPage;
            this.loadSystemMessage(this.systemMessage);
        }
    }
};
</script>

<style scoped>
.sideBar {
    min-width: 8.33rem;
    /* width: 20%; */
    text-align: center;
    margin-top: 1rem;
    padding: 1.71rem 0 0;
    position: fixed;
}
.boxlist {
    margin-bottom: 1.25rem;
}
.boxlist h5 {
    margin-bottom: 0.38rem;
}
.subtit {
    /* margin-top: 0.38rem; */
    padding: 0.58rem 0;
}
.subtit:hover {
    background: #f5f7e8;
}
.borderleft {
    border-left: 2px solid #96c321;
    color: #96c321;
    background: rgba(150, 195, 33, 0.3);
}
.Contant {
    margin: 1rem;
    padding: 0.75rem 1rem;
    border-radius: 0.25rem;
    min-height: 19.5rem;
}
.Contant > div > h4 {
    margin-bottom: 0.5rem;
}
.Contant1 {
    margin-left: 9.33rem;
}
.width50 {
    width: 50%;
}
.kc {
    padding-left: 5.71rem;
}
.sp span {
    color: #999;
}
.sp .auto-grow {
    width: 33.333333%;
    max-width: 33.333333%;
}
.sp {
    display: flex;
    justify-content: space-around;
}
.lineheight46 {
    height: 1.67rem;
    background: #f2f2f2;
}
.l-shop {
    margin: 1rem 0 1rem 0;
}
.l-shop img {
    margin-right: 0.63rem;
}
.l-shop h4 {
    margin-bottom: 0.79rem;
}
.collent {
    margin-top: 0.71rem;
}
.headbox img {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
}
.headport {
    background: #96c321;
    border-radius: 0.42rem;
    line-height: 0.92rem;
    padding: 0 0.42rem;
}
.perdata {
    margin-bottom: 1.29rem;
}
.perdata .title {
    margin-right: 0.71rem;
    text-align: right;
    width: 4rem;
    color: #333;
    font-size: 0.58rem;
}
.btn {
    margin-left: 6.83rem;
    width: 6.67rem;
}
.dialog .time {
    margin: 3.04rem 0 4.83rem 0;
    text-align: right;
}
.select-tag .el-dialog__body.dialog-body.b-c-app {
    background: #fff !important;
}
.order-load {
    padding-top: 1rem;
}
.shoplist-box {
    border-bottom: 0.02rem solid #e6e7ea;
}
</style>
