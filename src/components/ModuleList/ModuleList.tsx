"use client";

import { useState, useCallback } from "react";
import styles from "./ModuleList.module.css";
import { ToggleIcon } from "@/components/Icons/ToggleIcon";
import type { Module } from "@/data/modules";

interface ModuleListProps {
  modules: Module[];
}

export default function ModuleList({ modules }: ModuleListProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  return (
    <ul className={styles.list}>
      {modules.map((mod, index) => {
        const isOpen = openIndex === index;
        const triggerId = `module-trigger-${mod.num}`;
        const contentId = `module-content-${mod.num}`;

        return (
          <li key={mod.num} className={styles.item}>
            <button
              id={triggerId}
              type="button"
              className={`${styles.trigger} ${isOpen ? styles.triggerOpen : ""}`}
              aria-expanded={isOpen}
              aria-controls={contentId}
              onClick={() => handleToggle(index)}
            >
              <span className={styles.num} aria-hidden="true">
                {mod.num}
              </span>
              <span className={styles.name}>{mod.name}</span>
              <span className={styles.toggleIndicator} aria-hidden="true">
                <span className={styles.iconWrapper}>
                  <ToggleIcon />
                </span>
              </span>
            </button>

            <div
              id={contentId}
              role="region"
              aria-labelledby={triggerId}
              className={`${styles.itemContent} ${isOpen ? styles.itemContentOpen : ""}`}
            >
              <div className={styles.itemContentInner}>
                <p className={styles.description}>{mod.description}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
