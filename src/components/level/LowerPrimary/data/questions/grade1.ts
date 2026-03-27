
import type { SubjectId, Question } from "../../types";

const grade1: Record<SubjectId, Question[]> = {
  literacy: [
    { q: "Which letter comes after 'B' in the alphabet?", opts: ["A", "C", "D", "E"], ans: 1 },
    { q: "How many vowels are in the word 'APPLE'?", opts: ["1", "2", "3", "4"], ans: 1 },
    { q: "Which word rhymes with 'CAT'?", opts: ["Dog", "Bat", "Cup", "Hen"], ans: 1 },
    { q: "What is the first letter of the word 'ELEPHANT'?", opts: ["A", "E", "I", "O"], ans: 1 },
    { q: "How many letters are in the word 'SUN'?", opts: ["2", "3", "4", "5"], ans: 1 },
    { q: "Which word is a NAME of a person?", opts: ["Run", "John", "Blue", "Big"], ans: 1 },
    { q: "A word that describes something is called:", opts: ["Noun", "Verb", "Adjective", "Pronoun"], ans: 2 },
  ],
  kiswahili: [
    { q: "Jibu kwa Kiswahili: Habari za asubuhi?", opts: ["Nzuri sana", "Kwaheri", "Asante", "Karibu"], ans: 0 },
    { q: "Neno 'MAJI' linamaanisha nini?", opts: ["Fire", "Water", "Earth", "Wind"], ans: 1 },
    { q: "Jinsi ya kusema '3' kwa Kiswahili:", opts: ["Moja", "Mbili", "Tatu", "Nne"], ans: 2 },
    { q: "Neno 'NYUMBA' linamaanisha:", opts: ["School", "House", "Tree", "Road"], ans: 1 },
    { q: "Maneno ya kuaga ni:", opts: ["Habari", "Karibu", "Kwaheri", "Asante"], ans: 2 },
    { q: "Tarakimu 'MOJA' ni sawa na:", opts: ["1", "2", "3", "4"], ans: 0 },
    { q: "'RAFIKI' kwa Kiingereza ni:", opts: ["Enemy", "Teacher", "Friend", "Brother"], ans: 2 },
  ],
  english: [
    { q: "Which sentence is correct?", opts: ["I goes to school.", "She go home.", "He runs fast.", "They runs slowly."], ans: 2 },
    { q: "Choose the opposite of 'hot':", opts: ["Warm", "Cold", "Soft", "Hard"], ans: 1 },
    { q: "How do you greet someone in the morning?", opts: ["Good night", "Good morning", "Good evening", "Goodbye"], ans: 1 },
    { q: "Which word means MORE than one cat?", opts: ["Cat", "Cates", "Cats", "Cating"], ans: 2 },
    { q: "Fill in: The dog ___ in the garden.", opts: ["play", "plays", "played", "playing"], ans: 1 },
    { q: "Which word describes colour?", opts: ["Run", "Jump", "Red", "Eat"], ans: 2 },
    { q: "A 'noun' is:", opts: ["An action word", "A name of a person, place or thing", "A describing word", "A joining word"], ans: 1 },
  ],
  mathematics: [
    { q: "What is 3 + 4?", opts: ["5", "6", "7", "8"], ans: 2 },
    { q: "How many sides does a triangle have?", opts: ["2", "3", "4", "5"], ans: 1 },
    { q: "What comes after 9?", opts: ["8", "10", "11", "7"], ans: 1 },
    { q: "If you have 5 sweets and eat 2, how many remain?", opts: ["2", "3", "4", "5"], ans: 1 },
    { q: "Which number is the BIGGEST?", opts: ["3", "7", "5", "2"], ans: 1 },
    { q: "What is 2 × 2?", opts: ["2", "3", "4", "6"], ans: 2 },
    { q: "How many legs does a cow have?", opts: ["2", "4", "6", "8"], ans: 1 },
  ],
  environmental: [
    { q: "Which of these is a source of light?", opts: ["Stone", "The Sun", "Water", "Soil"], ans: 1 },
    { q: "What do plants need to grow?", opts: ["Stones and darkness", "Sunlight, water, and soil", "Only water", "Sand only"], ans: 1 },
    { q: "Which animal lives in water?", opts: ["Cat", "Dog", "Fish", "Hen"], ans: 2 },
    { q: "What do we breathe to stay alive?", opts: ["Water", "Food", "Air", "Soil"], ans: 2 },
    { q: "Which of these is a WILD animal?", opts: ["Cow", "Goat", "Lion", "Sheep"], ans: 2 },
    { q: "How many days are in a week?", opts: ["5", "6", "7", "8"], ans: 2 },
    { q: "The sun rises in the:", opts: ["West", "North", "East", "South"], ans: 2 },
  ],
  hygiene: [
    { q: "How often should you brush your teeth?", opts: ["Once a week", "Once a month", "Twice a day", "Never"], ans: 2 },
    { q: "What should you do after visiting the toilet?", opts: ["Go play immediately", "Wash your hands with soap", "Touch food directly", "Wipe on clothes"], ans: 1 },
    { q: "Which drink is best for staying healthy?", opts: ["Juice only", "Soda only", "Clean water", "Milk with sugar"], ans: 2 },
    { q: "To stay clean you must:", opts: ["Avoid bathing", "Bathe regularly", "Wear dirty clothes", "Skip meals"], ans: 1 },
    { q: "Which food gives us energy?", opts: ["Stones", "Ugali (maize)", "Plastic", "Paper"], ans: 1 },
    { q: "What protects us from mosquito bites at night?", opts: ["A blanket", "A mosquito net", "A hat", "Curtains"], ans: 1 },
    { q: "Proteins are found in:", opts: ["Sugar and sweets", "Beans and meat", "Oil and butter", "Rice and bread"], ans: 1 },
  ],
  religious: [
    { q: "In the Bible, who created the world?", opts: ["Adam", "Moses", "God", "Noah"], ans: 2 },
    { q: "The holy book for Christians is called:", opts: ["Quran", "Bible", "Torah", "Gita"], ans: 1 },
    { q: "What does it mean to be kind?", opts: ["Hitting others", "Being selfish", "Sharing and caring", "Ignoring people"], ans: 2 },
    { q: "The holy book for Muslims is called:", opts: ["Bible", "Quran", "Torah", "Gita"], ans: 1 },
    { q: "Honesty means:", opts: ["Telling lies", "Stealing", "Telling the truth", "Cheating"], ans: 2 },
    { q: "Praying means:", opts: ["Playing games", "Talking to God", "Eating food", "Sleeping"], ans: 1 },
    { q: "We should treat others:", opts: ["Badly", "The way we want to be treated", "With anger", "With jealousy"], ans: 1 },
  ],
  movement: [
    { q: "Mixing red and yellow makes:", opts: ["Green", "Blue", "Orange", "Purple"], ans: 2 },
    { q: "Which is a musical instrument?", opts: ["Paintbrush", "Drum", "Pencil", "Ruler"], ans: 1 },
    { q: "What body part do we use most when kicking a ball?", opts: ["Hands", "Head", "Foot", "Elbow"], ans: 2 },
    { q: "Running and jumping are forms of:", opts: ["Art", "Music", "Physical exercise", "Reading"], ans: 2 },
    { q: "A picture drawn with pencil is called:", opts: ["A painting", "A drawing", "A sculpture", "A song"], ans: 1 },
    { q: "The colour of the sky on a clear day is:", opts: ["Red", "Green", "Blue", "Yellow"], ans: 2 },
    { q: "Singing uses your:", opts: ["Feet", "Hands", "Voice", "Eyes"], ans: 2 },
  ],
};

export default grade1;