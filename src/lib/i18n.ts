export type Lang = "en" | "hi" | "kn" | "te" | "ta";

export const langLabels: Record<Lang, string> = {
  en: "English",
  hi: "हिन्दी",
  kn: "ಕನ್ನಡ",
  te: "తెలుగు",
  ta: "தமிழ்",
};

type TranslationKeys = {
  // Welcome
  brand: string;
  tagline: string;
  heroTitle1: string;
  heroTitle2: string;
  heroSub: string;
  heroDesc1: string;
  heroDesc2: string;
  zeroBrokerage: string;
  personalCall: string;
  stayPeacefully: string;
  selectLanguage: string;
  // Scenarios
  scenarioArrived: string;
  scenarioArrivedSub: string;
  scenarioEscape: string;
  scenarioEscapeSub: string;
  scenarioMoving: string;
  scenarioMovingSub: string;
  scenarioUpgrade: string;
  scenarioUpgradeSub: string;
  scenarioBudget: string;
  scenarioBudgetSub: string;
  // Scenario eyebrows
  eyebrowArrived: string;
  eyebrowEscape: string;
  eyebrowMoving: string;
  eyebrowUpgrade: string;
  eyebrowBudget: string;
  // Arrived scenario
  arrivedTitle: string;
  arrivedSub: string;
  arrived1_3: string;
  arrived1_3Sub: string;
  arrived4_7: string;
  arrived4_7Sub: string;
  arrived1_2weeks: string;
  arrived1_2weeksSub: string;
  arrivedNotYet: string;
  arrivedNotYetSub: string;
  // Escape scenario
  escapeTitle: string;
  escapeSub: string;
  escapeNoise: string;
  escapeCleanliness: string;
  escapeFood: string;
  escapeOwner: string;
  escapeWifi: string;
  escapeCurfew: string;
  escapeExpensive: string;
  escapeMultiple: string;
  // Moving scenario
  movingTitle: string;
  movingSub: string;
  movingFromCity: string;
  movingFromCityPlaceholder: string;
  movingArrivalDate: string;
  movingTravelBooked: string;
  // Upgrade scenario
  upgradeTitle: string;
  upgradeSub: string;
  upgradeCurrentRent: string;
  upgradeCurrentRentPlaceholder: string;
  upgradeWishList: string;
  upgradeWishListPlaceholder: string;
  // Budget scenario
  budgetTitle: string;
  budgetSub: string;
  budgetCurrentRent: string;
  budgetCurrentRentPlaceholder: string;
  budgetTargetMax: string;
  budgetTargetMaxPlaceholder: string;
  // Location
  locationTitle: string;
  locationSub: string;
  locationPreferred: string;
  locationPlaceholder: string;
  monthlyBudget: string;
  roomType: string;
  roomSingle: string;
  roomSharing: string;
  roomAny: string;
  gender: string;
  genderMale: string;
  genderFemale: string;
  genderOther: string;
  occupation: string;
  occupationPlaceholder: string;
  // Lifestyle
  lifestyleTitle: string;
  lifestyleEyebrow: string;
  foodPref: string;
  foodVeg: string;
  foodNonVeg: string;
  foodJain: string;
  foodNoPref: string;
  wfh: string;
  wfhOffice: string;
  wfhHybrid: string;
  wfhMostly: string;
  wfhRemote: string;
  homeBy: string;
  homeBefore7: string;
  home7to10: string;
  homeAfter10: string;
  homeVaries: string;
  needParking: string;
  needParkingSub: string;
  amenitiesLabel: string;
  oneLastThing: string;
  // Contact
  contactEyebrow: string;
  contactTitle: string;
  contactDesc: string;
  yourName: string;
  namePlaceholder: string;
  whatsappNumber: string;
  phonePlaceholder: string;
  emailLabel: string;
  emailOptional: string;
  emailPlaceholder: string;
  infoPrivacy: string;
  findMyStay: string;
  saving: string;
  nameError: string;
  phoneError: string;
  // Success
  youreAllSet: string;
  successTitle: string;
  successDesc: string;
  doneInSeconds: string;
  giftTitle: string;
  couponValue: string;
  promiseCall: string;
  promiseBrokerage: string;
  promiseHonest: string;
  shareOnWhatsapp: string;
  infoPrivacyFinal: string;
  continueBtn: string;
  somethingWentWrong: string;
  // Amenities
  fastWifi: string;
  homeCookedMeals: string;
  acRoom: string;
  nearMetro: string;
  powerBackup: string;
  noCurfew: string;
  laundry: string;
  housekeeping: string;
  gym: string;
  quietLocality: string;
  parking: string;
  security: string;
  studyRoom: string;
  hotWater: string;
  smartTv: string;
  attachedBathroom: string;
};

