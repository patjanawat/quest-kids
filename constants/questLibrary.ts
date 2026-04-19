import { QuestLibraryItem } from '../types';

export const QUEST_LIBRARY: QuestLibraryItem[] = [
  // Mandatory (6 items)
  { id: 'q01', title: 'ทำการบ้านให้เสร็จ', description: 'ทำการบ้านทุกวิชาให้เสร็จสิ้น', icon: '📚', defaultRewardMinutes: 30, defaultXpReward: 20, isMandatory: true, category: 'education' },
  { id: 'q03', title: 'แปรงฟันเช้า-เย็น', description: 'แปรงฟันอย่างน้อย 2 นาทีทั้งเช้าและเย็น', icon: '🦷', defaultRewardMinutes: 5, defaultXpReward: 5, isMandatory: true, category: 'health' },
  { id: 'q08', title: 'กินข้าวตามเวลา', description: 'กินข้าวเช้า กลางวัน เย็น ตามเวลาที่กำหนด', icon: '🍚', defaultRewardMinutes: 5, defaultXpReward: 5, isMandatory: true, category: 'health' },
  { id: 'q09', title: 'เก็บของเข้าที่', description: 'เก็บของเล่นและสิ่งของกลับที่เดิมหลังใช้', icon: '🧸', defaultRewardMinutes: 5, defaultXpReward: 5, isMandatory: true, category: 'chores' },
  { id: 'q10', title: 'อาบน้ำเอง', description: 'อาบน้ำและแต่งตัวเองโดยไม่ต้องให้พ่อแม่ช่วย', icon: '🚿', defaultRewardMinutes: 5, defaultXpReward: 5, isMandatory: true, category: 'health' },
  { id: 'q18', title: 'นอนตรงเวลา', description: 'เข้านอนตามเวลาที่ตกลงกันไว้', icon: '😴', defaultRewardMinutes: 10, defaultXpReward: 8, isMandatory: true, category: 'health' },

  // Optional (16 items)
  { id: 'q02', title: 'ออกกำลังกาย 20 นาที', description: 'วิ่ง กระโดด หรือเล่นกีฬา 20 นาที', icon: '🏃', defaultRewardMinutes: 15, defaultXpReward: 10, isMandatory: false, category: 'exercise' },
  { id: 'q04', title: 'อ่านหนังสือ 15 นาที', description: 'อ่านหนังสือที่ชอบอย่างน้อย 15 นาที', icon: '📖', defaultRewardMinutes: 20, defaultXpReward: 15, isMandatory: false, category: 'reading' },
  { id: 'q05', title: 'ช่วยล้างจาน', description: 'ช่วยล้างจานหลังมื้ออาหาร', icon: '🍽️', defaultRewardMinutes: 10, defaultXpReward: 8, isMandatory: false, category: 'chores' },
  { id: 'q06', title: 'กวาดบ้าน', description: 'กวาดพื้นบ้านหรือห้องของตัวเอง', icon: '🧹', defaultRewardMinutes: 10, defaultXpReward: 8, isMandatory: false, category: 'chores' },
  { id: 'q07', title: 'วาดรูปหรือระบายสี', description: 'วาดรูปหรือระบายสีอย่างน้อย 15 นาที', icon: '🎨', defaultRewardMinutes: 15, defaultXpReward: 10, isMandatory: false, category: 'creativity' },
  { id: 'q11', title: 'เล่นดนตรี 15 นาที', description: 'ฝึกเล่นดนตรีหรือร้องเพลงอย่างน้อย 15 นาที', icon: '🎵', defaultRewardMinutes: 15, defaultXpReward: 10, isMandatory: false, category: 'creativity' },
  { id: 'q12', title: 'รดน้ำต้นไม้', description: 'รดน้ำต้นไม้ในบ้านหรือสวน', icon: '🌱', defaultRewardMinutes: 5, defaultXpReward: 5, isMandatory: false, category: 'chores' },
  { id: 'q13', title: 'โทรหาปู่ย่าตายาย', description: 'โทรวิดีโอคอลหาปู่ย่าตายายหรือญาติ', icon: '📞', defaultRewardMinutes: 10, defaultXpReward: 8, isMandatory: false, category: 'social' },
  { id: 'q14', title: 'เล่นกับน้อง/พี่', description: 'เล่นด้วยกันอย่างน้อย 20 นาทีโดยไม่ทะเลาะ', icon: '👫', defaultRewardMinutes: 15, defaultXpReward: 10, isMandatory: false, category: 'social' },
  { id: 'q15', title: 'ว่ายน้ำหรือออกกำลังกายในน้ำ', description: 'ว่ายน้ำหรือเล่นน้ำออกกำลังกาย 30 นาที', icon: '🏊', defaultRewardMinutes: 25, defaultXpReward: 18, isMandatory: false, category: 'exercise' },
  { id: 'q16', title: 'นั่งสมาธิ 5 นาที', description: 'นั่งสมาธิหรือหายใจลึกๆ อย่างน้อย 5 นาที', icon: '🧘', defaultRewardMinutes: 10, defaultXpReward: 8, isMandatory: false, category: 'health' },
  { id: 'q17', title: 'ทำอาหารง่ายๆ กับพ่อแม่', description: 'ช่วยพ่อแม่ทำอาหารอย่างน้อย 1 เมนู', icon: '🍳', defaultRewardMinutes: 20, defaultXpReward: 15, isMandatory: false, category: 'chores' },
  { id: 'q19', title: 'เล่าเรื่องหนังสือให้ฟัง', description: 'เล่าเรื่องราวจากหนังสือที่อ่านให้พ่อแม่ฟัง', icon: '📝', defaultRewardMinutes: 10, defaultXpReward: 12, isMandatory: false, category: 'reading' },
  { id: 'q20', title: 'ดูแลสัตว์เลี้ยง', description: 'ให้อาหาร ทำความสะอาด หรือเล่นกับสัตว์เลี้ยง', icon: '🐾', defaultRewardMinutes: 10, defaultXpReward: 8, isMandatory: false, category: 'chores' },
  { id: 'q21', title: 'เต้นหรือออกกำลังกายตามคลิป', description: 'เต้นหรือออกกำลังกายตามคลิปออนไลน์ 20 นาที', icon: '💃', defaultRewardMinutes: 20, defaultXpReward: 12, isMandatory: false, category: 'exercise' },
  { id: 'q22', title: 'เขียนไดอารี่', description: 'เขียนบันทึกประจำวันอย่างน้อย 3 ประโยค', icon: '✏️', defaultRewardMinutes: 10, defaultXpReward: 10, isMandatory: false, category: 'reading' },
];

export const MANDATORY_IDS = QUEST_LIBRARY.filter((q) => q.isMandatory).map((q) => q.id);
export const OPTIONAL_LIBRARY = QUEST_LIBRARY.filter((q) => !q.isMandatory);

export const CATEGORY_COLORS: Record<string, { bg: string; icon: string }> = {
  education:  { bg: '#EEF5FC', icon: '#185FA5' },
  exercise:   { bg: '#D4F0E8', icon: '#1D9E75' },
  chores:     { bg: '#FFF8F0', icon: '#FF8C42' },
  reading:    { bg: '#F5F3FF', icon: '#534AB7' },
  social:     { bg: '#FFF0E6', icon: '#D85A30' },
  health:     { bg: '#EAF3DE', icon: '#3B6D11' },
  creativity: { bg: '#FCEBEB', icon: '#E24B4A' },
};
