Array.prototype.remove = function (el) {
  return this.splice(this.indexOf(el), 1);
};
const InstrumentEnum = Object.freeze({
  BONGO: 0,
  KEYBOARD: 1,
  MEOW: 3,
  CYMBAL: 4,
  MARIMBA: 5,
  TAMBOURINE: 6,
  COWBELL: 7,
});
const KeyEnum = Object.freeze({
  A: 1,
  D: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  0: 0,
  " ": 0,
  C: 1,
  Q: 1,
  W: 2,
  E: 3,
  R: 4,
  T: 5,
  Y: 6, // QWERTY-Layout
  Z: 6, // QWERTZ-Layout
  U: 7,
  I: 8,
  O: 9,
  P: 0,
  B: 1,
  F: 1,
});
const InstrumentPerKeyEnum = Object.freeze({
  A: InstrumentEnum.BONGO,
  D: InstrumentEnum.BONGO,
  1: InstrumentEnum.KEYBOARD,
  2: InstrumentEnum.KEYBOARD,
  3: InstrumentEnum.KEYBOARD,
  4: InstrumentEnum.KEYBOARD,
  5: InstrumentEnum.KEYBOARD,
  6: InstrumentEnum.KEYBOARD,
  7: InstrumentEnum.KEYBOARD,
  8: InstrumentEnum.KEYBOARD,
  9: InstrumentEnum.KEYBOARD,
  0: InstrumentEnum.KEYBOARD,
  " ": InstrumentEnum.MEOW,
  C: InstrumentEnum.CYMBAL,
  Q: InstrumentEnum.MARIMBA,
  W: InstrumentEnum.MARIMBA,
  E: InstrumentEnum.MARIMBA,
  R: InstrumentEnum.MARIMBA,
  T: InstrumentEnum.MARIMBA,
  Y: InstrumentEnum.MARIMBA, // QWERTY-Layout
  Z: InstrumentEnum.MARIMBA, // QWERTZ-Layout
  U: InstrumentEnum.MARIMBA,
  I: InstrumentEnum.MARIMBA,
  O: InstrumentEnum.MARIMBA,
  P: InstrumentEnum.MARIMBA,
  B: InstrumentEnum.TAMBOURINE,
  F: InstrumentEnum.COWBELL,
});
const ClickKeyEquivalentEnum = Object.freeze({
  1: "A",
  2: " ",
  3: "D",
});
const TapKeyEquivalentEnum = Object.freeze({
  "tap-left": {
    BONGO: ["A"],
  },
  "tap-right": {
    BONGO: ["D"],
    CYMBAL: ["C"],
    TAMBOURINE: ["B"],
    COWBELL: ["F"],
  },
  "tap-space": {
    MEOW: [" "],
  },
  "tap-1": {
    KEYBOARD: ["1"],
    MARIMBA: ["Q"],
  },
  "tap-2": {
    KEYBOARD: ["2"],
    MARIMBA: ["W"],
  },
  "tap-3": {
    KEYBOARD: ["3"],
    MARIMBA: ["E"],
  },
  "tap-4": {
    KEYBOARD: ["4"],
    MARIMBA: ["R"],
  },
  "tap-5": {
    KEYBOARD: ["5"],
    MARIMBA: ["T"],
  },
  "tap-6": {
    KEYBOARD: ["6"],
    MARIMBA: ["Y", "Z"],
  },
  "tap-7": {
    KEYBOARD: ["7"],
    MARIMBA: ["U"],
  },
  "tap-8": {
    KEYBOARD: ["8"],
    MARIMBA: ["I"],
  },
  "tap-9": {
    KEYBOARD: ["9"],
    MARIMBA: ["O"],
  },
  "tap-0": {
    KEYBOARD: ["0"],
    MARIMBA: ["P"],
  },
});
const TapKeysPerLayerEnum = Object.freeze({
  "layer-bongo": ["tap-left", "tap-right"],
  "layer-keyboard": ["tap-keys"],
  "layer-meow": ["tap-space"],
  "layer-cymbal": ["tap-right"],
  "layer-marimba": ["tap-keys"],
  "layer-tambourine": ["tap-right"],
  "layer-cowbell": ["tap-right"],
});
const LayersPerInstrumentEnum = Object.freeze({
  "layer-bongo": InstrumentEnum.BONGO,
  "layer-keyboard": InstrumentEnum.KEYBOARD,
  "layer-meow": InstrumentEnum.MEOW,
  "layer-cymbal": InstrumentEnum.CYMBAL,
  "layer-marimba": InstrumentEnum.MARIMBA,
  "layer-tambourine": InstrumentEnum.TAMBOURINE,
  "layer-cowbell": InstrumentEnum.COWBELL,
});
var pressed = [];
var currentLayer;
var allLayers = [];
for (var tapKeysPerInstrument of Object.values(TapKeysPerLayerEnum)) {
  allLayers.push(...tapKeysPerInstrument);
}
allLayers = [...new Set(allLayers)];
$(document).ready(function () {
  lowLag.init({
    urlPrefix: "./sounds/",
    debug: "none",
  });
  $.load("bongo", 0, 1);
  $.load("keyboard", 0, 9);
  $.load("marimba", 0, 9);
  $.loadSimple("meow");
  $.loadSimple("cymbal");
  $.loadSimple("tambourine");
  $.loadSimple("cowbell");
  $.layers("layer-bongo");
  $("select#select-instrument").on("change", function () {
    $.layers($(this).val());
  });
});
$.loadSimple = function (file) {
  for (i = 0; i <= 1; i++) {
    lowLag.load([file + ".mp3", file + ".wav"], file + i);
  }
};
$.load = function (file, start, end) {
  for (i = start; i <= end; i++) {
    lowLag.load([file + i + ".mp3", file + i + ".wav"], file + i);
  }
};
$.wait = function (callback, ms) {
  return window.setTimeout(callback, ms);
};
$.play = function (instrument, key, state) {
  var instrumentName = Object.keys(InstrumentEnum)
    .find((k) => InstrumentEnum[k] === instrument)
    .toLowerCase();
  var commonKey = KeyEnum[key];
  if (commonKey !== undefined) {
    var id =
      "#" +
      (instrument == InstrumentEnum.MEOW
        ? "mouth"
        : "paw-" +
          ((instrument == InstrumentEnum.BONGO
            ? commonKey
            : commonKey <= 5 && commonKey != 0
            ? 0
            : 1) == 0
            ? "left"
            : "right"));
    if (state == true) {
      if (jQuery.inArray(commonKey, pressed) !== -1) {
        return;
      }
      pressed.push(commonKey);
      if (instrument != InstrumentEnum.MEOW) {
        $(".instruments>div").each(function (index) {
          $(this).css(
            "visibility",
            $(this).attr("id") === instrumentName ? "visible" : "hidden"
          );
        });
      }
      lowLag.play(instrumentName + commonKey);
      $.layers(
        Object.keys(LayersPerInstrumentEnum).find(
          (k) => LayersPerInstrumentEnum[k] == instrument
        ),
        true
      );
    } else {
      pressed.remove(commonKey);
    }
    $(id).css("background-position-x", state ? "-800px" : "0");
  }
};
$.layers = function (selectedLayer) {
  if (selectedLayer !== currentLayer) {
    currentLayer = selectedLayer;
    var layers = TapKeysPerLayerEnum[selectedLayer];
    if (layers != undefined) {
      for (var layer of allLayers) {
        $("#" + layer).css(
          "display",
          layers.includes(layer) ? "inline-block" : "none"
        );
      }
      var instrument = LayersPerInstrumentEnum[selectedLayer];
      var instrumentName = Object.keys(InstrumentEnum)
        .find((k) => InstrumentEnum[k] === instrument)
        .toLowerCase();
      if (instrument != InstrumentEnum.MEOW) {
        $(".instruments>div").each(function (index) {
          $(this).css(
            "visibility",
            $(this).attr("id") === instrumentName ? "visible" : "hidden"
          );
        });
      }
    }
    var layerPerKey = Object.keys(LayersPerInstrumentEnum);
    for (var i = 0; i < layerPerKey.length; i++) {
      if (layerPerKey[i] === selectedLayer) {
        $("select#select-instrument>option:eq(" + i + ")").prop(
          "selected",
          true
        );
      }
    }
  }
};
$(document).bind("contextmenu", function (e) {
  e.preventDefault();
});

