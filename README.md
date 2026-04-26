
# 🥚 Hyper Egg AI Folder App

*An intelligent, AI-powered desktop tool that reads, understands, and responds to the contents of any folder.*

https://github.com/user-attachments/assets/f0df8dda-4b21-4071-9bc3-5b5e66c33ade


## 📖 Overview
Welcome to **Hyper Egg AI Folder App**, a lightweight, privacy-first desktop application that scans your directories, analyzes file contents using advanced AI models, and delivers contextual insights, reflections, or recommendations tailored to your workflow. Optimized for local inference, Hyper Egg brings powerful AI to your personal file system without compromising speed or security.

<img width="1207" height="1637" alt="mini-pc" src="https://github.com/user-attachments/assets/3d6b5cfe-180d-4d7f-9c37-8baac6cdcddf" />


## 📖 Example Use Case: Spiritual & Emotional Support
1. Place your daily journal entries and Bible readings in a dedicated folder.
2. Launch Hyper Egg and point it to the folder.
3. Ask: `"What are my good days? What are my hard days? Can you suggest Bible verses to help me through them?"`
4. The AI analyzes your entries, identifies emotional/spiritual patterns, and returns personalized reflections + relevant scripture.



https://github.com/user-attachments/assets/91f5339f-6199-4702-8980-7cc03b55998c



## 🛠️ Installation & Usage

### 📦 Pre-built Binaries
- **Windows**: Download `HyperEgg_AI_Windows.zip` → Extract → Run `HyperEgg.exe`
- **macOS**: Download `HyperEgg_AI_Mac.dmg` → Drag to Applications → Open
- **Linux**: Build from source (see below)

### 💻 From Source
```bash
git clone https://github.com/wonglok/hyper-egg-ai-r001.git
cd hyper-egg-ai-r001
bun install
bun run dev
```

## 🤖 LMStudio Integration
Hyper Egg leverages **[LM Studio](https://lmstudio.ai/)** as its local AI engine, providing a seamless, offline experience without complex command-line configurations.

**Why LMStudio?**
- 🔄 **Zero-Config Server**: Automatically connects to your local model server
- 📦 **Model Library**: Browse, download, and manage GGUF models directly from the UI
- ⚡ **Optimized Inference**: Works seamlessly with CPU/GPU hybrid systems and ultra-lightweight quantizations
- 🌐 **OpenAI-Compatible API**: Standardized endpoints for easy integration

**Setup Instructions:**
1. Download and install [LM Studio](https://lmstudio.ai/)
2. Open LM Studio and download your preferred model (e.g., *Gemma 4 E2B*, *Llama*, or *Mistral*)
3. In LM Studio, go to the **Local Server** tab and click **Start Server**
5. Please enable the LMStudio CORS, and Local Hosting Access.

<img width="693" height="556" alt="Screenshot 2026-04-25 at 10 56 37 PM" src="https://github.com/user-attachments/assets/3e4e35c0-b36b-436e-b478-de1c8f8c76ad" />



## 📦 Dependencies & Requirements
- **Bun** (v1.0+) or Node.js 18+
- **LM Studio** (Required for local model inference)
- **API Key** (Optional, only if using Cloud AI services like OpenAI/Anthropic)

## 🔒 Privacy & AI Disclaimer
- All file scanning and analysis occur locally unless you explicitly enable cloud AI services.
- AI-generated responses are for inspirational, educational, or organizational purposes and should not replace professional, medical, or spiritual counseling.
- You are responsible for ensuring you have the right to analyze any files placed in the target folder.

## 🙏 Credits & Gratitude
This project was born from personal reflection, faith, and the invaluable support of friends, mentors, and the open-source community. Special thanks to the developers behind the AI frameworks, Bun runtime, LM Studio, and desktop packaging tools that made this possible. 

And most importantly, thank you to Jesus for all the supportive friends, inspiration, guidance, and strength. 🙏✨

## 📜 License
This project is shared under the [MIT License](LICENSE). Feel free to modify, distribute, and build upon it!
```
