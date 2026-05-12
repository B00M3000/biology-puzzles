<script>
  import { CONNECTIONS_GROUPS, shuffle } from './data.js';
  import GameHeader from './GameHeader.svelte';
  import GameComplete from './GameComplete.svelte';
  import GameLeaderboard from './GameLeaderboard.svelte';

  let { onBack, onScore, onComplete, scores, groupName } = $props();

  const allTerms = CONNECTIONS_GROUPS.flatMap((g, i) =>
    g.terms.map(term => ({ term, groupIdx: i }))
  );

  const STATE_KEY = `gamestate:connections:${groupName}`;

  // Load persisted state if available
  let initState = null;
  try {
    const saved = localStorage.getItem(STATE_KEY);
    if (saved) initState = JSON.parse(saved);
  } catch (e) {}

  let tiles      = $state(initState ? initState.tiles      : shuffle(allTerms));
  let solved     = $state(initState ? initState.solved     : []);
  let mistakes   = $state(initState ? initState.mistakes   : 0);
  let shaking    = $state(false);
  let status     = $state(initState ? initState.status     : 'playing');
  let startTime  = $state(initState ? initState.startTime  : Date.now());
  let finishTime = $state(initState ? initState.finishTime : null);

  let selected = $state([]);

  // Persist game state on every change
  $effect(() => {
    try {
      localStorage.setItem(STATE_KEY, JSON.stringify({
        tiles, solved, mistakes, status, startTime, finishTime,
      }));
    } catch (e) {}
  });

  let elapsedSec = $derived(finishTime ? Math.round((finishTime - startTime) / 1000) : 0);
  // Score = mistakes (lower is better); only first result stored per group
  let finalScore = $derived(status === 'won' ? mistakes : 0);

  function toggle(term) {
    if (status !== 'playing') return;
    if (selected.includes(term)) {
      selected = selected.filter(t => t !== term);
    } else if (selected.length < 4) {
      selected = [...selected, term];
    }
  }

  function submit() {
    if (selected.length !== 4) return;
    const groupIdxs = selected.map(t => tiles.find(tile => tile.term === t).groupIdx);
    const allSame = groupIdxs.every(i => i === groupIdxs[0]);
    if (allSame) {
      const newSolved = [...solved, groupIdxs[0]];
      tiles = tiles.filter(t => !selected.includes(t.term));
      solved = newSolved;
      selected = [];
      if (newSolved.length === 4) {
        status = 'won';
        finishTime = Date.now();
      }
    } else {
      const newMistakes = mistakes + 1;
      mistakes = newMistakes;
      shaking = true;
      setTimeout(() => {
        shaking = false;
        if (newMistakes >= 4) {
          status = 'lost';
          finishTime = Date.now();
        } else {
          selected = [];
        }
      }, 600);
    }
  }

  function tileFontSize(term) {
    const len = term.length;
    if (len <= 8)  return 'clamp(10px, 3.5vw, 20px)';
    if (len <= 11) return 'clamp(9px, 3vw, 17px)';
    if (len <= 14) return 'clamp(8px, 2.5vw, 14px)';
    return 'clamp(7px, 2vw, 11px)';
  }

  function reset() {
    try { localStorage.removeItem(STATE_KEY); } catch (e) {}
    tiles      = shuffle(allTerms);
    selected   = [];
    solved     = [];
    mistakes   = 0;
    shaking    = false;
    status     = 'playing';
    startTime  = Date.now();
    finishTime = null;
  }
</script>

