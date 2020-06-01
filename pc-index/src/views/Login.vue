<template>
    <div
        class="full-width xy-center app-body app-width jf-start login-page loginBox"
        v-wechat-title="title"
    >
        <LoginAndRegister
            class="login-box"
            :type="type"
            @login-success="loginSuccess"
        />
        <el-carousel
            :interval="5000"
            arrow="always"
            indicator-position="none"
            height="100%"
            class="login-adv"
        >
            <el-carousel-item v-for="adv in loginImageAdv" :key="adv.id">
                <el-image :src="coverImage(adv.url)"></el-image>
            </el-carousel-item>
        </el-carousel>
    </div>
</template>

<script lang="ts">
import { Component, Watch } from "vue-property-decorator";
import LoginAndRegister from "@/components/LoginAndRegister.vue";
import { VuePage } from "@/vue";
import { AdvItem } from "@/model";
export interface LoginImageAdvItem {}
@Component({
    components: {
        LoginAndRegister
    }
})
export default class Login extends VuePage {
    title = "登录";
    type: string = "login";
    loginImageAdv: Array<AdvItem> = [
        {
            id: "1",
            url:
                "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg"
        },
        {
            id: "2",
            url:
                "https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg"
        }
    ];
    created() {
        // @ts-ignore
        this.type = this.$route.query.type || "login";
    }
    // 监听用户存在状态 然后后去用户信息
    @Watch("state.userLoginStatus")
    userLoginStatus(userLoginStatus: boolean) {
        // 直接打开登录界面
        if (userLoginStatus && this.type === "login") {
            // @ts-ignore
            this.go(this.$route.query.redirect || "/");
        }
    }
    loginSuccess() {
        // @ts-ignore
        this.$router.push(this.$route.query.redirect || "/");
    }
}
</script>

<style scoped lang="scss">
.login-page {
    .login-box {
        margin-left: 57.69%;
    }
    .login-adv {
        z-index: -1;
    }
}
</style>
<style>
.loginBox {
    width: 100%;
    height: 100%;
    background-image: url("../assets/login.png");
    background-size: cover;
}
.login-page .el-carousel {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
}
.login-page .el-carousel .el-carousel__arrow {
    display: none;
}
.login-adv .el-image {
    width: 100%;
    height: 100%;
}
</style>
