# Portfolio Website — Bento Style (Concept & Implementation Guide)

This README explains the concept, structure, and animation logic behind your Bento‑style portfolio website. The website follows a **scroll‑less vertical layout**, where the **page itself does not scroll**. Instead, **content blocks (bento boxes) translate, fade, or glide** into new positions to reveal sections.

The wireframe you created outlines four major sections:

1. **Hero Section**
2. **Project Gallery (Scrollable internally)**
3. **Project View (On Click)**
4. **About + Social Section**

Each section transitions using container‑level animations rather than page scroll.

---

## 🧩 Key Concept — Bento Style + Controlled Motion Layout

Your layout style is inspired by **Bento UI**, which emphasizes:

* Clean grid‑based blocks
* Rounded boxes
* Smooth micro‑interactions
* Modular components
* Non‑scroll, staged transitions

Your twist on it: The site behaves like a **motion storyboard** — when the user scrolls, instead of the page moving, **the content rearranges itself**.

You control all movement through:

* `transform: translateY()`
* `opacity transitions`
* `clip‑path animations`
* `framer‑motion` (React) or CSS keyframes

---

## 🎨 Section Breakdown

### 1️⃣ Hero Section

Includes:

* Navbar (Github | Projects | About me | Socials)
* Intro ("Hello, I am Shashwat")
* Small music player
* Mini project gallery preview (3–4 boxes)
* Large display box on the right (Hero visual or animation)

**Transition behavior:**
When the user scrolls:

* Mini gallery boxes slide out
* Hero image fades/zooms out
* Entire hero transforms into Project Gallery layout

---

### 2️⃣ Project Gallery (Stage 1)

Contains:

* Horizontal scroll bar inside the gallery container (not page scroll)
* Project cards (3–5 visible at a time)
* Labels under each project

**Transition behavior:**
Scrolling down:

* Hero content collapses upward
* Gallery slides in from bottom
* Cards stagger in one by one

---

### 3️⃣ Project Expanded View (On Click)

Contains:

* Big project image carousel (center)
* Thumbnails on sides with arrows
* Description area on the right

**Transition behavior:**
On clicking a project card:

* Gallery boxes shrink and move to left sidebar
* Big preview animates into center
* Right panel expands from zero width

---

### 4️⃣ About + Social Section

Contains:

* Text content box (About Me)
* Profile image / larger box
* Socials section with 3 large round icons (LinkedIn, Instagram, Twitter)

**Transition behavior:**
Scrolling down:

* Project view exits by sliding downward
* About section glides upward and fades in
* Social icons scale in with a spring animation

---

## 🛠️ Core Tech Stack Suggestion

### Frontend: **NextJs + Tailwind + Framer Motion**

* Bento grid layout → Tailwind
* Smooth transitions → Framer Motion
* Perfect for staged, scroll‑triggered animations

### Optional Enhancements:

* GSAP ScrollTrigger (if you want more cinematic effects)
* Lottie animations in hero

---

## ✨ Animation Logic (High‑Level)

### Concept: *Scroll is just a trigger*.

The window does NOT scroll normally.
You disable page scrolling:

```css
body {
  overflow: hidden;
}
```

Instead, detect scroll wheel direction:

```js
window.addEventListener('wheel', (e) => {
  if (e.deltaY > 0) goToNextSection();
  else goToPrevSection();
});
```

Each section is a motion container:

```jsx
<motion.div
  animate={{ y: activeIndex === 1 ? 0 : '-100vh' }}
/>
```

The entire site is essentially **4 stacked containers**, and you animate between them.

---

## 📂 Recommended File Structure

```
src/
  components/
    Hero/
    Projects/
    ProjectView/
    About/
    Socials/
  hooks/
    useScrollStage.js
  data/
    projects.json
  assets/
    thumbnails/
    icons/
  App.jsx
  index.css
```

---

## 🪄 Motion Timing

Suggested framer‑motion timings:

```
transition={{
  duration: 0.8,
  ease: [0.25, 0.1, 0.25, 1]
}}
```

Hero → Projects: fade + translateY(+100px)
Projects → ProjectView: scale + right‑panel slide
ProjectView → About: curtain‑style upward slide

---

## 🚀 Future Enhancements

* Add 3D Three.js model in the hero section (man on beanbag working on laptop)
* Add parallax background glow effects
* Add hover depth/shadow animations
* Add smooth sound effects when switching sections

---

## 🏁 Summary

Your portfolio is:

* Bento‑styled
* Non‑scrolling parent, animated child containers
* Smooth, cinematic transitions
* Clean grid‑based layout with modular UI

This README fully documents the structure and approach for the design you created in the wireframe.

You can expand this document whenever new components or animation rules are added.
