/* Language support for the Studio settings and the induction tour.
   English, Spanish, and French cover the app chrome, settings, and all tour steps. */

const I18N_LANGUAGES = {
  en: { label: 'English', native: 'English', tag: 'en-US' },
  es: { label: 'Español', native: 'Español', tag: 'es-ES' },
  fr: { label: 'Français', native: 'Français', tag: 'fr-FR' },
};
const I18N_LANGUAGE_ORDER = ['en', 'es', 'fr'];

const I18N = {
  en: {
    'tab.hollow': 'Home', 'tab.collection': 'Sprites', 'tab.codex': 'Types', 'tab.nest': 'Nest',
    'tab.play': 'Play', 'tab.today': 'Today', 'tab.settings': 'Settings',
    'settings.language': 'Language', 'settings.languageNote': 'Applies to the app navigation, settings, captions, and the induction tour.',
    'settings.captions': 'Closed captions (CC)', 'settings.captionsNote': 'Shows sound descriptions and spoken lines on screen for the hearing impaired.',
    'tour.title': '🧭 Hollow tutorial', 'tour.sub': 'the induction tour, covering every system.',
    'tour.subReplay': 'Every system in chapters. Voice and read-along included.',
    'tour.read': '🔊 Read aloud', 'tour.stop': '⏹ Stop reading', 'tour.voiceOff': 'Voice is off in Studio. Tap Read aloud to hear this tour.',
    'tour.voiceUnavailable': 'Voice is unavailable on this device.', 'tour.reading': 'Reading aloud — follow the yellow highlight.',
    'tour.tap': 'Tap to hear this step and follow along.', 'tour.skip': 'Skip tour', 'tour.close': 'Close',
    'tour.next': 'Next', 'tour.back': 'Back', 'tour.start': 'Start exploring', 'tour.startTutorial': 'Start the tutorial', 'tour.firstSecret': 'First secret: complete the tour.',
    'tour.replay': 'Replay induction tour', 'tour.resume': 'Resume induction tour', 'tour.restart': 'Start from the beginning',
    'tour.paused': 'Tour paused at step {step} of {total}. Resume it from Studio.',
    'tour.handbook': 'Tutorial handbook', 'tour.handbookSub': 'Every system in six chapters, with the induction tour as your guide.',
    'tour.openChapter': 'Open chapter', 'tour.restartAll': 'Start from the beginning',
    'tour.flightCard': 'First Flight', 'tour.flightNote': 'First Flight is the practical start: hatch your starter, meet a second sprite, level them together and make your first fusion. It reads your save, so every step you finish stays finished.',
    'tour.flightOpen': 'Open First Flight', 'tour.flightLocked': 'Finish the induction tour first',
    'tour.chapter': 'Chapter',
    'quiz.eyebrow': 'Every other day', 'quiz.cardTitle': 'Hollow type quiz',
    'quiz.cardOff': 'A new type quiz appears every other day at a random time. Next one: {day}.',
    'quiz.cardWaiting': 'Today’s quiz unlocks at {time}.',
    'quiz.cardReady': 'Today’s quiz is ready. One easy question about a sprite in your Hollow.',
    'quiz.cardDone': 'Today’s quiz is solved. The next one arrives {day}.',
    'quiz.restDay': 'rest day', 'quiz.laterToday': 'later today', 'quiz.readyNow': 'ready now', 'quiz.solved': '✓ solved',
    'quiz.take': 'Take the type quiz', 'quiz.notYet': 'Unlocks at {time}', 'quiz.next': 'Next quiz: {day}',
    'quiz.title': 'Type quiz', 'quiz.sub': 'One easy question · just for fun',
    'quiz.intro': 'A quick question about a sprite in your Hollow. No crate, no catch — just a little Hollow trivia.',
    'quiz.question': 'What type is {name}?',
    'quiz.wrong': 'Not quite — try another type. The Hollow is patient.',
    'quiz.correct': 'Correct — {answer}. That’s today’s quiz solved.',
    'quiz.claimed': 'Today’s quiz is already solved. A new one arrives every other day.',
    'quiz.notReady': 'Today’s quiz has not unlocked yet.', 'quiz.close': 'Done',
    'quiz.needSprite': 'Hatch a sprite first, then the quiz can ask you about it.',
    'quiz.needNamedSprite': 'Every sprite here is named after its own type. Hatch one with its own name, then the quiz can ask about it.',
    'friday.title': 'Free crate Friday', 'friday.sub': 'One free crate · one monthly secret',
    'friday.cardReward': 'One free crate every Friday with coins, snacks, and pantry food.',
    'friday.cardSecretReady': 'This month’s free secret is ready. Open the crate to choose one locked Vault sprite.',
    'friday.cardSecretDone': 'This month’s free secret is already home. The crate still brings coins, snacks, and pantry food.',
    'friday.claim': 'Open free Friday crate', 'friday.chooseSecret': 'Open crate · choose secret',
    'friday.claimed': '✓ Claimed this week',
    'friday.pickerIntro': 'Choose one locked Secret Vault sprite. This is your free secret for this month.',
    'friday.empty': 'Every Secret Vault sprite is already home. Open the crate for its coins and pantry bundle.',
    'friday.claimEmpty': 'Open the Friday crate', 'friday.claimSecret': 'Claim {name}',
    'friday.chooseAnother': 'Choose another secret',
    'friday.filterPlaceholder': 'Filter secrets by name, trait or gene…',
    'friday.lockedCount': 'All {count} locked Vault secrets',
    'friday.matches': '{shown} of {count} locked secrets',
    'friday.noMatches': 'No secret matches that filter.',
    'friday.secretUnavailable': 'That secret is already home or no longer available. Choose another.',
    'friday.alreadyClaimed': 'This Friday’s crate is already claimed.',
    'friday.reward': '+{coins} coins · free Friday crate',
    'friday.rewardSecret': '+{coins} coins · free Friday crate · {name} joined your Hollow',
  },
  es: {
    'tab.hollow': 'Hogar', 'tab.collection': 'Sprites', 'tab.codex': 'Tipos', 'tab.nest': 'Nido',
    'tab.play': 'Jugar', 'tab.today': 'Hoy', 'tab.settings': 'Ajustes',
    'settings.language': 'Idioma', 'settings.languageNote': 'Se aplica a la navegación, los ajustes, los subtítulos y el tour de inducción.',
    'settings.captions': 'Subtítulos (CC)', 'settings.captionsNote': 'Muestra descripciones de sonidos y líneas habladas en pantalla para personas con discapacidad auditiva.',
    'tour.title': '🧭 Tour de inducción', 'tour.sub': 'pasos narrados hasta tu primera leyenda.',
    'tour.subReplay': 'Un repaso de cómo funciona el Hogar. Incluye voz y lectura.',
    'tour.read': '🔊 Leer en voz alta', 'tour.stop': '⏹ Detener lectura', 'tour.voiceOff': 'La voz está desactivada. Pulsa Leer en voz alta para escuchar el tour.',
    'tour.voiceUnavailable': 'La voz no está disponible en este dispositivo.', 'tour.reading': 'Leyendo en voz alta: sigue el resaltado amarillo.',
    'tour.tap': 'Pulsa para escuchar este paso y seguir la lectura.', 'tour.skip': 'Saltar tour', 'tour.close': 'Cerrar',
    'tour.next': 'Siguiente', 'tour.back': 'Atrás', 'tour.start': 'Empezar a explorar', 'tour.startTutorial': 'Empezar el tutorial', 'tour.firstSecret': 'Primer secreto: completa el tour.',
    'tour.replay': 'Repetir tour de inducción', 'tour.resume': 'Reanudar tour de inducción', 'tour.restart': 'Empezar desde el principio',
    'tour.paused': 'Tour en pausa en el paso {step} de {total}. Reanúdalo desde Studio.',
    'quiz.eyebrow': 'Cada dos días', 'quiz.cardTitle': 'Quiz de tipos del Hogar',
    'quiz.cardOff': 'Cada dos días aparece un nuevo quiz de tipos a una hora al azar. El siguiente: {day}.',
    'quiz.cardWaiting': 'El quiz de hoy se desbloquea a las {time}.',
    'quiz.cardReady': 'El quiz de hoy está listo. Una pregunta fácil sobre un sprite de tu Hogar.',
    'quiz.cardDone': 'El quiz de hoy está resuelto. El siguiente llega el {day}.',
    'quiz.restDay': 'día de descanso', 'quiz.laterToday': 'hoy más tarde', 'quiz.readyNow': 'listo ahora', 'quiz.solved': '✓ resuelto',
    'quiz.take': 'Hacer el quiz de tipos', 'quiz.notYet': 'Se desbloquea a las {time}', 'quiz.next': 'Próximo quiz: {day}',
    'quiz.title': 'Quiz de tipos', 'quiz.sub': 'Una pregunta fácil · solo por diversión',
    'quiz.intro': 'Una pregunta rápida sobre un sprite de tu Hogar. Sin caja ni trampa: solo un poco de trivia del Hogar.',
    'quiz.question': '¿De qué tipo es {name}?',
    'quiz.wrong': 'Casi — prueba otro tipo. El Hogar tiene paciencia.',
    'quiz.correct': '¡Correcto! — {answer}. El quiz de hoy está resuelto.',
    'quiz.claimed': 'El quiz de hoy ya está resuelto. Llega uno nuevo cada dos días.',
    'quiz.notReady': 'El quiz de hoy aún no se ha desbloqueado.', 'quiz.close': 'Listo',
    'quiz.needSprite': 'Primero eclosiona un sprite; luego el quiz podrá preguntarte por él.',
    'quiz.needNamedSprite': 'Todos los sprites de aquí se llaman como su propio tipo. Eclosiona uno con su propio nombre y el quiz podrá preguntarte por él.',
    'friday.title': 'Viernes de caja gratis', 'friday.sub': 'Una caja gratis · un secreto mensual',
    'friday.cardReward': 'Una caja gratis cada viernes con monedas, aperitivos y comida de despensa.',
    'friday.cardSecretReady': 'El secreto gratis de este mes está listo. Abre la caja para elegir un sprite bloqueado de la Bóveda.',
    'friday.cardSecretDone': 'El secreto gratis de este mes ya está en casa. La caja sigue trayendo monedas, aperitivos y comida.',
    'friday.claim': 'Abrir la caja gratis del viernes', 'friday.chooseSecret': 'Abrir caja · elegir secreto',
    'friday.claimed': '✓ Reclamada esta semana',
    'friday.pickerIntro': 'Elige un sprite bloqueado de la Bóveda Secreta. Es tu secreto gratis de este mes.',
    'friday.empty': 'Todos los sprites de la Bóveda Secreta ya están en casa. Abre la caja por sus monedas y su lote de despensa.',
    'friday.claimEmpty': 'Abrir la caja del viernes', 'friday.claimSecret': 'Reclamar {name}',
    'friday.chooseAnother': 'Elegir otro secreto',
    'friday.filterPlaceholder': 'Filtra secretos por nombre, rasgo o gen…',
    'friday.lockedCount': 'Los {count} secretos bloqueados de la Bóveda',
    'friday.matches': '{shown} de {count} secretos bloqueados',
    'friday.noMatches': 'Ningún secreto coincide con ese filtro.',
    'friday.secretUnavailable': 'Ese secreto ya está en casa o ya no está disponible. Elige otro.',
    'friday.alreadyClaimed': 'La caja de este viernes ya está reclamada.',
    'friday.reward': '+{coins} monedas · caja gratis del viernes',
    'friday.rewardSecret': '+{coins} monedas · caja gratis del viernes · {name} se unió a tu Hogar',
  },
  fr: {
    'tab.hollow': 'Foyer', 'tab.collection': 'Sprites', 'tab.codex': 'Types', 'tab.nest': 'Nid',
    'tab.play': 'Jouer', 'tab.today': 'Aujourd’hui', 'tab.settings': 'Réglages',
    'settings.language': 'Langue', 'settings.languageNote': 'S’applique à la navigation, aux réglages, aux sous-titres et à la visite guidée.',
    'settings.captions': 'Sous-titres (CC)', 'settings.captionsNote': 'Affiche les descriptions sonores et les paroles à l’écran pour les personnes sourdes ou malentendantes.',
    'tour.title': '🧭 Visite guidée', 'tour.sub': 'étapes narrées jusqu’à votre première légende.',
    'tour.subReplay': 'Un rappel du fonctionnement du Foyer. Voix et lecture incluses.',
    'tour.read': '🔊 Lire à voix haute', 'tour.stop': '⏹ Arrêter la lecture', 'tour.voiceOff': 'La voix est désactivée. Appuyez sur Lire à voix haute pour écouter la visite.',
    'tour.voiceUnavailable': 'La voix n’est pas disponible sur cet appareil.', 'tour.reading': 'Lecture en cours — suivez le surlignage jaune.',
    'tour.tap': 'Appuyez pour écouter cette étape et suivre la lecture.', 'tour.skip': 'Passer la visite', 'tour.close': 'Fermer',
    'tour.next': 'Suivant', 'tour.back': 'Retour', 'tour.start': 'Commencer l’exploration', 'tour.startTutorial': 'Commencer le tutoriel', 'tour.firstSecret': 'Premier secret : terminez la visite.',
    'tour.replay': 'Rejouer la visite guidée', 'tour.resume': 'Reprendre la visite guidée', 'tour.restart': 'Recommencer depuis le début',
    'tour.paused': 'Visite en pause à l’étape {step} sur {total}. Reprenez-la depuis Studio.',
    'quiz.eyebrow': 'Tous les deux jours', 'quiz.cardTitle': 'Quiz des types du Foyer',
    'quiz.cardOff': 'Un nouveau quiz des types apparaît tous les deux jours à une heure aléatoire. Le prochain : {day}.',
    'quiz.cardWaiting': 'Le quiz du jour se débloque à {time}.',
    'quiz.cardReady': 'Le quiz du jour est prêt. Une question facile sur un sprite de votre Foyer.',
    'quiz.cardDone': 'Le quiz du jour est résolu. Le prochain arrive {day}.',
    'quiz.restDay': 'jour de repos', 'quiz.laterToday': 'plus tard aujourd’hui', 'quiz.readyNow': 'prêt', 'quiz.solved': '✓ résolu',
    'quiz.take': 'Faire le quiz des types', 'quiz.notYet': 'Se débloque à {time}', 'quiz.next': 'Prochain quiz : {day}',
    'quiz.title': 'Quiz des types', 'quiz.sub': 'Une question facile · juste pour le plaisir',
    'quiz.intro': 'Une question rapide sur un sprite de votre Foyer. Sans caisse ni piège : juste un peu de trivia du Foyer.',
    'quiz.question': 'De quel type est {name} ?',
    'quiz.wrong': 'Presque — essayez un autre type. Le Foyer est patient.',
    'quiz.correct': 'Correct — {answer}. Le quiz du jour est résolu.',
    'quiz.claimed': 'Le quiz du jour est déjà résolu. Un nouveau arrive tous les deux jours.',
    'quiz.notReady': 'Le quiz du jour n’est pas encore débloqué.', 'quiz.close': 'Terminé',
    'quiz.needSprite': 'Faites d’abord éclore un sprite ; le quiz pourra ensuite vous poser une question.',
    'quiz.needNamedSprite': 'Tous les sprites ici portent le nom de leur propre type. Faites éclore un sprite avec son propre nom et le quiz pourra vous interroger.',
    'friday.title': 'Vendredi de caisse gratuite', 'friday.sub': 'Une caisse gratuite · un secret mensuel',
    'friday.cardReward': 'Une caisse gratuite chaque vendredi avec des pièces, des en-cas et de la nourriture du garde-manger.',
    'friday.cardSecretReady': 'Le secret gratuit de ce mois est prêt. Ouvrez la caisse pour choisir un sprite verrouillé du Coffre.',
    'friday.cardSecretDone': 'Le secret gratuit de ce mois est déjà à la maison. La caisse apporte toujours des pièces, des en-cas et de la nourriture.',
    'friday.claim': 'Ouvrir la caisse gratuite du vendredi', 'friday.chooseSecret': 'Ouvrir la caisse · choisir un secret',
    'friday.claimed': '✓ Réclamée cette semaine',
    'friday.pickerIntro': 'Choisissez un sprite verrouillé du Coffre Secret. C’est votre secret gratuit de ce mois.',
    'friday.empty': 'Tous les sprites du Coffre Secret sont déjà à la maison. Ouvrez la caisse pour ses pièces et son lot de garde-manger.',
    'friday.claimEmpty': 'Ouvrir la caisse du vendredi', 'friday.claimSecret': 'Réclamer {name}',
    'friday.chooseAnother': 'Choisir un autre secret',
    'friday.filterPlaceholder': 'Filtrez les secrets par nom, trait ou gène…',
    'friday.lockedCount': 'Les {count} secrets verrouillés du Coffre',
    'friday.matches': '{shown} sur {count} secrets verrouillés',
    'friday.noMatches': 'Aucun secret ne correspond à ce filtre.',
    'friday.secretUnavailable': 'Ce secret est déjà à la maison ou n’est plus disponible. Choisissez-en un autre.',
    'friday.alreadyClaimed': 'La caisse de ce vendredi est déjà réclamée.',
    'friday.reward': '+{coins} pièces · caisse gratuite du vendredi',
    'friday.rewardSecret': '+{coins} pièces · caisse gratuite du vendredi · {name} a rejoint votre Foyer',
  },
};

