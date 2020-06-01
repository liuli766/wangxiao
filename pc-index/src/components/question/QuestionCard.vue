<template>
    <div class="yx-center jf-start al-str question-card full-width">
        <div class="operation content-card xy-between body-padding b-c-fff">
            <div
                class="yx-center operation-item  f-c-666 pointer"
                @click="clickReturn"
            >
                <i class="icon iconfont icon-zuo"></i>
                <div class="title fontSize67 f-c-666">返回</div>
            </div>
            <div
                class="yx-center operation-item f-c-666 pointer"
                @click="questionCollect"
                v-if="showCollect"
            >
                <i
                    v-show="!nowQuestion || !nowQuestion.collectFlag"
                    class="icon iconfont icon-shoucang1"
                ></i>
                <i
                    v-show="nowQuestion && nowQuestion.collectFlag"
                    class="icon iconfont icon-shoucang f-c-root"
                />
                <div class="title fontSize67">收藏</div>
            </div>

            <div
                class="yx-center operation-item f-c-666 pointer"
                @click="dialogVisible = true"
            >
                <i class="icon iconfont icon-jiucuo"></i>
                <div class="title fontSize67">纠错</div>
            </div>
        </div>
        <div
            v-if="showCard"
            class="card yx-center al-str jf-start content-card b-c-fff  body-padding"
        >
            <div class="work-type xy-center" v-if="showSelect">
                <span class="fontSize58 f-c-9d">做题模式</span>
                <el-select
                    v-model="workTypeA"
                    placeholder="请选择"
                    @change="changeType"
                    reserve-keyword
                    ref="selectWorkType"
                    :disabled="disabledType"
                >
                    <el-option
                        v-for="item in workTypes"
                        :key="item.key"
                        :label="item.name"
                        :value="item.key"
                    >
                    </el-option>
                </el-select>
            </div>
            <!-- 计时器 -->
            <div class="timer fontSize58 f-c-333" v-show="workTypeA === 'jc'">
                <div>
                    <i
                        class="icon iconfont icon-icon-"
                        style="font-size:1.5rem;"
                    ></i>
                </div>
                <div class="FW600">
                    {{ hour }} : {{ minute }} : {{ second }}
                </div>
            </div>
            <div class="q-card yx-between jf-start al-str">
                <div class="xy-between open">
                    <div class="bold f-c-333 fontSize75">题卡</div>
                    <div
                        class="xy-center fontSize58 f-c-666 pointer"
                        @click="openQuestionCard = !openQuestionCard"
                        style="margin-right:0.5rem;"
                    >
                        <i
                            class="icon iconfont "
                            :class="[
                                openQuestionCard
                                    ? 'icon-left-double-arrow-copy'
                                    : 'icon-down-double-arrow'
                            ]"
                        />
                        {{ openQuestionCard ? "收起答题卡" : "打开答题卡" }}
                    </div>
                </div>
                <div
                    v-show="openQuestionCard"
                    class="full-width yx-center jf-start al-str card-content"
                >
                    <div class="help xy-between">
                        <div class="xy-between fontSize58 f-c-666 help-item">
                            <div
                                v-for="(item, index) in helpData"
                                :key="item.key"
                                class="help-item xy-center no-wrap-text"
                                :class="{
                                    last: index === helpData.length - 1
                                }"
                            >
                                <div
                                    class="block block1"
                                    :class="[item.className]"
                                />
                                {{ item.name }}
                            </div>
                        </div>
                        <i
                            class="icon iconfont icon-shanchu pointer"
                            @click="clearRecords"
                            v-if="workType === 'lx' && showClearBtn"
                        />
                    </div>
                    <div class="yx-center jf-start al-str card-list-box">
                        <div
                            v-for="typeData in questionData.allType || []"
                            :key="typeData.name"
                            class="yx-center al-str card-list"
                        >
                            <div class="title f-c-9d fontSize58 ">
                                {{ typeData.name }}
                            </div>
                            <div
                                class="index-box xy-center jf-start al-start f-c-fff"
                            >
                                <div
                                    v-for="(question, index) in typeData.list"
                                    :key="question.index"
                                    class="block block2 f-c-fff xy-center pointer fontSize67"
                                    @click="chooseQuestionIndex(question.index)"
                                    :class="{
                                        noWork:
                                            !question.userAnswer &&
                                            question.index !==
                                                (nowQuestion || {}).index,
                                        error:
                                            question.userAnswer &&
                                            !question.rightFlag,
                                        right:
                                            question.userAnswer &&
                                            question.rightFlag,
                                        now:
                                            question.index ===
                                            (nowQuestion || {}).index,
                                        end: index % 6 === 5
                                    }"
                                >
                                    {{ question.index + 1 }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog
            :visible.sync="dialogVisible"
            width="28.5rem"
            :before-close="handleFeedbackClose"
            class="error-correction"
        >
            <div slot="title" class="title fontSize58 f-c-333">我要纠错</div>
            <div class="body">
                <el-radio-group
                    v-model="errorCorrectionCheck"
                    class="xy-between checkbox"
                >
                    <el-radio
                        v-for="item in errorCorrectionCheckTypes"
                        :key="item"
                        :label="item"
                        >{{ item }}</el-radio
                    >
                </el-radio-group>
                <el-input
                    type="textarea"
                    :autosize="{ minRows: 4, maxRows: 6 }"
                    placeholder="请输入纠错内容,我们在收到后会及时为您解决问题"
                    v-model="errorCorrectionInput"
                >
                </el-input>
            </div>
            <div slot="footer" class="xy-center footer">
                <el-button
                    type="primary"
                    size="mini"
                    @click="pushCorrectionInput"
                    :disabled="submitErrorCorrection"
                    >提交</el-button
                >
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Emit } from "vue-property-decorator";
import { VueComponent } from "@/vue";
import { errorCorrection, addMemberQuestionLog, cancelLog } from "@/action";
type workType = "bt" | "lx" | "jc" | "see" | null;
const workTypesConf: any = {
    "0": {
        key: "lx",
        name: "练习模式"
    },
    "1": {
        key: "jc",
        name: "检测模式"
    },
    "2": {
        key: "bt",
        name: "背题模式"
    }
};
@Component({})
export default class QuestionCard extends VueComponent {
    @Prop(Object) private nowQuestion!: any;
    @Prop(String) private chapterId!: any;
    @Prop({
        type: String,
        required: false
    })
    private courseId!: string;

