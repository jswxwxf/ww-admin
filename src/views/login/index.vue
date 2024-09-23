<script lang="ts" setup>
import { ref } from 'vue';

// import { useRouter } from "vue-router"
// import { useUserStore } from "@/store/modules/user"
// import { type FormInstance, type FormRules } from "element-plus"
import { User, Lock } from '@element-plus/icons-vue';
// import { getLoginCodeApi } from "@/api/login"
// import { type LoginRequestData } from "@/api/login/types/login"
// import ThemeSwitch from "@/components/ThemeSwitch/index.vue"
// import Owl from "./components/Owl.vue"
// import { useFocus } from "./hooks/useFocus"

// const router = useRouter()
// const { isFocus, handleBlur, handleFocus } = useFocus()

// /** 登录表单元素的引用 */
const loginFormRef = ref(null);

// /** 登录按钮 Loading */
// const loading = ref(false)
// /** 验证码图片 URL */
// const codeUrl = ref("")

/** 登录表单数据 */
const loginForm = ref({
  username: 'admin',
  password: '12345678',
  code: '',
});

/** 登录表单校验规则 */
const rules = {
  username: [{ required: true, message: '请输入用户名' }],
  password: [
    { required: true, message: '请输入密码' },
    { min: 8, max: 16, message: '长度在 8 到 16 个字符' },
  ],
  code: [{ required: true, message: '请输入验证码' }],
};

// /** 登录逻辑 */
const handleLogin = async () => {
  await loginFormRef?.value?.validate();
  //   loginFormRef.value?.validate((valid: boolean, fields) => {
  //     if (valid) {
  //       loading.value = true
  //       useUserStore()
  //         .login(loginForm)
  //         .then(() => {
  //           router.push({ path: "/" })
  //         })
  //         .catch(() => {
  //           createCode()
  //           loginForm.password = ""
  //         })
  //         .finally(() => {
  //           loading.value = false
  //         })
  //     } else {
  //       console.error("表单校验不通过", fields)
  //     }
  //   })
};
// /** 创建验证码 */
// const createCode = () => {
//   // 先清空验证码的输入
//   loginForm.code = ""
//   // 获取验证码
//   codeUrl.value = ""
//   getLoginCodeApi().then((res) => {
//     codeUrl.value = res.data
//   })
// }

// /** 初始化验证码 */
// createCode()
</script>

<template>
  <div class="login-container">
    <!-- <ThemeSwitch class="theme-switch" />
    <Owl :close-eyes="isFocus" /> -->
    <div class="login-card">
      <div class="title">
        <img src="@/assets/layouts/logo-text-2.png" />
      </div>
      <div class="content">
        <el-form ref="loginFormRef" :model="loginForm" :rules="rules" @keyup.enter="handleLogin">
          <el-form-item prop="username">
            <el-input
              v-model.trim="loginForm.username"
              placeholder="用户名"
              type="text"
              tabindex="1"
              :prefix-icon="User"
              size="large"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model.trim="loginForm.password"
              placeholder="密码"
              type="password"
              tabindex="2"
              :prefix-icon="Lock"
              size="large"
              show-password
              @blur="handleBlur"
              @focus="handleFocus"
            />
          </el-form-item>
          <!-- <el-form-item prop="code">
            <el-input
              v-model.trim="loginForm.code"
              placeholder="验证码"
              type="text"
              tabindex="3"
              :prefix-icon="Key"
              maxlength="7"
              size="large"
            >
              <template #append>
                <el-image :src="codeUrl" @click="createCode" draggable="false">
                  <template #placeholder>
                    <el-icon>
                      <Picture />
                    </el-icon>
                  </template>
                  <template #error>
                    <el-icon>
                      <Loading />
                    </el-icon>
                  </template>
                </el-image>
              </template>
            </el-input>
          </el-form-item> -->
          <el-button :loading="loading" type="primary" size="large" @click.prevent="handleLogin">登 录</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100%;
  // .theme-switch {
  //   position: fixed;
  //   top: 5%;
  //   right: 5%;
  //   cursor: pointer;
  // }
  .login-card {
    width: 480px;
    max-width: 90%;
    border-radius: 20px;
    box-shadow: 0 0 10px #dcdfe6;
    background-color: var(--el-bg-color);
    overflow: hidden;
    .title {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 150px;
      img {
        height: 100%;
      }
    }
    .content {
      padding: 20px 50px 50px 50px;
      :deep(.el-input-group__append) {
        padding: 0;
        overflow: hidden;
        .el-image {
          width: 100px;
          height: 40px;
          border-left: 0px;
          user-select: none;
          cursor: pointer;
          text-align: center;
        }
      }
      .el-button {
        width: 100%;
        margin-top: 10px;
      }
    }
  }
}
</style>
