import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export type AppView = 'home' | 'product' | 'ledger' | 'quiz' | 'layering';

interface HeaderProps {
  activeView: AppView;
  bagCount: number;
  onNavigateHome: (sectionId?: string) => void;
  onNavigateLedger: () => void;
  onNavigateQuiz: () => void;
  onOpenBag: () => void;
}

export function MiniMeadowSprout({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M14 25V12"
        stroke="#6B4F35"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M14 13C14 8.5 10 5.5 6 6.5C6.5 10.5 9.8 13.5 14 13Z"
        fill="#4E8A3C"
      />
      <path
        d="M14 13C14 8.5 18 5.5 22 6.5C21.5 10.5 18.2 13.5 14 13Z"
        fill="#4E8A3C"
      />
      <path
        d="M14 12C12.2 8.2 12.6 4.5 14 2.5C15.4 4.5 15.8 8.2 14 12Z"
        fill="#2E5A27"
      />
    </svg>
  );
}

export function Header({
  activeView,
  bagCount,
  onNavigateHome,
  onNavigateLedger,
  onNavigateQuiz,
  onOpenBag,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = (action: () => void) => {
    setMobileMenuOpen(false);
    action();
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F7F4EE]/95 backdrop-blur-sm border-b border-[#D8CEBC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark with Sprout Mark */}
        <button
          type="button"
          onClick={() => handleLinkClick(() => onNavigateHome())}
          className="inline-flex items-center gap-2 font-serif text-xl sm:text-2xl font-semibold tracking-tight text-[#1E3F20] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1E3F20]"
        >
          <MiniMeadowSprout className="w-5 h-5 shrink-0" />
          <span>Mini Meadow</span>
        </button>

        {/* Zone 2: 4 concise single-line nav links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#1F2421]"
        >
          <button
            type="button"
            onClick={() => onNavigateHome('formulations')}
            className={`whitespace-nowrap shrink-0 cursor-pointer py-1 transition-colors duration-150 hover:text-[#4E8A3C] hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1E3F20] ${
              activeView === 'home' ? 'text-[#1E3F20] underline' : ''
            }`}
          >
            Formulations
          </button>
          <button
            type="button"
            onClick={onNavigateQuiz}
            className={`whitespace-nowrap shrink-0 cursor-pointer py-1 transition-colors duration-150 hover:text-[#4E8A3C] hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1E3F20] ${
              activeView === 'quiz' ? 'text-[#1E3F20] underline' : ''
            }`}
          >
            Scent Quiz
          </button>
          <button
            type="button"
            onClick={() => onNavigateHome('ritual-guide')}
            className="whitespace-nowrap shrink-0 cursor-pointer py-1 transition-colors duration-150 hover:text-[#4E8A3C] hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1E3F20]"
          >
            Ritual Guide
          </button>
          <button
            type="button"
            onClick={onNavigateLedger}
            className={`whitespace-nowrap shrink-0 cursor-pointer py-1 transition-colors duration-150 hover:text-[#4E8A3C] hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1E3F20] ${
              activeView === 'ledger' ? 'text-[#1E3F20] underline' : ''
            }`}
          >
            Botanical Ledger
          </button>
        </nav>

        {/* Zone 3: 1 primary action + mobile menu trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenBag}
            className="px-4 py-2 text-xs sm:text-sm font-semibold tracking-wide bg-[#1E3F20] text-[#F7F4EE] border border-[#1E3F20] rounded-[4px] whitespace-nowrap shrink-0 cursor-pointer transition-all duration-150 hover:bg-[#2E5A27] hover:-translate-y-px tabular-nums focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3F20]"
          >
            Bag ({bagCount})
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className="md:hidden p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#1E3F20] border border-[#D8CEBC] rounded-[4px] bg-[#FAF8F3] cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#D8CEBC] bg-[#FAF8F3] px-4 py-4">
          <nav className="flex flex-col gap-2" aria-label="Mobile navigation">
            <button
              type="button"
              onClick={() => handleLinkClick(() => onNavigateHome('formulations'))}
              className="text-left py-2.5 px-2 text-sm font-medium text-[#1F2421] border-b border-[#D8CEBC]/60"
            >
              Formulations
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick(onNavigateQuiz)}
              className="text-left py-2.5 px-2 text-sm font-medium text-[#1F2421] border-b border-[#D8CEBC]/60"
            >
              Scent Quiz
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick(() => onNavigateHome('ritual-guide'))}
              className="text-left py-2.5 px-2 text-sm font-medium text-[#1F2421] border-b border-[#D8CEBC]/60"
            >
              Ritual Guide
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick(onNavigateLedger)}
              className="text-left py-2.5 px-2 text-sm font-medium text-[#1F2421]"
            >
              Botanical Ledger
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
