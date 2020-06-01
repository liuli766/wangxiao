<template>
    <div class="app-width main">
        <div class="paymentRes">
            <div class="paymentTitle fontSize67 b-c-fff">支付结果</div>
            <div class="paymentContent xy-between b-c-fff al-str">
                <img src="@/assets/img/payment.png" alt="" />
                <div class="fontSize58 text">
                    <div class="fontSize83 FW600 f-c-333">恭喜，支付成功！</div>
                    <div class="f-c-97 tips">
                        点击“我的学习”即可查看您购买的课程，或点击下方“学习”按钮直接查看
                    </div>
                    <button type="primary" @click="toIndex">返回首页</button>
                    <button type="primary" @click="toLearingDetails">
                        去学习
                    </button>
                </div>
            </div>
        </div>
        <div class="orderDetails">
            <div class="orderTit b-c-fff fontSize67 f-c-333">
                <div>订单详情</div>
                <p class="fontSize58">订单号 ： {{ order.orderSn }}</p>
            </div>
            <div class="orderList b-c-fff">
                <div
                    class="orderListItem"
                    v-for="(orderItem, index) in orderDetail"
                    :key="index"
                >
                    <div
                        class="orderInfo xy-between jf-start fontSize58 f-c-333"
                    >
                        <img src="@/assets/img/1.png" alt="" />
                        <div class="infoCenter">
                            <div>{{ orderItem.assets.name }}</div>
                            <div class="fontSize5 f-c-666">
                                {{ orderItem.assets.createTime }}
                            </div>
                        </div>
                        <div class="fontSize58">
                            价格{{ orderItem.assets.price }}
                        </div>
                    </div>
                    <div class="fontSize58 f-c-333 bottomInfo">
                        <div>
                            支付方式 : <span>{{ order.type }}</span>
                        </div>
                        <div>
                            商品总价 :
                            <span class="f-c-f23"
                                >￥{{ orderItem.assets.oldPrice }}</span
                            >
                        </div>
                        <div>
                            优惠金额 :
                            <span class="f-c-f23"
                                >-￥{{
                                    orderItem.assets.oldPrice -
                                        orderItem.assets.price
                                }}</span
                            >
                        </div>
                        <div>
                            实付金额 :
                            <span class="f-c-f23 fontSize75"
                                >￥{{ orderItem.assets.price }}</span
                            >
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { JsVuePage, JsVueComponent } from "@/vue";
import { userOrderDetail, userOrderDetailBySn, payPreSuccess } from "@/action";
export default {
    mixins: [JsVueComponent, JsVuePage],
    data() {
        return {
            order: {},
            orderDetail: {},
            orderSn: ""
        };
    },
    watch: {
    },
    mounted() {
        let orderSn = this.$route.query.out_trade_no;
        let orderId = this.$route.query.orderId;
        if (orderSn) {
            payPreSuccess(orderSn).finally(() => {
                this.loadOrderDetail(null, orderSn);
            })
        } else {
            this.loadOrderDetail(orderId);
        }
    },
    methods: {
        loadOrderDetail(orderId, orderSn) {
            (orderId
                ? userOrderDetail(orderId)
                : userOrderDetailBySn(orderSn)
            ).then(order => {
                this.orderDetail = order.orderDetail;
                this.order = order;
                if (order.type === "onlinePay") {
                    order.type = "在线支付";
                }
            });
        },
        toIndex() {
            this.$router.push({
                path: "/"
            });
        },
        toLearingDetails() {
            this.$router.push({
                path: "/course"
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.main {
    margin: 1rem 0 1.42rem;
}
.orderDetails {
    border-radius: 0.25rem;
    margin-top: 1rem;
    .orderTit {
        padding: 0.7rem 1.04rem;
        p {
            margin-top: 0.5rem;
        }
    }
    .orderList {
        margin-top: 1px;
        padding: 1rem 1.29rem;
        .orderListItem {
            margin: 0.3rem 0;
            .orderInfo {
                img {
                    width: 5.62rem;
                    height: 3.15rem;
                    border-radius: 0.25rem;
                }
                .infoCenter {
                    margin: 0 12rem 0 0.63rem;
                }
            }
            .bottomInfo {
                padding-left: 35rem;
                div {
                    margin-top: 0.9rem;
                    span {
                        margin-left: 0.88rem;
                    }
                }
            }
        }
    }
}
.paymentRes {
    height: 15.04rem;
    border-radius: 0.25rem;
    .paymentTitle {
        color: #7f7f7f;
        padding: 0.7rem 1.04rem;
    }
    .paymentContent {
        margin-top: 1px;
        padding: 3.17rem 15rem;
        img {
            width: 2.17rem;
            height: 2.17rem;
            margin-right: 0.58rem;
        }
        .text {
            .tips {
                margin: 0.83rem 0 1.88rem;
            }
            button {
                width: 6.21rem;
                height: 1.71rem;
                border-radius: 0.85rem;
                margin: 0 0.8rem;
                border: 1px solid #c8c8c8;
                background: #fff;
                cursor: pointer;
            }
            button:hover {
                background: #96c321;
                color: #fff;
            }
        }
    }
}
</style>
