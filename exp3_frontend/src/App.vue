<script setup lang="ts">
import { ArchiveOutline as ArchiveIcon } from "@vicons/ionicons5";
import { forEach } from "lodash";
import { ref } from "vue";
import {
  NUpload,
  NUploadDragger,
  NIcon,
  NText,
  NP,
  NImageGroup,
  NImage,
  NDivider,
  NConfigProvider,
  useOsTheme,
  darkTheme,
  NSpace,
  NButton,
  NInput,
} from "naive-ui";

const theme = ref(useOsTheme().value === "dark" ? darkTheme : null);
var range = ref<[number, number]>([1183135260000, Date.now()]);
// get image info form http://localhost:3000/images
var imageList = ref([]);
fetch("http://localhost:3000/images")
  .then((response) => response.json())
  .then((data) => {
    forEach(data, (value, key) => {
      imageList.value.push(value);
    });
  });

// when upload file success , refresh imageList
const onUploadSuccess = () => {
  fetch("http://localhost:3000/images")
    .then((response) => response.json())
    .then((data) => {
      imageList.value = [];
      forEach(data, (value, key) => {
        imageList.value.push(value);
      });
    });
};
</script>
<template>
  <n-config-provider :theme="theme">
    <n-space vertical>
      <!-- image filter -->
      <n-space>
        <n-input placeholder="filter" />
        <n-button round>filter</n-button>
      </n-space>
      <n-divider />
      <n-image-group show-toolbar-tooltip>
        <n-space>
          <n-image
            width="200"
            lazy
            v-for="image in imageList"
            :src="image.url"
            :alt="image.name + ',' + image.address + ',' + image.date"
          />
        </n-space>
      </n-image-group>
      <n-divider />
      <n-upload
        multiple
        directory-dnd
        action="http://localhost:3000/images"
        :max="5"
        accept=".jpg,.jpeg,.png"
        :on-finish="onUploadSuccess"
      >
        <n-upload-dragger>
          <div style="margin-bottom: 12px">
            <n-icon size="48" :depth="3">
              <archive-icon />
            </n-icon>
          </div>
          <n-text style="font-size: 16px">
            点击或者拖动文件到该区域来上传
          </n-text>
          <n-p depth="3" style="margin: 8px 0 0 0"> 请不要上传敏感数据 </n-p>
        </n-upload-dragger>
      </n-upload>
    </n-space>
  </n-config-provider>
</template>
