import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, borderRadius, typography } from '../../constants/theme';
import { AnalyzeStackParamList, Analysis } from '../../types';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { SignalBadge } from '../../components/SignalBadge';

interface Props {
  navigation: NativeStackNavigationProp<AnalyzeStackParamList, 'AnalysisHistory'>;
}

export function AnalysisHistoryScreen({ navigation }: Props): React.ReactElement {
  const { appUser } = useAuth();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const loadAnalyses = useCallback(async (): Promise<void> => {
    if (!appUser) return;

    try {
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('user_id', appUser.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setAnalyses(data as Analysis[]);
      }
    } catch (err) {
      console.error('[AnalysisHistoryScreen] load error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [appUser]);

  useEffect(() => {
    loadAnalyses();
  }, [loadAnalyses]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadAnalyses();
  };

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  const renderItem = ({ item }: { item: Analysis }) => {
    const isExpanded = expanded === item.id;
    const date = new Date(item.created_at).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => toggleExpanded(item.id)}
        activeOpacity={0.8}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardMeta}>
            <SignalBadge state={item.signal_state} size="sm" />
            <Text style={styles.date}>{date}</Text>
          </View>
          <Text style={styles.expandChevron}>{isExpanded ? '↑' : '↓'}</Text>
        </View>

        <Text style={styles.inputPreview} numberOfLines={isExpanded ? undefined : 2}>
          {item.input_text}
        </Text>

        {isExpanded && item.ai_response && (
          <View style={styles.expandedContent}>
            <View style={styles.divider} />

            <ResponseRow label="What I See" content={item.ai_response.what_i_see} color={colors.textSecondary} />
            <ResponseRow label="What It Means" content={item.ai_response.what_it_means} color={colors.neutral} />
            <ResponseRow label="Your Move" content={item.ai_response.your_move} color={colors.primary} />
            <ResponseRow label="Watch For" content={item.ai_response.watch_for} color={colors.ambiguous} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analysis History</Text>
        <Text style={styles.headerSubtitle}>
          {analyses.length} {analyses.length === 1 ? 'analysis' : 'analyses'}
        </Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={analyses}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>No analyses yet.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

function ResponseRow({
  label,
  content,
  color,
}: {
  label: string;
  content: string;
  color: string;
}) {
  return (
    <View style={rowStyles.block}>
      <Text style={[rowStyles.label, { color }]}>{label}</Text>
      <Text style={rowStyles.content}>{content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.xs,
  },
  backText: {
    fontSize: typography.base,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  headerTitle: {
    fontSize: typography.xxl,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: typography.sm,
    color: colors.textMuted,
  },
  list: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  date: {
    fontSize: typography.xs,
    color: colors.textMuted,
  },
  expandChevron: {
    fontSize: typography.sm,
    color: colors.textMuted,
  },
  inputPreview: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    lineHeight: typography.sm * 1.5,
  },
  expandedContent: {
    gap: spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  emptyText: {
    fontSize: typography.base,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
});

const rowStyles = StyleSheet.create({
  block: {
    gap: spacing.xs,
  },
  label: {
    fontSize: typography.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  content: {
    fontSize: typography.sm,
    color: colors.textPrimary,
    lineHeight: typography.sm * 1.6,
  },
});
