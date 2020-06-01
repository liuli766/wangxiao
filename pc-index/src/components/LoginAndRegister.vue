<template>
    <div class="content-box b-c-fff">
        <div
            class="full-width xy-between title f-c-333"
            v-show="actionType === 'login' || actionType === 'register'"
        >
            <div
                class="item pointer bold"
                :class="{ 'f-c-root': actionType === 'login' }"
                @click="actionType = 'login'"
            >
                登录
            </div>
            <div class="line"></div>
            <div
                class="item pointer bold"
                :class="{ 'f-c-root': actionType === 'register' }"
                @click="actionType = 'register'"
            >
                注册
            </div>
        </div>
        <div
            class="full-width xy-center bold f-c-333 title xy-between jf-start"
            v-show="actionType === 'resert'"
        >
            <div class="icon iconfont icon-zuo pointer" style="margin-right:0.6rem;" @click="actionType = 'login'"></div>
            <div>忘记密码</div>
        </div>
        <!-- 登录表单 -->
        <div
            v-if="actionType === 'login'"
            class="login form yx-center jf-start al-str"
        >
            <el-form
                :model="formData"
                :rules="loginRule"
                ref="form"
                label-width="0"
                class="login-form"
            >
                <el-form-item label="" prop="userAccount" class="form-item">
                    <el-input
                        v-model="formData.userAccount"
                        placeholder="请输入您的手机号码"
                        @change="flag.rule = true"
                    ></el-input>
                </el-form-item>
                <el-form-item label="" prop="credential" class="last-input">
                    <el-input
                        type="password"
                        v-model="formData.credential"
                        placeholder="请输入密码"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div class="xy-between other f-c-333" style="margin-top:0.6rem;">
                <div>
                    没有账号？<span
                        class="f-c-root pointer"
                        @click="actionType = 'register'"
                        >立即注册</span
                    >
                </div>
                <div class="f-c-root pointer" @click="actionType = 'resert'">
                    忘记密码？
                </div>
            </div>
            <el-button
                type="primary"
                class="submit"
                @click="login"
                :disabled="!formData.userAccount"
                :loading="flag.submit"
                >登录
            </el-button>
        </div>
        <!-- 注册表单 -->
        <div
            v-if="actionType === 'register'"
            class="registe-resert form yx-center jf-start al-str"
        >
            <el-form
                :model="formData"
                :rules="registerRule"
                ref="form"
                label-width="0"
                class="login-form"
            >
                <el-form-item label="" prop="userAccount" class="form-item">
                    <el-input
                        v-model="formData.userAccount"
                        placeholder="请输入您的手机号码"
                        @change="flag.rule = true"
                    >
                    </el-input>
                </el-form-item>
                <div class="xy-between code-row form-item">
                    <el-form-item label="" prop="code" class="code-input">
                        <el-input
                            type="number"
                            v-model="formData.code"
                            placeholder="请输入手机验证码"
                        ></el-input>
                    </el-form-item>
                    <el-button
                        type="primary"
                        class="code-btn"
                        :disabled="
                            Boolean(vcodeTime) || !Boolean(formData.userAccount)
                        "
                        @click="registerPhoneCheck"
                        >{{ vcodeTime ? `${vcodeTime}秒重试` : "获取验证码" }}
                    </el-button>
                </div>
                <el-form-item label="" prop="credential" class="form-item">
                    <el-input
                        type="password"
                        v-model="formData.credential"
                        placeholder="请输入密码"
                    ></el-input>
                </el-form-item>
                <el-form-item label="" prop="credentialBak" class="last-input">
                    <el-input
                        type="password"
                        v-model="formData.credentialBak"
                        placeholder="请再次输入密码"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div class="xy-between other f-c-333 jf-start">
                <div>
                    已有账号，<span
                        class="f-c-root pointer"
                        @click="actionType = 'login'"
                        >立即登录</span
                    >
                </div>
            </div>
            <el-button
                type="primary"
                class="submit"
                @click="register"
                :disabled="!formData.userAccount"
                :loading="flag.submit"
                >确定
            </el-button>
        </div>
        <!-- 忘记密码表单 -->
        <div
            v-if="actionType === 'resert'"
            class="registe-resert form yx-center jf-start al-str"
        >
            <el-form
                :model="formData"
                :rules="resertRule"
                ref="form"
                label-width="0"
                class="login-form"
            >
                <el-form-item label="" prop="userAccount" class="form-item">
                    <el-input
                        v-model="formData.userAccount"
                        placeholder="请输入您的手机号码"
                        @change="flag.rule = true"
                    ></el-input>
                </el-form-item>
                <div class="code-row xy-between form-item">
                    <el-form-item label="" prop="code" class="code-input">
                        <el-input
                            type="number"
                            v-model="formData.code"
                            placeholder="请输入手机验证码"
                        ></el-input>
                    </el-form-item>
                    <el-button
                        type="primary"
                        class="code-btn"
                        :disabled="
                            Boolean(vcodeTime) || !Boolean(formData.userAccount)
                        "
                        @click="imageDialogVisible = true"
                        >{{ vcodeTime ? `${vcodeTime}秒重试` : "获取验证码" }}
                    </el-button>
                </div>

                <el-form-item label="" prop="credential" class="form-item">
                    <el-input
                        type="password"
                        v-model="formData.credential"
                        placeholder="请输入新密码"
                    ></el-input>
                </el-form-item>
                <el-form-item label="" prop="credentialBak" class="last-input">
                    <el-input
                        type="password"
                        v-model="formData.credentialBak"
                        placeholder="请再次输入密码"
                    ></el-input>
                </el-form-item>
            </el-form>
            <el-button
                type="primary"
                class="submit"
                @click="forgetPassword"
                :disabled="!formData.userAccount"
                :loading="flag.submit"
                >确定
            </el-button>
        </div>
        <!-- 图片认证弹窗 -->
        <el-dialog
            title="请将图片旋转正"
            :visible.sync="imageDialogVisible"
            width="20rem"
            center
            :show-close="false"
            :before-close="
                () => {
                    return false;
                }
            "
        >
            <div class="yx-center full-width image-box">
                <div class="image-code-box">
                    <img
                        v-if="imageDialogVisible"
                        src="/api/v3/api/image-code"
                        class="image-code full-height full-width"
                        :style="{
                            transform: 'rotate(' + imageCodeValue + 'deg)'
                        }"
                    />
                </div>
                <el-slider
                    v-model="imageCodeValue"
                    :max="360"
                    :min="-360"
                    class="full-width slider"
                    @change="imageCodeCheck"
                >
                </el-slider>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Watch } from "vue-property-decorator";
