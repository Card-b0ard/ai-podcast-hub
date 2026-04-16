window.AppData = {
  categories: [
    {
      id: 'Technology',
      icon: '💻',
      chip: 'Tech',
      desc: 'AI, gadgets, the internet, and future tools.',
      gradient: 'linear-gradient(135deg, #d7def4 0%, #b9c9f2 38%, #92a6db 100%)',
      accent: '#111111'
    },
    {
      id: 'Science',
      icon: '🔬',
      chip: 'Science',
      desc: 'Space, biology, physics, and everyday discoveries.',
      gradient: 'linear-gradient(135deg, #ebe9ff 0%, #c8f0ff 48%, #9fd7ff 100%)',
      accent: '#111111'
    },
    {
      id: 'Geography',
      icon: '🌍',
      chip: 'Geo',
      desc: 'Places, landforms, climate, and global patterns.',
      gradient: 'linear-gradient(135deg, #ecfff1 0%, #c2f1cc 45%, #8ed5a3 100%)',
      accent: '#111111'
    },
    {
      id: 'History',
      icon: '📜',
      chip: 'History',
      desc: 'Events, empires, revolutions, and famous moments.',
      gradient: 'linear-gradient(135deg, #fff6df 0%, #ffd9a3 50%, #f3b56a 100%)',
      accent: '#111111'
    }
  ],
  libraryEpisodes: [
    {
      id: 'technology-what-is-ai-really',
      slug: 'what-is-ai-really',
      title: 'What Is AI Really?',
      category: 'Technology',
      tags: ['ai', 'future', 'machines', 'explained'],
      duration: '2:08',
      description: 'A quick introduction to what artificial intelligence means and how people use it every day.',
      file: 'podcasts/what_is_ai_really.mp3',
      cover: {
        text: 'AI',
        imageUrl: 'covers/what_is_ai_really.png',
        gradient: 'linear-gradient(135deg, #111827, #6366f1)'
      }
    },
    {
      id: 'technology-how-the-internet-moves-data',
      slug: 'how-the-internet-moves-data',
      title: 'How the Internet Moves Data',
      category: 'Technology',
      tags: ['internet', 'networks', 'data', 'computers'],
      duration: '2:21',
      description: 'A simple explanation of what happens when data travels across the internet.',
      file: 'podcasts/how_the_internet_moves_data.mp3',
      cover: {
        text: 'Internet',
        imageUrl: 'covers/how_the_internet_moves_data.png',
        gradient: 'linear-gradient(135deg, #0f172a, #14b8a6)'
      }
    },
    {
      id: 'technology-smartphones-of-the-future',
      slug: 'smartphones-of-the-future',
      title: 'Smartphones of the Future',
      category: 'Technology',
      tags: ['smartphone', 'gadgets', 'future', 'design'],
      duration: '1:57',
      description: 'A look at possible next-generation features in phones and personal devices.',
      file: 'podcasts/smartphones_of_the_future.mp3',
      cover: {
        text: 'Phones',
        imageUrl: 'covers/smartphones_of_the_future.png',
        gradient: 'linear-gradient(135deg, #312e81, #db2777)'
      }
    },
    {
      id: 'science-black-holes-explained',
      slug: 'black-holes-explained',
      title: 'Black Holes Explained',
      category: 'Science',
      tags: ['space', 'black holes', 'gravity', 'universe'],
      duration: '2:15',
      description: 'A beginner-friendly guide to black holes and why they are so extreme.',
      file: 'podcasts/black_holes_explained.mp3',
      cover: {
        text: 'Dark',
        imageUrl: 'covers/black_holes_explained.png',
        gradient: 'linear-gradient(135deg, #0f172a, #1d4ed8)'
      }
    },
    {
      id: 'science-why-we-dream',
      slug: 'why-we-dream',
      title: 'Why We Dream',
      category: 'Science',
      tags: ['sleep', 'brain', 'dreams', 'science'],
      duration: '1:49',
      description: 'A short podcast about sleep, dreams, and what scientists think they may do.',
      file: 'podcasts/why_we_dream.mp3',
      cover: {
        text: 'Dreams',
        imageUrl: 'covers/why_we_dream.png',
        gradient: 'linear-gradient(135deg, #1e1b4b, #8b5cf6)'
      }
    },
    {
      id: 'science-how-vaccines-protect-us',
      slug: 'how-vaccines-protect-us',
      title: 'How Vaccines Protect Us',
      category: 'Science',
      tags: ['health', 'vaccines', 'biology', 'body'],
      duration: '2:02',
      description: 'A clear, simple explanation of how vaccines teach the immune system.',
      file: 'podcasts/how_vaccines_protect_us.mp3',
      cover: {
        text: 'Health',
        imageUrl: 'covers/how_vaccines_protect_us.png',
        gradient: 'linear-gradient(135deg, #065f46, #34d399)'
      }
    },
    {
      id: 'geography-why-deserts-exist',
      slug: 'why-deserts-exist',
      title: 'Why Deserts Exist',
      category: 'Geography',
      tags: ['deserts', 'climate', 'weather', 'earth'],
      duration: '1:58',
      description: 'A fast explanation of how dry regions form around the planet.',
      file: 'podcasts/why_deserts_exist.mp3',
      cover: {
        text: 'Deserts',
        imageUrl: 'covers/why_deserts_exist.png',
        gradient: 'linear-gradient(135deg, #7c2d12, #f59e0b)'
      }
    },
    {
      id: 'geography-understanding-earthquakes',
      slug: 'understanding-earthquakes',
      title: 'Understanding Earthquakes',
      category: 'Geography',
      tags: ['earthquakes', 'plates', 'earth', 'natural'],
      duration: '2:14',
      description: 'Why the ground shakes and what tectonic plates have to do with it.',
      file: 'podcasts/understanding_earthquakes.mp3',
      cover: {
        text: 'Earth',
        imageUrl: 'covers/understanding_earthquakes.png',
        gradient: 'linear-gradient(135deg, #1f2937, #94a3b8)'
      }
    },
    {
      id: 'geography-bhakra-nangal-dam',
      slug: 'bhakra-nangal-dam',
      title: 'Bhakra Nangal Dam',
      category: 'Geography',
      tags: ['places', 'dams', 'infrastructure', 'water'],
      duration: '2:00',
      description: 'A short overview of Bhakra Nangal Dam and why it matters to infrastructure and water management.',
      file: 'podcasts/bhakra_nangal_dam.mp3',
      cover: {
        text: 'Dam',
        imageUrl: 'covers/bhakra_nangal_dam.png',
        gradient: 'linear-gradient(135deg, #0f766e, #22c55e)'
      }
    },
    {
      id: 'history-rise-of-ancient-rome',
      slug: 'rise-of-ancient-rome',
      title: 'The Rise of Ancient Rome',
      category: 'History',
      tags: ['rome', 'ancient', 'empire', 'civilization'],
      duration: '2:16',
      description: 'How Rome grew from a small city into a powerful empire.',
      file: 'podcasts/the_rise_of_ancient_rome.mp3',
      cover: {
        text: 'Rome',
        imageUrl: 'covers/the_rise_of_ancient_rome.png',
        gradient: 'linear-gradient(135deg, #7f1d1d, #f97316)'
      }
    },
    {
      id: 'history-causes-of-world-war-i',
      slug: 'causes-of-world-war-i',
      title: 'Causes of World War I',
      category: 'History',
      tags: ['war', 'world war', 'events', 'history'],
      duration: '2:12',
      description: 'A concise summary of the causes and outcome of World War I.',
      file: 'podcasts/causes_of_world_war_i.mp3',
      cover: {
        text: 'WWI',
        imageUrl: 'covers/causes_of_world_war_i.png',
        gradient: 'linear-gradient(135deg, #2f2f2f, #9ca3af)'
      }
    },
    {
      id: 'history-stories-behind-the-taj-mahal',
      slug: 'stories-behind-the-taj-mahal',
      title: 'Stories Behind the Taj Mahal',
      category: 'History',
      tags: ['india', 'taj mahal', 'monuments', 'culture'],
      duration: '1:55',
      description: 'A short episode about the history and meaning of the Taj Mahal.',
      file: 'podcasts/stories_behind_the_taj_mahal.mp3',
      cover: {
        text: 'Taj',
        imageUrl: 'covers/stories_behind_the_taj_mahal.png',
        gradient: 'linear-gradient(135deg, #7c3aed, #f59e0b)'
      }
    }
  ],
  teamMembers: [
    {
      id: 'nikhil',
      name: 'Nikhil',
      role: 'Web Developer',
      bio: 'Built the EchoHub website, focusing on design, functionality, and user experience. Integrated features like the mini-player, search, and AI for smooth navigation.',
      imageUrl: '',
      mediaLabel: 'Audio or video',
      mediaUrl: '',
      mediaPlaceholder: 'Add a media file in the about_us folder, then update this card with its path.'
    },
    {
      id: 'bhumika',
      name: 'Bhumika',
      role: 'Presentation Designer',
      bio: 'Focused on visual storytelling and branding, ensuring the project’s ideas were clearly communicated through a clean, structured, and visually engaging presentation.',
      imageUrl: '',
      mediaLabel: 'Audio or video',
      mediaUrl: '',
      mediaPlaceholder: 'Portrait and media can be connected later from the about_us folder.'
    },
    {
      id: 'maleeha',
      name: 'Maleeha',
      role: 'Podcast Creator',
      bio: 'Created and researched all podcast episodes, transforming complex topics into short, engaging audio content with clear explanations and strong storytelling.',
      imageUrl: '',
      mediaLabel: 'Audio or video',
      mediaUrl: '',
      mediaPlaceholder: 'Portrait and media can be connected later from the about_us folder.'
    },
    {
      id: 'ria',
      name: 'Ria',
      role: 'Project Manager',
      bio: 'Led the project by coordinating the team, organizing workflow, and ensuring all components came together efficiently into a cohesive final product.',
      imageUrl: '',
      mediaLabel: 'Audio or video',
      mediaUrl: '',
      mediaPlaceholder: 'Portrait and media can be connected later from the about_us folder.'
    },
    {
      id: 'jasmine',
      name: 'Jasmine',
      role: 'Script Writer',
      bio: 'Crafted and refined all written content, ensuring clarity, accuracy, and flow across the project while presenting ideas in a structured and impactful way.',
      imageUrl: '',
      mediaLabel: 'Audio or video',
      mediaUrl: '',
      mediaPlaceholder: 'Portrait and media can be connected later from the about_us folder.'
    }
  ]
};
