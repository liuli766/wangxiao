<template>
    <div class="app-width" v-wechat-title="title">
        <div class="l-tabss">
            <el-breadcrumb
                separator-class="el-icon-arrow-right"
                style=" width: 50rem;margin: 0 auto;"
            >
                <el-breadcrumb-item :to="{ path: '/' }"
                    ><span class="home">首页</span></el-breadcrumb-item
                >
                <el-breadcrumb-item :to="{ path: '/c-course?id' + course.id }"
                    ><span class="home">课程详情</span></el-breadcrumb-item
                >
                <el-breadcrumb-item
                    ><span class="home f-c-333"
                        >购买课程</span
                    ></el-breadcrumb-item
                >
            </el-breadcrumb>
        </div>
        <div class="b-c-fff buybox">
            <h4 class="fontSize75 FW600">订单信息</h4>
            <div class="lineheight46 fontSize58 xy-between">
                <span class="width50 kc">课程</span>
                <div class="width50 sp">
                    <span>订单原价</span><span>已优惠</span
                    ><span>实际支付</span>
                </div>
            </div>
            <!-- 订单列表 -->
            <div
                v-for="(item, index) in orderDetail"
                :key="index"
                class="xy-between shoplist-box"
            >
                <div class="flex l-shop  width50">
                    <img
                        :src="coverImage(item.assets.icon)"
                        alt=""
                        style="width:5.08rem; height:2.83rem;"
                    />
                    <div class="fontSize58">
                        <h4 class="FW600">{{ item.assets.name }}</h4>
                        <div class="xy-between jf-start numbox">
                            <span>数量:</span>
                            <div>
                                {{ item.totalCount }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="width50 sp fontSize75">
                    <span>￥{{ (order.oldPrice || 0).toFixed(2) }}</span
                    ><span
                        >￥{{
                            (order.oldPrice - order.price || 0).toFixed(2)
                        }}</span
                    ><span class="c-3d"
                        >￥{{ (order.price || 0).toFixed(2) }}</span
                    >
                </div>
            </div>
            <div>
                <h5 class="FW600 paystyle">支付方式</h5>
                <div class="order-row pay-box">
                    <div class="type-ls xy-between jf-start al-start">
                        <div class="type-item yx-between">
                            <el-checkbox
                                v-model="payModel.paymentType"
                                border
                                true-label="weixin"
                            >
                                <div class="xy-center">
                                    <span
                                        class="icon iconfont icon-weixinzhifu icon-pay"
                                    />
                                    <div>微信支付</div>
                                </div>
                            </el-checkbox>
                        </div>
                        <div class="type-item yx-between">
                            <el-checkbox
                                v-model="payModel.paymentType"
                                border
                                true-label="alipay"
                            >
                                <div class="xy-center">
                                    <span
                                        class="icon iconfont icon-zhifubao icon-pay"
                                    />
                                    <div>支付宝支付</div>
                                </div>
                            </el-checkbox>
                        </div>
                    </div>
                </div>
                <div class="bottom-btn  full-width xy-between fontSize75">
                    <div class="title">
                        应付金额：
                        <span class="red FW600"
                            >¥{{ (order.price || 0).toFixed(2) }}</span
                        >
                    </div>
                    <el-button
                        type="primary"
                        class="payBtn"
                        @click="pay"
                        :disabled="createBtnDisabled"
                        :loading="flag.payWork"
                        >立即支付</el-button
                    >
                </div>
            </div>
        </div>
        <el-dialog
            :visible.sync="qrcodeShow"
            width="410px"
            top="30vh"
            center
            @opened="canvasQr"
            :before-close="beforeCloseWeixinPay"
            :z-index="3000"
        >
            <div class="yx-center weixin-qr-dia">
                <div class="title bold">请使用微信扫描二维码以完成支付</div>
                <div class="qr">
                    <img src="@/assets/qr.png" />
                    <div id="qrcode" ref="qrcode" class="two-code" />
                </div>
                <div class="order-sn order">订单号：{{ order.orderSn }}</div>
                <div class="product-name order">
                    商品名称：{{ course.name }}
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { JsVuePage, JsVueComponent } from "@/vue";
import { mapState } from "vuex";
import { userOrderDetail, paySign } from "@/action";
let QRCode;
export default {
    mixins: [JsVueComponent, JsVuePage],
    components: {},
    data() {
        return {
            order: {},
            orderDetail: [],
            course: {},
            flag: {
                payWork: false
            },
            payModel: {
                paymentStatus: null
            },
            qrcodeShow: false,
            qrUrl: null,
            orderId: ""
        };
    },
    created() {
        this.orderId = this.$route.query.orderId;
        this.loadOrderDetail(this.$route.query.orderId);
    },
    mounted() {
        QRCode = require("qrcodejs2");
    },
    computed: {
        createBtnDisabled() {
            return (
                !this.payModel.paymentType ||
                (this.payModel.paymentStatus !== "waitPay" &&
                    this.payModel.paymentStatus !== "payFail")
            );
        }
    },
    methods: {
        loadOrderDetail(id) {
            return userOrderDetail(id).then(order => {
                this.order = order;
                this.orderDetail = order.orderDetail;
                this.course = this.orderDetail[0].assets;
                this.payModel = order.payModel;
                this.title = this.course.name;
                return order.payModel;
            });
        },
        pay() {
            this.flagPromise(
                paySign(
                    this.payModel.paymentType,
                    this.order.id,
                    {
                        alipay: "pc"
                    }[this.payModel.paymentType]
                ),
                "payWork"
            ).then(result => {
                // console.log(result, 19999)
                if (this.payModel.paymentType === "alipay") {
                    // console.log(result.body);
                    document.body.innerHTML = result.body;
                    document.forms[0].submit();
                } else if (this.payModel.paymentType === "weixin") {
                    this.qrUrl = result.code_url;
                    this.qrcodeShow = true;
                }
            });
        },
        canvasQr() {
            if (this.qrcodeShow) {
                this.$refs.qrcode.innerText = "";
                // eslint-disable-next-line no-new
                new QRCode("qrcode", {
                    width: 212,
                    height: 212,
                    text: this.qrUrl
                });
                this.fetchOrderStatus();
            }
        },
        beforeCloseWeixinPay(done) {
            this.$confirm("确认取消微信支付吗?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    done();
                })
                .catch(() => {});
        },
        fetchOrderStatus() {
            let w = () => {
                if (
                    this.qrcodeShow &&
                    this.payModel.paymentStatus === "waitPay"
                ) {
                    this.loadOrderDetail(this.$route.query.orderId)
                        .then(payModel => {
                            if (payModel.paymentStatus === "paySuccess") {
                                // 支付成功
                                console.log(this.$route.query.orderId, "这里可以输出")
                                this.$router.push({
                                    path: "/c-course/PaymentSuccessful",
                                    query: { orderId: this.$route.query.orderId }
                                })
                                // this.$confirm(
                                //     "支付成功，点击跳转我的学习",
                                //     "提示",
                                //     {
                                //         confirmButtonText: "确定",
                                //         showCancelButton: false,
                                //         type: "success"
                                //     }
                                // ).then(() => {
                                //     this.go("/course");
                                // });
                            }
                        })
                        .finally(() => {
                            setTimeout(() => {
                                w();
                            }, 100);
                        });
                }
            };
            w();
        },
        beforeDestroy() {
            this.qrcodeShow = false;
        }
    }
};
</script>

