export default function (el) {
  const labelEl = el.querySelector('label.el-form-item__label');
  if (!labelEl) {
    return;
  }
  labelEl.removeAttribute('for');
}
