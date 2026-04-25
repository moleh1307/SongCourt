import { Alert, StyleSheet, Text, View } from 'react-native';
import { Cable, Crown, Flame, ShieldAlert, Users } from 'lucide-react-native';
import { CourtCard } from '../../src/components/common/CourtCard';
import { NeonButton } from '../../src/components/common/NeonButton';
import { Screen } from '../../src/components/common/Screen';
import { SectionHeader } from '../../src/components/common/SectionHeader';
import { colors } from '../../src/constants/colors';

const coDefendants = [
  {
    name: 'Ada',
    score: 91,
    verdict: 'Road Trip Cleared',
    note: 'Same late-night synth evidence. Low skip risk.',
    color: colors.neonGreen,
    Icon: Crown,
  },
  {
    name: 'Mert',
    score: 64,
    verdict: 'Passenger Seat Probation',
    note: 'Gym arc overlap is strong, but sad songs arrive too early.',
    color: colors.warningYellow,
    Icon: ShieldAlert,
  },
  {
    name: 'Lina',
    score: 28,
    verdict: 'Aux Conflict Filed',
    note: 'One of you starts with techno, the other starts with heartbreak.',
    color: colors.dangerRed,
    Icon: Flame,
  },
];

export default function FriendsTab() {
  return (
    <Screen>
      <SectionHeader eyebrow="AUX COMPATIBILITY COURT" title="Can your taste survive a car ride?" />
      <CourtCard accent={colors.electricPurple}>
        <View style={styles.visual}>
          <Users color={colors.hotPink} size={56} />
          <Cable color={colors.neonGreen} size={42} />
        </View>
        <Text style={styles.empty}>Co-defendants are waiting.</Text>
        <Text style={styles.muted}>Demo compatibility compares verdict patterns, replay behavior, and genre chaos.</Text>
        <NeonButton
          onPress={() => Alert.alert('Invite copied soon.', 'Friend invites are staged for the next backend pass. Demo compatibility is available below.')}
          variant="purple"
        >
          Invite a Friend
        </NeonButton>
      </CourtCard>
      {coDefendants.map(({ name, score, verdict, note, color, Icon }) => (
        <CourtCard key={name} accent={color}>
          <View style={styles.row}>
            <View style={styles.badge}>
              <Icon color={color} size={24} />
            </View>
            <View style={styles.friendBody}>
              <Text style={styles.friendName}>{name}</Text>
              <Text style={styles.title}>{verdict}</Text>
              <Text style={styles.muted}>{note}</Text>
            </View>
            <View style={styles.scoreWrap}>
              <Text style={[styles.score, { color }]}>{score}</Text>
              <Text style={styles.scoreLabel}>match</Text>
            </View>
          </View>
        </CourtCard>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  visual: { alignItems: 'center', gap: 10, marginVertical: 18 },
  empty: { color: colors.text, fontSize: 24, fontWeight: '900' },
  muted: { color: colors.muted, fontSize: 15, fontWeight: '700', marginVertical: 8 },
  row: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  badge: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.deepCard,
    borderWidth: 1,
    borderColor: colors.border,
  },
  friendBody: { flex: 1 },
  friendName: { color: colors.warningYellow, fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
  scoreWrap: { alignItems: 'center', minWidth: 62 },
  score: { fontSize: 36, fontWeight: '900' },
  scoreLabel: { color: colors.muted, fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
  title: { color: colors.text, fontSize: 18, fontWeight: '900', textTransform: 'uppercase' },
});
