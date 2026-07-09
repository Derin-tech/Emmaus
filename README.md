# Ajesh Joe - Chemistry Educator Portal

![Platform Preview](public/preview.png) *(Note: Please add a preview screenshot here)*

A premium, open-access educational portal designed for advanced chemistry students preparing for competitive examinations (JEE Main, JEE Advanced, NEET, CSIR NET, and M.Sc Entrance). Built with a highly opinionated, dense, and tactile UI framework ("The Archon Aesthetic"), this platform rejects generic SaaS designs in favor of an engineered, solid, and focused learning environment.

## 🌟 Key Features

*   **Role-Based Architecture:** Dedicated dashboards and workflows for both Students (consumers) and the Professor (administrator).
*   **Comprehensive Resource Library:** Neatly categorized sections for Study Notes, Video Lectures, PYQs, Practice Sheets, and Additional Resources.
*   **Doubt Resolution Engine:** A built-in system for students to submit academic queries and for the professor to provide detailed, public answers.
*   **The "Archon" Aesthetic:** 
    *   **Anti-Glassmorphism:** Solid, opaque elements with heavy inset shadows to provide physical tactility.
    *   **High Contrast:** Deep dark themes (`#111112` backgrounds) accented by Archon Gold (`#F1E194`) and Crimson (`#5B0E14`).
    *   **Micro-Typography:** Small, dense, heavily tracked uppercase fonts (e.g., `font-sans uppercase tracking-[0.2em] font-black`) for an engineered look.
*   **3D Fluent Emojis:** Leverages Microsoft's Animated Fluent Emojis for cohesive, premium iconography across all dashboards.

## 🛠️ Technology Stack

*   **Frontend Framework:** [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) (Customized for tactile shadows and micro-typography)
*   **Icons:** [Lucide React](https://lucide.dev/) (Utility UI) + [Microsoft Fluent Emojis](https://github.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis) (Visual identifiers)
*   **Type Safety:** [TypeScript](https://www.typescriptlang.org/)

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/notpai18/ajeshsir.git
    cd ajeshsir
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  **Open your browser:**
    Navigate to `http://localhost:5173` (or the port specified by Vite in your terminal) to view the application.

## 📁 Project Structure

```text
src/
├── components/          # Reusable UI components and page sections
│   ├── AboutPage.tsx    # Professor profile and academic philosophy
│   ├── ContactPage.tsx  # Inquiries and doubt submission form
│   ├── ProfessorDashboard.tsx # Admin content management portal
│   ├── StudentDashboard.tsx   # Student resource library interface
│   ├── SelectionPage.tsx      # Role selection entry point
│   └── ...
├── data.ts              # Mock database containing exams, notes, videos, etc.
├── types.ts             # TypeScript interfaces and type definitions
├── index.css            # Global CSS and Tailwind directives
└── App.tsx              # Main application router and layout wrapper
```

## 🎨 Design Philosophy (For Future Contributors)

When contributing to the UI, please adhere strictly to the established **Archon Aesthetic**:
*   **No Translucency:** Do not use `backdrop-blur` or generic low-opacity backgrounds for cards. Use solid `#1c1c1e`.
*   **Chunky Borders & Inset Shadows:** Use `border-2 border-gray-800` and `shadow-[inset_0_-2px_0_rgba(0,0,0,0.5)]` on interactive elements to make them feel like physical hardware.
*   **Information Density:** Avoid excessive whitespace. Use our standard `text-[10px]` or `text-[9px]` tracked uppercase utility classes for labels and metadata.

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---
*Developed for Prof. Ajesh Joe's digital chemistry repository.*
