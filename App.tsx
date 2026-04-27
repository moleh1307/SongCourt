import { useEffect, useState } from 'react';
import { Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import {
  createDemoShareCardPayload,
  createShareCardPayloadFromSnapshot,
} from './src/domain/sharePayloadFactory';
import { TrialHomeScreen } from './src/screens/TrialHomeScreen';
import { TrialLoadingScreen } from './src/screens/TrialLoadingScreen';
import { VerdictShareFlowScreen } from './src/screens/VerdictShareFlowScreen';
import {
  createAuthState,
  createSessionFromTicket,
  fetchMusicSnapshot,
  openSpotifyLogin,
} from './src/services/songcourtApi';
import { type ShareCardPayload } from './src/components/share-cards/types';
import { type SongCourtUser } from './src/types/songcourt';

type AppScreen = 'trial' | 'loading' | 'verdict';
type TrialSource = 'demo' | 'spotify';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<AppScreen>('trial');
  const [authMessage, setAuthMessage] = useState<string | undefined>();
  const [isConnecting, setIsConnecting] = useState(false);
  const [pendingAuthState, setPendingAuthState] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [trialSource, setTrialSource] = useState<TrialSource>('demo');
  const [user, setUser] = useState<SongCourtUser | null>(null);
  const [verdictPayload, setVerdictPayload] = useState<ShareCardPayload>(() => createDemoShareCardPayload());

  useEffect(() => {
    const subscription = Linking.addEventListener('url', (event) => {
      void handleSpotifyCallback(event.url);
    });

    Linking.getInitialURL()
      .then((url) => {
        if (url) {
          void handleSpotifyCallback(url);
        }
      })
      .catch(() => undefined);

    return () => subscription.remove();
  }, [pendingAuthState]);

  async function handleSpotifyCallback(url: string) {
    try {
      if (!url.includes('auth/spotify/callback')) {
        return;
      }

      const callbackUrl = new URL(url);
      const ticket = callbackUrl.searchParams.get('ticket');
      const returnedState = callbackUrl.searchParams.get('state');

      if (!ticket) {
        throw new Error('Spotify returned without a login ticket.');
      }

      if (pendingAuthState && returnedState !== pendingAuthState) {
        throw new Error('Spotify login state did not match this app session.');
      }

      setAuthMessage('Finishing Spotify connection...');
      const session = await createSessionFromTicket(ticket);
      setSessionToken(session.token);
      setUser(session.user);
      setPendingAuthState(null);
      setIsConnecting(false);
      setAuthMessage('Spotify connected. Your real trial is ready.');
      setActiveScreen('trial');
    } catch (error) {
      setIsConnecting(false);
      setAuthMessage(error instanceof Error ? error.message : 'Spotify connection failed.');
    }
  }

  async function connectSpotify() {
    try {
      const state = createAuthState();
      setPendingAuthState(state);
      setIsConnecting(true);
      setAuthMessage('Opening Spotify login...');
      await openSpotifyLogin(state);
      setTimeout(() => {
        setIsConnecting((current) => {
          if (!current) return current;
          setAuthMessage('Spotify is still open. Return here after login, or run the demo case.');
          return false;
        });
      }, 12000);
    } catch (error) {
      setIsConnecting(false);
      setAuthMessage(error instanceof Error ? error.message : 'Could not open Spotify login.');
    }
  }

  async function runTrial(source: TrialSource) {
    setIsConnecting(false);
    if (source === 'demo') {
      setPendingAuthState(null);
    }
    setTrialSource(source);
    setActiveScreen('loading');
    setAuthMessage(undefined);

    try {
      const startedAt = Date.now();
      const payload =
        source === 'spotify' && sessionToken
          ? createShareCardPayloadFromSnapshot(await fetchMusicSnapshot(sessionToken), user)
          : createDemoShareCardPayload();

      await wait(Math.max(0, 2400 - (Date.now() - startedAt)));
      setVerdictPayload(payload);
      setActiveScreen('verdict');
    } catch (error) {
      setActiveScreen('trial');
      setAuthMessage(error instanceof Error ? error.message : 'Trial generation failed.');
    }
  }

  if (activeScreen === 'loading') {
    return (
      <>
        <TrialLoadingScreen source={trialSource} />
        <StatusBar style="light" />
      </>
    );
  }

  if (activeScreen === 'verdict') {
    return (
      <>
        <VerdictShareFlowScreen
          onNewTrial={() => setActiveScreen('trial')}
          payload={verdictPayload}
          sourceLabel={trialSource === 'spotify' ? 'Spotify Trial' : 'Demo Trial'}
        />
        <StatusBar style="dark" />
      </>
    );
  }

  return (
    <>
      <TrialHomeScreen
        authMessage={authMessage}
        canRunSpotifyTrial={Boolean(sessionToken)}
        isConnecting={isConnecting}
        onConnectSpotify={connectSpotify}
        onRunDemoTrial={() => void runTrial('demo')}
        onRunSpotifyTrial={() => void runTrial('spotify')}
        user={user}
      />
      <StatusBar style="dark" />
    </>
  );
}

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
