import { ActionIcon } from '@lobehub/ui';
import { Compass, FolderClosed, MessageSquare, Cat, Home, Images, Milestone, SmilePlus, Smartphone, Trophy, Palette, Gitlab } from 'lucide-react';
import Link from 'next/link';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useGlobalStore } from '@/store/global';
import { SidebarTabKey } from '@/store/global/initialState';
import { featureFlagsSelectors, useServerConfigStore } from '@/store/serverConfig';
import { useSessionStore } from '@/store/session';

export interface TopActionProps {
  tab?: SidebarTabKey;
}

const TopActions = memo<TopActionProps>(({ tab }) => {
  const { t } = useTranslation('common');
  const switchBackToChat = useGlobalStore((s) => s.switchBackToChat);
  const { showMarket, enableKnowledgeBase } = useServerConfigStore(featureFlagsSelectors);

  const [knowledgeBaseLink, setKnowledgeBaseLink] = useState('https://lobechat.liujiarong.top');
  const [knowledgeBaseTitle, setKnowledgeBaseTitle] = useState('完整版');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentDomain = window.location.hostname;

      // 根据域名选择链接和标题
      if (currentDomain.startsWith('lobechat.')) {
        setKnowledgeBaseLink('https://robot.liujiarong.top');
        setKnowledgeBaseTitle('知识库版'); // 设置动态标题
      } else {
        setKnowledgeBaseLink('https://lobechat.liujiarong.top');
        setKnowledgeBaseTitle('完整版'); // 设置动态标题
      }
    }
  }, []);

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
      <Link aria-label={t('tab.market')} href={knowledgeBaseLink}>
        <ActionIcon icon={SmilePlus} placement={'right'} size="large" title={knowledgeBaseTitle} />
      </Link>
      <Link aria-label={t('tab.market')} href={'https://chatnio.liujiarong.top'} target="_blank">
        <ActionIcon icon={Cat} placement={'right'} size="large" title={'国内大模型'} />
      </Link>
      <Link aria-label={t('tab.market')} href={'https://aichat.liujiarong.top'} target="_blank">
        <ActionIcon icon={Images} placement={'right'} size="large" title={'绘图模型'} />
      </Link>
      <Link aria-label={t('tab.market')} href={'https://www.liujiarong.top/stable-ui/'} target="_blank">
        <ActionIcon icon={Palette} placement={'right'} size="large" title={'stable-ui(AI生图)'} />
      </Link>
      <Link aria-label={t('tab.market')} href={'https://aidea.liujiarong.top'} target="_blank">
        <ActionIcon icon={Smartphone} placement={'right'} size="large" title={'移动端'} />
      </Link>
      <Link aria-label={t('tab.market')} href={'https://chat.liujiarong.top'} target="_blank">
        <ActionIcon icon={Trophy} placement={'right'} size="large" title={'VIP'} />
      </Link>
      <Link aria-label={t('tab.market')} href={'https://www.liujiarong.top'} target="_blank">
        <ActionIcon icon={Home} placement={'right'} size="large" title={'首页'} />
      </Link>
      <Link aria-label={t('tab.market')} href={'https://homarr.liujiarong.top'} target="_blank">
        <ActionIcon icon={Milestone} placement={'right'} size="large" title={'导航'} />
      </Link>
      <Link aria-label={t('tab.market')} href={'https://github.com/ziyanwould/AIForAl'} target="_blank">
        <ActionIcon icon={Gitlab} placement={'right'} size="large" title={'AIForAl'} />
      </Link>
      {enableKnowledgeBase && (
        <Link aria-label={t('tab.files')} href={'/files'}>
          <ActionIcon
            active={tab === SidebarTabKey.Files}
            icon={FolderClosed}
            placement={'right'}
            size="large"
            title={t('tab.files')}
          />
        </Link>
      )}
      {showMarket && (
        <Link aria-label={t('tab.discover')} href={'/discover'}>
          <ActionIcon
            active={tab === SidebarTabKey.Discover}
            icon={Compass}
            placement={'right'}
            size="large"
            title={t('tab.discover')}
          />
        </Link>
      )}
    </>
  );
});

export default TopActions;
