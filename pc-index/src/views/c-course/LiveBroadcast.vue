<template>
<!-- 直播部分 -->
    <div>
        <div class="tabs-box">
            <div class="l-tabs">
                <el-breadcrumb separator-class="el-icon-arrow-right"
                style=" width: 50rem;margin: 0 auto;">
                    <el-breadcrumb-item :to="{ path: '/' }"><span class="f-c-fff home">首页</span></el-breadcrumb-item>
                    <el-breadcrumb-item ><span class="f-c-fff">课程</span></el-breadcrumb-item>
                    <el-breadcrumb-item ><span class="f-c-fff">课程详情</span></el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>
        <div class="blackvideo-box">
            <div class="blackvideo">
                <h5 class="fontSize67">{{title}}</h5>
                <div class="i-xy-between" style="padding-bottom: 3.21rem;">
                    <div class="videobox">
                        <div class="f-c-fff">
                            <Video style="height:20.59rem">
                            </Video>
                        </div>
                        <div class="collect">
                            <span class="fontSize58 collectone ">124人在线</span>
                            <span class="fontSize58 collecttwo pointer" @click="feeback">直播反馈</span>
                        </div>
                    </div>
                    <div class="videoright">
                        <div class="videointro f-c-fff">
                            <Test />
                        </div>
                    </div>
                </div>
            </div>
            <!-- 直播反馈 -->
            <div class="feedback">
                 <div class="b-c-fff" style="height:17.04rem"  v-if="judge" >
                    <div class="feedback-box ">
                            <div class='xy-between'>
                                <h5 class="fontSize58 Color333 ">直播反馈</h5>
                                <div @click="closejc" class="pointer">x</div>
                            </div>
                        </div>
                        <div class="b-c-fff radiolist">
                            <div>
                                <div class="xy-between radiobox">
                                    <el-radio v-model="radio" label="1">老师讲的很好</el-radio>
                                    <el-radio v-model="radio" label="2">一般般</el-radio>
                                    <el-radio v-model="radio" label="3">缺少互动</el-radio>
                                </div>
                                <div class="xy-between radiobox">
                                    <el-radio v-model="radio" label="4">通俗易懂</el-radio>
                                    <el-radio v-model="radio" label="5">讲的很差</el-radio>
                                    <el-radio v-model="radio" label="6">没讲清除</el-radio>
                                </div>

                            </div>
                            <div class="inp">
                                <el-input
                                v-model="inptext"
                                type="textarea"
                                :autosize="{ minRows: 4, maxRows: 4}"
                                placeholder="请留下您宝贵的意见..."
                            />
                            </div>
                            <div class="jcbtn f-c-fff fontSize58 pointer">提交</div>
                        </div>
                </div>
            </div>
        </div>
        <!-- 课程评论 -->
        <div class="CourseReview app-width xy-between">
            <div style="width:70%;align-self: baseline;">
                <CourseReview />
            </div>
            <div style="width:28%" class="hotnews b-c-fff">
                <HotNews/>
            </div>
        </div>
    </div>
</template>

<script>
import Video from "@/components/Video.vue";
import CourseReview from "@/components/curriculum/CourseReview.vue";
import HotNews from "@/components/HotNews.vue";
import Test from "@/views/Test.vue";
import { JsVuePage, JsVueComponent } from "@/vue";
import { mapState } from "vuex";
export default {
    mixins: [JsVueComponent, JsVuePage],
    components: {
        Video,
        CourseReview,
        HotNews,
        Test
    },
    data() {
        return {
            radio: "1",
            inptext: "",
            judge: true,
            radioList: ["老师讲的很好", "一般般", "缺少互动", "通俗易懂", "讲的很差", "没讲清除"],
            title: "幼儿面试-笔试考前攻略",
            closebool: true,
            CourseList: [
                {
                    infoImg: require("@/assets/img/1.png"),
                    time: "38分22秒",
                    first: "第一讲 导学课"
                },
                {
                    infoImg: require("@/assets/img/1.png"),
                    time: "38分22秒",
                    first: "第一讲 导学课"
                }
            ]
        }
    },
    created() {
    },
    methods: {
        handleopen() {
            this.closebool = !this.closebool
        },
        feeback() {
            this.judge = true;
        },
        closejc() {
            this.judge = false;
        }
    }
}
</script>

<style  scoped lang="scss">
    .l-tabs{
        background-color: #333333;
        padding: 0.58rem 0;
        .home:hover{
            color: #96C322;
        }
    }
.blackvideo-box{
    position: relative;
    background: #191919;
    padding: 0 15.04rem;
    .feedback{
        position: absolute;
        top: 6.58rem;
        left: 50%;
        margin-left: -14.25rem;
    }
    .blackvideo{
        width: 50rem;
        margin:  0 auto;
        h5{
            color: #DDDDDD;
            line-height: 2.92rem;
        }
        .videobox{
            width: 36.63rem;
            border: 1px solid #fff;
            .collect{
                background: #26262B;
                height: 1.64rem;
                .collectone{
                    color: #999999;
                    margin-right: 2.04rem;
                }
                .collecttwo{
                    color: #96C322;
                }
            }
        }
        .videoright{
            display: flex;
            flex-direction: column;
            align-self: baseline;
            height:21.96rem;
            .videointro{
                border: 1px solid #777;
                margin-bottom: 0.59rem;
                background: #26262B;
                .lecture{
                    color: #D6D6D6;
                    margin-bottom: 0.42rem;
                }
                img{
                    width: 3.67rem;
                    height: 2rem;
                    margin-right: 0.71rem;
                }
                .CourseList{
                    transition: all .8s;
                    padding: 0.54rem 0.75rem;
                }
                .CourseList:hover{
                    background: #000;
                }
                .subtitle{
                    position: relative;
                    span{
                        position: absolute;
                        top: 0;
                        right: 0;
                    }
                }
            }
            .introduce{
                padding: 0.83rem 0.88rem;
                border: 1px solid #777;
                background: #26262B;
            }
            .font6{
                font-size: 0.6rem;
            }
        }
    }
}
.CourseReview{
    margin:0.8rem auto;
    .hotnews{
        padding: 1.08rem 0.71rem;
    }
}
.feedback-box{
    width: 28.5rem;
    background: #F0F0F0;
    border-radius: 0.42rem  0.42rem 0 0;
    box-sizing: border-box;
    padding: 0.54rem 0.79rem;
}
.radiolist{
    margin: 0 1.75rem;
}
.radiobox{
    margin-top: 1.17rem;
}
.inp{
    margin: 1.29rem 0 1.71rem 0;
}
.jcbtn{
    padding: 0.38rem 1.92rem;
    background: #96C321;
    width:6rem;
    border-radius: 0.17rem;
    margin: auto;
}
</style>
