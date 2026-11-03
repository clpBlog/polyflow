import { h } from "vue";

const PATHS = {
  "home": "<path d=\"m3 11 9-8 9 8\" /><path d=\"M5 10v10h14V10\" /><path d=\"M9 20v-6h6v6\" />",
  "task": "<path d=\"M9 5h11\" /><path d=\"M9 12h11\" /><path d=\"M9 19h11\" /> <path d=\"m3 5 1.2 1.2L6.5 4\" /><path d=\"m3 12 1.2 1.2L6.5 11\" /><path d=\"m3 19 1.2 1.2L6.5 18\" />",
  "book": "<path d=\"M4 19.5A2.5 2.5 0 0 1 6.5 17H20\" /> <path d=\"M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z\" />",
  "mail": "<rect width=\"18\" height=\"14\" x=\"3\" y=\"5\" rx=\"3\" /><path d=\"m3 7 9 6 9-6\" />",
  "settings": "<circle cx=\"12\" cy=\"12\" r=\"3\" /> <path d=\"M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z\" />",
  "search": "<circle cx=\"11\" cy=\"11\" r=\"7\" /><path d=\"m20 20-4-4\" />",
  "bell": "<path d=\"M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9\" /><path d=\"M10 21h4\" />",
  "arrow": "<path d=\"M5 12h14\" /><path d=\"m13 6 6 6-6 6\" />",
  "clock": "<circle cx=\"12\" cy=\"12\" r=\"9\" /><path d=\"M12 7v5l3 2\" />",
  "calendar": "<rect width=\"18\" height=\"17\" x=\"3\" y=\"4\" rx=\"3\" /><path d=\"M8 2v4M16 2v4M3 9h18\" />",
  "check": "<path d=\"m5 12 4 4L19 6\" />",
  "chevron": "<path d=\"m9 18 6-6-6-6\" />",
  "translate": "<path d=\"M4 5h8M8 3v2c0 4-2 7-5 9\" /><path d=\"M6 9c1 2 3 4 6 5\" /> <path d=\"m13 21 4-10 4 10M14.5 18h5\" />",
  "sparkles": "<path d=\"m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2L12 3Z\" /> <path d=\"m5 14 .8 2.2L8 17l-2.2.8L5 20l-.8-2.2L2 17l2.2-.8L5 14ZM19 13l.7 1.8 1.8.7-1.8.7L19 18l-.7-1.8-1.8-.7 1.8-.7L19 13Z\" />",
  "link": "<path d=\"M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.1 1\" /> <path d=\"M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.1-1\" />",
  "file": "<path d=\"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z\" /><path d=\"M14 2v6h6M8 13h8M8 17h5\" />",
  "video": "<rect width=\"14\" height=\"14\" x=\"2\" y=\"5\" rx=\"3\" /><path d=\"m16 10 6-3v10l-6-3\" />",
  "download": "<path d=\"M12 3v12M7 10l5 5 5-5M5 21h14\" />",
  "bookmark": "<path d=\"M6 3h12v18l-6-4-6 4V3Z\" />",
  "close": "<path d=\"m6 6 12 12M18 6 6 18\" />",
  "sun": "<circle cx=\"12\" cy=\"12\" r=\"4\" /><path d=\"M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4\" />",
  "plus": "<path d=\"M12 5v14M5 12h14\" />",
  "external": "<path d=\"M15 3h6v6M10 14 21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5\" />",
  "more": "<circle cx=\"5\" cy=\"12\" r=\"1\" fill=\"currentColor\" stroke=\"none\" /><circle cx=\"12\" cy=\"12\" r=\"1\" fill=\"currentColor\" stroke=\"none\" /><circle cx=\"19\" cy=\"12\" r=\"1\" fill=\"currentColor\" stroke=\"none\" />",
  "command": "<path d=\"M18 9a3 3 0 1 0-3-3v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12Z\" />",
  "cloud": "<path d=\"M17.5 19H7a5 5 0 1 1 1.5-9.8A6 6 0 0 1 20 12a3.5 3.5 0 0 1-2.5 7Z\" />",
  "moon": "<path d=\"M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z\" />",
  "menu": "<path d=\"M4 7h16M4 12h16M4 17h10\" />",
  "refresh": "<path d=\"M20 11a8 8 0 0 0-14.3-4.9L4 8\" /><path d=\"M4 3v5h5\" /><path d=\"M4 13a8 8 0 0 0 14.3 4.9L20 16\" /><path d=\"M20 21v-5h-5\" />",
  "left": "<path d=\"m15 18-6-6 6-6\" />",
  "lock": "<rect width=\"16\" height=\"11\" x=\"4\" y=\"10\" rx=\"2.5\" /><path d=\"M8 10V7a4 4 0 0 1 8 0v3\" />"
};

export default {
  name: "Icon",
  props: { name: { type: String, required: true }, size: { type: [Number, String], default: 18 } },
  setup(props) {
    return () =>
      h("svg", {
        class: "icon",
        width: props.size,
        height: props.size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        "stroke-width": 1.8,
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "aria-hidden": "true",
        innerHTML: PATHS[props.name] || ""
      });
  }
};
