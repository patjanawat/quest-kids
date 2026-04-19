export interface CheerPreset {
  id: string;
  text: string;
  emoji: string;
}

export const CHEER_PRESETS: CheerPreset[] = [
  { id: 'c01', text: 'เก่งมากลูก! พ่อภูมิใจมากเลย', emoji: '🌟' },
  { id: 'c02', text: 'หนูทำได้ดีมากเลย แม่รักหนูนะ', emoji: '❤️' },
  { id: 'c03', text: 'อีกนิดเดียวก็ครบแล้ว สู้ๆ นะ!', emoji: '💪' },
];
