/// <reference lib="dom" />
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Platform,
} from 'react-native';

const theme = {
  bg: '#f1f5f9',
  surface: '#ffffff',
  surfaceMuted: '#f8fafc',
  border: '#e2e8f0',
  borderStrong: '#cbd5e1',
  text: '#0f172a',
  textSecondary: '#64748b',
  textMuted: '#94a3b8',
  primary: '#1d4ed8',
  primaryHover: '#1e40af',
  primarySoft: '#eff6ff',
  success: '#059669',
  successSoft: '#ecfdf5',
  radius: {sm: 8, md: 12, lg: 16, xl: 20},
};

const webPointer = Platform.OS === 'web' ? ({cursor: 'pointer'} as any) : {};

/** Webpack dev (:3000) proxies /api → backend; otherwise call API on port 5000. */
function getApiBase(): string {
  if (typeof window === 'undefined') {
    return 'http://localhost:5000';
  }
  if (window.location.port === '3000') {
    return '';
  }
  const {protocol, hostname} = window.location;
  return `${protocol}//${hostname}:5000`;
}

async function readApiError(response: Response): Promise<string> {
  try {
    const body = await response.json();
    if (typeof body.error === 'string') {
      return body.error;
    }
    if (body.error && typeof body.error.message === 'string') {
      return body.error.message;
    }
    if (typeof body.message === 'string') {
      return body.message;
    }
  } catch {
    // ignore
  }
  return response.statusText || `HTTP ${response.status}`;
}

const STEPS_HOME = [
  'Paste your order confirmation email',
  'AI extracts order details automatically',
  'Agent opens the retailer return flow',
  'Forms are filled and your label is generated',
];

const STEPS_EMAIL = [
  'We extract your order details',
  'We locate the return portal',
  'We complete forms and generate your label',
  'We schedule courier pickup when available',
];

const StepRow = ({
  index,
  text,
  isLast,
}: {
  index: number;
  text: string;
  isLast: boolean;
}) => (
  <View style={styles.stepRow}>
    <View style={styles.stepTrack}>
      <View style={styles.stepBadge}>
        <Text style={styles.stepBadgeText}>{index + 1}</Text>
      </View>
      {!isLast && <View style={styles.stepLine} />}
    </View>
    <Text style={styles.stepText}>{text}</Text>
  </View>
);