import { VueComponent } from "@/vue";
import {
    forgetPassword,
    imageCodeCheck,
    login,
    loginPhoneCode,
    phoneHaveUse,
    register
} from "@/action";
import { Result } from "../request";
import md5 from "js-md5";
type ActionType = "login" | "register" | "resert";
@Component
export default class LoginAndRegister extends VueComponent {
    @Prop(String) private type!: ActionType;
    // data
    actionType: ActionType = this.type;
    formData: any = {
        userAccount: null,
        credential: null,
        credentialBak: null,
        code: null
    };
    flag: any = {
        submit: false,
        rule: false
    };
    vcodeTime = 0;
    imageDialogVisible: boolean = false;
    imageCodeValue: number = 0;

    validatePass(rule: any, value: string, callback: (e?: any) => {}) {
        if (value === "") {
            callback(new Error("请输入密码"));
        } else {
            if (this.formData.credential !== "") {
                // @ts-ignore
                this.$refs.form.validateField("credentialBak");
            }
            callback();
        }
    }

    validatePass2(rule: any, value: string, callback: (e?: any) => {}) {
        if (value === "") {
            callback(new Error("请再次输入密码"));
        } else if (value !== this.formData.credential) {
            callback(new Error("两次输入密码不一致!"));
        } else {
            callback();
        }
    }

