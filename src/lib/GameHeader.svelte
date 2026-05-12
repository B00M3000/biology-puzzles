<script>
  import { ArrowLeft } from 'lucide-svelte';

  let { title, onBack, right } = $props();
</script>

<div style="display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 0 120px; padding: 16px 24px 12px; max-width: 720px; margin: 0 auto; position: relative; z-index: 1;">
  <button onclick={onBack} class="bio-card bio-card-press" style="padding: 8px 12px; cursor: pointer; display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 500; background: #fdfaf3; box-shadow: 3px 3px 0 #1a1a2e; border: none; justify-self: start;">
    <ArrowLeft size={16} /> Back
  </button>
  <h2 class="bio-display" style="font-size: 18px; font-weight: 600; margin: 0; text-align: center;">{title}</h2>
  <div style="text-align: right; justify-self: end;">{@render right?.()}</div>
</div>
