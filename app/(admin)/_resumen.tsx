import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { ChevronRight, Image as ImageIcon, Tag, TriangleAlert, Users } from 'lucide-react-native';

import { getAdminUsers } from '../../src/api/admin';
import { getCategories } from '../../src/api/categories';
import { getPosts } from '../../src/api/posts';
import { getReports, updateReport } from '../../src/api/reports';
import AdminBrandHeader from '../../src/components/admin/AdminBrandHeader';
import BarsChart from '../../src/components/admin/BarsChart';
import ModerationCard from '../../src/components/admin/ModerationCard';
import StatCard from '../../src/components/admin/StatCard';
import ConfirmModal from '../../src/components/ConfirmModal';
import type { Category, Post, Report, ReportReason, User } from '../../src/types';
import { REPORT_REASON_LABELS } from '../../src/types';

type ModGroup = {
  key: string;
  title: string;
  image?: string;
  count: number;
  reason: ReportReason;
  reportIds: string[];
};

const WEEKDAY_INDEX = (day: number) => (day + 6) % 7;

function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function isWithinLastWeek(dateStr?: string): boolean {
  if (!dateStr) return false;

  const date = new Date(dateStr);
  const from = startOfToday();
  from.setDate(from.getDate() - 6);

  return date >= from && date <= new Date();
}

function buildLoginCounts(users: User[]): number[] {
  const from = startOfToday();
  from.setDate(from.getDate() - 6);
  const end = new Date();

  const counts = Array(7).fill(0);

  for (const user of users) {
    if (!user.lastLogin) continue;

    const date = new Date(user.lastLogin);
    if (date < from || date > end) continue;

    counts[WEEKDAY_INDEX(date.getDay())] += 1;
  }

  return counts;
}

function buildModGroups(reports: Report[]): ModGroup[] {
  const grouped = new Map<string, Report[]>();

  for (const report of reports) {
    if (report.targetType !== 'POST' || report.status !== 'PENDING' || report.target.deleted) {
      continue;
    }

    const reportsOfTarget = grouped.get(report.targetId) ?? [];
    reportsOfTarget.push(report);
    grouped.set(report.targetId, reportsOfTarget);
  }

  const groups: ModGroup[] = [];

  for (const reportsOfTarget of grouped.values()) {
    const frequencies: Partial<Record<ReportReason, number>> = {};

    for (const report of reportsOfTarget) {
      frequencies[report.reason] = (frequencies[report.reason] ?? 0) + 1;
    }

    const reason = Object.entries(frequencies).sort((a, b) => b[1] - a[1])[0][0] as ReportReason;

    groups.push({
      key: reportsOfTarget[0].targetId,
      title: reportsOfTarget[0].target.title ?? 'Publicación',
      image: reportsOfTarget[0].target.image,
      count: reportsOfTarget.length,
      reason,
      reportIds: reportsOfTarget.map((report) => report.id),
    });
  }

  return groups.sort((a, b) => b.count - a.count).slice(0, 2);
}

