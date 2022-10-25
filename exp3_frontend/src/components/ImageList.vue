<script setup lang="ts">
import { onMounted, ref } from 'vue'

// a ref to the image data array
const images = ref([] as any[])

function getImages() {
  // fetch the images from the backend
  fetch('http://localhost:3000/images')
    .then((response) => response.json())
    .then((data) => {
      // set the images ref to the data
      images.value = data
    })
}

onMounted(() => {
  getImages();
  console.log(images.value);
})
</script>

<template>
  <div v-for="image in images" :key="image.name">
    <el-image :src="image.url" fit="scale-down" :preview-src-list="[image.url]"></el-image>
  </div>
</template>