<script>
  import { Boxes, Grid3x3, ListOrdered, Lock, Check, LogOut } from 'lucide-svelte';
  import config from '../../config.yaml';

  let { onNav, scores, completedGames, groupName, onLogout, onClear } = $props();

  const games = [
    { id: 'binsort',     title: 'True or False',   desc: 'Sort 16 statements into the right bin.',  icon: Boxes,       accent: '#e84a3f', time: '75s' },
    { id: 'connections', title: 'Connections',      desc: 'Find the four hidden groups of four.',    icon: Grid3x3,     accent: '#0d8b8b', time: '∞'   },
    { id: 'ordering',    title: 'Action Potential', desc: 'Arrange the steps of nerve signaling.',  icon: ListOrdered, accent: '#d4a437', time: '∞'   },
  ];

  let completedCount = $derived(
    Object.values(completedGames).filter(Boolean).length
  );
  let allCompleted = $derived(completedCount === 3);

  // Code reveal state
  let showCode = $state(false);
  let showLogoutReminder = $state(false);

  function requestCode() {
    showLogoutReminder = true;
  }

  function acknowledgeAndShowCode() {
    showLogoutReminder = false;
    showCode = true;
  }

  // Two-stage clear modal: 'hidden' | 'stage1' | 'stage2'
  let clearStage = $state('hidden');

  function confirmClear() {
    clearStage = 'hidden';
    onClear();
  }

  // Group initial for avatar
  let initial = $derived(groupName?.[0]?.toUpperCase() ?? '?');
</script>