// $(document).on("mousedown mouseup", function (e) {
//   if (
//     !window.matchMedia("(pointer: coarse)").matches &&
//     !$(e.target).is("a, a *")
//   ) {
//     var keyboardEquivalent = ClickKeyEquivalentEnum[e.which];
//     if (keyboardEquivalent != undefined) {
//       var instrument = InstrumentPerKeyEnum[keyboardEquivalent.toUpperCase()];
//       var key = KeyEnum[keyboardEquivalent.toUpperCase()];
//       if (instrument != undefined && key != undefined) {
//         $.play(instrument, key, e.type === "mousedown");
//       }
//     }
//   }
// });
$(document).on("keydown keyup", function (e) {
  var instrument = InstrumentPerKeyEnum[e.key.toUpperCase()];
  if (instrument != undefined && e.key === " ") {
    e.preventDefault();
    $.play(instrument, e.key.toUpperCase(), e.type === "keydown");
  }
});

// $(document).on("touchstart touchend", function (e) {
//   if (e.target.classList.contains("layer")) {
//     if (e.type === "touchstart") {
//       $(e.target).addClass("highlight");
//       $.layers(e.target.id, true);
//     } else {
//       $(e.target).removeClass("highlight");
//     }
//   } else {
//     var instrument = LayersPerInstrumentEnum[currentLayer];
//     if (instrument != undefined) {
//       var keys = TapKeyEquivalentEnum[e.target.id];
//       if (keys != undefined) {
//         var instrumentName = Object.keys(InstrumentEnum).find(
//           (k) => InstrumentEnum[k] === instrument
//         );
//         if (instrumentName != undefined && keys[instrumentName] != undefined) {
//           for (var key of keys[instrumentName]) {
//             if (key != undefined) {
//               if (e.type === "touchstart") {
//                 $(e.target).addClass("highlight");
//               } else {
//                 $(e.target).removeClass("highlight");
//               }
//               $.play(instrument, key, e.type === "touchstart");
//             }
//           }
//         }
//       }
//     }
//   }
// });

