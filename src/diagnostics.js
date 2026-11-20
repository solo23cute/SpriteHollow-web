/* Local-only support diagnostics.

   Nothing here is telemetry: errors are kept in a small in-memory ring and the
   player explicitly chooses to download or copy the report. The report carries
   version/device/save-health summaries and recent errors, but never the save
   payload, sprite names, account details, or network identifiers. */

(function (root) {
  'use strict';

  const MAX_ERRORS = 40;
  const MAX_MESSAGE = 1600;
  const MAX_STACK = 3000;

  const errors = [];
  let installed = false;

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (err) {
      return '';
    }
  }

  function clip(value, limit) {
    const text = String(value == null ? '' : value);
    return text.length > limit ? `${text.slice(0, limit)}…` : text;
  }

  function safeString(value) {
    if (value instanceof Error) {
      return `${value.name || 'Error'}: ${value.message || ''}${value.stack ? `\n${value.stack}` : ''}`;
    }
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'string') return value;
    if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') return String(value);
    try {
      const json = JSON.stringify(value);
      return json === undefined ? String(value) : json;
    } catch (err) {
      try {
        return String(value);
      } catch (inner) {
        return '[unserializable]';
      }
    }
  }

  function currentScreen() {
    try {
      return typeof App !== 'undefined' && App && App.tab ? String(App.tab) : '';
    } catch (err) {
      return '';
    }
  }

  function record(kind, message, extra) {
    try {
      const entry = Object.assign({
        at: nowIso(),
        kind: String(kind || 'error'),
        screen: currentScreen(),
      }, extra || {});
      entry.message = clip(message || '(no message)', MAX_MESSAGE);
      if (entry.stack) entry.stack = clip(entry.stack, MAX_STACK);
      else delete entry.stack;
      errors.push(entry);
      if (errors.length > MAX_ERRORS) errors.splice(0, errors.length - MAX_ERRORS);
    } catch (err) {
      /* Diagnostics must never break the game while it is recording a fault. */
    }
  }

  function installCapture() {
    if (installed) return;
    installed = true;

    try {
      const consoleObject = root.console;
      if (consoleObject && typeof consoleObject.error === 'function') {
        const originalError = consoleObject.error.bind(consoleObject);
        consoleObject.error = function (...args) {
          record('console.error', args.map(safeString).join(' '));
          return originalError(...args);
        };
      }
    } catch (err) {
      /* A locked console only costs us console.error capture. */
    }

    try {
      root.addEventListener('error', (event) => {
        const error = event && event.error;
        record(
          'uncaught-error',
          (event && event.message) || (error && error.message) || 'Unknown error',
          {
            source: event && event.filename ? String(event.filename) : '',
            line: event && Number.isFinite(event.lineno) ? event.lineno : null,
            column: event && Number.isFinite(event.colno) ? event.colno : null,
            stack: error && error.stack ? String(error.stack) : '',
          },
        );
      });
    } catch (err) {
      /* Old browsers without error events still get console.error capture. */
    }

    try {
      root.addEventListener('unhandledrejection', (event) => {
        const reason = event && event.reason;
        record(
          'unhandled-rejection',
          reason && reason.message ? reason.message : safeString(reason),
          { stack: reason && reason.stack ? String(reason.stack) : '' },
        );
      });
    } catch (err) {
      /* Optional: the report still works when rejection events are absent. */
    }
  }

  function screenInfo() {
    const nav = root.navigator || {};
    const screenObj = root.screen || {};
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection || null;
    const matches = (query) => {
      try {
        return root.matchMedia ? !!root.matchMedia(query).matches : null;
      } catch (err) {
        return null;
      }
    };
    const heap = root.performance && root.performance.memory
      ? {
        usedJSHeapSize: Number(root.performance.memory.usedJSHeapSize) || 0,
        totalJSHeapSize: Number(root.performance.memory.totalJSHeapSize) || 0,
        jsHeapSizeLimit: Number(root.performance.memory.jsHeapSizeLimit) || 0,
      }
      : null;
    let timeZone = '';
    try {
      timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    } catch (err) {
      timeZone = '';
    }
    return {
      userAgent: String(nav.userAgent || ''),
      platform: String(nav.platform || ''),
      language: String(nav.language || ''),
      languages: Array.isArray(nav.languages) ? nav.languages.slice(0, 8).map(String) : [],
      online: typeof nav.onLine === 'boolean' ? nav.onLine : null,
      viewport: `${Math.round(Number(root.innerWidth) || 0)}x${Math.round(Number(root.innerHeight) || 0)}`,
      screen: `${Math.round(Number(screenObj.width) || 0)}x${Math.round(Number(screenObj.height) || 0)}`,
      availableScreen: `${Math.round(Number(screenObj.availWidth) || 0)}x${Math.round(Number(screenObj.availHeight) || 0)}`,
      pixelRatio: Number(root.devicePixelRatio) || 1,
      colorDepth: Number(screenObj.colorDepth) || null,
      touchPoints: Number(nav.maxTouchPoints) || 0,
      hardwareConcurrency: Number(nav.hardwareConcurrency) || null,
      deviceMemory: Number(nav.deviceMemory) || null,
      standalone: matches('(display-mode: standalone)') === true || nav.standalone === true,
      reducedMotion: matches('(prefers-reduced-motion: reduce)'),
      timeZone,
      visibility: root.document ? String(root.document.visibilityState || '') : '',
      connection: connection
        ? {
          effectiveType: String(connection.effectiveType || ''),
          downlink: Number(connection.downlink) || null,
          rtt: Number(connection.rtt) || null,
          saveData: !!connection.saveData,
        }
        : null,
      jsHeap: heap,
    };
  }

  function appInfo() {
    let language = '';
    try {
      language = root.document && root.document.documentElement
        ? String(root.document.documentElement.lang || '')
        : '';
    } catch (err) {
      language = '';
    }
    let page = '';
    try {
      page = String(root.location.pathname || '');
    } catch (err) {
      page = '';
    }
    return {
      version: typeof APP_VERSION !== 'undefined' ? String(APP_VERSION) : 'unknown',
      saveSchemaVersion: typeof SaveSchema !== 'undefined' ? SaveSchema.VERSION : null,
      saveIntegrityVersion: typeof SaveIntegrity !== 'undefined' ? SaveIntegrity.VERSION : null,
      screen: currentScreen(),
      page,
      language,
    };
  }

  function sanitizeSaveInfo(info) {
    if (!info || typeof info !== 'object') return null;
    return {
      ok: !!info.ok,
      status: String(info.status || ''),
      bytes: Number(info.bytes) || 0,
      sprites: Number(info.sprites) || 0,
      eggs: Number(info.eggs) || 0,
      coins: Number(info.coins) || 0,
      savedAt: Number(info.savedAt) || 0,
      version: info.version == null ? null : info.version,
      warnings: Array.isArray(info.warnings) ? info.warnings.slice(0, 8).map((warning) => clip(warning, 240)) : [],
      message: info.message ? clip(info.message, 500) : '',
    };
  }

  function sanitizeSaveEntry(entry) {
    if (!entry || typeof entry !== 'object') return null;
    return {
      at: Number(entry.at) || 0,
      bytes: Number(entry.bytes) || 0,
      ok: !!entry.ok,
      status: String(entry.status || ''),
      sprites: Number(entry.sprites) || 0,
      eggs: Number(entry.eggs) || 0,
      coins: Number(entry.coins) || 0,
      version: entry.version == null ? null : entry.version,
      label: entry.label ? clip(entry.label, 100) : '',
      reason: entry.reason ? clip(entry.reason, 100) : '',
    };
  }

  function sanitizeLastLoad(last) {
    if (!last || typeof last !== 'object') return null;
    return {
      at: Number(last.at) || 0,
      status: String(last.status || ''),
      message: last.message ? clip(last.message, 500) : '',
      warnings: Array.isArray(last.warnings) ? last.warnings.slice(0, 8).map((warning) => clip(warning, 240)) : [],
    };
  }

  function saveHealth() {
    let storage = null;
    try {
      storage = root.localStorage || null;
    } catch (err) {
      storage = null;
    }
    if (typeof SaveIntegrity === 'undefined' || !SaveIntegrity) {
      return { available: false, reason: 'save-integrity-unavailable' };
    }
    let health = null;
    try {
      health = SaveIntegrity.health(storage);
    } catch (err) {
      return { available: false, reason: 'save-health-unreadable' };
    }
    let raw = null;
    try {
      raw = storage && SaveIntegrity.SAVE_KEY ? storage.getItem(SaveIntegrity.SAVE_KEY) : null;
    } catch (err) {
      raw = null;
    }
    let live = null;
    try {
      live = raw ? sanitizeSaveInfo(SaveIntegrity.describe(raw)) : null;
    } catch (err) {
      live = null;
    }
    return {
      available: true,
      storageAvailable: !!storage,
      integrityVersion: SaveIntegrity.VERSION,
      saveSchemaVersion: typeof SaveSchema !== 'undefined' ? SaveSchema.VERSION : null,
      live,
      bytes: Number(health && health.saveBytes) || 0,
      totalHollowBytes: Number(health && health.bytes) || 0,
      lastLoad: sanitizeLastLoad(health && health.lastLoad),
      backups: (health && Array.isArray(health.backups) ? health.backups : []).map(sanitizeSaveEntry).filter(Boolean),
      restorePoints: (health && Array.isArray(health.restorePoints) ? health.restorePoints : []).map(sanitizeSaveEntry).filter(Boolean),
      quarantine: (health && Array.isArray(health.quarantine) ? health.quarantine : []).map(sanitizeSaveEntry).filter(Boolean),
      recoverable: !!(health && health.recoverable),
    };
  }

  function buildReport() {
    return {
      format: 'sprite-hollow-diagnostics',
      formatVersion: 1,
      generatedAt: nowIso(),
      app: appInfo(),
      device: screenInfo(),
      save: saveHealth(),
      errors: errors.map((entry) => Object.assign({}, entry)),
    };
  }

  function formatWhen(value) {
    const at = Number(value) || 0;
    if (!at) return 'unknown';
    try {
      return new Date(at).toISOString();
    } catch (err) {
      return String(at);
    }
  }

  function formatReport(report) {
    const data = report || buildReport();
    const app = data.app || {};
    const device = data.device || {};
    const save = data.save || {};
    const recent = Array.isArray(data.errors) ? data.errors : [];
    const lines = [];
    const add = (label, value) => {
      if (value !== undefined && value !== null && value !== '') lines.push(`${label}: ${value}`);
    };

    lines.push('Sprite Hollow diagnostics');
    add('Generated', data.generatedAt);
    add('Format', `${data.format || 'sprite-hollow-diagnostics'} v${data.formatVersion || 1}`);

    lines.push('', '--- APP ---');
    add('App version', app.version);
    add('Save schema', app.saveSchemaVersion);
    add('Save integrity', app.saveIntegrityVersion);
    add('Current screen', app.screen);
    add('Page', app.page);
    add('Language', app.language);

    lines.push('', '--- DEVICE ---');
    add('User agent', device.userAgent);
    add('Platform', device.platform);
    add('Language', device.language);
    add('Languages', Array.isArray(device.languages) ? device.languages.join(', ') : '');
    add('Online', device.online);
    add('Viewport', device.viewport);
    add('Screen', device.screen);
    add('Available screen', device.availableScreen);
    add('Pixel ratio', device.pixelRatio);
    add('Colour depth', device.colorDepth);
    add('Touch points', device.touchPoints);
    add('Hardware concurrency', device.hardwareConcurrency);
    add('Device memory (GB)', device.deviceMemory);
    add('Standalone display', device.standalone);
    add('Reduced motion', device.reducedMotion);
    add('Time zone', device.timeZone);
    add('Visibility', device.visibility);
    if (device.connection) add('Connection', JSON.stringify(device.connection));
    if (device.jsHeap) add('JS heap', JSON.stringify(device.jsHeap));

    lines.push('', '--- SAVE HEALTH ---');
    if (!save.available) {
      add('Status', `unavailable (${save.reason || 'unknown'})`);
    } else {
      add('Storage available', save.storageAvailable);
      add('Live save', save.live ? (save.live.ok ? 'readable' : `unreadable (${save.live.status || 'unknown'})`) : 'missing');
      add('Live save characters', save.bytes);
      add('Hollow storage characters', save.totalHollowBytes);
      if (save.live) {
        add('Live sprites', save.live.sprites);
        add('Live eggs', save.live.eggs);
        add('Live coins', save.live.coins);
        add('Live save version', save.live.version);
        add('Live saved at', formatWhen(save.live.savedAt));
        if (save.live.warnings.length) add('Live warnings', save.live.warnings.join(' | '));
        if (save.live.message) add('Live status detail', save.live.message);
      }
      add('Last load', save.lastLoad
        ? `${save.lastLoad.status || 'unknown'} at ${formatWhen(save.lastLoad.at)}${save.lastLoad.message ? ` — ${save.lastLoad.message}` : ''}`
        : 'none');
      if (save.lastLoad && save.lastLoad.warnings.length) add('Last load warnings', save.lastLoad.warnings.join(' | '));
      add('Recoverable copy', save.recoverable);
      lines.push(`Backups: ${save.backups.length}`);
      save.backups.forEach((entry) => {
        lines.push(`  - ${formatWhen(entry.at)} · ${entry.ok ? 'readable' : 'unreadable'} · ${entry.bytes} chars · ${entry.sprites} sprites · ${entry.eggs} eggs${entry.reason ? ` · ${entry.reason}` : ''}`);
      });
      lines.push(`Restore points: ${save.restorePoints.length}`);
      save.restorePoints.forEach((entry) => {
        lines.push(`  - ${formatWhen(entry.at)} · ${entry.ok ? 'readable' : 'unreadable'} · ${entry.bytes} chars · ${entry.sprites} sprites · ${entry.eggs} eggs${entry.label ? ` · ${entry.label}` : ''}`);
      });
      lines.push(`Quarantined: ${save.quarantine.length}`);
      save.quarantine.forEach((entry) => {
        lines.push(`  - ${formatWhen(entry.at)} · ${entry.bytes} chars${entry.reason ? ` · ${entry.reason}` : ''}`);
      });
    }

    lines.push('', `--- RECENT ERRORS (${recent.length}) ---`);
    if (!recent.length) {
      lines.push('None recorded in this tab.');
    } else {
      recent.forEach((entry, index) => {
        lines.push(`[${index + 1}] ${entry.at || 'unknown time'} · ${entry.kind || 'error'}${entry.screen ? ` · screen=${entry.screen}` : ''}`);
        if (entry.message) lines.push(entry.message);
        if (entry.source) {
          const location = [entry.source, entry.line, entry.column].filter((part) => part !== null && part !== undefined && part !== '').join(':');
          lines.push(`Source: ${location}`);
        }
        if (entry.stack) lines.push(entry.stack);
        lines.push('');
      });
    }

    lines.push('--- MACHINE-READABLE JSON ---');
    lines.push(JSON.stringify(data, null, 2));
    return lines.join('\n');
  }

  function filename() {
    let stamp = 'unknown-date';
    try {
      stamp = new Date().toISOString().slice(0, 10);
    } catch (err) { /* keep the fallback */ }
    return `sprite-hollow-diagnostics-${stamp}.txt`;
  }

  function offerText(text) {
    try {
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = root.document.createElement('a');
      link.href = url;
      link.download = filename();
      link.rel = 'noopener';
      root.document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      return true;
    } catch (err) {
      try {
        if (root.console && typeof root.console.warn === 'function') {
          root.console.warn('Could not offer the diagnostics file.', err);
        }
      } catch (inner) { /* diagnostics must not throw while reporting */ }
      return false;
    }
  }

  function download(report) {
    return offerText(formatReport(report || buildReport()));
  }

  async function copy(report) {
    const text = formatReport(report || buildReport());
    if (typeof copyToClipboard === 'function') {
      try {
        if (await copyToClipboard(text)) return true;
      } catch (err) {
        /* Fall through to the selection copy below. */
      }
    }
    let field = null;
    try {
      field = root.document.createElement('textarea');
      field.value = text;
      field.setAttribute('readonly', '');
      field.style.position = 'fixed';
      field.style.left = '-10000px';
      field.style.top = '0';
      root.document.body.appendChild(field);
      field.select();
      return !!root.document.execCommand('copy');
    } catch (err) {
      return false;
    } finally {
      try { if (field) field.remove(); } catch (err) { /* detached already */ }
    }
  }

  function openDiagnosticsSheet() {
    if (typeof openSheet !== 'function') return null;
    const report = buildReport();
    const save = report.save || {};
    const live = save.live || null;
    const status = !save.available ? 'Unavailable' : (live ? (live.ok ? 'Readable' : 'Needs attention') : 'No live save');
    const copies = (save.backups ? save.backups.length : 0) + (save.restorePoints ? save.restorePoints.length : 0);
    const version = report.app && report.app.version ? report.app.version : 'unknown';
    const sheet = openSheet({
      key: 'support-diagnostics',
      title: '🧰 Support diagnostics',
      sub: 'A local snapshot you choose to share. Nothing is uploaded automatically.',
      body: `
        <div class="card" style="padding:12px">
          <div class="between"><b>What the file contains</b><span class="chip">v${version}</span></div>
          <p class="tiny muted" style="margin:6px 0 0;line-height:1.5">App and save versions, browser and device details, save health, and the last ${MAX_ERRORS} errors from this tab.</p>
        </div>
        <div class="health-stats">
          <div><b>${report.errors.length}</b><span>recent errors</span></div>
          <div><b>${copies}</b><span>save copies</span></div>
          <div><b>${status}</b><span>live save</span></div>
        </div>
        <div class="row" style="gap:6px;flex-wrap:wrap;margin-top:10px">
          <button class="btn btn-primary btn-sm" type="button" data-diag-download>Download diagnostics file</button>
          <button class="btn btn-soft btn-sm" type="button" data-diag-copy>Copy report</button>
        </div>
        <p class="tiny muted" style="margin:9px 2px 0;line-height:1.5">No telemetry is sent, and nothing is sent automatically. You choose who receives the file. It does not include your save code, sprite names, account details, or network identifiers.</p>
        <p class="tiny muted" style="margin:6px 2px 0;line-height:1.5">Errors are kept in memory only while this tab is open; closing or reloading clears them and starts a fresh list.</p>`,
      onMount: (rootElement) => {
        rootElement.querySelector('[data-diag-download]')?.addEventListener('click', () => {
          const ok = download(report);
          if (typeof toast === 'function') toast(ok ? 'Diagnostics file downloaded.' : 'This device could not save the file. Try Copy report.', ok ? '🧰' : '⚠️');
        });
        rootElement.querySelector('[data-diag-copy]')?.addEventListener('click', async () => {
          const ok = await copy(report);
          if (typeof toast === 'function') toast(ok ? 'Diagnostics report copied.' : 'Could not copy the report.', ok ? '📋' : '⚠️');
        });
      },
    });
    return sheet;
  }

  installCapture();

  root.Diagnostics = Object.freeze({
    VERSION: 1,
    MAX_ERRORS,
    recent: () => errors.map((entry) => Object.assign({}, entry)),
    buildReport,
    formatReport,
    download,
    copy,
  });
  root.openDiagnosticsSheet = openDiagnosticsSheet;
})(typeof globalThis !== 'undefined' ? globalThis : window);
