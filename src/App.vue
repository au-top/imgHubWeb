<template>
    <div id="appContent">
        <button @click="getCountImgLIst">TestApi</button>
        <div class="showImgListBox">
            <imgElem
                v-for="imgElemInfo of imgList"
                :key="`${imgSourcePath}/${imgElemInfo}`"
                :imgUrl="`${imgSourcePath}/${imgElemInfo}`"
            />
        </div>
        <div v-show="loadAll">
            <p>
                load AllImages
            </p>
        </div>
    </div>
</template>

<script lang="ts">
import $ from "jquery";
import imgElem from "./components/imgElem.vue";
import { computed, ref, Ref } from "vue";
import {CreateShake} from "./functions/shake"
const showImgList: Ref<Set<string>> = ref(new Set());
const host = "http://dev.autopc.top:8085";
const imgSourcePath = `${host}/imgSource`;
const imgList = computed(() => [...showImgList.value]);
const count = ref(1);
let loadAll=ref(false);
let getIndex = ref(0);

async function getCountImgLIst(from: number, count: number) {
    const res = await fetch(`${host}/api/imgList/${from}/${count}`);
    const resJson = res.json();
    for (const nextImgUrl of await resJson) {
        showImgList.value.add(nextImgUrl);
    }
    return resJson;
}
const scrollEvent=async () => {
    const scroolBottom =
        ($(window).height() ?? 0) + ($(document).scrollTop() ?? 0)+10;
    const boxBottom =
        ($(".showImgListBox").height() ?? 0) +
        ($(".showImgListBox").offset()?.top ?? 0);
    if (scroolBottom >= boxBottom&&!loadAll.value) {
        const newCount=(await getCountImgLIst(count.value * getIndex.value, count.value)).length
        if (newCount) {
            getIndex.value++;
            return true;
        } else {
            loadAll.value=true;
            return false;
        }
    }
};

const scrollEventShake =CreateShake(scrollEvent ,100);

export default {
    name: "App",
    components: {
        imgElem,
    },
    setup() {
        return {
            imgList,
            getCountImgLIst,
            imgSourcePath,
            loadAll
        };
    },
    created() {
        document.addEventListener("scroll", scrollEventShake);
        document.addEventListener("resize", scrollEventShake);
        (async () => {
            //fill windows
            while (await scrollEvent());
        })();
    },
    unmounted() {
        document.removeEventListener("scroll", scrollEventShake);
        document.removeEventListener("resize", scrollEventShake);
    },
};
</script>
<style lang="scss">
.showImgListBox {
    display: flex;
    flex-wrap: wrap;
}
</style>
