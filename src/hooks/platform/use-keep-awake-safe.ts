import { useKeepAwake } from 'expo-keep-awake';
// On native platforms this will call into expo-keep-awake. On web, the
// platform-specific file use-keep-awake-safe.web.ts will override this with a no-op.
export function useKeepAwakeSafe() {
  useKeepAwake();
}
