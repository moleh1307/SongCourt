import { colors } from '../constants/colors';
import type { Rarity } from '../types/verdict';

export const rarityConfig: Record<Rarity, { color: string; subtitle: string }> = {
  Common: { color: '#F8F7FF', subtitle: 'Standard courtroom concern' },
  Uncommon: { color: colors.neonGreen, subtitle: 'Aux behavior noted' },
  Rare: { color: '#60A5FA', subtitle: 'Evidence board material' },
  Epic: { color: colors.hotPink, subtitle: '3 AM main character build' },
  Legendary: { color: colors.warningYellow, subtitle: 'Aux villain arc' },
  Cursed: { color: colors.dangerRed, subtitle: 'Replay button abuser' },
  Divine: { color: '#FFFFFF', subtitle: 'Courtroom miracle' },
  Illegal: { color: colors.dangerRed, subtitle: 'Neon felony territory' },
};
