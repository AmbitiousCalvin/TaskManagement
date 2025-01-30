import "./styles/styles.scss";
import { Header } from "./layout/header";
import { Sidebar } from "./layout/sidebar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useState, useEffect } from "react";
import { LayoutContextProvider } from "./contexts/layoutContext";
import { TaskPage } from "./components/taskPage";

export default function App() {
  return (
    <LayoutContextProvider>
      <Router>
        <Header />

        {/* ===============================d 2
      ============== */}

        <main className="layout">
          <div className="sidebar-container-parent">
            <Sidebar />
          </div>
          {/* ============================================= */}

          <section className="content-container">
            <Routes>
              <Route path="/" element={<TaskPage />} />
              <Route path="/tasks" element={<TaskPage />} />
            </Routes>
          </section>

          {/* ============================================= */}
        </main>
      </Router>
    </LayoutContextProvider>
  );
}