<!-- Logout reminder (shown before code is revealed) -->
{#if showLogoutReminder}
  <div
    role="dialog"
    aria-modal="true"
    style="position: fixed; inset: 0; z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 24px;"
  >
    <div style="position: absolute; inset: 0; background: #1a1a2e44; backdrop-filter: blur(2px);"></div>
    <div class="bio-card bio-slide-in" style="position: relative; z-index: 1; background: #fdfaf3; padding: 32px 28px; max-width: 380px; width: 100%; text-align: center;">
      <div style="font-size: 36px; margin-bottom: 10px;">🔒</div>
      <div class="bio-display" style="font-size: 21px; font-weight: 700; margin-bottom: 10px; line-height: 1.25;">
        Before you peek…
      </div>
      <p style="font-size: 13.5px; opacity: 0.7; margin: 0 0 24px; line-height: 1.55;">
        When your group is done, please <strong>log out</strong> so the next group gets a fresh start!
      </p>
      <button onclick={acknowledgeAndShowCode} class="bio-btn" style="width: 100%;">
        Got it — show the code
      </button>
    </div>
  </div>
{/if}

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

  <!-- Title -->
  <div style="text-align: center; margin-bottom: 20px;">
    <h1 class="bio-display" style="font-size: clamp(30px, 7vw, 48px); font-weight: 800; margin: 0; line-height: 1;">
      Enzymes <span style="font-style: italic; color: #e84a3f;">&</span> Neurons
    </h1>
  </div>

  <!-- Group bar -->
  <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 24px; padding: 10px 14px; background: #fdfaf3; border: 1.5px solid #1a1a2e22; border-radius: 12px;">
    <div style="width: 32px; height: 32px; background: #1a1a2e; color: #f4ede1; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; font-family: 'DM Sans', sans-serif; flex-shrink: 0;">
      {initial}
    </div>
    <div style="flex: 1; min-width: 0;">
      <div style="font-size: 13px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{groupName}</div>
      <div style="font-size: 11px; opacity: 0.5;">{completedCount}/3 puzzles complete</div>
    </div>
    <button
      onclick={onLogout}
      style="display: flex; align-items: center; gap: 5px; padding: 6px 10px; background: none; border: 1.5px solid #1a1a2e22; border-radius: 8px; cursor: pointer; font-size: 11px; font-family: 'DM Sans', sans-serif; color: #1a1a2e; opacity: 0.55; transition: opacity 0.15s; flex-shrink: 0;"
    >
      <LogOut size={13} />
      Log out
    </button>
  </div>

  <!-- Game cards -->
  <div style="display: flex; flex-direction: column; gap: 10px;">
    {#each games as g}
      {@const Icon = g.icon}
      {@const done = completedGames[g.id]}
      <button
        onclick={() => onNav(g.id)}
        class="bio-card bio-card-hover bio-card-press"
        style="padding: 16px 18px; cursor: pointer; display: flex; gap: 14px; align-items: center; width: 100%; text-align: left; background: {done ? '#f0fdf4' : '#fdfaf3'}; color: inherit; border-color: {done ? '#16a34a44' : '#1a1a2e'}; box-shadow: {done ? '4px 4px 0 #16a34a44' : '4px 4px 0 #1a1a2e'};"
      >
        <div style="flex-shrink: 0; width: 42px; height: 42px; background: {done ? '#16a34a' : g.accent}; border-radius: 10px; display: flex; align-items: center; justify-content: center; border: 1.5px solid {done ? '#15803d' : '#1a1a2e'};">
          {#if done}
            <Check size={20} color="#fff" strokeWidth={2.5} />
          {:else}
            <Icon size={20} color="#fdfaf3" strokeWidth={2.2} />
          {/if}
        </div>
        <div style="flex: 1; min-width: 0;">
          <div style="display: flex; align-items: baseline; gap: 7px;">
            <span class="bio-display" style="font-size: 17px; font-weight: 600;">{g.title}</span>
            <span style="font-size: {g.time === '∞' ? '16px' : '11px'}; opacity: 0.45; line-height: 1;">· {g.time}</span>
          </div>
          <p style="font-size: 12.5px; margin: 2px 0 0; opacity: 0.65; line-height: 1.3;">{g.desc}</p>
        </div>
        {#if done}
          <span style="font-size: 11px; color: #16a34a; font-weight: 600; flex-shrink: 0;">Done ✓</span>
        {/if}
      </button>
    {/each}
  </div>

  <!-- Code reveal (all completed) -->
  {#if allCompleted}
    {#if showCode}
      <div class="bio-slide-in bio-card" style="margin-top: 24px; padding: 28px 24px; text-align: center; background: #1a1a2e; border-color: #1a1a2e; box-shadow: 5px 5px 0 #d4a437; color: #f4ede1;">
        <div style="font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; opacity: 0.6; margin-bottom: 10px;">Your Secret Code</div>
        <div class="bio-display" style="font-size: 56px; font-weight: 800; letter-spacing: 0.12em; color: #d4a437; line-height: 1;">{config.secret.code}</div>
        <div style="font-size: 12px; opacity: 0.55; margin-top: 10px;">{config.secret.message}</div>
        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #ffffff18; font-size: 12px; opacity: 0.5;">
          Remember to <strong style="opacity: 0.9;">log out</strong> when your group is done!
        </div>
      </div>
    {:else}
      <button
        onclick={requestCode}
        class="bio-card bio-card-hover"
        style="margin-top: 24px; width: 100%; padding: 20px; text-align: center; cursor: pointer; background: #fdfaf3; border-style: dashed; color: inherit;"
      >
        <div style="font-size: 22px; margin-bottom: 6px;">🎉</div>
        <div class="bio-display" style="font-size: 18px; font-weight: 700;">All puzzles complete!</div>
        <div style="font-size: 13px; opacity: 0.6; margin-top: 4px;">Tap to reveal your secret code →</div>
      </button>
    {/if}
  {:else}
    <div style="margin-top: 18px; padding: 12px 16px; background: #1a1a2e0a; border-radius: 10px; text-align: center; font-size: 12.5px; opacity: 0.6; line-height: 1.5;">
      Complete all three puzzles to unlock the secret code.
    </div>
  {/if}

  <!-- Footer actions -->
  <div style="margin-top: 20px; display: flex; justify-content: center; gap: 16px;">
    <button
      onclick={() => { clearStage = 'stage1'; }}
      style="background: none; border: none; cursor: pointer; font-size: 10px; opacity: 0.25; color: #1a1a2e; font-family: 'DM Sans', sans-serif; text-decoration: underline; padding: 2px 0;"
    >Clear all scores</button>
  </div>

</div>
</div>
