<template>
<!-- 录播部分 -->
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
                <div class="i-xy-between">
                    <div class="videobox">
                        <div class="f-c-fff model">
                            <Video style="height:20.59rem">
                            </Video>
                            <div class="modelblack xy-center yx-center">
                                <div>直播时间：9月29日 19:00-24:00</div>
                                <div class="peopletext">589人已预约</div>
                                <div class="modelblacktext">立即预约</div>
                            </div>
                        </div>
                        <div class="collect">
                            <span class="fontSize58 collectone">收藏</span>
                            <span class="fontSize58 collecttwo">已收藏</span>
                        </div>
                    </div>
                    <div class="videoright">
                        <div class="videointro f-c-fff">
                            <div class="subtitle pointer" @click="handleopen">
                                <h5 class='fontSize67 xy-center'>{{title}}</h5>
                                <span>三角</span>
                            </div>
                            <div class="xy-center CourseList pointer" v-for="(item,index) in CourseList" :key="index" v-show="closebool">
                               <img :src="coverImage(item.infoImg)" alt="">
                                <div class="fontSize5 f-c-666">
                                    <div class="lecture">{{item.first}}</div>
                                    <div>时长：{{item.time}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 课程评论 -->
        <div class="CourseReview app-width xy-between">
            <div style="width:70%;align-self: baseline;">
                <CourseReview />
            </div>
            <div style="width:28%; align-self: end;" class="hotnews b-c-fff">
                <HotNews/>
            </div>
        </div>
    </div>
</template>

<script>
import Video from "@/components/Video.vue";
import CourseReview from "@/components/curriculum/CourseReview.vue";
import HotNews from "@/components/HotNews.vue";
import { JsVuePage, JsVueComponent } from "@/vue";
import { mapState } from "vuex";
export default {
    mixins: [JsVueComponent, JsVuePage],
    components: {
        Video,
        CourseReview,
        HotNews
    },
    data() {
        return {
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
            // console.log(1)
            this.closebool = !this.closebool
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
    background: #191919;
    padding: 0 15.04rem;
    .blackvideo{
        width: 50rem;
        margin:  0 auto;
        h5{
            color: #DDDDDD;
            margin-bottom: 1rem;
        }
        .videobox{
            width: 36.63rem;
            border: 1px solid #fff;
            .collect{
                background: #26262B;
                .collectone{
                    color: #999999;
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
            .videointro{
                padding: 0.83rem 0;
                margin-bottom: 0.79rem;
                background: #26262B;
                width: 13.33rem;
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
.model{
    position: relative;
    .modelblack{
    background: rgba(0,0,0,.5);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    .peopletext{
        margin: 1.54rem 0  0.83rem 0;
    }
}
    .modelblacktext{
        padding: 0.58rem 2.83rem;
        background: #96C321;
        border-radius: 0.08rem;
        margin-top: 0.58rem;
    }
}
</style>
