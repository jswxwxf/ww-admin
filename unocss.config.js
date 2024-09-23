import { defineConfig, presetUno, transformerVariantGroup, transformerDirectives } from 'unocss';

export default defineConfig({
  /** 预设 */
  presets: [
    /** 默认预设 */
    presetUno(),
  ],
  /** 转换器 */
  transformers: [
    /** 启用变体组特性。 */
    transformerVariantGroup(),
    /** 适用于 @apply、@screen 和 theme() 指令 */
    transformerDirectives(),
  ],
  /** 自定义规则 */
  // rules: [['uno-padding-20', { padding: '20px' }]],
  /** 自定义快捷方式 */
  // shortcuts: {
  //   'uno-wh-full': 'w-full h-full',
  //   'uno-flex-center': 'flex justify-center items-center',
  //   'uno-flex-x-center': 'flex justify-center',
  //   'uno-flex-y-center': 'flex items-center',
  // },
});
