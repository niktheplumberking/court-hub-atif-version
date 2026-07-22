import TournamentHub from '@/components/tournaments/TournamentHub';
import { getLiveFinal, listTournaments } from '@/lib/tournaments/server-store';

export const metadata = {
  title: 'Tournaments — Court Hub',
  description:
    'Enter sanctioned P25 to P250 padel tournaments across the UAE, follow live groups and brackets, and track the Court Hub season leaderboard.',
};

// Reads the live server store (admin edits reflect immediately). Switch to ISR
// (export const revalidate) once the Supabase data layer lands.
export const dynamic = 'force-dynamic';

export default async function Page() {
  const [tournaments, liveFinal] = await Promise.all([listTournaments(), getLiveFinal()]);
  return <TournamentHub tournaments={tournaments} liveFinal={liveFinal} />;
}
