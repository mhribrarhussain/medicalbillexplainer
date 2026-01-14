module.exports = [
  // Office & Evaluation
  {
    code: "99202",
    category: "Office & Evaluation",
    title: "New Patient Office Visit (Level 2)",
    description: "A 15-29 minute office visit for a new patient with a straightforward medical problem.",
    why_used: "Used when you see a doctor for the first time for a minor issue like a rash or simple infection.",
    price_low: 70,
    price_high: 130,
    misunderstood: false
  },
  {
    code: "99203",
    category: "Office & Evaluation",
    title: "New Patient Office Visit (Level 3)",
    description: "A 30-44 minute office visit for a new patient requiring a low level of medical decision making.",
    why_used: "Common for initial visits for standard conditions that need some checking but aren't emergencies.",
    price_low: 100,
    price_high: 200,
    misunderstood: false
  },
  {
    code: "99204",
    category: "Office & Evaluation",
    title: "New Patient Office Visit (Level 4)",
    description: "A 45-59 minute office visit for a new patient with a moderate complexity problem.",
    why_used: "Used for more complex new issues requiring detailed history and examination.",
    price_low: 150,
    price_high: 300,
    misunderstood: true
  },
  {
    code: "99205",
    category: "Office & Evaluation",
    title: "New Patient Office Visit (Level 5)",
    description: "A 60-74 minute office visit for a new patient with a high complexity problem.",
    why_used: "Used for severe or life-threatening conditions seen in an office setting for the first time.",
    price_low: 200,
    price_high: 400,
    misunderstood: true
  },
  {
    code: "99211",
    category: "Office & Evaluation",
    title: "Established Patient Office Visit (Level 1)",
    description: "A brief visit by a nurse or technician, not typically requiring a doctor.",
    why_used: "Often used for blood pressure checks or simple follow-ups.",
    price_low: 20,
    price_high: 50,
    misunderstood: true
  },
  {
    code: "99212",
    category: "Office & Evaluation",
    title: "Established Patient Office Visit (Level 2)",
    description: "A 10-19 minute visit for an existing patient with a straightforward problem.",
    why_used: "Routine check-ups for minor issues.",
    price_low: 40,
    price_high: 90,
    misunderstood: false
  },
  {
    code: "99213",
    category: "Office & Evaluation",
    title: "Established Patient Office Visit (Level 3)",
    description: "A 20-29 minute visit for an existing patient with low complexity needs.",
    why_used: "The most common code for a standard doctor's appointment (e.g., medication refill, basic sickness).",
    price_low: 70,
    price_high: 150,
    misunderstood: false
  },
  {
    code: "99214",
    category: "Office & Evaluation",
    title: "Established Patient Office Visit (Level 4)",
    description: "A 30-39 minute visit for an existing patient with moderate complexity needs.",
    why_used: "Used for managing chronic conditions or new, more complicated problems.",
    price_low: 100,
    price_high: 220,
    misunderstood: true
  },
  {
    code: "99215",
    category: "Office & Evaluation",
    title: "Established Patient Office Visit (Level 5)",
    description: "A 40-54 minute visit for an existing patient with high complexity needs.",
    why_used: "For serious or unstable conditions requiring significant time.",
    price_low: 150,
    price_high: 350,
    misunderstood: true
  },
  {
    code: "99281",
    category: "ER Visit",
    title: "Emergency Dept Visit (Level 1)",
    description: "Minor emergency problem.",
    why_used: "removing insect bite or minor dressing change.",
    price_low: 100,
    price_high: 250,
    misunderstood: false
  },
  {
    code: "99282",
    category: "ER Visit",
    title: "Emergency Dept Visit (Level 2)",
    description: "Low severity emergency problem.",
    why_used: "mild rash or minor injury without complications.",
    price_low: 150,
    price_high: 350,
    misunderstood: false
  },
  {
    code: "99283",
    category: "ER Visit",
    title: "Emergency Dept Visit (Level 3)",
    description: "Moderate severity emergency problem.",
    why_used: "fever, viral infection, or minor bone injury.",
    price_low: 250,
    price_high: 600,
    misunderstood: false
  },
  {
    code: "99284",
    category: "ER Visit",
    title: "Emergency Dept Visit (Level 4)",
    description: "High severity problem but not life-threatening immediately.",
    why_used: "kidney stones, unexplained abdominal pain, or fracture requiring setting.",
    price_low: 400,
    price_high: 1000,
    misunderstood: true
  },
  {
    code: "99285",
    category: "ER Visit",
    title: "Emergency Dept Visit (Level 5)",
    description: "High severity with immediate significant threat to life or function.",
    why_used: "Heart attack symptoms, severe trouble breathing, or major trauma.",
    price_low: 700,
    price_high: 2000,
    misunderstood: true
  },

  // Lab & Blood Tests
  {
    code: "80048",
    category: "Lab & Blood Tests",
    title: "Basic Metabolic Panel (BMP)",
    description: "A blood test measuring 8 substances: Calcium, Carbon Dioxide, Chloride, Creatinine, Glucose, Potassium, Sodium, Urea Nitrogen.",
    why_used: "Standard checkup to monitor kidney status and electrolyte balance.",
    price_low: 20,
    price_high: 60,
    misunderstood: false
  },
  {
    code: "80053",
    category: "Lab & Blood Tests",
    title: "Comprehensive Metabolic Panel (CMP)",
    description: "A blood test measuring 14 substances (all in BMP plus liver function tests).",
    why_used: "A very common yearly physical blood test to check overall organ health.",
    price_low: 30,
    price_high: 80,
    misunderstood: false
  },
  {
    code: "80061",
    category: "Lab & Blood Tests",
    title: "Lipid Panel",
    description: "Measures cholesterol levels (Total, HDL, LDL, Triglycerides).",
    why_used: "To assess heart disease risk.",
    price_low: 25,
    price_high: 70,
    misunderstood: false
  },
  {
    code: "81001",
    category: "Lab & Blood Tests",
    title: "Urinalysis with Microscopy",
    description: "Testing urine with a machine and looking at it under a microscope.",
    why_used: "Suspected urinary tract infection (UTI) or kidney issue.",
    price_low: 15,
    price_high: 40,
    misunderstood: false
  },
   {
    code: "81002",
    category: "Lab & Blood Tests",
    title: "Urinalysis without Microscopy",
    description: "Dipstick test of urine.",
    why_used: "Quick check for infection or sugar in urine.",
    price_low: 10,
    price_high: 30,
    misunderstood: false
  },
  {
    code: "82043",
    category: "Lab & Blood Tests",
    title: "Microalbumin (Urine)",
    description: "Checks for tiny amounts of protein (albumin) in urine.",
    why_used: "Early screening for kidney damage, especially in diabetics.",
    price_low: 20,
    price_high: 50,
    misunderstood: true
  },
  {
    code: "83036",
    category: "Lab & Blood Tests",
    title: "Hemoglobin A1c",
    description: "Measures average blood sugar over the past 3 months.",
    why_used: "Diagnosing or monitoring diabetes control.",
    price_low: 30,
    price_high: 80,
    misunderstood: false
  },
  {
    code: "84443",
    category: "Lab & Blood Tests",
    title: "TSH (Thyroid Stimulating Hormone)",
    description: "Measures thyroid function.",
    why_used: "To check if thyroid is overactive or underactive.",
    price_low: 35,
    price_high: 90,
    misunderstood: false
  },
   {
    code: "85025",
    category: "Lab & Blood Tests",
    title: "Complete Blood Count (CBC) with Differential",
    description: "Counts red cells, white cells, and platelets, plus types of white cells.",
    why_used: "Checks for anemia, infection, and leukemia.",
    price_low: 20,
    price_high: 50,
    misunderstood: false
  },
  {
    code: "85027",
    category: "Lab & Blood Tests",
    title: "Complete Blood Count (CBC) without Differential",
    description: "Counts red cells, white cells, and platelets.",
    why_used: "Basic check for anemia or bleeding risk.",
    price_low: 15,
    price_high: 40,
    misunderstood: false
  },
  {
    code: "36415",
    category: "Lab & Blood Tests",
    title: "Venipuncture (Blood Draw)",
    description: "The act of inserting a needle to take a blood sample.",
    why_used: "Charged almost every time you get blood work done.",
    price_low: 10,
    price_high: 35,
    misunderstood: true
  },

  // Imaging
  {
    code: "71045",
    category: "Imaging",
    title: "Chest X-Ray (Single View)",
    description: "One picture of the chest.",
    why_used: "Screening or checking line placement.",
    price_low: 40,
    price_high: 100,
    misunderstood: false
  },
  {
    code: "71046",
    category: "Imaging",
    title: "Chest X-Ray (Two Views)",
    description: "Two pictures of the chest (usually front and side).",
    why_used: "Suspected pneumonia, heart failure, or rib injury.",
    price_low: 50,
    price_high: 120,
    misunderstood: false
  },
  {
    code: "71047",
    category: "Imaging",
    title: "Chest X-Ray (3 or 4 Views)",
    description: "Multiple views of the chest.",
    why_used: "More complex evaluation of lungs or ribs.",
    price_low: 60,
    price_high: 150,
    misunderstood: false
  },
  {
    code: "72148",
    category: "Imaging",
    title: "MRI Lumbar Spine (No Contrast)",
    description: "Magnetic scan of the lower back.",
    why_used: "Lower back pain, sciatica, or herniated disc suspected.",
    price_low: 400,
    price_high: 1500,
    misunderstood: true
  },
  {
    code: "72149",
    category: "Imaging",
    title: "MRI Lumbar Spine (With Contrast)",
    description: "Magnetic scan of lower back with dye injection.",
    why_used: "Checking for tumors or infection in spine.",
    price_low: 500,
    price_high: 1800,
    misunderstood: true
  },
  {
    code: "72150",
    category: "Imaging",
    title: "MRI Lumbar Spine (With & Without Contrast)",
    description: "Double scan sequence.",
    why_used: "Detailed comparison for complex spinal issues.",
    price_low: 600,
    price_high: 2200,
    misunderstood: true
  },
  {
    code: "73560",
    category: "Imaging",
    title: "Knee X-Ray (1 or 2 Views)",
    description: "Basic pictures of the knee joint.",
    why_used: "Knee pain or minor injury.",
    price_low: 50,
    price_high: 120,
    misunderstood: false
  },
  {
    code: "73562",
    category: "Imaging",
    title: "Knee X-Ray (3 Views)",
    description: "Standard knee series (front, side, kneecap).",
    why_used: "Arthritis check or injury evaluation.",
    price_low: 60,
    price_high: 140,
    misunderstood: false
  },
  {
    code: "73610",
    category: "Imaging",
    title: "Ankle X-Ray (Complete, 3+ Views)",
    description: "Full set of ankle pictures.",
    why_used: "Sprained or broken ankle.",
    price_low: 60,
    price_high: 150,
    misunderstood: false
  },
  {
    code: "77067",
    category: "Imaging",
    title: "Screening Mammography (2D)",
    description: "Routine breast cancer screening X-ray.",
    why_used: "Preventive care for women.",
    price_low: 150,
    price_high: 400,
    misunderstood: false
  },

  // Cardiology
  {
    code: "93000",
    category: "Cardiology",
    title: "Electrocardiogram (ECG/EKG) Complete",
    description: "Recording of heart's electrical activity with interpretation.",
    why_used: "Chest pain, palpitations, or routine heart check.",
    price_low: 50,
    price_high: 150,
    misunderstood: false
  },
   {
    code: "93005",
    category: "Cardiology",
    title: "Electrocardiogram (ECG/EKG) Tracing Only",
    description: "Just the recording, no doctor reading included.",
    why_used: "Technical component of the test.",
    price_low: 20,
    price_high: 60,
    misunderstood: true
  },
  {
    code: "93010",
    category: "Cardiology",
    title: "Electrocardiogram (ECG/EKG) Report Only",
    description: "Doctor's reading of the EKG.",
    why_used: "Professional interpretation charge.",
    price_low: 20,
    price_high: 60,
    misunderstood: true
  },
  {
    code: "93306",
    category: "Cardiology",
    title: "Echocardiogram (Complete)",
    description: "Ultrasound of the heart including Doppler flow.",
    why_used: "Check heart valve function and pumping strength.",
    price_low: 500,
    price_high: 1500,
    misunderstood: false
  },
  {
    code: "93224",
    category: "Cardiology",
    title: "Holter Monitor (24-48 hr)",
    description: "Wearable heart monitor for a day or two.",
    why_used: "Capturing intermittent irregular heartbeats.",
    price_low: 200,
    price_high: 600,
    misunderstood: true
  },

  // Mental Health
  {
    code: "90791",
    category: "Mental Health",
    title: "Psychiatric Diagnostic Evaluation",
    description: "Initial intake interview for mental health.",
    why_used: "First visit to a therapist or psychiatrist to discuss history.",
    price_low: 150,
    price_high: 350,
    misunderstood: false
  },
  {
    code: "90834",
    category: "Mental Health",
    title: "Psychotherapy (45 minutes)",
    description: "Standard therapy session (38-52 mins).",
    why_used: "Regular counseling session.",
    price_low: 100,
    price_high: 250,
    misunderstood: false
  },
  {
    code: "90837",
    category: "Mental Health",
    title: "Psychotherapy (60 minutes)",
    description: "Extended therapy session (53+ mins).",
    why_used: "Deep processing or complex therapy session.",
    price_low: 120,
    price_high: 300,
    misunderstood: false
  },
  {
    code: "90847",
    category: "Mental Health",
    title: "Family Psychotherapy",
    description: "Therapy session with patient and family members.",
    why_used: "Couples therapy or parent-child counseling.",
    price_low: 120,
    price_high: 300,
    misunderstood: false
  },

  // Procedures & Injections
  {
    code: "12001",
    category: "Procedures",
    title: "Repair of Superficial Wound (up to 2.5cm)",
    description: "Stitches for a small cut on body (not face).",
    why_used: "Closing a minor cut.",
    price_low: 100,
    price_high: 300,
    misunderstood: false
  },
  {
    code: "12002",
    category: "Procedures",
    title: "Repair of Superficial Wound (2.6cm to 7.5cm)",
    description: "Stitches for a medium cut on body.",
    why_used: "Closing a slightly larger cut.",
    price_low: 150,
    price_high: 400,
    misunderstood: false
  },
  {
    code: "12004",
    category: "Procedures",
    title: "Repair of Superficial Wound (7.6cm to 12.5cm)",
    description: "Stitches for a long cut.",
    why_used: "Trauma or accident repair.",
    price_low: 200,
    price_high: 500,
    misunderstood: false
  },
  {
    code: "96372",
    category: "Injections",
    title: "Therapeutic Injection (SubQ/IM)",
    description: "Shot into muscle or skin (e.g., pain med, antibiotic).",
    why_used: "Administering a drug that isn't a vaccine.",
    price_low: 40,
    price_high: 100,
    misunderstood: true
  },
  {
    code: "96375",
    category: "Injections",
    title: "Each Additional Therapeutic Injection",
    description: "Second shot given during same visit.",
    why_used: "If you need two different medications.",
    price_low: 20,
    price_high: 60,
    misunderstood: false
  },
  {
    code: "96376",
    category: "Injections",
    title: "Each Additional Injection (Same Drug)",
    description: "Repeat shot of same drug.",
    why_used: "Need more of the same medication.",
    price_low: 20,
    price_high: 60,
    misunderstood: false
  },
  {
    code: "90471",
    category: "Injections",
    title: "Vaccine Administration (1st)",
    description: "The act of giving a vaccine.",
    why_used: "Flu shot or Tetanus shot fee.",
    price_low: 30,
    price_high: 70,
    misunderstood: true
  },
  {
    code: "90472",
    category: "Injections",
    title: "Vaccine Administration (Addl)",
    description: "Giving extra vaccines in same visit.",
    why_used: "Getting Flu and Pneumonia shots together.",
    price_low: 20,
    price_high: 50,
    misunderstood: false
  },

  // Medications
  {
    code: "J1100",
    category: "Medications",
    title: "Injection, Dexamethasone Sodium Phosphate, 1mg",
    description: "Steroid medication.",
    why_used: "Inflammation, allergic reactions, or croup.",
    price_low: 10,
    price_high: 40,
    misunderstood: true
  },
  {
    code: "J1885",
    category: "Medications",
    title: "Injection, Ketorolac Tromethamine (Toradol), 15mg",
    description: "Strong non-narcotic pain reliever.",
    why_used: "Kidney stones or severe back pain.",
    price_low: 15,
    price_high: 50,
    misunderstood: false
  },
  {
    code: "J0696",
    category: "Medications",
    title: "Injection, Ceftriaxone Sodium (Rocephin), 250mg",
    description: "Strong antibiotic.",
    why_used: "Severe infections like STDs or pneumonia.",
    price_low: 20,
    price_high: 80,
    misunderstood: false
  },
  {
    code: "J3420",
    category: "Medications",
    title: "Injection, Vitamin B-12 Cyanocobalamin, up to 1000mcg",
    description: "Vitamin B12 shot.",
    why_used: "Vitamin deficiency or energy boost shots.",
    price_low: 15,
    price_high: 45,
    misunderstood: false
  }
];
