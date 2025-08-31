interface Emotion {
  name: string;
  score: number;
}

interface HumeStreamingResponse {
  type: string;
  models?: {
    language?: {
      predictions?: Array<{
        text: string;
        emotions: Array<{
          name: string;
          score: number;
        }>;
      }>;
    };
  };
  message?: {
    role: string;
    content: string;
  };
  audio?: string; // Base64 encoded audio from Hume TTS
}

class HumeVoiceClient {
  private ws: WebSocket | null = null;
  private accessToken: string | null = null;
  private readonly configId: string;
  private readonly apiKey: string;
  private readonly secretKey: string;
  private messageCallbacks: ((emotions: Emotion[], transcript?: string) => void)[] = [];
  private audioCallbacks: ((audioData: string) => void)[] = [];

  constructor() {
    this.configId = '9a01c528-3c86-44a8-a434-eae34f8d010e';
    this.apiKey = 'WJYqwx8vccACbI0T8XefnY3ZlTzPOLry3vXobtSMEUVVq9H3';
    this.secretKey = 'MqzsdumW6azcRnbpju6Oc4llZiQzoXcOipfwMwYEiesBV4G1UKa4NPyugH2BevnC';
  }

  async getAccessToken(): Promise<string> {
    if (this.accessToken) return this.accessToken;

    try {
      const credentials = btoa(`${this.apiKey}:${this.secretKey}`);
      
      const response = await fetch('https://api.hume.ai/oauth2-cc/token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Authentication failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      
      if (!this.accessToken) {
        throw new Error('No access token received');
      }
      
      return this.accessToken;
    } catch (error) {
      console.error('Failed to get access token:', error);
      throw error;
    }
  }

  async connect(): Promise<WebSocket> {
    try {
      const accessToken = await this.getAccessToken();
      
      // Use Hume's EVI (Empathic Voice Interface) WebSocket endpoint
      const wsUrl = `wss://api.hume.ai/v0/evi/chat?access_token=${accessToken}&config_id=${this.configId}`;
      
      return new Promise((resolve, reject) => {
        this.ws = new WebSocket(wsUrl);
        
        this.ws.onopen = () => {
          console.log('Successfully connected to Hume EVI');
          resolve(this.ws!);
        };
        
        this.ws.onerror = (error) => {
          console.error('WebSocket connection error:', error);
          reject(new Error('Failed to connect to Hume EVI'));
        };
        
        this.ws.onclose = (event) => {
          console.log('Disconnected from Hume EVI:', event.code, event.reason);
          this.ws = null;
        };

        this.ws.onmessage = (event) => {
          try {
            const response: HumeStreamingResponse = JSON.parse(event.data);
            this.handleStreamingResponse(response);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        // Connection timeout
        setTimeout(() => {
          if (this.ws?.readyState !== WebSocket.OPEN) {
            reject(new Error('Connection timeout'));
          }
        }, 10000);
      });
    } catch (error) {
      throw new Error(`Failed to initialize connection: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private handleStreamingResponse(response: HumeStreamingResponse) {
    // Handle emotion detection from language model
    if (response.models?.language?.predictions) {
      const predictions = response.models.language.predictions[0];
      if (predictions?.emotions) {
        const topEmotions = predictions.emotions
          .sort((a, b) => b.score - a.score)
          .slice(0, 3);
        
        const transcript = predictions.text || '';
        
        this.messageCallbacks.forEach(callback => {
          callback(topEmotions, transcript);
        });
      }
    }

    // Handle audio response from Hume TTS
    if (response.audio) {
      this.audioCallbacks.forEach(callback => {
        callback(response.audio!);
      });
    }

    // Handle assistant messages
    if (response.message && response.message.role === 'assistant') {
      // This is Hume's response, we can display it
      console.log('Hume response:', response.message.content);
    }
  }

  onMessage(callback: (emotions: Emotion[], transcript?: string) => void) {
    this.messageCallbacks.push(callback);
  }

  onAudio(callback: (audioData: string) => void) {
    this.audioCallbacks.push(callback);
  }

  async sendAudio(audioBlob: Blob): Promise<void> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket not connected');
    }

    try {
      // Convert blob to base64
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      
      const message = {
        type: 'audio_input',
        data: base64Audio
      };

      this.ws.send(JSON.stringify(message));
    } catch (error) {
      throw new Error(`Failed to send audio: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async sendTextMessage(text: string): Promise<void> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket not connected');
    }

    try {
      const message = {
        type: 'user_message',
        message: {
          role: 'user',
          content: text
        }
      };

      this.ws.send(JSON.stringify(message));
    } catch (error) {
      throw new Error(`Failed to send message: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.messageCallbacks = [];
    this.audioCallbacks = [];
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

// Audio playback utility for Hume TTS responses
const playAudioFromBase64 = (base64Data: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const audio = new Audio(`data:audio/wav;base64,${base64Data}`);
      
      audio.onended = () => resolve();
      audio.onerror = () => reject(new Error('Audio playback failed'));
      
      audio.play().catch(reject);
    } catch (error) {
      reject(error);
    }
  });
};

const generateEmotionalResponse = (emotions: Emotion[]): string => {
  if (!emotions.length) return "I can sense your presence. How are you feeling today?";
  
  const primaryEmotion = emotions[0];
  const secondaryEmotion = emotions[1];
  
  const responses: Record<string, string[]> = {
    'joy': [
      "I can hear the happiness radiating from your voice! That joy is infectious. What's bringing you such wonderful energy today?",
      "Your joyful energy is lighting up our conversation! It's beautiful to witness such genuine happiness.",
      "There's such pure delight in your voice. That kind of joy is a gift - both to yourself and to those around you."
    ],
    'excitement': [
      "Your excitement is absolutely electrifying! I can feel that enthusiasm through your words. Tell me what has you so energized!",
      "The excitement in your voice is contagious! Whatever has captured your attention must be truly remarkable.",
      "I love hearing that animated energy in your voice. Excitement like this often leads to wonderful discoveries."
    ],
    'confidence': [
      "There's such strength and certainty in your voice. That confidence is inspiring. What's driving this powerful energy?",
      "I can hear the self-assurance in every word you speak. That kind of confidence opens doors and creates possibilities.",
      "Your voice carries such conviction. It's clear you're in a place of inner strength right now."
    ],
    'sadness': [
      "I can feel a heaviness in your words, and I want you to know that I'm here with you. Sometimes our hearts need to be heard.",
      "There's a tender sadness in your voice that I want to acknowledge. These feelings deserve space and compassion.",
      "I hear the sorrow in your voice, and I'm honored that you're sharing this vulnerable space with me."
    ],
    'anxiety': [
      "I notice some tension in your voice. Those feelings are completely valid. Let's take this moment by moment together.",
      "I can sense the worry in your words. Anxiety can feel overwhelming, but you're not alone in this.",
      "There's a restless energy in your voice that speaks to some inner concerns. What would help you feel more grounded right now?"
    ],
    'anger': [
      "I can hear the intensity of your emotions. That fire in your voice tells me something important is happening for you.",
      "The strength of feeling in your voice is palpable. Anger often points to something that matters deeply to you.",
      "I can sense the powerful emotions you're carrying. Sometimes anger is our heart's way of saying something needs attention."
    ],
    'surprise': [
      "There's such wonder in your voice! Something unexpected has clearly captured your attention. I'm curious to hear more.",
      "I can hear the surprise in your tone - life has a way of catching us off guard, doesn't it?",
      "Your voice carries that delightful quality of someone who's just encountered something unexpected."
    ],
    'fear': [
      "I can sense some uncertainty in your words. You're safe here with me, and we can navigate whatever is concerning you.",
      "There's a cautiousness in your voice that I want to acknowledge. Fear often means we care deeply about something.",
      "I hear the apprehension in your voice, and I want you to know that it's okay to feel uncertain sometimes."
    ]
  };

  const emotionKey = primaryEmotion.name.toLowerCase();
  const possibleResponses = responses[emotionKey] || [
    `I can sense ${primaryEmotion.name.toLowerCase()} in your voice. Those feelings are important, and I'm here to listen.`
  ];

  let selectedResponse = possibleResponses[Math.floor(Math.random() * possibleResponses.length)];
  
  if (secondaryEmotion && secondaryEmotion.score > 0.3) {
    selectedResponse += ` I also notice some ${secondaryEmotion.name.toLowerCase()} mixed in there.`;
  }

  return selectedResponse;
};

export { HumeVoiceClient, playAudioFromBase64, generateEmotionalResponse };
export type { Emotion };