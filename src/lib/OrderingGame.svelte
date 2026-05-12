<script>
  import { GripVertical } from 'lucide-svelte';
  import { ORDER_STEPS, shuffle } from './data.js';
  import GameHeader from './GameHeader.svelte';
  import GameComplete from './GameComplete.svelte';
  import GameLeaderboard from './GameLeaderboard.svelte';

  let { onBack, onScore, onComplete, scores, groupName } = $props();

  const STATE_KEY = `gamestate:ordering:${groupName}`;

  // Load persisted state if available
  let initState = null;
  try {
    const saved = localStorage.getItem(STATE_KEY);
    if (saved) initState = JSON.parse(saved);
  } catch (e) {}

  let order      = $state(initState ? initState.order      : shuffle(ORDER_STEPS));
  let checked    = $state(initState ? initState.checked    : false);
  let status     = $state(initState ? initState.status     : 'playing');
  let attempts   = $state(initState ? initState.attempts   : 0);
  let startTime  = $state(initState ? initState.startTime  : Date.now());
  let finishTime = $state(initState ? initState.finishTime : null);

  // Persist game state on every change
  $effect(() => {
    try {
      localStorage.setItem(STATE_KEY, JSON.stringify({
        order, checked, status, attempts, startTime, finishTime,
      }));
    } catch (e) {}
  });

  let dragState = $state(null);
  let cardRefs = {};

  let elapsedSec = $derived(finishTime ? Math.round((finishTime - startTime) / 1000) : 0);
  // Score = attempts (lower is better); only first result stored per group
  let finalScore = $derived(status === 'done' ? attempts : 0);

  function setRef(el, id) {
    cardRefs[id] = el;
    return { destroy() { delete cardRefs[id]; } };
  }

  function onPointerDown(e, i, id) {
    if (status !== 'playing') return;
    e.currentTarget.setPointerCapture(e.pointerId);
    checked = false;
    dragState = { id, idx: i, startY: e.clientY, offsetY: 0 };
  }

  function onPointerMove(e) {
    if (!dragState) return;
    const offsetY = e.clientY - dragState.startY;
    const cardEl = cardRefs[dragState.id];
    if (!cardEl) {
      dragState = { ...dragState, offsetY };
      return;
    }
    const cardHeight = cardEl.offsetHeight + 8;
    const indexDelta = Math.round(offsetY / cardHeight);
    const newIdx = Math.max(0, Math.min(order.length - 1, dragState.idx + indexDelta));

    if (newIdx !== dragState.idx) {
      const newOrder = [...order];
      const [moving] = newOrder.splice(dragState.idx, 1);
      newOrder.splice(newIdx, 0, moving);
      order = newOrder;
      const newStartY = dragState.startY + (newIdx - dragState.idx) * cardHeight;
      dragState = { id: dragState.id, idx: newIdx, startY: newStartY, offsetY: e.clientY - newStartY };
    } else {
      dragState = { ...dragState, offsetY };
    }
  }

  function onPointerUp() {
    dragState = null;
  }

  function check() {
    attempts++;
    checked = true;
    const isCorrect = order.every((step, i) => step.id === i + 1);
    if (isCorrect) {
      status = 'done';
      finishTime = Date.now();
    }
  }

  function reset() {
    try { localStorage.removeItem(STATE_KEY); } catch (e) {}
    order      = shuffle(ORDER_STEPS);
    checked    = false;
    status     = 'playing';
    attempts   = 0;
    startTime  = Date.now();
    finishTime = null;
  }
</script>

<div style="width: 100%;">
  <GameHeader title="Action Potential" {onBack}>
    {#snippet right()}
      <span style="font-size: 12px; opacity: 0.7;">Attempts: {attempts}</span>
    {/snippet}
  </GameHeader>

  <!-- 3-column grid: empty | game | leaderboard -->
  <div style="display: grid; grid-template-columns: minmax(0, 1fr) minmax(280px, 600px) 220px; gap: 0 40px; padding: 0 24px; max-width: 1080px; margin: 0 auto;">

    <div></div>

    <!-- Game content -->
    <div style="padding: 0 0 80px; position: relative; z-index: 1;">
      {#if status === 'playing'}
        <div style="font-size: 13px; opacity: 0.7; text-align: center; margin-bottom: 14px;">
          Drag the cards into the correct order, then check
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px;">
          {#each order as step, i (step.id)}
            {@const isCorrect = checked && step.id === i + 1}
            {@const isWrong = checked && step.id !== i + 1}
            {@const isDragging = dragState?.id === step.id}
            <div
              use:setRef={step.id}
              role="button"
              tabindex={i}
              class="bio-card"
              onpointerdown={(e) => onPointerDown(e, i, step.id)}
              onpointermove={onPointerMove}
              onpointerup={onPointerUp}
              onpointercancel={onPointerUp}
              style="
                padding: 12px;
                display: flex;
                gap: 10px;
                align-items: center;
                background: {isCorrect ? '#dcfce7' : isWrong ? '#fee2e2' : '#fdfaf3'};
                border-color: {isCorrect ? '#15803d' : isWrong ? '#c2410c' : '#1a1a2e'};
                box-shadow: {isDragging ? '8px 8px 0 #1a1a2e' : isCorrect ? '3px 3px 0 #15803d' : isWrong ? '3px 3px 0 #c2410c' : '3px 3px 0 #1a1a2e'};
                transform: {isDragging ? `translateY(${dragState.offsetY}px) scale(1.02) rotate(-0.5deg)` : 'none'};
                transition: {isDragging ? 'none' : 'background 0.3s, border-color 0.3s, box-shadow 0.2s'};
                cursor: {isDragging ? 'grabbing' : 'grab'};
                touch-action: none;
                user-select: none;
                z-index: {isDragging ? 100 : 1};
                position: relative;
                opacity: {isDragging ? 0.95 : 1};
              "
            >
              <div class="bio-display" style="flex-shrink: 0; width: 28px; height: 28px; background: #1a1a2e; color: #f4ede1; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px;">{i + 1}</div>
              <div style="flex: 1; font-size: 13.5px; line-height: 1.35; pointer-events: none;">{step.text}</div>
              <GripVertical size={18} style="flex-shrink: 0; opacity: 0.4;" />
            </div>
          {/each}
        </div>

        <div style="display: flex; gap: 10px; justify-content: center; margin-top: 18px;">
          <button class="bio-btn" onclick={() => { order = shuffle(ORDER_STEPS); checked = false; }} style="background: #fdfaf3; color: #1a1a2e;">Shuffle</button>
          <button class="bio-btn" onclick={check}>Check Order</button>
        </div>
      {:else}
        <GameComplete
          gameKey="ordering"
          gameName="Action Potential"
          score={finalScore}
          extras={[
            { label: 'Attempts', value: attempts },
            { label: 'Time', value: elapsedSec + 's' },
          ]}
          won={true}
          onPlayAgain={reset}
          {onBack}
          {onScore}
          {onComplete}
          {groupName}
        />
      {/if}
    </div>

    <!-- Leaderboard -->
    <GameLeaderboard gameKey="ordering" {scores} />

  </div>
</div>