/* Display labels only: the element and secret keys stay the canonical English
   ids used by saves, fusion and the Vault. Anything without a label falls back
   to the English name, so a new species is never blank in another language. */
const TYPE_NAME_I18N = {
  es: {
    ember: 'Ascua', tide: 'Marea', gale: 'Vendaval', bloom: 'Floración',
    volt: 'Voltio', frost: 'Escarcha', dusk: 'Ocaso', radiant: 'Radiante',
    demon: 'Demonio', angel: 'Ángel', air: 'Aire', water: 'Agua',
    earth: 'Tierra', honey: 'Miel', pond: 'Estanque', hero: 'Superhéroe',
    ants: 'Hormigas', fire: 'Fuego', normal: 'Normal',
  },
  fr: {
    ember: 'Braise', tide: 'Marée', gale: 'Bourrasque', bloom: 'Floraison',
    volt: 'Volt', frost: 'Givre', dusk: 'Crépuscule', radiant: 'Radieux',
    demon: 'Démon', angel: 'Ange', air: 'Air', water: 'Eau',
    earth: 'Terre', honey: 'Miel', pond: 'Étang', hero: 'Super-héros',
    ants: 'Fourmis', fire: 'Feu', normal: 'Normal',
  },
};

const SECRET_NAME_I18N = {
  es: {
    hollowguide: 'Guía del Hogar', summitspirit: 'Espíritu de la Cumbre',
    atlaskeeper: 'Guardián del Atlas', heartkeeper: 'Guardián del Corazón',
    shelloracle: 'Oráculo de Conchas', cheatmaster: 'Maestro de las Trampas',
    dailykeeper: 'Guardián Diario', elderkeeper: 'Guardián Anciano',
    taskkeeper: 'Guardián de Tareas', giftkeeper: 'Guardián de Regalos',
    rebirthkeeper: 'Guardián del Renacer', seasonkeeper: 'Guardián de las Estaciones',
    ringkeeper: 'Guardián del Ring', riftchampion: 'Campeón de la Grieta',
    grandslam: 'Gran Slam', eternalharmony: 'Tortuga de la Armonía Eterna',
    vault_jan: 'Guardián de la Primera Luz', vault_feb: 'San Valentín de Ascua',
    vault_mar: 'Guardián del Deshielo', vault_apr: 'Cartógrafo de la Floración',
    vault_may: 'Tramposo del Mayo', vault_jun: 'Archivero del Solsticio',
    vault_jul: 'Corredor del Mercado Solar', vault_aug: 'Molinero de Meteoros',
    vault_sep: 'Registrador de la Cosecha', vault_oct: 'Segador de Faroles',
    vault_nov: 'Escriba de Escarcha y Fuego', vault_dec: 'Anfitrión del Invierno',
    vault_jan_b: 'Promesa de un Penique', vault_feb_b: 'Mensajero del Cacao',
    vault_mar_b: 'Saltacharcos', vault_apr_b: 'Bibliotecario de Semillas',
    vault_may_b: 'Árbitro de Cintas', vault_jun_b: 'Salvavidas de Farol',
    vault_jul_b: 'Libro de la Limonada', vault_aug_b: 'Explorador del Mercado Nocturno',
    vault_sep_b: 'Mayordomo de la Sidra', vault_oct_b: 'Auditor de Calabazas',
    vault_nov_b: 'Narrador de Ascuas', vault_dec_b: 'Curador de Bolas de Nieve',
    vault_dawn: 'Relevo del Amanecer', vault_dusk: 'Relevo del Ocaso',
    vault_tide: 'Relevo de la Marea', vault_ember: 'Relevo de Ascuas',
    vault_bloom: 'Relevo de la Floración', vault_star: 'Relevo Estelar',
    vault_gear: 'Relevo de Engranajes', vault_veil: 'Relevo del Velo',
    vault_mist: 'Relevo de la Niebla', vault_prisma: 'Relevo Prisma',
    vault_quartz: 'Relevo de Cuarzo', vault_halo: 'Relevo del Halo',
    vaultwanderer: 'Errante de la Bóveda', vaultchampion: 'Campeón de la Bóveda',
    vaultpuff_lantern: 'Puffle de la Bóveda Linterna', vaultpuff_frost: 'Puffle de la Bóveda Helada',
    vaultpuff_dream: 'Puffle de la Bóveda Onírica', vaultpuff_crown: 'Puffle de la Bóveda de la Corona',
  },
  fr: {
    hollowguide: 'Guide du Foyer', summitspirit: 'Esprit du Sommet',
    atlaskeeper: 'Gardien de l’Atlas', heartkeeper: 'Gardien du Cœur',
    shelloracle: 'Oracle des Coquillages', cheatmaster: 'Maître de la Triche',
    dailykeeper: 'Gardien Quotidien', elderkeeper: 'Gardien Ancien',
    taskkeeper: 'Gardien des Tâches', giftkeeper: 'Gardien des Cadeaux',
    rebirthkeeper: 'Gardien de la Renaissance', seasonkeeper: 'Gardien des Saisons',
    ringkeeper: 'Gardien du Ring', riftchampion: 'Champion de la Faille',
    grandslam: 'Grand Chelem', eternalharmony: 'Tortue de l’Harmonie Éternelle',
    vault_jan: 'Gardien de la Première Lueur', vault_feb: 'Valentin de Braise',
    vault_mar: 'Gardien du Dégel', vault_apr: 'Cartographe de la Floraison',
    vault_may: 'Farceur du Mai', vault_jun: 'Archiviste du Solstice',
    vault_jul: 'Courtier du Marché du Soleil', vault_aug: 'Meunier des Météores',
    vault_sep: 'Greffier de la Récolte', vault_oct: 'Faucheur des Lanternes',
    vault_nov: 'Scribe du Givre et du Feu', vault_dec: 'Hôte du Cœur de l’Hiver',
    vault_jan_b: 'Promesse d’un Sou', vault_feb_b: 'Coursier du Cacao',
    vault_mar_b: 'Sauteur de Flaque', vault_apr_b: 'Bibliothécaire des Graines',
    vault_may_b: 'Arbitre des Rubans', vault_jun_b: 'Sauveteur à la Lanterne',
    vault_jul_b: 'Registre de la Citronnade', vault_aug_b: 'Éclaireur du Marché de Nuit',
    vault_sep_b: 'Intendant du Cidre', vault_oct_b: 'Auditeur des Citrouilles',
    vault_nov_b: 'Conteur des Braises', vault_dec_b: 'Conservateur des Boules de Neige',
    vault_dawn: 'Relais de l’Aube', vault_dusk: 'Relais du Crépuscule',
    vault_tide: 'Relais de la Marée', vault_ember: 'Relais des Braises',
    vault_bloom: 'Relais de la Floraison', vault_star: 'Relais des Étoiles',
    vault_gear: 'Relais des Engrenages', vault_veil: 'Relais du Voile',
    vault_mist: 'Relais de la Brume', vault_prisma: 'Relais Prisme',
    vault_quartz: 'Relais de Quartz', vault_halo: 'Relais du Halo',
    vaultwanderer: 'Vagabond du Coffre', vaultchampion: 'Champion du Coffre',
    vaultpuff_lantern: 'Puffle Lanterne du Coffre', vaultpuff_frost: 'Puffle Givre du Coffre',
    vaultpuff_dream: 'Puffle Rêve du Coffre', vaultpuff_crown: 'Puffle Couronne du Coffre',
  },
};