    phoneHaveUse(rule: any, value: string, callback: (e?: any) => {}) {
        if (!value) {
            return callback(new Error("手机号不能为空"));
        } else {
            const reg = /^1\d{10}$/;
            if (reg.test(value)) {
                phoneHaveUse(value).then((v: boolean) => {
                    if (v) {
                        callback(new Error("手机号已被绑定"));
                    } else {
                        callback();
                    }
                });
            } else {
                callback(new Error("请输入正确的手机号"));
            }
        }
    }

    phoneHaveUse1(rule: any, value: string, callback: (e?: any) => {}) {
        if (!value) {
            return callback(new Error("手机号不能为空"));
        } else {
            const reg = /^1\d{10}$/;
            if (reg.test(value)) {
                phoneHaveUse(value).then((v: boolean) => {
                    if (v) {
                        callback();
                    } else {
                        callback(new Error("账户不存在"));
                    }
                });
            } else {
                callback(new Error("请输入正确的手机号"));
            }
        }
    }

    checkPhone(rule: any, value: string, callback: (e?: any) => {}) {
        if (!value) {
            return callback(new Error("手机号不能为空"));
        } else {
            const reg = /^1\d{10}$/;
            if (reg.test(value)) {
                callback();
            } else {
                callback(new Error("请输入正确的手机号"));
            }
        }
    }

    // watch
    @Emit()
    @Watch("actionType")
    typeChange(actionType: ActionType) {
        if (actionType === "login" && actionType !== this.type) {
            this.$router.push({
                path: "/login",
                query: { redirect: this.$route.query.redirect }
            });
        }
        if (actionType === "register" && actionType !== this.type) {
            this.$router.push({
                path: "/register",
                query: { redirect: this.$route.query.redirect }
            });
        }
        if (actionType === "resert" && actionType !== this.type) {
            this.$router.push({
                path: "/login",
                query: { redirect: this.$route.query.redirect, type: "resert" }
            });
        }
        return actionType;
    }

    @Watch("imageDialogVisible")
    imageDialogVisibleWatch(imageDialogVisible: boolean) {
        if (imageDialogVisible) {
            this.imageCodeValue = 0;
        }
    }

    // computed
    get loginRule() {
        if (this.flag.rule) {
            return {
                userAccount: [
                    { required: true, message: "请输入账号", trigger: "change" }
                ],
                credential: [
                    { required: true, message: "请输入密码", trigger: "change" }
                ]
            };
        }
        return {};
    }

    get registerRule() {
        if (this.flag.rule) {
            return {
                userAccount: [
                    { validator: this.phoneHaveUse, trigger: "change" }
                ],
                credential: [{ validator: this.validatePass, trigger: "blur" }],
                credentialBak: [
                    { validator: this.validatePass2, trigger: "blur" }
                ],
                code: [
                    {
                        required: true,
                        message: "请输入验证码",
                        trigger: "change"
                    }
                ]
            };
        }
        return {};
    }

    get resertRule() {
        if (this.flag.rule) {
            return {
                userAccount: [
                    { validator: this.phoneHaveUse1, trigger: "change" }
                ],
                credential: [{ validator: this.validatePass, trigger: "blur" }],
                credentialBak: [
                    { validator: this.validatePass2, trigger: "blur" }
                ],
                code: [
                    {
                        required: true,
                        message: "请输入验证码",
                        trigger: "change"
                    }
                ]
            };
        }
        return {};
    }

    // emit
    @Emit()
    loginSuccess(user: any): any {
        this.state.userLoginStatus = true;
        return user;
    }

    @Emit()
    loginFail(error: any): Result {
        this.state.userLoginStatus = false;
        return error;
    }

    @Emit()
    registerSuccess(user: any): any {
        return user;
    }

    // methods
    registerPhoneCheck() {
        // @ts-ignore
        this.$refs.form.validateField("userAccount", error => {
            if (!error) {
                this.imageDialogVisible = true;
            }
        });
    }

