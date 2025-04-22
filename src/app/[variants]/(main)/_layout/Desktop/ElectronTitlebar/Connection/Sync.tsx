import { ActionIcon } from '@lobehub/ui';
import { Loader, Wifi, WifiOffIcon } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { useElectronStore } from '@/store/electron';
import { electronSyncSelectors } from '@/store/electron/selectors';

interface SyncProps {
  onClick: () => void;
}
const Sync = memo<SyncProps>(({ onClick }) => {
  const { t } = useTranslation('electron');

  const [isIniting, isSyncActive, useRemoteServerConfig] = useElectronStore((s) => [
    !s.isInitRemoteServerConfig,
    electronSyncSelectors.isSyncActive(s),
    s.useRemoteServerConfig,
  ]);

  // 使用useSWR获取远程服务器配置
  useRemoteServerConfig();

  return (
    <ActionIcon
      icon={isIniting ? Loader : isSyncActive ? Wifi : WifiOffIcon}
      loading={isIniting}
      onClick={onClick}
      placement={'bottomRight'}
      size="small"
      title={
        isIniting
          ? t('sync.isIniting')
          : isSyncActive
            ? t('sync.inCloud')
            : t('sync.inLocalStorage')
      }
    />
  );
});

export default Sync;