var link_StrayRogue =
  '<a href="https://twitter.com/StrayRogue" target="_blank">@StrayRogue</a>';
var link_DitzyFlama =
  '<a href="https://twitter.com/DitzyFlama" target="_blank">@DitzyFlama</a>';
var link_EricHuber =
  '<a href="https://eric.gg/?utm_source=bongo.cat" target="_blank">Eric Huber</a>';
var i18n_map = {
  Bongos: {
    en: "Bongos",
    ca: "Bongos",
  },
  Cymbal: {
    en: "Cymbal",
    ca: "Plat",
  },
  Cowbell: {
    en: "Cowbell",
    ca: "Esquellot",
  },
  Tambourine: {
    en: "Tambourine",
    ca: "Pandereta",
  },
  Meow: {
    en: "Meow",
    ca: "Miol",
  },
  SPACE: {
    en: "SPACE",
    ca: "ESPAI",
  },
  Piano: {
    en: "Piano",
    ca: "Piano",
  },
  Marimba: {
    en: "Marimba",
    ca: "Marimba",
  },
  Keyboard: {
    en: "Keyboard",
    ca: "Teclat",
  },
  LEFT: {
    en: "LEFT",
    ca: "ESQUERRA",
  },
  RIGHT: {
    en: "RIGHT",
    ca: "DRETA",
  },
  MEOW: {
    en: "MEOW",
    ca: "MIOL",
  },
  "other-lang": {
    en: '<a href="/?lang=ca">En català</a>',
    ca: '<a href="/?lang=en">In English</a>',
  },
  courtesy: {
    en: "Art courtesy of " + link_StrayRogue,
    ca: "Art per cortesia de " + link_StrayRogue,
  },
  meme: {
    en: "Meme by " + link_DitzyFlama,
    ca: "Meme de " + link_DitzyFlama,
  },
  website: {
    en: "Website by " + link_EricHuber,
    ca: "Lloc web d&#39" + link_EricHuber,
  },
  cookies: {
    en: "This website uses cookies to analyze traffic via anonymized and aggregated data.",
    ca: "Aquest lloc web utilitza galetes per analitzar el trànsit mitjançant dades agregades i anonimitzades.",
  },
};

var supportedLanguages = { ca: true, en: true };
function preferredLang() {
  const urlParams = new URLSearchParams(window.location.search);
  var urlLang = urlParams.get("lang");
  if (urlLang !== null && supportedLanguages[urlLang]) {
    return urlLang;
  }

  var langs = window.navigator.languages;
  for (var i = 0; i < langs.length; i++) {
    /* 2 is the length of ISO 639-1 language codes
     * which are the start of BCP-47 codes
     */
    var code = langs[i].substring(0, 2);
    var l = supportedLanguages[code];
    if (l) {
      return code;
    }
  }
  return "en";
}

var piano = InstrumentEnum.KEYBOARD;
var pianoSheet = [
  ["1", "1", "3", "1", "6", "5"],
  ["1", "1", "3", "1", "8", "6"],
  ["1", "1", "0", "8", "6", "5", "3"],
  ["0", "0", "8", "5", "8", "6"],
];

var marimba = InstrumentEnum.MARIMBA;
var marimbaSheet = [
  ["q", "q", "e", "q", "y", "t"],
  ["q", "q", "e", "q", "i", "y"],
  ["q", "q", "p", "i", "y", "t", "e"],
  ["p", "p", "i", "y", "i", "y"],
];

