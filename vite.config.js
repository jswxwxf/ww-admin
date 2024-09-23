import { defineConfig, loadEnv } from "vite";
import { resolve } from "path";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

console.log(process.env.VITE_APP_TITLE);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const viteEnv = loadEnv(mode, process.cwd(), "");

  return {
    /** 打包时根据实际情况修改 base */
    base: viteEnv.VITE_PUBLIC_PATH,
    plugins: [vue(), vueJsx()],
    resolve: {
      alias: {
        /** @ 符号指向 src 目录 */
        "@": resolve(__dirname, "./src"),
      },
    },
    server: {
      /** 设置 host: true 才可以使用 Network 的形式，以 IP 访问项目 */
      host: true, // host: "0.0.0.0"
      /** 接口代理 */
      proxy: {
        "/api/v1": {
          target: "https://mock.mengxuegu.com/mock/63218b5fb4c53348ed2bc212",
          ws: true,
          /** 是否允许跨域 */
          changeOrigin: true,
        },
      },
    },
    build: {
      /** 单个 chunk 文件的大小超过 2048KB 时发出警告 */
      chunkSizeWarningLimit: 2048,
      rollupOptions: {
        output: {
          /**
           * 分块策略
           * 1. 注意这些包名必须存在，否则打包会报错
           * 2. 如果你不想自定义 chunk 分割策略，可以直接移除这段配置
           */
          manualChunks: {
            vue: ["vue", "vue-router", "pinia"],
            element: ["element-plus", "@element-plus/icons-vue"],
          },
        },
      },
    },
    /** 混淆器 */
    esbuild:
      mode === "development"
        ? undefined
        : {
            /** 打包时移除 debugger 和 console.log */
            drop: ["debugger", "console.log"],
            /** 打包时移除所有注释 */
            legalComments: "none",
          },
  };
});
