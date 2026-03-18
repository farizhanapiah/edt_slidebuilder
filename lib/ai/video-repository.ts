export interface EdtVideo {
  title: string;
  youtube_url: string;
  category: string;
  tech: string[];
  description: string;
  is_default?: boolean;
}

export const EDT_VIDEO_REPOSITORY: EdtVideo[] = [
  // ── Showreel ──────────────────────────────────────────────
  {
    title: "EDT Showreel 2025",
    youtube_url: "https://www.youtube.com/watch?v=0JIMyg78m4o",
    category: "Showreel",
    tech: ["AR", "VR", "MR", "AI", "Realtime 3D", "Projection Mapping"],
    description: "Full portfolio of XR, AR, VR, and AI work",
    is_default: true,
  },
  {
    title: "EDT Showreel 2022",
    youtube_url: "https://www.youtube.com/watch?v=7j_uYP7gJJY",
    category: "Showreel",
    tech: ["AR", "VR", "MR", "Projection Mapping", "Virtual Production"],
    description: "2022 compilation of XR, AR, VR, projection, and virtual production work",
  },
  {
    title: "EDT Showreel 2020",
    youtube_url: "https://www.youtube.com/watch?v=vOYwFcikgfU",
    category: "Showreel",
    tech: ["AR", "VR", "Projection Mapping", "Interactive"],
    description: "2020 compilation from on-ground activations to AR and VR experiences",
  },

  // ── Mixed Reality Game ────────────────────────────────────
  {
    title: "RiaReality: Durian Dash at ImmerseKL",
    youtube_url: "https://www.youtube.com/watch?v=TzZ1wb82M9M",
    category: "Mixed Reality Game",
    tech: ["Mixed Reality", "Motion Sensors", "Display Hardware"],
    description: "MR game Durian Dash deployed at ImmerseKL festival",
  },
  {
    title: "RiaReality @ SIGGRAPH Asia Hong Kong 2025",
    youtube_url: "https://www.youtube.com/watch?v=0e6nc-QbfYM",
    category: "Mixed Reality Game",
    tech: ["Mixed Reality", "XR Display"],
    description: "RiaReality platform showcase at SIGGRAPH Asia 2025",
  },
  {
    title: "RiaReality + AI Powered Host: TM Future Skills",
    youtube_url: "https://www.youtube.com/watch?v=PK9eI0nlsJU",
    category: "Mixed Reality Game",
    tech: ["Mixed Reality", "AI Host", "Real-time AI", "Text-to-Speech"],
    description: "RiaReality with AI-powered virtual host for TM Future Skills",
  },
  {
    title: "Spooky Smash MR Game for Accenture Song",
    youtube_url: "https://www.youtube.com/watch?v=Mmc0WbTBCy0",
    category: "Mixed Reality Game",
    tech: ["Mixed Reality", "Motion Sensing", "Real-time Game Engine"],
    description: "Halloween MR game battling Asian ghosts for Accenture Song",
  },
  {
    title: "RiaReality: PNB118",
    youtube_url: "https://www.youtube.com/watch?v=G5KJO-B_7mw",
    category: "Mixed Reality Game",
    tech: ["Mixed Reality", "RiaReality Platform"],
    description: "Interactive MR visitor experience at PNB118 tower",
  },

  // ── AI Avatar / Host ──────────────────────────────────────
  {
    title: "Realtime AI Mascot Tiger for Maybank Championship",
    youtube_url: "https://www.youtube.com/watch?v=QJNp2L1eeZQ",
    category: "AI Avatar / Host",
    tech: ["Realtime 3D", "AI Voice Generation", "Facial Animation", "Unreal Engine"],
    description: "Custom 3D AI Tiger mascot with real-time voice and facial animation",
  },
  {
    title: "AI-Powered Virtual Persona for CIMB Octobiz Launch",
    youtube_url: "https://www.youtube.com/watch?v=qD8gmYYdJSg",
    category: "AI Avatar / Host",
    tech: ["AI Character Design", "Text-to-Speech", "Automated Lipsync", "Real-time Pipeline"],
    description: "Fully AI-generated virtual persona produced in one week",
  },
  {
    title: "Sis Shayla - AI Powered Virtual Realtime Influencer",
    youtube_url: "https://www.youtube.com/watch?v=kmvf2IjQdNI",
    category: "AI Avatar / Host",
    tech: ["AI Face Generation", "Realtime Face Match", "AR/XR Studio"],
    description: "Real-time AI face matching on live on-set influencer",
  },
  {
    title: "Ask Bo - Virtual Influencer for AirAsia",
    youtube_url: "https://www.youtube.com/watch?v=PTfdcQLm6P4",
    category: "AI Avatar / Host",
    tech: ["Unreal Engine", "Metahuman", "Rokoko Mocap Suit", "Face Capture"],
    description: "AirAsia virtual customer service assistant with real-time lifelike interaction",
  },
  {
    title: "Viya - AI Context Demo",
    youtube_url: "https://www.youtube.com/watch?v=i-Ru6aWNiDM",
    category: "AI Avatar / Host",
    tech: ["AI NPC", "Conversational AI", "Real-time Character"],
    description: "Conversational AI character with contextual awareness for live interaction",
  },
  {
    title: "Hoomans Demo",
    youtube_url: "https://www.youtube.com/watch?v=fMyLbVykBqs",
    category: "AI Avatar / Host",
    tech: ["AI Avatar", "Metahuman", "Motion Capture"],
    description: "AI-powered virtual humanoid character system",
  },
  {
    title: "Hoomans In Action",
    youtube_url: "https://www.youtube.com/watch?v=QuNvM7JDgFA",
    category: "AI Avatar / Host",
    tech: ["AI Avatar", "Metahuman", "Real-time 3D"],
    description: "Hoomans AI virtual character system demonstration",
  },
  {
    title: "AIRA Debut on MuzikFM",
    youtube_url: "https://www.youtube.com/watch?v=8iDK_rQpffc",
    category: "AI Avatar / Host",
    tech: ["AI Avatar", "Real-time Character", "TTS"],
    description: "AI virtual influencer debut on MuzikFM entertainment platform",
  },
  {
    title: "Datuk Yong AI Speech",
    youtube_url: "https://www.youtube.com/watch?v=baAV8cIwH4E",
    category: "AI Avatar / Host",
    tech: ["AI Voice Generation", "AI Avatar"],
    description: "AI-generated speech demonstrating AI voice and avatar technology",
  },
  {
    title: "Tunku Abdul Rahman Generated with AI",
    youtube_url: "https://www.youtube.com/watch?v=ZUU3QUAs_ik",
    category: "AI Avatar / Host",
    tech: ["AI Video Generation", "Digital Twin"],
    description: "AI-generated video featuring Malaysia's founding father for heritage education",
  },

  // ── AI Virtual Influencer ─────────────────────────────────
  {
    title: "AI Virtual Influencer Pipeline Case Study",
    youtube_url: "https://www.youtube.com/watch?v=qwvspEyp6nM",
    category: "AI Virtual Influencer",
    tech: ["AI Face Generation", "Lipsync", "Animation Pipeline"],
    description: "Full AI virtual influencer production pipeline case study",
  },
  {
    title: "RetisAI: Neelofa",
    youtube_url: "https://www.youtube.com/watch?v=cX6fN3VrphI",
    category: "AI Virtual Influencer",
    tech: ["AI", "Face Generation", "Real-time Character"],
    description: "AI-powered virtual version of Malaysian celebrity Neelofa",
  },

  // ── AI Photobooth ─────────────────────────────────────────
  {
    title: "Mimpilab AI Photobooth Activations in Doha, Qatar",
    youtube_url: "https://www.youtube.com/watch?v=XJVHC43iKTM",
    category: "AI Photobooth",
    tech: ["AI Photobooth", "Real-time Image Processing", "Camera"],
    description: "AI-powered photobooth activation deployed internationally in Doha Qatar",
  },

  // ── AR Activation ─────────────────────────────────────────
  {
    title: "New Balance Grey Day AR and Immersive Interactive Room",
    youtube_url: "https://www.youtube.com/watch?v=drOAYjmo928",
    category: "AR Activation",
    tech: ["AR Filter", "Interactive Room", "Motion Sensors"],
    description: "AR experience and immersive interactive room for New Balance 2024",
  },
  {
    title: "AR Filter and 360 Interactive Projection at New Balance Grey Day 2023",
    youtube_url: "https://www.youtube.com/watch?v=829GJ0UuMA4",
    category: "AR Activation",
    tech: ["SparkAR", "Meta AR", "360 Projection", "Lighting Art"],
    description: "AR filter and 360-degree interactive projection art installation",
  },
  {
    title: "Sunway Malls x AbdulRashade x Peugeot Raya AR",
    youtube_url: "https://www.youtube.com/watch?v=_JJ6_8qG1C4",
    category: "AR Activation",
    tech: ["AR", "SparkAR", "Projection"],
    description: "Live AR motion on graffiti artworks at Sunway Malls for Hari Raya",
  },
  {
    title: "Toppen Mall AR Murals",
    youtube_url: "https://www.youtube.com/watch?v=A-zCnj5XP2k",
    category: "AR Activation",
    tech: ["AR", "SparkAR", "WebAR"],
    description: "Augmented Reality murals at Toppen Mall Johor Bahru",
  },
  {
    title: "Baskin Robbins Dance Lion Dance - AR Retail Experience",
    youtube_url: "https://www.youtube.com/watch?v=f5ezB0qA4cU",
    category: "AR Activation",
    tech: ["SparkAR", "Instagram AR Filter", "Facebook AR Filter"],
    description: "AR CNY experience with 2 SparkAR filters on Facebook and Instagram",
  },
  {
    title: "Gardens SparkAR - AR Art Gallery",
    youtube_url: "https://www.youtube.com/watch?v=r_nEYBQ-tGc",
    category: "AR Activation",
    tech: ["SparkAR", "Facebook AR", "WebAR"],
    description: "AR art gallery at Gardens Mall — no app required, triggered via SparkAR",
  },
  {
    title: "Hong Leong Bank Digital Day Facebook AR Campaign",
    youtube_url: "https://www.youtube.com/watch?v=DMjBVivuqIg",
    category: "AR Activation",
    tech: ["SparkAR", "Facebook AR Filter"],
    description: "Facebook AR campaign for Hong Leong Bank Digital Day",
  },
  {
    title: "Augmented Reality on L-Shaped LED Screen",
    youtube_url: "https://www.youtube.com/watch?v=U5xZoXrSPks",
    category: "AR Activation",
    tech: ["AR", "LED Screen", "Real-time 3D", "Anamorphic"],
    description: "Real-time 3D AR on L-shaped LED screens with full 3D anamorphic effect",
  },
  {
    title: "Sunway Xmas Activation",
    youtube_url: "https://www.youtube.com/watch?v=uCV_ouHd1_w",
    category: "AR Activation",
    tech: ["AR", "Interactive Installation"],
    description: "Christmas AR/interactive activation for Sunway Malls",
  },
  {
    title: "ECCO HSBC Women's World Championship Singapore",
    youtube_url: "https://www.youtube.com/watch?v=BTumEJQTIVc",
    category: "AR Activation",
    tech: ["AR", "Interactive Installation"],
    description: "AR/immersive activation at ECCO HSBC golf tournament in Singapore",
  },

  // ── VR Training / Education ───────────────────────────────
  {
    title: "MetaHRise - Virtual On-Boarding for MCMC",
    youtube_url: "https://www.youtube.com/watch?v=E9LTZpKwLto",
    category: "VR Training",
    tech: ["VR Headset", "Metaverse Platform", "Avatar System"],
    description: "VR employee on-boarding experience for MCMC government agency",
  },
  {
    title: "Anatomy VR for UiTM Skills Lab",
    youtube_url: "https://www.youtube.com/watch?v=v36N7_vA97o",
    category: "VR Training",
    tech: ["Oculus Quest 2", "Unity3D", "VR"],
    description: "VR anatomy learning for UiTM medical skills lab",
  },
  {
    title: "Sime Darby Plantation Innovation Day - VR Training",
    youtube_url: "https://www.youtube.com/watch?v=MoFESfgjgDE",
    category: "VR Training",
    tech: ["VR Headset", "Gamification", "Touch Display"],
    description: "VR gamified forklift training for Sime Darby Plantations",
  },
  {
    title: "EDT x InfoTrax Turbine VR Training",
    youtube_url: "https://www.youtube.com/watch?v=rJy8I3UyCj4",
    category: "VR Training",
    tech: ["VR Headset", "Simulation", "Unreal Engine"],
    description: "VR training demo for turbine operations",
  },
  {
    title: "Tokyo Fire Department Earthquake Simulation in VR",
    youtube_url: "https://www.youtube.com/watch?v=sc59WclFLog",
    category: "VR Training",
    tech: ["VR Headset", "360 VR", "Unreal Engine"],
    description: "Immersive 360 VR earthquake simulation for emergency preparedness",
  },
  {
    title: "Petronas Hazard Hunt",
    youtube_url: "https://www.youtube.com/watch?v=t5gsWItNfIo",
    category: "VR Training",
    tech: ["Gamification", "Interactive", "AR/Digital"],
    description: "Gamified hazard hunt experience for PETRONAS safety training",
  },

  // ── Virtual Production (ARVENA) ───────────────────────────
  {
    title: "ARVENA Promo 2021",
    youtube_url: "https://www.youtube.com/watch?v=pkJbI0MBCQU",
    category: "Virtual Production",
    tech: ["ARVENA", "Virtual Studio"],
    description: "ARVENA virtual event production platform promo",
  },
  {
    title: "ARVENA Pure Remote Production Showcase",
    youtube_url: "https://www.youtube.com/watch?v=oXQk7a6yITo",
    category: "Virtual Production",
    tech: ["ARVENA", "Virtual Studio", "Remote Production"],
    description: "Fully remote virtual event broadcasting capabilities",
  },
  {
    title: "Introducing ARVENA (AR Virtual Arena)",
    youtube_url: "https://www.youtube.com/watch?v=UI11AkMCKcQ",
    category: "Virtual Production",
    tech: ["ARVENA", "AR", "Virtual Studio", "Real-time 3D"],
    description: "Introduction to ARVENA virtual studio for live events",
  },
  {
    title: "ARVENA: Selleys Malaysia Virtual Launch",
    youtube_url: "https://www.youtube.com/watch?v=0DnekExLun4",
    category: "Virtual Production",
    tech: ["ARVENA", "Virtual Studio", "Live Streaming"],
    description: "Selleys Malaysia virtual product launch via ARVENA",
  },
  {
    title: "ARVENA: MAE by Maybank2U Virtual Launch",
    youtube_url: "https://www.youtube.com/watch?v=EzLsBkj-NQ0",
    category: "Virtual Production",
    tech: ["ARVENA", "Unreal Engine", "Zoom", "Virtual Studio"],
    description: "Virtual launch of MAE by Maybank2U with real-time graphics streamed to Zoom",
  },
  {
    title: "ARVENA: Hada Labo Perfect 10 Game Show LIVE",
    youtube_url: "https://www.youtube.com/watch?v=Iab-efePuOM",
    category: "Virtual Production",
    tech: ["ARVENA", "Live Streaming", "Real-time Game", "Interactive"],
    description: "ARVENA-powered real-time live stream game show with 100 participants",
  },
  {
    title: "ARVENA: AirAsia SUPERSALE Live Streaming",
    youtube_url: "https://www.youtube.com/watch?v=DPJieWjycu8",
    category: "Virtual Production",
    tech: ["ARVENA", "PTZ Camera", "Unreal Engine", "Live Streaming"],
    description: "PTZ camera synced with ARVENA virtual stage for AirAsia Supersale",
  },
  {
    title: "Live Selling via ARVENA",
    youtube_url: "https://www.youtube.com/watch?v=DGQ0-YHwrFQ",
    category: "Virtual Production",
    tech: ["ARVENA", "Live Streaming", "Virtual Studio"],
    description: "Live commerce selling demo via ARVENA virtual studio",
  },

  // ── Event / Festival ──────────────────────────────────────
  {
    title: "Augmented Reality Festival KL 2024 (Official Recap)",
    youtube_url: "https://www.youtube.com/watch?v=1QhRY4hOxpM",
    category: "Event / Festival",
    tech: ["AR", "Mixed Reality", "Holographics", "WebAR", "AI Historians"],
    description: "3 days of spatial storytelling across KL with AR murals, MR playgrounds, 20+ speakers",
  },
  {
    title: "ARFestKL 2024 (Promo)",
    youtube_url: "https://www.youtube.com/watch?v=y8jhJE1Eet4",
    category: "Event / Festival",
    tech: ["AR", "WebAR", "AI", "Projection", "Spatial Computing"],
    description: "10 downtown KL locations with 30+ AR activations running 3 months",
  },
  {
    title: "Mimpilab: Hari Legasi SFC",
    youtube_url: "https://www.youtube.com/watch?v=mbF1EPvJ5bo",
    category: "Event / Festival",
    tech: ["Photobooth", "Event Tech"],
    description: "Highlight video for Mimpilab's Hari Legasi SFC event activation",
  },
  {
    title: "IKAT Behind The Scene",
    youtube_url: "https://www.youtube.com/watch?v=ZRHip-wAwOM",
    category: "Event / Festival",
    tech: ["Video Production"],
    description: "Behind-the-scenes of the IKAT immersive cultural experience",
  },
  {
    title: "MyStartup Single Window Launch at KL20 2024",
    youtube_url: "https://www.youtube.com/watch?v=4O0ktLN4HOw",
    category: "Event / Festival",
    tech: ["Interactive Installation", "AR"],
    description: "EDT activation at MyStartup launch during KL20 Summit 2024",
  },
  {
    title: "IMMERSIO 2022 Highlight",
    youtube_url: "https://www.youtube.com/watch?v=mtpS2SA5c_M",
    category: "Event / Festival",
    tech: ["AR", "VR", "MR", "Projection Mapping"],
    description: "EDT's immersive tech showcase event highlight reel",
  },

  // ── Interactive Installation ──────────────────────────────
  {
    title: "Libresse: Wonders of the Womb Interactive Experience",
    youtube_url: "https://www.youtube.com/watch?v=PTKBO4PEUeA",
    category: "Interactive Installation",
    tech: ["Unity3D", "WebGL", "Interactive"],
    description: "Interactive web experience exploring menstrual cycle built on Unity3D",
  },
  {
    title: "VANS: The Lizzie Wonderland Interactive Volcano",
    youtube_url: "https://www.youtube.com/watch?v=wJ5a3W11uN0",
    category: "Interactive Installation",
    tech: ["Sensors", "Motion Detection", "Interactive Display", "LED"],
    description: "Interactive installations with motion-activated volcano ramp and gesture-based flower growing",
  },
  {
    title: "Petronas Geo-Imaging Touch Display",
    youtube_url: "https://www.youtube.com/watch?v=YOacwGAboiU",
    category: "Interactive Installation",
    tech: ["Touch Display", "Interactive", "Unity3D"],
    description: "Touch-interactive display showing advancement of Geo-Imaging technology",
  },
  {
    title: "KidZania x Touch N Go Interactive Display",
    youtube_url: "https://www.youtube.com/watch?v=s7PIBLHBblk",
    category: "Interactive Installation",
    tech: ["Touch Display", "Interactive Game", "Unity3D"],
    description: "Touch display game introducing Touch N Go E-Wallet at KidZania",
  },
  {
    title: "Gua Cerita at Karnival Upin Ipin - Interactive Colouring",
    youtube_url: "https://www.youtube.com/watch?v=x8YOOGrjQzQ",
    category: "Interactive Installation",
    tech: ["Unity3D", "Interactive Display", "Touch Sensor"],
    description: "Interactive digital colouring activation mixing digital and traditional crayon",
  },
  {
    title: "Petronas AR Demo (STS)",
    youtube_url: "https://www.youtube.com/watch?v=oLuBnku5F8k",
    category: "Interactive Installation",
    tech: ["AR", "Industrial AR", "Tablet/Phone"],
    description: "AR demo for PETRONAS industrial safety training",
  },

  // ── XR Stage / Broadcast ──────────────────────────────────
  {
    title: "Mobile Legends on xR Stage (BTS)",
    youtube_url: "https://www.youtube.com/watch?v=nf2AD52UUZs",
    category: "XR Stage",
    tech: ["xR Stage", "LED Volume", "Real-time 3D"],
    description: "Behind-the-scenes of Mobile Legends on extended Reality xR stage",
  },
  {
    title: "EDT x XR Stage by 3 Particle",
    youtube_url: "https://www.youtube.com/watch?v=w6arOVnJhDE",
    category: "XR Stage",
    tech: ["xR Stage", "LED Volume", "Real-time 3D", "Unreal Engine"],
    description: "EDT collaboration with 3 Particle on XR virtual production stage",
  },

  // ── Virtual Event / Live Performance ──────────────────────
  {
    title: "Silau Maya ALUN - Audio Visual Art Show",
    youtube_url: "https://www.youtube.com/watch?v=6SoWKT2fOqE",
    category: "Virtual Event",
    tech: ["Unreal Engine", "Rokoko Mocap Suit", "Niagara VFX", "ARVENA"],
    description: "Virtual dance performance with Unreal Engine VFX and motion capture",
  },
  {
    title: "VANS EVDNT Behind The Scenes",
    youtube_url: "https://www.youtube.com/watch?v=xIR6knO3ALo",
    category: "Virtual Event",
    tech: ["ARVENA", "Remote Production", "Zoom Integration", "Virtual Studio"],
    description: "VANS Ultimatewaffle virtual launch via 100% pure remote production",
  },
  {
    title: "Kitario Gameplay Walkthrough (Alpha)",
    youtube_url: "https://www.youtube.com/watch?v=0zXrfkgMs3I",
    category: "Virtual Event",
    tech: ["Metaverse", "Game Engine", "VR/Desktop"],
    description: "Kitario metaverse team-building game walkthrough",
  },

  // ── Projection Mapping ────────────────────────────────────
  {
    title: "Dun Sarawak Projection Mapping 2019",
    youtube_url: "https://www.youtube.com/watch?v=iGEyKhjoyXc",
    category: "Projection Mapping",
    tech: ["Projection Mapping"],
    description: "Projection mapping on Sarawak State Legislative Assembly building",
  },
  {
    title: "Rainforest in the City Highlights 2019",
    youtube_url: "https://www.youtube.com/watch?v=xeANqz6SF9w",
    category: "Projection Mapping",
    tech: ["Projection Mapping", "AV Production"],
    description: "Highlight reel from the Rainforest in the City immersive AV event",
  },

  // ── VR Wellness ───────────────────────────────────────────
  {
    title: "WayangMind Trailer",
    youtube_url: "https://www.youtube.com/watch?v=vuexqGH_56I",
    category: "VR Wellness",
    tech: ["VR Headset", "Mobile App", "EEG Sensor", "Spatial Audio"],
    description: "VR wellness platform for SEA with guided meditations and EEG integration",
  },

  // ── EEG / Biometric Art ───────────────────────────────────
  {
    title: "Prudential Art of Rest - Brainwave Visualiser",
    youtube_url: "https://www.youtube.com/watch?v=KRCNMuzrinU",
    category: "Interactive Installation",
    tech: ["EEG Sensor/Headset", "Real-time Visualization"],
    description: "EEG brainwave visualizer for Prudential at Singapore Fintech Festival",
  },

  // ── Podcast / Content ─────────────────────────────────────
  {
    title: "ARFest Podcast EP01: Animating the Future with Book of Lai",
    youtube_url: "https://www.youtube.com/watch?v=K1BUk9OsF0A",
    category: "Podcast",
    tech: ["AR", "SparkAR", "XR"],
    description: "AR Fest Podcast on AR in art and design with Book of Lai",
  },
  {
    title: "ARFest Podcast EP04: AR with a Cause with Jean Lim",
    youtube_url: "https://www.youtube.com/watch?v=Q8TEXSBfZKg",
    category: "Podcast",
    tech: ["AR", "WebAR"],
    description: "AR Fest Podcast on Augmented Reality for social causes",
  },

  // ── RTM / Broadcast AI ────────────────────────────────────
  {
    title: "RTM TV - AI Sample",
    youtube_url: "https://www.youtube.com/watch?v=3eUqrpR8w4I",
    category: "AI Avatar / Host",
    tech: ["AI Presenter", "Text-to-Speech", "AI Video"],
    description: "AI news anchor / broadcast content demo for RTM",
  },

  // ── Metahuman / Virtual Character ─────────────────────────
  {
    title: "Metahuman Raya",
    youtube_url: "https://www.youtube.com/watch?v=0tqCY9mgdKw",
    category: "AI Avatar / Host",
    tech: ["Metahuman", "Unreal Engine", "Realtime 3D"],
    description: "Metahuman experiment on Unreal Engine for Raya celebration",
  },
];

/**
 * Format the video repository into a compact string for prompt injection.
 * Groups by category with one video per line for token efficiency.
 */
export function formatVideoRepositoryForPrompt(): string {
  const grouped = new Map<string, EdtVideo[]>();

  for (const video of EDT_VIDEO_REPOSITORY) {
    const list = grouped.get(video.category) ?? [];
    list.push(video);
    grouped.set(video.category, list);
  }

  const lines: string[] = [];

  for (const [category, videos] of grouped) {
    lines.push(`[${category}]`);
    for (const v of videos) {
      const defaultMark = v.is_default ? " ★DEFAULT" : "";
      lines.push(
        `- "${v.title}" (${v.tech.join(", ")}) — ${v.description}${defaultMark}`
      );
      lines.push(`  → ${v.youtube_url}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}
