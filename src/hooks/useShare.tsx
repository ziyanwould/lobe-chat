import {
  SiMastodon,
  SiReddit,
  SiSinaweibo,
  SiTelegram,
  SiWhatsapp,
  SiX,
} from '@icons-pack/react-simple-icons';
import { camelCase, identity, pickBy } from 'lodash-es';
import qs from 'query-string';
import type { SVGProps } from 'react';

const LinkedinIcon = ({
  size = 24,
  ...rest
}: SVGProps<SVGSVGElement> & { size?: number | string }) => (
  <svg
    fill="currentColor"
    height={size}
    viewBox="0 0 24 24"
    width={size}
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037c-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85c3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.06 2.06 0 0 1-2.063-2.065a2.064 2.064 0 1 1 2.063 2.065m1.782 13.019H3.555V9h3.564zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z" />
  </svg>
);

const stringifyHashtags = (hashtags: string[], joinfix: string = ',', prefix?: string) => {
  // eslint-disable-next-line no-param-reassign
  if (prefix) hashtags = hashtags.map((tag) => prefix + camelCase(tag));
  return hashtags.filter(Boolean).join(joinfix);
};

export const useShare = ({
  url,
  title,
  desc,
  hashtags = [],
}: {
  desc: string;
  hashtags?: string[];
  title: string;
  url: string;
}) => {
  const genRedditLink = () => {
    const query = pickBy(
      {
        title: [
          [title, desc].filter(Boolean).join(' - '),
          hashtags && stringifyHashtags(hashtags, ' ', '#'),
        ]
          .filter(Boolean)
          .join(' '),
        url,
      },
      identity,
    ) as any;
    return qs.stringifyUrl({
      query,
      url: 'https://www.reddit.com/submit',
    });
  };

  const genTelegramLink = () => {
    const query = pickBy(
      {
        text: [
          [title, desc].filter(Boolean).join(' - '),
          hashtags && stringifyHashtags(hashtags, ' ', '#'),
        ]
          .filter(Boolean)
          .join(' '),
        url,
      },
      identity,
    ) as any;
    return qs.stringifyUrl({
      query,
      url: 'https://t.me/share/url"',
    });
  };

  const genWeiboLink = () => {
    const query = pickBy(
      {
        sharesource: 'weibo',
        title: [
          [title, desc].filter(Boolean).join(' - '),
          hashtags && stringifyHashtags(hashtags, ' ', '#'),
        ]
          .filter(Boolean)
          .join(' '),
        url,
      },
      identity,
    ) as any;
    return qs.stringifyUrl({
      query,
      url: 'http://service.weibo.com/share/share.php',
    });
  };

  const genWhatsappLink = () => {
    const query = pickBy(
      {
        text: [
          [title, desc].filter(Boolean).join(' - '),
          url,
          hashtags && stringifyHashtags(hashtags, ' ', '#'),
        ]
          .filter(Boolean)
          .join(' '),
      },
      identity,
    ) as any;
    return qs.stringifyUrl({
      query,
      url: 'https://api.whatsapp.com/send',
    });
  };

  const genXLink = () => {
    const query = pickBy(
      {
        hashtags: hashtags && stringifyHashtags(hashtags),
        text: [title, desc].filter(Boolean).join(' - '),
        url,
      },
      identity,
    ) as any;
    return qs.stringifyUrl({
      query,
      url: 'https://x.com/intent/tweet',
    });
  };

  const genLinkdinLink = () => {
    const query = pickBy(
      {
        url,
      },
      identity,
    ) as any;
    return qs.stringifyUrl({
      query,
      url: 'https://www.linkedin.com/sharing/share-offsite/',
    });
  };

  const genMastodonLink = () => {
    const query = pickBy(
      {
        text: [
          [title, desc].filter(Boolean).join(' - '),

          hashtags && stringifyHashtags(hashtags, ' ', '#'),
        ]
          .filter(Boolean)
          .join(' '),
        url,
      },
      identity,
    ) as any;
    return qs.stringifyUrl({
      query,
      url: 'https://mastodon.social/share',
    });
  };

  return {
    linkedin: {
      icon: LinkedinIcon,
      link: genLinkdinLink(),
      title: 'Linkedin',
    },
    mastodon: {
      icon: SiMastodon,
      link: genMastodonLink(),
      title: 'Mastodon',
    },
    reddit: {
      icon: SiReddit,
      link: genRedditLink(),
      title: 'Reddit',
    },
    telegram: {
      icon: SiTelegram,
      link: genTelegramLink(),
      title: 'Telegram',
    },
    weibo: {
      icon: SiSinaweibo,
      link: genWeiboLink(),
      title: 'Weibo',
    },
    whatsapp: {
      icon: SiWhatsapp,
      link: genWhatsappLink(),
      title: 'WhatsApp',
    },
    x: {
      icon: SiX,
      link: genXLink(),
      title: 'X',
    },
  };
};
