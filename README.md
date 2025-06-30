# AI Battle Game - Character Creation & Comic Strip Generator

An interactive web application that lets users create unique battle characters using AI and generate epic comic strip battles. Built with React, TypeScript, and powered by OpenAI and Replicate APIs.

![AI Battle Game](https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&w=800)

## 🎮 Features

### Character Creation
- **AI-Powered Generation**: Create unique characters using natural language prompts
- **Dynamic Suggestions**: Smart suggestion system that adapts to your input
- **Visual Character Design**: AI-generated character images using Flux-Schnell model
- **Balanced Stats**: Automatically generated HP, Energy, and Mana stats
- **Unique Powers**: Each character gets 3 distinct combat abilities

### Battle System
- **Comic Strip Format**: Battles are presented as dynamic comic panels
- **Interactive Combat**: Choose from suggested actions or create custom scenes
- **Villain AI**: Automatic opponent selection and response generation
- **Visual Storytelling**: Each action generates a unique comic panel image
- **Battle Progression**: Multi-panel storytelling with hero and villain turns

### User Experience
- **Demo Mode**: Try the system with predefined characters
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Real-time Generation**: Live AI content creation with loading states
- **Character Upgrades**: Enhance characters mid-battle with new abilities
- **Battle Finalization**: Create epic conclusion scenes

## 🛠️ Built With

### Frontend
- **React 18** - Modern React with hooks and context
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **Lucide React** - Beautiful icon library

### Backend & APIs
- **Supabase** - Backend-as-a-Service platform
  - PostgreSQL database
  - Edge Functions (Deno runtime)
  - Row Level Security (RLS)
- **OpenAI API** - Character and action generation
- **Replicate API** - AI image generation (Flux-Schnell model)

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenAI API key
- Replicate API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-battle-game
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENAI_API_KEY=your_openai_api_key
   REPLICATE_API_TOKEN=your_replicate_token
   ```

4. **Set up Supabase**
   ```bash
   # Run the database migrations
   npx supabase db push
   ```

5. **Deploy Edge Functions**
   ```bash
   # Deploy all edge functions to Supabase
   npx supabase functions deploy character-creation
   npx supabase functions deploy character-image
   npx supabase functions deploy battle-actions
   npx supabase functions deploy dynamic-actions
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   ├── BattleScreen.tsx # Main battle interface
│   ├── CharacterCreation.tsx
│   ├── ComicBattleInterface.tsx
│   └── ...
├── context/             # React context providers
│   └── GameContext.tsx  # Global game state
├── data/               # Static data and utilities
│   ├── demoCharacters.ts
│   ├── opponents.ts
│   ├── suggestionData.ts
│   └── ...
├── types/              # TypeScript type definitions
│   ├── game.ts
│   └── combat.ts
└── ...

supabase/
├── functions/          # Edge Functions
│   ├── character-creation/
│   ├── character-image/
│   ├── battle-actions/
│   └── dynamic-actions/
└── migrations/         # Database migrations
```

## 🎯 Core Features Explained

### Character Generation System
The character creation uses OpenAI's GPT-4 with function calling to generate:
- Character name and description
- Balanced stats (HP: 80-150, Energy: 80-120, Mana: 0-100)
- Exactly 3 unique powers with energy costs and cooldowns
- Detailed image prompts for visual generation

### Image Generation Pipeline
1. Character descriptions are converted to detailed visual prompts
2. Replicate API generates images using Flux-Schnell model
3. Dynamic aspect ratios and seeds ensure visual variety
4. Images are optimized for web delivery (WebP format)

### Battle Action System
- **Suggested Actions**: Generated from character powers
- **Custom Scenes**: User-defined battle descriptions
- **Villain Responses**: AI-generated opponent reactions
- **Visual Panels**: Each action creates a unique comic panel

### Demo Mode
Access demo mode by adding `?demo` to the URL. This allows users to:
- Experience the full workflow without API costs
- Use predefined characters (Phoenix Warrior vs Time Manipulator)
- Generate placeholder panels instead of AI images

## 🔧 Configuration

### Environment Variables
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `OPENAI_API_KEY` - OpenAI API key (for Edge Functions)
- `REPLICATE_API_TOKEN` - Replicate API token (for Edge Functions)

### Database Schema
The application uses a simple schema with Row Level Security:

```sql
CREATE TABLE characters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  character_name text NOT NULL,
  description text NOT NULL,
  hp integer NOT NULL,
  energy integer NOT NULL,
  mana integer NOT NULL,
  powers jsonb NOT NULL,
  image_prompt text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

## 🎨 Design Philosophy

### Visual Design
- **Apple-level aesthetics** with attention to detail
- **Gradient backgrounds** and subtle animations
- **Comic book styling** for battle interfaces
- **Responsive design** for all screen sizes

### User Experience
- **Progressive disclosure** to manage complexity
- **Real-time feedback** during AI generation
- **Error handling** with retry mechanisms
- **Accessibility** considerations throughout

## 🚀 Deployment

### Frontend Deployment
The frontend can be deployed to any static hosting service:

```bash
npm run build
# Deploy the 'dist' folder to your hosting service
```

### Edge Functions
Edge Functions are automatically deployed to Supabase and handle:
- Character generation logic
- Image generation requests
- Battle action creation
- Dynamic combat responses

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for powerful language models
- **Replicate** for accessible AI image generation
- **Supabase** for seamless backend infrastructure
- **Tailwind CSS** for beautiful, responsive design
- **React** community for excellent tooling and libraries

## 🐛 Known Issues

- Image generation may occasionally fail due to API limits
- Demo mode provides placeholder images instead of generated content
- Battle comics are currently view-only (download/share coming soon)

## 🔮 Future Enhancements

- [ ] Comic download and sharing functionality
- [ ] Multiplayer battles
- [ ] Character progression system
- [ ] Battle tournaments
- [ ] Community character gallery
- [ ] Mobile app version

---

**Made with ❤️ using React, TypeScript, and AI**