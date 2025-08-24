import { DESKTOP_HOTKEYS_REGISTRATION } from '@/const/hotkeys';
import { DesktopHotkeyConfig } from '@/types/hotkey';

export const DESKTOP_USER_ID = 'DEFAULT_DESKTOP_USER';

export const DEFAULT_DESKTOP_HOTKEY_CONFIG: DesktopHotkeyConfig =
  DESKTOP_HOTKEYS_REGISTRATION.reduce((acc: DesktopHotkeyConfig, item) => {
    acc[item.id] = item.keys;
    return acc;
  }, {} as DesktopHotkeyConfig);
