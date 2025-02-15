// import { Icon } from '@lobehub/ui';
// import { Loader2 } from 'lucide-react';
import React, { memo, ReactNode, useEffect, useState } from 'react';
import { Center, Flexbox } from 'react-layout-kit';
import Link from 'next/link';
import { Image } from 'antd';
// import { ProductLogo } from '@/components/Branding';
import InitProgress, { StageItem } from '@/components/InitProgress';

interface FullscreenLoadingProps {
  activeStage: number;
  contentRender?: ReactNode;
  stages: StageItem[];
}

const FullscreenLoading = memo<FullscreenLoadingProps>(({ activeStage, stages, contentRender }) => {
  const [linkHref, setLinkHref] = useState('');
  const [linkText, setLinkText] = useState('');
  const [appName, setAppName] = useState('LobeChat'); // 默认应用名

  useEffect(() => {
    // 获取当前域名
    const currentDomain = window.location.hostname;
    const isDomestic = currentDomain.endsWith('.top');
    const isOnline = currentDomain.endsWith('.online');

    // 根据域名设置应用名称
    if (currentDomain.startsWith('www') || currentDomain.startsWith('freelyai')) {
      setAppName('Freely Ai');
      if (isOnline) {
        setLinkHref(isDomestic ? 'https://freelyai.liujiarong.me' : 'https://freelyai.liujiarong.online');
        setLinkText(isDomestic ? '加载太慢~试试FreelyAi海外加速版' : '加载太慢~试试FreelyAi国内加速版');
      } else {
        //如果不是.online结尾，则使用原来的默认配置或者提供其他默认配置
        setLinkHref('https://robot.liujiarong.me'); // 这里只是一个填充值，可以根据需求修改
        setLinkText('加载太慢~试试其他加速版'); //同上
      }
    } else if (currentDomain.startsWith('robot')) {
      setAppName('Robot Chat');
      if (isDomestic) {
        setLinkHref(isDomestic ? 'https://robot.liujiarong.me' : 'https://robot.liujiarong.top');
        setLinkText(isDomestic ? '加载太慢~试试Robot Chat海外加速版' : '加载太慢~试试Robot Chat国内加速版');
      } else {
        //如果不是.top结尾，则使用原来的默认配置或者提供其他默认配置
        setLinkHref('https://robot.liujiarong.me'); // 这里只是一个填充值，可以根据需求修改
        setLinkText('加载太慢~试试其他加速版'); //同上
      }

    } else if (currentDomain.startsWith('lobechat')) {
      setAppName('LobeChat');
      if (isDomestic) {
        setLinkHref(isDomestic ? 'https://lobechat.liujiarong.me' : 'https://lobechat.liujiarong.top');
        setLinkText(isDomestic ? '加载太慢~试试LobeChat海外加速版' : '加载太慢~试试LobeChat国内加速版');
      } else {
        //如果不是.top结尾，则使用原来的默认配置或者提供其他默认配置
        setLinkHref('https://robot.liujiarong.me'); // 这里只是一个填充值，可以根据需求修改
        setLinkText('加载太慢~试试其他加速版'); //同上
      }
    } else {
      setAppName('LobeChat');
      //如果都不是以上域名开头，则使用原来的默认配置或者提供其他默认配置
      setLinkHref('https://robot.liujiarong.me'); // 这里只是一个填充值，可以根据需求修改
      setLinkText('加载太慢~试试其他加速版'); //同上
    }
  }, []);

  return (
    <Flexbox height={'100%'} style={{ userSelect: 'none' }} width={'100%'}>
      <Center flex={1} gap={16} width={'100%'}>
        <Image
          src="https://upimage.liujiarong.top/app/thumb.php?img=/i/2023/12/31/12kpwbs.png"
          width={48}
        />
        <span style={{ fontSize: 28, fontWeight: 600 }}>{appName}</span>
        {contentRender ? contentRender : <InitProgress activeStage={activeStage} stages={stages} />}
        <Center gap={12} horizontal style={{ fontSize: 15, lineHeight: 1.5, opacity: 0.66 }}>
        </Center>
        <Link href={linkHref} target="_blank">
          {linkText}
        </Link>
      </Center>
    </Flexbox>
  );
});

export default FullscreenLoading;