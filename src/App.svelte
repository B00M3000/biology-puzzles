<script>
  import { onMount } from 'svelte';
  import LoginScreen from './lib/LoginScreen.svelte';
  import Hub from './lib/Hub.svelte';
  import BinSortGame from './lib/BinSortGame.svelte';
  import ConnectionsGame from './lib/ConnectionsGame.svelte';
  import OrderingGame from './lib/OrderingGame.svelte';

  let view = $state('hub');
  let groupName = $state(null);
  let completedGames = $state({ binsort: false, connections: false, ordering: false });
  let scores = $state({ binsort: [], connections: [], ordering: [] });

  const KEYS = ['binsort', 'connections', 'ordering'];

  const loadScores = () => {
    const out = { binsort: [], connections: [], ordering: [] };
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
      binsort:     localStorage.getItem('completed:binsort')     === 'true',
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
    groupName = null;
    view = 'hub';
    localStorage.removeItem('group:name');
    completedGames = { binsort: false, connections: false, ordering: false };
    for (const key of KEYS) {
      localStorage.removeItem(`completed:${key}`);
    }
  };

  const markComplete = (gameKey) => {
    if (completedGames[gameKey]) return;
    completedGames = { ...completedGames, [gameKey]: true };
    localStorage.setItem(`completed:${gameKey}`, 'true');
  };

  const recordScore = (gameKey, name, score) => {
    const existing = scores[gameKey] || [];
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
    scores = { binsort: [], connections: [], ordering: [] };
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
  {:else if view === 'binsort'}
    <BinSortGame
      onBack={() => { view = 'hub'; loadScores(); }}
      onScore={recordScore}
      onComplete={markComplete}
      scores={scores.binsort}
      {groupName}
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
