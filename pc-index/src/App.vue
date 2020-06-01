<template>
    <div id="app" class="app yx-between">
        <div v v-show="state.headerShow" class="header full-width">
            <Header :nav-path="navPath" />
        </div>
        <div class="full-width app-content yx-center jf-start">
            <router-view />
        </div>

        <div v-show="state.footerShow" class="footer full-width">
            <Footer />
        </div>
    </div>
</template>
<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import { configDetail } from "@/action";
export default {
    name: "app",
    components: {
        Header,
        Footer
    },
    data() {
        return {
            state: this.$store.state,
            navPath: null
        };
    },
    created() {
        configDetail("pc-index-title-cswx").then(title => {
            this.state.webTitle = title;
        });
        if (!this.state.systemImageConfig.imagesHost) {
            configDetail("sys-system-image-url").then(imagesHost => {
                this.state.systemImageConfig = {
                    ...this.state.systemImageConfig,
                    imagesHost
                };
            });
        }
        if (!this.state.systemImageConfig.imagePrefix) {
            configDetail("sys-image-prefix").then(imagePrefix => {
                this.state.systemImageConfig = {
                    ...this.state.systemImageConfig,
                    imagePrefix
                };
            });
        }
    },
    mounted() {
        this.navPath = this.$route.query.redirect || location.pathname;
        let links = document.head.getElementsByClassName("ico");
        let link = (links || [])[0];
        if (link) {
            link.href = `https://cdn.caishi.cn/cswx/${location.host}/favicon.ico`;
        } else {
            link.href = `https://cdn.caishi.cn/cswx/favicon.ico`;
        }
    },
    methods: {
        updateHeaderNav(path) {}
    },
    watch: {
        $route(to, from) {
            this.state.currentStudentIdeaId =
                this.$route.query.studentIdeaId ||
                this.state.currentStudentIdeaId;
            this.navPath = to.path;
            try {
                document.body.scrollIntoView();
            } catch (error) {}
        }
    }
};
</script>
<style lang="scss">
.app-width {
    width: $appContentWidth;
}
body {
    min-width: $appMinWidth;
}
body {
    background-color: $appBackColor;
}
.app-content {
    background-color: $appBackColor;
}
</style>
<style lang="css">
.style-bar::-webkit-scrollbar {
    width: 0.2rem;
    height: 0.2rem;
}
.style-bar::-webkit-scrollbar-thumb {
    background: linear-gradient(
        var(--f-c-root),
        rgba(255, 255, 255, 1),
        var(--f-c-root)
    );
    border-radius: 0.1rem;
}
.app {
    width: 100%;
    min-height: 100vh;
}
.app-content {
    flex-grow: 1;
    overflow-x: hidden;
}
.app-body {
    flex-grow: 1;
    overflow-x: hidden;
    position: relative;
}
.k-icon-l {
    margin-right: 0.3em;
}
.k-icon-r {
    margin-left: 0.3em;
}
</style>
