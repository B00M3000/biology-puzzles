<script>
  import { SECRET_CODE } from './data.js';

  let { onLogin, onClear, scores = { connections: [], ordering: [] } } = $props();

  let groupName = $state('');
  let accessCode = $state('');
  let codeError = $state(false);

  function start() {
    const name = groupName.trim();
    if (!name) return;
    if (accessCode.trim().toUpperCase() !== SECRET_CODE.toUpperCase()) {
      codeError = true;
      return;
    }
    codeError = false;
    onLogin(name);
  }

  let connEntries  = $derived((scores.connections || []).slice().sort((a, b) => a.score - b.score).slice(0, 10));
  let orderEntries = $derived((scores.ordering    || []).slice().sort((a, b) => a.score - b.score).slice(0, 10));

  // Two-stage clear modal: 'hidden' | 'stage1' | 'stage2'
  let clearStage = $state('hidden');

  function confirmClear() {
    clearStage = 'hidden';
    onClear();
  }
</script>

<!-- Two-stage clear-scores modal -->
{#if clearStage !== 'hidden'}
  <div
    role="dialog"
    aria-modal="true"
    style="position: fixed; inset: 0; z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 24px;"
    onclick={(e) => { if (e.target === e.currentTarget) clearStage = 'hidden'; }}
  >
    <div style="position: absolute; inset: 0; background: #1a1a2e44; backdrop-filter: blur(2px);"></div>

    {#if clearStage === 'stage1'}
      <div class="bio-card bio-slide-in" style="position: relative; z-index: 1; background: #fdfaf3; padding: 32px 28px; max-width: 360px; width: 100%; text-align: center;">
        <div class="bio-display" style="font-size: 22px; font-weight: 700; margin-bottom: 10px; line-height: 1.2;">
          Would Ms. Sundberg approve of this behavior?
        </div>
        <p style="font-size: 13px; opacity: 0.6; margin: 0 0 24px; line-height: 1.5;">
          All scores will be permanently cleared.
        </p>
        <div style="display: flex; gap: 10px; justify-content: center;">
          <button onclick={() => { clearStage = 'hidden'; }} class="bio-btn" style="background: #fdfaf3; color: #1a1a2e; box-shadow: 3px 3px 0 #1a1a2e44;">Cancel</button>
          <button onclick={() => { clearStage = 'stage2'; }} class="bio-btn" style="background: #e84a3f; border-color: #e84a3f;">Continue</button>
        </div>
      </div>
    {:else}
      <div class="bio-card bio-slide-in" style="position: relative; z-index: 1; background: #fdfaf3; padding: 32px 28px; max-width: 380px; width: 100%; text-align: center;">
        <div class="bio-display" style="font-size: 22px; font-weight: 700; margin-bottom: 10px; line-height: 1.2;">
          Would Ms. Sundberg <em>REALLY REALLY</em> approve of this behavior?
        </div>
        <p style="font-size: 13px; opacity: 0.6; margin: 0 0 24px; line-height: 1.5;">
          This is your last chance. All scores gone forever.
        </p>
        <div style="display: flex; gap: 10px; justify-content: center;">
          <button onclick={() => { clearStage = 'hidden'; }} class="bio-btn" style="background: #fdfaf3; color: #1a1a2e; box-shadow: 3px 3px 0 #1a1a2e44;">Cancel</button>
          <button onclick={confirmClear} class="bio-btn" style="background: #e84a3f; border-color: #e84a3f;">Clear scores</button>
        </div>
      </div>
    {/if}
  </div>
{/if}

<!-- Connections leaderboard (fixed left) -->
<div style="position: fixed; left: 24px; top: 24px; z-index: 10; width: 180px;">
  <div style="font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #1a1a2e; opacity: 0.6; margin-bottom: 12px;">Connections</div>
  <div style="font-size: 10px; text-align: right; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.06em; opacity: 0.5; color: #1a1a2e;">Mistakes</div>
  {#if connEntries.length === 0}
    <div style="font-size: 11px; opacity: 0.45; text-align: center; padding: 8px 0;">No scores yet.</div>
  {:else}
    {#each connEntries as s, i}
      {@const medal = ['#d4a437', '#94a3b8', '#a16207'][i]}
      <div style="display: flex; align-items: center; gap: 8px; padding: 5px 0; border-bottom: {i < connEntries.length - 1 ? '1px solid #1a1a2e15' : 'none'};">
        <div style="width: 14px; font-size: 10px; color: {medal ?? '#1a1a2e'}; opacity: {medal ? 0.9 : 0.5}; font-weight: 700; flex-shrink: 0;">{i + 1}</div>
        <div style="flex: 1; font-size: 11px; opacity: 0.7; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #1a1a2e;">{s.name}</div>
        <div class="bio-display" style="font-size: 13px; font-weight: 700; opacity: 0.8; flex-shrink: 0; color: #1a1a2e;">{s.score}</div>
      </div>
    {/each}
  {/if}
</div>

<div class="bio-slide-in" style="min-height: 100svh; display: flex; align-items: center; justify-content: center; padding: 24px 16px; position: relative; z-index: 1;">
<div style="width: 100%; max-width: 480px;">

  <div style="text-align: center; margin-bottom: 32px;">
    <h1 class="bio-display" style="font-size: clamp(32px, 7vw, 52px); font-weight: 800; margin: 0; line-height: 1;">
      Enzymes <span style="font-style: italic; color: #e84a3f;">&</span> Neurons
    </h1>
  </div>

  <!-- Instructions card -->
  <div class="bio-card" style="padding: 22px 24px; background: #fdfaf3; margin-bottom: 20px;">
    <div class="bio-display" style="font-size: 16px; font-weight: 700; margin-bottom: 14px;">How it works</div>
    <ol style="margin: 0; padding-left: 20px; display: flex; flex-direction: column; gap: 10px;">
      <li style="font-size: 13.5px; line-height: 1.4;">
        Work together to complete all three biology puzzles.
      </li>
      <li style="font-size: 13.5px; line-height: 1.4;">
        Finish all three to unlock the <strong>secret code</strong> — show it to your teacher!
      </li>
      <li style="font-size: 13.5px; line-height: 1.4;">
        If your group finishes early, keep playing to climb the <strong>leaderboard</strong>!
      </li>
      <li style="font-size: 13.5px; line-height: 1.4;">
        When you're done, hit <strong>Log Out</strong> so the next group can play.
      </li>
    </ol>
  </div>

  <!-- Group name entry -->
  <div class="bio-card" style="padding: 22px 24px; background: #fdfaf3;">
    <div style="font-size: 13px; font-weight: 600; margin-bottom: 8px;">Group members</div>
    <input
      bind:value={groupName}
      onkeydown={(e) => e.key === 'Enter' && start()}
      placeholder="e.g. Alice, Bob, Charlie"
      maxlength={80}
      style="
        width: 100%;
        box-sizing: border-box;
        padding: 10px 12px;
        border: 1.5px solid #1a1a2e;
        border-radius: 8px;
        font-size: 14px;
        font-family: 'DM Sans', sans-serif;
        background: #f4ede1;
        color: #1a1a2e;
      "
    />
    <div style="font-size: 11px; opacity: 0.5; margin-top: 6px; margin-bottom: 16px; line-height: 1.4;">
      Enter your names separated by commas — this will appear on the leaderboard.
    </div>

    <div style="font-size: 13px; font-weight: 600; margin-bottom: 8px;">Access code</div>
    <div style="display: flex; gap: 10px;">
      <input
        bind:value={accessCode}
        onkeydown={(e) => { if (e.key === 'Enter') start(); if (codeError) codeError = false; }}
        oninput={() => { codeError = false; }}
        placeholder="Enter code"
        maxlength={20}
        style="
          flex: 1;
          padding: 10px 12px;
          border: 1.5px solid {codeError ? '#e84a3f' : '#1a1a2e'};
          border-radius: 8px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          background: {codeError ? '#fff0ef' : '#f4ede1'};
          color: #1a1a2e;
          min-width: 0;
        "
      />
      <button
        onclick={start}
        disabled={!groupName.trim() || !accessCode.trim()}
        class="bio-btn"
        style="flex-shrink: 0;"
      >Start →</button>
    </div>
    {#if codeError}
      <div style="font-size: 12px; color: #e84a3f; margin-top: 6px; font-weight: 600;">
        Incorrect access code. Please try again.
      </div>
    {:else}
      <div style="font-size: 11px; opacity: 0.5; margin-top: 6px; line-height: 1.4;">
        Ask your teacher for the access code.
      </div>
    {/if}
  </div>

  <div style="margin-top: 20px; text-align: center;">
    <button
      onclick={() => { clearStage = 'stage1'; }}
      style="background: none; border: none; cursor: pointer; font-size: 10px; opacity: 0.28; color: #1a1a2e; font-family: 'DM Sans', sans-serif; text-decoration: underline; padding: 2px 0;"
    >Clear all scores</button>
  </div>

</div>
</div>

<!-- Action Potential leaderboard (fixed right) -->
<div style="position: fixed; right: 24px; top: 24px; z-index: 10; width: 180px;">
  <div style="font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #1a1a2e; opacity: 0.6; margin-bottom: 12px;">Action Potential</div>
  <div style="font-size: 10px; text-align: right; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.06em; opacity: 0.5; color: #1a1a2e;">Attempts</div>
  {#if orderEntries.length === 0}
    <div style="font-size: 11px; opacity: 0.45; text-align: center; padding: 8px 0;">No scores yet.</div>
  {:else}
    {#each orderEntries as s, i}
      {@const medal = ['#d4a437', '#94a3b8', '#a16207'][i]}
      <div style="display: flex; align-items: center; gap: 8px; padding: 5px 0; border-bottom: {i < orderEntries.length - 1 ? '1px solid #1a1a2e15' : 'none'};">
        <div style="width: 14px; font-size: 10px; color: {medal ?? '#1a1a2e'}; opacity: {medal ? 0.9 : 0.5}; font-weight: 700; flex-shrink: 0;">{i + 1}</div>
        <div style="flex: 1; font-size: 11px; opacity: 0.7; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #1a1a2e;">{s.name}</div>
        <div class="bio-display" style="font-size: 13px; font-weight: 700; opacity: 0.8; flex-shrink: 0; color: #1a1a2e;">{s.score}</div>
      </div>
    {/each}
  {/if}
</div>
