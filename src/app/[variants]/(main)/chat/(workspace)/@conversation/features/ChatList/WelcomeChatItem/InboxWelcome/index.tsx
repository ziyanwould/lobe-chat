'use client';

import { FluentEmoji, Markdown } from '@lobehub/ui';
import { createStyles } from 'antd-style';
import { memo, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Center, Flexbox } from 'react-layout-kit';

import { BRANDING_NAME } from '@/const/branding';
import { isCustomBranding } from '@/const/version';
import { useGreeting } from '@/hooks/useGreeting';
import { featureFlagsSelectors, useServerConfigStore } from '@/store/serverConfig';

import AddButton from './AddButton';
import AgentsSuggest from './AgentsSuggest';
import QuestionSuggest from './QuestionSuggest';

const useStyles = createStyles(({ css, responsive }) => ({
  container: css`
    align-items: center;
    ${responsive.mobile} {
      align-items: flex-start;
    }
  `,
  desc: css`
    font-size: 14px;
    text-align: center;
    ${responsive.mobile} {
      text-align: start;
    }
  `,
  title: css`
    margin-block: 0.2em 0;
    font-size: 32px;
    font-weight: bolder;
    line-height: 1;
    ${responsive.mobile} {
      font-size: 24px;
    }
  `,
}));

const InboxWelcome = memo(() => {
  const { t } = useTranslation('welcome');
  const { styles } = useStyles();
  const mobile = useServerConfigStore((s) => s.isMobile);
  const greeting = useGreeting();
  const { showWelcomeSuggest, showCreateSession } = useServerConfigStore(featureFlagsSelectors);
  const [changelogData, setChangelogData] = useState<string | null>(null);

  useEffect(() => {
    let domainType: string | null = null; // Store the domain type

    if (typeof window !== 'undefined') {
      const currentDomain = window.location.hostname;

      // Determine the domain type
      if (currentDomain.startsWith('freelyai.')) {
        domainType = 'freelyai';
        console.log('当前域名是：freelyai.');
      } else if (currentDomain.startsWith('robot.')) {
        domainType = 'lobechat';
        console.log('当前域名是：robot.');
      } else {
        domainType = 'other';
        console.log('当前域名是：其他.');
      }
    }

    const fetchData = async () => {
      try {
        const response = await fetch('https://rawgithub.liujiarong.me/ziyanwould/lobe-chat/main/docs/descript.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('response.json()', data);

        // Find the correct val based on domainType
        if (domainType) {
          const relevantEntry = data.community.find((item: any) => item.type === domainType);
          if (relevantEntry) {
              setChangelogData(relevantEntry.val);
          } else {
              setChangelogData('No matching data found for this domain.');
          }
        } else {
          setChangelogData('Domain type could not be determined.');
        }

      } catch (error) {
        console.error("Could not fetch changelog:", error);
        setChangelogData('Failed to load changelog.');
      }
    };

    fetchData();
  }, []);

  return (
    <Center padding={16} width={'100%'}>
      <Flexbox className={styles.container} gap={16} style={{ maxWidth: 800 }} width={'100%'}>
        <Flexbox align={'center'} gap={8} horizontal>
          <FluentEmoji emoji={'👋'} size={40} type={'anim'} />
          <h1 className={styles.title}>{greeting}</h1>
        </Flexbox>
        <Markdown
          className={styles.desc}
          customRender={(dom, context) => {
            if (context.text.includes('<plus />')) {
              return (
                <>
                <Trans
                  components={{
                    br: <br />,
                    plus: <AddButton />,
                  }}
                  i18nKey="guide.defaultMessage"
                  ns="welcome"
                  values={{ appName: BRANDING_NAME }}
                />
               <p>{changelogData ? `\n${changelogData}` : '   \n Loading...'}</p>
                </>
              );
            }
            return dom;
          }}
          variant={'chat'}
        >
          {t(showCreateSession ? 'guide.defaultMessage' : 'guide.defaultMessageWithoutCreate', {
            appName: BRANDING_NAME,
          }) + (changelogData ? `\n${changelogData}` : '   \n Loading...')}
        </Markdown>

        {showWelcomeSuggest && (
          <>
            <AgentsSuggest mobile={mobile} />
            {!isCustomBranding && <QuestionSuggest mobile={mobile} />}
          </>
        )}
      </Flexbox>
    </Center>
  );
});

export default InboxWelcome;