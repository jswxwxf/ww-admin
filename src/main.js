import { createApp } from 'vue';
import App from './App.vue';

// load
import { loadSvg } from './icons';

// css
import 'virtual:uno.css';
import '@unocss/reset/normalize.css';
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';
// import "vxe-table/lib/style.css"
// import "vxe-table-plugin-element/dist/style.css"
// import "@/styles/index.scss"
import './style.css';

const app = createApp(App);

/** 加载全局 SVG */
loadSvg(app);

app.mount('#app');