    @Prop({
        type: String,
        required: false
    })
    private classroomId!: string;

    @Prop({
        type: String,
        required: false
    })
    private testPageRuleId!: string;

    @Prop({
        type: String,
        default: "lx"
    })
    private workType!: workType;

    @Prop({
        type: Array,
        default: []
    })
    private workTypes!: Array<workType>;

    @Prop({
        type: Object
    })
    private questionData!: any;

    @Prop({
        type: Boolean,
        default: true
    })
    private showCard!: boolean;

    @Prop({
        type: Boolean,
        default: true
    })
    private showSelect!: boolean;

    @Prop({
        type: Boolean,
        default: true
    })
    private showCollect!: boolean;

    @Prop({
        type: Boolean,
        default: true
    })
    private showClearBtn!: boolean;

    flag: {
        [key: string]: boolean;
    } = {
        pushErrorCorrectionFlag: false
    };
    workTypeA: workType = null;
    interval: any;
    hour: number = 0;
    second: number = 0;
    minute: number = 0;
    examTime: number = 0;
    disabledType: boolean = false;
    openQuestionCard: boolean = true;
    errorCorrectionCheckTypes: Array<string> = [
        "含义错别字",
        "答案不完整",
        "题目不完整",
        "图片不完整",
        "解析不完整",
        "其他错误"
    ];
    errorCorrectionCheck: string | null = null;
    errorCorrectionInput: string | null = null;
    dialogVisible: boolean = false;

    created() {
        this.workTypeA = this.workType;
        this.mathtime();
    }
    @Watch("workType")
    workTypeWatch(workType: workType) {
        this.workTypeA = workType;
    }

    get helpData() {
        if (this.workType === "jc") {
            return [
                {
                    key: "right",
                    name: "已做",
                    className: "right"
                },
                {
                    key: "noWork",
                    name: "未做",
                    className: "noWork"
                }
            ];
        } else if (this.workType === "lx") {
            return [
                {
                    key: "right",
                    name: "正确",
                    className: "right"
                },
                {
                    key: "error",
                    name: "错误",
                    className: "error"
                },
                {
                    key: "noWork",
                    name: "未做",
                    className: "noWork"
                }
            ];
        }
        return [];
    }
    get submitErrorCorrection() {
        return !this.errorCorrectionCheck || !this.errorCorrectionInput;
    }

    @Emit("change-type")
    changeType(chooseType: workType) {
        // console.log(chooseType, 335)
        if (this.workType === chooseType) {
            return;
        } else {
            clearInterval(this.interval);
            if (chooseType === "jc") {
                this.mathtime();
            }
        }
        return {
            chooseType: chooseType,
            examTime: this.examTime
        };
    }
    @Emit("click-return")
    clickReturn() {
        return null;
    }

    // @Emit("change-dialogVisible")
    // changeDialogVisible() {
    //     return null;
    // }

    @Emit("clear-records")
    clearRecords() {
        return null;
    }

    @Emit("choose-index")
    chooseQuestionIndex(index: number) {
        return index;
    }

    @Emit("push-correction-input")
    pushCorrectionInput() {
        return {
            errorCorrectionCheck: this.errorCorrectionCheck,
            errorCorrectionInput: this.errorCorrectionInput
        };
    }

