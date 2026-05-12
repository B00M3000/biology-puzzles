<script>
  import { ArrowLeft } from 'lucide-svelte';

  let { title, onBack, right } = $props();
</script>

<div style="display: flex; align-items: center; justify-content: space-between; padding: 16px 16px 12px; max-width: 720px; margin: 0 auto; position: relative; z-index: 1;">
  <button onclick={onBack} class="bio-card bio-card-press" style="padding: 8px 12px; cursor: pointer; display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 500; background: #fdfaf3; box-shadow: 3px 3px 0 #1a1a2e; border: none;">
    <ArrowLeft size={16} /> Back
  </button>
  <h2 class="bio-display" style="font-size: 18px; font-weight: 600; margin: 0;">{title}</h2>
  <div style="min-width: 70px; text-align: right;">{@render right?.()}</div>
</div>
