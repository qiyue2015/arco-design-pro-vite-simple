import localeMessageBox from '@/components/message-box/locale/en-US';
import localeLogin from '@/views/login/locale/en-US';
import localeSettings from './en-US/settings';

export default {
  'menu.dashboard': 'Dashboard',
  'menu.dashboard.index': 'Workplace',
  'menu.profile': 'Profile',
  'menu.user': 'User Center',
  'menu.arcoWebsite': 'Arco Design',
  'menu.faq': 'FAQ',
  'menu.form.tiptap': 'Rich Text',
  ...localeSettings,
  ...localeMessageBox,
  ...localeLogin,
};
