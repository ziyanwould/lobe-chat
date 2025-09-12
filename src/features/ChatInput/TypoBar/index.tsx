import { HotkeyEnum, getHotkeyById } from '@lobehub/editor';
import { useEditorState } from '@lobehub/editor/react';
import {
  ChatInputActionBar,
  ChatInputActions,
  type ChatInputActionsProps,
  CodeLanguageSelect,
} from '@lobehub/editor/react';
import { useTheme } from 'antd-style';
import {
  BoldIcon,
  CodeXmlIcon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  ListTodoIcon,
  MessageSquareQuote,
  SigmaIcon,
  SquareDashedBottomCodeIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from 'lucide-react';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useChatInputStore } from '@/features/ChatInput/store';

const TypoBar = memo(() => {
  const { t } = useTranslation('editor');
  const editor = useChatInputStore((s) => s.editor);
  const editorState = useEditorState(editor);
  const theme = useTheme();

  const items: ChatInputActionsProps['items'] = useMemo(
    () =>
      [
        {
          active: editorState.isBold,
          icon: BoldIcon,
          key: 'bold',
          label: t('typobar.bold'),
          onClick: editorState.bold,
          tooltipProps: { hotkey: getHotkeyById(HotkeyEnum.Bold).keys },
        },
        {
          active: editorState.isItalic,
          icon: ItalicIcon,
          key: 'italic',
          label: t('typobar.italic'),
          onClick: editorState.italic,
          tooltipProps: { hotkey: getHotkeyById(HotkeyEnum.Italic).keys },
        },
        {
          active: editorState.isUnderline,
          icon: UnderlineIcon,
          key: 'underline',
          label: t('typobar.underline'),
          onClick: editorState.underline,
          tooltipProps: { hotkey: getHotkeyById(HotkeyEnum.Underline).keys },
        },
        {
          active: editorState.isStrikethrough,
          icon: StrikethroughIcon,
          key: 'strikethrough',
          label: t('typobar.strikethrough'),
          onClick: editorState.strikethrough,
          tooltipProps: { hotkey: getHotkeyById(HotkeyEnum.Strikethrough).keys },
        },
        {
          type: 'divider',
        },

        {
          icon: ListIcon,
          key: 'bulletList',
          label: t('typobar.bulletList'),
          onClick: editorState.bulletList,
          tooltipProps: { hotkey: getHotkeyById(HotkeyEnum.BulletList).keys },
        },
        {
          icon: ListOrderedIcon,
          key: 'numberlist',
          label: t('typobar.numberList'),
          onClick: editorState.numberList,
          tooltipProps: { hotkey: getHotkeyById(HotkeyEnum.NumberList).keys },
        },
        {
          icon: ListTodoIcon,
          key: 'tasklist',
          label: t('typobar.taskList'),
          onClick: editorState.checkList,
        },
        {
          type: 'divider',
        },
        {
          active: editorState.isBlockquote,
          icon: MessageSquareQuote,
          key: 'blockquote',
          label: t('typobar.blockquote'),
          onClick: editorState.blockquote,
        },
        {
          icon: LinkIcon,
          key: 'link',
          label: t('typobar.link'),
          onClick: editorState.insertLink,
          tooltipProps: { hotkey: getHotkeyById(HotkeyEnum.Link).keys },
        },
        {
          type: 'divider',
        },
        {
          icon: SigmaIcon,
          key: 'math',
          label: t('typobar.tex'),
          onClick: editorState.insertMath,
        },
        {
          active: editorState.isCode,
          icon: CodeXmlIcon,
          key: 'code',
          label: t('typobar.code'),
          onClick: editorState.code,
          tooltipProps: { hotkey: getHotkeyById(HotkeyEnum.CodeInline).keys },
        },
        {
          icon: SquareDashedBottomCodeIcon,
          key: 'codeblock',
          label: t('typobar.codeblock'),
          onClick: editorState.codeblock,
        },
        editorState.isCodeblock && {
          children: (
            <CodeLanguageSelect
              onSelect={(value) => editorState.updateCodeblockLang(value)}
              value={editorState.codeblockLang}
            />
          ),
          disabled: !editorState.isCodeblock,
          key: 'codeblockLang',
        },
      ].filter(Boolean) as ChatInputActionsProps['items'],
    [editorState, t],
  );

  return (
    <ChatInputActionBar
      left={<ChatInputActions items={items} />}
      style={{
        background: theme.colorFillQuaternary,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
      }}
    />
  );
});

TypoBar.displayName = 'TypoBar';

export default TypoBar;
