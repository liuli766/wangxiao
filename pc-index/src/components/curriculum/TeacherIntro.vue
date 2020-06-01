<template>
<!-- 老师介绍 -->
<div>
    <div class="teacherTitle flex">
        <img src="@/assets/artDetails/headImg.png" class="headimg" alt=""/>
        <div>
            <div class="teacherName fontSize58">杭老师</div>
            <div class="teacherTime">10-01 19:00</div>
        </div>
    </div>
    <p class="fontSize58 p p1">
        关于教师资格笔试考试，云学宝头条这里好好给大家普及一下，师范类的考证老师，特别需要加强理论知识的复习关于教师资格笔试考试，云学宝头条这里好好给大家普及一下，师范类的考证老师，特别需要加强理论知识的复习
    </p>
    <div class="find-pic-box flex">
        <div class="find-pic"
            v-for="(item, index) in findlist"
            :key="index">
            {{ item.title }}
        </div>
    </div>
    <div class="l-bot flex between">
        <div class="xy-center"><span class="fontSize58">#教师资格证考试相关#</span></div>
        <div class="flex">
            <div class="comment pointer" @click="handcomm">
                <img src="@/assets/img/pinglun@2x.png" alt="" />
                <span class="fontSize58">100</span>
            </div>
            <!-- 点赞 -->
            <div class="givezan zan-right pointer" @click="handgiven">
                <img src="@/assets/img/dianz.png" alt=""  v-if="givennum%2==0"/>
                <img src="@/assets/img/redianz.png" alt="" v-else/>
                <span class="fontSize58">100</span>
            </div>
        </div>
    </div>
    <div class="review fontSize58 xy-between" v-show="comm">
        <textarea name="" id="" cols="50" rows="3" placeholder="请输入您的评论..."></textarea>
        <button class="f-c-fff">评论</button>
    </div>
</div>
</template>

<script>
import { JsVuePage, JsVueComponent } from "@/vue";
import { mapState } from "vuex";
import { findDynamic } from "@/action";
export default {
    mixins: [JsVuePage, JsVueComponent],
    components: {},
    props: ["findlist"],
    data() {
        return {
            givennum: 0,
            comm: false // 评论状态
        }
    },
    mounted() {
        this.showFindDynamic();
    },
    methods: {
        handgiven() {
            this.givennum = !this.givennum
        },
        handcomm() {
            this.comm = !this.comm
        },
        showFindDynamic() {
            let param = {
                teacherId: "20200102201216-6ff5b8ac-e557-4e4a-94d1-363aa293d776",
                currentPage: 1,
                pageSize: 5
            }
            findDynamic(param).then(res => {
                // console.log(res, 744444444)
            })
        }
    }
}
</script>

<style scoped lang="scss">
.teacherTitle {
    .teacherTime {
        font-size: 0.5rem;
        color: rgba(155, 155, 155, 1);
    }
}
.p1 {
    margin: 1.08rem 0 0.96rem 0;
}
.find-pic-box {
    width: 13.79rem;
    .find-pic {
        width: 4.33rem;
        height: 4.33rem;
        background: pink;
        margin: 0 0 0.25rem 0.25rem;
    }
}
.l-bot {
    margin-bottom: 1.17rem;
}
.comment {
    margin-right: 1.75rem;
}
.comment,
.givezan {
    align-items: center;
    display: flex;
    img {
        width: 0.75rem;
        height: 0.75rem;
    }
}
.zan-right {
    margin-right: 2rem;
}
.review{
    border: 1px solid #DDDEE1;
}
.review button{
    padding: 0.92rem 1.17rem;
    background: #96C321;
}
.headimg{
    margin:0 0.54rem 0 -2rem;
}
</style>
