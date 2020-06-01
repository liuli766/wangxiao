<template>
    <div class="full-width yx-center" id="appHeader">
        <div class="header full-width yx-center al-str">
            <div class="header-top full-width xy-center">
                <div class="header-content xy-between">
                    <div class="f-c-666">欢迎来到{{ webTitle }}~</div>
                    <div v-if="!userLogin" class="login xy-between">
                        <div class="f-c-root pointer" @click="goLogin">
                            请登录
                        </div>
                        <div
                            class="f-c-666 pointer goRegister"
                            style="margin-left:0.67rem;"
                            @click="goRegister"
                        >
                            注册
                        </div>
                    </div>
                    <el-dropdown
                        v-else
                        @command="dropdownCommand"
                        :z-index="2004"
                    >
                        <div
                            class="user-msg xy-between pointer"
                            @click="go('/PersonalCenter')"
                        >
                            <img
                                :src="coverImage(currentUser.headerUrl)"
                                class="user-header"
                            />
                            <div class="f-c-root">
                                {{ currentUser.nickname }}
                            </div>
                        </div>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="center"
                                >个人中心</el-dropdown-item
                            >
                            <el-dropdown-item command="logout"
                                >退出登录</el-dropdown-item
                            >
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
            <div class="header-nav full-width b-c-fff xy-center">
                <div class="xy-between app-width">
                    <img
                        :src="headerLog"
                        class="logo pointer"
                        @click="changeNav(navList[0])"
                    />
                    <div class="nav-list xy-between b-f-333">
                        <div
                            v-for="nav in navList"
                            :key="nav.code"
                            class="pointer"
                            @click="changeNav(nav)"
                            :class="{ 'f-c-root': navActiveCode === nav.code }"
                        >
                            <a :href="nav.url" class="hidden">{{ nav.name }}</a>
                            {{ nav.name }}
                        </div>
                    </div>
                    <div class="search">
                        <el-input placeholder="搜索课程或关键词" v-model="searchInput" size="mini" @keyup.enter.native="searchSubmit">
                            <i
                                slot="suffix"
                                class="el-input__icon el-icon-search pointer"
                                @click="searchSubmit"
                            ></i>
                        </el-input>
                    </div>
                    <div
                        class="student-idea f-c-333 xy-center pointer"
                        @click="chooseStudentIdeaDialogVisible = true"
                    >
                        {{ currentStudentIdeaModel.name }}
                        <i
                            v-show="
                                currentStudentIdeaModel &&
                                    currentStudentIdeaModel.name
                            "
                            class="el-icon-arrow-down f-c-root"
                            style="margin-left:0.33rem"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div class="full-width header-bak"></div>
        <!-- 切换意向 -->
        <Dialog
            v-if="showChooseStudentIdeaDialog"
            :visible.sync="chooseStudentIdeaDialogVisible"
            width="31.67rem"
            class="student-idea-dialog"
            :z-index="2000"
            :lock-scroll="false"
        >
            <p slot="title" class="f-c-333 student-idea-dialog-title bold">
                请选择您的学习意向<span class="i"
                    >（最多可选择一项考试，可调整）</span
                >
            </p>
            <div
                class="full-width yx-between jf-start al-str student-idea-body"
            >
                <div
                    v-for="industry in studentIdeaData"
                    :key="industry.id"
                    class="industry"
                >
                    <div class="title fontSize67 f-c-333 bold">
                        {{ industry.name }}
                    </div>
                    <div class="xy-center jf-start full-width student-idea-row">
                        <div
                            v-for="studentIdea in industry.children"
                            :key="studentIdea.id"
                            class="student-idea-item fontSize58 xy-center"
                            :class="{
                                'b-c-root bor-c-root f-c-fff':
                                    studentIdea.id === activeStudentIdeaId,
                                wait: flag.chooseStudentIdea,
                                pointer: !flag.chooseStudentIdea
                            }"
                            @click="userChooseStudentIdeaId(studentIdea.id)"
                        >
                            <a :href="seoStudentIdeaId(studentIdea.id)"></a>
                            {{ studentIdea.name }}
                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from "vue-property-decorator";
