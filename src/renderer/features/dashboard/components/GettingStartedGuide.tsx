import type { ReactElement } from "react";
import { gettingStartedSteps, guideHintIcon } from "../dashboardData";

const persianNumbers = ["۱", "۲", "۳"];

export function GettingStartedGuide(): ReactElement {
  const HintIcon = guideHintIcon;

  return (
    <section className="panel guide-card">
      <header className="guide-card__header">
        <h2>راهنمای شروع</h2>
        <p>برای شروع، این مراحل ساده را دنبال کنید.</p>
      </header>
      <ol className="guide-steps">
        {gettingStartedSteps.map((step, index) => (
          <li key={step.title}>
            <span>{persianNumbers[index]}</span>
            <div>
              <strong>{step.title}</strong>
              <p>{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="guide-hint">
        <HintIcon size={22} aria-hidden="true" />
        <span>هر زمان خواستید، می‌توانید این راهنما را از بخش راهنما مشاهده کنید.</span>
      </div>
    </section>
  );
}
