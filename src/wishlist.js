/* Species wishlist: pin a type, then compare every existing route to it.
   Routes are derived from the live egg, apex, world-gate, merge and event data
   so the wishlist stays additive and never invents a second price table. */

(function (root) {
  'use strict';

  const LIMIT = Math.max(1, Number(typeof WISHLIST_LIMIT !== 'undefined' ? WISHLIST_LIMIT : 12) || 12);
  const KIND_ORDER = { event: 0, gate: 1, type: 2, merge: 3, apex: 4, vault: 9 };
  const KIND_ICONS = { type: '🥚', apex: '✨', gate: '🌌', merge: '🧬', event: '🎉', vault: '🔐' };
  const RARITY_ORDER = typeof SUMMON_RARITY_ORDER !== 'undefined'
    ? SUMMON_RARITY_ORDER
    : (typeof RARITY_TIER_ORDER !== 'undefined' ? RARITY_TIER_ORDER : []);

  function readKeys() {
    if (typeof state === 'undefined' || !state) return [];
    const raw = Array.isArray(state.wishlist) ? state.wishlist : [];
    return Array.from(new Set(raw.filter((key) => typeof key === 'string' && ELEMENTS[key]))).slice(0, LIMIT);
  }

  function has(key) {
    return readKeys().includes(key);
  }

  function familyOf(key) {
    try {
      if (typeof puffleEvolutionLine === 'function') {
        const line = puffleEvolutionLine(key);
        if (line && line.family) return line.family;
      }
    } catch (err) { /* families are optional */ }
    try {
      if (typeof speciesFamilyFor === 'function') {
        const family = speciesFamilyFor(key);
        if (family && family.id) return family.id;
      }
    } catch (err) { /* families are optional */ }
    return null;
  }

  function rankOf(key) {
    const index = RARITY_ORDER.indexOf(String(key || ''));
    return index < 0 ? 0 : index;
  }

  function formatCost(value) {
    const cost = Number(value);
    if (!Number.isFinite(cost) || cost <= 0) return 'Free';
    return `${Math.round(cost).toLocaleString('en-US')} 🪙`;
  }

  function percent(value) {
    const chance = Number(value);
    if (!Number.isFinite(chance) || chance <= 0) return '0%';
    if (chance >= 0.999) return 'guaranteed';
    return `${Math.max(1, Math.round(chance * 100))}%`;
  }

  function typeEggSource(key) {
    if (typeof TYPE_EGG_SPECIES === 'undefined' || !TYPE_EGG_SPECIES.includes(key)) return null;
    const price = Number(TYPE_EGG_PRICE && TYPE_EGG_PRICE[key]);
    if (!Number.isFinite(price) || price < 0) return null;
    const tier = typeof TYPE_EGG_RARITIES !== 'undefined' ? TYPE_EGG_RARITIES[typeEggRarity(key)] : null;
    return {
      kind: 'type',
      icon: KIND_ICONS.type,
      label: 'Type egg',
      cost: price,
      chance: 1,
      detail: `${tier ? tier.name : 'Species'} egg · guaranteed`,
      action: { type: 'egg', key, rank: 'base' },
    };
  }

  function apexSource(key) {
    if (typeof TYPE_EGG_SPECIES === 'undefined' || !TYPE_EGG_SPECIES.includes(key)) return null;
    if (typeof TYPE_EGG_APEX_PREMIUM === 'undefined' || typeof typeEggApexPrice !== 'function') return null;
    let best = null;
    Object.keys(TYPE_EGG_APEX_PREMIUM).forEach((rank) => {
      if (typeof TYPE_EGG_RARITIES === 'undefined' || !TYPE_EGG_RARITIES[rank]) return;
      const cost = Number(typeEggApexPrice(key, rank));
      if (!Number.isFinite(cost)) return;
      if (!best || cost < best.cost) best = { rank, cost, tier: TYPE_EGG_RARITIES[rank] };
    });
    if (!best) return null;
    return {
      kind: 'apex',
      icon: KIND_ICONS.apex,
      label: `${best.tier.name} apex egg`,
      cost: best.cost,
      chance: 1,
      detail: `Guaranteed at ${best.tier.name} rank`,
      action: { type: 'egg', key, rank: best.rank },
    };
  }

  function gatePool(banner) {
    let roster = typeof TYPE_EGG_SPECIES !== 'undefined' && TYPE_EGG_SPECIES.length
      ? TYPE_EGG_SPECIES.slice()
      : (typeof ELEMENT_KEYS !== 'undefined' ? ELEMENT_KEYS.slice() : []);
    if (typeof puffleEvolutionLine === 'function' && Array.isArray(banner.families) && banner.families.length) {
      const familyRoster = roster.filter((key) => {
        const family = familyOf(key);
        return family && banner.families.includes(family);
      });
      if (familyRoster.length) roster = familyRoster;
    }
    if (Array.isArray(banner.elements) && banner.elements.length) {
      const themed = roster.filter((key) => banner.elements.includes(key) || banner.elements.includes(familyOf(key)));
      if (themed.length) roster = themed;
    }
    const minRank = rankOf(banner.min);
    return roster.filter((key) => ELEMENTS[key] && rankOf(typeEggRarity(key)) <= minRank);
  }

  function gateSources(key) {
    if (typeof SUMMON_BANNERS === 'undefined' || !Array.isArray(SUMMON_BANNERS)) return [];
    return SUMMON_BANNERS
      .filter((banner) => banner && banner.world)
      .map((banner) => {
        const pool = gatePool(banner);
        if (!pool.includes(key)) return null;
        const count = Math.max(1, Number(banner.count) || 1);
        const chance = 1 - Math.pow(1 - 1 / Math.max(1, pool.length), count);
        return {
          kind: 'gate',
          icon: banner.portal || KIND_ICONS.gate,
          label: `${banner.name} gate`,
          cost: Number(banner.price) || 0,
          chance,
          detail: `${count} eggs · ${percent(chance)} per gate`,
          action: { type: 'gate', key, banner: banner.key },
        };
      })
      .filter(Boolean);
  }

  function spriteLabel(sprite) {
    if (!sprite) return 'Sprite';
    return sprite.name || ELEMENTS[sprite.element]?.name || 'Sprite';
  }

  function mergeSource(key) {
    if (typeof state === 'undefined' || !state || !Array.isArray(state.sprites)) return null;
    const now = Date.now();
    const ready = state.sprites.filter((sprite) => sprite
      && sprite.stage !== 'egg'
      && !sprite.retired
      && Number(sprite.level) >= 3
      && Number(sprite.restUntil) <= now);
    const targetParents = ready
      .filter((sprite) => sprite.element === key)
      .sort((a, b) => (Number(a.gen) || 0) - (Number(b.gen) || 0));
    if (!targetParents.length) return null;

    let a = targetParents[0];
    let b = targetParents[1] || null;
    if (!b) {
      b = ready
        .filter((sprite) => sprite.id !== a.id)
        .sort((left, right) => (Number(left.gen) || 0) - (Number(right.gen) || 0))[0] || null;
    }
    if (!b) return null;

    const guaranteed = a.element === key && b.element === key;
    const waived = typeof firstFlightMergeWaived === 'function' && firstFlightMergeWaived();
    const baseCost = typeof mergeCost === 'function' ? Number(mergeCost(a, b)) : 0;
    const cost = waived ? 0 : (Number.isFinite(baseCost) ? baseCost : 0);
    return {
      kind: 'merge',
      icon: KIND_ICONS.merge,
      label: 'Merge',
      cost,
      chance: guaranteed ? 1 : 0.5,
      detail: `${spriteLabel(a)} + ${spriteLabel(b)} · ${guaranteed ? 'guaranteed' : '50%'} type${waived ? ' · First Flight free' : ''}`,
      action: { type: 'merge', key },
    };
  }

  function eventSources(key) {
    const out = [];
    const holiday = typeof activeHoliday === 'function' ? activeHoliday() : null;
    if (holiday && typeof holidayEggPool === 'function') {
      const claimed = typeof holidayGiftClaimed === 'function' && holidayGiftClaimed(holiday);
      const pool = holidayEggPool(holiday);
      if (!claimed && pool.includes(key)) {
        const chance = 1 / Math.max(1, pool.length);
        out.push({
          kind: 'event',
          icon: holiday.icon || KIND_ICONS.event,
          label: `${holiday.name} gift`,
          cost: 0,
          chance,
          detail: `Free holiday gift · ${percent(chance)} in pool`,
          action: { type: 'event', key, holiday: holiday.key },
        });
      }
    }
    if (typeof weekendAdminActive === 'function' && weekendAdminActive()) {
      const event = typeof weekendAdminEvent === 'function' ? weekendAdminEvent() : null;
      const claimed = typeof weekendAdminClaimed === 'function' && weekendAdminClaimed();
      if (event && event.egg === key && !claimed) {
        out.push({
          kind: 'event',
          icon: event.icon || KIND_ICONS.event,
          label: `${event.name || 'Weekend'} gift`,
          cost: 0,
          chance: 1,
          detail: 'Free weekend gift · guaranteed',
          action: { type: 'event', key, event: event.key },
        });
      }
    }
    return out;
  }

  function sourcesFor(key) {
    if (!key || !ELEMENTS[key]) return [];
    const sources = [];
    const type = typeEggSource(key);
    if (type) sources.push(type);
    const apex = apexSource(key);
    if (apex) sources.push(apex);
    sources.push(...gateSources(key));
    const merge = mergeSource(key);
    if (merge) sources.push(merge);
    sources.push(...eventSources(key));
    return sources.sort((a, b) => {
      const byCost = Number(a.cost) - Number(b.cost);
      if (byCost) return byCost;
      const byChance = (Number(b.chance) || 0) - (Number(a.chance) || 0);
      if (byChance) return byChance;
      return (KIND_ORDER[a.kind] ?? 9) - (KIND_ORDER[b.kind] ?? 9);
    });
  }

  function bestFor(key) {
    return sourcesFor(key)[0] || null;
  }

  function toggle(key) {
    if (!ELEMENTS[key]) return { ok: false, reason: 'unknown' };
    if (typeof state === 'undefined' || !state) return { ok: false, reason: 'state' };
    const current = readKeys();
    const pinned = current.includes(key);
    let next;
    if (pinned) {
      next = current.filter((value) => value !== key);
    } else {
      if (current.length >= LIMIT) return { ok: false, reason: 'limit', limit: LIMIT };
      next = [...current, key];
    }
    state.wishlist = next;
    if (typeof commit === 'function') commit('wishlist', { key, pinned: !pinned, keys: next });
    else if (typeof saveState === 'function') saveState();
    return { ok: true, pinned: !pinned, count: next.length, limit: LIMIT };
  }

  function reflect(key) {
    const on = has(key);
    document.querySelectorAll('[data-wishlist-toggle]').forEach((button) => {
      if (button.dataset.wishlistToggle !== key) return;
      button.classList.toggle('is-on', on);
      button.classList.toggle('btn-gold', on);
      button.classList.toggle('btn-soft', !on);
      button.setAttribute('aria-pressed', on ? 'true' : 'false');
      button.textContent = button.dataset.wishlistShort === '1'
        ? (on ? '★ Wishlisted' : '☆ Wishlist')
        : (on ? '★ On wishlist' : '☆ Add to wishlist');
    });
  }

  function toggleWithUI(key) {
    const result = toggle(key);
    if (!result.ok) {
      if (typeof toast === 'function') {
        toast(result.reason === 'limit'
          ? `Wishlist is full (${result.limit}) — unpin one first.`
          : 'That type could not be pinned.', '⭐');
      }
      if (typeof Sfx !== 'undefined' && Sfx.error) Sfx.error();
      return result;
    }
    const name = ELEMENTS[key]?.name || key;
    if (typeof toast === 'function') {
      toast(result.pinned ? `${name} added to your wishlist.` : `${name} removed from your wishlist.`, result.pinned ? '⭐' : '☆');
    }
    if (typeof Sfx !== 'undefined' && Sfx.click) Sfx.click();
    reflect(key);
    return result;
  }

  function pinButtonHTML(key, options = {}) {
    const on = has(key);
    const short = options.short === true;
    return `<button class="btn ${on ? 'btn-gold' : 'btn-soft'}${options.block ? ' btn-block' : ''} wishlist-toggle${on ? ' is-on' : ''}" type="button" data-wishlist-toggle="${key}" data-wishlist-short="${short ? '1' : '0'}" aria-pressed="${on}">${on ? (short ? '★ Wishlisted' : '★ On wishlist') : (short ? '☆ Wishlist' : '☆ Add to wishlist')}</button>`;
  }

  function rowHTML(key) {
    const meta = ELEMENTS[key];
    if (!meta) return '';
    const sources = sourcesFor(key);
    const best = sources[0] || null;
    const color = meta.primary || BRAND.accent;
    const routeTitle = sources.length
      ? sources.map((source) => `${source.label}: ${formatCost(source.cost)}`).join(' · ')
      : 'No standard route';
    const more = sources.length > 1 ? ` · +${sources.length - 1} more` : '';
    const route = best ? best.label : (typeof isSecretSpecies === 'function' && isSecretSpecies(key) ? 'Secret Vault only' : 'No standard route');
    const detail = best
      ? `${best.detail}${more}`
      : 'Check the Secret Vault or a live event.';
    return `<div class="wishlist-row" data-wishlist-row="${key}">
      <span class="wishlist-art" style="--wl:${color}" aria-hidden="true">${esc(String(meta.name || key).slice(0, 1))}</span>
      <button class="wishlist-main" type="button" data-wishlist-go="${key}" title="${esc(routeTitle)}">
        <span class="wishlist-name">${esc(meta.name || key)}</span>
        <span class="wishlist-best"><span class="wishlist-best-icon" aria-hidden="true">${best ? best.icon : KIND_ICONS.vault}</span><b>${esc(route)}</b><span class="wishlist-cost">${best ? formatCost(best.cost) : '—'}</span></span>
        <span class="wishlist-detail">${esc(detail)}</span>
      </button>
      <button class="wishlist-remove" type="button" data-wishlist-remove="${key}" aria-label="Unpin ${esc(meta.name || key)}" title="Unpin">✕</button>
    </div>`;
  }

  function panelHTML(options = {}) {
    const keys = readKeys();
    if (!keys.length && options.empty === false) return '';
    const rows = keys.map(rowHTML).filter(Boolean).join('');
    return `<section class="wishlist-panel" aria-label="Species wishlist">
      <div class="wishlist-head">
        <div><div class="eyebrow">⭐ Wishlist</div><h2>Cheapest routes</h2></div>
        <span class="chip">${keys.length}/${LIMIT} pinned</span>
      </div>
      <p class="wishlist-sub">Pin any type from the Codex or Collection. Prices come from the live egg, gate, merge and event data.</p>
      ${rows
        ? `<div class="wishlist-list">${rows}</div>`
        : '<p class="wishlist-empty">No types pinned yet. Open a type in the Codex or a sprite in the Collection and tap <b>☆ Add to wishlist</b>.</p>'}
    </section>`;
  }

  function focusGate(bannerKey) {
    const findCard = () => Array.from(document.querySelectorAll('[data-summon-quick]'))
      .find((element) => element.dataset.summonQuick === bannerKey);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const card = findCard();
      if (!card) return;
      card.scrollIntoView({ block: 'center', behavior: 'smooth' });
      card.classList.add('wishlist-focus');
      setTimeout(() => card.classList.remove('wishlist-focus'), 1800);
    }));
  }

  function openSource(source) {
    if (!source) return;
    const action = source.action || {};
    if (action.type === 'egg') {
      if (typeof openApexTypeEgg === 'function') {
        openApexTypeEgg(action.key, action.rank || 'base');
        return;
      }
      if (typeof App !== 'undefined') App.go('nest');
      return;
    }
    if (action.type === 'gate') {
      if (typeof App !== 'undefined') App.go('summon');
      focusGate(action.banner);
      return;
    }
    if (action.type === 'merge') {
      if (typeof openBreedingCodex === 'function') {
        openBreedingCodex(action.key);
        return;
      }
      if (typeof App !== 'undefined') App.go('nest');
      return;
    }
    if (action.type === 'event') {
      if (typeof App !== 'undefined') App.go('today');
      if (typeof toast === 'function') toast('Open today’s gift or event to claim this route.', '🎉');
      return;
    }
    if (action.type === 'vault' && typeof openSecretVault === 'function') openSecretVault();
  }

  function mount(container, options = {}) {
    if (!container) return () => {};
    const paint = () => {
      if (!container.isConnected) return;
      container.innerHTML = panelHTML(options);
    };
    paint();
    const unsub = typeof subscribeState === 'function' ? subscribeState(paint) : () => {};
    const onClick = (event) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;
      const remove = target.closest('[data-wishlist-remove]');
      if (remove) {
        event.preventDefault();
        toggleWithUI(remove.dataset.wishlistRemove);
        return;
      }
      const go = target.closest('[data-wishlist-go]');
      if (!go) return;
      event.preventDefault();
      const key = go.dataset.wishlistGo;
      const best = bestFor(key);
      if (best) {
        openSource(best);
        return;
      }
      if (typeof isSecretSpecies === 'function' && isSecretSpecies(key) && typeof openSecretVault === 'function') {
        openSecretVault();
        return;
      }
      if (typeof openTypeDetail === 'function') openTypeDetail(key);
    };
    container.addEventListener('click', onClick);
    return () => {
      unsub();
      container.removeEventListener('click', onClick);
    };
  }

  root.Wishlist = {
    limit: LIMIT,
    keys: readKeys,
    has,
    toggle,
    toggleWithUI,
    sourcesFor,
    bestFor,
    formatCost,
    pinButtonHTML,
    panelHTML,
    mount,
    openSource,
    reflect,
  };
})(window);