const en: TranslationKeys = {
  brand: "Gharpayy",
  tagline: "30 sec form · matched in 10 min",
  heroTitle1: "Find your",
  heroTitle2: "perfect stay.",
  heroSub: "PG · Flat rental · Multiple areas across Bangalore",
  heroDesc1: "I'm Aayushi. Nobody should feel hopeless searching for a home — not with dozens of tabs open and zero answers.",
  heroDesc2: "Invest 30 seconds. I'll find you the right place in under 10 minutes, personally.",
  zeroBrokerage: "Zero brokerage",
  personalCall: "Personal call in 10 min",
  stayPeacefully: "Stay peacefully for months",
  selectLanguage: "Select Language",
  scenarioArrived: "I just landed in Bangalore",
  scenarioArrivedSub: "In a hotel or new to the city",
  scenarioEscape: "My current PG is a nightmare",
  scenarioEscapeSub: "Need to get out — fast",
  scenarioMoving: "Moving to Bangalore soon",
  scenarioMovingSub: "From another city, planning ahead",
  scenarioUpgrade: "I want something better",
  scenarioUpgradeSub: "Time for an upgrade from where I am",
  scenarioBudget: "I need to cut my rent costs",
  scenarioBudgetSub: "Spending too much for what I get",
  eyebrowArrived: "Just arrived",
  eyebrowEscape: "Escape mode",
  eyebrowMoving: "Moving soon",
  eyebrowUpgrade: "Time to upgrade",
  eyebrowBudget: "Budget move",
  arrivedTitle: "How long have you\nbeen in the hotel?",
  arrivedSub: "We know hotel bills add up fast. Let's find you a real home.",
  arrived1_3: "1–3 nights",
  arrived1_3Sub: "Just arrived",
  arrived4_7: "4–7 nights",
  arrived4_7Sub: "Getting anxious",
  arrived1_2weeks: "1–2 weeks",
  arrived1_2weeksSub: "Burning cash",
  arrivedNotYet: "Haven't arrived",
  arrivedNotYetSub: "Planning ahead",
  escapeTitle: "What's the biggest\nproblem right now?",
  escapeSub: "Tell me honestly — I've heard it all. No judgment.",
  escapeNoise: "It's too noisy — I can't sleep or work",
  escapeCleanliness: "Bathrooms and rooms are filthy",
  escapeFood: "The food is genuinely terrible",
  escapeOwner: "The owner is unresponsive or rude",
  escapeWifi: "WiFi is useless — I can't work from here",
  escapeCurfew: "Curfew is ruining my social life",
  escapeExpensive: "I'm paying too much for too little",
  escapeMultiple: "Honestly? All of the above",
  movingTitle: "Where are you\nmoving from?",
  movingSub: "Moving cities is stressful. We'll make sure your room is ready before you land.",
  movingFromCity: "Which city are you coming from?",
  movingFromCityPlaceholder: "Mumbai, Delhi, Hyderabad, Chennai...",
  movingArrivalDate: "When do you arrive?",
  movingTravelBooked: "Travel booked already?",
  upgradeTitle: "Let's upgrade\nyour living",
  upgradeSub: "You deserve better. Tell us what you're paying now.",
  upgradeCurrentRent: "Current monthly rent",
  upgradeCurrentRentPlaceholder: "₹8,000",
  upgradeWishList: "What's missing in your current PG?",
  upgradeWishListPlaceholder: "Better food, WiFi, location...",
  budgetTitle: "Let's find you\na better deal",
  budgetSub: "Spending smart is smart. Let's cut that bill.",
  budgetCurrentRent: "Current monthly rent",
  budgetCurrentRentPlaceholder: "₹15,000",
  budgetTargetMax: "Max you want to pay",
  budgetTargetMaxPlaceholder: "₹10,000",
  locationTitle: "Where do you\nwant to stay?",
  locationSub: "Tell us your preferences and we'll match you perfectly.",
  locationPreferred: "Preferred area / locality",
  locationPlaceholder: "Koramangala, HSR, Indiranagar...",
  monthlyBudget: "Monthly budget",
  roomType: "Room type",
  roomSingle: "Single",
  roomSharing: "Sharing",
  roomAny: "Any",
  gender: "Who do you want to live with?",
  genderMale: "Looking for boys 👨",
  genderFemale: "Looking for girls 👩",
  genderOther: "Coed (mixed) 🤝",
  occupation: "Occupation",
  occupationPlaceholder: "Software engineer, student...",
  lifestyleTitle: "How do you\nactually live?",
  lifestyleEyebrow: "Your lifestyle",
  foodPref: "Food preference",
  foodVeg: "Vegetarian",
  foodNonVeg: "Non-Veg",
  foodJain: "Jain",
  foodNoPref: "No preference",
  wfh: "Work from home?",
  wfhOffice: "Full-time office",
  wfhHybrid: "2–3 days home",
  wfhMostly: "Mostly home",
  wfhRemote: "Fully remote",
  homeBy: "Usually home by?",
  homeBefore7: "Before 7 PM",
  home7to10: "7–10 PM",
  homeAfter10: "After 10 PM",
  homeVaries: "It varies",
  needParking: "Need parking?",
  needParkingSub: "Bike or car",
  amenitiesLabel: "Must-have amenities",
  oneLastThing: "One last thing",
  contactEyebrow: "Last step",
  contactTitle: "Where should\nwe reach you?",
  contactDesc: "Aayushi will personally call you — not a bot, not a script. Just one real conversation to match you perfectly.",
  yourName: "Your name",
  namePlaceholder: "First and last name",
  whatsappNumber: "WhatsApp number",
  phonePlaceholder: "10-digit mobile number",
  emailLabel: "Email",
  emailOptional: "(optional)",
  emailPlaceholder: "For your matched rooms",
  infoPrivacy: "Your information stays between us. Always.",
  findMyStay: "Find My Perfect Stay",
  saving: "Saving your details...",
  nameError: "Enter your name",
  phoneError: "Enter a valid 10-digit number",
  youreAllSet: "You're all set",
  successTitle: "Aayushi has\nyour profile.",
  successDesc: "She'll call you personally within 30 minutes with matched options.",
  doneInSeconds: "Done in {seconds} seconds.",
  giftTitle: "A small gift for your time",
  couponValue: "₹1,000 off your first month's rent",
  promiseCall: "One personal call. No call centers.",
  promiseBrokerage: "Zero brokerage. No hidden fees. Ever.",
  promiseHonest: "If we can't find it, we'll say so honestly.",
  shareOnWhatsapp: "Share on WhatsApp",
  infoPrivacyFinal: "Your info stays between us. Period.",
  continueBtn: "Continue",
  somethingWentWrong: "Something went wrong. Please try again.",
  fastWifi: "Fast WiFi",
  homeCookedMeals: "Home-cooked meals",
  acRoom: "AC room",
  nearMetro: "Near metro",
  powerBackup: "24/7 power backup",
  noCurfew: "No curfew",
  laundry: "Laundry",
  housekeeping: "Housekeeping",
  gym: "Gym",
  quietLocality: "Quiet locality",
  parking: "Parking",
  security: "Security",
  studyRoom: "Study room",
  hotWater: "Hot water",
  smartTv: "Smart TV",
  attachedBathroom: "Attached bathroom",
};

