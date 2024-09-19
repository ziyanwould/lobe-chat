import { Icon } from '@lobehub/ui';
import { Loader2 } from 'lucide-react';
import { memo, useEffect, useState } from 'react';
import { Center, Flexbox } from 'react-layout-kit';
import Link from 'next/link';
import { Image } from 'antd';


const FullscreenLoading = memo<{ title?: string }>(({ title }) => {
  const [linkHref, setLinkHref] = useState('');
  const [linkText, setLinkText] = useState('');

  useEffect(() => {
    // 获取当前域名
    const currentDomain = window.location.hostname;

    // 根据当前域名选择链接
    const isDomestic = currentDomain.endsWith('.top');
    setLinkHref(isDomestic ? 'https://robotai.liujiarong.me' : 'https://robotai.liujiarong.top');
    setLinkText(isDomestic ? '加载太慢~试试海外加速版' : '加载太慢~试试国内加速版');
  }, []);

  return (
    <Flexbox height={'100%'} style={{ userSelect: 'none' }} width={'100%'}>
      <Center flex={1} gap={16} width={'100%'}>
        <Image
          src="https://upimage.liujiarong.top/app/thumb.php?img=/i/2023/12/31/12kpwbs.png"
          width={48}
        />
        <span style={{ fontSize: 28, fontWeight: 600 }}>Robot Chat</span>
        <Center gap={12} horizontal style={{ fontSize: 15, lineHeight: 1.5, opacity: 0.66 }}>
        <Icon icon={Loader2} size={{ fontSize: 16 }} spin />
          {title}
        </Center>
        <Link href={linkHref} target="_blank">
          {linkText}
        </Link>
      </Center>
    </Flexbox>
  );
});

export default FullscreenLoading;
