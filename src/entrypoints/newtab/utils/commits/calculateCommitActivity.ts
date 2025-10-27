import { Commit } from '../../types/Commit';

// Calculate commit activity for the configured date range
export function calculateCommitActivity(commitsList: Commit[], sinceWhenDays: number): number[] {
  const activity = new Array(sinceWhenDays).fill(0);
  const now = Date.now();

  commitsList.forEach(commit => {
    const commitDate = new Date(commit.commit.author.date).getTime();
    const daysAgo = Math.floor((now - commitDate) / (24 * 60 * 60 * 1000));

    if (daysAgo >= 0 && daysAgo < sinceWhenDays) {
      // Index 0 is oldest day, index (sinceWhenDays - 1) is today
      activity[sinceWhenDays - 1 - daysAgo]++;
    }
  });

  return activity;
}
