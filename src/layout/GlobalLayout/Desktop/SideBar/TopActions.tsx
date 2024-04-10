/*
 * @Author: liujiarong godisljr@163.com
 * @Date: 2024-04-10 19:55:33
 * @LastEditors: liujiarong godisljr@163.com
 * @LastEditTime: 2024-04-10 21:44:56
 * @FilePath: /lobe-chat/src/layout/GlobalLayout/Desktop/SideBar/TopActions.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ActionIcon } from '@lobehub/ui';
import { Compass, MessageSquare, SmilePlus } from 'lucide-react';
import Link from 'next/link';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { GlobalStore, useGlobalStore } from '@/store/global';
import { SidebarTabKey } from '@/store/global/initialState';
import { useSessionStore } from '@/store/session';

export interface TopActionProps {
  tab?: GlobalStore['sidebarKey'];
}

const TopActions = memo<TopActionProps>(({ tab }) => {
  const { t } = useTranslation('common');
  const switchBackToChat = useGlobalStore((s) => s.switchBackToChat);

  return (
    <>
      <Link
        aria-label={t('tab.chat')}
        href={'/chat'}
        onClick={(e) => {
          e.preventDefault();
          switchBackToChat(useSessionStore.getState().activeId);
        }}
      >
        <ActionIcon
          active={tab === SidebarTabKey.Chat}
          icon={MessageSquare}
          placement={'right'}
          size="large"
          title={t('tab.chat')}
        />
      </Link>
      <Link aria-label={t('tab.market')} href={'/market'}>
        <ActionIcon
          active={tab === SidebarTabKey.Market}
          icon={Compass}
          placement={'right'}
          size="large"
          title={t('tab.market')}
        />
      </Link>
      <Link aria-label={t('tab.market')} href={'https://lobechat.liujiarong.top/chat'}>
        <ActionIcon icon={SmilePlus} placement={'right'} size="large" title={'完整版'} />
      </Link>
    </>
  );
});

export default TopActions;