export default function ResumenScreen() {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pendingReports, setPendingReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<ModGroup | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    Promise.all([getAdminUsers(), getPosts(), getCategories(), getReports('PENDING')])
      .then(([loadedUsers, loadedPosts, loadedCategories, loadedReports]) => {
        setUsers(loadedUsers);
        setPosts(loadedPosts);
        setCategories(loadedCategories);
        setPendingReports(loadedReports);
        setError(null);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'No se pudieron cargar los datos')
      )
      .finally(() => setLoading(false));
  }, []);

  const usersThisWeek = users.filter((user) => isWithinLastWeek(user.createdAt)).length;
  const postsThisWeek = posts.filter((post) => isWithinLastWeek(post.createdAt)).length;

  const loginCounts = buildLoginCounts(users);
  const todayIndex = WEEKDAY_INDEX(new Date().getDay());
  const modGroups = buildModGroups(pendingReports);

  const removeReports = (ids: string[]) => {
    setPendingReports((current) => current.filter((report) => !ids.includes(report.id)));
  };

  const onApprove = async (group: ModGroup) => {
    if (busyKey !== null) return;

    setBusyKey(group.key);
    setError(null);

    try {
      await Promise.all(group.reportIds.map((id) => updateReport(id, 'DISMISSED')));
      removeReports(group.reportIds);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo aprobar la publicación');
    } finally {
      setBusyKey(null);
    }
  };

  const onDelete = async () => {
    const group = pendingDelete;

    if (!group || deleting) return;

    setPendingDelete(null);
    setDeleting(true);
    setError(null);

    try {
      await Promise.all(group.reportIds.map((id) => updateReport(id, 'RESOLVED', 'DELETE_POST')));
      removeReports(group.reportIds);
      setPosts((current) => current.filter((post) => post.id !== group.key));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo eliminar la publicación');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <View className="flex-1 bg-[#FAF8F6]">
      <AdminBrandHeader />

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-6"
        contentContainerStyle={{ gap: 20, paddingTop: 24 }}
        showsVerticalScrollIndicator={false}>
        <View>
          <Text className="font-['Lora-Italic'] text-[28px] leading-9 text-[#241E1B]">Resumen</Text>
          <Text className="mt-1 text-[13px] leading-4 text-[#7A6E65]">
            Visión general del panel
          </Text>
        </View>

        {error && (
          <View className="flex-row items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3">
            <TriangleAlert size={16} color="#C2391F" />
            <Text className="flex-1 text-[13px] font-medium text-red-700">{error}</Text>
          </View>
        )}

        {loading ? (
          <View className="items-center py-12">
            <ActivityIndicator color="#A91243" />
          </View>
        ) : (
          <>
            <View className="flex-row gap-2">
              <StatCard
                title="Usuarios"
                icon={<Users size={14} color="#7A6E65" />}
                value={users.length}
                badge={
                  <View className="self-start rounded bg-[#E4F1EA] px-1.5 py-0.5">
                    <Text className="text-[10px] font-semibold leading-3 text-[#1F6B47]">
                      {usersThisWeek} nuevos esta semana
                    </Text>
                  </View>
                }
              />

              <StatCard
                title="Posts"
                icon={<ImageIcon size={14} color="#7A6E65" />}
                value={posts.length}
                badge={
                  <View className="self-start rounded bg-[#E4F1EA] px-1.5 py-0.5">
                    <Text className="text-[10px] font-semibold leading-3 text-[#1F6B47]">
                      {postsThisWeek} esta semana
                    </Text>
                  </View>
                }
              />

              <StatCard
                title="Categorías"
                icon={<Tag size={14} color="#7A6E65" />}
                value={categories.length}
                badge={
                  <View className="self-start rounded bg-[#F8E7ED] px-1.5 py-0.5">
                    <Text className="text-[10px] font-semibold leading-3 text-[#7A6E65]">
                      {categories.length} totales
                    </Text>
                  </View>
                }
              />
            </View>

            <View className="gap-4 rounded-xl border border-[#EDE7E1] bg-white p-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-sm font-semibold leading-[17px] text-[#241E1B]">
                  Actividad
                </Text>
                <Text className="text-xs leading-[15px] text-[#7A6E65]">
                  Usuarios conectados · 7 días
                </Text>
              </View>

              <BarsChart counts={loginCounts} highlightIndex={todayIndex} />
            </View>

            <View className="gap-3">
              <View className="flex-row items-center justify-between">
                <Text className="text-sm font-semibold leading-[17px] text-[#241E1B]">
                  Moderación
                </Text>
                <Pressable
                  onPress={() => router.push('/(admin)/reports')}
                  className="flex-row items-center gap-1"
                  hitSlop={8}>
                  <Text className="text-xs font-semibold text-[#A91243]">Ver todo</Text>
                  <ChevronRight size={12} color="#A91243" />
                </Pressable>
              </View>

              {modGroups.length === 0 ? (
                <View className="rounded-xl border border-[#EDE7E1] bg-white p-4">
                  <Text className="text-center text-[13px] text-[#7A6E65]">
                    No hay reportes pendientes.
                  </Text>
                </View>
              ) : (
                modGroups.map((group) => (
                  <ModerationCard
                    key={group.key}
                    title={group.title}
                    image={group.image}
                    reportCount={group.count}
                    reasonLabel={REPORT_REASON_LABELS[group.reason]}
                    busy={busyKey === group.key}
                    onApprove={() => onApprove(group)}
                    onDelete={() => setPendingDelete(group)}
                  />
                ))
              )}
            </View>
          </>
        )}
      </ScrollView>

      <ConfirmModal
        visible={pendingDelete !== null}
        title="¿Eliminar publicación?"
        message={
          pendingDelete
            ? `Se eliminará "${pendingDelete.title}" y sus ${pendingDelete.count} reporte${
                pendingDelete.count === 1 ? '' : 's'
              } quedarán resueltos.`
            : undefined
        }
        confirmLabel="Eliminar"
        danger
        loading={deleting}
        onConfirm={onDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </View>
  );
}