const App = () => {
  const [screen, setScreen] = useState('home');
  const [emailContent, setEmailContent] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleStartReturn = () => {
    setScreen('email');
  };

  const handleSubmitEmail = async () => {
    if (!emailContent.trim()) {
      alert('Please paste your order confirmation email');
      return;
    }

    setProcessing(true);

    const base = getApiBase();

    try {
      const parseResponse = await fetch(`${base}/api/email/parse`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({emailContent}),
      });

      if (!parseResponse.ok) {
        const detail = await readApiError(parseResponse);
        throw new Error(detail);
      }

      const {data: orderDetails} = await parseResponse.json();

      const returnResponse = await fetch(`${base}/api/returns`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          orderDetails,
          instruction: 'return this',
        }),
      });

      if (!returnResponse.ok) {
        const detail = await readApiError(returnResponse);
        throw new Error(detail);
      }

      const {data: returnData} = await returnResponse.json();
      setScreen('processing');

      pollReturnStatus(returnData._id);
    } catch (error: unknown) {
      console.error('Error:', error);
      const message =
        error instanceof Error ? error.message : String(error);
      const network =
        message === 'Failed to fetch' ||
        message.includes('NetworkError') ||
        message.includes('Load failed');
      alert(
        network
          ? 'Cannot reach the API. In a separate terminal run: cd backend && npm start\n\nThen reload this page (keep the web app on port 3000).'
          : message,
      );
      setProcessing(false);
    }
  };

  const pollReturnStatus = async (id: string) => {
    const base = getApiBase();
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${base}/api/returns/${id}`);
        const {data} = await response.json();

        if (data.status === 'completed' || data.status === 'failed') {
          clearInterval(interval);
          setProcessing(false);
          setScreen('result');
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 3000);
  };

  if (screen === 'home') {
    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <View style={styles.brandMark}>
              <Text style={styles.brandMarkText}>↩</Text>
            </View>
            <Text style={styles.heroKicker}>Returns automation</Text>
            <Text style={styles.title}>ReturnsRunner</Text>
            <Text style={styles.heroSubtitle}>
              Turn order emails into completed returns—fast, consistent, and
              hands-off.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardHeading}>How it works</Text>
            {STEPS_HOME.map((step, i) => (
              <StepRow
                key={step}
                index={i}
                text={step}
                isLast={i === STEPS_HOME.length - 1}
              />
            ))}
          </View>

          <TouchableOpacity
            style={[styles.buttonPrimary, webPointer]}
            onPress={handleStartReturn}
            activeOpacity={0.85}>
            <Text style={styles.buttonPrimaryLabel}>Start a return</Text>
            <Text style={styles.buttonPrimaryHint}>Takes about five minutes</Text>
          </TouchableOpacity>

          <View style={styles.trustStrip}>
            <Text style={styles.trustStripText}>
              Encrypted in transit · No password to your retailer account
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (screen === 'email') {
    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <TouchableOpacity
            onPress={() => setScreen('home')}
            style={[styles.backLink, webPointer]}
            activeOpacity={0.7}>
            <Text style={styles.backLinkText}>← Back to home</Text>
          </TouchableOpacity>

          <Text style={styles.screenTitle}>Paste your order email</Text>
          <Text style={styles.screenSubtitle}>
            Copy the full body of your order confirmation and paste it below. We
            only use it to file your return.
          </Text>

          <Text style={styles.fieldLabel}>Email content</Text>
          <TextInput
            style={styles.emailInput}
            multiline
            numberOfLines={15}
            placeholder={
              'Order Confirmation #12345\nThank you for your order…\n\nItems, totals, and shipping details appear here.'
            }
            placeholderTextColor={theme.textMuted}
            value={emailContent}
            onChangeText={setEmailContent}
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={[
              styles.buttonPrimary,
              processing && styles.buttonDisabled,
              webPointer,
            ]}
            onPress={handleSubmitEmail}
            disabled={processing}
            activeOpacity={0.85}>
            {processing ? (
              <View style={styles.buttonLoading}>
                <ActivityIndicator color="#fff" />
                <Text style={styles.buttonPrimaryLabel}>Processing…</Text>
              </View>
            ) : (
              <Text style={styles.buttonPrimaryLabel}>Start return process</Text>
            )}
          </TouchableOpacity>

          <View style={styles.cardMuted}>
            <Text style={styles.cardHeadingSmall}>What happens next</Text>
            {STEPS_EMAIL.map((step, i) => (
              <StepRow
                key={step}
                index={i}
                text={step}
                isLast={i === STEPS_EMAIL.length - 1}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  if (screen === 'processing') {
    return (
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <View style={styles.processingIconWrap}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
          <Text style={styles.screenTitle}>Working on your return</Text>
          <Text style={styles.screenSubtitle}>
            Our agent is on the retailer site. This screen updates when the run
            finishes—you can keep this tab open.
          </Text>
          <View style={styles.progressCard}>
            <Text style={styles.progressLabel}>Typical stages</Text>
            <Text style={styles.progressLine}>✓ Email parsed</Text>
            <Text style={[styles.progressLine, styles.progressLineDim]}>
              ○ Opening return portal…
            </Text>
            <Text style={[styles.progressLine, styles.progressLineDim]}>
              ○ Completing forms…
            </Text>
            <Text style={[styles.progressLine, styles.progressLineDim]}>
              ○ Generating shipping label…
            </Text>
          </View>
        </View>
      </View>
    );
  }

  if (screen === 'result') {
    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.successMark}>
            <Text style={styles.successMarkText}>✓</Text>
          </View>
          <Text style={styles.screenTitle}>Return submitted</Text>
          <Text style={styles.screenSubtitle}>
            Your return flow completed. Check your inbox for the label and any
            follow-up from the store.
          </Text>

          <View style={styles.card}>
            <Text style={styles.cardHeading}>Next steps</Text>
            <Text style={styles.cardBody}>
              {`1. Open the shipping label from your email\n2. Pack the item securely and attach the label\n3. Hand off to the courier or drop off as instructed\n4. Refund timing follows the retailer’s policy`}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.buttonPrimary, webPointer]}
            onPress={() => {
              setScreen('home');
              setEmailContent('');
            }}
            activeOpacity={0.85}>
            <Text style={styles.buttonPrimaryLabel}>Start another return</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'web' ? 40 : 24,
    paddingBottom: 56,
    maxWidth: 560,
    width: '100%',
    alignSelf: 'center',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  hero: {
    alignItems: 'center',
    marginBottom: 28,
  },
  brandMark: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: theme.primarySoft,
    borderWidth: 1,
    borderColor: theme.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  brandMarkText: {
    fontSize: 26,
    color: theme.primary,
  },
  heroKicker: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.primary,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: theme.text,
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 17,
    color: theme.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
    maxWidth: 420,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: theme.text,
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  screenSubtitle: {
    fontSize: 16,
    color: theme.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 28,
  },
  card: {
    backgroundColor: theme.surface,
    borderRadius: theme.radius.lg,
    padding: 22,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: theme.border,
    ...Platform.select({
      web: {
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.06), 0 8px 24px rgba(15, 23, 42, 0.04)',
      },
      default: {
        shadowColor: '#0f172a',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 2,
      },
    }),
  },
  cardMuted: {
    backgroundColor: theme.surfaceMuted,
    borderRadius: theme.radius.lg,
    padding: 20,
    marginTop: 8,
    borderWidth: 1,
    borderColor: theme.border,
  },
  cardHeading: {
    fontSize: 17,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 16,
  },
  cardHeadingSmall: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 14,
  },
  cardBody: {
    fontSize: 15,
    color: theme.textSecondary,
    lineHeight: 24,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 0,
  },
  stepTrack: {
    alignItems: 'center',
    marginRight: 14,
    width: 28,
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadgeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  stepLine: {
    width: 2,
    flex: 1,
    minHeight: 16,
    backgroundColor: theme.borderStrong,
    marginVertical: 4,
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    color: theme.textSecondary,
    lineHeight: 22,
    paddingBottom: 18,
    paddingTop: 2,
  },
  backLink: {
    alignSelf: 'flex-start',
    marginBottom: 24,
    paddingVertical: 4,
  },
  backLinkText: {
    fontSize: 15,
    color: theme.primary,
    fontWeight: '600',
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  emailInput: {
    backgroundColor: theme.surface,
    borderRadius: theme.radius.md,
    padding: 16,
    fontSize: 14,
    color: theme.text,
    borderWidth: 1,
    borderColor: theme.border,
    minHeight: 280,
    marginBottom: 20,
    fontFamily:
      Platform.OS === 'web'
        ? 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
        : 'monospace',
    lineHeight: 22,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  buttonPrimary: {
    backgroundColor: theme.primary,
    borderRadius: theme.radius.lg,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 20,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(29, 78, 216, 0.35)',
      },
      default: {
        shadowColor: theme.primary,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
      },
    }),
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  buttonPrimaryLabel: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  buttonPrimaryHint: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    marginTop: 4,
    fontWeight: '500',
  },
  buttonLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  trustStrip: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: theme.radius.md,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.border,
  },
  trustStripText: {
    fontSize: 13,
    color: theme.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  processingIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 20px rgba(15, 23, 42, 0.08)',
      },
      default: {},
    }),
  },
  progressCard: {
    backgroundColor: theme.surface,
    borderRadius: theme.radius.lg,
    padding: 22,
    marginTop: 8,
    width: '100%',
    borderWidth: 1,
    borderColor: theme.border,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 14,
  },
  progressLine: {
    fontSize: 15,
    color: theme.text,
    lineHeight: 28,
  },
  progressLineDim: {
    color: theme.textMuted,
  },
  successMark: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.successSoft,
    borderWidth: 1,
    borderColor: '#a7f3d0',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  successMarkText: {
    fontSize: 32,
    color: theme.success,
    fontWeight: '700',
  },
});

export default App;
