import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandMark } from '../components/BrandMark';
import { colors, fonts, spacing } from '../design/tokens';
import { SongCourtUser } from '../types/songcourt';

type TrialHomeScreenProps = {
  authMessage?: string;
  canRunSpotifyTrial: boolean;
  isConnecting: boolean;
  onConnectSpotify: () => void;
  onRunDemoTrial: () => void;
  onRunSpotifyTrial: () => void;
  user?: SongCourtUser | null;
};

export function TrialHomeScreen({
  authMessage,
  canRunSpotifyTrial,
  isConnecting,
  onConnectSpotify,
  onRunDemoTrial,
  onRunSpotifyTrial,
  user,
}: TrialHomeScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <BrandMark size="small" />
          <View style={styles.livePill}>
            <Text style={styles.livePillText}>Case ready</Text>
          </View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.kicker}>Daily trial</Text>
          <Text style={styles.title}>A verdict your friends will actually open.</Text>
          <Text style={styles.copy}>
            SongCourt turns your listening snapshot into one clean result, one punchline, and one share card.
          </Text>
        </View>

        <View style={styles.connectPanel}>
          <View style={styles.panelHeader}>
            <View>
              <Text style={styles.panelTitle}>Spotify Case File</Text>
              <Text style={styles.panelSubtitle}>
                {user ? `Connected as ${user.displayName}` : 'Connect for a real verdict, or run the demo case.'}
              </Text>
            </View>
            <View style={[styles.statusDot, user && styles.statusDotConnected]} />
          </View>

          {authMessage ? <Text style={styles.authMessage}>{authMessage}</Text> : null}

          <View style={styles.signalList}>
            <SignalRow label="Spotify snapshot" value={user ? 'Connected' : 'Not connected'} />
            <SignalRow label="Trial mode" value={canRunSpotifyTrial ? 'Real data' : 'Demo ready'} />
            <SignalRow label="Share card" value="Story export" />
          </View>

          <View style={styles.buttonStack}>
            {canRunSpotifyTrial ? (
              <Pressable accessibilityRole="button" onPress={onRunSpotifyTrial} style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Run Spotify Trial</Text>
              </Pressable>
            ) : (
              <Pressable
                accessibilityRole="button"
                disabled={isConnecting}
                onPress={onConnectSpotify}
                style={[styles.primaryButton, isConnecting && styles.buttonDisabled]}
              >
                <Text style={styles.primaryButtonText}>
                  {isConnecting ? 'Waiting for Spotify' : 'Connect Spotify'}
                </Text>
              </Pressable>
            )}

            <Pressable accessibilityRole="button" onPress={onRunDemoTrial} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Try Demo Case</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.todayPanel}>
          <View style={styles.dial}>
            <Text style={styles.dialValue}>01</Text>
          </View>
          <View style={styles.todayCopy}>
            <Text style={styles.todayLabel}>Today</Text>
            <Text style={styles.todayTitle}>One scan. One verdict.</Text>
            <Text style={styles.todayText}>
              Start with the case, then make the card worth sending.
            </Text>
          </View>
        </View>

        <View style={styles.statRow}>
          <MiniStat label="Replay" value="Crime" />
          <MiniStat label="Mood" value="Swing" />
          <MiniStat label="Night" value="Court" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SignalRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.signalRow}>
      <Text style={styles.signalLabel}>{label}</Text>
      <Text style={styles.signalValue}>{value}</Text>
    </View>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.miniStat}>
      <Text style={styles.miniStatLabel}>{label}</Text>
      <Text style={styles.miniStatValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.warmIvory,
    flex: 1,
  },
  content: {
    paddingBottom: 44,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
  },
  livePill: {
    backgroundColor: colors.ink,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  livePillText: {
    color: colors.warmIvory,
    fontFamily: fonts.body,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0,
  },
  hero: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  kicker: {
    color: colors.courtRed,
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0,
    marginBottom: spacing.sm,
  },
  title: {
    color: colors.ink,
    fontFamily: fonts.display,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 33,
    maxWidth: 330,
  },
  copy: {
    color: colors.mutedInk,
    fontFamily: fonts.body,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    marginTop: 10,
    maxWidth: 330,
  },
  connectPanel: {
    backgroundColor: colors.receiptWhite,
    borderColor: colors.hairline,
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    padding: 18,
  },
  panelHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  panelTitle: {
    color: colors.ink,
    fontFamily: fonts.body,
    fontSize: 19,
    fontWeight: '800',
  },
  panelSubtitle: {
    color: colors.mutedInk,
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 17,
    marginTop: 5,
    maxWidth: 260,
  },
  statusDot: {
    backgroundColor: colors.paperTan,
    borderRadius: 6,
    height: 12,
    marginTop: 6,
    width: 12,
  },
  statusDotConnected: {
    backgroundColor: '#38C768',
  },
  authMessage: {
    color: colors.courtRed,
    fontFamily: fonts.body,
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 17,
    marginTop: spacing.sm,
  },
  signalList: {
    borderColor: '#E0D5C3',
    borderTopWidth: 1,
    gap: 10,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
  },
  signalRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signalLabel: {
    color: colors.mutedInk,
    fontFamily: fonts.body,
    fontSize: 11,
    fontWeight: '600',
  },
  signalValue: {
    color: colors.ink,
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: '800',
  },
  buttonStack: {
    gap: 10,
    marginTop: spacing.sm,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.courtRed,
    borderRadius: 8,
    paddingVertical: 15,
  },
  buttonDisabled: {
    opacity: 0.64,
  },
  primaryButtonText: {
    color: colors.receiptWhite,
    fontFamily: fonts.body,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0,
  },
  secondaryButton: {
    alignItems: 'center',
    borderColor: colors.ink,
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 13,
  },
  secondaryButtonText: {
    color: colors.ink,
    fontFamily: fonts.body,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0,
  },
  todayPanel: {
    alignItems: 'center',
    backgroundColor: colors.ink,
    borderRadius: 8,
    flexDirection: 'row',
    gap: spacing.sm,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    padding: 18,
  },
  dial: {
    alignItems: 'center',
    borderColor: colors.courtRed,
    borderRadius: 38,
    borderWidth: 2,
    height: 76,
    justifyContent: 'center',
    width: 76,
  },
  dialValue: {
    color: colors.warmIvory,
    fontFamily: fonts.mono,
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 32,
  },
  todayCopy: {
    flex: 1,
  },
  todayLabel: {
    color: colors.paperTan,
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: '700',
  },
  todayTitle: {
    color: colors.warmIvory,
    fontFamily: fonts.body,
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 23,
    marginTop: 2,
  },
  todayText: {
    color: colors.paperTan,
    fontFamily: fonts.body,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    marginTop: 5,
  },
  statRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  miniStat: {
    backgroundColor: colors.receiptWhite,
    borderColor: colors.hairline,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    minHeight: 76,
    padding: 12,
  },
  miniStatLabel: {
    color: colors.mutedInk,
    fontFamily: fonts.body,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0,
  },
  miniStatValue: {
    color: colors.ink,
    fontFamily: fonts.body,
    fontSize: 17,
    fontWeight: '800',
    marginTop: 6,
  },
});
