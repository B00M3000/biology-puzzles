<script>
  let { onLogin } = $props();

  let groupName = $state('');

  function start() {
    const name = groupName.trim();
    if (!name) return;
    onLogin(name);
  }
</script>

<div class="bio-slide-in" style="min-height: 100svh; display: flex; align-items: center; justify-content: center; padding: 24px 16px; position: relative; z-index: 1;">
<div style="width: 100%; max-width: 480px;">

  <div style="text-align: center; margin-bottom: 32px;">
    <div style="display: inline-block; padding: 4px 12px; background: #1a1a2e; color: #f4ede1; font-size: 11px; font-weight: 600; letter-spacing: 0.1em; border-radius: 999px; margin-bottom: 16px;">
      BIO 101 · STUDY HALL
    </div>
    <h1 class="bio-display" style="font-size: clamp(32px, 7vw, 52px); font-weight: 800; margin: 0; line-height: 1;">
      Enzymes <span style="font-style: italic; color: #e84a3f;">&amp;</span> Neurons
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
    <div style="font-size: 13px; font-weight: 600; margin-bottom: 8px;">Your group name</div>
    <div style="display: flex; gap: 10px;">
      <input
        bind:value={groupName}
        onkeydown={(e) => e.key === 'Enter' && start()}
        placeholder="e.g. Team Synapse"
        maxlength={30}
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
      This will appear on the leaderboard — use your group's names or a team name.
    </div>
  </div>

</div>
</div>