var hpbdNote = [
  [0, 240, 240, 240, 360, 240],
  [480, 240, 240, 240, 360, 240],
  [480, 240, 240, 240, 360, 240, 240],
  [480, 240, 240, 240, 360, 240],
];
// var hpbdNote = [
//   [240, 240, 360, 240, 480, 360], // Happy birthday to you
//   [240, 240, 360, 240, 480, 360], // Happy birthday to you
//   [240, 240, 360, 240, 360, 240, 480], // Happy birthday dear [Name]
//   [240, 240, 360, 240, 480, 480], // Happy birthday to you
// ];

var hpbdNoteFlaten = hpbdNote.flatMap((x) => x);

var playSheet = (sheet, instrument) => {
  const delayGlobal = 1000;
  const timeOutIds = [];

  sheet.forEach((p, o) =>
    p.forEach((x, y) => {
      const delayArray =
        o < 3
          ? hpbdNoteFlaten.slice(0, o * 6 + y + 1)
          : hpbdNoteFlaten.slice(0, o * 6 + y + 1 + 1);
      const delay = delayArray.reduce((x, y) => x + y) + delayGlobal;

      timeOutIds.push(
        setTimeout(() => {
          $.play(instrument, x?.toUpperCase(), false);
          $.play(instrument, x?.toUpperCase(), true);
        }, delay)
      );
      timeOutIds.push(
        setTimeout(() => {
          $.play(instrument, x?.toUpperCase(), false);
        }, delay + 50)
      );
    })
  );

  timeOutIds.push(
    setTimeout(() => {
      $.play(InstrumentEnum.MEOW, " ", false);
      $.play(InstrumentEnum.MEOW, " ", true);
    }, 0)
  );
  timeOutIds.push(
    setTimeout(() => {
      $.play(InstrumentEnum.MEOW, " ", false);
    }, 200)
  );
  timeOutIds.push(
    setTimeout(() => {
      $.play(InstrumentEnum.MEOW, " ", false);
      $.play(InstrumentEnum.MEOW, " ", true);
    }, hpbdNoteFlaten.reduce((x, y) => x + y) + 50 + delayGlobal)
  );
  timeOutIds.push(
    setTimeout(() => {
      $.play(InstrumentEnum.MEOW, " ", false);
      playConfetti();
    }, hpbdNoteFlaten.reduce((x, y) => x + y) + 50 + delayGlobal + 200)
  );

  return () => timeOutIds.forEach((x) => clearTimeout(x));
};

var playConfetti = () => {
  const duration = 1 * 1000;
  const defaults = {
    startVelocity: 80,
    spread: 70,
    gravity: 0.9,
    particleCount: 100,
  };

  // Bottom Left → Center
  confetti({
    ...defaults,
    startVelocity: 40,
    origin: { x: 0, y: 1 },
    angle: 60,
  });

  // Bottom Left → Center
  confetti({
    ...defaults,
    origin: { x: 0, y: 1 },
    angle: 60,
  });

  // Bottom Right → Center
  confetti({
    ...defaults,
    startVelocity: 40,
    origin: { x: 1, y: 1 },
    angle: 120,
  });

  // Bottom Right → Center
  confetti({
    ...defaults,
    origin: { x: 1, y: 1 },
    angle: 120,
  });

  // Bottom Center → Center
  confetti({
    ...defaults,
    startVelocity: 40,
    origin: { x: 0.5, y: 1 },
    angle: 90,
  });

  // Bottom Center → Center
  confetti({
    ...defaults,
    origin: { x: 0.5, y: 1 },
    angle: 90,
  });
};

var temp = [];

pianoHbpd = () => {
  temp.forEach((x) => x());
  temp = [];

  //const t = setInterval(() => {
  temp.push(playSheet(pianoSheet, piano));
  //}, 10000);

  temp.push(playSheet(pianoSheet, piano));
  //temp.push(() => clearInterval(t));
};

marimbaHbpd = () => {
  temp.forEach((x) => x());
  temp = [];

  //const t = setInterval(() => {
  temp.push(playSheet(marimbaSheet, marimba));
  //}, 10000);

  temp.push(playSheet(marimbaSheet, marimba));
  //temp.push(() => clearInterval(t));
};

function internationalize() {
  var lang = preferredLang();
  $("[i18n]").each(function () {
    var id = $(this).attr("i18n");
    this.innerHTML = i18n_map[id][lang];
  });
  $("html").attr("lang", lang);
}
window.addEventListener("languagechange", internationalize);
document.addEventListener("DOMContentLoaded", internationalize);

window.addEventListener("load", (event) => {
  // $.play(piano, "1", true);
  // $.play(piano, "1", false);
});
