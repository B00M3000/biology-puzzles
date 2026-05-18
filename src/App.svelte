<script>
  import { onMount } from 'svelte';
  import LoginScreen from './lib/LoginScreen.svelte';
  import Hub from './lib/Hub.svelte';
  import ConnectionsGame from './lib/ConnectionsGame.svelte';
  import OrderingGame from './lib/OrderingGame.svelte';

  let view = $state('hub');
  let groupName = $state(null);
  let completedGames = $state({ connections: false, ordering: false });
  let scores = $state({ connections: [], ordering: [] });

  const KEYS = ['connections', 'ordering'];

  const loadScores = () => {
    const out = { connections: [], ordering: [] };
    for (const key of KEYS) {
      try {
        const val = localStorage.getItem(`leaderboard:${key}`);
        if (val) out[key] = JSON.parse(val);
      } catch (e) { /* ignore */ }
    }
    scores = out;
  };

  const loadSession = () => {
    groupName = localStorage.getItem('group:name') || null;
    completedGames = {
      connections: localStorage.getItem('completed:connections') === 'true',
      ordering:    localStorage.getItem('completed:ordering')    === 'true',
    };
  };

  const login = (name) => {
    groupName = name;
    view = 'hub';
    localStorage.setItem('group:name', name);
  };

  const logout = () => {
    const prev = groupName;
    groupName = null;
    view = 'hub';
    localStorage.removeItem('group:name');
    completedGames = { connections: false, ordering: false };
    for (const key of KEYS) {
      localStorage.removeItem(`completed:${key}`);
    }
    if (prev) {
      localStorage.removeItem(`gamestate:connections:${prev}`);
      localStorage.removeItem(`gamestate:ordering:${prev}`);
    }
  };

  const markComplete = (gameKey) => {
    if (completedGames[gameKey]) return;
    completedGames = { ...completedGames, [gameKey]: true };
    localStorage.setItem(`completed:${gameKey}`, 'true');
  };

  const recordScore = (gameKey, name, score) => {
    const existing = scores[gameKey] || [];
    // Connections and ordering only record the first completion per group
    if (gameKey === 'connections' || gameKey === 'ordering') {
      if (existing.some(e => e.name === name)) return;
    }
    const updated = [...existing, { name, score, date: Date.now() }]
      .sort((a, b) => a.score - b.score)
      .slice(0, 20);
    try {
      localStorage.setItem(`leaderboard:${gameKey}`, JSON.stringify(updated));
      scores = { ...scores, [gameKey]: updated };
    } catch (e) {
      console.error('Could not save score', e);
    }
  };

  const clearScores = () => {
    for (const key of KEYS) {
      localStorage.removeItem(`leaderboard:${key}`);
    }
    scores = { connections: [], ordering: [] };
  };

  onMount(() => {
    loadSession();
    loadScores();
  });
</script>

<div class="bio-app bio-bg">
  <div class="bio-grain"></div>

  {#if !groupName}
    <LoginScreen onLogin={login} onClear={clearScores} />
  {:else if view === 'hub'}
    <Hub
      onNav={(id) => { view = id; }}
      {scores}
      {completedGames}
      {groupName}
      onLogout={logout}
      onClear={clearScores}
    />
  {:else if view === 'connections'}
    <ConnectionsGame
      onBack={() => { view = 'hub'; loadScores(); }}
      onScore={recordScore}
      onComplete={markComplete}
      scores={scores.connections}
      {groupName}
    />
  {:else if view === 'ordering'}
    <OrderingGame
      onBack={() => { view = 'hub'; loadScores(); }}
      onScore={recordScore}
      onComplete={markComplete}
      scores={scores.ordering}
      {groupName}
    />
  {/if}
</div>
