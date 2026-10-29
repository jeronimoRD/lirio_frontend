import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

import { getAdminUsers } from '../../api/admin';
import { getCategories } from '../../api/categories';
import { getPosts } from '../../api/posts';
import { getReports, updateReport } from '../../api/reports';
import type { Category, Post, Report, ReportReason, User } from '../../types';

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

export function useAdminResumen() {
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

  const requestDelete = (group: ModGroup) => setPendingDelete(group);

  const cancelDelete = () => setPendingDelete(null);

  const goToReports = () => router.push('/(admin)/reports');

  return {
    users,
    posts,
    categories,
    loading,
    error,
    busyKey,
    pendingDelete,
    deleting,
    usersThisWeek,
    postsThisWeek,
    loginCounts,
    todayIndex,
    modGroups,
    onApprove,
    onDelete,
    requestDelete,
    cancelDelete,
    goToReports,
  };
}
