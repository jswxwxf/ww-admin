import { ref } from 'vue';

export const userDomain = ref({
  username: {
    field: 'username',
    label: '用户名',
    type: 'text',
  },
  roles: {
    field: 'roles',
    label: '角色',
    type: 'text',
  },
  phone: {
    field: 'phone',
    label: '手机号',
    type: 'text',
  },
  email: {
    field: 'email',
    label: '邮箱',
    type: 'text',
  },
  status: {
    field: 'status',
    label: '状态',
    type: 'bool',
  },
  createTime: {
    field: 'createTime',
    label: '创建时间',
    type: 'datetime',
  },
});
