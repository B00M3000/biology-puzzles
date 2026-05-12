<script>
  let { onLogin, onClear } = $props();

  let groupName = $state('');

  function start() {
    const name = groupName.trim();
    if (!name) return;
    onLogin(name);
  }

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
    <div style="display: flex; gap: 10px;">
      <input
        bind:value={groupName}
        onkeydown={(e) => e.key === 'Enter' && start()}
        placeholder="e.g. Alice, Bob, Charlie"
        maxlength={80}
        style="
          flex: 1;
          padding: 10px 12px;
          border: 1.5px solid #1a1a2e;
          border-radius: 8px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          background: #f4ede1;
          color: #1a1a2e;
          min-width: 0;
        "
      />
      <button
        onclick={start}
        disabled={!groupName.trim()}
        class="bio-btn"
        style="flex-shrink: 0;"
      >Start →</button>
    </div>
    <div style="font-size: 11px; opacity: 0.5; margin-top: 8px; line-height: 1.4;">
      Enter your names separated by commas — this will appear on the leaderboard.
    </div>
  </div>

  <div style="margin-top: 20px; text-align: center;">
    <button
      onclick={() => { clearStage = 'stage1'; }}
      style="background: none; border: none; cursor: pointer; font-size: 10px; opacity: 0.28; color: #1a1a2e; font-family: 'DM Sans', sans-serif; text-decoration: underline; padding: 2px 0;"
    >Clear all scores</button>
  </div>

</div>
</div>