function typeLabel(key) {
  const meta = typeof ELEMENTS !== 'undefined' ? ELEMENTS[key] : null;
  const fallback = meta?.name || key;
  const lang = uiLang();
  const labels = TYPE_NAME_I18N[lang];
  if (labels && labels[key]) return labels[key];
  /* Puffle variants are named from their base element, so a translation of the
     base keeps them consistent without 60 more hand-written entries. */
  const puffle = /^puffle_([a-z0-9_]+)$/.exec(key);
  if (puffle && labels && labels[puffle[1]]) {
    return lang === 'es' ? `Puffle de ${labels[puffle[1]]}` : `Puffle ${labels[puffle[1]]}`;
  }
  return fallback;
}

function secretName(key) {
  const meta = typeof SECRET_SPECIES_META !== 'undefined' ? SECRET_SPECIES_META[key] : null;
  const fallback = meta?.name || key;
  const labels = SECRET_NAME_I18N[uiLang()];
  return (labels && labels[key]) || fallback;
}

function uiLang() {
  const key = typeof state !== 'undefined' && state.theme ? state.theme.language : 'en';
  return I18N[key] ? key : 'en';
}

function t(key, vars = null) {
  const lang = uiLang();
  const text = (I18N[lang] && I18N[lang][key]) || I18N.en[key] || key;
  if (!vars) return text;
  return String(text).replace(/\{(\w+)\}/g, (_, name) => (vars[name] == null ? '' : String(vars[name])));
}

function applyLanguage() {
  const lang = uiLang();
  if (typeof document !== 'undefined') document.documentElement.lang = lang;
  document.querySelectorAll('[data-tab]').forEach((button) => {
    const label = button.querySelector('span:not(.tab-badge)');
    if (label) label.textContent = t(`tab.${button.dataset.tab}`);
  });
  const settings = document.querySelector('[data-settings-btn] span');
  if (settings) settings.textContent = t('tab.settings');
}

