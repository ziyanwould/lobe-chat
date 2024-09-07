import { Icon } from '@lobehub/ui';
// import { LobeChat } from '@lobehub/ui/brand';
import { Loader2 } from 'lucide-react';
import { memo } from 'react';
import { Center, Flexbox } from 'react-layout-kit';
import Link from 'next/link';
import { Image } from 'antd';


const FullscreenLoading = memo<{ title?: string }>(({ title }) => {
  return (
    <Flexbox height={'100%'} style={{ userSelect: 'none' }} width={'100%'}>
      <Center flex={1} gap={12} width={'100%'}>
        {/* <LobeChat size={48} type={'combine'} /> */}
        <Image
          src="https://upimage.liujiarong.top/app/thumb.php?img=/i/2023/12/31/12kpwbs.png"
          width={48}
        />
        <Center gap={16} horizontal>
          <Icon icon={Loader2} spin />
          {title}
        </Center>
        <Link href={'https://robotai.liujiarong.top'} target="_blank">
          加载太慢~试试国内加速版
        </Link>
      </Center>
    </Flexbox>
  );
});

export default FullscreenLoading;
