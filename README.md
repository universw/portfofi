# Henry HoangQuan Nguyen — Portfolio

Personal portfolio website showcasing Cloud & DevOps engineering work, infrastructure-as-code projects, and multilingual capabilities. Deployed on Firebase Hosting.

**Live site:** https://portfo-38945.web.app/

---

## Highlights

- **Multilingual** — English, Japanese, Vietnamese, Chinese, German (5 languages)
- **Featured projects** — SecureVault (AWS + Terraform IaC), Portfofia (Firebase platform), LifeHub AI Cloud (GCP + Firebase + Terraform)
- **Resume** — Embedded multilingual PDF viewer with downloads in all 5 languages
- **Responsive design** — Optimized layout from mobile to desktop
- **Lightweight** — Vanilla HTML/CSS/JS, no build step, no framework runtime

---

## Tech Stack

**Frontend**
- HTML5, CSS3, vanilla JavaScript
- Custom i18n system (`js/translations.js`)
- Lightbox and theme modules

**Hosting & Infrastructure**
- Firebase Hosting (CDN-backed static delivery)
- Firebase project config in `firebase.json`

---

## Project Structure

```
.
├── index.html              Main page
├── 404.html                Hosting fallback
├── css/style.css           All styles
├── js/
│   ├── translations.js     i18n strings (en/ja/vi/zh/de)
│   ├── lang.js             Language switcher
│   ├── theme.js            Dark/light mode
│   └── lightbox.js         Image gallery
├── assets/
│   ├── images/             Project architecture SVGs
│   ├── certs/              Certificate photos
│   ├── resume/             Resume PDFs (5 languages)
│   └── sounds/             UI audio
└── firebase.json           Hosting config
```

---

## Local Development

No build step required.

```bash
# Serve with any static server, e.g.
python3 -m http.server 8000
# or
npx serve .
```

Open http://localhost:8000.

---

## Deploy

```bash
firebase deploy --only hosting
```

---

## About the Author

**Henry HoangQuan Nguyen** — Cloud & DevOps Engineer based in Ho Chi Minh City, Vietnam. Open to remote and relocation roles in Vietnam, Japan, Singapore, and Europe.

- Languages: English, Japanese (JLPT N2), Vietnamese, Chinese (HSK1), German (basic)
- Certifications: JLPT N2, TOEIC 665, MOS
- Focus: AWS · GCP · Terraform · CI/CD · Linux

**Contact**
- LinkedIn: https://www.linkedin.com/in/henry-hoangquan-nguyen
- GitHub: https://github.com/universw

---

© 2026 Henry HoangQuan Nguyen. All rights reserved.
