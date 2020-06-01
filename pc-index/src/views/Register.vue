<template>
    <div
        class="full-width app-body app-width xy-center jf-start register-page registerBox"
        v-wechat-title="title"
    >
        <LoginAndRegister
            class="register-box"
            type="register"
            @register-success="registerSuccess"
        />
        <el-carousel
            :interval="5000"
            arrow="always"
            indicator-position="none"
            height="100%"
            class="register-adv"
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
@Component({
    components: {
        LoginAndRegister
    }
})
export default class Register extends VuePage {
    title = "注册";
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
    @Watch("state.userLoginStatus")
    userLoginStatus(userLoginStatus: boolean) {
        // 直接打开注册界面
        if (userLoginStatus) {
            // @ts-ignore
            this.go(this.$route.query.redirect || "/");
        }
    }

    registerSuccess(user: any) {
        this.$message.success("注册成功，请登录");
        this.goLogin();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.register-page {
    .register-box {
        margin-left: 57.69%;
    }
    .register-adv {
        z-index: -1;
    }
}
</style>
<style>
.registerBox {
    width: 100%;
    height: 100%;
    background-image: url("../assets/login.png");
    background-size: cover;
}
.register-page .el-carousel {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
}
.register-page .el-carousel .el-carousel__arrow {
    display: none;
}
.register-adv .el-image {
    width: 100%;
    height: 100%;
}
</style>
