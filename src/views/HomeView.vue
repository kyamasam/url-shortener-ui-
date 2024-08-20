<template>
  <main
    :class="currentBg"
    class="relative w-full flex flex-col gap-8 justify-start items-center md:h-screen py-8 bg-gradient-to-r"
  >
    <div class="absolute right-0 top-4">
      <div
        @click="colorSwitcherVisible = !colorSwitcherVisible"
        class="bg-white p-4 cursor-pointer rounded-tl-md rounded-bl-md"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
          />
        </svg>
      </div>
      <div
        v-if="colorSwitcherVisible"
        title="change color"
        class="border flex flex-col items-center py-2 rounded-md bg-white"
      >
        <div
          @click="changeBgColor(index)"
          v-for="(item, index) in bgList"
          :key="index"
          class="mt-4 border h-8 w-8 bg-gradient-to-r cursor-pointer"
          :class="item"
        ></div>
      </div>
    </div>

    <div class="w-full h-1/5 flex flex-col justify-center items-center">
      <p title="swahili for shorten" class="text-[80px]">
        Fupi. <span class="text-[40px]">sha</span>
      </p>
    </div>
    <div class="w-full flex md:flex-row flex-col px-6 gap-8 justify-center items-start">
      <!-- <form> -->
      <div class="md:w-1/3 w-full flex flex-col justify-start py-8 bg-white gap-4 p-4 rounded-md">
        <div class="flex items-start flex-col w-full gap-4">
          <input
            placeholder="Enter Url eg https://www.yourlongwebsiteurl.com/link"
            v-model="long_url"
            class="w-full py-4 rounded-md ring-2 ring-blue-100 border-blue-100"
            type="text"
          />
        </div>
        <div class="flex flex-col justify-start w-full py-4 gap-4">
          <p>Do you want a custom short code ?</p>
          <input
            class="rounded-sm px-2 py-2 ring-blue-200 border-blue-100"
            v-model="isCustomUrl"
            type="checkbox"
          />
        </div>
        <div v-if="isCustomUrl" class="flex items-start flex-col w-full gap-4">
          <p>Custom Short Url</p>
          <input
            type="text"
            class="w-full rounded-md ring-blue-200 border-blue-100"
            v-model="short_code"
          />
        </div>

        <button
          :class="loadingShorteningUrl ? 'disabled bg-blue-100 cursor-wait' : ''"
          class="rounded-md bg-blue-500 px-4 py-2 text-white"
          @click="shortenUrl"
        >
          Shorten url
        </button>
        <!-- </form> -->

        <div class="flex flex-col gap-4" v-if="shortenedUrlSlug">
          <div class="flex flex-row gap-2 rounded-md border py-4 px-2">
            <div class="flex flex-col gap-2">
              <p class="text-text sm text-blue-400">
                {{ getFullShortUrl(shortenedUrlSlug) }}
              </p>
              <p>{{ shortenerResponse?.long_url }}</p>
            </div>
            <div @click="copyText(getFullShortUrl(shortenedUrlSlug))" class="cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="white"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div
        class="flex flex-col md:w-auto w-full h-full items-center justify-start bg-white p-4 rounded-md"
      >
        <div class="flex flex-col gap-4">
          <button class="rounded-md bg-blue-500 px-4 py-2 text-white" @click="fetchUrls">
            <span v-if="fetchUrlsClicked">Refresh </span>
            <span v-else>Show My Urls</span>
          </button>

          <Loader v-if="loadingFetchUrls"></Loader>
          <div class="flex flex-col overflow-scroll gap-4">
            <div v-if="links?.length" class="">
              <div class="w-full rounded-md overflow-scroll h-80 py-4 px-2 gap-12">
                <div
                  class="border wb-white mb-4 gap-2 rounded-md py-2 px-4 flex flex-col"
                  v-for="item in links"
                  :key="item.id"
                >
                  <div class="flex flex-row items-center justify-between gap-32">
                    <div class="flex flex-row gap-2">
                      <a
                        target="_blank"
                        class="text-blue-500"
                        :href="getFullShortUrl(item?.short_code)"
                        >{{ getFullShortUrl(item?.short_code) }}</a
                      >
                      <div
                        title="copy link"
                        @click="copyText(getFullShortUrl(item?.short_code))"
                        class="cursor-pointer"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="white"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          class="size-6"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
                          />
                        </svg>
                      </div>
                    </div>

                    <div class="flex flex-col gap-2 h-full">{{ item?.visits_count }} Visits</div>
                  </div>

                  <div class="flex flex-row justify-between">
                    <a target="_blank" :href="item?.long_url">{{ item?.long_url }}</a>
                    <span class="text-gray-700 text-sm">{{
                      new Date(item?.created_at)?.toLocaleDateString()
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="text-blue-600 cursor-pointer absolute bottom-10">
      <a target="_blank" href="https://acceptance.co.ke">with love acceptance.co.ke</a>
    </div>
  </main>
</template>

<script setup>
import axios from 'axios'
import { reactive, ref } from 'vue'
import { useToast } from 'vue-toast-notification'
import Loader from './Loader.vue'
const isCustomUrl = ref(false)
const long_url = ref('')
const short_code = ref(null)
const $toast = useToast()

const shortenedUrlSlug = ref(null)
const backendUrl = 'https://url-shortener-api-d7g9.onrender.com/api/'
function getFullShortUrl(url) {
  return window.location.origin + '/' + url
}
const shortenerResponse = reactive({})
const bgList = ref([
  'from-green-300 to-yellow-300',
  'from-yellow-200 to-green-500',
  'from-sky-400 to-sky-200',
  'from-cyan-200 to-cyan-400',
  'from-emerald-500 to-lime-600',
  'from-yellow-200 to-pink-400'
])
const currentBg = ref('from-green-300 to-yellow-300')
// currentBg.value = bgList.value(Math.floor(Math.random((1 * 10) / 2)))

function changeBgColor(index) {
  console.log(bgList.value[0])
  currentBg.value = bgList.value[index]
}
const colorSwitcherVisible = ref(false)
const loadingShorteningUrl = ref(false)
function shortenUrl() {
  const data = {
    long_url: long_url.value,
    visits_count: 0,
    is_expired: false
  }
  if (short_code.value !== null) {
    data['short_code'] = short_code.value
  }
  loadingShorteningUrl.value = true

  axios
    .post(backendUrl + 'url-view/', data)
    .then((resp) => {
      loadingShorteningUrl.value = false

      console.log('success')
      $toast.open({
        message: 'Success! Your Url Was shortened',
        type: 'success'
        // all of other options may go here
      })
      shortenedUrlSlug.value = resp.data.short_code
      Object.assign(shortenerResponse, resp.data)
      fetchUrls()
    })
    .catch((error) => {
      loadingShorteningUrl.value = false

      console.log('err')
      error?.response?.data?.errors?.map((e) => {
        $toast.open({
          message: e.attr + ' ' + e.detail,
          type: 'error'
          // all of other options may go here
        })
      })
      $toast.open({
        message: 'Something went wrong!',
        type: 'error'
        // all of other options may go here
      })
      console.log('errpr', error)
    })
  console.log('long url', long_url.value)
}

const links = ref([])
const loadingFetchUrls = ref(false)
const fetchUrlsClicked = ref(false)
function fetchUrls() {
  fetchUrlsClicked.value = true
  loadingFetchUrls.value = true
  axios
    .get(backendUrl + 'url-view')
    .then((response) => {
      loadingFetchUrls.value = false
      links.value = response.data
    })
    .catch((err) => {
      loadingFetchUrls.value = false
    })
}

async function copyText(text) {
  try {
    $toast.open({
      message: 'Copied',
      type: 'success'
    })
    await navigator.clipboard.writeText(text)
  } catch ($e) {
    $toast.open({
      message: 'Could Not Copy',
      type: 'error'
    })
  }
}
</script>
