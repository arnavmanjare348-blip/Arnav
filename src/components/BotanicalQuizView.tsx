import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';
import { PRODUCTS } from '../data/apothecary';
import { Product } from '../types';
import { formatINR } from '../utils/currency';
import { ResilientImage } from './ResilientImage';

interface BotanicalQuizViewProps {
  onSelectProduct: (product: Product) => void;
  onAddToBag: (productId: string, variantId: string, quantity: number) => void;
  onUnlockPromo: (code: string) => void;
}

interface FinderAnswers {
  focus: 'scent' | 'hair' | 'steep' | 'home' | null;
  mood: 'earthy' | 'spiced' | 'floral' | 'green' | null;
  time: 'morning' | 'midday' | 'evening' | 'allday' | null;
  vessel: 'glass' | 'kraft' | 'both' | null;
}

interface TriviaQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const TRIVIA_QUESTIONS: TriviaQuestion[] = [
  {
    id: 'q1',
    question:
      'Which botanical pod in Mini Meadow’s Herbal Shampoo Bar supplies natural saponins to cleanse the scalp without synthetic sulfates?',
    options: [
      'Acacia concinna (Shikakai)',
      'Citrus limon (Lemon Peel)',
      'Santalum album (Sandalwood)',
      'Camellia sinensis (White Tea)',
    ],
    correctIndex: 0,
    explanation:
      'Shikakai pods have been used in Indian hair care for centuries because their fruit pods are naturally rich in mild plant saponins that cleanse without stripping scalp oils.',
  },
  {
    id: 'q2',
    question:
      'What three Holy Basil varieties are blended together in Mini Meadow’s Organic Tulsi Infusion?',
    options: [
      'Sweet, Thai & Genovese',
      'Krishna, Rama & Vana',
      'Lemon, Cinnamon & Clove',
      'Wild Mint, Sage & Rosemary',
    ],
    correctIndex: 1,
    explanation:
      'Blending Krishna (purple), Rama (green), and Vana (wild forest) Tulsi balances peppery clove aromatics with mellow, sweet herbal notes.',
  },
  {
    id: 'q3',
    question:
      'Where are the wild Khus Vetiver roots in our Vetiver & Cedar Eau de Parfum traditionally hydro-distilled in copper degs?',
    options: [
      'Jaipur',
      'Kannauj',
      'Kochi',
      'Darjeeling',
    ],
    correctIndex: 1,
    explanation:
      'Kannauj artisans hydro-distill 18-month mature vetiver roots in traditional copper deg vessels to capture deep rain-soaked earth and wild grass notes.',
  },
  {
    id: 'q4',
    question:
      'What creates the plant-based cleaning action inside our Biodegradable All-Purpose Cleaner?',
    options: [
      'Synthetic ammonia & chlorine',
      'Petroleum-derived SLS',
      'Coconut & corn-derived glucosides with lemon & eucalyptus oils',
      'Artificial fragrance stabilizers',
    ],
    correctIndex: 2,
    explanation:
      'Fermented coconut and corn surfactants lift grease safely around pets and children while lemon rind oil, eucalyptus, and citric acid leave surfaces streak-free.',
  },
  {
    id: 'q5',
    question:
      'Which rare, pre-dawn floral absolute pairs with Mysuru sandalwood in our deepest evening Eau de Parfum?',
    options: [
      'Madurai Jasmine Sambac',
      'Alpine Lavender',
      'Wild Bergamot Rind',
      'Moringa Foliage',
    ],
    correctIndex: 0,
    explanation:
      'Madurai Jasmine Sambac buds are plucked before sunrise when their velvety floral aromatics peak, then layered over warm Mysore sandalwood.',
  },
];

