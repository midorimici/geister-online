import dict from './dict';

/** Whether the language is English. */
const isEN: boolean =
  document.cookie
    ?.split('; ')
    .find((row: string) => row.startsWith('firebase-language-override'))
    ?.split('=')[1] !== 'ja';

export const t = (key: keyof typeof dict, arg?: any): string => {
  let value = dict[key][isEN ? 'en' : 'ja'];
  if (arg) {
    value = value.replace('$1$', String(arg));
  }
  return value;
};
