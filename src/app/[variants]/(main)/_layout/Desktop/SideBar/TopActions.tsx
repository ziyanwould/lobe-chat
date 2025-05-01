import { ActionIcon, ActionIconProps } from '@lobehub/ui';
import { Compass, FolderClosed, MessageSquare, Cat, Home, Images, Milestone, SmilePlus, Smartphone, Trophy, Palette, Gitlab, Rabbit } from 'lucide-react';
import Link from 'next/link';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Flexbox } from 'react-layout-kit';

import { useGlobalStore } from '@/store/global';
import { SidebarTabKey } from '@/store/global/initialState';
import { featureFlagsSelectors, useServerConfigStore } from '@/store/serverConfig';
import { useSessionStore } from '@/store/session';

const ICON_SIZE: ActionIconProps['size'] = {
  blockSize: 40,
  size: 24,
  strokeWidth: 2,
};

export interface TopActionProps {
  isPinned?: boolean | null;
  tab?: SidebarTabKey;
}

const TopActions = memo<TopActionProps>(({ tab, isPinned }) => {
  const { t } = useTranslation('common');
  const switchBackToChat = useGlobalStore((s) => s.switchBackToChat);
  const { showMarket, enableKnowledgeBase } = useServerConfigStore(featureFlagsSelectors);

  const [knowledgeBaseLink, setKnowledgeBaseLink] = useState('https://lobechat.liujiarong.top');
  const [knowledgeBaseTitle, setKnowledgeBaseTitle] = useState('完整版');

  const isChatActive = tab === SidebarTabKey.Chat && !isPinned;
  const isFilesActive = tab === SidebarTabKey.Files;
  const isDiscoverActive = tab === SidebarTabKey.Discover;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentDomain = window.location.hostname;

      // 根据域名选择链接和标题
      if (currentDomain.startsWith('freelyai.') || currentDomain.startsWith('www.')) {
        setKnowledgeBaseLink('https://robot.liujiarong.top');
        setKnowledgeBaseTitle('知识库版'); // 设置动态标题
      } else {
        setKnowledgeBaseLink('https://freelyai.liujiarong.online');
        setKnowledgeBaseTitle('自由版'); // 设置动态标题
      }
    }
  }, []);

  return (
    <Flexbox gap={8}>
      <Link
        aria-label={t('tab.chat')}
        href={'/chat'}
        onClick={(e) => {
          e.preventDefault();
          switchBackToChat(useSessionStore.getState().activeId);
        }}
      >
        <ActionIcon
          active={isChatActive}
          icon={MessageSquare}
          size={ICON_SIZE}
          title={t('tab.chat')}
          tooltipProps={{ placement: 'right' }}
        />
      </Link>
      <Link aria-label={t('tab.discover')} href={knowledgeBaseLink}>
        <ActionIcon icon={SmilePlus} size="large" title={knowledgeBaseTitle} tooltipProps={{ placement: 'right' }} />
      </Link>
      <Link aria-label={t('tab.discover')} href={'https://chatnio.liujiarong.top'} target="_blank">
        <ActionIcon icon={Cat} size="large" title={'国内大模型'} tooltipProps={{ placement: 'right' }} />
      </Link>
      <Link aria-label={t('tab.discover')} href={'https://aichat.liujiarong.top'} target="_blank">
        <ActionIcon icon={Images} size="large" title={'绘图模型'} tooltipProps={{ placement: 'right' }} />
      </Link>
      <Link aria-label={t('tab.discover')} href={'https://www.liujiarong.top/stable-ui/'} target="_blank">
        <ActionIcon icon={Palette} size="large" title={'stable-ui(AI生图)'} tooltipProps={{ placement: 'right' }} />
      </Link>
      <Link aria-label={t('tab.discover')} href={'https://aidea.liujiarong.top'} target="_blank">
        <ActionIcon icon={Smartphone} size="large" title={'移动端'} tooltipProps={{ placement: 'right' }} />
      </Link>
      <Link aria-label={t('tab.discover')} href={'https://chat.liujiarong.top'} target="_blank">
        <ActionIcon icon={Trophy} size="large" title={'VIP'} tooltipProps={{ placement: 'right' }} />
      </Link>
      <Link aria-label={t('tab.discover')} href={'https://www.liujiarong.top'} target="_blank">
        <ActionIcon icon={Home} size="large" title={'首页'} tooltipProps={{ placement: 'right' }} />
      </Link>
      <Link aria-label={t('tab.discover')} href={'https://homarr.liujiarong.top'} target="_blank">
        <ActionIcon icon={Milestone} size="large" title={'导航'} tooltipProps={{ placement: 'right' }} />
      </Link>
      <Link aria-label={t('tab.discover')} href={'https://github.com/ziyanwould/AIForAl'} target="_blank">
        <ActionIcon icon={Gitlab} size="large" title={'AIForAl'} tooltipProps={{ placement: 'right' }} />
      </Link>
      <Link aria-label={t('tab.discover')} href={'https://lobechat.liujiarong.top'} target="_blank">
        <ActionIcon icon={Rabbit} size="large" title={'LobeChat'} tooltipProps={{ placement: 'right' }} />
      </Link>
      {enableKnowledgeBase && (
        <Link aria-label={t('tab.files')} href={'/files'}>
          <ActionIcon
            active={isFilesActive}
            icon={FolderClosed}
            size={ICON_SIZE}
            title={t('tab.files')}
            tooltipProps={{ placement: 'right' }}
          />
        </Link>
      )}
      {showMarket && (
        <Link aria-label={t('tab.discover')} href={'/discover'}>
          <ActionIcon
            active={isDiscoverActive}
            icon={Compass}
            size={ICON_SIZE}
            title={t('tab.discover')}
            tooltipProps={{ placement: 'right' }}
          />
        </Link>
      )}
    </Flexbox>
  );
});

export default TopActions;