export function BotanicalQuizView({
  onSelectProduct,
  onAddToBag,
  onUnlockPromo,
}: BotanicalQuizViewProps) {
  const [activeTab, setActiveTab] = useState<'finder' | 'trivia'>('finder');

  // Finder state
  const [finderStep, setFinderStep] = useState(0);
  const [answers, setAnswers] = useState<FinderAnswers>({
    focus: null,
    mood: null,
    time: null,
    vessel: null,
  });
  const [finderSubmitted, setFinderSubmitted] = useState(false);
  const [addedDuo, setAddedDuo] = useState(false);

  // Trivia state
  const [triviaIndex, setTriviaIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [triviaScore, setTriviaScore] = useState(0);
  const [triviaFinished, setTriviaFinished] = useState(false);

  const finderQuestions = [
    {
      key: 'focus' as const,
      title: 'What daily ritual would you like to ground first?',
      subtitle: 'Step 01 of 04 · Ritual Intention',
      options: [
        {
          value: 'scent',
          label: 'Signature Botanical Scent',
          detail: 'Long-wearing plant-spirit Eau de Parfum in refillable glass.',
        },
        {
          value: 'hair',
          label: 'Zero-Plastic Hair & Scalp Care',
          detail: 'AYUSH-compliant solid cleansing bars with Shikakai & Amla.',
        },
        {
          value: 'steep',
          label: 'Calm Herbal Tea Steep',
          detail: 'Whole-leaf organic Tulsi infusions free from caffeine.',
        },
        {
          value: 'home',
          label: 'Non-Toxic Home Surface Care',
          detail: 'Biodegradable citrus & eucalyptus spray safe for daily use.',
        },
      ],
    },
    {
      key: 'mood' as const,
      title: 'Which aromatic temperament draws you in?',
      subtitle: 'Step 02 of 04 · Olfactory Profile',
      options: [
        {
          value: 'earthy',
          label: 'Earthy, Grounded & Woody',
          detail: 'Monsoon-soaked vetiver root, deodar cedarwood, and dry moss.',
        },
        {
          value: 'spiced',
          label: 'Spiced Herbal & Bright Citrus',
          detail: 'Crushed holy basil leaf, bitter orange neroli, and fresh lemon.',
        },
        {
          value: 'floral',
          label: 'Velvety Floral & Warm Sandalwood',
          detail: 'Pre-dawn Madurai jasmine buds wrapped in creamy sandalwood.',
        },
        {
          value: 'green',
          label: 'Crisp Green & Delicate Tea',
          detail: 'Verdant moringa foliage, silver-needle white tea, and eucalyptus.',
        },
      ],
    },
    {
      key: 'time' as const,
      title: 'When do you reach for this ritual most?',
      subtitle: 'Step 03 of 04 · Daily Cadence',
      options: [
        {
          value: 'morning',
          label: 'Early Morning Clarity',
          detail: 'Crisp, uplifting notes to wake the senses cleanly.',
        },
        {
          value: 'midday',
          label: 'Midday Reset & Focus',
          detail: 'Refreshing botanical clarity between work sessions.',
        },
        {
          value: 'evening',
          label: 'Dusk & Evening Unwind',
          detail: 'Warm, grounding woods and serene caffeine-free steep.',
        },
        {
          value: 'allday',
          label: 'All-Day Skin & Home Presence',
          detail: 'Versatile everyday balance from morning through dusk.',
        },
      ],
    },
    {
      key: 'vessel' as const,
      title: 'Which zero-waste vessel format fits your shelf?',
      subtitle: 'Step 04 of 04 · Packaging Preference',
      options: [
        {
          value: 'glass',
          label: 'Refillable Amber & Tinted Glass',
          detail: 'Heavy apothecary glass flacons and trigger spray bottles.',
        },
        {
          value: 'kraft',
          label: 'Unbleached Kraft Cartons & Pouches',
          detail: '100% plastic-free paperboard boxes and resealable pouches.',
        },
        {
          value: 'both',
          label: 'A Paired Glass + Kraft Ritual Set',
          detail: 'Combine a botanical Eau de Parfum with an everyday staple.',
        },
      ],
    },
  ];

  const getRecommendations = (): { primary: Product; companion: Product; rationale: string } => {
    const byId = (id: string) => PRODUCTS.find((p) => p.id === id) ?? PRODUCTS[0];

    let perfume = byId('vetiver-cedar-edp');
    if (answers.mood === 'spiced') perfume = byId('tulsi-neroli-edp');
    else if (answers.mood === 'floral') perfume = byId('jasmine-sandalwood-edp');
    else if (answers.mood === 'green') perfume = byId('moringa-white-tea-edp');
    else if (answers.time === 'evening') perfume = byId('jasmine-sandalwood-edp');

    let staple = byId('herbal-shampoo-bar');
    if (answers.focus === 'home') staple = byId('all-purpose-cleaner');
    else if (answers.focus === 'steep' || answers.time === 'evening') {
      staple = byId('tulsi-leaf-infusion');
    }

    const primary = answers.focus === 'scent' ? perfume : staple;
    const companion = answers.focus === 'scent' ? staple : perfume;

    const rationale = `Matched to your preference for ${
      answers.mood === 'spiced'
        ? 'spiced herbal and citrus aromatics'
        : answers.mood === 'floral'
          ? 'velvety white florals and warm sandalwood'
          : answers.mood === 'green'
            ? 'crisp green tea and moringa notes'
            : 'earthy vetiver and cedarwood depth'
    } during ${
      answers.time === 'morning'
        ? 'morning routines'
        : answers.time === 'midday'
          ? 'midday resets'
          : answers.time === 'evening'
            ? 'quiet evening rituals'
            : 'everyday use'
    }.`;

    return { primary, companion, rationale };
  };

  const currentQuestion = finderQuestions[finderStep];
  const currentAnswer = answers[currentQuestion.key];
  const recommendation = getRecommendations();

  const handleSelectFinderOption = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.key]: value,
    }));
  };

  const handleFinderNext = () => {
    if (finderStep < finderQuestions.length - 1) {
      setFinderStep((s) => s + 1);
    } else {
      setFinderSubmitted(true);
    }
  };

  const handleResetFinder = () => {
    setAnswers({ focus: null, mood: null, time: null, vessel: null });
    setFinderStep(0);
    setFinderSubmitted(false);
    setAddedDuo(false);
  };

  const handleAddRecommendedPair = () => {
    onAddToBag(recommendation.primary.id, recommendation.primary.variants[0].id, 1);
    onAddToBag(recommendation.companion.id, recommendation.companion.variants[0].id, 1);
    setAddedDuo(true);
    window.setTimeout(() => setAddedDuo(false), 1800);
  };

  // Trivia Handlers
  const currentTrivia = TRIVIA_QUESTIONS[triviaIndex];

  const handleChooseTriviaOption = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    if (idx === currentTrivia.correctIndex) {
      setTriviaScore((s) => s + 1);
    }
  };

  const handleNextTrivia = () => {
    if (triviaIndex < TRIVIA_QUESTIONS.length - 1) {
      setTriviaIndex((i) => i + 1);
      setSelectedOption(null);
    } else {
      setTriviaFinished(true);
      if (triviaScore >= 3) {
        onUnlockPromo('MEADOW10');
      }
    }
  };

  const handleResetTrivia = () => {
    setTriviaIndex(0);
    setSelectedOption(null);
    setTriviaScore(0);
    setTriviaFinished(false);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Editorial Header + Mode Toggle */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#D8CEBC] pb-8">
        <div className="max-w-2xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#2E5A27]">
            Mini Meadow Apothecary Consultation
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-[#1F2421] leading-tight">
            Botanical Scent &amp; Ritual Quizzes
          </h1>
          <p className="text-base text-[#5C5850] leading-relaxed">
            Discover your matched Eau de Parfum and daily zero-waste staple, or test your herbal
            craft knowledge to unlock 10% off your parcel.
          </p>
        </div>

        <div
          className="inline-flex p-1 bg-[#EFE9DD] border border-[#D8CEBC] rounded-[6px] self-start lg:self-auto"
          role="tablist"
          aria-label="Quiz type"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'finder'}
            onClick={() => setActiveTab('finder')}
            className={`px-4 py-2 text-xs font-semibold rounded-[4px] whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'finder'
                ? 'bg-[#1E3F20] text-[#F7F4EE]'
                : 'text-[#1F2421] hover:text-[#2E5A27]'
            }`}
          >
            Scent &amp; Ritual Finder
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'trivia'}
            onClick={() => setActiveTab('trivia')}
            className={`px-4 py-2 text-xs font-semibold rounded-[4px] whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'trivia'
                ? 'bg-[#1E3F20] text-[#F7F4EE]'
                : 'text-[#1F2421] hover:text-[#2E5A27]'
            }`}
          >
            Botanical Craft Quiz (5 Qs)
          </button>
        </div>
      </section>

      {/* Mode 1: Personalized Scent & Ritual Finder */}
      {activeTab === 'finder' && (
        <section className="max-w-4xl mx-auto">
          {!finderSubmitted ? (
            <div className="bg-[#FAF8F3] border border-[#D8CEBC] rounded-lg overflow-hidden">
              {/* Progress Bar */}
              <div className="h-1.5 w-full bg-[#EFE9DD]">
                <div
                  className="h-full bg-[#4E8A3C] transition-all duration-300"
                  style={{ width: `${((finderStep + 1) / finderQuestions.length) * 100}%` }}
                />
              </div>

              <div className="p-6 sm:p-10 space-y-8">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#2E5A27] tabular-nums">
                    {currentQuestion.subtitle}
                  </p>
                  <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#1F2421]">
                    {currentQuestion.title}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentQuestion.options.map((option) => {
                    const selected = currentAnswer === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleSelectFinderOption(option.value)}
                        className={`text-left p-5 rounded-lg border transition-colors cursor-pointer flex flex-col justify-between gap-2 ${
                          selected
                            ? 'bg-[#EFE9DD] border-[1.5px] border-[#1E3F20]'
                            : 'bg-[#F7F4EE] border-[#D8CEBC] hover:border-[#2E5A27]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span className="font-serif text-lg font-medium text-[#1F2421]">
                            {option.label}
                          </span>
                          <span
                            className={`mt-1 w-4 h-4 rounded-[3px] border-[1.5px] flex items-center justify-center shrink-0 ${
                              selected
                                ? 'bg-[#1E3F20] border-[#1E3F20] text-[#F7F4EE]'
                                : 'bg-[#FAF8F3] border-[#2E5A27]'
                            }`}
                          >
                            {selected && <Check className="w-3 h-3 stroke-[2.5]" />}
                          </span>
                        </div>
                        <p className="text-xs text-[#5C5850] leading-relaxed">{option.detail}</p>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-[#D8CEBC] flex items-center justify-between gap-4">
                  <button
                    type="button"
                    disabled={finderStep === 0}
                    onClick={() => setFinderStep((s) => Math.max(0, s - 1))}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border border-[#D8CEBC] text-[#1F2421] rounded-[4px] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#EFE9DD]"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Previous</span>
                  </button>

                  <button
                    type="button"
                    disabled={!currentAnswer}
                    onClick={handleFinderNext}
                    className="inline-flex items-center gap-1.5 px-6 py-2.5 text-xs font-semibold bg-[#1E3F20] text-[#F7F4EE] rounded-[4px] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#2E5A27]"
                  >
                    <span>
                      {finderStep === finderQuestions.length - 1
                        ? 'Reveal My Pairing'
                        : 'Next Question'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Personalized Recommendation Results */
            <div className="space-y-8">
              <div className="bg-[#EFE9DD] border border-[#D8CEBC] rounded-lg p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#2E5A27]">
                    Tailored Apothecary Pairing
                  </p>
                  <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#1F2421]">
                    Your Mini Meadow Prescription
                  </h2>
                  <p className="text-sm text-[#5C5850] leading-relaxed">
                    {recommendation.rationale}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={handleAddRecommendedPair}
                    className="inline-flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold bg-[#1E3F20] text-[#F7F4EE] rounded-[4px] cursor-pointer hover:bg-[#2E5A27]"
                  >
                    {addedDuo ? (
                      <>
                        <Check className="w-4 h-4" aria-hidden="true" />
                        <span>Pair Added to Bag</span>
                      </>
                    ) : (
                      <span>
                        Add Matched Pair (
                        {formatINR(
                          recommendation.primary.variants[0].price +
                            recommendation.companion.variants[0].price
                        )}
                        )
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleResetFinder}
                    className="inline-flex items-center gap-1.5 px-4 py-3 text-xs font-semibold border border-[#1E3F20] text-[#1E3F20] rounded-[4px] cursor-pointer hover:bg-[#F7F4EE]"
                  >
                    <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Retake</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: 'Primary Match', item: recommendation.primary },
                  { label: 'Complementary Ritual', item: recommendation.companion },
                ].map(({ label, item }) => (
                  <div
                    key={item.id}
                    className="bg-[#FAF8F3] border border-[#D8CEBC] rounded-lg p-5 flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs uppercase tracking-[0.06em] font-semibold text-[#2E5A27]">
                        <span>{label}</span>
                        <span className="tabular-nums text-[#5C5850]">{item.batchId}</span>
                      </div>

                      <div className="aspect-[4/3] w-full overflow-hidden rounded-[4px] border border-[#D8CEBC] bg-[#EFE9DD]">
                        <ResilientImage
                          src={item.image}
                          alt={item.imageAlt}
                          fallbackTitle={item.name}
                          style={
                            item.imageCropOrigin
                              ? {
                                  transform: 'scale(2.15)',
                                  transformOrigin: item.imageCropOrigin,
                                }
                              : undefined
                          }
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div>
                        <h3 className="font-serif text-xl font-semibold text-[#1F2421]">
                          {item.name}
                        </h3>
                        <p className="font-serif italic text-sm text-[#2E5A27]">
                          {item.latinSubtitle}
                        </p>
                        <p className="text-sm text-[#5C5850] mt-2 leading-relaxed">
                          {item.shortDescription}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#D8CEBC] flex items-center justify-between gap-3">
                      <div>
                        <span className="block text-xs text-[#5C5850]">
                          {item.variants[0].label}
                        </span>
                        <span className="text-base font-semibold text-[#1F2421] tabular-nums">
                          {formatINR(item.variants[0].price)}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => onSelectProduct(item)}
                        className="px-4 py-2 text-xs font-semibold border-[1.5px] border-[#1E3F20] text-[#1E3F20] rounded-[4px] hover:bg-[#EFE9DD] cursor-pointer"
                      >
                        Inspect Formulation
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Mode 2: 5-Question Botanical Craft Trivia Quiz */}
      {activeTab === 'trivia' && (
        <section className="max-w-3xl mx-auto">
          {!triviaFinished ? (
            <div className="bg-[#FAF8F3] border border-[#D8CEBC] rounded-lg overflow-hidden">
              <div className="h-1.5 w-full bg-[#EFE9DD]">
                <div
                  className="h-full bg-[#4E8A3C] transition-all duration-300"
                  style={{ width: `${((triviaIndex + 1) / TRIVIA_QUESTIONS.length) * 100}%` }}
                />
              </div>

              <div className="p-6 sm:p-10 space-y-6">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.06em] text-[#2E5A27] tabular-nums">
                  <span>
                    Question {triviaIndex + 1} of {TRIVIA_QUESTIONS.length}
                  </span>
                  <span>Score: {triviaScore}</span>
                </div>

                <h2 className="font-serif text-2xl font-medium text-[#1F2421] leading-snug">
                  {currentTrivia.question}
                </h2>

                <div className="space-y-3">
                  {currentTrivia.options.map((opt, idx) => {
                    const isPicked = selectedOption === idx;
                    const isCorrect = idx === currentTrivia.correctIndex;
                    const showOutcome = selectedOption !== null;

                    let cardStyle =
                      'bg-[#F7F4EE] border-[#D8CEBC] text-[#1F2421] hover:border-[#2E5A27]';
                    if (showOutcome) {
                      if (isCorrect) {
                        cardStyle = 'bg-[#C5EDC1]/50 border-[#1E3F20] text-[#07290C]';
                      } else if (isPicked) {
                        cardStyle = 'bg-[#FFDAD6]/60 border-[#BA1A1A] text-[#93000A]';
                      } else {
                        cardStyle = 'bg-[#F7F4EE] border-[#D8CEBC] text-[#5C5850] opacity-70';
                      }
                    }

                    return (
                      <button
                        key={opt}
                        type="button"
                        disabled={showOutcome}
                        onClick={() => handleChooseTriviaOption(idx)}
                        className={`w-full text-left p-4 rounded-[4px] border text-sm font-medium flex items-center justify-between gap-3 transition-colors cursor-pointer disabled:cursor-default ${cardStyle}`}
                      >
                        <span>{opt}</span>
                        {showOutcome && isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-[#1E3F20] shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {selectedOption !== null && (
                  <div className="p-4 bg-[#EFE9DD] border border-[#D8CEBC] rounded-[4px] space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#1E3F20]">
                      {selectedOption === currentTrivia.correctIndex
                        ? 'Correct Botanical Note'
                        : 'Botanical Field Note'}
                    </p>
                    <p className="text-sm text-[#1F2421] leading-relaxed">
                      {currentTrivia.explanation}
                    </p>
                    <div className="pt-1 flex justify-end">
                      <button
                        type="button"
                        onClick={handleNextTrivia}
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold bg-[#1E3F20] text-[#F7F4EE] rounded-[4px] cursor-pointer hover:bg-[#2E5A27]"
                      >
                        <span>
                          {triviaIndex === TRIVIA_QUESTIONS.length - 1
                            ? 'View Final Score'
                            : 'Next Question'}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-[#EFE9DD] border border-[#D8CEBC] rounded-lg p-8 sm:p-10 text-center space-y-5">
              <Sparkles className="w-8 h-8 text-[#2E5A27] mx-auto stroke-[1.5]" />
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#2E5A27]">
                  Botanical Craft Quiz Complete
                </p>
                <h2 className="font-serif text-3xl font-semibold text-[#1F2421] tabular-nums">
                  You scored {triviaScore} out of {TRIVIA_QUESTIONS.length}
                </h2>
                <p className="text-sm text-[#5C5850] max-w-md mx-auto leading-relaxed">
                  {triviaScore >= 3
                    ? 'You unlocked 10% off your Mini Meadow parcel. Code MEADOW10 has been applied and is ready inside your Bag.'
                    : 'Score 3 or more to unlock code MEADOW10 for 10% off your Mini Meadow apothecary parcel.'}
                </p>
              </div>

              {triviaScore >= 3 && (
                <div className="inline-block px-5 py-2.5 bg-[#FAF8F3] border border-[#1E3F20] rounded-[4px] font-mono text-sm font-semibold text-[#1E3F20]">
                  MEADOW10 · 10% OFF ACTIVE
                </div>
              )}

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleResetTrivia}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold border border-[#1E3F20] text-[#1E3F20] rounded-[4px] cursor-pointer hover:bg-[#FAF8F3]"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Play Again</span>
                </button>
              </div>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
