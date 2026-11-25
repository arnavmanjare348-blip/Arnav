import { Product } from '../types';

export const HERO_IMAGE =
  '/assets/aistudio/watermark-removed-Gemini_Generated_Image_9w2b999w2b999w2b-clean_84dd14cb.png';

export const CLEANER_IMAGE =
  '/assets/aistudio/watermark-removed-Gemini_Generated_Image_e9pv7qe9pv7qe9pv_79798a7e.png';

export const TULSI_IMAGE =
  '/assets/aistudio/Gemini_Generated_Image_jsb36rjsb36rjsb3-clean_116ddd79.png';

export const PERFUME_LINEUP_IMAGE =
  '/assets/aistudio/Gemini_Generated_Image_q3zlk8q3zlk8q3zl__1__a182c5bc.png';

export const PRODUCTS: Product[] = [
  {
    id: 'herbal-shampoo-bar',
    slug: 'herbal-shampoo-bar',
    name: 'Herbal Shampoo Bar',
    latinSubtitle: 'Acacia concinna · Emblica officinalis · Eclipta prostrata',
    category: 'Hair & Body',
    tag: 'Zero Plastic',
    shortDescription:
      'AYUSH-compliant solid shampoo bar crafted with Shikakai, Amla, and Bhringraj to strengthen roots and cleanse gently without stripping.',
    editorialStory:
      'Handcrafted by Mini Meadow in small batches to replace up to three plastic shampoo bottles. Whole Shikakai pod powder creates a rich botanical lather while Amla, Bhringraj, coconut oil, and neem nourish the scalp and restore natural shine.',
    image: HERO_IMAGE,
    imageAlt:
      'Mini Meadow Herbal Shampoo Bar unbleached kraft box front and back showing botanical illustration of Shikakai and Amla and 3-step use guide',
    aromaProfile: 'Earthy neem leaf, crisp herbal shikakai, mild essential oils',
    originSummary: 'Handcrafted by Mini Meadow · Pune',
    batchId: 'MM-SB04',
    packagingSpec: {
      vessel: 'Unbleached 100% recycled kraft folding carton',
      closure: 'Glue-free interlocking die-cut paper tabs',
      labelMaterial: 'Direct soy-based black & botanical green ink print',
      endOfLife: 'Zero plastic · 100% home-compostable & curbside recyclable',
    },
    certifications: ['100% Plant-Based', 'Cruelty-Free & Vegan', 'AYUSH Compliant'],
    variants: [
      {
        id: 'shampoo-100g',
        label: '100g Single Bar',
        weightOrVolume: '100g (3.5 oz) · 50+ washes',
        price: 449,
        packagingNote: 'Unbleached kraft carton',
      },
      {
        id: 'shampoo-200g',
        label: 'Twin Pack (2 × 100g)',
        weightOrVolume: '200g (7.0 oz) · 100+ washes',
        price: 849,
        packagingNote: 'Two kraft cartons tied in jute',
      },
    ],
    ritualDurationSeconds: 120,
    ritualSteps: [
      {
        stepNumber: '01',
        title: 'Wet Hair & Bar',
        metric: 'Warm water',
        instruction:
          'Saturate hair thoroughly and glide the Herbal Shampoo Bar between wet palms to wake botanical saponins.',
        iconName: 'droplet',
      },
      {
        stepNumber: '02',
        title: 'Lather Onto Scalp',
        metric: '60 sec massage',
        instruction:
          'Lather directly onto scalp and work gently from roots to tips with fingertips.',
        iconName: 'hand',
      },
      {
        stepNumber: '03',
        title: 'Rinse Thoroughly',
        metric: '2 min total',
        instruction:
          'Rinse clean with cool or lukewarm water and rest bar on a slatted wooden dish to dry.',
        iconName: 'timer',
      },
    ],
    compounds: [
      {
        id: 'cmp-shikakai',
        commonName: 'Shikakai Pod Powder',
        latinName: 'Acacia concinna',
        partUsed: 'Whole Sun-Dried Pod',
        origin: 'Central Deccan Farms, India',
        harvestMethod: 'Hand-picked mature pods',
        extraction: 'Stone-milled botanical powder',
        batchCode: 'MM-SB04-A',
        harvestDate: '2026-10-04',
        purityNote: 'Natural plant saponin cleanser',
        percentage: '38%',
      },
      {
        id: 'cmp-amla',
        commonName: 'Indian Gooseberry (Amla)',
        latinName: 'Emblica officinalis',
        partUsed: 'Desiccated Fruit Pulp',
        origin: 'Pratapgarh Orchards, India',
        harvestMethod: 'Seasonal orchard harvest',
        extraction: 'Low-temperature shade extract',
        batchCode: 'MM-SB04-B',
        harvestDate: '2026-10-06',
        purityNote: 'Vitamin-rich root fortifier',
        percentage: '26%',
      },
      {
        id: 'cmp-bhringraj',
        commonName: 'Bhringraj Leaf Extract',
        latinName: 'Eclipta prostrata',
        partUsed: 'Whole Aerial Herb',
        origin: 'Uttarakhand Foothills, India',
        harvestMethod: 'Regenerative hand shear',
        extraction: 'Slow coconut & neem oil infusion',
        batchCode: 'MM-SB04-C',
        harvestDate: '2026-10-08',
        purityNote: 'Blended with cold-pressed coconut & neem oils',
        percentage: '36%',
      },
    ],
  },
  {
    id: 'all-purpose-cleaner',
    slug: 'all-purpose-cleaner',
    name: 'Plant-Based All-Purpose Cleaner',
    latinSubtitle: 'Citrus limon · Eucalyptus globulus',
    category: 'Home Care',
    tag: 'Biodegradable',
    shortDescription:
      'Natural cleaning spray formulated with coconut and corn-derived surfactants plus bright lemon and eucalyptus essential oils.',
    editorialStory:
      'Engineered to replace synthetic ammonia and harsh petrochemical sprays around the kitchen and bath. Pet- and child-safe with zero artificial fragrances or dyes—bottled in reusable UV-shielded amber glass.',
    image: CLEANER_IMAGE,
    imageAlt:
      'Mini Meadow Plant-Based All-Purpose Cleaner amber glass spray bottle front and back showing citrus and eucalyptus botanical label',
    aromaProfile: 'Zesty cold-pressed lemon peel, crisp eucalyptus leaf',
    originSummary: 'Made in India · Plant-Derived',
    batchId: 'MM-APC-02',
    packagingSpec: {
      vessel: '500 ml UV-filtering amber glass trigger spray bottle',
      closure: 'Heavy-duty reusable mist/stream trigger nozzle',
      labelMaterial: 'Unbleached kraft fiber label printed with plant ink',
      endOfLife: 'Refillable glass bottle · 100% biodegradable formula',
    },
    certifications: ['100% Plant-Derived', 'Biodegradable & Non-Toxic', 'Pet & Child Safe'],
    variants: [
      {
        id: 'cleaner-500ml',
        label: '500 ml Amber Trigger',
        weightOrVolume: '500 ml / 16.9 fl oz',
        price: 399,
        packagingNote: 'Reusable amber glass spray bottle',
      },
      {
        id: 'cleaner-1000ml',
        label: '1L Refill Bottle',
        weightOrVolume: '1000 ml / 33.8 fl oz',
        price: 699,
        packagingNote: 'Aluminum-capped refill vessel',
      },
    ],
    ritualDurationSeconds: 60,
    ritualSteps: [
      {
        stepNumber: '01',
        title: 'Spray Directly',
        metric: '2–3 mists',
        instruction:
          'Mist evenly onto kitchen countertops, glass, sealed wood, or ceramic tiles.',
        iconName: 'droplet',
      },
      {
        stepNumber: '02',
        title: 'Lift & Dissolve',
        metric: '30 sec dwell',
        instruction:
          'Allow plant-derived coconut & corn surfactants a brief pause to loosen grease naturally.',
        iconName: 'hand',
      },
      {
        stepNumber: '03',
        title: 'Wipe Clean',
        metric: '1 min',
        instruction:
          'Wipe dry with a damp cotton cloth or reusable towel for a streak-free botanical finish.',
        iconName: 'timer',
      },
    ],
    compounds: [
      {
        id: 'cmp-surfactant',
        commonName: 'Coconut & Corn Surfactants',
        latinName: 'Cocos nucifera · Zea mays',
        partUsed: 'Fermented Plant Glucosides',
        origin: 'Karnataka Cooperative, India',
        harvestMethod: 'Renewable crop derivative',
        extraction: 'Biodegradable enzymatic synthesis',
        batchCode: 'MM-APC-02A',
        harvestDate: '2026-05-12',
        purityNote: 'Non-ionic, zero sulfates or phosphates',
        percentage: '52%',
      },
      {
        id: 'cmp-lemon-eucalyptus',
        commonName: 'Lemon & Eucalyptus Essential Oils',
        latinName: 'Citrus limon · Eucalyptus globulus',
        partUsed: 'Cold-Pressed Rind & Leaf',
        origin: 'Nilgiri Hills, India',
        harvestMethod: 'Pruned foliage & orchard rind',
        extraction: 'Cold expression & steam distillation',
        batchCode: 'MM-APC-02B',
        harvestDate: '2026-05-14',
        purityNote: 'Natural degreasing & aromatic profile',
        percentage: '28%',
      },
      {
        id: 'cmp-citric',
        commonName: 'Plant Citric Acid & Preservative',
        latinName: 'Citrus aurantium',
        partUsed: 'Organic Fruit Ferment',
        origin: 'Maharashtra Bio-Lab, India',
        harvestMethod: 'Plant-based fermentation',
        extraction: 'Purified aqueous crystal',
        batchCode: 'MM-APC-02C',
        harvestDate: '2026-05-18',
        purityNote: 'Balances pH & lifts mineral water spots',
        percentage: '20%',
      },
    ],
  },
  {
    id: 'tulsi-leaf-infusion',
    slug: 'tulsi-leaf-infusion',
    name: 'Organic Tulsi Infusion',
    latinSubtitle: 'Ocimum tenuiflorum · Krishna, Rama & Vana',
    category: 'Infusions',
    tag: '100% Organic',
    shortDescription:
      'Whole-leaf herbal tea blend of organic Krishna, Rama, and Vana Holy Basil leaves. 100% natural, caffeine-free & vegan.',
    editorialStory:
      'Packaged & marketed by Mini Meadow (Hinjawadi Phase 3, Pune - 411057) in unbleached resealable kraft pouches to preserve whole-leaf aroma. Combining Krishna, Rama, and Vana Tulsi varieties, each steep offers a warming botanical cup with zero calories and zero caffeine.',
    image: TULSI_IMAGE,
    imageAlt:
      'Mini Meadow Organic Tulsi Infusion unbleached kraft pouch front and back showing botanical illustration, brewing instructions, and ingredients',
    galleryImages: [
      {
        label: 'Kraft Pouch',
        src: TULSI_IMAGE,
      },
      {
        label: 'Front Label',
        src: '/assets/aistudio/Gemini_Generated_Image_1brncz1brncz1brn_cef95e68.jpeg',
      },
      {
        label: 'Full Label Spec',
        src: '/assets/aistudio/image_5b4b8bef_c9776642.jpg',
      },
    ],
    aromaProfile: 'Warm clove, sweet basil leaf, crisp meadow hay',
    originSummary: 'Mini Meadow · Hinjawadi Phase 3, Pune',
    batchId: 'MM-TI-01',
    packagingSpec: {
      vessel: 'Unbleached 100% wood-pulp kraft stand pouch with resealable zip',
      closure: 'Heat-sealed kraft top seam & compostable barrier liner',
      labelMaterial: 'Botanical kraft label · FSSAI Lic. No. 11526000000000',
      endOfLife: '100% natural · Store cool & dry, recycle cleanly',
    },
    certifications: ['100% Organic', 'Whole Leaf · 100g', 'Caffeine-Free & Vegan'],
    variants: [
      {
        id: 'tulsi-100g',
        label: '100g Kraft Pouch',
        weightOrVolume: '100g · Whole Leaf Blend',
        price: 249,
        packagingNote: 'MRP ₹249 (Incl. of all taxes)',
      },
      {
        id: 'tulsi-250g',
        label: '250g Family Refill',
        weightOrVolume: '250g · 125+ infusions',
        price: 549,
        packagingNote: 'Bulk kraft refill sleeve',
      },
    ],
    ritualDurationSeconds: 240,
    ritualSteps: [
      {
        stepNumber: '01',
        title: 'Leaf Quantity',
        metric: '1 tsp (2g) / cup',
        instruction:
          'Measure one teaspoon (2g) of whole Krishna, Rama & Vana Tulsi leaves per cup.',
        iconName: 'measure',
      },
      {
        stepNumber: '02',
        title: 'Water Temp',
        metric: '90°C – 95°C',
        instruction:
          'Pour hot water between 90°C and 95°C over the whole leaves to release essential aromatics.',
        iconName: 'temperature',
      },
      {
        stepNumber: '03',
        title: 'Steep Time',
        metric: '3–5 mins',
        instruction:
          'Cover vessel and steep for 3 to 5 minutes, then strain slowly and enjoy caffeine-free.',
        iconName: 'timer',
      },
    ],
    compounds: [
      {
        id: 'cmp-tulsi-rama',
        commonName: 'Rama & Vana Holy Basil',
        latinName: 'Ocimum tenuiflorum',
        partUsed: 'Whole Aerial Leaf & Blossom',
        origin: 'Almora Terraces, India',
        harvestMethod: 'Hand-plucked pre-flowering',
        extraction: 'Shade-cured whole leaf',
        batchCode: 'MM-TI-01A',
        harvestDate: '2026-12-01',
        purityNote: '100% organic whole leaf blend',
        percentage: '65%',
      },
      {
        id: 'cmp-tulsi-krishna',
        commonName: 'Krishna Purple Tulsi',
        latinName: 'Ocimum sanctum var. purpurea',
        partUsed: 'Deep Violet Leaf',
        origin: 'Kumaon Valley, India',
        harvestMethod: 'Regenerative hand shear',
        extraction: 'Cedar-rack air dried',
        batchCode: 'MM-TI-01B',
        harvestDate: '2026-12-01',
        purityNote: 'Rich in natural ursolic aromatics',
        percentage: '35%',
      },
    ],
  },
  {
    id: 'vetiver-cedar-edp',
    slug: 'vetiver-cedar-edp',
    name: 'Vetiver & Cedar Eau de Parfum',
    latinSubtitle: 'Chrysopogon zizanioides · Cedrus deodara',
    category: 'Perfumes',
    tag: 'Earthy Woody',
    shortDescription:
      'Earthy woody, smoked amber, and grounding wild-grass vetiver roots layered over Himalayan deodar cedarwood.',
    editorialStory:
      'Marketed by Mini Meadow (Hinjawadi Phase 3, Pune - 411057). Formulated in plant-derived alcohol denat. with natural essential oils of vetiver and cedarwood—anchoring smoked amber warmth with wild Khus root and evergreen cedar.',
    image: '/assets/aistudio/Gemini_Generated_Image_ve2o97ve2o97ve2o_0b519dd4.png',
    imageAlt:
      'Mini Meadow Vetiver and Cedar Botanical Eau de Parfum smoked glass flacon with pine cones and vetiver roots',
    galleryImages: [
      {
        label: 'Bottle Photo',
        src: '/assets/aistudio/Gemini_Generated_Image_ve2o97ve2o97ve2o_0b519dd4.png',
      },
      {
        label: '100 ml Front Label',
        src: '/assets/aistudio/Gemini_Generated_Image_sbta3psbta3psbta_fdee70ec.png',
      },
      {
        label: '100 ml Back Label',
        src: '/assets/aistudio/Gemini_Generated_Image_as2pweas2pweas2p_1c07071a.png',
      },
      {
        label: '50 ml Front Label',
        src: '/assets/aistudio/Gemini_Generated_Image_1brncz1brncz1brn__1__687e4fff.jpeg',
      },
      {
        label: '50 ml Label Sheet',
        src: '/assets/aistudio/image_7f381975_41d73ca2.jpg',
      },
      {
        label: 'Full EDP Quartet',
        src: PERFUME_LINEUP_IMAGE,
      },
    ],
    aromaProfile: 'Earthy Woody · Smoked Amber · Grounding',
    originSummary: 'Mini Meadow · Hinjawadi Phase 3, Pune',
    batchId: 'MM-EDP-VC01',
    olfactoryNotes: {
      top: 'Crushed Cedar Needle, Wild Grass Dew',
      heart: 'Kannauj Khus Vetiver Root, Smoked Amber',
      base: 'Himalayan Deodar Cedarwood, Dry Earth',
      longevity: '7–9 hours on pulse points',
      concentration: 'Natural Essential Oils · Eau de Parfum',
    },
    packagingSpec: {
      vessel: 'Heavy-base smoked glass apothecary flacon (50 ml / 100 ml)',
      closure: 'Recyclable anodized ribbed cap & fine mist atomizer',
      labelMaterial: 'Two-tone unbleached kraft & forest green botanical label',
      endOfLife: 'Refillable glass flacon · Best before 36 months',
    },
    certifications: ['Plant-Derived Spirit', 'Cruelty-Free & Vegan', 'Natural Essential Oils'],
    variants: [
      {
        id: 'vetiver-50ml',
        label: '50 ml Kraft Edition',
        weightOrVolume: '50 ml · MRP ₹499',
        price: 499,
        packagingNote: '50 ml Kraft label flacon',
      },
      {
        id: 'vetiver-100ml',
        label: '100 ml Apothecary Flacon',
        weightOrVolume: '100 ml / 3.4 fl oz · MRP ₹999',
        price: 999,
        packagingNote: 'Two-tone forest & kraft flacon',
      },
    ],
    ritualDurationSeconds: 60,
    ritualSteps: [
      {
        stepNumber: '01',
        title: 'Mist Pulse Points',
        metric: '15 cm distance',
        instruction:
          'Spray lightly onto pulse points (wrists, neck, behind ears) from 15 cm away.',
        iconName: 'droplet',
      },
      {
        stepNumber: '02',
        title: 'Do Not Rub',
        metric: '30 sec settle',
        instruction:
          'Do not rub into skin so crushed cedar needle and smoked amber top notes bloom intact.',
        iconName: 'hand',
      },
      {
        stepNumber: '03',
        title: 'Grounded Dry-Down',
        metric: '7–9 hrs wear',
        instruction:
          'Ideal as a deep base layer underneath lighter floral or citrus Mini Meadow perfumes.',
        iconName: 'timer',
      },
    ],
    compounds: [
      {
        id: 'cmp-vetiver-root',
        commonName: 'Wild Khus Vetiver Root',
        latinName: 'Chrysopogon zizanioides',
        partUsed: '18-Month Mature Rootlet',
        origin: 'Kannauj Watershed, UP',
        harvestMethod: 'Dry-season hand dig',
        extraction: 'Copper-deg hydro-distillation',
        batchCode: 'MM-EDP-VC01A',
        harvestDate: '2026-12-01',
        purityNote: 'Smoky grounding root essential oil',
        percentage: '48%',
      },
      {
        id: 'cmp-deodar-cedar',
        commonName: 'Himalayan Cedarwood',
        latinName: 'Cedrus deodara',
        partUsed: 'Reclaimed Heartwood',
        origin: 'Kullu Valley, Himachal',
        harvestMethod: 'Fallen timber reclamation',
        extraction: 'Low-pressure steam distillate',
        batchCode: 'MM-EDP-VC01B',
        harvestDate: '2026-12-01',
        purityNote: 'Warm woody cedarwood core',
        percentage: '52%',
      },
    ],
  },
  {
    id: 'tulsi-neroli-edp',
    slug: 'tulsi-neroli-edp',
    name: 'Tulsi & Neroli Eau de Parfum',
    latinSubtitle: 'Ocimum tenuiflorum · Citrus aurantium',
    category: 'Perfumes',
    tag: 'Spiced & Uplifting',
    shortDescription:
      'Fresh spiced herbal holy basil leaves brightened by hand-picked bitter orange blossom neroli in plant-derived spirit.',
    editorialStory:
      'Marketed by Mini Meadow (Hinjawadi Phase 3, Pune - 411057). A crisp botanical portrait where green Tulsi foliage meets sun-drenched orange blossom neroli—yielding an uplifting, spiced citrus trail.',
    image: '/assets/aistudio/Gemini_Generated_Image_ve2o97ve2o97ve2o__1__9dd82e47.png',
    imageAlt:
      'Mini Meadow Tulsi and Neroli Botanical Eau de Parfum azure glass bottle with tulsi and orange blossoms',
    galleryImages: [
      {
        label: 'Bottle Photo',
        src: '/assets/aistudio/Gemini_Generated_Image_ve2o97ve2o97ve2o__1__9dd82e47.png',
      },
      {
        label: '100 ml Front Label',
        src: '/assets/aistudio/Gemini_Generated_Image_sbta3psbta3psbta__1__0ec17150.png',
      },
      {
        label: '100 ml Back Label',
        src: '/assets/aistudio/Gemini_Generated_Image_as2pweas2pweas2p__1__d4bf0599.png',
      },
      {
        label: '50 ml Front Label',
        src: '/assets/aistudio/Gemini_Generated_Image_1brncz1brncz1brn__2__c29d3200.jpeg',
      },
      {
        label: '50 ml Label Sheet',
        src: '/assets/aistudio/image_335dda6a_233ee765.jpg',
      },
      {
        label: 'Full EDP Quartet',
        src: PERFUME_LINEUP_IMAGE,
      },
    ],
    aromaProfile: 'Spiced Herbal · Citrus Blossom · Uplifting',
    originSummary: 'Mini Meadow · Hinjawadi Phase 3, Pune',
    batchId: 'MM-EDP-TN01',
    olfactoryNotes: {
      top: 'Bitter Orange Neroli, Bright Citrus Peel',
      heart: 'Crushed Holy Basil (Tulsi), Fresh Blossom',
      base: 'Warm Spiced Herb, Light Resinous Wood',
      longevity: '6–8 hours on pulse points',
      concentration: 'Natural Essential Oils · Eau de Parfum',
    },
    packagingSpec: {
      vessel: 'Heavy-base tinted azure glass apothecary flacon (50 ml / 100 ml)',
      closure: 'Recyclable anodized ribbed cap & fine mist atomizer',
      labelMaterial: 'Two-tone unbleached kraft & forest green botanical label',
      endOfLife: 'Refillable glass flacon · Best before 36 months',
    },
    certifications: ['Plant-Derived Spirit', 'Cruelty-Free & Vegan', 'Natural Essential Oils'],
    variants: [
      {
        id: 'tulsi-edp-50ml',
        label: '50 ml Kraft Edition',
        weightOrVolume: '50 ml · MRP ₹499',
        price: 499,
        packagingNote: '50 ml Kraft label flacon',
      },
      {
        id: 'tulsi-edp-100ml',
        label: '100 ml Apothecary Flacon',
        weightOrVolume: '100 ml / 3.4 fl oz · MRP ₹999',
        price: 999,
        packagingNote: 'Two-tone forest & kraft flacon',
      },
    ],
    ritualDurationSeconds: 60,
    ritualSteps: [
      {
        stepNumber: '01',
        title: 'Mist Pulse Points',
        metric: '15 cm distance',
        instruction:
          'Spray lightly onto pulse points (wrists, neck, behind ears) from 15 cm away.',
        iconName: 'droplet',
      },
      {
        stepNumber: '02',
        title: 'Do Not Rub',
        metric: '30 sec settle',
        instruction:
          'Do not rub into skin so sparkling citrus blossom and crushed tulsi unfold cleanly.',
        iconName: 'hand',
      },
      {
        stepNumber: '03',
        title: 'Uplifting Veil',
        metric: '6–8 hrs wear',
        instruction:
          'Pairs effortlessly as a bright top veil layered over Vetiver & Cedar or Jasmine & Sandalwood.',
        iconName: 'timer',
      },
    ],
    compounds: [
      {
        id: 'cmp-edp-tulsi',
        commonName: 'Holy Basil Essential Distillate',
        latinName: 'Ocimum tenuiflorum',
        partUsed: 'Fresh Flowering Tops',
        origin: 'Almora Terraces, India',
        harvestMethod: 'Dawn hand harvest',
        extraction: 'Steam hydro-distillation',
        batchCode: 'MM-EDP-TN01A',
        harvestDate: '2026-12-01',
        purityNote: 'Bright clove-spiced herbal top',
        percentage: '45%',
      },
      {
        id: 'cmp-edp-neroli',
        commonName: 'Bitter Orange Blossom (Neroli)',
        latinName: 'Citrus aurantium',
        partUsed: 'Fresh White Blossom',
        origin: 'Nagpur Citrus Groves, India',
        harvestMethod: 'Pre-dawn hand bloom pick',
        extraction: 'Low-heat steam neroli oil',
        batchCode: 'MM-EDP-TN01B',
        harvestDate: '2026-12-01',
        purityNote: 'Honeyed floral citrus heart',
        percentage: '55%',
      },
    ],
  },
  {
    id: 'jasmine-sandalwood-edp',
    slug: 'jasmine-sandalwood-edp',
    name: 'Jasmine & Sandalwood Eau de Parfum',
    latinSubtitle: 'Jasminum sambac · Santalum album',
    category: 'Perfumes',
    tag: 'Velvety Floral',
    shortDescription:
      'Night-blooming Madurai jasmine wrapped in warm creamy sandalwood heartwood for an intimate, serene trail.',
    editorialStory:
      'Marketed by Mini Meadow (Hinjawadi Phase 3, Pune - 411057). Harvested before sunrise while jasmine buds still hold cool dew, this velvety floral composition settles onto creamy Indian sandalwood for calm longevity.',
    image: '/assets/aistudio/Gemini_Generated_Image_ve2o97ve2o97ve2o__2__79a5aca7.png',
    imageAlt:
      'Mini Meadow Jasmine and Sandalwood Botanical Eau de Parfum amber glass bottle with jasmine flowers and sandalwood',
    galleryImages: [
      {
        label: 'Bottle Photo',
        src: '/assets/aistudio/Gemini_Generated_Image_ve2o97ve2o97ve2o__2__79a5aca7.png',
      },
      {
        label: '100 ml Front Label',
        src: '/assets/aistudio/Gemini_Generated_Image_sbta3psbta3psbta__2__e0087ae2.png',
      },
      {
        label: '100 ml Back Label',
        src: '/assets/aistudio/Gemini_Generated_Image_as2pweas2pweas2p__2__720cf14b.png',
      },
      {
        label: '50 ml Front Label',
        src: '/assets/aistudio/Gemini_Generated_Image_1brncz1brncz1brn__3__4808fe0b.jpeg',
      },
      {
        label: '50 ml Label Sheet',
        src: '/assets/aistudio/image_668fb140_5ffc09f0.jpg',
      },
      {
        label: 'Full EDP Quartet',
        src: PERFUME_LINEUP_IMAGE,
      },
    ],
    aromaProfile: 'Velvety Floral · Warm Woody · Serene',
    originSummary: 'Mini Meadow · Hinjawadi Phase 3, Pune',
    batchId: 'MM-EDP-JS01',
    olfactoryNotes: {
      top: 'Dewy White Jasmine Bud, Soft Floral Mist',
      heart: 'Madurai Jasmine Sambac Petals',
      base: 'Creamy Mysuru Sandalwood, Warm Heartwood',
      longevity: '8–10 hours on pulse points',
      concentration: 'Natural Essential Oils · Eau de Parfum',
    },
    packagingSpec: {
      vessel: 'Heavy-base warm amber glass apothecary flacon (50 ml / 100 ml)',
      closure: 'Recyclable anodized ribbed cap & fine mist atomizer',
      labelMaterial: 'Two-tone unbleached kraft & forest green botanical label',
      endOfLife: 'Refillable glass flacon · Best before 36 months',
    },
    certifications: ['Plant-Derived Spirit', 'Cruelty-Free & Vegan', 'Natural Essential Oils'],
    variants: [
      {
        id: 'jasmine-50ml',
        label: '50 ml Kraft Edition',
        weightOrVolume: '50 ml · MRP ₹499',
        price: 499,
        packagingNote: '50 ml Kraft label flacon',
      },
      {
        id: 'jasmine-100ml',
        label: '100 ml Apothecary Flacon',
        weightOrVolume: '100 ml / 3.4 fl oz · MRP ₹999',
        price: 999,
        packagingNote: 'Two-tone forest & kraft flacon',
      },
    ],
    ritualDurationSeconds: 60,
    ritualSteps: [
      {
        stepNumber: '01',
        title: 'Mist Pulse Points',
        metric: '15 cm distance',
        instruction:
          'Spray lightly onto pulse points (wrists, neck, behind ears) from 15 cm away.',
        iconName: 'droplet',
      },
      {
        stepNumber: '02',
        title: 'Do Not Rub',
        metric: '30 sec settle',
        instruction:
          'Do not rub into skin so velvety Madurai jasmine opens evenly into sandalwood.',
        iconName: 'hand',
      },
      {
        stepNumber: '03',
        title: 'Serene Lingering',
        metric: '8–10 hrs wear',
        instruction:
          'Acts as a luminous floral-woody core when layered with Moringa & White Tea or Vetiver & Cedar.',
        iconName: 'timer',
      },
    ],
    compounds: [
      {
        id: 'cmp-jasmine-sambac',
        commonName: 'Madurai Jasmine Sambac',
        latinName: 'Jasminum sambac',
        partUsed: 'Pre-Dawn Flower Petal',
        origin: 'Madurai Plains, Tamil Nadu',
        harvestMethod: 'Sunrise hand-plucked buds',
        extraction: 'Botanical essential extraction',
        batchCode: 'MM-EDP-JS01A',
        harvestDate: '2026-12-01',
        purityNote: 'Intensely velvety white floral',
        percentage: '40%',
      },
      {
        id: 'cmp-mysore-sandal',
        commonName: 'Plantation Mysore Sandalwood',
        latinName: 'Santalum album',
        partUsed: 'Cultivated Heartwood',
        origin: 'Marayoor & Mysuru Plantations',
        harvestMethod: 'Certified sustainable harvest',
        extraction: 'Slow steam heartwood oil',
        batchCode: 'MM-EDP-JS01B',
        harvestDate: '2026-12-01',
        purityNote: 'High alpha-santalol creamy base',
        percentage: '60%',
      },
    ],
  },
  {
    id: 'moringa-white-tea-edp',
    slug: 'moringa-white-tea-edp',
    name: 'Moringa & White Tea Eau de Parfum',
    latinSubtitle: 'Moringa oleifera · Camellia sinensis',
    category: 'Perfumes',
    tag: 'Crisp & Delicate',
    shortDescription:
      'Crisp botanical moringa foliage infused with silky silver-needle white tea buds for a gentle, calming everyday veil.',
    editorialStory:
      'Marketed by Mini Meadow (Hinjawadi Phase 3, Pune - 411057). Clean, serene, and translucent like morning dew over tea slopes—pairing crisp green moringa leaf with delicate white tea blossoms.',
    image: '/assets/aistudio/Gemini_Generated_Image_ve2o97ve2o97ve2o__3__c3c31b69.png',
    imageAlt:
      'Mini Meadow Moringa and White Tea Botanical Eau de Parfum olive glass bottle with moringa leaves and white tea buds',
    galleryImages: [
      {
        label: 'Bottle Photo',
        src: '/assets/aistudio/Gemini_Generated_Image_ve2o97ve2o97ve2o__3__c3c31b69.png',
      },
      {
        label: '100 ml Front Label',
        src: '/assets/aistudio/Gemini_Generated_Image_sbta3psbta3psbta__3__2dead4a8.png',
      },
      {
        label: '100 ml Back Label',
        src: '/assets/aistudio/Gemini_Generated_Image_as2pweas2pweas2p__3__a611a0c9.png',
      },
      {
        label: '50 ml Label Sheet',
        src: '/assets/aistudio/image_8552f46a_05024f79.jpg',
      },
      {
        label: 'Full EDP Quartet',
        src: PERFUME_LINEUP_IMAGE,
      },
    ],
    aromaProfile: 'Crisp Green · Herbal · Delicate',
    originSummary: 'Mini Meadow · Hinjawadi Phase 3, Pune',
    batchId: 'MM-EDP-MW01',
    olfactoryNotes: {
      top: 'Crisp Green Moringa Leaf, Rain Dew',
      heart: 'Silver-Needle White Tea, Gentle Floral',
      base: 'Calming Soft Herb, Subtle Pale Wood',
      longevity: '6–7 hours on pulse points',
      concentration: 'Natural Essential Oils · Eau de Parfum',
    },
    packagingSpec: {
      vessel: 'Heavy-base olive-tinted glass apothecary flacon (50 ml / 100 ml)',
      closure: 'Recyclable anodized ribbed cap & fine mist atomizer',
      labelMaterial: 'Two-tone unbleached kraft & forest green botanical label',
      endOfLife: 'Refillable glass flacon · Best before 36 months',
    },
    certifications: ['Plant-Derived Spirit', 'Cruelty-Free & Vegan', 'Natural Essential Oils'],
    variants: [
      {
        id: 'moringa-50ml',
        label: '50 ml Kraft Edition',
        weightOrVolume: '50 ml · MRP ₹499',
        price: 499,
        packagingNote: '50 ml Kraft label flacon',
      },
      {
        id: 'moringa-100ml',
        label: '100 ml Apothecary Flacon',
        weightOrVolume: '100 ml / 3.4 fl oz · MRP ₹999',
        price: 999,
        packagingNote: 'Two-tone forest & kraft flacon',
      },
    ],
    ritualDurationSeconds: 60,
    ritualSteps: [
      {
        stepNumber: '01',
        title: 'Mist Pulse Points',
        metric: '15 cm distance',
        instruction:
          'Spray lightly onto pulse points (wrists, neck, behind ears) from 15 cm away.',
        iconName: 'droplet',
      },
      {
        stepNumber: '02',
        title: 'Do Not Rub',
        metric: '30 sec settle',
        instruction:
          'Do not rub into skin so crisp moringa leaf and delicate white tea stay translucent.',
        iconName: 'hand',
      },
      {
        stepNumber: '03',
        title: 'Calming Veil',
        metric: '6–7 hrs wear',
        instruction:
          'Ideal for softening deep woody scents like Vetiver & Cedar or brightening Jasmine & Sandalwood.',
        iconName: 'timer',
      },
    ],
    compounds: [
      {
        id: 'cmp-moringa-leaf',
        commonName: 'Green Moringa Foliage',
        latinName: 'Moringa oleifera',
        partUsed: 'Fresh Leaf & Blossom',
        origin: 'Coimbatore Organic Collective, TN',
        harvestMethod: 'Dry-land regenerative prune',
        extraction: 'Cold botanical leaf extract',
        batchCode: 'MM-EDP-MW01A',
        harvestDate: '2026-12-01',
        purityNote: 'Crisp verdant green top note',
        percentage: '42%',
      },
      {
        id: 'cmp-white-tea',
        commonName: 'Silver-Needle White Tea',
        latinName: 'Camellia sinensis',
        partUsed: 'Unopened Silvery Bud',
        origin: 'Kurseong Slopes, Darjeeling',
        harvestMethod: 'First-flush spring bud pick',
        extraction: 'Botanical aromatic extract',
        batchCode: 'MM-EDP-MW01B',
        harvestDate: '2026-12-01',
        purityNote: 'Delicate calming white tea heart',
        percentage: '58%',
      },
    ],
  },
];