const hi: TranslationKeys = {
  brand: "Gharpayy",
  tagline: "30 सेकंड फॉर्म · 10 मिनट में मैच",
  heroTitle1: "अपना",
  heroTitle2: "परफेक्ट ठिकाना खोजें।",
  heroSub: "PG · फ्लैट किराया · बैंगलोर के कई इलाके",
  heroDesc1: "मैं आयुशी हूं। घर खोजते-खोजते निराश होना — दर्जनों टैब खुले हों और कोई जवाब न मिले — ये सही नहीं है।",
  heroDesc2: "30 सेकंड लगाइए। मैं आपको 10 मिनट में सही जगह ढूंढ दूंगी, खुद।",
  zeroBrokerage: "जीरो ब्रोकरेज",
  personalCall: "10 मिनट में कॉल",
  stayPeacefully: "महीनों सुकून से रहें",
  selectLanguage: "भाषा चुनें",
  scenarioArrived: "मैं अभी बैंगलोर आया/आई हूं",
  scenarioArrivedSub: "होटल में या शहर में नया/नई",
  scenarioEscape: "मेरा PG बहुत खराब है",
  scenarioEscapeSub: "जल्दी से निकलना है",
  scenarioMoving: "जल्दी बैंगलोर शिफ्ट हो रहा/रही हूं",
  scenarioMovingSub: "दूसरे शहर से, पहले से प्लान कर रहा/रही",
  scenarioUpgrade: "कुछ बेहतर चाहिए",
  scenarioUpgradeSub: "अपग्रेड का समय",
  scenarioBudget: "किराया कम करना है",
  scenarioBudgetSub: "जो मिल रहा है उसके लिए ज़्यादा दे रहा/रही हूं",
  eyebrowArrived: "अभी आए हैं",
  eyebrowEscape: "भागना है",
  eyebrowMoving: "जल्द आ रहे हैं",
  eyebrowUpgrade: "अपग्रेड टाइम",
  eyebrowBudget: "बजट मूव",
  arrivedTitle: "होटल में कितने\nदिन हो गए?",
  arrivedSub: "हम जानते हैं होटल के बिल तेज़ी से बढ़ते हैं। चलिए आपके लिए असली घर ढूंढते हैं।",
  arrived1_3: "1–3 रातें",
  arrived1_3Sub: "अभी आए",
  arrived4_7: "4–7 रातें",
  arrived4_7Sub: "चिंता हो रही है",
  arrived1_2weeks: "1–2 हफ्ते",
  arrived1_2weeksSub: "पैसे खर्च हो रहे",
  arrivedNotYet: "अभी नहीं आए",
  arrivedNotYetSub: "प्लान कर रहे",
  escapeTitle: "अभी सबसे बड़ी\nपरेशानी क्या है?",
  escapeSub: "ईमानदारी से बताइए — मैंने सब सुना है। कोई जज नहीं करेगा।",
  escapeNoise: "बहुत शोर है — सो या काम नहीं कर पा रहा/रही",
  escapeCleanliness: "बाथरूम और कमरे गंदे हैं",
  escapeFood: "खाना सच में बहुत खराब है",
  escapeOwner: "मालिक जवाब नहीं देता या रूड है",
  escapeWifi: "WiFi बेकार है — काम नहीं हो पा रहा",
  escapeCurfew: "कर्फ्यू से सोशल लाइफ खराब हो रही",
  escapeExpensive: "जो मिल रहा है उसके लिए बहुत ज़्यादा दे रहा/रही",
  escapeMultiple: "सच बताऊं? ये सब",
  movingTitle: "कहां से आ\nरहे हो?",
  movingSub: "शहर बदलना स्ट्रेसफुल है। हम यकीन दिलाते हैं आपका कमरा तैयार होगा।",
  movingFromCity: "किस शहर से आ रहे हो?",
  movingFromCityPlaceholder: "मुंबई, दिल्ली, हैदराबाद, चेन्नई...",
  movingArrivalDate: "कब पहुंच रहे हो?",
  movingTravelBooked: "ट्रैवल बुक हो गया?",
  upgradeTitle: "चलो लाइफ\nअपग्रेड करें",
  upgradeSub: "आप बेहतर के हकदार हैं। बताइए अभी कितना दे रहे हैं।",
  upgradeCurrentRent: "अभी का मासिक किराया",
  upgradeCurrentRentPlaceholder: "₹8,000",
  upgradeWishList: "अभी के PG में क्या कमी है?",
  upgradeWishListPlaceholder: "बेहतर खाना, WiFi, लोकेशन...",
  budgetTitle: "चलो बेहतर\nडील ढूंढें",
  budgetSub: "स्मार्ट खर्च ही स्मार्ट है। बिल कम करते हैं।",
  budgetCurrentRent: "अभी का मासिक किराया",
  budgetCurrentRentPlaceholder: "₹15,000",
  budgetTargetMax: "अधिकतम कितना देना चाहते हैं",
  budgetTargetMaxPlaceholder: "₹10,000",
  locationTitle: "कहां रहना\nचाहते हो?",
  locationSub: "अपनी पसंद बताइए, हम परफेक्ट मैच करेंगे।",
  locationPreferred: "पसंदीदा एरिया / इलाका",
  locationPlaceholder: "कोरमंगला, HSR, इंदिरानगर...",
  monthlyBudget: "मासिक बजट",
  roomType: "कमरे का प्रकार",
  roomSingle: "सिंगल",
  roomSharing: "शेयरिंग",
  roomAny: "कोई भी",
  gender: "किसके साथ रहना चाहते हो?",
  genderMale: "लड़के 👨",
  genderFemale: "लड़कियां 👩",
  genderOther: "मिक्स (कोएड) 🤝",
  occupation: "पेशा",
  occupationPlaceholder: "सॉफ्टवेयर इंजीनियर, स्टूडेंट...",
  lifestyleTitle: "आप कैसे\nरहते हैं?",
  lifestyleEyebrow: "आपकी जीवनशैली",
  foodPref: "खाने की पसंद",
  foodVeg: "शाकाहारी",
  foodNonVeg: "नॉन-वेज",
  foodJain: "जैन",
  foodNoPref: "कोई पसंद नहीं",
  wfh: "वर्क फ्रॉम होम?",
  wfhOffice: "फुल-टाइम ऑफिस",
  wfhHybrid: "2–3 दिन घर से",
  wfhMostly: "ज़्यादातर घर से",
  wfhRemote: "पूरा रिमोट",
  homeBy: "आमतौर पर कब तक घर?",
  homeBefore7: "शाम 7 से पहले",
  home7to10: "7–10 PM",
  homeAfter10: "रात 10 के बाद",
  homeVaries: "बदलता रहता है",
  needParking: "पार्किंग चाहिए?",
  needParkingSub: "बाइक या कार",
  amenitiesLabel: "ज़रूरी सुविधाएं",
  oneLastThing: "एक आखिरी बात",
  contactEyebrow: "आखिरी स्टेप",
  contactTitle: "हम आपसे कहां\nसंपर्क करें?",
  contactDesc: "आयुशी खुद आपको कॉल करेगी — कोई बॉट नहीं, कोई स्क्रिप्ट नहीं। बस एक असली बातचीत।",
  yourName: "आपका नाम",
  namePlaceholder: "पहला और आखिरी नाम",
  whatsappNumber: "WhatsApp नंबर",
  phonePlaceholder: "10 अंकों का मोबाइल नंबर",
  emailLabel: "ईमेल",
  emailOptional: "(वैकल्पिक)",
  emailPlaceholder: "मैच हुए कमरों के लिए",
  infoPrivacy: "आपकी जानकारी हमारे बीच रहेगी। हमेशा।",
  findMyStay: "मेरा परफेक्ट ठिकाना खोजें",
  saving: "डिटेल्स सेव हो रहे...",
  nameError: "अपना नाम डालें",
  phoneError: "सही 10 अंकों का नंबर डालें",
  youreAllSet: "सब तैयार है",
  successTitle: "आयुशी के पास\nआपकी प्रोफाइल है।",
  successDesc: "वो 30 मिनट में मैच ऑप्शन के साथ खुद कॉल करेंगी।",
  doneInSeconds: "{seconds} सेकंड में हो गया।",
  giftTitle: "आपके समय के लिए एक छोटा तोहफा",
  couponValue: "पहले महीने के किराये पर ₹1,000 की छूट",
  promiseCall: "एक पर्सनल कॉल। कोई कॉल सेंटर नहीं।",
  promiseBrokerage: "जीरो ब्रोकरेज। कोई छिपा शुल्क नहीं। कभी नहीं।",
  promiseHonest: "अगर नहीं मिला, तो ईमानदारी से बता देंगे।",
  shareOnWhatsapp: "WhatsApp पर शेयर करें",
  infoPrivacyFinal: "आपकी जानकारी हमारे बीच रहेगी। बस।",
  continueBtn: "आगे बढ़ें",
  somethingWentWrong: "कुछ गलत हो गया। कृपया फिर से कोशिश करें।",
  fastWifi: "तेज़ WiFi",
  homeCookedMeals: "घर का खाना",
  acRoom: "AC कमरा",
  nearMetro: "मेट्रो के पास",
  powerBackup: "24/7 पावर बैकअप",
  noCurfew: "कोई कर्फ्यू नहीं",
  laundry: "कपड़े धोने",
  housekeeping: "हाउसकीपिंग",
  gym: "जिम",
  quietLocality: "शांत इलाका",
  parking: "पार्किंग",
  security: "सिक्योरिटी",
  studyRoom: "स्टडी रूम",
  hotWater: "गर्म पानी",
  smartTv: "स्मार्ट TV",
  attachedBathroom: "अटैच्ड बाथरूम",
};

