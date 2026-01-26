// Mock AI Engine - Rule-based bill analysis
// This simulates AI behavior without using real AI APIs

const BILL_TEMPLATES = {
  electricity: {
    baseExplanation: "This is your electricity bill for the billing period. It shows your energy consumption and charges.",
    commonCharges: ["Energy charges", "Fixed charges", "Taxes", "Regulatory charges"],
    scamIndicators: ["Unusually high fixed charges", "Duplicate tax entries", "Meter reading discrepancies"],
    optionalCharges: ["Green energy surcharge", "Late payment fee", "Paper bill fee"]
  },
  hospital: {
    baseExplanation: "This is your hospital bill showing medical services, procedures, and medications provided during your visit.",
    commonCharges: ["Room charges", "Doctor fees", "Medications", "Lab tests", "Procedure costs"],
    scamIndicators: ["Unlisted procedures", "Overpriced medications", "Duplicate charges", "Unnecessary tests"],
    optionalCharges: ["Private room upgrade", "Additional services", "Insurance processing fee"]
  },
  credit_card: {
    baseExplanation: "This is your credit card statement showing transactions, payments, and charges for the billing cycle.",
    commonCharges: ["Purchases", "Interest charges", "Annual fee", "Late payment fee", "Cash advance fee"],
    scamIndicators: ["Unauthorized transactions", "Duplicate charges", "Hidden fees", "Interest rate changes"],
    optionalCharges: ["Credit protection", "Rewards program fee", "Paper statement fee"]
  },
  mobile_internet: {
    baseExplanation: "This is your mobile/internet bill showing usage, plan charges, and additional services.",
    commonCharges: ["Plan charges", "Data usage", "Call charges", "SMS charges", "Roaming charges"],
    scamIndicators: ["Overage charges without notice", "Hidden subscription fees", "Unauthorized add-ons"],
    optionalCharges: ["Data add-ons", "International calling", "Premium services", "Device insurance"]
  }
};

const HINDI_TRANSLATIONS = {
  electricity: {
    baseExplanation: "यह आपका बिजली का बिल है जो आपकी ऊर्जा खपत और शुल्क दिखाता है।",
    commonCharges: ["ऊर्जा शुल्क", "निश्चित शुल्क", "कर", "नियामक शुल्क"]
  },
  hospital: {
    baseExplanation: "यह आपका अस्पताल का बिल है जो चिकित्सा सेवाओं, प्रक्रियाओं और दवाओं को दिखाता है।",
    commonCharges: ["कमरे का शुल्क", "डॉक्टर की फीस", "दवाएं", "लैब टेस्ट"]
  },
  credit_card: {
    baseExplanation: "यह आपका क्रेडिट कार्ड स्टेटमेंट है जो लेनदेन, भुगतान और शुल्क दिखाता है।",
    commonCharges: ["खरीदारी", "ब्याज शुल्क", "वार्षिक शुल्क", "देर से भुगतान शुल्क"]
  },
  mobile_internet: {
    baseExplanation: "यह आपका मोबाइल/इंटरनेट बिल है जो उपयोग, योजना शुल्क और अतिरिक्त सेवाएं दिखाता है।",
    commonCharges: ["योजना शुल्क", "डेटा उपयोग", "कॉल शुल्क", "SMS शुल्क"]
  }
};

export function analyzeBill(billData, userInstruction = '', language = 'en') {
  const { type, amount, date } = billData;
  const template = BILL_TEMPLATES[type] || BILL_TEMPLATES.electricity;
  const isHindi = language === 'hi';

  // Generate explanation based on instruction
  let explanation = generateExplanation(template, amount, type, userInstruction, isHindi);
  
  // Generate scam alerts
  const scamAlerts = generateScamAlerts(template, amount, type, isHindi);
  
  // Generate optional charges
  const optionalCharges = generateOptionalCharges(template, amount, isHindi);
  
  // Generate suggestions
  const suggestions = generateSuggestions(type, amount, isHindi);

  return {
    explanation,
    scamAlerts,
    optionalCharges,
    suggestions,
    summary: {
      totalAmount: amount,
      billType: type,
      date: date,
      status: scamAlerts.length > 0 ? 'warning' : 'safe'
    }
  };
}

