<script setup lang="ts">
import { ArchiveOutline as ArchiveIcon } from '@vicons/ionicons5'
import { NUpload, NUploadDragger, NIcon, NText, NP, NImageGroup, NImage, NDivider  } from "naive-ui"
</script>
<template>
<div id="imageList">
  <n-image-group>
    <n-image src="http://localhost:3000/images/QQ%E5%9B%BE%E7%89%8720221018204807.jpg"/>
    </n-image-group>
</div>
  <n-divider/>
  <div id="uploadimage">
  <n-upload
    multiple
    directory-dnd
    action="http://localhost:3000/image"
    :max="5"
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
      <n-p depth="3" style="margin: 8px 0 0 0">
        请不要上传敏感数据，比如你的银行卡号和密码，信用卡号有效期和安全码
      </n-p>
    </n-upload-dragger>
  </n-upload>
  </div>
</template>
