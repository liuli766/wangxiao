<template>
    <div class="footer b-c-root full-width xy-center" id="appFooter">
        <div class="app-width footer-content full-height xy-between f-c-fff">
            <img
                :src="footerLog"
                class="logo pointer"
                @click="changeNav(navList[0])"
            />
            <div
                class="yx-center jf-start al-str friend-link text-box fontSize58 "
            >
                <div class="title FW600">友情链接</div>
                <a
                    v-for="(item, index) in firendLink"
                    :key="index"
                    class="item pointer f-c-fff"
                    :href="item.link"
                    target="_blank"
                    :alt="item.name"
                >
                    {{ item.name }}
                </a>
            </div>

            <div
                class="yx-center jf-start al-str about-me friend-link text-box"
            >
                <div class="title FW600">关于我们</div>
                <div
                    v-for="(item, index) in aboutList"
                    :key="index"
                    class="item pointer f-c-fff"
                    :href="item.link"
                    :alt="item.title"
                    @click="toArticleDetails(item)"
                >
                    <a
                        :href="toArticleDetailsPath(item)"
                        style="display:none;"
                    ></a>
                    {{ item.title }}
                </div>
            </div>
            <div class="qr-box yx-between text-box fontSize5">
                <img :src="appQr" class="qr pointer" />
                <div class="item f-c-fff">APP 下载</div>
            </div>
            <div class="other yx-between jf-start al-str f-c-fff text-box">
                <div class="title fontSize58">{{ recordMsg.title }}</div>
                <div
                    v-for="(item, index) in recordMsg.item"
                    :key="index"
                    class="item fontSize5"
                    style="margin-top:0.7rem;"
                >
                    {{ item }}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { packageList, aboutUs, configDetail } from "@/action";
import { VueComponent } from "@/vue";
// 友情链接
interface FriendLink {
    link: string;
    name: string;
}
// 备案信息
interface RecordMsg {
    title: string;
    item: Array<string>;
}
@Component
export default class Footer extends VueComponent {
    // data
    aboutList: any = [];
    firendLink: Array<FriendLink> = [
        {
            link: "https://www.baidu.com",
            name: "百度"
        }
    ];

    // 备案信息
    recordMsg: RecordMsg = {
        title: "咨询热线 023-62457439",
        item: [
            "版权所有© 渝ICP备 14006812号-5",
            "2014-2019 重庆才士企业管理服务有限公司",
            "渝公网安备 50010802002731号"
        ]
    };
    footerLog: string = "";
    appQr: string = "";
    created() {
        this.loadMessage();
    }

    mounted() {
        this.loadAboutMe();
        this.footerLog = `https://cdn.caishi.cn/cswx/${location.host}/footer-logo.png`;

        // window.onload = function() {
        //     const script = document.createElement("script");
        //     script.src =
        //         "https://s95.cnzz.com/z_stat.php?id=1278133893&web_id=1278133893";
        //     // @ts-ignore
        //     script.language = "JavaScript";
        //     document.body.appendChild(script);
        // };
    }
    loadAboutMe() {
        aboutUs({
            currentPage: 1,
            pageSize: 5
        }).then(res => {
            this.aboutList = res.content;
            // console.log(res, "关于我们");
        });
    }

    toArticleDetails(item: any) {
        if (item.constructionType === 1) {
            this.$router.push({
                path: "/ArticleDetails",
                query: { articleId: item.id }
            });
        } else if (item.constructionType === 2) {
            let link = item.link;
            window.open(link);
        }
    }

    toArticleDetailsPath(item: any) {
        switch (item.constructionType) {
        case 1:
            return `/ArticleDetails?articleId=${item.id}`;
        case 2:
            return item.link;
        default:
            return "";
        }
    }

    loadMessage() {
        configDetail("pc-firends-cswx").then(result => {
            this.firendLink = result;
        });
        configDetail("pc-record-msg-cswx").then(recordMsg => {
            this.recordMsg = recordMsg;
        });
        configDetail("pc-footer-app-qr").then(appQr => {
            this.appQr = appQr;
        });
    }
}
</script>

<style scoped lang="scss">
.footer {
    height: 8.33rem;
    .footer-content {
        .logo {
            width: 6.38rem;
        }
        .friend-link {
            font-size: 0.5rem;
            align-self: flex-start;
            margin-top: 1.29rem;
            div {
                margin-top: 0.6rem;
            }
            a {
                margin-top: 0.6rem;
            }
        }
        .qr-box {
            width: 5rem;
            overflow: hidden;
            .qr {
                height: 5rem;
            }
            .item {
                margin-top: 0.29rem;
            }
        }
        .text-box {
            .title {
                font-size: 0.56rem;
            }
            .item {
                font-size: 0.5rem;
            }
        }
    }
}
</style>
