<template>
  <div class="relative w-screen border margin-4 items-center flex justify-center h-screen">
    <p class="animate-bounce">You are being redirected... Hang tight..</p>
    <img
      class="animate-bounce absolute left-0 top-0"
      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQe54vntfuYgM3_GycG7RhoXWx7DkN3E56HKw&s"
    />
    <img
      class="animate-bounce"
      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQe54vntfuYgM3_GycG7RhoXWx7DkN3E56HKw&s"
    />
  </div>
</template>
<script setup>
import axios from 'axios'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const $emit = defineEmits(['redirected'])
const shortCode = route.params.shortCode
const backendUrl = 'http://127.0.0.1:8001/api/'

onMounted(() => {
  // window.location.href = 'https://www.youtube.com'

  axios
    .get(backendUrl + 'url-view/' + shortCode)
    .then((resp) => {
      setTimeout(() => {
        $emit('redirected');
        window.location.href = resp?.data?.long_url
      }, 1000)
      console.log('resp', resp?.data?.long_url)
    })
    .catch((err) => {
      console.log('err', err)
    })
})
</script>
