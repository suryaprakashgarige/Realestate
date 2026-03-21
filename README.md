# LuxeNest Realty 🏡

A premium, immersive Real Estate template built with **Next.js 15**, **Tailwind CSS**, and **GSAP/Three.js** for full Cinematic scrolling and high-end visual experiences.

---

## 🚀 Key Features

*   **Cinematic Scroll Hero**: A immersive, viewport-driven scroll video or 3D scene that anchors the page load.
*   **Smooth Scroll Navigation**: Driven by **Lenis**, keeping interactions perfectly in sync with scrolling triggers.
*   **Interactive Map Search**: Fast map integration built with **Mapbox GL** for exploring target neighborhoods.
*   **3D / Visual Enhancements**: High-fidelity overlays using **Three.js** (`@react-three/fiber`) and **Spline** for 3D component showcases.
*   **Functional Helpers**:
    *   Dynamic Search queries
    *   Neighborhood analysis guides
    *   Mortgage Calculator with real-time feedback
    *   AI Property Matching placeholders

---

## 🛠️ Tech Stack

*   **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Animations**: [GSAP](https://gsap.com/) + [Framer Motion](https://framer.motion/)
*   **3D Engine**: [Three.js](https://threejs.org/) & [Spline](https://spline.design/)
*   **Maps**: [Mapbox GL](https://www.mapbox.com/)
*   **Smooth Scroll**: [Lenis](https://lenis.darkroom.engineering/)
*   **Backend / DB**: [Supabase](https://supabase.com/)

---

## 🛠️ Installation & Setup

1.  Clone the repository and install dependencies:
    ```bash
    npm install
    ```

2.  Create a `.env.local` based on your project requirements with access tokens for Mapbox and Supabase:
    ```bash
    # Example
    NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🤝 Contribution

Feel free to fork and open pull requests. For major changes, please open an issue first to discuss what you would like to improve.
