'use client';

import { Icon } from '@lobehub/ui';
import { Button } from 'antd';
import { SendHorizonal } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Flexbox } from 'react-layout-kit';

import { featureFlagsSelectors, useServerConfigStore } from '@/store/serverConfig';

const Actions = memo<{ mobile?: boolean }>(({ mobile }) => {
  const { t } = useTranslation('welcome');
  const router = useRouter();
  const { showMarket } = useServerConfigStore(featureFlagsSelectors);
  
  const [linkHref, setLinkHref] = useState('');
  const [linkText, setLinkText] = useState('');

  useEffect(() => {
    // 获取当前域名
    const currentDomain = window.location.hostname;

    // 根据当前域名选择链接
    const isDomestic = currentDomain.endsWith('.top');
    setLinkHref(isDomestic ? 'https://robot.liujiarong.me' : 'https://robot.liujiarong.top');
    setLinkText(isDomestic ? '海外加速版' : '国内加速版');
  }, []);

  return (
    <Flexbox gap={16} horizontal={!mobile} justify={'center'} width={'100%'} wrap={'wrap'}>
      {showMarket && (
        <Link href={'/market'}>
          <Button block={mobile} size={'large'} style={{ minWidth: 160 }} type={'default'}>
            {t('button.market')}
          </Button>
        </Link>
      )}
      <Button
        block={mobile}
        onClick={() => router.push('/chat')}
        size={'large'}
        style={{ minWidth: 160 }}
        type={'primary'}
      >
        <Flexbox align={'center'} gap={4} horizontal justify={'center'}>
          {t('button.start')}
          <Icon icon={SendHorizonal} />
        </Flexbox>
      </Button>
      <Link href={linkHref} target="_blank">
        <Button block={mobile} size={'large'} style={{ minWidth: 160 }} type={'default'}>
          {linkText}
        </Button>
      </Link>
    </Flexbox>
  );
});

export default Actions;
