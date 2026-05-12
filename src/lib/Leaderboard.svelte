<script>
  import { Trophy, Loader2 } from 'lucide-svelte';
  import GameHeader from './GameHeader.svelte';

  let { onBack, scores, loading } = $props();

  let tab = $state('binsort');

  const tabs = [
    { id: 'binsort', name: 'Bin Sort' },
    { id: 'connections', name: 'Connections' },
    { id: 'ordering', name: 'Action Potential' },
  ];

  let current = $derived(
    (scores[tab] || []).slice().sort((a, b) => b.score - a.score).slice(0, 10)
  );
</script>

<div>
  <GameHeader title="Leaderboard" {onBack} />

  <div style="padding: 0 16px 80px; max-width: 560px; margin: 0 auto; position: relative; z-index: 1;">
    <div style="display: flex; gap: 6px; margin-bottom: 16px; flex-wrap: wrap; justify-content: center;">
      {#each tabs as t}
        <button
          onclick={() => { tab = t.id; }}
          class="bio-chip"
          style="background: {tab === t.id ? '#1a1a2e' : '#fdfaf3'}; color: {tab === t.id ? '#f4ede1' : '#1a1a2e'};"
        >{t.name}</button>
      {/each}
    </div>

    <div class="bio-card" style="padding: 20px;">
      {#if loading}
        <div style="text-align: center; padding: 40px; opacity: 0.5;">
          <div style="display: flex; justify-content: center;">
            <Loader2 size={24} class="bio-spin" />
          </div>
          <div style="margin-top: 8px; font-size: 13px;">Loading scores...</div>
        </div>
      {:else if current.length === 0}
        <div style="text-align: center; padding: 30px; opacity: 0.5;">
          <div style="display: flex; justify-content: center;">
            <Trophy size={32} />
          </div>
          <div style="font-size: 14px; margin-top: 8px;">No scores yet — be the first!</div>
        </div>
      {:else}
        <div>
          {#each current as s, i}
            {@const medal = ['#d4a437', '#94a3b8', '#a16207'][i]}
            <div style="display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: {i < current.length - 1 ? '1px solid #1a1a2e22' : 'none'};">
              <div class="bio-display" style="width: 30px; font-weight: 700; font-size: 18px; color: {medal ?? '#1a1a2e'}; opacity: {medal ? 1 : 0.5}; text-align: center;">
                {i + 1}
              </div>
              <div style="flex: 1; font-weight: 500; font-size: 14px;">{s.name}</div>
              <div class="bio-display" style="font-weight: 700; font-size: 18px;">{s.score}</div>
            </div>
          {/each}
        </div>
      {/if}
    </div>

    <p style="text-align: center; font-size: 11px; opacity: 0.4; margin-top: 16px;">
      Scores shared with everyone using this puzzle
    </p>
  </div>
</div>
