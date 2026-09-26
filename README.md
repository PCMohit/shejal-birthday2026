# Shejal Birthday Surprise — Optimized Edition 🎂💌

This is the optimized mobile-first version of the birthday website. It keeps the original story, gallery, quiz, secret section and celebration, and adds:

- faster initial page loading
- lazy-loaded video files
- optimized WebP images
- smoother scroll/reveal behavior
- an honest YES/NO final question (the NO button no longer dodges)
- a soft-launch boyfriend question shown in an animated popup
- a reply form for website feedback + the soft-launch answer + anything else she wants to write

## Folder structure

```
index.html
style.css
script.js
config.js
README.md
FORM_SETUP.md
assets/
```

## Important
GitHub Pages serves static files, so it cannot itself store form submissions. This version uses FormSubmit for the reply form. Configure the endpoint in `config.js` before publishing.


### Recent form update
- Name / nickname is required before submitting the reply.
- The free-text field is labeled “Tell me your thoughts”.
- The final celebration photo and text are explicitly centered for consistent alignment across desktop and mobile.