/* Full tour translations. Each entry mirrors TOUR_STEPS by index. */
const TOUR_I18N = {
  es: [
    {
      kicker: 'TU HOGAR', title: 'Esta es tu base',
      text: 'Esta es tu base. Toca tu sprite activo para acariciarlo y usa la barra de cuidados para Alimentar, Jugar, Pasear, Frotar la barriga, Lanzar la pelota, Jugar a atrapar, Bañar, Dormir, Cama y Hablar. Comida, Descanso, Alegría y Limpieza bajan en tiempo real, incluso con la app cerrada.',
      points: ['Un mensaje verde de “prospera aquí” significa que el hábitat actual da más XP.', 'Cuando una necesidad baja, el sprite pide el cuidado correspondiente.'],
      tip: 'Toca primero al sprite. Acariciarlo es gratis, sube el vínculo y tiene un breve tiempo de espera.',
    },
    {
      kicker: 'CUIDADOS Y RUTAS', title: 'Primero cuidar, luego explorar',
      text: 'Cuidar es el ciclo diario: Alimentar, Jugar, Pasear, Frotar la barriga, Lanzar la pelota, Jugar a atrapar, Bañar, Dormir, Cama y Hablar. Las caricias suben Alegría y vínculo. Lanzar y atrapar abren un juego de cinco capturas que paga monedas, XP, vínculo y llena el medidor de Paquete de Cuidado. Cama abre el dormitorio para arropar y ver el diario de sueños. Pasear lleva a tu sprite a Trotar, Correr y todas las rutas. Actividades tiene Canasta y Gol.',
      points: ['Pulsa Pasear, elige una ruta y toca las huellas brillantes. Las monedas y regalos dan pasos extra; los charcos te frenan.', 'Cada paseo paga monedas y XP, recupera Alegría y da vínculo extra. Cada tercera salida abre un Regalo de Ruta.', 'Paseo del Hogar y Trote del Amanecer están abiertos. Paseo Lunar a los 3 paseos, Sprint del Viento a los 5 y Ascenso a la Cima a los 8.', 'Canasta y Gol están en Actividades: mide el tiro o supera al portero y gana comida de despensa y un regalo cada dos partidas.', 'Las salidas gastan algo de Comida y Descanso. Da un tentempié y una siesta después; acariciar y hablar son gratis.'],
      tip: 'Si una necesidad está por debajo de 20, atiéndela antes de moverte. Trotar y Correr son más rápidos y pagan más.',
    },
    {
      kicker: 'EL NIDO', title: 'Calienta, eclosiona y fusiona',
      text: 'Abre el Nido para eclosionar, fusionar o visitar la Bóveda Secreta. Toca un huevo para calentarlo hasta que la cáscara se rompa y eclosiona al bebé en tu colección. Los huevos de tipo siempre dan una especie elegida; los salvajes eligen un elemento al azar. La Bóveda muestra cada secreto desbloqueado y sus posibles crías.',
      points: ['Fusiona dos sprites de nivel 3 o más para mezclar elementos, colores, patrones y personalidad en un huevo nuevo.', 'Fusionar cuesta 70 monedas más 25 por generación de los padres, y ambos descansan 60 segundos.', 'Los sprites retirados sirven como padres y cualquier tipo puede fusionarse. La Bóveda muestra combinaciones y una vista previa.'],
      tip: 'Empieza con un Huevo Salvaje de 45 monedas o ahorra para un huevo de tipo cuando quieras una especie exacta.',
    },
    {
      kicker: 'SPRITES Y CRECIMIENTO', title: 'Llévalos al nivel 30',
      text: 'Todo lo que hacéis juntos da XP. Comer, juegos, charlas, baños, siestas y caricias cuentan, y el hábitat adecuado multiplica la ganancia. Los sprites crecen en los niveles 1, 5, 10 y 20, y se detienen en el 30.',
      points: ['Alimentar sube las afinidades de dieta Corazón, Dulce, Espeluznante y Salvaje.', 'Al nivel 10, doce puntos en una dieta desbloquean una evolución permanente.', 'Al nivel 30 un sprite se retira. Una Comida de Renacimiento lo devuelve a un huevo con bonificaciones permanentes.'],
      tip: 'Los sprites retirados cuentan para la Bóveda y pueden fusionarse. La Comida de Renacimiento empieza su siguiente vida con ventajas.',
    },
    {
      kicker: 'COLECCIÓN Y COMIDA', title: 'Cada especie y cada bocado',
      text: 'La Colección guarda cada especie que has conocido, y Tipos es la enciclopedia completa con huevos, rareza, genes y Titanes. Comida y Tentempiés muestra el mercado, la despensa, los bocados y cada efecto de dieta.',
      points: ['Compra comida en el mercado y sírvela desde la despensa para subir necesidades y una ruta de dieta.', 'La Cocina del Mundo, la Cocina Anime y la despensa Entrenador son guías buscables.', 'Diez dulces añaden Azúcar. Con tres de Azúcar, el sprite se transforma en una especie de caramelo.', 'Una colección Disney de 60 personajes abarca Mickey, clásicos, princesas, Pixar, villanos y favoritos modernos en la Wiki.', 'Una colección de 32 Ositos Cariñositos añade los clásicos, primos y 15 favoritos de la familia extendida. Cada 3 actividades entregan un Paquete de Cuidado.', 'El legado de Fortnite añade 60 sprites y la WWE suma 60 superestrellas. La nueva ala de animación de Netflix añade 60 personajes de 20 series, con filtros por serie.', 'Un catálogo de 600 sprites añade PBS Kids, Monster Jam, Nickelodeon, Nick Jr., Nicktoons, Discovery, películas animadas, cómics, Disney Jr., Disney XD y todos los géneros de videojuegos.'],
      tip: 'Usa la búsqueda en Tipos para encontrar una especie y abre su tarjeta para ver huevo, hábitat e híbridos.',
    },
    {
      kicker: 'JUEGOS DE CUIDADO', title: 'Frota, lanza y atrapa',
      text: 'La barra de cuidados tiene tres formas más de conectar. Frotar la barriga sube Alegría y vínculo con un breve tiempo de espera. Lanzar la pelota y Jugar a atrapar abren un juego de cinco capturas: toca la pelota en movimiento, llena el medidor y termina para ganar monedas, XP, vínculo y crédito para juegos y Paquetes de Cuidado. Pasear sigue siendo el botón de rutas y Jugar abre el centro de Actividades.',
      points: ['Frotar la barriga es gratis y tiene un breve tiempo de espera; perfecto cuando baja la Alegría.', 'Lanzar y atrapar cuentan como juegos para tareas diarias, semanales y mensuales.', 'El juego de atrapar usa el sprite activo, así que las ventajas de ponis y tareas siguen activas.'],
      tip: 'Si la pelota va muy rápido, busca el brillo amarillo y toca la pelota. Cada captura la pausa un momento.',
    },
    {
      kicker: 'NUEVAS COLECCIONES', title: 'Ponis, TV, reinos y Llaves Espada',
      text: 'Cuatro colecciones nuevas viven en el Nido: 92 amigos de My Little Pony, 100 Leyendas de TV, 90 sprites de horror/luz/oscuridad y 90 personajes de Kingdom Hearts. La nueva ola añade ponis de fondo, líderes reales, Ositos Cariñositos extendidos, repartos completos de TV y los mundos Disney de Kingdom Hearts. El ala de animación de Netflix suma 60 personajes de 20 series, en Netflix Anime y Netflix Toons. Todos tienen gen, Titán, huevo de tipo, hábitat, híbrido, artículo de Wiki y arte procedural original.',
      points: ['Los ponis dan monedas extra en registros y tareas completadas mientras están activos.', 'Las Leyendas de TV crean repartos completos de drama, sitcom, ciencia ficción, fantasía y animación, con etiqueta de serie.', 'Horror, Horror Oscuro, Luz y Oscuridad tienen su propia familia de ocho sprites y aura de reino.', 'Kingdom Hearts cubre las Islas del Destino, toda la Organización XIII, los Wayfinders, los Buscadores y 50 personajes de mundos Disney.', 'Filtra el ala de Netflix por Netflix Anime, Netflix Toons y cada una de las 20 series, con progreso de propiedad.'],
      tip: 'Abre el navegador de Reparto en la Wiki para filtrar ponis por familia, TV por serie y Keyblade por mundo. Cada tarjeta abre su ficha.',
    },
    {
      kicker: 'BIOMAS DE TIPO', title: 'Dieciocho hogares para dieciocho tipos',
      text: 'Cada uno de los dieciocho tipos estándar tiene un bioma con su propio cielo, suelo, clima y guardián. Las especies compatibles ganan un 50% más de XP allí, y los visitantes reciben una pequeña bonificación.',
      points: ['Abre Tipos y luego Atlas de Biomas, o elige un escenario en Studio.', 'El Estudio de Biomas crea hábitats personalizados ilimitados con tus colores, emoji y bonus de XP.', 'Los biomas personalizados aceptan a todos los sprites crecidos sin límite de residentes.'],
      tip: 'Cambiar de hábitat y clima es gratis. Prueba un hogar nuevo cuando quieras.',
    },
    {
      kicker: 'JUEGOS CLÁSICOS', title: 'Toda la estantería de Jugar',
      text: 'Jugar reúne toda la estantería: clásicos del Hogar, desafíos Arcade, rutas, deportes y juegos de mascotas. Cuatro clásicos están abiertos desde el inicio; Trotar está abierto y las rutas rápidas se desbloquean al pasear. Cada juego completado paga monedas y XP al sprite activo, además de alegría y vínculo. Las rutas y los deportes pueden dar comida de despensa.',
      points: ['Atrapa Golosinas: toca dulces que caen y evita piedras durante veinte segundos.', 'Pulso Perfecto: toca cuando el anillo móvil se alinee con el objetivo.', 'Sprite Dice: mira los paneles iluminarse y repite el patrón.', 'Cava Monedas: toca monedas y gemas enterradas, pero evita las bombas.', 'Canasta y Gol pagan comida y crean un regalo deportivo cada dos partidas.'],
      tip: 'Los juegos pagan más con un sprite raro activo. Las rutas dan vínculo extra y un Regalo de Ruta cada tres salidas.',
    },
    {
      kicker: 'DESAFÍOS ARCADE', title: 'Desafíos Arcade con pista extra',
      text: 'Arcade tiene su propia estantería de desafíos, siempre abiertos. Sus monedas llenan regalos extra y el premio mensual además de tu cartera.',
      points: ['Runa Deslizante: iguala la tira de orden y desliza una runa junto al hueco. Termina tres tableros en dos minutos.', 'Asedio Zombi: toca zombis antes de que lleguen al farol. Tienes tres corazones y treinta segundos.', 'Duelo del Hogar: pulsa Golpe en el centro verde y Guardia antes del ataque del bruto.'],
      tip: 'Cada 5.000 monedas Arcade llena un regalo extra. Cada tercer regalo y los niveles altos incluyen un Festín Starpath.',
    },
    {
      kicker: 'HOY Y CLIMA', title: 'Registra, completa y recoge',
      text: 'Hoy lleva el calendario del Hogar. Regístrate en las ventanas de mañana, tarde, noche y madrugada para monedas, bocados y rachas. Las misiones y metas pagan extra por lo que ya haces.',
      points: ['Cada dos días aparece un quiz de tipos a una hora al azar, solo por diversión. La primera caja de viernes que abras cada mes paga monedas, llena la despensa, desbloquea un plato nuevo y trae un sprite secreto de la Bóveda que elijas.', 'Los viernes siempre dan una caja gratis; las cajas posteriores del mes siguen trayendo monedas, aperitivos y comida. Las pistas semanal y mensual añaden hitos mayores y un premio mítico anual.', 'El clima sigue la fecha real. El frío o la lluvia gastan más necesidades, así que usa el armario.'],
      tip: 'El primer registro del día mantiene la racha y llena un alimento de despensa.',
    },
    {
      kicker: 'HÉROES Y VILLANOS', title: 'Sesenta y un firmas de ambos multiversos',
      text: 'Una ola de sesenta y un héroes vive en el Nido: veintiocho héroes, veintiún villanos y doce antihéroes, repartidos en treinta y dos Marvel, veintidós DC y siete más allá de Marvel y DC. Deadpool y Gwenpool están en el set Marvel, junto al Spider-Man clásico.',
      points: ['Cada firma tiene su gen, Titán, huevo de tipo, hábitat e híbrido con nombre.', 'Abre la Wiki y busca Marvel o DC para filtrar el reparto.', 'La guía Héroes, villanos y antihéroes agrupa a todos por editorial, con rol.'],
      tip: 'Las fichas muestran Editorial y Rol en el infobox, además de un botón para volver a la guía.',
    },
    {
      kicker: 'SECRETOS Y EXÓTICOS', title: 'Algunas puertas no están en el Nido',
      text: 'Los sprites secretos no se venden en el Nido. Abre la Bóveda para ver cada guardián desbloqueado, sus tipos padres, híbridos y una vista previa. Hay puertas de hitos, doce guardianes mensuales y ocho relevos dos veces por semana. Los guardianes exóticos son distintos: pueden eclosionar de sus huevos de tipo.',
      points: ['Termina este tour para ganar el primer secreto, el Guía del Hogar.', 'Alcanza el nivel 30, visita los dieciocho biomas, llega a 100 de vínculo, eclosiona 25 huevos y descifra el nombre Maestro.', 'Abre la Bóveda durante una ventana mensual o de lunes a miércoles / jueves a domingo, y reclama al guardián antes de que rote.', 'Los sprites retirados cuentan para la Bóveda y sirven como padres.'],
      tip: 'La bóveda guarda cada pista, así que ábrela cuando un hito esté cerca.',
    },
    {
      kicker: 'ESTUDIO', title: 'Haz tuyo el Hogar',
      text: 'El Studio cambia el tema de la interfaz, el clima, el escenario, el cuerpo, los colores, los patrones, los accesorios, la voz, el idioma, los subtítulos y el nombre del Hogar. El Armario guarda conjuntos con nombre ilimitados y el Estudio de Biomas crea hábitats personalizados ilimitados.',
      points: ['Aplica o quita un conjunto cuando quieras; edítalo o bórralo después.', 'Los biomas personalizados tienen sus propios colores, emoji, nombre de hábitat y bonus de XP.', 'La fila de saltos rápidos de la Wiki llega a dibujos, cómics, géneros, variantes, la Bóveda y el criador en un toque.', 'Shortcut es una especie real con su gen, hábitats e híbrido con nombre.', 'Puedes repetir este tour o empezar de cero desde Studio.'],
      tip: 'Los conjuntos y biomas personalizados son gratis de crear, editar y aplicar, sin límite.',
    },
    {
      kicker: 'LISTO', title: 'Ese es todo el Hogar',
      text: 'Ese es todo el Hogar. Eclosiona un sprite, mantén sus necesidades felices, pasea o juega deportes, frota una barriga o juega a atrapar, juega los minijuegos, visita la Bóveda, regístrate a diario y llena la enciclopedia. La Wiki guarda cada regla y cada ficha si olvidas un detalle.',
      points: ['Empieza con la barra de cuidados, un Huevo Salvaje en el Nido o una ruta desde Pasear.', 'El tour de inducción se puede repetir desde Studio cuando quieras.'],
      tip: 'Terminar este paso da el primer secreto y abre el resto de pistas de la Bóveda.',
    },
  ],
  fr: [
    {
      kicker: 'VOTRE FOYER', title: 'Voici votre base',
      text: 'Voici votre base. Touchez votre sprite actif pour le caresser, puis utilisez la barre de soins pour Nourrir, Jouer, Promener, Frotter le ventre, Lancer la balle, Jouer à attraper, Laver, Dormir, Lit et Parler. Nourriture, Repos, Joie et Propreté baissent en temps réel, même application fermée.',
      points: ['Un message vert « s’épanouit ici » signifie que l’habitat actuel booste l’XP.', 'Quand un besoin baisse, le sprite réclame le soin correspondant.'],
      tip: 'Touchez d’abord le sprite. Le caresser est gratuit, renforce le lien et a un court délai.',
    },
    {
      kicker: 'SOINS ET SENTIERS', title: 'D’abord les soins, ensuite l’aventure',
      text: 'Les soins forment la boucle quotidienne : Nourrir, Jouer, Promener, Frotter le ventre, Lancer la balle, Jouer à attraper, Laver, Dormir, Lit et Parler. Les caresses du ventre montent Joie et lien. Lancer et Attraper ouvrent un jeu de cinq prises qui paie pièces, XP, lien et remplit le compteur de Colis de Soin. Le Lit ouvre la chambre pour border et lire le journal des rêves. Promener mène vers Trotter, Courir et tous les sentiers. Activités propose Panier et But.',
      points: ['Touchez Promener, choisissez un sentier, puis les empreintes lumineuses. Pièces et cadeaux donnent des pas; les flaques freinent.', 'Chaque sortie paie pièces et XP, rend de la Joie et donne du lien. Toutes les trois sorties, un Cadeau de Sentier apparaît.', 'Promenade du Foyer et Trot de l’Aube sont ouverts. Promenade Lunaire à 3 sorties, Sprint du Vent à 5, Ascension au Sommet à 8.', 'Panier et But sont dans Activités : dosez le tir ou dépassez le gardien, avec nourriture garantie et cadeau tous les deux matchs.', 'Les sorties coûtent un peu de Nourriture et de Repos. Offrez un en-cas et une sieste après; caresses et discussions sont gratuites.'],
      tip: 'Si un besoin est sous 20, occupez-vous-en avant de bouger. Trotter et Courir sont plus rapides et paient plus.',
    },
    {
      kicker: 'LE NID', title: 'Réchauffez, éclosez et fusionnez',
      text: 'Ouvrez le Nid pour éclore, fusionner ou visiter le Coffre Secret. Touchez un œuf pour le réchauffer jusqu’à la fissure, puis faites éclore le bébé dans votre collection. Les œufs de type donnent toujours l’espèce choisie; les œufs sauvages tirent un élément au hasard. Le Coffre montre chaque secret débloqué et ses enfants possibles.',
      points: ['Fusionnez deux sprites de niveau 3 ou plus pour mêler éléments, couleurs, motifs et personnalité dans un nouvel œuf.', 'La fusion coûte 70 pièces plus 25 par génération des parents; les deux parents se reposent 60 secondes.', 'Les sprites retraités restent des parents valables et tous les types peuvent fusionner. Le Coffre montre les combinaisons et un aperçu.'],
      tip: 'Commencez avec un Œuf Sauvage à 45 pièces, ou économisez pour un œuf de type quand vous voulez une espèce précise.',
    },
    {
      kicker: 'SPRITES ET CROISSANCE', title: 'Élevez-les jusqu’au niveau 30',
      text: 'Tout ce que vous faites ensemble donne de l’XP. Nourrir, jouer, discuter, laver, dormir et caresser comptent, et l’habitat correspondant multiplie le gain. Les sprites grandissent aux niveaux 1, 5, 10 et 20, puis s’arrêtent au 30.',
      points: ['Nourrir développe les affinités Copieux, Sucré, Étrange et Sauvage.', 'Au niveau 10, douze points dans une voie débloquent une évolution permanente.', 'Au niveau 30, un sprite prend sa retraite. Un Repas de Renaissance le ramène à l’œuf avec des bonus permanents.'],
      tip: 'Les sprites retraités comptent pour le Coffre et peuvent fusionner. Le Repas de Renaissance offre une nouvelle vie boostée.',
    },
    {
      kicker: 'COLLECTION ET NOURRITURE', title: 'Chaque espèce, chaque en-cas',
      text: 'La Collection garde chaque espèce rencontrée, et Types est l’encyclopédie complète avec œufs, rareté, gènes et Titans. Nourriture et En-cas présente le marché, le garde-manger, les en-cas et chaque effet de régime.',
      points: ['Achetez au marché puis servez depuis le garde-manger pour remonter les besoins et une voie alimentaire.', 'La Cuisine du Monde, la Cuisine Animée et le garde-manger Dresseur sont des guides consultables.', 'Dix bonbons ajoutent du Sucre. À trois Sucres, le sprite devient une espèce bonbon.', 'Une collection Disney de 60 personnages couvre Mickey, les classiques, les princesses, Pixar, les méchants et les favoris modernes dans le Wiki.', 'Une collection de 32 Bisounours ajoute les classiques, les cousins et 15 favoris de la famille élargie. Toutes les 3 activités, un Colis de Soin arrive.', 'L’héritage Fortnite ajoute 60 sprites et la WWE 60 superstars. La nouvelle aile animation Netflix ajoute 60 personnages de 20 séries, avec filtres par série.', 'Un catalogue de 600 sprites ajoute PBS Kids, Monster Jam, Nickelodeon, Nick Jr., Nicktoons, Discovery, films animés, comics, Disney Jr., Disney XD et tous les genres de jeux.'],
      tip: 'Utilisez la recherche dans Types pour trouver une espèce, puis ouvrez sa fiche pour l’œuf, l’habitat et les hybrides.',
    },
    {
      kicker: 'JEUX DE SOIN', title: 'Frottez, lancez et attrapez',
      text: 'La barre de soins propose trois façons de plus de créer du lien. Frotter le ventre monte Joie et lien avec un court délai. Lancer la balle et Jouer à attraper ouvrent un jeu de cinq prises : touchez la balle en mouvement, remplissez la jauge et terminez pour gagner pièces, XP, lien et crédit pour les jeux et Colis de Soin. Promener reste le bouton des sentiers et Jouer ouvre le centre d’Activités.',
      points: ['Frotter le ventre est gratuit avec un court délai; parfait quand la Joie est basse.', 'Lancer et attraper comptent comme des jeux pour les tâches quotidiennes, hebdomadaires et mensuelles.', 'Le jeu d’attraper utilise le sprite actif, donc les bonus de poney et de tâches restent actifs.'],
      tip: 'Si la balle va trop vite, repérez la lueur jaune et touchez la balle. Chaque prise la met en pause un instant.',
    },
    {
      kicker: 'NOUVELLES COLLECTIONS', title: 'Poneys, télé, royaumes et Keyblades',
      text: 'Quatre nouvelles collections vivent dans le Nid : 92 amis My Little Pony, 100 Légendes TV, 90 sprites horreur/lumière/obscurité et 90 personnages Kingdom Hearts. La nouvelle vague ajoute des poneys secondaires, des dirigeants royaux, des Bisounours étendus, des distributions TV complètes et les mondes Disney de Kingdom Hearts. L’aile animation Netflix ajoute 60 personnages de 20 séries, en Netflix Anime et Netflix Toons. Chacun a un gène, un Titan, un œuf de type, un habitat, un hybride, un article Wiki et un art procédural original.',
      points: ['Les poneys donnent des pièces bonus aux check-ins et aux tâches terminées quand ils sont actifs.', 'Les Légendes TV forment des distributions complètes de drame, sitcom, science-fiction, fantasy et animation, avec étiquette de série.', 'Horreur, Horreur Sombre, Lumière et Obscurité ont chacune huit sprites et une aura de royaume.', 'Kingdom Hearts couvre les Îles du Destin, toute l’Organisation XIII, les Wayfinders, les Chercheurs et 50 personnages de mondes Disney.', 'Filtrez l’aile Netflix par Netflix Anime, Netflix Toons et chacune des 20 séries, avec progression de possession.'],
      tip: 'Ouvrez le navigateur de Distribution dans le Wiki pour filtrer les poneys par famille, la TV par série et les Keyblades par monde. Chaque carte ouvre sa fiche.',
    },
    {
      kicker: 'BIOMES DE TYPE', title: 'Dix-huit foyers pour dix-huit types',
      text: 'Chacun des dix-huit types standards possède un biome avec son ciel, son sol, son climat et son gardien. Les espèces adaptées y gagnent 50 % d’XP en plus, et les visiteurs reçoivent un petit bonus.',
      points: ['Ouvrez Types puis Atlas des Biomes, ou choisissez un décor dans Studio.', 'Le Studio de Biomes crée des habitats personnalisés illimités avec vos couleurs, emoji et bonus d’XP.', 'Les biomes personnalisés accueillent tous les sprites adultes sans limite de résidents.'],
      tip: 'Changer d’habitat et de climat est gratuit. Essayez un nouveau foyer quand vous voulez.',
    },
    {
      kicker: 'JEUX CLASSIQUES', title: 'Toute l’étagère de Jouer',
      text: 'Jouer réunit toute l’étagère : classiques du Foyer, défis Arcade, sentiers, sports et jeux de compagnon. Quatre classiques sont ouverts dès le départ; Trotter est ouvert et les sentiers rapides se débloquent en marchant. Chaque jeu terminé paie pièces et XP au sprite actif, plus joie et lien. Les sentiers et les sports peuvent donner de la nourriture.',
      points: ['Attrape-Gourmandises : touchez les friandises qui tombent et évitez les cailloux pendant vingt secondes.', 'Pulse Parfait : touchez quand l’anneau mobile s’aligne sur la cible.', 'Sprite Dit : regardez les panneaux s’allumer puis répétez le motif.', 'Creuse-Pièces : touchez pièces et gemmes enfouies, mais évitez les bombes.', 'Panier et But paient de la nourriture et créent un cadeau sportif tous les deux matchs.'],
      tip: 'Les jeux paient plus avec un sprite rare actif. Les sentiers ajoutent du lien et un Cadeau de Sentier tous les trois sorties.',
    },
    {
      kicker: 'DÉFIS ARCADE', title: 'Défis Arcade et piste bonus',
      text: 'Arcade a sa propre étagère de défis, toujours ouverts. Leurs pièces remplissent des cadeaux bonus et le prix mensuel en plus de votre bourse.',
      points: ['Rune Coulissante : alignez la bande d’ordre et faites glisser une rune près du vide. Terminez trois plateaux en deux minutes.', 'Siège Zombie : touchez les zombies avant la lanterne. Trois cœurs et trente secondes.', 'Duel du Foyer : appuyez sur Frappe dans le centre vert et Garde avant l’attaque du brute.'],
      tip: 'Toutes les 5 000 pièces Arcade remplissent un cadeau bonus. Chaque troisième cadeau et les hauts paliers incluent un Festin Starpath.',
    },
    {
      kicker: 'AUJOURD’HUI ET CLIMAT', title: 'Pointez, accomplissez, récoltez',
      text: 'Aujourd’hui gère le calendrier du Foyer. Pointez aux fenêtres matin, après-midi, soir et nuit pour des pièces, en-cas et séries. Quêtes et objectifs paient plus pour ce que vous faites déjà.',
      points: ['Tous les deux jours, le quiz des types apparaît à une heure aléatoire, juste pour le plaisir. La première caisse du vendredi ouverte chaque mois paie des pièces, remplit le garde-manger, débloque un nouveau plat et apporte un sprite secret du Coffre de votre choix.', 'Les vendredis donnent toujours une caisse gratuite ; les caisses suivantes du mois apportent encore des pièces, des en-cas et de la nourriture. Les pistes hebdomadaire et mensuelle ajoutent de grands paliers et une récompense mythique annuelle.', 'Le climat suit la date réelle. Le froid ou la pluie usent plus vite les besoins; utilisez la garde-robe.'],
      tip: 'Le premier pointage du jour maintient la série et remplit un aliment du garde-manger.',
    },
    {
      kicker: 'HÉROS ET MÉCHANTS', title: 'Soixante et une signatures des deux multivers',
      text: 'Une vague de soixante et un héros vit dans le Nid : vingt-huit héros, vingt et un méchants et douze antihéros, répartis en trente-deux Marvel, vingt-deux DC et sept au-delà de Marvel et DC. Deadpool et Gwenpool sont dans le set Marvel, aux côtés du Spider-Man classique.',
      points: ['Chaque signature a son gène, Titan, œuf de type, habitat et hybride nommé.', 'Ouvrez le Wiki et cherchez Marvel ou DC pour filtrer la distribution.', 'Le guide Héros, méchants et antihéros regroupe tout le monde par éditeur, avec rôle.'],
      tip: 'Les fiches affichent Éditeur et Rôle dans l’infobox, plus un bouton pour revenir au guide.',
    },
    {
      kicker: 'SECRETS ET EXOTIQUES', title: 'Certaines portes ne sont pas dans le Nid',
      text: 'Les sprites secrets ne sont pas vendus dans le Nid. Ouvrez le Coffre pour voir chaque gardien débloqué, ses types parents, ses hybrides et un aperçu. Il y a des portes de paliers, douze gardiens mensuels et huit relais deux fois par semaine. Les gardiens exotiques sont différents : ils peuvent éclore de leurs œufs de type.',
      points: ['Terminez cette visite pour gagner le premier secret, le Guide du Foyer.', 'Atteignez le niveau 30, visitez les dix-huit biomes, 100 de lien, éclosez 25 œufs et déchiffrez le nom Maître.', 'Ouvrez le Coffre pendant une fenêtre mensuelle ou du lundi au mercredi / jeudi au dimanche, et réclamez le gardien avant la rotation.', 'Les sprites retraités comptent pour le Coffre et servent de parents.'],
      tip: 'Le coffre garde chaque indice; ouvrez-le quand un palier approche.',
    },
    {
      kicker: 'STUDIO', title: 'Faites vôtre le Foyer',
      text: 'Le Studio change le thème de l’interface, le climat, le décor, le corps, les couleurs, les motifs, les accessoires, la voix, la langue, les sous-titres et le nom du Foyer. La Garde-robe garde des tenues nommées illimitées et le Studio de Biomes crée des habitats personnalisés illimités.',
      points: ['Appliquez ou retirez une tenue à tout moment, puis modifiez-la ou supprimez-la.', 'Les biomes personnalisés ont leurs couleurs, emoji, nom d’habitat et bonus d’XP.', 'La rangée de raccourcis du Wiki atteint dessins animés, comics, genres, variantes, le Coffre et l’éleveur en un geste.', 'Shortcut est une vraie espèce avec gène, habitats et hybride nommé.', 'Vous pouvez rejouer cette visite ou repartir de zéro depuis Studio.'],
      tip: 'Tenues et biomes personnalisés sont gratuits à créer, modifier et appliquer, sans limite.',
    },
    {
      kicker: 'PRÊT', title: 'Voilà tout le Foyer',
      text: 'Voilà tout le Foyer. Faites éclore un sprite, gardez ses besoins heureux, promenez-le ou jouez au sport, frottez un ventre ou jouez à attraper, jouez aux mini-jeux, visitez le Coffre, pointez chaque jour et remplissez l’encyclopédie. Le Wiki garde chaque règle et chaque fiche si un détail vous échappe.',
      points: ['Commencez par la barre de soins, un Œuf Sauvage dans le Nid ou un sentier depuis Promener.', 'La visite guidée peut être rejouée depuis Studio à tout moment.'],
      tip: 'Terminer cette étape donne le premier secret et ouvre les autres indices du Coffre.',
    },
  ],
};