    login() {
        // @ts-ignore
        this.$refs.form.validate((valid): any => {
            if (valid) {
                this.flag.submit = true;
                this.flagPromise(
                    login(
                        {
                            ...this.formData,
                            credential: md5(this.formData.credential)
                        },
                        {
                            ignoreCode: [20002]
                        }
                    ),
                    "submit"
                )
                    .then((user: any) => {
                        this.loginSuccess(user);
                    })
                    .catch((e: any) => {
                        if (e.code === 20002) {
                            this.$message.error("账号或者密码错误");
                        }
                        this.loginFail(e);
                    });
                return true;
            } else {
                return false;
            }
        });
    }

    register() {
        // @ts-ignore
        this.$refs.form.validate((valid): any => {
            if (valid) {
                this.flag.submit = true;
                this.flagPromise(
                    register(
                        {
                            ...this.formData
                        },
                        {
                            message: "注册失败",
                            ignoreCode: [20005]
                        }
                    ),
                    "submit"
                )
                    .then(() => {
                        this.registerSuccess(null);
                    })
                    .catch((e: any) => {
                        if (e.code === 20005) {
                            this.$message.error("账号已被注册");
                        }
                    });
                return true;
            } else {
                return false;
            }
        });
    }

    forgetPassword() {
        // @ts-ignore
        this.$refs.form.validate((valid): any => {
            if (valid) {
                this.flag.submit = true;
                this.flagPromise(
                    forgetPassword(this.formData, {
                        otherMessage: "密码重置失败",
                        ignoreCode: [20001]
                    }),
                    "submit"
                )
                    .then((result: any) => {
                        this.actionType = "login";
                    })
                    .catch((e: any) => {
                        if (e.code === 20001) {
                            this.$message.error("账号不存在");
                        }
                    });
                return true;
            } else {
                return false;
            }
        });
    }

    // 获取短信验证码
    getVCode() {
        // @ts-ignore
        this.$refs.form.validateField("userAccount", (error: string) => {
            if (!error) {
                loginPhoneCode(
                    this.formData.userAccount,
                    this.imageCodeValue
                ).then(() => {
                    this.$message.success("验证码获取成功");
                    this.vcodeTime = 50;
                    let work = () => {
                        if (this.vcodeTime > 0) {
                            setTimeout(() => {
                                this.vcodeTime--;
                                work();
                            }, 1000);
                        }
                    };
                    work();
                });
            }
        });
    }

    imageCodeCheck(value: number) {
        imageCodeCheck(value).then(() => {
            this.imageDialogVisible = false;
            this.getVCode();
        });
    }
}
</script>

<style scoped lang="scss">
.content-box {
    width: 18.75rem;
    // padding: 1.92rem 2.29rem 2.71rem;
    padding: 1.8rem 2.29rem;
    border-radius: 0.42rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
    // margin-top: 6.33rem;
    .title {
        font-size: 0.75rem;

        .item {
            flex-grow: 1;
            text-align: center;
        }

        .line {
            min-width: 1px;
            width: 0.04rem;
            height: 0.75rem;
            background-color: #d1d1d1;
        }
    }

    .login {
        .login-form {
            padding-top: 1rem;
        }

        .last-input {
            margin-bottom: 0.8rem;
        }

        .form-item {
            margin-bottom: 1rem;
        }

        .submit {
            margin-top: 3.27rem;
            margin-bottom: 2rem;
        }
    }

    .registe-resert {
        .code-row {
            margin-bottom: 22px;

            .code-input {
                margin-bottom: 0;
            }

            .code-btn {
                font-size: 0.58rem;
                min-width: 5.25rem;
                margin-left: 1rem;
            }
        }

        .submit {
            margin-top: 1rem;
        }

        .form-item {
            margin-bottom: 1.3rem;
        }

        .last-input {
            margin-bottom: 0.8rem;
        }
    }

    .form {
        // margin-top: 2.08rem;
        margin-top: 1.5rem;

        .other {
            font-size: 0.58rem;
        }
    }
}

.image-box {
    .image-code-box {
        width: 8rem;
        height: 8rem;
        overflow: hidden;

        .image-code {
            border-radius: 50%;
        }
    }

    .slider {
        margin-top: 3rem;
    }
}
</style>
<style></style>
