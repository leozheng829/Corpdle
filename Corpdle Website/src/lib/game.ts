
import { shuffleArray } from './utils'

export interface Company {
  id: number;
  name: string;
  industry: string;
  founded: string;
  headquarters: string;
  ceo: string;
  revenue: string;
  employees: string;
  colors: string;
  hint: string;
}

export interface GameState {
  currentCompany: Company | null;
  guesses: string[];
  maxGuesses: number;
  gameStatus: 'playing' | 'won' | 'lost';
  revealedHints: string[];
  availableHints: string[];
}

// Hint types in the order they should be revealed
export const HINT_TYPES = [
  'revenue',  // First hint to reveal
  'headquarters',
  'industry',
  'ceo',
  'colors',
  'hint'        // Slogan/Motto
];

export const HINT_LABELS: Record<string, string> = {
  industry: 'Industry',
  founded: 'Founded',
  headquarters: 'Headquarters',
  ceo: 'CEO',
  revenue: 'Annual Revenue',
  employees: 'Employees',
  colors: 'Brand Colors',
  hint: 'Slogan/Motto'
};

export function initializeGame(): GameState {
  const companies = shuffleArray(COMPANIES);
  const currentCompany = companies[0];
  
  // Start with revenue hint revealed, other hints available
  return {
    currentCompany,
    guesses: [],
    maxGuesses: 6,
    gameStatus: 'playing',
    revealedHints: ['revenue'], // Start with revenue hint
    availableHints: HINT_TYPES.slice(1) // All other hints are available in the specified order
  };
}

export function makeGuess(state: GameState, guess: string): GameState {
  if (state.gameStatus !== 'playing') {
    return state;
  }

  const normalizedGuess = guess.trim().toLowerCase();
  const normalizedCompanyName = state.currentCompany?.name.toLowerCase() || '';
  
  const newGuesses = [...state.guesses, guess];
  
  let newGameStatus = state.gameStatus;
  let newRevealedHints = [...state.revealedHints];
  let newAvailableHints = [...state.availableHints];
  
  if (normalizedGuess === normalizedCompanyName) {
    newGameStatus = 'won';
  } else {
    // Reveal a hint after a wrong guess if hints are available
    if (newAvailableHints.length > 0) {
      // Take the first hint from the available hints (to maintain order)
      const hintToReveal = newAvailableHints[0];
      
      newRevealedHints.push(hintToReveal);
      newAvailableHints.shift(); // Remove the first hint
    }
    
    if (newGuesses.length >= state.maxGuesses) {
      newGameStatus = 'lost';
    }
  }
  
  return {
    ...state,
    guesses: newGuesses,
    gameStatus: newGameStatus,
    revealedHints: newRevealedHints,
    availableHints: newAvailableHints
  };
}

export function getGameStats(): {
  played: number;
  won: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: Record<number, number>;
} {
  const statsStr = localStorage.getItem('corpdle-stats');
  if (!statsStr) {
    return {
      played: 0,
      won: 0,
      currentStreak: 0,
      maxStreak: 0,
      guessDistribution: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0}
    };
  }
  
  return JSON.parse(statsStr);
}

export function updateGameStats(state: GameState): void {
  const stats = getGameStats();
  
  stats.played += 1;
  
  if (state.gameStatus === 'won') {
    stats.won += 1;
    stats.currentStreak += 1;
    stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
    
    // Update guess distribution
    const guessCount = state.guesses.length;
    stats.guessDistribution[guessCount] = (stats.guessDistribution[guessCount] || 0) + 1;
  } else {
    stats.currentStreak = 0;
  }
  
  localStorage.setItem('corpdle-stats', JSON.stringify(stats));
}

export function getLastPlayedDate(): Date | null {
  const dateStr = localStorage.getItem('corpdle-last-played');
  return dateStr ? new Date(dateStr) : null;
}

export function setLastPlayedDate(): void {
  localStorage.setItem('corpdle-last-played', new Date().toISOString());
}

export function getSavedGameState(): GameState | null {
  const gameStateStr = localStorage.getItem('corpdle-game-state');
  return gameStateStr ? JSON.parse(gameStateStr) : null;
}

export function saveGameState(state: GameState): void {
  localStorage.setItem('corpdle-game-state', JSON.stringify(state));
}

export function shouldStartNewGame(): boolean {
  const lastPlayed = getLastPlayedDate();
  if (!lastPlayed) return true;
  
  const now = new Date();
  const lastPlayedDate = new Date(lastPlayed);
  
  // Check if it's a new day (UTC)
  return lastPlayedDate.getUTCDate() !== now.getUTCDate() || 
         lastPlayedDate.getUTCMonth() !== now.getUTCMonth() || 
         lastPlayedDate.getUTCFullYear() !== now.getUTCFullYear();
}

