
# 🥚 Hyper Egg AI Folder App

*An intelligent, AI-powered desktop tool that reads, understands, and responds to the contents of any folder.*

## 📖 Overview
Welcome to **Hyper Egg AI Folder App**, a lightweight, privacy-first desktop application that scans your directories, analyzes file contents using advanced AI models, and delivers contextual insights, reflections, or recommendations tailored to your workflow. Built with **[Bun](https://bun.sh/)** for blazing-fast execution and the app's AI loop is designed and optimized for local inference, Hyper Egg brings powerful AI to your personal file system without compromising speed or security.

## ✨ Key Features
- 📂 **Smart Folder Analysis**: Automatically scans and interprets files in your chosen directory
- 🤖 **AI-Powered Insights**: Generates contextual responses, summaries, or suggestions based on file content
- 📖 **Custom Use Cases**: Perfect for diaries, devotional libraries, study notes, journaling, or project documentation
- 🌍 **Cross-Platform Support**: Ready-to-run binaries for Windows and macOS, plus full source code for Linux
- 🔒 **Privacy-First Design**: All file processing is local by default (no data leaves your device unless explicitly configured)
- ⚡ **Bun-Powered Development Stack**: Lightning-fast dependency resolution, native TypeScript/JS execution, and minimal overhead

## 🚀 Ultra-Lightweight & Hardware Support
Hyper Egg is engineered for efficiency and accessibility. We prioritize optimized AI workflows so you can get intelligent insights on **any** device, including budget hardware.

- ✅ **Low RAM Optimization**: Successfully runs ultra-quantized models like **Google Gemma 4 E2B** on devices with only **32GB of RAM**
- ✅ **Budget-Friendly**: Fully compatible with affordable **~$500 Windows Mini PCs**
- ✅ **No GPU Required**: Runs entirely on CPU, making it perfect for office workstations, older laptops, or low-power devices
- ✅ **Fast Startup**: Minimal memory footprint ensures the app launches instantly even on constrained systems

> 💡 *Real-World Test:*  
> *"Hyper Egg runs smoothly on my $500 Windows Mini PC with 8GB RAM, analyzing folders and generating reflections using Google Gemma 4 E2B with 100K context window configured."*

## 📖 Example Use Case: Spiritual & Emotional Support
1. Place your daily journal entries and Bible readings in a dedicated folder.
2. Launch Hyper Egg and point it to the folder.
3. Ask: `"What are my good days? What are my hard days? Can you suggest Bible verses to help me through them?"`
4. The AI analyzes your entries, identifies emotional/spiritual patterns, and returns personalized reflections + relevant scripture.

## 🛠️ Installation & Usage

### 📦 Pre-built Binaries
- **Windows**: Download `HyperEgg_AI_Windows.zip` → Extract → Run `HyperEgg.exe`
- **macOS**: Download `HyperEgg_AI_Mac.dmg` → Drag to Applications → Open
- **Linux**: Build from source (see below)

### 💻 From Source
```bash
git clone https://github.com/YOUR_USERNAME/hyper-egg-ai.git
cd hyper-egg-ai
bun install
bun run dev
```
> 💡 *Note: Hyper Egg uses **[Bun](https://bun.sh/)** for fast, native execution. Ensure you have Bun installed (`curl -fsSL https://bun.sh | bash`). Some AI features may require LM Studio or an API key. Check `CONFIG.md` or in-app prompts for detailed instructions.*

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
4. Open Hyper Egg, navigate to **Settings**, and set your Local AI Provider to `LMStudio`
5. Hyper Egg will automatically detect the server at `http://localhost:1234/v1`

> 💡 *Tip: You can switch between Cloud APIs and Local Models instantly via the app settings. Bun's fast hot-reloading makes testing AI prompts incredibly smooth.*

## 📦 Dependencies & Requirements
- **Bun** (v1.0+) or Node.js 18+
- **LM Studio** (Required for local model inference)
- **API Key** (Optional, only if using Cloud AI services like OpenAI/Anthropic)
- **Hardware:** 
  - *Minimum:* 4GB RAM, Dual-core CPU
  - *Recommended for Local AI:* 32GB RAM, Quad-core CPU (Gemma 4 E2B optimized)

## 🔒 Privacy & AI Disclaimer
- All file scanning and analysis occur locally unless you explicitly enable cloud AI services.
- AI-generated responses are for inspirational, educational, or organizational purposes and should not replace professional, medical, or spiritual counseling.
- You are responsible for ensuring you have the right to analyze any files placed in the target folder.

## 🙏 Credits & Gratitude
This project was born from personal reflection, faith, and the invaluable support of friends, mentors, and the open-source community. Special thanks to the developers behind the AI frameworks, Bun runtime, LM Studio, and desktop packaging tools that made this possible. 

And most importantly, thank you to the source of all inspiration, guidance, and strength. 🙏✨

## 📜 License
This project is shared under the [MIT License](LICENSE). Feel free to modify, distribute, and build upon it!
```

### 📌 Quick Tips Before Publishing:
1. Replace `YOUR_USERNAME` in the git clone URL with your actual GitHub username.
2. If you have a `package.json`, ensure it contains:
   ```json
   "scripts": {
     "dev": "bun run --watch src/index.ts",
     "build": "bun build src/index.ts --target=bun --outdir=dist"
   }
   ```
3. Add a screenshot of Hyper Egg running on a Mini PC or showing the LMStudio connection for visual impact.

Let me know if you need a `CONFIG.md` template, a `package.json` starter, or help packaging the binaries! 🥚✨
