import { useEffect, useState } from 'react';
import {
  Droplets,
  Flame,
  Hand,
  Pause,
  Play,
  RotateCcw,
  Scale,
  Thermometer,
  Timer,
} from 'lucide-react';
import { RitualStep } from '../types';

interface RitualTimerProps {
  title: string;
  subtitle?: string;
  durationSeconds: number;
  steps: RitualStep[];
}

function StepIcon({ name }: { name: RitualStep['iconName'] }) {
  const iconClass = 'w-4 h-4 text-[#2E5A27] stroke-[1.5] shrink-0';
  switch (name) {
    case 'measure':
      return <Scale className={iconClass} aria-hidden="true" />;
    case 'temperature':
      return <Thermometer className={iconClass} aria-hidden="true" />;
    case 'droplet':
      return <Droplets className={iconClass} aria-hidden="true" />;
    case 'hand':
      return <Hand className={iconClass} aria-hidden="true" />;
    case 'flame':
      return <Flame className={iconClass} aria-hidden="true" />;
    case 'timer':
    default:
      return <Timer className={iconClass} aria-hidden="true" />;
  }
}

export function RitualTimer({ title, subtitle, durationSeconds, steps }: RitualTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setSecondsLeft(durationSeconds);
    setIsRunning(false);
  }, [durationSeconds, title]);

  useEffect(() => {
    if (!isRunning) return;
    if (secondsLeft <= 0) {
      setIsRunning(false);
      return;
    }
    const id = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [isRunning, secondsLeft]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  const progressPct =
    durationSeconds > 0
      ? Math.round(((durationSeconds - secondsLeft) / durationSeconds) * 100)
      : 100;

  return (
    <div className="bg-[#EFE9DD] border border-[#D8CEBC] rounded-lg overflow-hidden">
      {/* Packaging Back Header Bar */}
      <div className="px-5 py-4 border-b border-[#D8CEBC] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FAF8F3]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#2E5A27]">
            Ritual Preparation Guide
          </p>
          <h3 className="font-serif text-xl font-medium text-[#1F2421] mt-0.5">{title}</h3>
          {subtitle && (
            <p className="font-serif italic text-sm text-[#5C5850] mt-0.5">{subtitle}</p>
          )}
        </div>

        {/* Live Steep / Application Duration Ticker */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-3.5 py-2 bg-[#F7F4EE] border border-[#D8CEBC] rounded-[4px] text-center min-w-[84px]">
            <span className="block text-[10px] uppercase tracking-[0.08em] text-[#5C5850] font-semibold">
              {secondsLeft === 0 ? 'Complete' : 'Timer'}
            </span>
            <span className="font-mono text-base font-semibold text-[#1E3F20] tabular-nums">
              {formattedTime}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              if (secondsLeft === 0) {
                setSecondsLeft(durationSeconds);
                setIsRunning(true);
              } else {
                setIsRunning((r) => !r);
              }
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold bg-[#1E3F20] text-[#F7F4EE] rounded-[4px] cursor-pointer whitespace-nowrap shrink-0 transition-colors hover:bg-[#2E5A27] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3F20]"
          >
            {isRunning ? (
              <>
                <Pause className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{secondsLeft === 0 ? 'Restart' : 'Start Timer'}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsRunning(false);
              setSecondsLeft(durationSeconds);
            }}
            aria-label="Reset timer"
            className="p-2.5 text-[#1E3F20] border border-[#1E3F20] rounded-[4px] cursor-pointer transition-colors hover:bg-[#EFE9DD] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3F20]"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Subtle Sprout Green Progress Line */}
      <div className="h-[3px] w-full bg-[#D8CEBC]/50">
        <div
          className="h-full bg-[#4E8A3C] transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* 3-Stage Horizontal Packaging-Back Spec Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#D8CEBC]">
        {steps.map((step) => (
          <div key={step.stepNumber} className="p-5 sm:p-6 flex flex-col justify-between gap-3">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-semibold tracking-[0.06em] uppercase text-[#5C5850] tabular-nums">
                  Step {step.stepNumber}
                </span>
                <StepIcon name={step.iconName} />
              </div>
              <h4 className="font-serif text-lg font-medium text-[#1F2421]">{step.title}</h4>
              <p className="text-sm text-[#5C5850] leading-relaxed mt-2">{step.instruction}</p>
            </div>
            <div className="pt-3 border-t border-[#D8CEBC]/70 flex items-center justify-between text-xs">
              <span className="text-[#5C5850] uppercase tracking-[0.06em] font-semibold">
                Target Spec
              </span>
              <span className="font-semibold text-[#1E3F20] tabular-nums">{step.metric}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
