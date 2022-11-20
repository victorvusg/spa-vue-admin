<template>
  <div class="login-container d-flex align-center justify-center">
    <LoginForm />
  </div>
</template>
<script>
import LoginForm from '@/components/Login/LoginForm';

export default {
  name: 'ViewLogin',
  components: {
    LoginForm,
  },
};
</script>
<style lang="scss" scoped>
.login-container {
  width: 100%;
  height: 100vh;
}
</style>