function generateExplanation(template, amount, type, instruction, isHindi) {
  let explanation = isHindi 
    ? (HINDI_TRANSLATIONS[type]?.baseExplanation || template.baseExplanation)
    : template.baseExplanation;

  // Custom instruction handling
  if (instruction.toLowerCase().includes('hindi') || instruction.toLowerCase().includes('हिंदी')) {
    explanation = HINDI_TRANSLATIONS[type]?.baseExplanation || explanation;
  }

  if (instruction.toLowerCase().includes('10') || instruction.toLowerCase().includes('child')) {
    explanation = isHindi
      ? `यह बिल बहुत आसान शब्दों में: आपने ₹${amount.toFixed(2)} का बिल प्राप्त किया है। यह ${type} के लिए है।`
      : `In simple terms: You received a bill of ₹${amount.toFixed(2)} for ${type}. This is what you need to pay.`;
  }

  if (instruction.toLowerCase().includes('hidden') || instruction.toLowerCase().includes('charges')) {
    const hiddenCharges = template.optionalCharges.join(', ');
    explanation += isHindi
      ? ` छुपे हुए शुल्क: ${hiddenCharges}`
      : ` Hidden charges to watch: ${hiddenCharges}`;
  }

  // Add amount context
  explanation += isHindi
    ? ` कुल राशि: ₹${amount.toFixed(2)} है।`
    : ` Total amount: ₹${amount.toFixed(2)}.`;

  return explanation;
}

function generateScamAlerts(template, amount, type, isHindi) {
  const alerts = [];
  
  // High amount check
  if (amount > 10000 && type === 'electricity') {
    alerts.push({
      type: 'warning',
      message: isHindi
        ? 'यह बिल सामान्य से अधिक लगता है। अपने पिछले बिलों से तुलना करें।'
        : 'This bill seems higher than usual. Compare with your previous bills.',
      severity: 'medium'
    });
  }

  // Random scam detection (for demo)
  if (Math.random() > 0.7) {
    const randomScam = template.scamIndicators[Math.floor(Math.random() * template.scamIndicators.length)];
    alerts.push({
      type: 'scam',
      message: isHindi
        ? `संदिग्ध: ${randomScam}`
        : `Suspicious: ${randomScam}`,
      severity: 'high'
    });
  }

  return alerts;
}

function generateOptionalCharges(template, amount, isHindi) {
  return template.optionalCharges.map(charge => ({
    name: charge,
    description: isHindi
      ? `यह शुल्क वैकल्पिक है और आप इसे रद्द कर सकते हैं।`
      : `This charge is optional and can be cancelled.`,
    amount: (amount * 0.05).toFixed(2) // 5% of bill as example
  }));
}

function generateSuggestions(type, amount, isHindi) {
  const suggestions = [];

  if (amount > 5000) {
    suggestions.push({
      type: 'tip',
      message: isHindi
        ? 'बड़े बिलों के लिए EMI विकल्प देखें।'
        : 'Consider EMI options for large bills.',
      color: 'green'
    });
  }

  suggestions.push({
    type: 'tip',
    message: isHindi
      ? 'अपने बिलों को नियमित रूप से ट्रैक करें ताकि खर्चों को बेहतर तरीके से प्रबंधित कर सकें।'
      : 'Track your bills regularly to better manage expenses.',
    color: 'green'
  });

  return suggestions;
}

export function generateChatResponse(userMessage, billContext, language = 'en') {
  const isHindi = language === 'hi';
  const lowerMessage = userMessage.toLowerCase();

  // Simple rule-based responses
  if (lowerMessage.includes('explain') || lowerMessage.includes('समझाओ')) {
    return isHindi
      ? 'मैं आपके बिल को आसान शब्दों में समझा सकता हूं। कृपया अपना बिल अपलोड करें।'
      : 'I can explain your bill in simple terms. Please upload your bill.';
  }

  if (lowerMessage.includes('scam') || lowerMessage.includes('धोखा')) {
    return isHindi
      ? 'मैं आपके बिल में संदिग्ध शुल्कों की जांच कर सकता हूं। अपलोड करने के बाद, मैं आपको सचेत करूंगा।'
      : 'I can check for suspicious charges in your bill. After upload, I will alert you.';
  }

  if (lowerMessage.includes('amount') || lowerMessage.includes('राशि')) {
    return isHindi
      ? `कुल राशि ₹${billContext?.amount || 'N/A'} है।`
      : `The total amount is ₹${billContext?.amount || 'N/A'}.`;
  }

  // Default response
  return isHindi
    ? 'मैं आपके बिलों के बारे में सवालों के जवाब देने में मदद कर सकता हूं। कृपया अपना बिल अपलोड करें या कोई सवाल पूछें।'
    : 'I can help answer questions about your bills. Please upload your bill or ask a question.';
}
