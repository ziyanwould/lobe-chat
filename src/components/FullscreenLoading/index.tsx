/*
 * @Author: 刘家荣 14731753+liujiarong2@user.noreply.gitee.com
 * @Date: 2024-12-20 16:35:13
 * @LastEditors: 刘家荣 14731753+liujiarong2@user.noreply.gitee.com
 * @LastEditTime: 2024-12-20 16:52:17
 * @FilePath: /lobe-chat/src/components/FullscreenLoading/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// import { Icon } from '@lobehub/ui';
// import { Loader2 } from 'lucide-react';
import React, { memo, useEffect, useState } from 'react';
import { Center, Flexbox } from 'react-layout-kit';
import Link from 'next/link';
import { Image } from 'antd';
// import { ProductLogo } from '@/components/Branding';
import InitProgress, { StageItem } from '@/components/InitProgress';



interface FullscreenLoadingProps {
  activeStage: number;
  stages: StageItem[];
}

const FullscreenLoading = memo<FullscreenLoadingProps>(({ activeStage, stages }) => {
  const [linkHref, setLinkHref] = useState('');
  const [linkText, setLinkText] = useState('');

  useEffect(() => {
    // 获取当前域名
    const currentDomain = window.location.hostname;

    // 根据当前域名选择链接
    const isDomestic = currentDomain.endsWith('.top');
    setLinkHref(isDomestic ? 'https://robot.liujiarong.me' : 'https://robotai.liujiarong.top');
    setLinkText(isDomestic ? '加载太慢~试试海外加速版' : '加载太慢~试试国内加速版');
  }, []);

  return (
    <Flexbox height={'100%'} style={{ userSelect: 'none' }} width={'100%'}>
      <Center flex={1} gap={16} width={'100%'}>
        {/* <ProductLogo size={48} type={'combine'} /> */}
       
        <Image
          src="https://upimage.liujiarong.top/app/thumb.php?img=/i/2023/12/31/12kpwbs.png"
          width={48}
        />
        <span style={{ fontSize: 28, fontWeight: 600 }}>Robot Chat</span>
        <InitProgress activeStage={activeStage} stages={stages} />
        <Center gap={12} horizontal style={{ fontSize: 15, lineHeight: 1.5, opacity: 0.66 }}>
        {/* <Icon icon={Loader2} size={{ fontSize: 16 }} spin /> */}
        </Center>
        <Link href={linkHref} target="_blank">
          {linkText}
        </Link>
      </Center>
    </Flexbox>
  );
});

export default FullscreenLoading;
