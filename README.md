# react-native-libraries

A list of libraries for my React Native apps

- Include plugins to fix build issues

## Essentials

- https://github.com/software-mansion/react-native-reanimated
- https://github.com/software-mansion/react-native-gesture-handler
- https://github.com/AppAndFlow/react-native-safe-area-context
- https://github.com/kirillzyusko/react-native-keyboard-controller

## Layering

### Sheet

Links:

- https://github.com/doanhtu07/react-native-the-sheet

---

- Alternative to https://github.com/gorhom/react-native-bottom-sheet
- Support bottom sheets out of the box
- But you can also use it for stacking modals, center sheets, etc. since it provides primitive components to build your own sheets
- For support other types of sheets, create GitHub issues on the repo

### Native sheet

Links:

- https://github.com/lodev09/react-native-true-sheet

---

- Support native sheet components
- But it lacks complicated features like managing stacking sheets and custom gestures

### Native context menu

Links:

- https://github.com/react-native-menu/menu

---

- Native menu components

### Floating UI

Links:

- https://floating-ui.com/docs/react-native

---

- Support positioning floating elements
- You can manually implement this, but this library core already implements collision detection, flipping, and other positioning features for you

## Special renderer

### 2D graphics

Links:

- https://github.com/Shopify/react-native-skia

---

- Support drawing any kind of 2D graphics
- Useful for custom visualizations + animations

### File viewer

Links:

- https://github.com/Vadko/react-native-file-viewer-turbo

---

- Support viewing files any types of files with platform native viewers

### Markdown renderer

Links:

- https://www.npmjs.com/package/react-native-markdown-display (Unmaintained but could be used if your React Native version is lower than 0.82)
- https://github.com/software-mansion/enriched-markdown (Requires React Native 0.82+)

---

- Support rendering Markdown content
- Useful for displaying content from CMS or AI chat interfaces

## Gestures

### Zoom (+ gallery)

Links:

- https://github.com/Glazzes/react-native-zoom-toolkit/
- https://github.com/pavelbabenko/react-native-awesome-gallery (Unmaintained but good)

---

`react-native-zoom-toolkit` supports:

- Different types of primitive zooming
- A gallery component out of the box

I haven't used this library much, so I need to test it again when time comes

### Press

Links:

- https://github.com/enzomanuelmangano/pressto

---

- Support animated press effects

### Declarative animation

Links:

- https://github.com/AppAndFlow/react-native-ease

---

- Support declarative animation using native platform APIs

### Haptics

Links:

- https://github.com/software-mansion/pulsar
- https://docs.expo.dev/versions/latest/sdk/haptics

---

- Support haptic feedback (physical sensations)

## Storage

### Persistent relational storage

Links:

- https://docs.expo.dev/versions/latest/sdk/sqlite/
- https://github.com/margelo/react-native-nitro-sqlite

---

- Recommended if you store huge amount of data in your app locally
- Useful for local-first apps

### Persistent key-value storage

Links:

- https://github.com/margelo/react-native-mmkv

---

- Use MMKV for simple data like user preferences, settings, sessions, etc.
- Avoid using it for huge amount of data, use SQLite instead
- MMKV is fast and synchronous, but it means loading all the memory mappings (`mmap`) into memory at once
- Storing JSON data in MMKV is also awkward since you need to serialize/deserialize it manually
