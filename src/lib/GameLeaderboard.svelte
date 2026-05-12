<script>
  import { Trophy } from 'lucide-svelte';

  let { gameKey, scores } = $props();

  // Ascending: lower value = better (time in s, mistakes, attempts)
  let entries = $derived(
    (scores || []).slice().sort((a, b) => a.score - b.score).slice(0, 5)
  );

  function formatScore(score) {
    if (gameKey === 'binsort') return score + 's';
    return score;
  }

  const labels = {
    binsort:     'Time taken',
    connections: 'Mistakes',
    ordering:    'Attempts',
  };
</script>

<div style="text-align: right; padding-top: 14px; padding-left: 16px;">

  <div style="display: flex; align-items: center; justify-content: flex-end; gap: 6px; margin-bottom: 16px;">
    <span style="font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; opacity: 0.38; color: #1a1a2e;">Leaderboard</span>
    <Trophy size={12} color="#d4a437" style="opacity: 0.5;" />
  </div>

  <div style="font-size: 10px; opacity: 0.3; color: #1a1a2e; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.06em;">
    {labels[gameKey] ?? 'Score'}
  </div>

  {#if entries.length === 0}
    <div style="font-size: 11px; opacity: 0.3; color: #1a1a2e;">No scores yet.</div>
  {:else}
    {#each entries as s, i}
      {@const medal = ['#d4a437', '#94a3b8', '#a16207'][i]}
      <div style="display: flex; align-items: center; gap: 8px; padding: 5px 0; border-bottom: {i < entries.length - 1 ? '1px solid #1a1a2e10' : 'none'};">
        <div style="width: 14px; font-size: 10px; color: {medal ?? '#1a1a2e'}; opacity: {medal ? 0.65 : 0.28}; text-align: center; font-weight: 700; flex-shrink: 0;">{i + 1}</div>
        <div style="flex: 1; font-size: 11px; opacity: 0.45; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: right; color: #1a1a2e;">{s.name}</div>
        <div class="bio-display" style="font-size: 13px; font-weight: 700; opacity: 0.55; flex-shrink: 0; color: #1a1a2e;">{formatScore(s.score)}</div>
      </div>
    {/each}
  {/if}

</div>
