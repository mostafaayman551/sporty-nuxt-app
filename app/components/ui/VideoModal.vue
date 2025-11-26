<template>
  <el-dialog
    v-model="visible"
    :show-close="true"
    :close-on-click-modal="true"
    :close-on-press-escape="true"
    width="90%"
    class="video-modal"
    @close="handleClose"
  >
    <template #header>
      <div class="modal-header">
        <h3>{{ title }}</h3>
      </div>
    </template>

    <div class="video-container">
      <video
        ref="videoRef"
        :src="videoUrl"
        controls
        autoplay
        class="video-player"
        @ended="handleVideoEnd"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";

interface Props {
  modelValue: boolean;
  videoUrl?: string;
  title?: string;
}

const props = withDefaults(defineProps<Props>(), {
  videoUrl:
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  title: "Product Demo",
});

const emit = defineEmits(["update:modelValue", "close", "ended"]);

const visible = ref(props.modelValue);
const videoRef = ref<HTMLVideoElement | null>(null);

watch(
  () => props.modelValue,
  (newVal) => {
    visible.value = newVal;
    if (newVal && videoRef.value) {
      videoRef.value.play();
    }
  }
);

watch(visible, (newVal) => {
  emit("update:modelValue", newVal);
  if (!newVal && videoRef.value) {
    videoRef.value.pause();
    videoRef.value.currentTime = 0;
  }
});

const handleClose = () => {
  emit("close");
};

const handleVideoEnd = () => {
  emit("ended");
};
</script>

<style scoped>
:deep(.video-modal) {
  max-width: 1200px;
}

:deep(.video-modal .el-dialog__header) {
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
  background: linear-gradient(135deg, #f8fafc, #ffffff);
}

:deep(.video-modal .el-dialog__body) {
  padding: 0;
  background: #000;
}

.modal-header h3 {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.video-container {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 Aspect Ratio */
  background: #000;
}

.video-player {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

@media (max-width: 768px) {
  :deep(.video-modal) {
    width: 95% !important;
  }
}
</style>