export const COMPANIES: Company[] = [
  {
    id: 1,
    name: "Google",
    industry: "Technology",
    founded: "1998",
    headquarters: "Mountain View, California, USA",
    ceo: "Sundar Pichai",
    revenue: "$282.8 billion",
    employees: "156,500",
    colors: "Blue, Red, Yellow, Green",
    hint: "Don't Be Evil"
  },
  {
    id: 2,
    name: "Apple",
    industry: "Technology",
    founded: "1976",
    headquarters: "Cupertino, California, USA",
    ceo: "Tim Cook",
    revenue: "$394.3 billion",
    employees: "164,000",
    colors: "White, Silver, Black",
    hint: "Think Different"
  },
  {
    id: 3,
    name: "Microsoft",
    industry: "Technology",
    founded: "1975",
    headquarters: "Redmond, Washington, USA",
    ceo: "Satya Nadella",
    revenue: "$211.9 billion",
    employees: "221,000",
    colors: "Blue, Green, Red, Yellow",
    hint: "Be What's Next"
  },
  {
    id: 4,
    name: "Amazon",
    industry: "E-commerce, Cloud Computing",
    founded: "1994",
    headquarters: "Seattle, Washington, USA",
    ceo: "Andy Jassy",
    revenue: "$513.9 billion",
    employees: "1,540,000",
    colors: "Black, Orange",
    hint: "Work Hard. Have Fun. Make History."
  },
  {
    id: 5,
    name: "Meta",
    industry: "Social Media, Technology",
    founded: "2004",
    headquarters: "Menlo Park, California, USA",
    ceo: "Mark Zuckerberg",
    revenue: "$116.6 billion",
    employees: "77,800",
    colors: "Blue, White",
    hint: "Move Fast and Break Things"
  },
  {
    id: 6,
    name: "IBM",
    industry: "Technology, Consulting",
    founded: "1911",
    headquarters: "Armonk, New York, USA",
    ceo: "Arvind Krishna",
    revenue: "$60.5 billion",
    employees: "288,300",
    colors: "Blue",
    hint: "Think"
  },
  {
    id: 7,
    name: "Intel",
    industry: "Semiconductors, Technology",
    founded: "1968",
    headquarters: "Santa Clara, California, USA",
    ceo: "Pat Gelsinger",
    revenue: "$54.2 billion",
    employees: "131,900",
    colors: "Blue",
    hint: "Intel Inside"
  },
  {
    id: 8,
    name: "Oracle",
    industry: "Technology, Cloud Computing",
    founded: "1977",
    headquarters: "Austin, Texas, USA",
    ceo: "Safra Catz",
    revenue: "$49.9 billion",
    employees: "143,000",
    colors: "Red",
    hint: "Engineered to Work Together"
  },
  {
    id: 9,
    name: "Adobe",
    industry: "Software",
    founded: "1982",
    headquarters: "San Jose, California, USA",
    ceo: "Shantanu Narayen",
    revenue: "$19.4 billion",
    employees: "29,000",
    colors: "Red",
    hint: "Creativity for All"
  },
  {
    id: 10,
    name: "Salesforce",
    industry: "Cloud Computing, CRM",
    founded: "1999",
    headquarters: "San Francisco, California, USA",
    ceo: "Marc Benioff",
    revenue: "$31.4 billion",
    employees: "73,000",
    colors: "Blue, White",
    hint: "No Software"
  },
  {
    id: 11,
    name: "Nvidia",
    industry: "Semiconductors, Technology",
    founded: "1993",
    headquarters: "Santa Clara, California, USA",
    ceo: "Jensen Huang",
    revenue: "$26.9 billion",
    employees: "22,500",
    colors: "Green, Black",
    hint: "The Way It's Meant to be Played"
  },
  {
    id: 12,
    name: "Cisco",
    industry: "Networking Hardware, Technology",
    founded: "1984",
    headquarters: "San Jose, California, USA",
    ceo: "Chuck Robbins",
    revenue: "$51.6 billion",
    employees: "83,300",
    colors: "Blue",
    hint: "Tomorrow Starts Here"
  },
  {
    id: 13,
    name: "Dell",
    industry: "Computer Hardware, Technology",
    founded: "1984",
    headquarters: "Round Rock, Texas, USA",
    ceo: "Michael Dell",
    revenue: "$102.3 billion",
    employees: "133,000",
    colors: "Blue",
    hint: "Yours is Here"
  },
  {
    id: 14,
    name: "HP",
    industry: "Computer Hardware, Technology",
    founded: "1939",
    headquarters: "Palo Alto, California, USA",
    ceo: "Enrique Lores",
    revenue: "$63.5 billion",
    employees: "58,000",
    colors: "Blue",
    hint: "Keep Reinventing"
  },
  {
    id: 15,
    name: "SAP",
    industry: "Enterprise Software",
    founded: "1972",
    headquarters: "Walldorf, Germany",
    ceo: "Christian Klein",
    revenue: "$32.5 billion",
    employees: "107,400",
    colors: "Blue",
    hint: "Run Simple"
  },
  {
    id: 16,
    name: "Zoom",
    industry: "Video Communications",
    founded: "2011",
    headquarters: "San Jose, California, USA",
    ceo: "Eric Yuan",
    revenue: "$4.4 billion",
    employees: "7,400",
    colors: "Blue, White",
    hint: "Meet Happy"
  },
  {
    id: 17,
    name: "Dropbox",
    industry: "Cloud Storage",
    founded: "2007",
    headquarters: "San Francisco, California, USA",
    ceo: "Drew Houston",
    revenue: "$2.4 billion",
    employees: "3,000",
    colors: "Blue",
    hint: "All Your Files, Always With You"
  },
  {
    id: 18,
    name: "Reddit",
    industry: "Social Media",
    founded: "2005",
    headquarters: "San Francisco, California, USA",
    ceo: "Steve Huffman",
    revenue: "$804 million",
    employees: "2,000",
    colors: "Orange, White",
    hint: "Dive Into Anything"
  },
  {
    id: 19,
    name: "Spotify",
    industry: "Music Streaming",
    founded: "2006",
    headquarters: "Stockholm, Sweden",
    ceo: "Daniel Ek",
    revenue: "$13.2 billion",
    employees: "8,359",
    colors: "Green, Black",
    hint: "Music for Everyone"
  },
  {
    id: 20,
    name: "TikTok",
    industry: "Social Media",
    founded: "2016",
    headquarters: "Culver City, California, USA",
    ceo: "Shou Zi Chew",
    revenue: "$9.4 billion",
    employees: "7,000",
    colors: "Black, Teal, Pink",
    hint: "Make Your Day"
  },
  {
    id: 21,
    name: "YouTube",
    industry: "Video Sharing",
    founded: "2005",
    headquarters: "San Bruno, California, USA",
    ceo: "Neal Mohan",
    revenue: "$29.2 billion",
    employees: "5,000",
    colors: "Red, White",
    hint: "Broadcast Yourself"
  },
  {
    id: 22,
    name: "WhatsApp",
    industry: "Messaging",
    founded: "2009",
    headquarters: "Menlo Park, California, USA",
    ceo: "Will Cathcart",
    revenue: "$8.7 billion",
    employees: "2,000",
    colors: "Green, White",
    hint: "Simple. Secure. Reliable messaging."
  },
  {
    id: 23,
    name: "X",
    industry: "Social Media",
    founded: "2006",
    headquarters: "San Francisco, California, USA",
    ceo: "Linda Yaccarino",
    revenue: "$5.1 billion",
    employees: "1,500",
    colors: "Black, White",
    hint: "What's happening?"
  },
  {
    id: 24,
    name: "Slack",
    industry: "Business Communication",
    founded: "2009",
    headquarters: "San Francisco, California, USA",
    ceo: "Lidiane Jones",
    revenue: "$1.5 billion",
    employees: "3,000",
    colors: "Purple, White",
    hint: "Where Work Happens"
  },
  {
    id: 25,
    name: "GitHub",
    industry: "Software Development",
    founded: "2008",
    headquarters: "San Francisco, California, USA",
    ceo: "Thomas Dohmke",
    revenue: "$1 billion",
    employees: "3,000",
    colors: "Black, White",
    hint: "Where the world builds software"
  },
  {
    id: 26,
    name: "Notion",
    industry: "Productivity Software",
    founded: "2016",
    headquarters: "San Francisco, California, USA",
    ceo: "Ivan Zhao",
    revenue: "$500 million",
    employees: "400",
    colors: "Black, White",
    hint: "All-in-one workspace"
  },
  {
    id: 27,
    name: "Asana",
    industry: "Project Management",
    founded: "2008",
    headquarters: "San Francisco, California, USA",
    ceo: "Dustin Moskovitz",
    revenue: "$547 million",
    employees: "1,800",
    colors: "Red, Orange",
    hint: "Do great things together"
  },
  {
    id: 28,
    name: "Atlassian",
    industry: "Software Development",
    founded: "2002",
    headquarters: "Sydney, Australia",
    ceo: "Scott Farquhar & Mike Cannon-Brookes",
    revenue: "$3.5 billion",
    employees: "10,000",
    colors: "Blue",
    hint: "Unleash the potential of every team"
  },
  {
    id: 29,
    name: "Trello",
    industry: "Project Management",
    founded: "2011",
    headquarters: "New York City, USA",
    ceo: "Michael Pryor",
    revenue: "$100 million",
    employees: "200",
    colors: "Blue, White",
    hint: "Organize anything, together"
  },
  {
    id: 30,
    name: "Shopify",
    industry: "E-commerce",
    founded: "2006",
    headquarters: "Ottawa, Canada",
    ceo: "Tobias Lütke",
    revenue: "$5.6 billion",
    employees: "11,600",
    colors: "Green, White",
    hint: "Making commerce better for everyone"
  },
  {
    id: 31,
    name: "Samsung",
    industry: "Electronics, Technology",
    founded: "1938",
    headquarters: "Seoul, South Korea",
    ceo: "Han Jong-hee",
    revenue: "$244.2 billion",
    employees: "267,937",
    colors: "Blue, White",
    hint: "Do What You Can't"
  },
  {
    id: 32,
    name: "Sony",
    industry: "Electronics, Entertainment",
    founded: "1946",
    headquarters: "Tokyo, Japan",
    ceo: "Kenichiro Yoshida",
    revenue: "$88.3 billion",
    employees: "109,700",
    colors: "Black, Silver",
    hint: "Be Moved"
  },
  {
    id: 33,
    name: "LG",
    industry: "Electronics",
    founded: "1947",
    headquarters: "Seoul, South Korea",
    ceo: "William Cho",
    revenue: "$63.3 billion",
    employees: "75,000",
    colors: "Red",
    hint: "Life's Good"
  },
  {
    id: 34,
    name: "Huawei",
    industry: "Telecommunications, Technology",
    founded: "1987",
    headquarters: "Shenzhen, China",
    ceo: "Ren Zhengfei",
    revenue: "$92.4 billion",
    employees: "195,000",
    colors: "Red",
    hint: "Building a Fully Connected, Intelligent World"
  },
  {
    id: 35,
    name: "Xiaomi",
    industry: "Electronics",
    founded: "2010",
    headquarters: "Beijing, China",
    ceo: "Lei Jun",
    revenue: "$37.7 billion",
    employees: "35,000",
    colors: "Orange",
    hint: "Just for fans"
  },
  {
    id: 36,
    name: "Fitbit",
    industry: "Wearable Technology",
    founded: "2007",
    headquarters: "San Francisco, California, USA",
    ceo: "James Park",
    revenue: "$1.4 billion",
    employees: "1,700",
    colors: "Blue, Teal",
    hint: "Find Your Fit"
  },
  {
    id: 37,
    name: "GoPro",
    industry: "Consumer Electronics",
    founded: "2002",
    headquarters: "San Mateo, California, USA",
    ceo: "Nicholas Woodman",
    revenue: "$1.1 billion",
    employees: "700",
    colors: "Black, Blue",
    hint: "Be a Hero"
  },
  {
    id: 38,
    name: "Garmin",
    industry: "GPS Technology",
    founded: "1989",
    headquarters: "Olathe, Kansas, USA",
    ceo: "Cliff Pemble",
    revenue: "$5.5 billion",
    employees: "19,000",
    colors: "Blue, White",
    hint: "Beat Yesterday"
  },
  {
    id: 39,
    name: "Bose",
    industry: "Audio Equipment",
    founded: "1964",
    headquarters: "Framingham, Massachusetts, USA",
    ceo: "Lila Snyder",
    revenue: "$4 billion",
    employees: "8,000",
    colors: "Black, White",
    hint: "Better Sound Through Research"
  },
  {
    id: 40,
    name: "Beats",
    industry: "Audio Equipment",
    founded: "2006",
    headquarters: "Culver City, California, USA",
    ceo: "Oliver Schusser",
    revenue: "$2 billion",
    employees: "700",
    colors: "Red, Black, White",
    hint: "Hear What You Want"
  },
  {
    id: 41,
    name: "DJI",
    industry: "Drone Technology",
    founded: "2006",
    headquarters: "Shenzhen, China",
    ceo: "Frank Wang",
    revenue: "$4.2 billion",
    employees: "14,000",
    colors: "Gray, Red",
    hint: "The Future of Possible"
  },
  {
    id: 42,
    name: "Roku",
    industry: "Digital Media Players",
    founded: "2002",
    headquarters: "San Jose, California, USA",
    ceo: "Anthony Wood",
    revenue: "$3.1 billion",
    employees: "3,000",
    colors: "Purple, Black",
    hint: "Streaming for everyone"
  },
  {
    id: 43,
    name: "Ring",
    industry: "Home Security",
    founded: "2013",
    headquarters: "Santa Monica, California, USA",
    ceo: "Jamie Siminoff",
    revenue: "$1.2 billion",
    employees: "2,000",
    colors: "Blue, White",
    hint: "Smart Security for Every Home"
  },
  {
    id: 44,
    name: "Nest",
    industry: "Smart Home",
    founded: "2010",
    headquarters: "Palo Alto, California, USA",
    ceo: "Rishi Chandra",
    revenue: "$800 million",
    employees: "1,100",
    colors: "Silver, Black",
    hint: "We make products that are beautiful, thoughtful and easy to use"
  },
  {
    id: 45,
    name: "Philips",
    industry: "Electronics, Healthcare",
    founded: "1891",
    headquarters: "Amsterdam, Netherlands",
    ceo: "Roy Jakobs",
    revenue: "$18.1 billion",
    employees: "77,000",
    colors: "Blue, White",
    hint: "Innovation and You"
  },
  {
    id: 46,
    name: "Walmart",
    industry: "Retail",
    founded: "1962",
    headquarters: "Bentonville, Arkansas, USA",
    ceo: "Doug McMillon",
    revenue: "$611.3 billion",
    employees: "2,100,000",
    colors: "Blue, Yellow",
    hint: "Save Money. Live Better."
  },
  {
    id: 47,
    name: "Target",
    industry: "Retail",
    founded: "1902",
    headquarters: "Minneapolis, Minnesota, USA",
    ceo: "Brian Cornell",
    revenue: "$109.1 billion",
    employees: "440,000",
    colors: "Red, White",
    hint: "Expect More. Pay Less."
  },
  {
    id: 48,
    name: "Costco",
    industry: "Retail, Wholesale",
    founded: "1983",
    headquarters: "Issaquah, Washington, USA",
    ceo: "Ron Vachris",
    revenue: "$226.9 billion",
    employees: "304,000",
    colors: "Red, Blue",
    hint: "Do the right thing"
  },
  {
    id: 49,
    name: "Kroger",
    industry: "Grocery Retail",
    founded: "1883",
    headquarters: "Cincinnati, Ohio, USA",
    ceo: "Rodney McMullen",
    revenue: "$148.3 billion",
    employees: "430,000",
    colors: "Blue, White",
    hint: "Fresh for Everyone"
  },
  {
    id: 50,
    name: "Aldi",
    industry: "Grocery Retail",
    founded: "1946",
    headquarters: "Essen, Germany",
    ceo: "Jason Hart (US)",
    revenue: "$121.1 billion",
    employees: "270,000",
    colors: "Blue, Orange",
    hint: "Shop differentli"
  },
  {
    id: 51,
    name: "Best Buy",
    industry: "Electronics Retail",
    founded: "1966",
    headquarters: "Richfield, Minnesota, USA",
    ceo: "Corie Barry",
    revenue: "$46.3 billion",
    employees: "100,000",
    colors: "Blue, Yellow",
    hint: "Expert Service. Unbeatable Price."
  },
  {
    id: 52,
    name: "eBay",
    industry: "E-commerce",
    founded: "1995",
    headquarters: "San Jose, California, USA",
    ceo: "Jamie Iannone",
    revenue: "$9.8 billion",
    employees: "11,600",
    colors: "Red, Blue, Yellow, Green",
    hint: "Connect. Buy. Sell."
  },
  {
    id: 53,
    name: "Etsy",
    industry: "E-commerce",
    founded: "2005",
    headquarters: "Brooklyn, New York, USA",
    ceo: "Josh Silverman",
    revenue: "$2.6 billion",
    employees: "2,400",
    colors: "Orange",
    hint: "Keep Commerce Human"
  },
  {
    id: 54,
    name: "Wayfair",
    industry: "E-commerce, Furniture",
    founded: "2002",
    headquarters: "Boston, Massachusetts, USA",
    ceo: "Niraj Shah",
    revenue: "$12.2 billion",
    employees: "16,700",
    colors: "Purple",
    hint: "A Zillion Things Home"
  },
  {
    id: 55,
    name: "Macy's",
    industry: "Department Store Retail",
    founded: "1858",
    headquarters: "New York City, USA",
    ceo: "Tony Spring",
    revenue: "$24.4 billion",
    employees: "94,500",
    colors: "Red",
    hint: "The Magic of Macy's"
  },
  {
    id: 56,
    name: "Nordstrom",
    industry: "Luxury Department Store",
    founded: "1901",
    headquarters: "Seattle, Washington, USA",
    ceo: "Erik Nordstrom",
    revenue: "$15.1 billion",
    employees: "72,000",
    colors: "Black, White",
    hint: "Fashion & Style For Every You"
  },
  {
    id: 57,
    name: "Shein",
    industry: "Fast Fashion Retail",
    founded: "2008",
    headquarters: "Singapore",
    ceo: "Chris Xu",
    revenue: "$24 billion",
    employees: "10,000",
    colors: "Black, White",
    hint: "For the Seasons, For the Moments"
  },
  {
    id: 58,
    name: "Temu",
    industry: "E-commerce",
    founded: "2022",
    headquarters: "Boston, Massachusetts, USA",
    ceo: "Colin Huang",
    revenue: "$16.9 billion",
    employees: "4,000",
    colors: "Orange, White",
    hint: "Shop Like a Billionaire"
  },
  {
    id: 59,
    name: "Ikea",
    industry: "Furniture Retail",
    founded: "1943",
    headquarters: "Delft, Netherlands",
    ceo: "Jesper Brodin",
    revenue: "$44.6 billion",
    employees: "225,000",
    colors: "Blue, Yellow",
    hint: "Creating a Better Everyday Life"
  },
  {
    id: 60,
    name: "Zara",
    industry: "Fashion Retail",
    founded: "1975",
    headquarters: "Arteixo, Spain",
    ceo: "Óscar García Maceiras",
    revenue: "$32.6 billion",
    employees: "162,000",
    colors: "Black, White",
    hint: "Love Your Curves"
  },
  {
    id: 61,
    name: "H&M",
    industry: "Fashion Retail",
    founded: "1947",
    headquarters: "Stockholm, Sweden",
    ceo: "Helena Helmersson",
    revenue: "$22.5 billion",
    employees: "155,000",
    colors: "Red, White",
    hint: "Fashion and Quality at the Best Price"
  },
  {
    id: 62,
    name: "Uniqlo",
    industry: "Fashion Retail",
    founded: "1949",
    headquarters: "Tokyo, Japan",
    ceo: "Tadashi Yanai",
    revenue: "$23.6 billion",
    employees: "55,000",
    colors: "Red, White",
    hint: "Made for All"
  },
  {
    id: 63,
    name: "Foot Locker",
    industry: "Footwear Retail",
    founded: "1974",
    headquarters: "New York City, USA",
    ceo: "Mary Dillon",
    revenue: "$8.4 billion",
    employees: "50,000",
    colors: "Black, White",
    hint: "We Are Sneakers"
  },
  {
    id: 64,
    name: "GameStop",
    industry: "Video Game Retail",
    founded: "1984",
    headquarters: "Grapevine, Texas, USA",
    ceo: "Ryan Cohen",
    revenue: "$5.9 billion",
    employees: "11,000",
    colors: "Red, Black",
    hint: "Power to the Players"
  },
  {
    id: 65,
    name: "Home Depot",
    industry: "Home Improvement Retail",
    founded: "1978",
    headquarters: "Atlanta, Georgia, USA",
    ceo: "Ted Decker",
    revenue: "$157.4 billion",
    employees: "471,600",
    colors: "Orange, White",
    hint: "How Doers Get More Done"
  },
  {
    id: 66,
    name: "McDonald's",
    industry: "Fast Food",
    founded: "1955",
    headquarters: "Chicago, Illinois, USA",
    ceo: "Chris Kempczinski",
    revenue: "$23.2 billion",
    employees: "200,000",
    colors: "Red, Yellow",
    hint: "I'm Lovin' It"
  },
  {
    id: 67,
    name: "Starbucks",
    industry: "Coffee, Fast Food",
    founded: "1971",
    headquarters: "Seattle, Washington, USA",
    ceo: "Laxman Narasimhan",
    revenue: "$32.3 billion",
    employees: "383,000",
    colors: "Green, White",
    hint: "To inspire and nurture the human spirit"
  },
  {
    id: 68,
    name: "KFC",
    industry: "Fast Food",
    founded: "1952",
    headquarters: "Louisville, Kentucky, USA",
    ceo: "Sabir Sami",
    revenue: "$27.9 billion",
    employees: "400,000",
    colors: "Red, White",
    hint: "It's Finger Lickin' Good"
  },
  {
    id: 69,
    name: "Taco Bell",
    industry: "Fast Food",
    founded: "1962",
    headquarters: "Irvine, California, USA",
    ceo: "Sean Tresvant",
    revenue: "$14 billion",
    employees: "40,000",
    colors: "Purple, Pink",
    hint: "Live Más"
  },
  {
    id: 70,
    name: "Chick-fil-A",
    industry: "Fast Food",
    founded: "1946",
    headquarters: "Atlanta, Georgia, USA",
    ceo: "Dan Cathy",
    revenue: "$16.7 billion",
    employees: "170,000",
    colors: "Red, White",
    hint: "Eat Mor Chikin"
  },
  {
    id: 71,
    name: "Wendy's",
    industry: "Fast Food",
    founded: "1969",
    headquarters: "Dublin, Ohio, USA",
    ceo: "Kirk Tanner",
    revenue: "$2.1 billion",
    employees: "14,000",
    colors: "Red, White",
    hint: "Quality is our Recipe"
  },
  {
    id: 72,
    name: "Subway",
    industry: "Fast Food",
    founded: "1965",
    headquarters: "Milford, Connecticut, USA",
    ceo: "John Chidsey",
    revenue: "$9.4 billion",
    employees: "21,000",
    colors: "Yellow, Green",
    hint: "Eat Fresh"
  },
  {
    id: 73,
    name: "Domino's",
    industry: "Fast Food",
    founded: "1960",
    headquarters: "Ann Arbor, Michigan, USA",
    ceo: "Russell Weiner",
    revenue: "$4.5 billion",
    employees: "13,500",
    colors: "Red, Blue",
    hint: "Oh Yes We Did"
  },
  {
    id: 74,
    name: "Pizza Hut",
    industry: "Fast Food",
    founded: "1958",
    headquarters: "Plano, Texas, USA",
    ceo: "Aaron Powell",
    revenue: "$13.5 billion",
    employees: "100,000",
    colors: "Red, White",
    hint: "No One OutPizzas the Hut"
  },
  {
    id: 75,
    name: "Dunkin'",
    industry: "Fast Food, Coffee",
    founded: "1950",
    headquarters: "Canton, Massachusetts, USA",
    ceo: "David Hoffmann",
    revenue: "$1.4 billion",
    employees: "15,000",
    colors: "Orange, Pink",
    hint: "America Runs on Dunkin'"
  },
  {
    id: 76,
    name: "Chipotle",
    industry: "Fast Casual Restaurant",
    founded: "1993",
    headquarters: "Newport Beach, California, USA",
    ceo: "Brian Niccol",
    revenue: "$8.6 billion",
    employees: "102,000",
    colors: "Red, White",
    hint: "Food With Integrity"
  },
  {
    id: 77,
    name: "Panera",
    industry: "Fast Casual Restaurant",
    founded: "1987",
    headquarters: "Sunset Hills, Missouri, USA",
    ceo: "Niren Chaudhary",
    revenue: "$3 billion",
    employees: "44,000",
    colors: "Green, Brown",
    hint: "Food as it should be"
  },
  {
    id: 78,
    name: "Popeyes",
    industry: "Fast Food",
    founded: "1972",
    headquarters: "Miami, Florida, USA",
    ceo: "Sami Siddiqui",
    revenue: "$4.4 billion",
    employees: "30,000",
    colors: "Orange, Red",
    hint: "Louisiana Fast"
  },
  {
    id: 79,
    name: "Krispy Kreme",
    industry: "Fast Food, Donuts",
    founded: "1937",
    headquarters: "Charlotte, North Carolina, USA",
    ceo: "Michael Tattersfield",
    revenue: "$1.5 billion",
    employees: "21,000",
    colors: "Red, Green",
    hint: "Original Glazed"
  },
  {
    id: 80,
    name: "Burger King",
    industry: "Fast Food",
    founded: "1954",
    headquarters: "Miami, Florida, USA",
    ceo: "Joshua Kobza",
    revenue: "$1.9 billion",
    employees: "32,000",
    colors: "Red, Yellow, Blue",
    hint: "Have It Your Way"
  },
  {
    id: 81,
    name: "Red Bull",
    industry: "Energy Drinks",
    founded: "1987",
    headquarters: "Fuschl am See, Austria",
    ceo: "Dietrich Mateschitz",
    revenue: "$9.8 billion",
    employees: "15,000",
    colors: "Red, Blue, Silver",
    hint: "Gives You Wings"
  },
  {
    id: 82,
    name: "Coca-Cola",
    industry: "Beverages",
    founded: "1886",
    headquarters: "Atlanta, Georgia, USA",
    ceo: "James Quincey",
    revenue: "$43 billion",
    employees: "79,000",
    colors: "Red, White",
    hint: "Taste the Feeling"
  },
  {
    id: 83,
    name: "Pepsi",
    industry: "Beverages",
    founded: "1898",
    headquarters: "Purchase, New York, USA",
    ceo: "Ramon Laguarta",
    revenue: "$86.4 billion",
    employees: "315,000",
    colors: "Blue, Red, White",
    hint: "That's What I Like"
  },
  {
    id: 84,
    name: "Nestlé",
    industry: "Food and Beverage",
    founded: "1866",
    headquarters: "Vevey, Switzerland",
    ceo: "Mark Schneider",
    revenue: "$93.2 billion",
    employees: "275,000",
    colors: "Blue, White",
    hint: "Good Food, Good Life"
  },
  {
    id: 85,
    name: "Gatorade",
    industry: "Sports Drinks",
    founded: "1965",
    headquarters: "Chicago, Illinois, USA",
    ceo: "Ramon Laguarta",
    revenue: "$5.5 billion",
    employees: "500",
    colors: "Orange, Green, Blue",
    hint: "Is it in you?"
  },
  {
    id: 86,
    name: "Monster",
    industry: "Energy Drinks",
    founded: "2002",
    headquarters: "Corona, California, USA",
    ceo: "Rodney Sacks",
    revenue: "$6.3 billion",
    employees: "4,000",
    colors: "Green, Black",
    hint: "Unleash The Beast"
  },
  {
    id: 87,
    name: "Ben & Jerry's",
    industry: "Ice Cream",
    founded: "1978",
    headquarters: "Burlington, Vermont, USA",
    ceo: "Matthew McCarthy",
    revenue: "$1.2 billion",
    employees: "2,500",
    colors: "Blue, Green, White",
    hint: "Peace, Love, & Ice Cream"
  },
  {
    id: 88,
    name: "Hershey's",
    industry: "Confectionery",
    founded: "1894",
    headquarters: "Hershey, Pennsylvania, USA",
    ceo: "Michele Buck",
    revenue: "$10.4 billion",
    employees: "19,000",
    colors: "Brown, Silver",
    hint: "The Great American Chocolate Bar"
  },
  {
    id: 89,
    name: "Heinz",
    industry: "Food Processing",
    founded: "1869",
    headquarters: "Pittsburgh, Pennsylvania, USA",
    ceo: "Miguel Patricio",
    revenue: "$26 billion",
    employees: "38,000",
    colors: "Red, White",
    hint: "57 Varieties"
  },
  {
    id: 90,
    name: "Kellogg's",
    industry: "Food Processing",
    founded: "1906",
    headquarters: "Battle Creek, Michigan, USA",
    ceo: "Steve Cahillane",
    revenue: "$15.3 billion",
    employees: "31,000",
    colors: "Red, White",
    hint: "The Best To You Each Morning"
  },
  {
    id: 91,
    name: "Ford",
    industry: "Automotive",
    founded: "1903",
    headquarters: "Dearborn, Michigan, USA",
    ceo: "Jim Farley",
    revenue: "$176.2 billion",
    employees: "173,000",
    colors: "Blue",
    hint: "Built Ford Tough"
  },
  {
    id: 92,
    name: "Toyota",
    industry: "Automotive",
    founded: "1937",
    headquarters: "Toyota City, Japan",
    ceo: "Koji Sato",
    revenue: "$279.6 billion",
    employees: "370,870",
    colors: "Red, Silver",
    hint: "Let's Go Places"
  },
  {
    id: 93,
    name: "Honda",
    industry: "Automotive",
    founded: "1948",
    headquarters: "Tokyo, Japan",
    ceo: "Toshihiro Mibe",
    revenue: "$138.6 billion",
    employees: "204,035",
    colors: "Red, White",
    hint: "The Power of Dreams"
  },
  {
    id: 94,
    name: "Chevrolet",
    industry: "Automotive",
    founded: "1911",
    headquarters: "Detroit, Michigan, USA",
    ceo: "Mary Barra",
    revenue: "$171.8 billion",
    employees: "167,000",
    colors: "Gold",
    hint: "Find New Roads"
  },
  {
    id: 95,
    name: "Tesla",
    industry: "Automotive, Energy",
    founded: "2003",
    headquarters: "Austin, Texas, USA",
    ceo: "Elon Musk",
    revenue: "$81.5 billion",
    employees: "127,855",
    colors: "Red, Black, Silver",
    hint: "Accelerating the World's Transition to Sustainable Energy"
  },
  {
    id: 96,
    name: "BMW",
    industry: "Automotive",
    founded: "1916",
    headquarters: "Munich, Germany",
    ceo: "Oliver Zipse",
    revenue: "$155.1 billion",
    employees: "118,909",
    colors: "Blue, White, Black",
    hint: "The Ultimate Driving Machine"
  },
  {
    id: 97,
    name: "Mercedes",
    industry: "Automotive",
    founded: "1926",
    headquarters: "Stuttgart, Germany",
    ceo: "Ola Källenius",
    revenue: "$153.2 billion",
    employees: "172,425",
    colors: "Silver",
    hint: "The Best or Nothing"
  },
  {
    id: 98,
    name: "Audi",
    industry: "Automotive",
    founded: "1909",
    headquarters: "Ingolstadt, Germany",
    ceo: "Gernot Döllner",
    revenue: "$68.2 billion",
    employees: "87,000",
    colors: "Silver",
    hint: "Vorsprung durch Technik"
  },
  {
    id: 99,
    name: "Volkswagen",
    industry: "Automotive",
    founded: "1937",
    headquarters: "Wolfsburg, Germany",
    ceo: "Oliver Blume",
    revenue: "$322.1 billion",
    employees: "675,805",
    colors: "Blue, White",
    hint: "Das Auto"
  },
  {
    id: 100,
    name: "Nissan",
    industry: "Automotive",
    founded: "1933",
    headquarters: "Yokohama, Japan",
    ceo: "Makoto Uchida",
    revenue: "$74.2 billion",
    employees: "134,111",
    colors: "Red, Silver",
    hint: "Innovation that excites"
  },
  {
    id: 101,
    name: "Hyundai",
    industry: "Automotive",
    founded: "1967",
    headquarters: "Seoul, South Korea",
    ceo: "Euisun Chung",
    revenue: "$114.1 billion",
    employees: "121,000",
    colors: "Blue",
    hint: "New Thinking. New Possibilities."
  },
  {
    id: 102,
    name: "Kia",
    industry: "Automotive",
    founded: "1944",
    headquarters: "Seoul, South Korea",
    ceo: "Ho Sung Song",
    revenue: "$66.5 billion",
    employees: "52,348",
    colors: "Red",
    hint: "Movement that inspires"
  },
  {
    id: 103,
    name: "Subaru",
    industry: "Automotive",
    founded: "1953",
    headquarters: "Tokyo, Japan",
    ceo: "Tomomi Nakamura",
    revenue: "$28.5 billion",
    employees: "36,070",
    colors: "Blue",
    hint: "Confidence in Motion"
  },
  {
    id: 104,
    name: "Jeep",
    industry: "Automotive",
    founded: "1941",
    headquarters: "Auburn Hills, Michigan, USA",
    ceo: "Carlos Tavares",
    revenue: "$32.4 billion",
    employees: "24,000",
    colors: "Green, Black",
    hint: "Go Anywhere, Do Anything"
  },
  {
    id: 105,
    name: "Rivian",
    industry: "Automotive, Electric Vehicles",
    founded: "2009",
    headquarters: "Irvine, California, USA",
    ceo: "RJ Scaringe",
    revenue: "$4.4 billion",
    employees: "14,122",
    colors: "Blue, Green",
    hint: "Keep The World Adventurous Forever"
  },
  {
    id: 106,
    name: "Pfizer",
    industry: "Pharmaceuticals",
    founded: "1849",
    headquarters: "New York City, USA",
    ceo: "Albert Bourla",
    revenue: "$100.3 billion",
    employees: "83,000",
    colors: "Blue, White",
    hint: "Science Will Win"
  },
  {
    id: 107,
    name: "Moderna",
    industry: "Pharmaceuticals, Biotechnology",
    founded: "2010",
    headquarters: "Cambridge, Massachusetts, USA",
    ceo: "Stéphane Bancel",
    revenue: "$19.3 billion",
    employees: "3,900",
    colors: "Red, White",
    hint: "Deliver on the Promise of mRNA Science"
  },
  {
    id: 108,
    name: "Johnson & Johnson",
    industry: "Pharmaceuticals, Medical Devices",
    founded: "1886",
    headquarters: "New Brunswick, New Jersey, USA",
    ceo: "Joaquin Duato",
    revenue: "$82.6 billion",
    employees: "152,700",
    colors: "Red, White",
    hint: "For All You Love"
  },
  {
    id: 109,
    name: "CVS",
    industry: "Pharmacy, Healthcare",
    founded: "1963",
    headquarters: "Woonsocket, Rhode Island, USA",
    ceo: "Karen Lynch",
    revenue: "$357.8 billion",
    employees: "259,500",
    colors: "Red, White",
    hint: "Health is everything"
  },
  {
    id: 110,
    name: "Walgreens",
    industry: "Pharmacy, Healthcare",
    founded: "1901",
    headquarters: "Deerfield, Illinois, USA",
    ceo: "Tim Wentworth",
    revenue: "$132.7 billion",
    employees: "262,500",
    colors: "Red, White, Blue",
    hint: "Trusted since 1901"
  },
  {
    id: 111,
    name: "GSK",
    industry: "Pharmaceuticals",
    founded: "2000",
    headquarters: "Brentford, United Kingdom",
    ceo: "Emma Walmsley",
    revenue: "$36.4 billion",
    employees: "69,000",
    colors: "Orange, Purple",
    hint: "Do more, feel better, live longer"
  },
  {
    id: 112,
    name: "Bayer",
    industry: "Pharmaceuticals, Biotechnology",
    founded: "1863",
    headquarters: "Leverkusen, Germany",
    ceo: "Bill Anderson",
    revenue: "$51.8 billion",
    employees: "101,000",
    colors: "Blue, Green",
    hint: "Science For A Better Life"
  },
  {
    id: 113,
    name: "Roche",
    industry: "Pharmaceuticals, Diagnostics",
    founded: "1896",
    headquarters: "Basel, Switzerland",
    ceo: "Thomas Schinecker",
    revenue: "$68.7 billion",
    employees: "101,000",
    colors: "Blue, White",
    hint: "Doing now what patients need next"
  },
  {
    id: 114,
    name: "Novartis",
    industry: "Pharmaceuticals",
    founded: "1996",
    headquarters: "Basel, Switzerland",
    ceo: "Vasant Narasimhan",
    revenue: "$45.4 billion",
    employees: "71,000",
    colors: "Blue",
    hint: "Reimagining Medicine"
  },
  {
    id: 115,
    name: "Merck",
    industry: "Pharmaceuticals",
    founded: "1891",
    headquarters: "Kenilworth, New Jersey, USA",
    ceo: "Robert Davis",
    revenue: "$59.3 billion",
    employees: "71,000",
    colors: "Green, Blue",
    hint: "Inventing for Life"
  },
  {
    id: 116,
    name: "AstraZeneca",
    industry: "Pharmaceuticals",
    founded: "1999",
    headquarters: "Cambridge, United Kingdom",
    ceo: "Pascal Soriot",
    revenue: "$44.4 billion",
    employees: "83,100",
    colors: "Purple, Yellow",
    hint: "What science can do"
  },
  {
    id: 117,
    name: "Amgen",
    industry: "Pharmaceuticals, Biotechnology",
    founded: "1980",
    headquarters: "Thousand Oaks, California, USA",
    ceo: "Robert Bradway",
    revenue: "$28.2 billion",
    employees: "25,200",
    colors: "Blue, Red",
    hint: "Biology for Humanity"
  },
  {
    id: 118,
    name: "Abbott",
    industry: "Medical Devices, Diagnostics",
    founded: "1888",
    headquarters: "Abbott Park, Illinois, USA",
    ceo: "Robert Ford",
    revenue: "$43.1 billion",
    employees: "115,000",
    colors: "Blue",
    hint: "Life. To the fullest."
  },
  {
    id: 119,
    name: "Eli Lilly",
    industry: "Pharmaceuticals",
    founded: "1876",
    headquarters: "Indianapolis, Indiana, USA",
    ceo: "David Ricks",
    revenue: "$34.1 billion",
    employees: "40,000",
    colors: "Red, Blue",
    hint: "Answers That Matter"
  },
  {
    id: 120,
    name: "Thermo Fisher",
    industry: "Laboratory Equipment",
    founded: "2006",
    headquarters: "Waltham, Massachusetts, USA",
    ceo: "Marc Casper",
    revenue: "$44.9 billion",
    employees: "130,000",
    colors: "Blue, Green",
    hint: "Making the world healthier, cleaner and safer"
  },
  {
    id: 121,
    name: "Chase",
    industry: "Banking",
    founded: "1799",
    headquarters: "New York City, USA",
    ceo: "Jamie Dimon",
    revenue: "$154.8 billion",
    employees: "293,723",
    colors: "Blue",
    hint: "So you can"
  },
  {
    id: 122,
    name: "Bank of America",
    industry: "Banking",
    founded: "1998",
    headquarters: "Charlotte, North Carolina, USA",
    ceo: "Brian Moynihan",
    revenue: "$115.1 billion",
    employees: "216,823",
    colors: "Blue, Red",
    hint: "What would you like the power to do?"
  },
  {
    id: 123,
    name: "Wells Fargo",
    industry: "Banking",
    founded: "1852",
    headquarters: "San Francisco, California, USA",
    ceo: "Charles Scharf",
    revenue: "$82.9 billion",
    employees: "238,000",
    colors: "Red, Yellow",
    hint: "Together we'll go far"
  },
  {
    id: 124,
    name: "Citibank",
    industry: "Banking",
    founded: "1812",
    headquarters: "New York City, USA",
    ceo: "Jane Fraser",
    revenue: "$78.3 billion",
    employees: "240,000",
    colors: "Blue, Red",
    hint: "Citi Never Sleeps"
  },
  {
    id: 125,
    name: "Goldman Sachs",
    industry: "Investment Banking",
    founded: "1869",
    headquarters: "New York City, USA",
    ceo: "David Solomon",
    revenue: "$46.3 billion",
    employees: "45,300",
    colors: "Blue",
    hint: "Progress is everyone's business"
  },
  {
    id: 126,
    name: "Morgan Stanley",
    industry: "Investment Banking",
    founded: "1935",
    headquarters: "New York City, USA",
    ceo: "Ted Pick",
    revenue: "$54.1 billion",
    employees: "80,000",
    colors: "Blue",
    hint: "Capital Creates Change"
  },
  {
    id: 127,
    name: "American Express",
    industry: "Financial Services",
    founded: "1850",
    headquarters: "New York City, USA",
    ceo: "Stephen Squeri",
    revenue: "$52.9 billion",
    employees: "77,300",
    colors: "Blue",
    hint: "Don't Live Life Without It"
  },
  {
    id: 128,
    name: "Capital One",
    industry: "Banking",
    founded: "1994",
    headquarters: "McLean, Virginia, USA",
    ceo: "Richard Fairbank",
    revenue: "$34.3 billion",
    employees: "51,500",
    colors: "Red, Blue",
    hint: "What's in your wallet?"
  },
  {
    id: 129,
    name: "Visa",
    industry: "Financial Services",
    founded: "1958",
    headquarters: "San Francisco, California, USA",
    ceo: "Ryan McInerney",
    revenue: "$29.3 billion",
    employees: "26,500",
    colors: "Blue, Gold",
    hint: "Everywhere You Want To Be"
  },
  {
    id: 130,
    name: "Mastercard",
    industry: "Financial Services",
    founded: "1966",
    headquarters: "Purchase, New York, USA",
    ceo: "Michael Miebach",
    revenue: "$22.2 billion",
    employees: "29,900",
    colors: "Red, Yellow",
    hint: "Priceless"
  },
  {
    id: 131,
    name: "PayPal",
    industry: "Financial Technology",
    founded: "1998",
    headquarters: "San Jose, California, USA",
    ceo: "Alex Chriss",
    revenue: "$29.8 billion",
    employees: "29,900",
    colors: "Blue",
    hint: "The simpler, safer way to pay and get paid"
  },
  {
    id: 132,
    name: "Square",
    industry: "Financial Technology",
    founded: "2009",
    headquarters: "San Francisco, California, USA",
    ceo: "Jack Dorsey",
    revenue: "$17.7 billion",
    employees: "12,000",
    colors: "White, Black",
    hint: "Making Commerce Easy"
  },
  {
    id: 133,
    name: "Stripe",
    industry: "Financial Technology",
    founded: "2010",
    headquarters: "San Francisco, California, USA",
    ceo: "Patrick Collison",
    revenue: "$14 billion",
    employees: "8,000",
    colors: "Blue, White",
    hint: "Payments infrastructure for the internet"
  },
  {
    id: 134,
    name: "Robinhood",
    industry: "Financial Technology",
    founded: "2013",
    headquarters: "Menlo Park, California, USA",
    ceo: "Vlad Tenev",
    revenue: "$1.8 billion",
    employees: "2,500",
    colors: "Green, Black",
    hint: "Investing for Everyone"
  },
  {
    id: 135,
    name: "Venmo",
    industry: "Financial Technology",
    founded: "2009",
    headquarters: "New York City, USA",
    ceo: "Alex Chriss",
    revenue: "$900 million",
    employees: "500",
    colors: "Blue, White",
    hint: "Share payments, split purchases"
  },
  {
    id: 136,
    name: "Delta",
    industry: "Airlines",
    founded: "1925",
    headquarters: "Atlanta, Georgia, USA",
    ceo: "Ed Bastian",
    revenue: "$54.2 billion",
    employees: "95,000",
    colors: "Red, Blue",
    hint: "Keep Climbing"
  },
  {
    id: 137,
    name: "United",
    industry: "Airlines",
    founded: "1926",
    headquarters: "Chicago, Illinois, USA",
    ceo: "Scott Kirby",
    revenue: "$51.4 billion",
    employees: "92,795",
    colors: "Blue, Gold",
    hint: "Fly the Friendly Skies"
  },
  {
    id: 138,
    name: "American Airlines",
    industry: "Airlines",
    founded: "1926",
    headquarters: "Fort Worth, Texas, USA",
    ceo: "Robert Isom",
    revenue: "$52.8 billion",
    employees: "129,700",
    colors: "Red, White, Blue",
    hint: "The World's Greatest Flyers Fly American"
  },
  {
    id: 139,
    name: "Southwest",
    industry: "Airlines",
    founded: "1967",
    headquarters: "Dallas, Texas, USA",
    ceo: "Bob Jordan",
    revenue: "$26.1 billion",
    employees: "66,100",
    colors: "Blue, Red, Yellow",
    hint: "Low fares. Nothing to hide."
  },
  {
    id: 140,
    name: "JetBlue",
    industry: "Airlines",
    founded: "1998",
    headquarters: "Long Island City, New York, USA",
    ceo: "Joanna Geraghty",
    revenue: "$9.4 billion",
    employees: "23,000",
    colors: "Blue",
    hint: "You Above All"
  },
  {
    id: 141,
    name: "Alaska Airlines",
    industry: "Airlines",
    founded: "1932",
    headquarters: "SeaTac, Washington, USA",
    ceo: "Ben Minicucci",
    revenue: "$9.6 billion",
    employees: "22,000",
    colors: "Blue, Green",
    hint: "Fly Smart, Land Happy"
  },
  {
    id: 142,
    name: "Expedia",
    industry: "Travel Technology",
    founded: "1996",
    headquarters: "Seattle, Washington, USA",
    ceo: "Ariane Gorin",
    revenue: "$12.1 billion",
    employees: "16,500",
    colors: "Blue, Yellow",
    hint: "Where You Book Matters"
  },
  {
    id: 143,
    name: "Airbnb",
    industry: "Hospitality, Online Marketplace",
    founded: "2008",
    headquarters: "San Francisco, California, USA",
    ceo: "Brian Chesky",
    revenue: "$8.4 billion",
    employees: "6,800",
    colors: "Coral, White",
    hint: "Belong Anywhere"
  },
  {
    id: 144,
    name: "Booking.com",
    industry: "Travel Technology",
    founded: "1996",
    headquarters: "Amsterdam, Netherlands",
    ceo: "Glenn Fogel",
    revenue: "$17.1 billion",
    employees: "21,600",
    colors: "Blue",
    hint: "Booking.yeah"
  },
  {
    id: 145,
    name: "Hilton",
    industry: "Hospitality",
    founded: "1919",
    headquarters: "McLean, Virginia, USA",
    ceo: "Christopher Nassetta",
    revenue: "$9.8 billion",
    employees: "159,000",
    colors: "Blue",
    hint: "For the Stay"
  },
  {
    id: 146,
    name: "Marriott",
    industry: "Hospitality",
    founded: "1927",
    headquarters: "Bethesda, Maryland, USA",
    ceo: "Anthony Capuano",
    revenue: "$22.3 billion",
    employees: "146,000",
    colors: "Red, Black",
    hint: "Where I Belong"
  },
  {
    id: 147,
    name: "Hyatt",
    industry: "Hospitality",
    founded: "1957",
    headquarters: "Chicago, Illinois, USA",
    ceo: "Mark Hoplamazian",
    revenue: "$5.7 billion",
    employees: "44,000",
    colors: "Blue",
    hint: "We care for people so they can be their best"
  },
  {
    id: 148,
    name: "Carnival",
    industry: "Cruise Line",
    founded: "1972",
    headquarters: "Miami, Florida, USA",
    ceo: "Josh Weinstein",
    revenue: "$20.4 billion",
    employees: "150,000",
    colors: "Red, Blue",
    hint: "Choose Fun"
  },
  {
    id: 149,
    name: "Royal Caribbean",
    industry: "Cruise Line",
    founded: "1968",
    headquarters: "Miami, Florida, USA",
    ceo: "Jason Liberty",
    revenue: "$13.9 billion",
    employees: "85,000",
    colors: "Blue, Gold",
    hint: "Where Extraordinary Happens"
  },
  {
    id: 150,
    name: "Uber",
    industry: "Transportation, Technology",
    founded: "2009",
    headquarters: "San Francisco, California, USA",
    ceo: "Dara Khosrowshahi",
    revenue: "$31.9 billion",
    employees: "32,800",
    colors: "Black, White",
    hint: "Move the Way You Want"
  },
  {
    id: 151,
    name: "Lyft",
    industry: "Transportation, Technology",
    founded: "2012",
    headquarters: "San Francisco, California, USA",
    ceo: "David Risher",
    revenue: "$4.1 billion",
    employees: "4,500",
    colors: "Pink",
    hint: "Ride. Bike. Scoot."
  },
  {
    id: 152,
    name: "Netflix",
    industry: "Streaming Service",
    founded: "1997",
    headquarters: "Los Gatos, California, USA",
    ceo: "Ted Sarandos & Greg Peters",
    revenue: "$33.7 billion",
    employees: "12,800",
    colors: "Red, Black",
    hint: "See What's Next"
  },
  {
    id: 153,
    name: "Hulu",
    industry: "Streaming Service",
    founded: "2007",
    headquarters: "Santa Monica, California, USA",
    ceo: "Joe Earley",
    revenue: "$12.1 billion",
    employees: "3,500",
    colors: "Green",
    hint: "Better Ruins Everything"
  },
  {
    id: 154,
    name: "Disney",
    industry: "Entertainment, Media",
    founded: "1923",
    headquarters: "Burbank, California, USA",
    ceo: "Bob Iger",
    revenue: "$88.9 billion",
    employees: "220,000",
    colors: "Blue, White",
    hint: "The Happiest Place on Earth"
  },
  {
    id: 155,
    name: "Pixar",
    industry: "Animation Studio",
    founded: "1986",
    headquarters: "Emeryville, California, USA",
    ceo: "Pete Docter",
    revenue: "$1.4 billion",
    employees: "1,300",
    colors: "Blue, White, Red",
    hint: "To infinity and beyond!"
  },
  {
    id: 156,
    name: "Marvel",
    industry: "Entertainment, Comics",
    founded: "1939",
    headquarters: "New York City, USA",
    ceo: "Kevin Feige",
    revenue: "$6 billion",
    employees: "1,000",
    colors: "Red, White",
    hint: "Excelsior!"
  },
  {
    id: 157,
    name: "HBO",
    industry: "Television Network",
    founded: "1972",
    headquarters: "New York City, USA",
    ceo: "Casey Bloys",
    revenue: "$8.5 billion",
    employees: "2,500",
    colors: "Black, White",
    hint: "It's Not TV. It's HBO."
  },
  {
    id: 158,
    name: "Max",
    industry: "Streaming Service",
    founded: "2020",
    headquarters: "New York City, USA",
    ceo: "JB Perrette",
    revenue: "$10.8 billion",
    employees: "3,000",
    colors: "Blue, Purple",
    hint: "The One to Watch"
  },
  {
    id: 159,
    name: "Paramount",
    industry: "Entertainment, Media",
    founded: "1912",
    headquarters: "New York City, USA",
    ceo: "Brian Robbins",
    revenue: "$30.1 billion",
    employees: "24,500",
    colors: "Blue",
    hint: "A Mountain of Entertainment"
  },
  {
    id: 160,
    name: "Universal",
    industry: "Entertainment, Media",
    founded: "1912",
    headquarters: "Universal City, California, USA",
    ceo: "Donna Langley",
    revenue: "$9.9 billion",
    employees: "35,000",
    colors: "Blue, White",
    hint: "A Comcast Company"
  },
  {
    id: 161,
    name: "Sony Pictures",
    industry: "Entertainment, Media",
    founded: "1987",
    headquarters: "Culver City, California, USA",
    ceo: "Tony Vinciquerra",
    revenue: "$10.3 billion",
    employees: "5,400",
    colors: "Blue, White",
    hint: "Be Moved"
  },
  {
    id: 162,
    name: "Warner Bros",
    industry: "Entertainment, Media",
    founded: "1923",
    headquarters: "Burbank, California, USA",
    ceo: "David Zaslav",
    revenue: "$10.4 billion",
    employees: "12,500",
    colors: "Blue, Gold",
    hint: "The Shield"
  },
  {
    id: 163,
    name: "DreamWorks",
    industry: "Animation Studio",
    founded: "1994",
    headquarters: "Glendale, California, USA",
    ceo: "Margie Cohn",
    revenue: "$700 million",
    employees: "2,200",
    colors: "Blue",
    hint: "Experience the Wonder"
  },
  {
    id: 164,
    name: "ESPN",
    industry: "Sports Media",
    founded: "1979",
    headquarters: "Bristol, Connecticut, USA",
    ceo: "Jimmy Pitaro",
    revenue: "$12.9 billion",
    employees: "6,500",
    colors: "Red, Black",
    hint: "The Worldwide Leader in Sports"
  },
  {
    id: 165,
    name: "Twitch",
    industry: "Live Streaming",
    founded: "2011",
    headquarters: "San Francisco, California, USA",
    ceo: "Dan Clancy",
    revenue: "$2.6 billion",
    employees: "1,800",
    colors: "Purple",
    hint: "Let's Play"
  },
  {
    id: 166,
    name: "NBC",
    industry: "Television Network",
    founded: "1926",
    headquarters: "New York City, USA",
    ceo: "Jeff Shell",
    revenue: "$10 billion",
    employees: "10,000",
    colors: "Purple, Yellow, Green, Blue, Orange, Red",
    hint: "More Colorful"
  },
  {
    id: 167,
    name: "CNN",
    industry: "News Media",
    founded: "1980",
    headquarters: "Atlanta, Georgia, USA",
    ceo: "Mark Thompson",
    revenue: "$3.5 billion",
    employees: "4,000",
    colors: "Red, White",
    hint: "Facts First"
  },
  {
    id: 168,
    name: "BBC",
    industry: "Public Broadcasting",
    founded: "1922",
    headquarters: "London, UK",
    ceo: "Tim Davie",
    revenue: "$5.9 billion",
    employees: "22,000",
    colors: "Black, White",
    hint: "Nation Shall Speak Peace Unto Nation"
  },
  {
    id: 169,
    name: "Nike",
    industry: "Apparel, Footwear",
    founded: "1964",
    headquarters: "Beaverton, Oregon, USA",
    ceo: "John Donahoe",
    revenue: "$51.2 billion",
    employees: "79,100",
    colors: "Black, White",
    hint: "Just Do It"
  },
  {
    id: 170,
    name: "Adidas",
    industry: "Apparel, Footwear",
    founded: "1949",
    headquarters: "Herzogenaurach, Germany",
    ceo: "Bjørn Gulden",
    revenue: "$22.5 billion",
    employees: "59,258",
    colors: "Black, White",
    hint: "Impossible Is Nothing"
  },
  {
    id: 171,
    name: "Puma",
    industry: "Apparel, Footwear",
    founded: "1948",
    headquarters: "Herzogenaurach, Germany",
    ceo: "Arne Freundt",
    revenue: "$8.6 billion",
    employees: "16,000",
    colors: "Red, White",
    hint: "Forever Faster"
  },
  {
    id: 172,
    name: "Reebok",
    industry: "Apparel, Footwear",
    founded: "1958",
    headquarters: "Boston, Massachusetts, USA",
    ceo: "Todd Krinsky",
    revenue: "$1.8 billion",
    employees: "7,000",
    colors: "Red, White",
    hint: "Life is Not a Spectator Sport"
  },
  {
    id: 173,
    name: "Under Armour",
    industry: "Apparel, Footwear",
    founded: "1996",
    headquarters: "Baltimore, Maryland, USA",
    ceo: "Kevin Plank",
    revenue: "$5.7 billion",
    employees: "16,000",
    colors: "Black, Red",
    hint: "I Will"
  },
  {
    id: 174,
    name: "Patagonia",
    industry: "Outdoor Apparel",
    founded: "1973",
    headquarters: "Ventura, California, USA",
    ceo: "Ryan Gellert",
    revenue: "$1.5 billion",
    employees: "2,300",
    colors: "Blue",
    hint: "We're in business to save our home planet"
  },
  {
    id: 175,
    name: "Columbia",
    industry: "Outdoor Apparel",
    founded: "1938",
    headquarters: "Portland, Oregon, USA",
    ceo: "Tim Boyle",
    revenue: "$3.5 billion",
    employees: "9,000",
    colors: "Blue, Red",
    hint: "Tested Tough"
  },
  {
    id: 176,
    name: "The North Face",
    industry: "Outdoor Apparel",
    founded: "1966",
    headquarters: "Denver, Colorado, USA",
    ceo: "Steve Rendle",
    revenue: "$3.3 billion",
    employees: "5,000",
    colors: "Black, White, Red",
    hint: "Never Stop Exploring"
  },
  {
    id: 177,
    name: "Vans",
    industry: "Footwear, Apparel",
    founded: "1966",
    headquarters: "Costa Mesa, California, USA",
    ceo: "Kevin Bailey",
    revenue: "$4 billion",
    employees: "12,000",
    colors: "Black, White, Red",
    hint: "Off The Wall"
  },
  {
    id: 178,
    name: "Converse",
    industry: "Footwear, Apparel",
    founded: "1908",
    headquarters: "Boston, Massachusetts, USA",
    ceo: "Scott Uzzell",
    revenue: "$2.3 billion",
    employees: "3,500",
    colors: "Black, White",
    hint: "Shoes are boring. Wear sneakers."
  },
  {
    id: 179,
    name: "Levi's",
    industry: "Apparel",
    founded: "1853",
    headquarters: "San Francisco, California, USA",
    ceo: "Michelle Gass",
    revenue: "$6.2 billion",
    employees: "15,100",
    colors: "Red",
    hint: "Quality never goes out of style"
  },
  {
    id: 180,
    name: "Lululemon",
    industry: "Athletic Apparel",
    founded: "1998",
    headquarters: "Vancouver, Canada",
    ceo: "Calvin McDonald",
    revenue: "$8.1 billion",
    employees: "29,000",
    colors: "Red",
    hint: "Sweat once a day"
  },
  {
    id: 181,
    name: "Gymshark",
    industry: "Athletic Apparel",
    founded: "2012",
    headquarters: "Solihull, UK",
    ceo: "Ben Francis",
    revenue: "$700 million",
    employees: "900",
    colors: "Black, White",
    hint: "United We Sweat"
  },
  {
    id: 182,
    name: "New Balance",
    industry: "Footwear, Apparel",
    founded: "1906",
    headquarters: "Boston, Massachusetts, USA",
    ceo: "Joe Preston",
    revenue: "$5.3 billion",
    employees: "10,500",
    colors: "Gray, Red",
    hint: "Fearlessly Independent Since 1906"
  },
  {
    id: 183,
    name: "Crocs",
    industry: "Footwear",
    founded: "2002",
    headquarters: "Broomfield, Colorado, USA",
    ceo: "Andrew Rees",
    revenue: "$3.6 billion",
    employees: "6,000",
    colors: "Green",
    hint: "Come As You Are"
  },
  {
    id: 184,
    name: "FedEx",
    industry: "Logistics",
    founded: "1971",
    headquarters: "Memphis, Tennessee, USA",
    ceo: "Raj Subramaniam",
    revenue: "$90.2 billion",
    employees: "547,000",
    colors: "Purple, Orange",
    hint: "The World On Time"
  },
  {
    id: 185,
    name: "UPS",
    industry: "Logistics",
    founded: "1907",
    headquarters: "Atlanta, Georgia, USA",
    ceo: "Carol Tomé",
    revenue: "$100.3 billion",
    employees: "500,000",
    colors: "Brown, Gold",
    hint: "What can Brown do for you?"
  },
  {
    id: 186,
    name: "USPS",
    industry: "Postal Service",
    founded: "1775",
    headquarters: "Washington, D.C., USA",
    ceo: "Louis DeJoy",
    revenue: "$78.2 billion",
    employees: "516,000",
    colors: "Blue, White, Red",
    hint: "Neither snow nor rain nor heat nor gloom of night"
  },
  {
    id: 187,
    name: "3M",
    industry: "Conglomerate",
    founded: "1902",
    headquarters: "Saint Paul, Minnesota, USA",
    ceo: "Michael Roman",
    revenue: "$32.7 billion",
    employees: "93,000",
    colors: "Red",
    hint: "Science. Applied to Life."
  },
  {
    id: 188,
    name: "GE",
    industry: "Conglomerate",
    founded: "1892",
    headquarters: "Boston, Massachusetts, USA",
    ceo: "H. Lawrence Culp Jr.",
    revenue: "$76.6 billion",
    employees: "168,000",
    colors: "Blue",
    hint: "Imagination at work"
  },
  {
    id: 189,
    name: "BP",
    industry: "Oil and Gas",
    founded: "1909",
    headquarters: "London, UK",
    ceo: "Murray Auchincloss",
    revenue: "$248.9 billion",
    employees: "65,900",
    colors: "Green, Yellow",
    hint: "Beyond Petroleum"
  },
  {
    id: 190,
    name: "Shell",
    industry: "Oil and Gas",
    founded: "1907",
    headquarters: "London, UK",
    ceo: "Wael Sawan",
    revenue: "$381.3 billion",
    employees: "93,000",
    colors: "Red, Yellow",
    hint: "Powering Progress Together"
  },
  {
    id: 191,
    name: "ExxonMobil",
    industry: "Oil and Gas",
    founded: "1870",
    headquarters: "Irving, Texas, USA",
    ceo: "Darren Woods",
    revenue: "$413.7 billion",
    employees: "62,000",
    colors: "Red, Blue",
    hint: "Taking on the world's toughest energy challenges"
  },
  {
    id: 192,
    name: "DuPont",
    industry: "Chemicals",
    founded: "1802",
    headquarters: "Wilmington, Delaware, USA",
    ceo: "Ed Breen",
    revenue: "$13 billion",
    employees: "23,000",
    colors: "Red",
    hint: "The miracles of science"
  },
  {
    id: 193,
    name: "Siemens",
    industry: "Conglomerate",
    founded: "1847",
    headquarters: "Munich, Germany",
    ceo: "Roland Busch",
    revenue: "$77.8 billion",
    employees: "311,000",
    colors: "Teal",
    hint: "Ingenuity for life"
  },
  {
    id: 194,
    name: "Alibaba",
    industry: "E-commerce, Technology",
    founded: "1999",
    headquarters: "Hangzhou, China",
    ceo: "Eddie Wu",
    revenue: "$126.5 billion",
    employees: "235,216",
    colors: "Orange",
    hint: "To make it easy to do business anywhere"
  },
  {
    id: 195,
    name: "Tencent",
    industry: "Technology, Entertainment",
    founded: "1998",
    headquarters: "Shenzhen, China",
    ceo: "Ma Huateng",
    revenue: "$87.9 billion",
    employees: "112,771",
    colors: "Green",
    hint: "Tech for Social Good"
  },
  {
    id: 196,
    name: "ByteDance",
    industry: "Technology, Social Media",
    founded: "2012",
    headquarters: "Beijing, China",
    ceo: "Liang Rubo",
    revenue: "$80 billion",
    employees: "110,000",
    colors: "Green, Blue",
    hint: "Inspire Creativity, Enrich Life"
  },
  {
    id: 197,
    name: "OpenAI",
    industry: "Artificial Intelligence",
    founded: "2015",
    headquarters: "San Francisco, California, USA",
    ceo: "Sam Altman",
    revenue: "$2 billion",
    employees: "1,500",
    colors: "Black, White",
    hint: "AI for the benefit of humanity"
  },
  {
    id: 198,
    name: "LinkedIn",
    industry: "Professional Social Network",
    founded: "2002",
    headquarters: "Sunnyvale, California, USA",
    ceo: "Ryan Roslansky",
    revenue: "$13.8 billion",
    employees: "20,500",
    colors: "Blue, White",
    hint: "Relationships Matter"
  },
  {
    id: 199,
    name: "Pinterest",
    industry: "Social Media",
    founded: "2010",
    headquarters: "San Francisco, California, USA",
    ceo: "Bill Ready",
    revenue: "$2.8 billion",
    employees: "3,100",
    colors: "Red, White",
    hint: "When it comes to a great idea, you know it when you see it"
  },
  {
    id: 200,
    name: "Instagram",
    industry: "Social Media",
    founded: "2010",
    headquarters: "Menlo Park, California, USA",
    ceo: "Adam Mosseri",
    revenue: "$32 billion",
    employees: "7,000",
    colors: "Purple, Pink, Orange, Yellow",
    hint: "Capture and Share the World's Moments"
  }
];

