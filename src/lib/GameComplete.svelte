<script>
  import { Sparkles, RefreshCw } from 'lucide-svelte';
  import { onMount } from 'svelte';

  let { gameKey, gameName, score, extras, won, onPlayAgain, onBack, onScore, onComplete, groupName } = $props();

  // Auto-save score and mark completion as soon as the screen mounts
  onMount(() => {
    if (won !== false && groupName) {
      onScore(gameKey, groupName, score);
      onComplete?.(gameKey);
    }
  });
</script>

<div class="bio-slide-in" style="margin-top: 30px; padding: 24px; background: #fdfaf3; border: 1.5px solid #1a1a2e; border-radius: 14px; text-align: center; box-shadow: 5px 5px 0 #1a1a2e;">
  <div style="display: flex; justify-content: center;">
    <Sparkles size={32} color="#e84a3f" />
  </div>
  <div class="bio-display" style="font-size: 28px; font-weight: 800; margin-top: 8px;">
    {won === false ? "Time's up" : 'Nicely done!'}
  </div>
  {#if groupName}
    <div style="font-size: 13px; opacity: 0.55; margin-top: 2px;">{groupName}</div>
  {/if}
  <div class="bio-display" style="font-size: 56px; font-weight: 800; color: #e84a3f; line-height: 1; margin: 12px 0;">
    {score}
  </div>
  <div style="display: flex; justify-content: center; gap: 24px; font-size: 13px; opacity: 0.75; margin-bottom: 20px;">
    {#each extras as e}
      <div>
        <div style="font-weight: 600;">{e.value}</div>
        <div style="font-size: 11px; opacity: 0.7;">{e.label}</div>
      </div>
    {/each}
  </div>

  {#if won !== false && groupName}
    <div style="margin-bottom: 16px; font-size: 13px; color: #15803d; font-weight: 600;">
      ✓ Score saved to leaderboard
    </div>
  {/if}

  <div style="display: flex; gap: 10px; justify-content: center;">
    <button class="bio-btn" onclick={onPlayAgain} style="background: #fdfaf3; color: #1a1a2e;">
      <RefreshCw size={14} style="display: inline; margin-right: 6px; vertical-align: -2px;" /> Play again
    </button>
    <button class="bio-btn" onclick={onBack}>Back to puzzles</button>
  </div>
</div>
