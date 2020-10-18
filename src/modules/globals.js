export const displayBreakpoint = 1023;
export const DISPLAY_STATE = {
  EDITOR_AND_DOCUMENT: 1,
  EDITOR: 2,
  DOCUMENT: 3,
};
export const regexConsts = {
  italicTextRegex: /((?:(?!\*).)|^|\n)\*((?:[^\s*].*?[^\s*])|[^\s*])\*(?!\*)/g,
  boldTextRegex: /((?:(?!\*).)|^|\n)\*\*((?:[^\s*].*?[^\s*])|[^\s*])\*\*(?!\*)/g,
  italicBoldTextRegex: /((?:(?!\*).)|^|\n)\*\*\*((?:[^\s*].*?[^\s*])|[^\s*])\*\*\*(?!\*)/g,
};