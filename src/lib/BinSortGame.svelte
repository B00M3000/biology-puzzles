<script>
  import { Timer, Check, X } from 'lucide-svelte';
  import { BINS, BIN_ITEMS, BIN_SORT_TIME, shuffle } from './data.js';
  import GameHeader from './GameHeader.svelte';
  import GameComplete from './GameComplete.svelte';
  import GameLeaderboard from './GameLeaderboard.svelte';

  let { onBack, onScore, onComplete, scores, groupName } = $props();

  let items = $state(shuffle(BIN_ITEMS));
  let idx = $state(0);
  let timeLeft = $state(BIN_SORT_TIME);
  let status = $state('playing'); // 'playing' | 'done'
  let feedback = $state(null);    // { correct, explain } | null
  let correctCount = $state(0);
  let locked = $state(false);

  let current = $derived(items[idx]);
  // Score = time taken in seconds (lower is better)
  let finalScore = $derived(BIN_SORT_TIME - timeLeft);

  $effect(() => {
    if (status !== 'playing') return;
    const interval = setInterval(() => {
      if (timeLeft <= 1) {
        timeLeft = 0;
        status = 'done';
        clearInterval(interval);
      } else {
        timeLeft--;
      }
    }, 1000);
    return () => clearInterval(interval);
  });

  function answer(binId) {
    if (locked || !current || status !== 'playing') return;
    locked = true;
    const correct = current.bin === binId;
    if (correct) {
      correctCount++;
      feedback = { correct: true, explain: current.explain };
    } else {
      timeLeft = Math.max(0, timeLeft - 3);
      feedback = { correct: false, explain: current.explain };
    }
    setTimeout(() => {
      feedback = null;
      locked = false;
      if (idx + 1 >= items.length) {
        status = 'done';
      } else {
        idx++;
      }
    }, correct ? 700 : 1400);
  }

  function restart() {
    items = shuffle(BIN_ITEMS);
    idx = 0;
    timeLeft = BIN_SORT_TIME;
    status = 'playing';
    correctCount = 0;
    feedback = null;
    locked = false;
  }
</script>

<div style="width: 100%;">
  <GameHeader title="True or False" {onBack}>
    {#snippet right()}
      <div style="display: flex; align-items: center; gap: 6px; justify-content: flex-end;">
        <Timer size={16} color={timeLeft < 15 ? '#e84a3f' : '#1a1a2e'} />
        <span class="bio-display" style="font-weight: 700; font-size: 18px; color: {timeLeft < 15 ? '#e84a3f' : '#1a1a2e'};">{timeLeft}s</span>
      </div>
    {/snippet}
  </GameHeader>

  <!-- 3-column grid: empty | game | leaderboard -->
  <div style="display: grid; grid-template-columns: minmax(0, 1fr) minmax(280px, 560px) 220px; gap: 0 40px; padding: 0 24px; max-width: 1080px; margin: 0 auto;">

    <div></div>

    <!-- Game content -->
    <div style="padding: 0 0 80px; position: relative; z-index: 1;">
      {#if status === 'playing' && current}
        <div style="font-size: 12px; opacity: 0.6; text-align: center; margin-bottom: 10px; letter-spacing: 0.05em; text-transform: uppercase; font-weight: 600;">
          Statement {idx + 1} of {items.length} · Wrong = −3s
        </div>

        <div style="display: flex; gap: 4px; justify-content: center; margin-bottom: 18px;">
          {#each items as _, i}
            <div style="flex: 1; height: 4px; border-radius: 2px; background: {i < idx ? '#1a1a2e' : i === idx ? '#e84a3f' : '#1a1a2e22'}; max-width: 18px;"></div>
          {/each}
        </div>

        <div class="bio-card bio-slide-in" style="
          padding: 32px 24px;
          margin-bottom: 20px;
          min-height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: {feedback?.correct === true ? '#dcfce7' : feedback?.correct === false ? '#fee2e2' : '#fdfaf3'};
          border-color: {feedback?.correct === true ? '#15803d' : feedback?.correct === false ? '#c2410c' : '#1a1a2e'};
          box-shadow: {feedback?.correct === true ? '5px 5px 0 #15803d' : feedback?.correct === false ? '5px 5px 0 #c2410c' : '5px 5px 0 #1a1a2e'};
          transition: all 0.3s;
        ">
          {#if feedback}
            <div style="text-align: center;">
              {#if feedback.correct}
                <Check size={32} color="#15803d" />
              {:else}
                <X size={32} color="#c2410c" />
              {/if}
              <div class="bio-display" style="font-size: 22px; font-weight: 700; margin-top: 6px; color: {feedback.correct ? '#15803d' : '#c2410c'};">
                {feedback.correct ? 'Correct' : 'Not quite'}
              </div>
              <div style="font-size: 13.5px; margin-top: 6px; line-height: 1.4; opacity: 0.85;">{feedback.explain}</div>
            </div>
          {:else}
            <div class="bio-display" style="font-size: clamp(18px, 4.5vw, 22px); font-weight: 500; text-align: center; line-height: 1.35;">
              "{current.label}"
            </div>
          {/if}
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          {#each BINS as bin}
            <button onclick={() => answer(bin.id)} disabled={locked} class="bio-card bio-card-press" style="
              padding: 24px 12px;
              background: {bin.bg};
              border: 1.5px solid {bin.accent};
              cursor: {locked ? 'default' : 'pointer'};
              box-shadow: 4px 4px 0 {bin.accent};
              opacity: {locked ? 0.6 : 1};
            ">
              <div class="bio-display" style="font-weight: 700; font-size: 26px; color: {bin.accent};">{bin.name}</div>
            </button>
          {/each}
        </div>

        <div style="text-align: center; font-size: 11px; opacity: 0.5; margin-top: 16px;">
          Correct: {correctCount} / {idx + (feedback ? 1 : 0)}
        </div>
      {:else}
        <GameComplete
          gameKey="binsort"
          gameName="True or False"
          score={finalScore}
          extras={[
            { label: 'Correct', value: `${correctCount} / ${items.length}` },
            { label: 'Time taken', value: finalScore + 's' },
          ]}
          onPlayAgain={restart}
          {onBack}
          {onScore}
          {onComplete}
          {groupName}
        />
      {/if}
    </div>

    <!-- Leaderboard -->
    <GameLeaderboard gameKey="binsort" {scores} />

  </div>
</div>