/* The translated tour arrays are positional, but the tour itself inserts live and
   showcase steps at runtime, so the two lists drifted apart. Match them by key
   instead: each TOUR_STEPS entry names itself and every translation is looked up
   by that name, which keeps a step's text attached to the step it describes. */
const TOUR_I18N_KEYS = ['hollow', 'care', 'nest', 'growth', 'collection', 'dock', 'newcollections', 'biomes', 'games', 'arcade', 'today', 'heroes', 'secrets', 'studio', 'ready'];

const TOUR_KEYED = {};
Object.keys(TOUR_I18N).forEach((lang) => {
  const map = {};
  TOUR_I18N[lang].forEach((entry, i) => {
    const key = TOUR_I18N_KEYS[i];
    if (key) map[key] = entry;
  });
  TOUR_KEYED[lang] = map;
});

const TOUR_I18N_EXTRA = {
  es: {
    minigames: {
      kicker: 'MINIJUEGOS REALES', title: 'Tres juegos que responden',
      text: 'Atrapa Golosinas, Pulso Perfecto y Cava Monedas ya no son contadores. Cada uno tiene controles reales, su propia forma de fallar y una curva de habilidad que se nota.',
      points: ['Atrapa Golosinas se juega con una cesta que deslizas bajo los dulces; encadenar capturas da ×2, ×3 y ×4.', 'Pulso Perfecto tiene ventanas PERFECT!!, GREAT!, GOOD y MISS, y los combos suman multiplicador.', 'Cava Monedas es un tablero de 4×4 con números de radar, tres corazones y un botón Cobrar.'],
      tip: 'Fallar un dulce rompe la cadena, así que la constancia gana a la avaricia.',
    },
    duels: {
      kicker: 'ARCADE Y DUELOS', title: 'Congela, bloquea y remata',
      text: 'Los desafíos Arcade tienen hechizos y contragolpes. Asedio Zombi da un hechizo de congelación y una bomba de cereza; el Duelo del Hogar da un aviso ⚠️, un parry con aturdimiento y una barra de Súper.',
      points: ['❄️ Congelar detiene los carriles cuatro segundos, con ocho de recarga.', '🍒 La Bomba de Cereza limpia el carril con más zombis y solo se puede usar una vez.', 'Guarda justo cuando aparezca ⚠️: el parry aturde 2,2 segundos y los golpes hacen el doble de daño.', 'Con la barra al 100 %, el Remate Definitivo hace 75 de daño.'],
      tip: 'Abre Jugar → Arcade; los controles siempre aparecen bajo el tablero.',
    },
    fortnite: {
      kicker: 'FORTNITE EN TODOS LOS CAPÍTULOS', title: 'Cinco capítulos, una familia',
      text: 'El reparto Legacy de Fortnite reúne a sus protagonistas desde el Capítulo 1 hasta el 5 y el pase actual. Cada uno tiene arte vectorial original hecho desde su paleta, además de gen, Titán y huevo de tipo.',
      points: ['El Capítulo 2 trae los años de espías: Skye, Brutus, Jules, Kit y Mancake.', 'Los Capítulos 3 y 4 cruzan con Doom Slayer, Geralt, Optimus Prime y Peter Griffin.', 'El Capítulo 5 es el mítico: Zeus, Hades, Midas, Sub-Zero, Big Dill y Peelverine.', 'Reúne ocho especies Legacy para el Guardián de Temporada en la Bóveda.'],
      tip: 'Cada tarjeta es arte real del mismo reparto que vende el Nido.',
    },
    screen: {
      kicker: 'SE ADAPTA A TU PANTALLA', title: 'De un móvil pequeño a un escritorio',
      text: 'El diseño es fluido. Las tarjetas se reacomodan, la barra de cuidados queda siempre al alcance y la misma partida funciona en todo, desde un móvil de 320 píxeles hasta una ventana de escritorio.',
      points: ['Móvil compacto, 320–430 px: colección en una columna y botones del tamaño de un pulgar.', 'Tableta y plegable, 680–860 px: rejillas más anchas y reparto a dos columnas.', 'Escritorio, 1024 px o más: rejillas auto-fill, hojas centradas y control total por teclado.'],
      tip: 'Gira el dispositivo o cambia el tamaño de la ventana: nada se corta.',
    },
    favorites: {
      kicker: 'FAVORITOS Y CÓDEX', title: 'Ten cerca a los que quieres',
      text: 'Marca favoritos para que queden arriba en la colección y lee su ficha completa en el Códice y la Wiki. Cada juego, ruta y deporte sigue pagando al sprite activo, así que un favorito puede ser el que críes.',
      points: ['Los favoritos se ordenan primero en Sprites.', 'El Códice guarda la escalera de 12 rangos, genes, Titanes y cada hábitat.', 'Los artículos de la Wiki abren desde cualquier tarjeta y vuelven a su guía.'],
      tip: 'Busca en Sprites por nombre, elemento, secreto o exótico.',
    },
    dailyextras: {
      kicker: 'EXTRAS DIARIOS Y SEGURIDAD', title: 'Ruleta, clínica, fotos y guardados seguros',
      text: 'Algunos sistemas acompañan el ciclo diario de cuidados y cada uno paga o protege algo que ya usas.',
      points: [
        'Ruleta diaria: un giro gratis al día y dos giros extra que cuestan monedas. Todos los premios son monedas.',
        'Enfermería: un sprite descuidado puede resfriarse. Tres dosis de medicina o una visita a la clínica lo curan, y el termómetro y la marca de medicina muestran qué pasa.',
        'Banco de monedas: tu cartera vive fuera del guardado, así que las monedas ganadas sobreviven a un reinicio o a un Hogar reconstruido.',
        'Modo foto: abre la ficha familiar de un puffle y pulsa 📸 Foto para posarlo contra un escenario y un marco, y guarda el retrato.',
        'Herramientas de guardado: Studio → Ranuras del Hogar guarda partidas separadas, y Copia y restauración te da un código, un archivo descargado y el traspaso 📲 Nuevo teléfono.',
      ],
      tip: 'La ruleta, la clínica y el banco funcionan antes de tu primera fusión, así que úsalos mientras el Hogar es pequeño.',
    },
    tutorial: {
      kicker: 'TU PRIMER VUELO', title: 'Empieza el tutorial guiado',
      text: 'Primer Vuelo es el tutorial guiado que te lleva desde tu huevo inicial hasta tu primera fusión. Lee tu partida, así que cada paso que terminas queda terminado.',
      points: [
        'Eclosiona tu inicial, salúdalo con cualquier cuidado y luego toma el huevo de regalo y eclosiona tu segundo sprite.',
        'Sube a ambos al nivel 3: las recompensas de tareas y juegos comparten XP con tu pareja de fusión. Tu primera fusión no tiene coste y garantiza un híbrido.',
        'La tarjeta del Hogar guarda tu lugar y el Nido muestra la tarjeta de finalización tras tu primera fusión.',
        'Termina Primer Vuelo para recibir su recompensa de monedas y tentempié.',
      ],
      tip: 'Pulsa “Empezar el tutorial” para abrir Primer Vuelo. Puedes reabrirlo desde la tarjeta del Hogar cuando quieras.',
    },
  },
  fr: {
    minigames: {
      kicker: 'VRAIS MINI-JEUX', title: 'Trois jeux qui répondent',
      text: 'Attraper les friandises, Pulse Parfait et Creuser des pièces ne sont plus des compteurs. Chacun a de vrais contrôles, sa propre façon d’échouer et une vraie courbe de skill.',
      points: ['Attraper les friandises se joue avec un panier à faire glisser sous les en-cas ; enchaîner donne ×2, ×3 et ×4.', 'Pulse Parfait propose les fenêtres PERFECT!!, GREAT!, GOOD et MISS, et les combos montent le multiplicateur.', 'Creuser des pièces est une grille 4×4 avec radar, trois cœurs et un bouton Encaisser.'],
      tip: 'Rater une friandise casse la chaîne : la régularité bat la gourmandise.',
    },
    duels: {
      kicker: 'ARCADE ET DUELS', title: 'Geler, parer et achever',
      text: 'Les défis Arcade ont des sorts et des contres. Le Siège Zombie offre un gel et une bombe cerise ; le Duel du Foyer offre un avertissement ⚠️, une parade étourdissante et une jauge de Super.',
      points: ['❄️ Geler fige les couloirs quatre secondes, avec huit secondes de recharge.', '🍒 La Bombe Cerise vide le couloir le plus rempli, une seule fois par partie.', 'Gardez au moment du ⚠️ : la parade étourdit 2,2 secondes et les coups font double dégât.', 'À 100 %, le Coup Final inflige 75 dégâts.'],
      tip: 'Ouvrez Jouer → Arcade : les contrôles sont toujours écrits sous le plateau.',
    },
    fortnite: {
      kicker: 'FORTNITE, TOUS CHAPITRES', title: 'Cinq chapitres, une famille',
      text: 'Le casting Legacy de Fortnite réunit ses têtes d’affiche du chapitre 1 au chapitre 5 et de la passe actuelle. Chacun a un art vectoriel original tiré de sa palette, un gène, un Titan et un œuf de type.',
      points: ['Le chapitre 2 apporte les années espionnes : Skye, Brutus, Jules, Kit et Mancake.', 'Les chapitres 3 et 4 croisent Doom Slayer, Geralt, Optimus Prime et Peter Griffin.', 'Le chapitre 5 est mythique : Zeus, Hadès, Midas, Sub-Zero, Big Dill et Peelverine.', 'Réunissez huit espèces Legacy pour le Gardien de Saison dans le Coffre.'],
      tip: 'Chaque carte est l’art réel du même casting que vend le Nid.',
    },
    screen: {
      kicker: 'TOUS LES ÉCRANS', title: 'Du petit téléphone au bureau',
      text: 'La mise en page est fluide. Les cartes se réorganisent, la barre de soins reste accessible et la même sauvegarde fonctionne partout, d’un téléphone de 320 pixels à une grande fenêtre.',
      points: ['Téléphone compact, 320–430 px : collection sur une colonne et boutons au pouce.', 'Tablette et pliable, 680–860 px : grilles plus larges et distribution en deux colonnes.', 'Bureau, 1024 px et plus : grilles auto-fill, feuilles centrées et clavier complet.'],
      tip: 'Tournez l’appareil ou redimensionnez : rien n’est coupé.',
    },
    favorites: {
      kicker: 'FAVORIS ET CODEX', title: 'Gardez vos préférés près de vous',
      text: 'Marquez des favoris pour les garder en haut de la collection, puis lisez leur fiche complète dans le Codex et le Wiki. Chaque jeu, sentier et sport paie toujours le sprite actif.',
      points: ['Les favoris passent en premier dans Sprites.', 'Le Codex garde l’échelle des 12 rangs, les gènes, les Titans et chaque habitat.', 'Les articles du Wiki s’ouvrent depuis chaque carte et reviennent à leur guide.'],
      tip: 'Cherchez dans Sprites par nom, élément, secret ou exotique.',
    },
    dailyextras: {
      kicker: 'EXTRAS QUOTIDIENS ET SÉCURITÉ', title: 'Roue, clinique, photos et sauvegardes',
      text: 'Quelques systèmes accompagnent la boucle de soins quotidienne et chacun paie ou protège quelque chose que vous utilisez déjà.',
      points: [
        'Roue quotidienne : un tour gratuit par jour et deux tours bonus qui coûtent des pièces. Tous les prix sont des pièces.',
        'Infirmerie : un sprite négligé peut attraper froid. Trois doses de remède ou une visite à la clinique le soignent, et le thermomètre et le repère de remède montrent le problème.',
        'Banque de pièces : votre portefeuille vit hors de la sauvegarde, donc les pièces gagnées survivent à une réinitialisation ou à un Foyer reconstruit.',
        'Mode photo : ouvrez la fiche de famille d’un puffle et touchez 📸 Photo pour le poser dans un décor et un cadre, puis enregistrez le portrait.',
        'Outils de sauvegarde : Studio → Emplacements du Foyer garde des sauvegardes séparées, et Sauvegarde et restauration vous donne un code, un fichier téléchargé et le transfert 📲 Nouveau téléphone.',
      ],
      tip: 'La roue, la clinique et la banque fonctionnent avant votre première fusion ; utilisez-les tant que le Foyer est petit.',
    },
    tutorial: {
      kicker: 'VOTRE PREMIER VOL', title: 'Commencez le tutoriel guidé',
      text: 'Premier Vol est le tutoriel guidé qui vous mène de votre œuf de départ à votre première fusion. Il lit votre sauvegarde, donc chaque étape terminée reste terminée.',
      points: [
        'Faites éclore votre sprite de départ, dites-lui bonjour avec un soin, puis prenez l’œuf cadeau et faites éclore votre deuxième sprite.',
        'Montez les deux au niveau 3 : les récompenses de tâches et de jeux partagent l’XP avec votre partenaire de fusion. Votre première fusion est gratuite et garantit un hybride.',
        'La carte du Foyer garde votre place, et le Nid affiche la carte de réussite après votre première fusion.',
        'Terminez Premier Vol pour sa récompense en pièces et en-cas.',
      ],
      tip: 'Appuyez sur « Commencer le tutoriel » pour ouvrir Premier Vol. Vous pouvez le rouvrir depuis la carte du Foyer à tout moment.',
    },
  },
};

Object.keys(TOUR_I18N_EXTRA).forEach((lang) => {
  if (!TOUR_KEYED[lang]) TOUR_KEYED[lang] = {};
  Object.assign(TOUR_KEYED[lang], TOUR_I18N_EXTRA[lang]);
});

function tourStepText(step, index) {
  const lang = uiLang();
  const byKey = step && step.key && TOUR_KEYED[lang] ? TOUR_KEYED[lang][step.key] : null;
  const local = byKey || (TOUR_I18N[lang] && !step.key ? TOUR_I18N[lang][index] : null);
  if (!local) return step;
  return { ...step, ...local, points: local.points || step.points };
}