import {
    currentUser,
    studentIdeaDetail,
    selectStudentIdea1,
    memberChooseStudentIdea,
    userImType,
    pcCourseList,
    configDetail
} from "@/action";
import { VueComponent } from "@/vue";
import Dialog from "@/components/Dialog.vue";
import { IM } from "@/im";
interface NavItem {
    name: string;
    url: string;
    code: string;
}
@Component({
    components: {
        Dialog
    }
})
export default class Header extends VueComponent {
    @Prop(String) private navPath!: string;
    // data
    searchInput: string = "";
    navActiveCode: string = "home";
    navList: Array<NavItem> = [
        {
            name: "首页",
            url: "/",
            code: "home"
        },
        {
            name: "课程",
            url: "/c-course",
            code: "xk"
        },
        {
            name: "我的学习",
            url: "/course",
            code: "wdkc"
        },
        {
            name: "发现",
            url: "/found",
            code: "fx"
        }
    ];
    chooseStudentIdeaDialogVisible: boolean = false;
    showChooseStudentIdeaDialog: boolean = true;
    flag = {
        loadStudentIdea: false,
        chooseStudentIdea: false
    };
    courseList = {
        pageSize: 5,
        currentPage: 1,
        type: "pc-course",
        total: 0,
        content: []
    };
    informationList = {
        pageSize: 5,
        currentPage: 1,
        total: 0,
        type: "information",
        content: []
    };
    studentIdeaData: Array<any> = [];
    activeStudentIdeaId: string | null = null;
    jim: IM | null = null;
    headerLog: string = "";
    webTitle: string = "";
    created() {}
    mounted() {
        this.loadCurrentUser();
        this.loadStudentIdea();
        this.loadHeaderMessage();
        this.headerLog = `https://cdn.caishi.cn/cswx/${location.host}/header-logo.png`;
    }
    // watch
    @Watch("navPath")
    routerPath(path: string) {
        if (path.startsWith("/login") || path.startsWith("/register")) {
            this.showChooseStudentIdeaDialog = false;
        } else {
            this.showChooseStudentIdeaDialog = true;
        }
        this.chooseStudentIdeaDialogVisible = false;
        this.navList.forEach(nav => {
            // @ts-ignore
            if (path.startsWith(nav.url)) {
                this.navActiveCode = nav.code;
            }
        });
    }
    // 监听用户存在状态 然后后去用户信息
    @Watch("state.userLoginStatus")
    userLoginStatus(userLoginStatus: boolean) {
        if (
            userLoginStatus &&
            (!this.state.currentUser || !this.state.currentUser.id)
        ) {
            this.loadCurrentUser();
        }
    }
    // 设置用户选择意向详情
    @Watch("state.currentStudentIdeaId")
    studentIdeaId(studentIdeaId: string) {
        this.activeStudentIdeaId = studentIdeaId;
        if (studentIdeaId) {
            studentIdeaDetail(studentIdeaId).then((idea: any) => {
                this.state.currentStudentIdeaModel = idea;
            });
        }
    }

    get userLogin(): boolean {
        return Boolean(this.state.userLoginStatus);
    }
    get currentStudentIdeaModel(): any {
        return this.state.currentStudentIdeaModel;
    }
    get currentUser(): any {
        return this.state.currentUser || {};
    }
    // 加载学习意向
    loadStudentIdea() {
        // 加载学习意向树
        this.flagPromise(selectStudentIdea1(), "loadStudentIdea").then(r => {
            this.studentIdeaData = r;
            if (!this.state.currentStudentIdeaId) {
                let res = localStorage.getItem("studentIdeaId");
                if (!res) {
                    res = (((r[0] || {}).children || [])[0] || {}).id;
                }
                this.state.currentStudentIdeaId = res;
            }
        });
    }
    // 加载当前用户
    loadCurrentUser() {
        currentUser().then((user: any) => {
            this.state.currentUser = user;
            this.state.userLoginStatus = true;
            // 加载IM信息
            this.loadIm(user);
        });
    }
    async loadIm(user: any) {
        let imType = await userImType();
        try {
            // console.log("初始化");
            let jim = new IM(
                {
                    username: user.id,
                    password: user.id
                },
                {
                    nickname: user.name || "未知",
                    headerUrl: this.coverImage(user.headerUrl),
                    userImType: imType
                }
            );
            await jim.initJGIM();
            // console.log("初始化完成");
            this.state.imInstance = jim;
        } catch (error) {
            console.error(error);
        }
    }
    // 点击导航栏
    changeNav(nav: NavItem) {
        this.navActiveCode = nav.code;
        if (nav.url.startsWith("http")) {
            window.location.href = nav.url;
        } else {
            this.go(nav.url);
        }
    }
    // 搜索
    searchSubmit() {
        this.$router.push({
            path: "/Search",
            query: { searchKey: this.searchInput }
        });
    }