const kn: TranslationKeys = {
  brand: "Gharpayy",
  tagline: "30 ಸೆಕೆಂಡ್ ಫಾರ್ಮ್ · 10 ನಿಮಿಷದಲ್ಲಿ ಮ್ಯಾಚ್",
  heroTitle1: "ನಿಮ್ಮ",
  heroTitle2: "ಪರ್ಫೆಕ್ಟ್ ಮನೆ ಹುಡುಕಿ.",
  heroSub: "PG · ಫ್ಲ್ಯಾಟ್ ಬಾಡಿಗೆ · ಬೆಂಗಳೂರಿನ ಅನೇಕ ಪ್ರದೇಶಗಳು",
  heroDesc1: "ನಾನು ಆಯುಷಿ. ಮನೆ ಹುಡುಕುತ್ತಾ ನಿರಾಶೆ ಆಗಬಾರದು — ಡಜನ್ ಟ್ಯಾಬ್‌ಗಳು ತೆರೆದಿದ್ದರೂ ಉತ್ತರ ಇಲ್ಲ ಅನ್ನೋದು ಸರಿ ಅಲ್ಲ.",
  heroDesc2: "30 ಸೆಕೆಂಡ್ ಕೊಡಿ. 10 ನಿಮಿಷದಲ್ಲಿ ಸರಿಯಾದ ಜಾಗ ಹುಡುಕ್ತೀನಿ.",
  zeroBrokerage: "ಜೀರೋ ಬ್ರೋಕರೇಜ್",
  personalCall: "10 ನಿಮಿಷದಲ್ಲಿ ಕಾಲ್",
  stayPeacefully: "ತಿಂಗಳುಗಟ್ಟಲೆ ನೆಮ್ಮದಿಯಿಂದ ಇರಿ",
  selectLanguage: "ಭಾಷೆ ಆರಿಸಿ",
  scenarioArrived: "ನಾನು ಈಗಷ್ಟೇ ಬೆಂಗಳೂರಿಗೆ ಬಂದೆ",
  scenarioArrivedSub: "ಹೋಟೆಲ್‌ನಲ್ಲಿ ಅಥವಾ ನಗರಕ್ಕೆ ಹೊಸ",
  scenarioEscape: "ನನ್ನ ಈಗಿನ PG ಭಯಾನಕ",
  scenarioEscapeSub: "ಬೇಗ ಹೊರಬರಬೇಕು",
  scenarioMoving: "ಬೆಂಗಳೂರಿಗೆ ಶೀಘ್ರದಲ್ಲಿ ಬರ್ತಿದ್ದೀನಿ",
  scenarioMovingSub: "ಬೇರೆ ನಗರದಿಂದ, ಮುಂಚಿತವಾಗಿ ಯೋಜಿಸುತ್ತಿದ್ದೀನಿ",
  scenarioUpgrade: "ಏನಾದರೂ ಉತ್ತಮ ಬೇಕು",
  scenarioUpgradeSub: "ಅಪ್‌ಗ್ರೇಡ್ ಸಮಯ",
  scenarioBudget: "ಬಾಡಿಗೆ ಕಡಿಮೆ ಮಾಡಬೇಕು",
  scenarioBudgetSub: "ಸಿಗುತ್ತಿರುವುದಕ್ಕೆ ಹೆಚ್ಚು ಕೊಡ್ತಿದ್ದೀನಿ",
  eyebrowArrived: "ಈಗಷ್ಟೇ ಬಂದಿದ್ದೀರಿ",
  eyebrowEscape: "ಎಸ್ಕೇಪ್ ಮೋಡ್",
  eyebrowMoving: "ಶೀಘ್ರ ಬರ್ತಿದ್ದೀರಿ",
  eyebrowUpgrade: "ಅಪ್‌ಗ್ರೇಡ್ ಟೈಮ್",
  eyebrowBudget: "ಬಜೆಟ್ ಮೂವ್",
  arrivedTitle: "ಹೋಟೆಲ್‌ನಲ್ಲಿ ಎಷ್ಟು\nದಿನ ಆಯಿತು?",
  arrivedSub: "ಹೋಟೆಲ್ ಬಿಲ್‌ಗಳು ಬೇಗ ಹೆಚ್ಚಾಗುತ್ತವೆ ಅಂತ ಗೊತ್ತು. ನಿಮಗೆ ನಿಜವಾದ ಮನೆ ಹುಡುಕೋಣ.",
  arrived1_3: "1–3 ರಾತ್ರಿಗಳು",
  arrived1_3Sub: "ಈಗಷ್ಟೇ ಬಂದಿದ್ದೀರಿ",
  arrived4_7: "4–7 ರಾತ್ರಿಗಳು",
  arrived4_7Sub: "ಚಿಂತೆ ಶುರು",
  arrived1_2weeks: "1–2 ವಾರಗಳು",
  arrived1_2weeksSub: "ಹಣ ಖರ್ಚಾಗ್ತಿದೆ",
  arrivedNotYet: "ಇನ್ನೂ ಬಂದಿಲ್ಲ",
  arrivedNotYetSub: "ಯೋಜಿಸುತ್ತಿದ್ದೀರಿ",
  escapeTitle: "ಈಗ ಅತಿ ದೊಡ್ಡ\nಸಮಸ್ಯೆ ಏನು?",
  escapeSub: "ನಿಜ ಹೇಳಿ — ಎಲ್ಲಾ ಕೇಳಿದ್ದೇನೆ. ಯಾವ ತೀರ್ಪೂ ಇಲ್ಲ.",
  escapeNoise: "ತುಂಬಾ ಶಬ್ದ — ನಿದ್ರೆ ಅಥವಾ ಕೆಲಸ ಸಾಧ್ಯವಿಲ್ಲ",
  escapeCleanliness: "ಬಾತ್ರೂಮ್ ಮತ್ತು ಕೊಠಡಿಗಳು ಕೊಳಕು",
  escapeFood: "ಊಟ ನಿಜವಾಗಿಯೂ ಕೆಟ್ಟದ್ದು",
  escapeOwner: "ಮಾಲೀಕ ಉತ್ತರ ಕೊಡೋಲ್ಲ ಅಥವಾ ಒರಟು",
  escapeWifi: "WiFi ಬೇಡ — ಕೆಲಸ ಆಗ್ತಿಲ್ಲ",
  escapeCurfew: "ಕರ್ಫ್ಯೂ ಸೋಶಿಯಲ್ ಲೈಫ್ ಹಾಳು ಮಾಡ್ತಿದೆ",
  escapeExpensive: "ಸಿಗೋದಕ್ಕೆ ತುಂಬಾ ಕೊಡ್ತಿದ್ದೀನಿ",
  escapeMultiple: "ನಿಜ ಹೇಳ್ಲಾ? ಎಲ್ಲಾ",
  movingTitle: "ಎಲ್ಲಿಂದ\nಬರ್ತಿದ್ದೀರಿ?",
  movingSub: "ನಗರ ಬದಲಾಯಿಸೋದು ಕಷ್ಟ. ನಿಮ್ಮ ರೂಮ್ ರೆಡಿ ಇರುತ್ತೆ.",
  movingFromCity: "ಯಾವ ನಗರದಿಂದ ಬರ್ತಿದ್ದೀರಿ?",
  movingFromCityPlaceholder: "ಮುಂಬೈ, ದೆಹಲಿ, ಹೈದರಾಬಾದ್...",
  movingArrivalDate: "ಯಾವಾಗ ಬರ್ತೀರಿ?",
  movingTravelBooked: "ಟ್ರಾವೆಲ್ ಬುಕ್ ಆಗಿದೆಯಾ?",
  upgradeTitle: "ಲೈಫ್\nಅಪ್‌ಗ್ರೇಡ್ ಮಾಡೋಣ",
  upgradeSub: "ನೀವು ಉತ್ತಮಕ್ಕೆ ಅರ್ಹ. ಈಗ ಎಷ್ಟು ಕೊಡ್ತಿದ್ದೀರಿ ಹೇಳಿ.",
  upgradeCurrentRent: "ಈಗಿನ ಮಾಸಿಕ ಬಾಡಿಗೆ",
  upgradeCurrentRentPlaceholder: "₹8,000",
  upgradeWishList: "ಈಗಿನ PG ನಲ್ಲಿ ಏನು ಕಡಿಮೆ?",
  upgradeWishListPlaceholder: "ಉತ್ತಮ ಊಟ, WiFi, ಲೊಕೇಶನ್...",
  budgetTitle: "ಉತ್ತಮ ಡೀಲ್\nಹುಡುಕೋಣ",
  budgetSub: "ಸ್ಮಾರ್ಟ್ ಖರ್ಚು ಸ್ಮಾರ್ಟ್. ಬಿಲ್ ಕಡಿಮೆ ಮಾಡೋಣ.",
  budgetCurrentRent: "ಈಗಿನ ಮಾಸಿಕ ಬಾಡಿಗೆ",
  budgetCurrentRentPlaceholder: "₹15,000",
  budgetTargetMax: "ಹೆಚ್ಚೆಂದರೆ ಎಷ್ಟು ಕೊಡ್ತೀರಿ",
  budgetTargetMaxPlaceholder: "₹10,000",
  locationTitle: "ಎಲ್ಲಿ ಇರಲು\nಬಯಸ್ತೀರಿ?",
  locationSub: "ನಿಮ್ಮ ಆಯ್ಕೆಗಳನ್ನು ಹೇಳಿ, ಪರ್ಫೆಕ್ಟ್ ಮ್ಯಾಚ್ ಮಾಡ್ತೀವಿ.",
  locationPreferred: "ಇಷ್ಟದ ಪ್ರದೇಶ",
  locationPlaceholder: "ಕೋರಮಂಗಲ, HSR, ಇಂದಿರಾನಗರ...",
  monthlyBudget: "ಮಾಸಿಕ ಬಜೆಟ್",
  roomType: "ರೂಮ್ ಟೈಪ್",
  roomSingle: "ಸಿಂಗಲ್",
  roomSharing: "ಶೇರಿಂಗ್",
  roomAny: "ಯಾವುದಾದರೂ",
  gender: "ಯಾರೊಂದಿಗೆ ಇರಬಯಸುತ್ತೀರಿ?",
  genderMale: "ಹುಡುಗರು 👨",
  genderFemale: "ಹುಡುಗಿಯರು 👩",
  genderOther: "ಮಿಶ್ರ 🤝",
  occupation: "ಉದ್ಯೋಗ",
  occupationPlaceholder: "ಸಾಫ್ಟ್‌ವೇರ್ ಎಂಜಿನಿಯರ್, ವಿದ್ಯಾರ್ಥಿ...",
  lifestyleTitle: "ನೀವು ಹೇಗೆ\nಬದುಕ್ತೀರಿ?",
  lifestyleEyebrow: "ನಿಮ್ಮ ಜೀವನಶೈಲಿ",
  foodPref: "ಊಟದ ಆಯ್ಕೆ",
  foodVeg: "ಸಸ್ಯಾಹಾರಿ",
  foodNonVeg: "ಮಾಂಸಾಹಾರಿ",
  foodJain: "ಜೈನ",
  foodNoPref: "ಯಾವುದೂ ಸರಿ",
  wfh: "ಮನೆಯಿಂದ ಕೆಲಸ?",
  wfhOffice: "ಫುಲ್-ಟೈಮ್ ಆಫೀಸ್",
  wfhHybrid: "2–3 ದಿನ ಮನೆ",
  wfhMostly: "ಹೆಚ್ಚಾಗಿ ಮನೆ",
  wfhRemote: "ಪೂರ್ತಿ ರಿಮೋಟ್",
  homeBy: "ಸಾಮಾನ್ಯವಾಗಿ ಯಾವಾಗ ಮನೆಗೆ?",
  homeBefore7: "ಸಂಜೆ 7 ಮೊದಲು",
  home7to10: "7–10 PM",
  homeAfter10: "ರಾತ್ರಿ 10 ನಂತರ",
  homeVaries: "ಬದಲಾಗುತ್ತಿರುತ್ತೆ",
  needParking: "ಪಾರ್ಕಿಂಗ್ ಬೇಕಾ?",
  needParkingSub: "ಬೈಕ್ ಅಥವಾ ಕಾರ್",
  amenitiesLabel: "ಅಗತ್ಯ ಸೌಲಭ್ಯಗಳು",
  oneLastThing: "ಒಂದು ಕೊನೆಯ ವಿಷಯ",
  contactEyebrow: "ಕೊನೆಯ ಹಂತ",
  contactTitle: "ನಿಮ್ಮನ್ನು ಎಲ್ಲಿ\nತಲುಪಬೇಕು?",
  contactDesc: "ಆಯುಷಿ ಸ್ವತಃ ನಿಮಗೆ ಕಾಲ್ ಮಾಡ್ತಾರೆ — ಬಾಟ್ ಅಲ್ಲ, ಸ್ಕ್ರಿಪ್ಟ್ ಅಲ್ಲ.",
  yourName: "ನಿಮ್ಮ ಹೆಸರು",
  namePlaceholder: "ಮೊದಲ ಮತ್ತು ಕೊನೆಯ ಹೆಸರು",
  whatsappNumber: "WhatsApp ನಂಬರ್",
  phonePlaceholder: "10 ಅಂಕಿಯ ಮೊಬೈಲ್ ನಂಬರ್",
  emailLabel: "ಇಮೇಲ್",
  emailOptional: "(ಐಚ್ಛಿಕ)",
  emailPlaceholder: "ಮ್ಯಾಚ್ ಆದ ರೂಮ್‌ಗಳಿಗೆ",
  infoPrivacy: "ನಿಮ್ಮ ಮಾಹಿತಿ ನಮ್ಮ ನಡುವೆ ಇರುತ್ತೆ. ಯಾವಾಗಲೂ.",
  findMyStay: "ನನ್ನ ಪರ್ಫೆಕ್ಟ್ ಮನೆ ಹುಡುಕಿ",
  saving: "ಡೀಟೇಲ್ಸ್ ಸೇವ್ ಆಗ್ತಿದೆ...",
  nameError: "ನಿಮ್ಮ ಹೆಸರು ಹಾಕಿ",
  phoneError: "ಸರಿಯಾದ 10 ಅಂಕಿ ನಂಬರ್ ಹಾಕಿ",
  youreAllSet: "ಎಲ್ಲಾ ಸೆಟ್",
  successTitle: "ಆಯುಷಿ ಹತ್ತಿರ ನಿಮ್ಮ\nಪ್ರೊಫೈಲ್ ಇದೆ.",
  successDesc: "30 ನಿಮಿಷದಲ್ಲಿ ಮ್ಯಾಚ್ ಆಯ್ಕೆಗಳ ಜೊತೆ ಸ್ವತಃ ಕಾಲ್ ಮಾಡ್ತಾರೆ.",
  doneInSeconds: "{seconds} ಸೆಕೆಂಡ್‌ಗಳಲ್ಲಿ ಆಯ್ತು.",
  giftTitle: "ನಿಮ್ಮ ಸಮಯಕ್ಕೆ ಸಣ್ಣ ಉಡುಗೊರೆ",
  couponValue: "ಮೊದಲ ತಿಂಗಳ ಬಾಡಿಗೆಯಲ್ಲಿ ₹1,000 ರಿಯಾಯಿತಿ",
  promiseCall: "ಒಂದು ಪರ್ಸನಲ್ ಕಾಲ್. ಕಾಲ್ ಸೆಂಟರ್ ಅಲ್ಲ.",
  promiseBrokerage: "ಜೀರೋ ಬ್ರೋಕರೇಜ್. ಗುಪ್ತ ಶುಲ್ಕ ಇಲ್ಲ.",
  promiseHonest: "ಸಿಗದಿದ್ದರೆ, ಪ್ರಾಮಾಣಿಕವಾಗಿ ಹೇಳ್ತೀವಿ.",
  shareOnWhatsapp: "WhatsApp ನಲ್ಲಿ ಶೇರ್ ಮಾಡಿ",
  infoPrivacyFinal: "ನಿಮ್ಮ ಮಾಹಿತಿ ನಮ್ಮ ನಡುವೆ. ಅಷ್ಟೇ.",
  continueBtn: "ಮುಂದುವರಿಸಿ",
  somethingWentWrong: "ಏನೋ ತಪ್ಪಾಯಿತು. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
  fastWifi: "ವೇಗದ WiFi",
  homeCookedMeals: "ಮನೆ ಅಡುಗೆ",
  acRoom: "AC ಕೊಠಡಿ",
  nearMetro: "ಮೆಟ್ರೋ ಹತ್ತಿರ",
  powerBackup: "24/7 ಪವರ್ ಬ್ಯಾಕಪ್",
  noCurfew: "ಕರ್ಫ್ಯೂ ಇಲ್ಲ",
  laundry: "ಲಾಂಡ್ರಿ",
  housekeeping: "ಹೌಸ್‌ಕೀಪಿಂಗ್",
  gym: "ಜಿಮ್",
  quietLocality: "ಶಾಂತ ಪ್ರದೇಶ",
  parking: "ಪಾರ್ಕಿಂಗ್",
  security: "ಸೆಕ್ಯುರಿಟಿ",
  studyRoom: "ಸ್ಟಡಿ ರೂಮ್",
  hotWater: "ಬಿಸಿ ನೀರು",
  smartTv: "ಸ್ಮಾರ್ಟ್ TV",
  attachedBathroom: "ಅಟ್ಯಾಚ್ಡ್ ಬಾತ್ರೂಮ್",
};

