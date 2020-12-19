<template>
    <div id="appContent">
        <div class="showImgListBox">
            <imgElem
                @click="clickImgMini($event, $event.target)"
                v-for="imgElemInfo of imgList"
                :key="`${imgPreviewImgPath}/${imgElemInfo}`"
                :imgUrl="`${imgPreviewImgPath}/${imgElemInfo}`"
            />
        </div>
        <div v-show="loadAll">
            <p>load AllImages</p>
        </div>

        <div class="showImageBox">
            <transition name="opacityIn">
                <div class="coverLayer" @click="exitBigImg" v-if="showBigLayer">
                    <img :src="showBigImage" @click.stop="" />
                </div>
            </transition>
            <div class="showBigImg" :style="{ ...showImgRef.style }"></div>
        </div>
    </div>
</template>

<script lang="ts">
import $ from "jquery";
import imgElem from "./components/imgElem.vue";
import { host, publicPath, imgPreviewImgPath, imgSourcePath } from "./config";
import { computed, reactive, ref, Ref } from "vue";
import { createShake } from "./functions/shake";
const showImgList: Ref<Set<string>> = ref(new Set());

const imgList = computed(() => [...showImgList.value]);
const count = ref(2);
let loadAll = ref(false);
let getIndex = ref(0);
let showBigLayer = ref(false);
let showBigImage = ref("");
async function getCountImgLIst(from: number, count: number) {
    const res = await fetch(`${host}/api/imgList/${from}/${count}`);
    const resJson = res.json();
    for (const nextImgUrl of await resJson) {
        showImgList.value.add(nextImgUrl);
    }
    return resJson;
}
const scrollEvent = async () => {
    const scroolBottom =
        ($(window).height() ?? 0) + ($(document).scrollTop() ?? 0) + 10;
    const boxBottom =
        ($(".showImgListBox").height() ?? 0) +
        ($(".showImgListBox").offset()?.top ?? 0);
    if (scroolBottom >= boxBottom && !loadAll.value) {
        const newCount = (
            await getCountImgLIst(count.value * getIndex.value, count.value)
        ).length;
        if (newCount) {
            getIndex.value++;
            await scrollEvent();
            return true;
        } else {
            loadAll.value = true;
            return false;
        }
    }
};

let showImgRef = reactive({
    style: {
        width: "0px",
        height: "0px",
        left: "0px",
        top: "0px",
        animation: "",
        backgroundImage: "",
        display: "none",
    },
});

function exitBigImg() {
    showBigLayer.value = false;
}

function showBigImgAnimation(imgDomElem: HTMLElement) {
    const imgElem = $(imgDomElem);
    const imgContent = $(
        Array.from(imgElem.parents(".imgElemContent"))[0] ?? imgElem
    );
    const imgSourceElem = $(imgContent.find("img.imgElemSource").toArray()[0]);
    const pos = imgContent.position();
    const imgW = imgContent.width();
    const imgH = imgContent.height();
    showImgRef.style.animation = ``;
    showImgRef.style.display = `block`;
    showImgRef.style.width = `${imgW ?? 0}px`;
    showImgRef.style.height = `${imgH ?? 0}px`;
    showImgRef.style.left = `${pos.left ?? 0}px`;
    showImgRef.style.top = `${pos.top ?? 0}px`;
    showImgRef.style.animation = ` startBigImage 0.45s linear  `;
    showImgRef.style.backgroundImage = `url('${
        imgSourceElem.attr("src") ?? ""
    }')`;
    //set big img
    showBigImage.value = `${imgSourcePath}/${
        (imgSourceElem.attr("src") ?? "").split("/").reverse().shift() ?? ""
    }`;
    // showImgRef.style.animation='showBigImg .6s ';
}

function clickImgMini(e: Event, elem: HTMLElement) {
    showBigLayer.value = true;
    showBigImgAnimation(elem);
}

const scrollEventShake = createShake(scrollEvent, 60);
export default {
    name: "App",
    components: {
        imgElem,
    },
    setup() {
        return {
            showImgRef,
            imgList,
            getCountImgLIst,
            imgPreviewImgPath,
            loadAll,
            showBigImgAnimation,
            showBigLayer,
            showBigImage,
            clickImgMini,
            exitBigImg,
        };
    },
    created() {
        document.addEventListener("scroll", scrollEventShake);
        document.addEventListener("resize", scrollEventShake);
    },
    mounted() {
        scrollEvent();
        const e = document.querySelector(".showBigImg");
        e?.addEventListener("animationend", () => {
            showImgRef.style.animation = "";
            showImgRef.style.display = `none`;
        });
    },
    unmounted() {
        document.removeEventListener("scroll", scrollEventShake);
        document.removeEventListener("resize", scrollEventShake);
    },
};
</script>
<style lang="scss">

#appContent{
    width:95%;
    margin:0 auto;
}
.showImgListBox {
    display: flex;
    flex-wrap: wrap;
}

@keyframes startBigImage {
    0% {
        transform: scale(0.5);
        opacity: 0.8;
    }
    100% {
        transform: scale(1.2);
        opacity: 0;
    }
}

@keyframes inAnimation {
    0% {
        transform: scale(0.5);
    }
    100% {
        transform: scale(1);
    }
}

.showBigImg {
    box-shadow: 0 0 2px #8888;
    position: absolute;
    background-size: cover;
    background-position: center;
}
.coverLayer {
    padding: min(40px, 5%);
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #0005;
    img {
        animation: inAnimation 0.5s forwards;
        object-fit: contain;
        max-width: 80%;
        max-height: 80%;
        background:#fff;
    }
}


.opacityIn-enter-active {
  animation:opacityIn 0.3s;
}
.opacityIn-leave-active {
  animation: opacityIn 0.3s reverse;
}
@keyframes opacityIn {
  0% {
      opacity:0;
  }
  100% {
      opacity:1;
  }
}
</style>