<div style="width: 100%; min-height: 100svh; display: flex; flex-direction: column;">
  <GameHeader title="Connections" {onBack} />

  <!-- 3-column grid: empty | game | leaderboard -->
  <div style="flex: 1; display: flex; align-items: center; justify-content: center; padding-top: 24px;">
  <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 0 40px; padding: 0 24px; max-width: 1080px; width: 100%;">

    <div></div>

    <!-- Game content -->
    <div style="padding: 0 0 80px; position: relative; z-index: 1; width: clamp(300px, 45vw, 640px);">
      {#if status === 'playing'}
        <div class="bio-nyt-font" style="font-size: 15px; text-align: center; margin-bottom: 20px; font-weight: 500;">
          Create four groups of four!
        </div>
      {/if}

      <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: {solved.length > 0 ? '8px' : '0'};">
        {#each solved as gIdx}
          {@const group = CONNECTIONS_GROUPS[gIdx]}
          <div class="bio-slide-in bio-nyt-font" style="padding: 14px 16px; background: {group.bg}; border-radius: 7px; text-align: center;">
            <div style="font-weight: 800; font-size: 13px; text-transform: uppercase; letter-spacing: 0.04em;">{group.name}</div>
            <div style="font-size: 13px; margin-top: 4px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.02em;">{group.terms.join(', ')}</div>
          </div>
        {/each}
      </div>

      {#if status === 'playing'}
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;">
          {#each tiles as t (t.term)}
            {@const isSel = selected.includes(t.term)}
            <button
              onclick={() => toggle(t.term)}
              class="bio-nyt-tile {isSel ? 'bio-nyt-tile-selected' : ''}"
              style="
                height: clamp(56px, 13vh, 140px);
                min-width: 0;
                padding: 4px;
                font-size: {tileFontSize(t.term)};
                text-transform: uppercase;
                line-height: 1.1;
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
                animation: {shaking && isSel ? 'shake 0.4s' : 'none'};
              "
            >
              {t.term}
            </button>
          {/each}
        </div>

        <div class="bio-nyt-font" style="display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 26px; font-size: 14px; font-weight: 500;">
          <span>Mistakes Remaining:</span>
          <span style="display: flex; gap: 7px;">
            {#each [0, 1, 2, 3] as i}
              <span style="
                width: 13px;
                height: 13px;
                border-radius: 50%;
                background: {i < (4 - mistakes) ? '#5a594e' : 'transparent'};
                border: {i < (4 - mistakes) ? 'none' : '1.5px solid #5a594e55'};
                display: inline-block;
                transition: all 0.2s;
              "></span>
            {/each}
          </span>
        </div>

        <div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px; flex-wrap: wrap;">
          <button class="bio-nyt-pill" onclick={() => { tiles = shuffle(tiles); }}>Shuffle</button>
          <button class="bio-nyt-pill" onclick={() => { selected = []; }} disabled={selected.length === 0}>Deselect All</button>
          <button class="bio-nyt-pill" onclick={submit} disabled={selected.length !== 4}>Submit</button>
        </div>
      {/if}

      {#if status === 'won'}
        <GameComplete
          gameKey="connections"
          gameName="Connections"
          score={finalScore}
          extras={[
            { label: 'Mistakes', value: mistakes },
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

      {#if status === 'lost'}
        <div style="margin-top: 8px;">
          {#each CONNECTIONS_GROUPS as g, i}
            {#if !solved.includes(i)}
              <div class="bio-nyt-font" style="padding: 14px 16px; background: {g.bg}; border-radius: 7px; text-align: center; margin-bottom: 8px;">
                <div style="font-weight: 800; font-size: 13px; text-transform: uppercase; letter-spacing: 0.04em;">{g.name}</div>
                <div style="font-size: 13px; margin-top: 4px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.02em;">{g.terms.join(', ')}</div>
              </div>
            {/if}
          {/each}
          <div style="text-align: center; margin-top: 26px;">
            <div class="bio-nyt-font" style="font-size: 20px; font-weight: 700;">Better luck next time</div>
            <button class="bio-nyt-pill" onclick={reset} style="margin-top: 16px;">Try again</button>
          </div>
        </div>
      {/if}
    </div>

    <!-- Leaderboard -->
    <GameLeaderboard gameKey="connections" {scores} />

  </div>
  </div>
</div>