<style scoped>
.l-tabss {
    padding: 0.58rem 0;
    margin: 1.67rem 0 0.88rem 0;
}
.home {
    color: #9b9fa2;
}
.home:hover {
    color: #333;
}
.buybox {
    padding: 0 1rem 2.13rem;
}
.lineheight46 {
    line-height: 1.46rem;
    background: #f2f2f2;
    color: #999;
    border-radius: 0.17rem 0.17rem 0 0;
}
.fontSize75.FW600 {
    line-height: 2.79rem;
}
.width50 {
    width: 50%;
}
.kc {
    padding-left: 5.71rem;
}
.sp span {
    width: 16.7%;
    color: #999;
}
.sp {
    display: flex;
    justify-content: flex-end;
}
.l-shop {
    justify-content: end;
    padding: 1rem 1.25rem;
}
.l-shop img {
    margin-right: 0.67rem;
}
.shoplist-box {
    background: #f8f8fa;
    border-radius: 0 0 0.17rem 0.17rem;
}
.sp .c-3d {
    color: #ff3d3d;
}
.addsub {
    width: 0.96rem;
    height: 0.96rem;
    border: 1px solid #cdcdcf;
    line-height: 0.96rem;
}
.num {
    height: 0.96rem;
    width: 1.71rem;
    border: 1px solid #cdcdcf;
}
.numbox {
    margin-top: 0.96rem;
}
.numbox > span {
    margin-right: 0.17rem;
}
.paystyle {
    padding: 2.04rem 0 1.25rem 0;
}
.order-row {
    padding: 0 1.833333%;
}
.pay-box {
    height: 4.63rem;
}
.pay-box .type-ls {
    padding: 1.5rem 0 1.46rem 1.29rem;
    box-sizing: border-box;
    border-radius: 0.17rem;
    background: #f8f8fa;
    border-radius: 0.17rem;
}
.type-item .el-checkbox {
    display: flex;
    align-items: center;
}
.type-item + .type-item {
    margin-left: 1.88rem;
}
.bottom-btn {
    margin-top: 1.63rem;
    justify-content: flex-end;
}
.bottom-btn .title {
    margin-right: 1.54rem;
}
.bottom-btn .red {
    color: #ff3d3d;
}
.payBtn.el-button {
    height: 1.58rem;
    line-height: 1.58rem;
    padding-top: 0;
    border-radius: 0.21rem;
}
.icon-pay {
    font-size: 1rem;
}
.icon-pay.icon-weixinzhifu {
    color: #55b737;
}
.icon-pay.icon-zhifubao {
    color: #108ee9;
}
.weixin-qr-dia .title {
    font-size: 14px;
    color: #333333;
}
.weixin-qr-dia .qr {
    width: 212px;
    height: 212px;
    margin: 8px 0;
    position: relative;
}
.weixin-qr-dia .qr > img {
    position: absolute;
    width: 44px;
    height: 44px;
    left: 85px;
    top: 85px;
    z-index: 99;
}
.weixin-qr-dia .order {
    margin: 5px 0;
}
</style>
