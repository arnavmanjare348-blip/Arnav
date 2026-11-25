import { FREE_SHIPPING_THRESHOLD_INR, formatINR } from '../utils/currency';
import { MiniMeadowSprout } from './Header';

interface FooterProps {
  onNavigateHome: (sectionId?: string) => void;
  onNavigateLedger: () => void;
  onNavigateQuiz: () => void;
}

export function Footer({ onNavigateHome, onNavigateLedger, onNavigateQuiz }: FooterProps) {
  return (
    <footer className="border-t border-[#D8CEBC] bg-[#EFE9DD]/60 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#D8CEBC]">
          <div className="md:col-span-5 space-y-3">
            <div className="inline-flex items-center gap-2">
              <MiniMeadowSprout className="w-5 h-5" />
              <p className="font-serif text-xl font-semibold text-[#1E3F20]">Mini Meadow</p>
            </div>
            <p className="font-serif italic text-sm text-[#2E5A27]">
              Small Products. Big Changes. A Greener Tomorrow.
            </p>
            <p className="text-sm text-[#5C5850] max-w-sm leading-relaxed">
              Plant-based hair bars, biodegradable home cleaners, whole-leaf Tulsi infusions, and
              botanical Eau de Parfums handcrafted in India.
            </p>
          </div>

          <div className="md:col-span-3 space-y-2.5">
            <p className="text-xs font-semibold tracking-wider uppercase text-[#1E3F20]">
              Mini Meadow
            </p>
            <ul className="space-y-2 text-sm text-[#1F2421]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateHome('formulations')}
                  className="hover:text-[#4E8A3C] hover:underline underline-offset-4 cursor-pointer"
                >
                  All Formulations
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onNavigateQuiz}
                  className="hover:text-[#4E8A3C] hover:underline underline-offset-4 cursor-pointer"
                >
                  Scent &amp; Ritual Quiz
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateHome('ritual-guide')}
                  className="hover:text-[#4E8A3C] hover:underline underline-offset-4 cursor-pointer"
                >
                  How-To Ritual Guide
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onNavigateLedger}
                  className="hover:text-[#4E8A3C] hover:underline underline-offset-4 cursor-pointer"
                >
                  Botanical Ledger
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-2.5">
            <p className="text-xs font-semibold tracking-wider uppercase text-[#1E3F20]">
              Zero-Plastic Dispatch (India)
            </p>
            <p className="text-sm text-[#5C5850] leading-relaxed">
              Every order ships plastic-free across India in unbleached post-consumer kraft cartons
              sealed with water-activated paper tape. Complimentary shipping on orders over{' '}
              <span className="tabular-nums font-medium text-[#1F2421]">
                {formatINR(FREE_SHIPPING_THRESHOLD_INR)}
              </span>
              .
            </p>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#5C5850]">
          <span>Handcrafted by Mini Meadow · AYUSH Compliant &amp; Botanical EDP</span>
          <span>100% Plant-Based · Zero Plastic Packaging</span>
        </div>
      </div>
    </footer>
  );
}
