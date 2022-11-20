<template>
  <div style="padding: 10px; font-size: 14px">
    <div
      style="
        width: 100%;
        display: flex;
        align-item: center;
        justify-content: center;
      "
    >
      <img :src="require('@/assets/spa-logo.png')" width="100%" height="auto" />
    </div>
    <slot />
    <!-- HẸN GẶP LẠI  -->
    <div
      style="
        width: 100%;
        display: flex;
        align-item: center;
        justify-content: center;
        flex-wrap: wrap;
      "
    >
      <div style="padding-top: 8px; width: 100%; text-align: center">
        Xin cám ơn quý khách
      </div>
      <div style="width: 100%; text-align: center">
        Hẹn gặp lại quý khách lần sau !
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ReceiptLayout',
};
</script>
