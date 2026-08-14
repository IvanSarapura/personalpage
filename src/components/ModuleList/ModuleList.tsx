"use client";

import { useState, useCallback } from "react";
import styles from "./ModuleList.module.css";
import { ToggleIcon } from "@/components/Icons/ToggleIcon";
import type { Module } from "@/data/modules";

interface ModuleListProps {
  modules: Module[];
  expandLabel: string;
  collapseLabel: string;
}

export default function ModuleList({ modules, expandLabel, collapseLabel }: ModuleListProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  return (
    <ul className={styles.list}>
      {modules.map((mod, index) => {
        const isOpen = openIndex === index;

        return (
          <li key={mod.num} className={styles.item}>
            <span className={styles.num}>{mod.num}</span>

            <div className={styles.moduleBody}>
              <div className={styles.moduleHeader}>
                <span id={`module-label-${mod.num}`} className={styles.name}>
                  {mod.name}
                </span>
                <button
                  type="button"
                  className={`${styles.plusBtn} ${isOpen ? styles.plusBtnOpen : ""}`}
                  aria-label={
                    isOpen ? `${collapseLabel} ${mod.name}` : `${expandLabel} ${mod.name}`
                  }
                  aria-expanded={isOpen}
                  aria-controls={`module-content-${mod.num}`}
                  onClick={() => handleToggle(index)}
                >
                  <span
                    className={`${styles.iconWrapper} ${isOpen ? styles.iconWrapperOpen : ""}`}
                    aria-hidden="true"
                  >
                    <ToggleIcon variant="more" />
                  </span>
                  <span
                    className={`${styles.iconWrapper} ${styles.iconWrapperLess} ${isOpen ? styles.iconWrapperLessOpen : ""}`}
                    aria-hidden="true"
                  >
                    <ToggleIcon variant="less" />
                  </span>
                </button>
              </div>

              <div
                id={`module-content-${mod.num}`}
                role="region"
                aria-labelledby={`module-label-${mod.num}`}
                className={`${styles.itemContent} ${isOpen ? styles.itemContentOpen : ""}`}
              >
                <div className={styles.itemContentInner}>
                  <p className={styles.description}>{mod.description}</p>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