const te: TranslationKeys = {
  brand: "Gharpayy",
  tagline: "30 సెకన్ల ఫారమ్ · 10 నిమిషాల్లో మ్యాచ్",
  heroTitle1: "మీ",
  heroTitle2: "పర్ఫెక్ట్ స్టే కనుగొనండి.",
  heroSub: "PG · ఫ్లాట్ అద్దె · బెంగళూరు అంతటా అనేక ప్రాంతాలు",
  heroDesc1: "నేను ఆయుషి. ఇల్లు వెతుకుతూ నిరాశ చెందడం — డజన్ల టాబ్‌లు తెరిచి ఉన్నా సమాధానం లేకపోవడం — ఇది సరి కాదు.",
  heroDesc2: "30 సెకన్లు ఇవ్వండి. 10 నిమిషాల్లో సరైన చోటు కనుగొంటాను.",
  zeroBrokerage: "జీరో బ్రోకరేజ్",
  personalCall: "10 నిమిషాల్లో కాల్",
  stayPeacefully: "నెలల పాటు ప్రశాంతంగా ఉండండి",
  selectLanguage: "భాష ఎంచుకోండి",
  scenarioArrived: "నేను ఇప్పుడే బెంగళూరు వచ్చాను",
  scenarioArrivedSub: "హోటల్లో లేదా నగరానికి కొత్త",
  scenarioEscape: "నా PG చాలా చెడ్డది",
  scenarioEscapeSub: "త్వరగా బయటపడాలి",
  scenarioMoving: "బెంగళూరుకు త్వరలో వస్తున్నాను",
  scenarioMovingSub: "వేరే నగరం నుండి, ముందుగా ప్లాన్ చేస్తున్నాను",
  scenarioUpgrade: "మంచిది కావాలి",
  scenarioUpgradeSub: "అప్‌గ్రేడ్ సమయం",
  scenarioBudget: "అద్దె తగ్గించుకోవాలి",
  scenarioBudgetSub: "దొరుకుతున్నదానికి ఎక్కువ ఇస్తున్నాను",
  eyebrowArrived: "ఇప్పుడే వచ్చారు",
  eyebrowEscape: "ఎస్కేప్ మోడ్",
  eyebrowMoving: "త్వరలో వస్తున్నారు",
  eyebrowUpgrade: "అప్‌గ్రేడ్ టైమ్",
  eyebrowBudget: "బడ్జెట్ మూవ్",
  arrivedTitle: "హోటల్లో ఎన్ని\nరోజులు అయింది?",
  arrivedSub: "హోటల్ బిల్లులు వేగంగా పెరుగుతాయని తెలుసు. నిజమైన ఇల్లు కనుగొందాం.",
  arrived1_3: "1–3 రాత్రులు",
  arrived1_3Sub: "ఇప్పుడే వచ్చారు",
  arrived4_7: "4–7 రాత్రులు",
  arrived4_7Sub: "ఆందోళన మొదలు",
  arrived1_2weeks: "1–2 వారాలు",
  arrived1_2weeksSub: "డబ్బు ఖర్చవుతోంది",
  arrivedNotYet: "ఇంకా రాలేదు",
  arrivedNotYetSub: "ప్లాన్ చేస్తున్నారు",
  escapeTitle: "ఇప్పుడు అతి పెద్ద\nసమస్య ఏమిటి?",
  escapeSub: "నిజం చెప్పండి — అన్నీ విన్నాను. ఏ తీర్పూ లేదు.",
  escapeNoise: "చాలా శబ్దం — నిద్ర లేదా పని కుదరడం లేదు",
  escapeCleanliness: "బాత్రూమ్‌లు, గదులు మురికిగా ఉన్నాయి",
  escapeFood: "తిండి నిజంగా చాలా చెడ్డది",
  escapeOwner: "యజమాని సమాధానం ఇవ్వడు లేదా మొరటు",
  escapeWifi: "WiFi పనికిరాదు — పని అవ్వడం లేదు",
  escapeCurfew: "కర్ఫ్యూ సోషల్ లైఫ్ పాడు చేస్తోంది",
  escapeExpensive: "దొరికేదానికి చాలా ఎక్కువ ఇస్తున్నాను",
  escapeMultiple: "నిజం చెప్పాలా? అన్నీ",
  movingTitle: "ఎక్కడ నుండి\nవస్తున్నారు?",
  movingSub: "నగరం మారడం కష్టం. మీ రూమ్ రెడీగా ఉంటుంది.",
  movingFromCity: "ఏ నగరం నుండి వస్తున్నారు?",
  movingFromCityPlaceholder: "ముంబై, ఢిల్లీ, హైదరాబాద్...",
  movingArrivalDate: "ఎప్పుడు వస్తారు?",
  movingTravelBooked: "ట్రావెల్ బుక్ అయిందా?",
  upgradeTitle: "లైఫ్\nఅప్‌గ్రేడ్ చేద్దాం",
  upgradeSub: "మీరు మంచిదానికి అర్హులు. ఇప్పుడు ఎంత ఇస్తున్నారో చెప్పండి.",
  upgradeCurrentRent: "ప్రస్తుత నెలవారీ అద్దె",
  upgradeCurrentRentPlaceholder: "₹8,000",
  upgradeWishList: "ప్రస్తుత PG లో ఏమి తక్కువ?",
  upgradeWishListPlaceholder: "మంచి భోజనం, WiFi, లొకేషన్...",
  budgetTitle: "మంచి డీల్\nకనుగొందాం",
  budgetSub: "స్మార్ట్‌గా ఖర్చు చేయడమే స్మార్ట్. బిల్ తగ్గిద్దాం.",
  budgetCurrentRent: "ప్రస్తుత నెలవారీ అద్దె",
  budgetCurrentRentPlaceholder: "₹15,000",
  budgetTargetMax: "గరిష్టంగా ఎంత ఇస్తారు",
  budgetTargetMaxPlaceholder: "₹10,000",
  locationTitle: "ఎక్కడ ఉండాలని\nకోరుకుంటున్నారు?",
  locationSub: "మీ ఆప్షన్స్ చెప్పండి, పర్ఫెక్ట్ మ్యాచ్ చేస్తాం.",
  locationPreferred: "ఇష్టమైన ప్రాంతం",
  locationPlaceholder: "కోరమంగల, HSR, ఇందిరానగర్...",
  monthlyBudget: "నెలవారీ బడ్జెట్",
  roomType: "రూమ్ టైప్",
  roomSingle: "సింగిల్",
  roomSharing: "షేరింగ్",
  roomAny: "ఏదైనా",
  gender: "ఎవరితో ఉండాలనుకుంటున్నారు?",
  genderMale: "అబ్బాయిలు 👨",
  genderFemale: "అమ్మాయిలు 👩",
  genderOther: "మిశ్రమ 🤝",
  occupation: "వృత్తి",
  occupationPlaceholder: "సాఫ్ట్‌వేర్ ఇంజనీర్, స్టూడెంట్...",
  lifestyleTitle: "మీరు ఎలా\nబతుకుతారు?",
  lifestyleEyebrow: "మీ జీవనశైలి",
  foodPref: "ఆహార ప్రాధాన్యత",
  foodVeg: "శాకాహారం",
  foodNonVeg: "నాన్-వెజ్",
  foodJain: "జైన్",
  foodNoPref: "ప్రాధాన్యత లేదు",
  wfh: "ఇంటి నుండి పని?",
  wfhOffice: "ఫుల్-టైమ్ ఆఫీస్",
  wfhHybrid: "2–3 రోజులు ఇంటి నుండి",
  wfhMostly: "ఎక్కువగా ఇంటి నుండి",
  wfhRemote: "పూర్తిగా రిమోట్",
  homeBy: "సాధారణంగా ఎప్పుడు ఇంటికి?",
  homeBefore7: "సాయంత్రం 7 ముందు",
  home7to10: "7–10 PM",
  homeAfter10: "రాత్రి 10 తర్వాత",
  homeVaries: "మారుతుంటుంది",
  needParking: "పార్కింగ్ కావాలా?",
  needParkingSub: "బైక్ లేదా కార్",
  amenitiesLabel: "తప్పనిసరి సౌకర్యాలు",
  oneLastThing: "ఒక చివరి విషయం",
  contactEyebrow: "చివరి అడుగు",
  contactTitle: "మిమ్మల్ని ఎక్కడ\nసంప్రదించాలి?",
  contactDesc: "ఆయుషి స్వయంగా మీకు కాల్ చేస్తారు — బాట్ కాదు, స్క్రిప్ట్ కాదు.",
  yourName: "మీ పేరు",
  namePlaceholder: "మొదటి మరియు చివరి పేరు",
  whatsappNumber: "WhatsApp నంబర్",
  phonePlaceholder: "10 అంకెల మొబైల్ నంబర్",
  emailLabel: "ఇమెయిల్",
  emailOptional: "(ఐచ్ఛికం)",
  emailPlaceholder: "మ్యాచ్ అయిన రూమ్‌ల కోసం",
  infoPrivacy: "మీ సమాచారం మన మధ్యనే ఉంటుంది. ఎల్లప్పుడూ.",
  findMyStay: "నా పర్ఫెక్ట్ స్టే కనుగొనండి",
  saving: "డీటైల్స్ సేవ్ అవుతున్నాయి...",
  nameError: "మీ పేరు నమోదు చేయండి",
  phoneError: "సరైన 10 అంకెల నంబర్ నమోదు చేయండి",
  youreAllSet: "అంతా రెడీ",
  successTitle: "ఆయుషి దగ్గర మీ\nప్రొఫైల్ ఉంది.",
  successDesc: "30 నిమిషాల్లో మ్యాచ్ ఆప్షన్స్‌తో స్వయంగా కాల్ చేస్తారు.",
  doneInSeconds: "{seconds} సెకన్లలో అయింది.",
  giftTitle: "మీ సమయానికి ఒక చిన్న బహుమతి",
  couponValue: "మొదటి నెల అద్దెలో ₹1,000 తగ్గింపు",
  promiseCall: "ఒక పర్సనల్ కాల్. కాల్ సెంటర్ కాదు.",
  promiseBrokerage: "జీరో బ్రోకరేజ్. దాచిన ఫీజు లేదు.",
  promiseHonest: "కనుగొనలేకపోతే, నిజాయితీగా చెబుతాం.",
  shareOnWhatsapp: "WhatsApp లో షేర్ చేయండి",
  infoPrivacyFinal: "మీ సమాచారం మన మధ్యనే. అంతే.",
  continueBtn: "కొనసాగించండి",
  somethingWentWrong: "ఏదో తప్పు జరిగింది. మళ్ళీ ప్రయత్నించండి.",
  fastWifi: "వేగవంతమైన WiFi",
  homeCookedMeals: "ఇంటి వంట",
  acRoom: "AC గది",
  nearMetro: "మెట్రో దగ్గర",
  powerBackup: "24/7 పవర్ బ్యాకప్",
  noCurfew: "కర్ఫ్యూ లేదు",
  laundry: "లాండ్రీ",
  housekeeping: "హౌస్‌కీపింగ్",
  gym: "జిమ్",
  quietLocality: "ప్రశాంత ప్రాంతం",
  parking: "పార్కింగ్",
  security: "సెక్యూరిటీ",
  studyRoom: "స్టడీ రూమ్",
  hotWater: "వేడి నీరు",
  smartTv: "స్మార్ట్ TV",
  attachedBathroom: "అటాచ్డ్ బాత్రూమ్",
};

