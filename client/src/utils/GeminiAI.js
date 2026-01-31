class GeminiAI {
  constructor() {
    this.apiKey = 'AIzaSyAFOhe4UBdjOGu9xMjEb0ffhYptnGP5E6Q';
    this.apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
    
    this.systemContext = `You are a helpful AI assistant for a perfume shop. Answer any question the user asks naturally and conversationally. If they ask about perfumes, help them. If they ask general questions, answer them politely and briefly, then offer to help with perfumes.

Available Products:
1. Floral Elegance - $89.99 (Floral, Notes: rose, jasmine, lily)
2. Ocean Breeze - $75.50 (Fresh, Notes: sea salt, citrus, mint)
3. Midnight Mystery - $120.00 (Oriental, Notes: vanilla, amber, musk)
4. Citrus Splash - $65.00 (Citrus, Notes: lemon, orange, grapefruit)
5. Spice Harmony - $95.00 (Woody, Notes: sandalwood, cedar, spices)

Be friendly, concise, and helpful. Use emojis appropriately.`;
    
    this.conversationHistory = [];
  }

  async generateResponse(userMessage, hasImage = false) {
    try {
      const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `${this.systemContext}\n\nUser: ${userMessage}\n\nAssistant:` }]
          }]
        })
      });

      if (!response.ok) throw new Error('API failed');

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || this.getFallbackResponse(userMessage);

    } catch (error) {
      return this.getFallbackResponse(userMessage);
    }
  }

  getFallbackResponse(message) {
    const msg = message.toLowerCase();
    
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
      return "👋 Hello! I'm your AI fragrance consultant. I can help you find the perfect perfume! What are you looking for today?";
    }
    
    if (msg.includes('floral') || msg.includes('flower')) {
      return "🌸 For floral fragrances, I recommend our Floral Elegance ($89.99) with beautiful notes of rose, jasmine, and lily. It's perfect for romantic occasions!";
    }
    
    if (msg.includes('fresh') || msg.includes('ocean') || msg.includes('citrus')) {
      return "🌊 For fresh scents, try Ocean Breeze ($75.50) with sea salt, citrus, and mint notes, or Citrus Splash ($65.00) with lemon, orange, and grapefruit. Both are perfect for daily wear!";
    }
    
    if (msg.includes('woody') || msg.includes('spice')) {
      return "🌲 Spice Harmony ($95.00) is our woody masterpiece with sandalwood, cedar, and exotic spices. Perfect for evening wear and special occasions!";
    }
    
    if (msg.includes('oriental') || msg.includes('vanilla') || msg.includes('night') || msg.includes('evening')) {
      return "✨ Midnight Mystery ($120.00) is our luxurious oriental fragrance with vanilla, amber, and musk. Perfect for evening events and making a lasting impression!";
    }
    
    if (msg.includes('price') || msg.includes('cheap') || msg.includes('budget')) {
      return "💰 Our fragrances range from $65 to $120:\n• Citrus Splash - $65\n• Ocean Breeze - $75.50\n• Floral Elegance - $89.99\n• Spice Harmony - $95\n• Midnight Mystery - $120\n\nWhich price range interests you?";
    }
    
    if (msg.includes('shipping') || msg.includes('delivery')) {
      return "🚚 Shipping Info:\n• Free shipping on orders $75+\n• Standard: 3-5 business days\n• Express: 1-2 business days\n• International: 7-14 days\n\nNeed to track an order?";
    }
    
    if (msg.includes('recommend') || msg.includes('suggest') || msg.includes('help')) {
      return "🎯 I'd love to help you find the perfect fragrance! Tell me:\n• What's the occasion? (daily, evening, special event)\n• Preferred scent family? (floral, fresh, woody, oriental, citrus)\n• Your budget?\n\nThis will help me give you the best recommendation!";
    }
    
    return "🌟 I'm here to help you find your perfect fragrance! You can ask me about:\n• Specific perfume recommendations\n• Product details and prices\n• Shipping and delivery\n• Order assistance\n\nWhat would you like to know?";
  }

  clearHistory() {
    this.conversationHistory = [];
  }
}

export default GeminiAI;