    dropdownCommand(command: "logout" | "center") {
        if (command === "logout") {
            this.logout();
        } else if (command === "center") {
            this.$router.push({
                path: "/PersonalCenter"
            });
        }
    }
    // 点击选择意向
    userChooseStudentIdeaId(studentIdeaId: string) {
        if (!this.flag.chooseStudentIdea) {
            if (this.userLogin) {
                this.flagPromise(
                    memberChooseStudentIdea(studentIdeaId),
                    "chooseStudentIdea"
                ).then((studentIdeaModel: any) => {
                    this.$message.success("意向切换成功");
                    this.chooseStudentIdeaDialogVisible = false;
                });
            } else {
                localStorage.setItem("studentIdeaId", studentIdeaId);
                this.state.currentStudentIdeaId = studentIdeaId;
                this.chooseStudentIdeaDialogVisible = false;
            }
        }
    }

    seoStudentIdeaId(id: string) {
        if (location.search) {
            if (location.search.includes("studentIdeaId")) {
                let k = location.search.slice(
                    location.search.indexOf("studentIdeaId")
                );
                if (k.indexOf("&") > 0) {
                    k = k.slice(0, k.indexOf("&"));
                }
                location.search.replace(k, `studentIdeaId=${id}`);
            }
            return `${location.pathname}${location.search}studentIdeaId=${id}`;
        }
        return `${location.pathname}?studentIdeaId=${id}`;
    }
    loadHeaderMessage() {
        configDetail("pc-index-title-cswx").then(webTitle => {
            this.webTitle = webTitle;
        });

        configDetail("pc-nav-list").then(navList => {
            this.navList = navList;
        });
    }
}
</script>

<style scoped lang="scss">
.goRegister:hover {
    color: #96c321;
}
.header-content {
    width: $appContentWidth;
}

.header {
    height: 4.8rem;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    min-width: $appMinWidth;
    z-index: 2001;
}

.header-bak {
    height: 4.8rem;
}

.header-top {
    background-color: #e5e7e8;
    height: 1.42rem;
    font-size: 0.5rem;
    .user-msg {
        .user-header {
            width: 1.17rem;
            height: 1.17rem;
            border-radius: 50%;
            margin-right: 0.33rem;
        }
    }
}

.header-nav {
    height: 3.38rem;
    .logo {
        width: 6.38rem;
    }

    .nav-list {
        font-size: 0.67rem;
        flex-grow: 1;
        margin: 0 5.5rem;
    }

    .search {
        width: 8.33rem;
        margin-right: 3.38rem;
    }
    .student-idea {
        font-size: 0.58rem;
        min-width: 7em;
    }
}
.student-idea-dialog {
    .student-idea-dialog-title {
        font-size: 0.83rem;
        .i {
            font-size: 0.5rem;
            color: #9d9d9d;
        }
    }
    .student-idea-body {
        .industry {
            margin-top: 1.42rem;
            .student-idea-row {
                flex-wrap: wrap;
                .student-idea-item {
                    margin-right: 0.83rem;
                    margin-top: 0.63rem;
                    border-radius: 0.17rem;
                    border: 1px solid #c1c1c1;
                    box-sizing: border-box;
                    padding: 0 0.79rem;
                    height: 1.25rem;
                }
            }
        }
    }
}
</style>
<style>
.header-nav .search .el-input__inner {
    border-radius: 14px;
}
</style>