const ta: TranslationKeys = {
  brand: "Gharpayy",
  tagline: "30 விநாடி படிவம் · 10 நிமிடத்தில் மேட்ச்",
  heroTitle1: "உங்கள்",
  heroTitle2: "சரியான இடத்தைக் கண்டறியுங்கள்.",
  heroSub: "PG · ஃபிளாட் வாடகை · பெங்களூரு முழுவதும் பல பகுதிகள்",
  heroDesc1: "நான் ஆயுஷி. வீடு தேடுவதில் நம்பிக்கை இழப்பது — டஜன் டேப்கள் திறந்திருந்தாலும் பதில் இல்லை — இது சரியில்லை.",
  heroDesc2: "30 விநாடிகள் கொடுங்கள். 10 நிமிடத்தில் சரியான இடம் கண்டுபிடிப்பேன்.",
  zeroBrokerage: "ஜீரோ புரோக்கரேஜ்",
  personalCall: "10 நிமிடத்தில் கால்",
  stayPeacefully: "மாதங்களாக அமைதியாக இருங்கள்",
  selectLanguage: "மொழி தேர்வு செய்யவும்",
  scenarioArrived: "நான் இப்போதுதான் பெங்களூரு வந்தேன்",
  scenarioArrivedSub: "ஹோட்டலில் அல்லது நகரத்திற்கு புதியவர்",
  scenarioEscape: "என் தற்போதைய PG மிக மோசம்",
  scenarioEscapeSub: "சீக்கிரம் வெளியேற வேண்டும்",
  scenarioMoving: "பெங்களூருக்கு விரைவில் வருகிறேன்",
  scenarioMovingSub: "வேறு நகரத்திலிருந்து, முன்கூட்டியே திட்டமிடுகிறேன்",
  scenarioUpgrade: "நல்லது வேண்டும்",
  scenarioUpgradeSub: "அப்கிரேட் நேரம்",
  scenarioBudget: "வாடகை குறைக்க வேண்டும்",
  scenarioBudgetSub: "கிடைப்பதற்கு அதிகம் செலுத்துகிறேன்",
  eyebrowArrived: "இப்போது வந்தீர்கள்",
  eyebrowEscape: "எஸ்கேப் மோட்",
  eyebrowMoving: "விரைவில் வருகிறீர்கள்",
  eyebrowUpgrade: "அப்கிரேட் டைம்",
  eyebrowBudget: "பட்ஜெட் மூவ்",
  arrivedTitle: "ஹோட்டலில் எத்தனை\nநாட்கள் ஆகின்றன?",
  arrivedSub: "ஹோட்டல் பில்கள் வேகமாக அதிகரிக்கும் என்று தெரியும். உங்களுக்கு உண்மையான வீடு கண்டுபிடிப்போம்.",
  arrived1_3: "1–3 இரவுகள்",
  arrived1_3Sub: "இப்போது வந்தீர்கள்",
  arrived4_7: "4–7 இரவுகள்",
  arrived4_7Sub: "கவலை தொடங்குகிறது",
  arrived1_2weeks: "1–2 வாரங்கள்",
  arrived1_2weeksSub: "பணம் செலவாகிறது",
  arrivedNotYet: "இன்னும் வரவில்லை",
  arrivedNotYetSub: "திட்டமிடுகிறீர்கள்",
  escapeTitle: "இப்போது மிகப்பெரிய\nபிரச்சனை என்ன?",
  escapeSub: "உண்மையாக சொல்லுங்கள் — எல்லாம் கேட்டிருக்கிறேன். எந்த தீர்ப்பும் இல்லை.",
  escapeNoise: "மிகவும் சத்தம் — தூங்கவோ வேலை செய்யவோ முடியவில்லை",
  escapeCleanliness: "குளியலறைகளும் அறைகளும் அழுக்கு",
  escapeFood: "உணவு உண்மையிலேயே மிக மோசம்",
  escapeOwner: "உரிமையாளர் பதில் தருவதில்லை அல்லது முரட்டு",
  escapeWifi: "WiFi பயனற்றது — வேலை ஆகவில்லை",
  escapeCurfew: "கர்ஃப்யூ சமூக வாழ்க்கையை பாழாக்குகிறது",
  escapeExpensive: "கிடைப்பதற்கு மிகவும் அதிகம் செலுத்துகிறேன்",
  escapeMultiple: "நேர்மையா சொல்லட்டுமா? எல்லாம்",
  movingTitle: "எங்கிருந்து\nவருகிறீர்கள்?",
  movingSub: "நகரம் மாறுவது கஷ்டம். உங்கள் ரூம் தயாராக இருக்கும்.",
  movingFromCity: "எந்த நகரத்திலிருந்து வருகிறீர்கள்?",
  movingFromCityPlaceholder: "மும்பை, டெல்லி, ஹைதராபாத்...",
  movingArrivalDate: "எப்போது வருவீர்கள்?",
  movingTravelBooked: "டிராவல் புக் ஆகிவிட்டதா?",
  upgradeTitle: "வாழ்க்கையை\nஅப்கிரேட் செய்யலாம்",
  upgradeSub: "நீங்கள் நல்லதற்கு தகுதியானவர். இப்போது எவ்வளவு தருகிறீர்கள் சொல்லுங்கள்.",
  upgradeCurrentRent: "தற்போதைய மாத வாடகை",
  upgradeCurrentRentPlaceholder: "₹8,000",
  upgradeWishList: "தற்போதைய PG-ல் என்ன குறை?",
  upgradeWishListPlaceholder: "நல்ல சாப்பாடு, WiFi, லொகேஷன்...",
  budgetTitle: "நல்ல டீல்\nகண்டுபிடிப்போம்",
  budgetSub: "ஸ்மார்ட்டாக செலவு செய்வதே ஸ்மார்ட். பில் குறைப்போம்.",
  budgetCurrentRent: "தற்போதைய மாத வாடகை",
  budgetCurrentRentPlaceholder: "₹15,000",
  budgetTargetMax: "அதிகபட்சம் எவ்வளவு தருவீர்கள்",
  budgetTargetMaxPlaceholder: "₹10,000",
  locationTitle: "எங்கே இருக்க\nவிரும்புகிறீர்கள்?",
  locationSub: "உங்கள் விருப்பங்களை சொல்லுங்கள், பர்ஃபெக்ட் மேட்ச் செய்வோம்.",
  locationPreferred: "விரும்பிய பகுதி",
  locationPlaceholder: "கோரமங்கலா, HSR, இந்திரா நகர்...",
  monthlyBudget: "மாத பட்ஜெட்",
  roomType: "ரூம் வகை",
  roomSingle: "சிங்கிள்",
  roomSharing: "ஷேரிங்",
  roomAny: "எதுவும்",
  gender: "யாருடன் வாழ விரும்புகிறீர்கள்?",
  genderMale: "ஆண்கள் 👨",
  genderFemale: "பெண்கள் 👩",
  genderOther: "கலப்பு 🤝",
  occupation: "தொழில்",
  occupationPlaceholder: "சாஃப்ட்வேர் இன்ஜினியர், மாணவர்...",
  lifestyleTitle: "நீங்கள் எப்படி\nவாழ்கிறீர்கள்?",
  lifestyleEyebrow: "உங்கள் வாழ்க்கை முறை",
  foodPref: "உணவு விருப்பம்",
  foodVeg: "சைவம்",
  foodNonVeg: "அசைவம்",
  foodJain: "ஜைன்",
  foodNoPref: "விருப்பம் இல்லை",
  wfh: "வீட்டிலிருந்து வேலை?",
  wfhOffice: "முழு நேர அலுவலகம்",
  wfhHybrid: "2–3 நாட்கள் வீட்டில்",
  wfhMostly: "பெரும்பாலும் வீட்டில்",
  wfhRemote: "முழு ரிமோட்",
  homeBy: "பொதுவாக எப்போது வீட்டிற்கு?",
  homeBefore7: "மாலை 7 முன்",
  home7to10: "7–10 PM",
  homeAfter10: "இரவு 10 பிறகு",
  homeVaries: "மாறும்",
  needParking: "பார்க்கிங் வேண்டுமா?",
  needParkingSub: "பைக் அல்லது கார்",
  amenitiesLabel: "தேவையான வசதிகள்",
  oneLastThing: "ஒரு கடைசி விஷயம்",
  contactEyebrow: "கடைசி படி",
  contactTitle: "உங்களை எங்கே\nதொடர்பு கொள்ள வேண்டும்?",
  contactDesc: "ஆயுஷி நேரடியாக உங்களுக்கு கால் செய்வார் — பாட் அல்ல, ஸ்கிரிப்ட் அல்ல.",
  yourName: "உங்கள் பெயர்",
  namePlaceholder: "முதல் மற்றும் கடைசி பெயர்",
  whatsappNumber: "WhatsApp எண்",
  phonePlaceholder: "10 இலக்க மொபைல் எண்",
  emailLabel: "இமெயில்",
  emailOptional: "(விருப்பம்)",
  emailPlaceholder: "மேட்ச் ஆன ரூம்களுக்கு",
  infoPrivacy: "உங்கள் தகவல் நம்மிடையே மட்டுமே. எப்போதும்.",
  findMyStay: "என் பர்ஃபெக்ட் ஸ்டே கண்டறியுங்கள்",
  saving: "விவரங்கள் சேமிக்கப்படுகின்றன...",
  nameError: "உங்கள் பெயரை உள்ளிடுங்கள்",
  phoneError: "சரியான 10 இலக்க எண்ணை உள்ளிடுங்கள்",
  youreAllSet: "எல்லாம் தயார்",
  successTitle: "ஆயுஷியிடம் உங்கள்\nப்ரொஃபைல் உள்ளது.",
  successDesc: "30 நிமிடத்தில் மேட்ச் ஆப்ஷன்களுடன் நேரடியாக கால் செய்வார்.",
  doneInSeconds: "{seconds} விநாடிகளில் முடிந்தது.",
  giftTitle: "உங்கள் நேரத்திற்கு சிறு பரிசு",
  couponValue: "முதல் மாத வாடகையில் ₹1,000 தள்ளுபடி",
  promiseCall: "ஒரு பர்சனல் கால். கால் சென்டர் அல்ல.",
  promiseBrokerage: "ஜீரோ புரோக்கரேஜ். மறைக்கப்பட்ட கட்டணம் இல்லை.",
  promiseHonest: "கண்டுபிடிக்க முடியாவிட்டால், நேர்மையாக சொல்வோம்.",
  shareOnWhatsapp: "WhatsApp-ல் பகிரவும்",
  infoPrivacyFinal: "உங்கள் தகவல் நம்மிடையே மட்டுமே. அவ்வளவுதான்.",
  continueBtn: "தொடரவும்",
  somethingWentWrong: "ஏதோ தவறு நடந்தது. மீண்டும் முயற்சிக்கவும்.",
  fastWifi: "வேகமான WiFi",
  homeCookedMeals: "வீட்டு சமையல்",
  acRoom: "AC அறை",
  nearMetro: "மெட்ரோ அருகில்",
  powerBackup: "24/7 பவர் பேக்கப்",
  noCurfew: "கர்ஃப்யூ இல்லை",
  laundry: "லாண்ட்ரி",
  housekeeping: "ஹவுஸ்கீப்பிங்",
  gym: "ஜிம்",
  quietLocality: "அமைதியான பகுதி",
  parking: "பார்க்கிங்",
  security: "செக்யூரிட்டி",
  studyRoom: "ஸ்டடி ரூம்",
  hotWater: "சூடான நீர்",
  smartTv: "ஸ்மார்ட் TV",
  attachedBathroom: "இணைக்கப்பட்ட குளியலறை",
};

const translations: Record<Lang, TranslationKeys> = { en, hi, kn, te, ta };

export function t(lang: Lang, key: keyof TranslationKeys): string {
  return translations[lang]?.[key] ?? translations.en[key] ?? key;
}

export function getAmenityKeys(): (keyof TranslationKeys)[] {
  return [
    "fastWifi", "homeCookedMeals", "acRoom", "nearMetro",
    "powerBackup", "noCurfew", "laundry", "housekeeping",
    "gym", "quietLocality", "parking", "security",
    "studyRoom", "hotWater", "smartTv", "attachedBathroom",
  ];
}
