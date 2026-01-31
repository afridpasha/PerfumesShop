class VoiceService {
  constructor() {
    this.recognition = null;
    this.synthesis = null;
    this.isListening = false;
    this.isSpeaking = false;
    this.callbacks = {
      onResult: null,
      onError: null,
      onStart: null,
      onEnd: null,
      onSpeechStart: null,
      onSpeechEnd: null
    };
    
    this.initializeServices();
  }

  initializeServices() {
    // Try different speech recognition APIs
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new window.webkitSpeechRecognition();
    } else if ('SpeechRecognition' in window) {
      this.recognition = new window.SpeechRecognition();
    }

    if (this.recognition) {
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
      this.recognition.maxAlternatives = 3;

      this.setupRecognitionEvents();
    }

    if ('speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
    }
  }

  setupRecognitionEvents() {
    this.recognition.onstart = () => {
      this.isListening = true;
      this.callbacks.onStart?.();
    };
    
    this.recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      
      this.callbacks.onResult?.({
        final: finalTranscript,
        interim: interimTranscript,
        confidence: event.results[0]?.[0]?.confidence || 0
      });
    };
    
    this.recognition.onerror = (event) => {
      this.isListening = false;
      
      if (event.error === 'not-allowed') {
        this.callbacks.onError?.('permission-denied');
      } else if (event.error === 'no-speech') {
        this.callbacks.onEnd?.();
      } else {
        this.callbacks.onError?.(event.error);
      }
    };
    
    this.recognition.onend = () => {
      this.isListening = false;
      this.callbacks.onEnd?.();
    };
  }

  async startListening() {
    if (!this.recognition) {
      this.callbacks.onError?.('not-supported');
      return false;
    }

    if (this.isListening) {
      return true;
    }

    try {
      this.recognition.start();
      return true;
    } catch (error) {
      if (error.name === 'InvalidStateError') {
        this.stopListening();
        setTimeout(() => {
          try {
            this.recognition.start();
          } catch (e) {
            this.callbacks.onError?.('unknown-error');
          }
        }, 100);
        return true;
      }
      
      let errorType = 'unknown-error';
      if (error.name === 'NotAllowedError') {
        errorType = 'permission-denied';
      } else if (error.name === 'NotFoundError') {
        errorType = 'no-microphone';
      }

      this.callbacks.onError?.(errorType);
      return false;
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (error) {
        this.isListening = false;
      }
    }
  }

  speak(text, options = {}) {
    if (!this.synthesis || !text) return false;
    
    this.synthesis.cancel();
    
    const cleanText = this.cleanTextForSpeech(text);
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    utterance.rate = options.rate || 0.9;
    utterance.pitch = options.pitch || 1.1;
    utterance.volume = options.volume || 0.8;
    utterance.lang = options.lang || 'en-US';
    
    const voices = this.synthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.lang.includes('en') && 
      (voice.name.includes('Female') || voice.name.includes('Google'))
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    utterance.onstart = () => {
      this.isSpeaking = true;
      this.callbacks.onSpeechStart?.();
    };
    
    utterance.onend = () => {
      this.isSpeaking = false;
      this.callbacks.onSpeechEnd?.();
    };
    
    utterance.onerror = (event) => {
      this.isSpeaking = false;
      console.error('Speech synthesis error:', event.error);
    };
    
    this.synthesis.speak(utterance);
    return true;
  }

  stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel();
      this.isSpeaking = false;
    }
  }

  cleanTextForSpeech(text) {
    return text
      .replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '')
      .replace(/•/g, '. ')
      .replace(/\s+/g, ' ')
      .replace(/([.!?])\s*([A-Z])/g, '$1 $2')
      .trim();
  }

  setCallbacks(callbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  isSupported() {
    return {
      recognition: !!this.recognition,
      synthesis: !!this.synthesis
    };
  }

  getAvailableVoices() {
    if (!this.synthesis) return [];
    return this.synthesis.getVoices();
  }

  destroy() {
    this.stopListening();
    this.stopSpeaking();
    this.recognition = null;
    this.synthesis = null;
    this.callbacks = {};
  }
}

export default VoiceService;