import localeMessageBox from '@/components/message-box/locale/zh-CN';
import localeLogin from '@/views/auth/locale/zh-CN';

import localeUserInfo from '@/views/user/info/locale/zh-CN';
import localeUserAuthentication from '@/views/user/authentication/locale/zh-CN';

import localeSettings from './zh-CN/settings';

export default {
  'menu.dashboard': '仪表盘',
  'menu.dashboard.index': '工作台',
  'menu.profile': '详情页',
  'menu.user': '账号管理',
  'menu.arcoWebsite': 'Arco Design',
  'menu.faq': '常见问题',
  'menu.form.tiptap': '富文本',
  ...localeSettings,
  ...localeMessageBox,
  ...localeLogin,
  ...localeUserInfo,
  ...localeUserAuthentication,
};
