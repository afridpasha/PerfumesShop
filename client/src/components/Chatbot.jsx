import React, { useState, useRef, useEffect } from 'react';
import { FaMicrophone, FaCamera, FaImage, FaPaperPlane, FaTimes, FaRobot, FaMicrophoneSlash, FaVolumeUp, FaStop } from 'react-icons/fa';
import GeminiAI from '../utils/GeminiAI';
import VoiceService from '../utils/VoiceService';
import '../styles/Chatbot.css';

const Chatbot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "👋 Hello! I'm your AI fragrance consultant. I can help you find the perfect perfume, answer questions about our products, assist with orders, and much more! How can I help you today? 🌟",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const geminiAIRef = useRef(null);
  const voiceServiceRef = useRef(null);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize AI service once
    if (!geminiAIRef.current) {
      geminiAIRef.current = new GeminiAI();
    }

    // Initialize voice service once
    if (!voiceServiceRef.current) {
      voiceServiceRef.current = new VoiceService();
      
      const support = voiceServiceRef.current.isSupported();
      setVoiceSupported(support.recognition);
      
      voiceServiceRef.current.setCallbacks({
        onResult: (result) => {
          if (result.final) {
            setInputText(result.final);
            setInterimTranscript('');
            setIsRecording(false);
          } else {
            setInterimTranscript(result.interim);
          }
        },
        onError: (error) => {
          console.error('Speech recognition error:', error);
          setIsRecording(false);
          setInterimTranscript('');
          
          if (error === 'permission-denied' || error === 'not-supported' || error === 'no-microphone') {
            let errorText = "❌ Voice input error: ";
            switch (error) {
              case 'permission-denied':
                errorText += "Microphone permission denied. Please allow microphone access.";
                break;
              case 'no-microphone':
                errorText += "No microphone found.";
                break;
              case 'not-supported':
                errorText += "Voice input not supported in this browser.";
                break;
              default:
                errorText += "Voice recognition failed.";
            }
            setMessages(prev => [...prev, {
              id: Date.now(),
              text: errorText,
              sender: 'bot',
              timestamp: new Date()
            }]);
          }
        },
        onStart: () => setIsRecording(true),
        onEnd: () => {
          setIsRecording(false);
          setInterimTranscript('');
        },
        onSpeechStart: () => setIsSpeaking(true),
        onSpeechEnd: () => setIsSpeaking(false)
      });
    }

    return () => {
      if (voiceServiceRef.current) {
        voiceServiceRef.current.destroy();
        voiceServiceRef.current = null;
      }
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const speakText = (text) => {
    if (voiceServiceRef.current) {
      voiceServiceRef.current.speak(text, {
        rate: 0.9,
        pitch: 1.1,
        volume: 0.8
      });
    }
  };

  const stopSpeaking = () => {
    if (voiceServiceRef.current) {
      voiceServiceRef.current.stopSpeaking();
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() && !selectedImage) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      image: selectedImage
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText('');
    setSelectedImage(null);
    setIsTyping(true);

    try {
      const response = await geminiAIRef.current.generateResponse(currentInput, !!selectedImage);
      
      const botMessage = {
        id: Date.now() + 1,
        text: response,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
      
      speakText(response);
    } catch (error) {
      console.error('AI response error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "I apologize, but I'm having trouble processing your request. Please try again!",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
    }
  };

  const handleVoiceRecord = async () => {
    if (isRecording) {
      if (voiceServiceRef.current) {
        voiceServiceRef.current.stopListening();
      }
      setIsRecording(false);
    } else {
      if (!voiceSupported || !voiceServiceRef.current) {
        setMessages(prev => [...prev, {
          id: Date.now(),
          text: "❌ Voice input not available in this browser.",
          sender: 'bot',
          timestamp: new Date()
        }]);
        return;
      }

      const started = await voiceServiceRef.current.startListening();
      if (!started) {
        setMessages(prev => [...prev, {
          id: Date.now(),
          text: "❌ Failed to start voice input. Please check microphone permissions.",
          sender: 'bot',
          timestamp: new Date()
        }]);
      }
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        const errorMessage = {
          id: Date.now(),
          text: "❌ Please select a valid image file (JPG, PNG, GIF, etc.).",
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
        return;
      }

      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        const errorMessage = {
          id: Date.now(),
          text: "❌ Image file is too large. Please select an image smaller than 10MB.",
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        const successMessage = {
          id: Date.now(),
          text: "📎 Image uploaded successfully! You can now send it with your message.",
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, successMessage]);
      };
      reader.onerror = () => {
        const errorMessage = {
          id: Date.now(),
          text: "❌ Failed to read the image file. Please try again.",
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCamera = async () => {
    try {
      // Check HTTPS requirement for camera access
      const isHttps = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
      if (!isHttps) {
        throw new Error('HTTPS required for camera access');
      }

      // Check if camera is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported in this browser');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowCamera(true);

        const cameraMessage = {
          id: Date.now(),
          text: "📷 Camera is ready! Position your item and click 'Capture Photo' when ready.",
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, cameraMessage]);
      }
    } catch (error) {
      console.error('Camera access error:', error);
      let errorText = "❌ Camera access failed.";

      if (error.name === 'NotAllowedError') {
        errorText += " Please allow camera access in your browser settings.";
      } else if (error.name === 'NotFoundError') {
        errorText += " No camera found on this device.";
      } else if (error.name === 'NotSupportedError') {
        errorText += " Camera not supported in this browser.";
      } else if (error.message && error.message.includes('HTTPS required')) {
        errorText += " Camera access requires HTTPS. Please access the site over HTTPS.";
      } else {
        errorText += " Please check your camera permissions and try again.";
      }

      const errorMessage = {
        id: Date.now(),
        text: errorText,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const capturePhoto = () => {
    try {
      if (!videoRef.current || !videoRef.current.videoWidth) {
        throw new Error('Camera not ready');
      }

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      context.filter = 'brightness(1.2) contrast(1.1)';
      context.drawImage(videoRef.current, 0, 0);

      const imageData = canvas.toDataURL('image/jpeg', 0.9);
      setSelectedImage(imageData);

      // Stop camera stream
      if (videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        stream.getTracks().forEach(track => track.stop());
      }
      setShowCamera(false);

      const captureMessage = {
        id: Date.now(),
        text: "📸 Perfect! Photo captured successfully. You can now send it with your message!",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, captureMessage]);
    } catch (error) {
      console.error('Photo capture error:', error);
      const errorMessage = {
        id: Date.now(),
        text: "❌ Failed to capture photo. Please try again.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="chatbot-overlay">
      <div className="chatbot-container">
        <div className="chatbot-header">
          <div className="bot-avatar">
            <FaRobot className="bot-icon" />
            <div className="pulse-ring"></div>
          </div>
          <div className="bot-info">
            <h3>AI Assistant</h3>
            <span className="status">Online • Ready to help</span>
          </div>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="chatbot-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.sender}`}>
              <div className="message-content">
                {message.image && (
                  <img src={message.image} alt="Shared" className="message-image" />
                )}
                <p>{message.text}</p>
                <span className="timestamp">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="message bot">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {selectedImage && (
          <div className="image-preview">
            <img src={selectedImage} alt="Preview" />
            <button onClick={() => setSelectedImage(null)}>
              <FaTimes />
            </button>
          </div>
        )}

        {showCamera && (
          <div className="camera-container">
            <video ref={videoRef} autoPlay className="camera-video" />
            <button className="capture-btn" onClick={capturePhoto}>
              📸 Capture Photo
            </button>
            <button className="close-camera-btn" onClick={() => {
              try {
                if (videoRef.current && videoRef.current.srcObject) {
                  const stream = videoRef.current.srcObject;
                  stream.getTracks().forEach(track => track.stop());
                }
                setShowCamera(false);
              } catch (error) {
                console.error('Error closing camera:', error);
                setShowCamera(false);
              }
            }}>
              <FaTimes />
            </button>
          </div>
        )}
        
        <div className="chatbot-input">
          <div className="input-actions">
            <button
              className={`action-btn ${isRecording ? 'recording' : ''}`}
              onClick={handleVoiceRecord}
              title="Voice Input"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/1082/1082810.png"
                alt="Voice Input"
                style={{ width: '20px', height: '20px', filter: isRecording ? 'brightness(0) invert(1)' : 'brightness(0) invert(1)' }}
              />
            </button>
            
            <button 
              className={`action-btn ${isSpeaking ? 'speaking' : ''}`}
              onClick={isSpeaking ? stopSpeaking : () => speakText(messages[messages.length - 1]?.text)}
              title="Text to Speech"
            >
              {isSpeaking ? <FaStop /> : <FaVolumeUp />}
            </button>
            
            <button
              className="action-btn"
              onClick={() => fileInputRef.current?.click()}
              title="Upload Image"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/126/126477.png"
                alt="Upload Image"
                style={{ width: '20px', height: '20px', filter: 'brightness(0) invert(1)' }}
              />
            </button>
            
            <button
              className="action-btn"
              onClick={handleCamera}
              title="Camera"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/685/685655.png"
                alt="Camera"
                style={{ width: '20px', height: '20px', filter: 'brightness(0) invert(1)' }}
              />
            </button>
          </div>

          <input
            type="text"
            value={inputText || interimTranscript}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={isRecording ? "🎤 Listening..." : "Type your message..."}
            className={`message-input ${isRecording ? 'recording' : ''} ${interimTranscript ? 'interim' : ''}`}
          />

          <button 
            className="send-btn"
            onClick={handleSendMessage}
            disabled={!inputText.trim() && !selectedImage}
            title="Send Message"
          >
            <FaPaperPlane />
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </div>
      </div>
    </div>
  );
};

export default Chatbot;