    handleFeedbackClose(done: any) {
        this.$confirm("纠错内容还未提交，确认关闭吗", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        }).then(() => {
            done();
        });
    }

    closeCorrection() {
        this.dialogVisible = false;
    }

    questionCollect() {
        let question = this.nowQuestion;
        addMemberQuestionLog({
            courseId: this.courseId,
            classroomId: this.classroomId,
            testPageRuleId: this.testPageRuleId,
            chapterId: this.chapterId,
            questionId: question.id
        }).then(() => {
            question.collectFlag = !question.collectFlag;
        });
    }
    mathtime() {
        // 计时器
        let hour = 0;
        let minute = 0;
        let second = 0;

        let me = this;
        this.interval = setInterval(() => {
            second = second + 1;
            me.second = second;
            if (me.second === 60) {
                minute = minute + 1;
                me.minute = minute;
                second = 0;
                second = second + 1;
                me.second = second;
                if (me.minute === 60) {
                    hour = hour + 1;
                    me.hour = hour;
                    me.minute = 0;
                    minute = 0;
                }
            }
            this.examTime = me.hour * 3600 + me.minute * 60 + me.second;
        }, 1000);
    }
}
</script>

<style scoped lang="scss">
.content-card {
    border-radius: 0.42rem;
}
.body-padding {
    padding-left: 1.08rem;
    // padding-right: 1.17rem;
}
.question-card {
    .operation {
        height: 4.58rem;
        padding: 0 2.08rem;
        .operation-item {
            .icon {
                font-size: 0.83rem;
                margin-bottom: 0.5rem;
            }
        }
    }
    .card {
        margin-top: 0.75rem;
        padding-top: 0.96rem;
        padding-bottom: 1.42rem;
    }
    .q-card {
        margin-top: 1.54rem;
        .open {
            padding-bottom: 0.75rem;
            border-bottom: 0.04rem solid #e5ebe8;
        }
        .card-content {
            .block1 {
                width: 0.75rem;
                height: 0.75rem;
                border-radius: 0.17rem;
                margin-right: 0.21rem;
            }
            .block2 {
                width: 1.25rem;
                height: 1.25rem;
                border-radius: 0.17rem;
                margin-right: 0.76rem;
                margin-top: 0.63rem;
                // font-size:0.6rem;
            }
            .block2.end {
                margin-right: 0;
            }
            .block.right {
                border: 0.04rem solid $rootColor;
                background-color: $rootColor;
            }

            .block.error {
                border: 0.04rem solid #ff4d24;
                background-color: #ff4d24;
            }
            .block.noWork {
                border: 0.04rem solid #b4b4b4;
                color: #333333;
            }

            .block.now.block2 {
                border: 0.04rem solid $rootColor;
                color: #333333;
                color: $rootColor;
                background-color: #ffffff;
            }
            .help {
                height: 2.04rem;
                border-bottom: 0.04rem solid #e5ebe8;
                .last.help-item {
                    margin: 0;
                }
                .help-item {
                    margin-right: 1.29rem;
                }
                .icon {
                    color: #c2c2c2;
                    font-size: 1.5rem;
                }
            }
            .card-list-box {
                height: 15rem;
                overflow-y: auto;
                .card-list {
                    margin-top: 2rem;
                    .index-box {
                        flex-wrap: wrap;
                        padding: 0.5rem 0;
                    }
                }
            }
        }
    }
}
</style>

<style>
.question-body .question-error {
    color: #ff4d24;
}

.question-body .body-padding {
    padding-left: 1.08rem;
    padding-right: 1.17rem;
}
.question-body .chapter-body .el-progress {
    margin-right: 1.29rem;
    flex-grow: 1;
    padding-top: 0.2rem;
}
.question-card .card .el-select {
    margin-left: 0.88rem;
    width: 6.67rem;
}
.question-card .card .el-select .el-input__inner {
    height: 1.22rem;
    border-radius: 0.61rem;
}
.question-card .card .el-select .el-input .el-select__caret {
    line-height: 1.22rem;
}

.error-correction .el-dialog__header {
    background-color: #f0f0f0;
}
.error-correction .footer .el-button {
    padding: 0.38rem 1.92rem;
}
.error-correction .body .checkbox {
    flex-wrap: wrap;
    justify-content: flex-start;
}
.error-correction .body .checkbox .el-radio {
    width: 33.333333%;
    margin: 0.585rem 0;
}
.error-correction .body .checkbox .el-radio .el-radio__inner {
    border-radius: 50%;
}
.error-correction .el-dialog {
    border-radius: 0.42rem;
    overflow: hidden;
}
.error-correction .el-textarea {
    margin-top: 0.7rem;
}
.timer {
    margin-top: 0.5rem;
    text-align: center;
}
</style>
