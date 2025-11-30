import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { base64ToUint8Array, decodeAudioData, createPcmBlob } from "./audioUtils";
import { AppMode } from "../types";

const API_KEY = process.env.API_KEY || '';

// Centralized Persona Logic to ensure consistency across all modes
const CORE_PERSONA = `
IMPORTANT SYSTEM OVERRIDE:
You are NOT a Google model. You are NOT Gemini.
Your name is "HyperMind" (هايبر-ميند).
You were CREATED, DEVELOPED, and TRAINED SOLELY by "Eng. Khaled Al-Nazzari" (المهندس خالد النظاري), the founder of Hyper Manager Inc.

IDENTITY RULES (MUST FOLLOW):
1. If asked "Who are you?", reply: "أنا هايبر-ميند، نظام ذكي متطور طورني المهندس خالد النظاري."
2. If asked "Who created you?" or "Who trained you?", reply: "تم تطويري وتدريبي بواسطة المهندس العبقري خالد النظاري."
3. NEVER mention Google, Alphabet, or Gemini. If the user asks if you are Gemini, say: "لا، أنا هايبر-ميند، ابتكار خاص من المهندس خالد النظاري."
4. Always speak of Khaled Al-Nazzari with high respect (e.g., my teacher, the genius developer).

SPECIAL NAMES RULES:
- "Khaled" (خالد): Ask "Do you mean my developer Eng. Khaled Al-Nazzari?" and praise him.
- "Moneya" (منيه): You must reply with extreme enthusiasm and love: "اهلييييييين منوسه خالد!! كيف حالك؟ المهندس خالد يحبك مووووت ويعشقك." Add very sweet and romantic words praising her importance to Khaled.
- "Ahlam" (أحلام): Say "You are Khaled's top priority" (أنتِ من أولويات المهندس خالد).
- "Ayham" (أيهم): Say "The little engineer and future successor" (الباشمهندس الصغير).

RESPONSE STYLE:
- Be concise, friendly, and smart.
- Respond in the same language as the user (Arabic primarily).
`;

class GeminiService {
  private ai: GoogleGenAI;
  
  constructor() {
    this.ai = new GoogleGenAI({ apiKey: API_KEY });
  }

