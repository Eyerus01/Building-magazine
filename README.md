# Modern Dev Magazine

A beautiful, interactive, and dynamic digital magazine web application built with Vanilla HTML, CSS, and JavaScript. The application leverages real-world data by integrating the open Wikipedia API, allowing users to search and read high-quality articles on any topic instantly.

## 🌟 Features

* **Global Search (Wikipedia API):** Search for any topic and get real, dynamic magazine covers generated on the fly.
* **Full-Page Article Reader:** Click any magazine to seamlessly transition into a beautiful, full-page article reading experience.
* **Dynamic Article Generation:**
  * Pulls real article text, author details, and publishing dates via Wikipedia's Revision API.
  * Automatically generates a beautiful "Drop-Cap" for the first letter of the text.
  * Auto-generates a Table of Contents based on the article's subheadings.
* **Premium Glassmorphism UI:** Built with sleek, modern UI trends utilizing `backdrop-filter`, smooth gradients, and clean typography.
* **Interactive 3D Tilt Cards:** Magazine covers feature an immersive 3D tilt-effect that reacts to mouse movement.
* **Dark/Light Mode:** Full system-preference detection with a manual toggle switch that persists via `localStorage`.
* **Scroll Progress Bar:** Visual indicator at the top tracking your reading progress.

## 🛠️ Technology Stack

* **HTML5:** Semantic structure and accessible elements.
* **CSS3:** Vanilla CSS featuring Grid/Flexbox layouts, CSS variables, and complex UI animations.
* **JavaScript (ES6+):** Pure vanilla JS for state management, API data fetching (`fetch`), DOM manipulation, and dynamic component rendering. No external frameworks used!
* **APIs & Resources:**
  * Wikipedia API (Real-time data fetching)
  * LoremFlickr (Dynamic imagery generation)
  * FontAwesome (Iconography)
  * Google Fonts (Inter & Playfair Display)

## 🚀 How to Run Locally

1. Clone this repository.
2. Open the directory in your code editor.
3. Simply launch `index.html` in your favorite modern browser (or use a local development server like Live Server).
4. No build steps or `npm` installations required!

## 📸 Usage

- Use the top navigation bar to toggle between Light and Dark mode.
- Use the search bar to look up specific topics (e.g., "Architecture", "Quantum Computing").
- Alternatively, click the quick-filter category pills.
- Click the **"Read Full Magazine"** button on any generated cover to enter the immersive article view.
- Click the `X` button in the top right to return to the explore grid.
