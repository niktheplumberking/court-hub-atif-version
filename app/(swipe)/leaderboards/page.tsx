import Leaderboard from '@/components/tournaments/Leaderboard';
import { getLeaderboardRows } from '@/lib/tournaments/server-store';

export const metadata = {
  title: 'Season Leaderboard — Court Hub',
  description:
    'The Court Hub 2026 season leaderboard. Cumulative points across every event, weighted by category, filterable by division.',
};

// Reads the live server store (admin edits reflect immediately).
export const dynamic = 'force-dynamic';

export default async function Page() {
  const rows = await getLeaderboardRows();
  return <Leaderboard rows={rows} />;
}