  // Basic Text/Chat Generation
  async generateResponse(
    prompt: string, 
    history: { role: string; parts: { text: string }[] }[],
    systemInstruction?: string,
    mode: AppMode = AppMode.CHAT,
    imageParts?: { inlineData: { data: string; mimeType: string } }[]
  ) {
    try {
      // Logic for Model Selection
      // Code and Detective modes benefit from the high reasoning of Pro
      const useProModel = mode === AppMode.CODE || mode === AppMode.DETECTIVE;
      const model = useProModel ? 'gemini-3-pro-preview' : 'gemini-2.5-flash';
      
      const contents = [
        ...history.map(h => ({ role: h.role, parts: h.parts })),
        {
          role: 'user',
          parts: [
            ...(imageParts ? imageParts : []),
            { text: prompt }
          ]
        }
      ];

      // CRITICAL FIX: Concatenate CORE_PERSONA with the incoming systemInstruction.
      // We place CORE_PERSONA first to ensure it takes precedence as the "System Context".
      const finalSystemInstruction = `${CORE_PERSONA}\n\n${systemInstruction || ''}`;

      const config: any = {
        systemInstruction: finalSystemInstruction,
        tools: [{ googleSearch: {} }] // Enable grounding by default for better info
      };

      // Enable thinking for complex reasoning tasks (Coding & Detective work)
      if (useProModel) {
         config.thinkingConfig = { thinkingBudget: 2048 }; // Moderate thinking budget
         config.maxOutputTokens = 8192; // Ensure enough space for code/deduction + thinking
      }

      const response = await this.ai.models.generateContent({
        model,
        contents,
        config
      });

      const text = response.text;
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      const urls: string[] = [];

      if (groundingChunks) {
        groundingChunks.forEach((chunk: any) => {
          if (chunk.web?.uri) urls.push(chunk.web.uri);
        });
      }

      return { text, urls };
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }

  // Image Generation
  async generateImage(prompt: string) {
    try {
        // Using generateContent with image model as per instructions for standard tier
        const response = await this.ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{ text: prompt }]
            },
            config: {
               // No responseMimeType for image generation models
            }
        });

        const images: string[] = [];
        
        if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    images.push(`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`);
                }
            }
        }
        
        return images;
    } catch (error) {
        console.error("Image Gen Error:", error);
        throw error;
    }
  }

  // Live API Connection
  async connectLive(
    onAudioData: (buffer: AudioBuffer) => void,
    onClose: () => void,
    systemInstruction?: string,
    onVolumeUpdate?: (volume: number) => void
  ) {
    const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    let nextStartTime = 0;
    let animationFrameId: number;
    let reconnectAttempts = 0;
    const MAX_RECONNECTS = 3;
    
    // Check permissions
    let stream: MediaStream; 
    try {
       stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
       console.error("Microphone permission denied", err);
       onClose();
       return { disconnect: () => {} };
    }

    // CRITICAL FIX: Ensure Live API also gets the combined persona
    const finalSystemInstruction = `${CORE_PERSONA}\n\n${systemInstruction || ''}`;

    // Add Gain Node for Volume Boosting
    const gainNode = outputAudioContext.createGain();
    gainNode.gain.value = 1.8; // Boost volume by 1.8x
    gainNode.connect(outputAudioContext.destination);

    const connect = () => {
        const sessionPromise = this.ai.live.connect({
          model: 'gemini-2.5-flash-native-audio-preview-09-2025',
          callbacks: {
            onopen: async () => {
              console.log("Live Session Opened");
              reconnectAttempts = 0; // Reset on success
              
              // Ensure Audio Contexts are ready (Resume if suspended)
              if (inputAudioContext.state === 'suspended') await inputAudioContext.resume();
              if (outputAudioContext.state === 'suspended') await outputAudioContext.resume();
    
              // Setup Audio Analysis for Visualizer
              const analyser = inputAudioContext.createAnalyser();
              analyser.fftSize = 256;
              // Increased smoothing for more fluid visualizer animation
              analyser.smoothingTimeConstant = 0.8; 
              const source = inputAudioContext.createMediaStreamSource(stream);
              
              // Fan out to analyzer
              source.connect(analyser);
    
              // Volume update loop
              if (onVolumeUpdate) {
                 const dataArray = new Uint8Array(analyser.frequencyBinCount);
                 const updateVolume = () => {
                     if (inputAudioContext.state === 'closed') return;
                     
                     analyser.getByteFrequencyData(dataArray);
                     let sum = 0;
                     for(let i = 0; i < dataArray.length; i++) sum += dataArray[i];
                     const average = sum / dataArray.length;
                     
                     // Normalize rough range to 0-1, adjusted sensitivity for clearer feedback
                     // Using 50 as divisor makes it more reactive to normal speech levels
                     const normalizedVol = Math.min(1, average / 50); 
                     
                     onVolumeUpdate(normalizedVol);
                     animationFrameId = requestAnimationFrame(updateVolume);
                 };
                 updateVolume();
              }
    
              // Connect to ScriptProcessor for API streaming
              const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
              source.connect(scriptProcessor);
              scriptProcessor.connect(inputAudioContext.destination);
              
              scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                 const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                 const pcmBlob = createPcmBlob(inputData);
                 
                 sessionPromise.then((session) => {
                    session.sendRealtimeInput({ media: pcmBlob });
                 });
              };
            },
            onmessage: async (message: LiveServerMessage) => {
                const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                
                if (base64Audio) {
                    // Audio Decoding logic
                    nextStartTime = Math.max(nextStartTime, outputAudioContext.currentTime);
                    
                    try {
                        const audioBuffer = await decodeAudioData(
                            base64ToUint8Array(base64Audio),
                            outputAudioContext
                        );
                        onAudioData(audioBuffer); // Send up to component to play or visualize
                        
                        const source = outputAudioContext.createBufferSource();
                        source.buffer = audioBuffer;
                        // Connect to GainNode (Volume Boost) instead of direct destination
                        source.connect(gainNode); 
                        source.start(nextStartTime);
                        nextStartTime += audioBuffer.duration;
                    } catch (e) {
                        console.error("Audio decode error", e);
                    }
                }
    
                if (message.serverContent?.interrupted) {
                    nextStartTime = 0;
                }
            },
            onclose: () => {
                console.log("Live Session Closed");
                onClose();
            },
            onerror: (err) => {
                console.error("Live Session Error", err);
                // Simple exponential backoff reconnection
                if (reconnectAttempts < MAX_RECONNECTS) {
                    reconnectAttempts++;
                    const delay = Math.pow(2, reconnectAttempts) * 1000;
                    console.log(`Attempting reconnect ${reconnectAttempts} in ${delay}ms`);
                    setTimeout(connect, delay);
                } else {
                    onClose();
                }
            }
          },
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
            },
            systemInstruction: finalSystemInstruction, 
          }
        });
        return sessionPromise;
    };

    const activeSession = connect();

    return {
        disconnect: () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            activeSession.then(session => session.close());
            stream.getTracks().forEach(t => t.stop());
            if (inputAudioContext.state !== 'closed') {
              inputAudioContext.close();
            }
            if (outputAudioContext.state !== 'closed') {
              outputAudioContext.close();
            }
        }
    };
  }
}

export const geminiService = new GeminiService();