import { ActionIcon } from '@lobehub/ui';
import { Cat, Compass, Images, MessageSquare, SmilePlus } from 'lucide-react';
import Link from 'next/link';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { useGlobalStore } from '@/store/global';
import { SidebarTabKey } from '@/store/global/initialState';
import { useSessionStore } from '@/store/session';

export interface TopActionProps {
  tab?: SidebarTabKey;
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
      <Link aria-label={t('tab.market')} href={'https://robot.liujiarong.top/chat'}>
        <ActionIcon icon={SmilePlus} placement={'right'} size="large" title={'体验版'} />
      </Link>
      <Link aria-label={t('tab.market')} href={'https://chatnio.liujiarong.top'} target="_blank">
        <ActionIcon icon={Cat} placement={'right'} size="large" title={'国内大模型'} />
      </Link>
      <Link aria-label={t('tab.market')} href={'https://aichat.liujiarong.top'} target="_blank">
        <ActionIcon icon={Images} placement={'right'} size="large" title={'绘图模型'} />
      </Link>
    </>
  );
});

export default TopActions;
