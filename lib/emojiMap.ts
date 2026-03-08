// Comprehensive emoji palette for accurate color representation
export interface EmojiColor {
  emoji: string;
  r: number;
  g: number;
  b: number;
}

export const coloredEmojiPalette: EmojiColor[] = [
  // Skin tones and peachy colors
  { emoji: '👤', r: 200, g: 150, b: 120 },
  { emoji: '🧑', r: 210, g: 160, b: 130 },
  { emoji: '👨', r: 200, g: 145, b: 115 },
  { emoji: '🧔', r: 195, g: 140, b: 110 },
  { emoji: '👦', r: 220, g: 170, b: 140 },
  { emoji: '🍑', r: 255, g: 218, b: 185 },
  { emoji: '🍊', r: 255, g: 165, b: 0 },
  
  // Dark greens (dense vegetation)
  { emoji: '🌳', r: 34, g: 139, b: 34 },
  { emoji: '🌲', r: 28, g: 107, b: 28 },
  { emoji: '🌿', r: 60, g: 180, b: 60 },
  
  // Bright greens
  { emoji: '🍀', r: 50, g: 205, b: 50 },
  { emoji: '🟢', r: 0, g: 255, b: 0 },
  { emoji: '💚', r: 0, g: 200, b: 0 },
  { emoji: '🟩', r: 50, g: 205, b: 50 },
  { emoji: '🌾', r: 218, g: 165, b: 32 },
  
  // Mid-tone greens
  { emoji: '🦎', r: 100, g: 150, b: 80 },
  { emoji: '🐢', r: 100, g: 140, b: 80 },
  
  // Browns and earthy tones
  { emoji: '🟤', r: 139, g: 69, b: 19 },
  { emoji: '🪵', r: 160, g: 82, b: 45 },
  { emoji: '🏜️', r: 210, g: 180, b: 140 },
  { emoji: '🪨', r: 128, g: 128, b: 128 },
  { emoji: '🍂', r: 180, g: 100, b: 40 },
  { emoji: '🧆', r: 160, g: 100, b: 60 },
  
  // Reds and warm tones
  { emoji: '🔴', r: 255, g: 0, b: 0 },
  { emoji: '❤️', r: 220, g: 20, b: 60 },
  { emoji: '🟥', r: 255, g: 20, b: 20 },
  { emoji: '🏎️', r: 180, g: 20, b: 20 },
  { emoji: '🍅', r: 220, g: 20, b: 60 },
  { emoji: '🌹', r: 200, g: 0, b: 50 },
  
  // Blues and sky colors
  { emoji: '🔵', r: 0, g: 0, b: 255 },
  { emoji: '🟦', r: 65, g: 105, b: 225 },
  { emoji: '💙', r: 30, g: 144, b: 255 },
  { emoji: '🌊', r: 0, g: 119, b: 182 },
  { emoji: '☁️', r: 220, g: 220, b: 220 },
  { emoji: '🏞️', r: 70, g: 130, b: 180 },
  
  // Light blues and sky
  { emoji: '🟦', r: 100, g: 150, b: 220 },
  { emoji: '💎', r: 150, g: 200, b: 255 },
  
  // Blacks and very dark tones
  { emoji: '⬛', r: 10, g: 10, b: 10 },
  { emoji: '👕', r: 30, g: 30, b: 30 },
  { emoji: '🖤', r: 50, g: 50, b: 50 },
  { emoji: '⚫', r: 70, g: 70, b: 70 },
  { emoji: '🐈', r: 60, g: 40, b: 20 },
  
  // Grays and neutrals
  { emoji: '⚪', r: 200, g: 200, b: 200 },
  { emoji: '⬜', r: 240, g: 240, b: 240 },
  { emoji: '🤍', r: 255, g: 255, b: 255 },
  { emoji: '🩶', r: 150, g: 150, b: 150 },
  { emoji: '☁️', r: 200, g: 200, b: 200 },
  
  // Oranges and warm oranges
  { emoji: '🟧', r: 255, g: 165, b: 0 },
  { emoji: '🧡', r: 255, g: 140, b: 0 },
  { emoji: '🔶', r: 255, g: 140, b: 0 },
  { emoji: '🔥', r: 255, g: 100, b: 0 },
  { emoji: '🌅', r: 255, g: 120, b: 60 },
  
  // Yellows
  { emoji: '🟨', r: 255, g: 255, b: 0 },
  { emoji: '⭐', r: 255, g: 215, b: 0 },
  { emoji: '✨', r: 255, g: 240, b: 100 },
  { emoji: '🌟', r: 255, g: 220, b: 0 },
  
  // Purples and magentas
  { emoji: '🟪', r: 160, g: 32, b: 240 },
  { emoji: '💜', r: 128, g: 0, b: 128 },
  { emoji: '💕', r: 255, g: 105, b: 180 },
  { emoji: '🌸', r: 255, g: 150, b: 200 },
  
  // Additional variety for detail
  { emoji: '🏔️', r: 169, g: 169, b: 169 },
  { emoji: '🧗', r: 180, g: 100, b: 80 },
  { emoji: '👟', r: 100, g: 80, b: 60 },
];

export const emojiMap = {
  smileys: [
    '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂',
    '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩',
    '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪',
    '😌', '😔', '😑', '😐', '😶', '🤐', '🤨', '😐',
    '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪',
  ],
  hearts: [
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍',
    '🤎', '💔', '💕', '💞', '💓', '💗', '💖', '💘',
    '💝', '💟', '👋', '🤚', '🖐️', '✋', '🖖', '👌',
  ],
  animals: [
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
    '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🙈',
    '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🦆',
    '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝',
  ],
  colored: [
    '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '⬛', '⬜',
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍',
    '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '⚫', '⚪',
  ],
  mixed: [
    '⭐', '🌟', '✨', '⚡', '🔥', '💥', '🎉', '🎊',
    '🎈', '🎁', '🎀', '🎯', '🏆', '🥇', '🥈', '🥉',
    '🎮', '🎲', '🎰', '🎪', '🎭', '🎨', '🎬', '🎤',
    '🎧', '🎼', '🎹', '🎸', '🥁', '🎺', '🎷', '🌈',
  ],
};

export type EmojiCategory = keyof typeof emojiMap;

export const getCategoryEmojis = (category: EmojiCategory): string[] => {
  return emojiMap[category] || [];
};
