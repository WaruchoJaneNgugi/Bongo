import type {Question} from '../types';

export const getQuestions = (className: string, term: string, subject: string): Question[] => {
  const allQuestions: Record<string, Omit<Question, 'subject' | 'className' | 'term'>[]> = {
    'Mathematics': [
      { id: 1, topic: "Multiplication", question: "What is 8 × 9?", options: ["72", "64", "81", "56"], correctAnswer: "72", explanation: "Multiplication is repeated addition. 8 times 9 equals 72." },
      { id: 2, topic: "Geometry", question: "How many sides does a hexagon have?", options: ["5", "6", "7", "8"], correctAnswer: "6", explanation: "A hexagon is a polygon with 6 sides." },
      { id: 3, topic: "Fractions", question: "What is 1/2 of 50?", options: ["20", "25", "30", "15"], correctAnswer: "25", explanation: "Half of 50 is 25." },
      { id: 4, topic: "Algebra", question: "If x + 5 = 12, what is x?", options: ["5", "6", "7", "8"], correctAnswer: "7", explanation: "Subtract 5 from both sides: 12 - 5 = 7." },
      { id: 5, topic: "Percentages", question: "What is 10% of 200?", options: ["10", "20", "30", "40"], correctAnswer: "20", explanation: "10% is 1/10th. 200 divided by 10 is 20." }
    ],
    'English': [
      { id: 101, topic: "Grammar", question: "Which of the following is a noun?", options: ["Run", "Quickly", "Beautiful", "Elephant"], correctAnswer: "Elephant", explanation: "A noun is a person, place, thing, or idea. 'Elephant' is a thing." },
      { id: 102, topic: "Punctuation", question: "Which punctuation mark ends a question?", options: ["Period (.)", "Comma (,)", "Question Mark (?)", "Exclamation Mark (!)"], correctAnswer: "Question Mark (?)", explanation: "A question mark is used at the end of an interrogative sentence." },
      { id: 103, topic: "Vocabulary", question: "What is a synonym for 'happy'?", options: ["Sad", "Angry", "Joyful", "Tired"], correctAnswer: "Joyful", explanation: "Synonyms are words with similar meanings. 'Joyful' means feeling or expressing great happiness." },
      { id: 104, topic: "Verbs", question: "Identify the verb: 'The cat slept on the mat.'", options: ["cat", "slept", "on", "mat"], correctAnswer: "slept", explanation: "A verb is an action word. 'Slept' is the action the cat performed." },
      { id: 105, topic: "Adjectives", question: "Which word describes a noun?", options: ["Verb", "Adverb", "Adjective", "Preposition"], correctAnswer: "Adjective", explanation: "An adjective modifies or describes a noun." }
    ],
    'Science': [
      { id: 201, topic: "Biology", question: "What do plants need for photosynthesis?", options: ["Oxygen", "Sunlight", "Soil", "Wind"], correctAnswer: "Sunlight", explanation: "Plants use sunlight, water, and carbon dioxide to create their own food through photosynthesis." },
      { id: 202, topic: "Physics", question: "What force pulls objects toward the center of the Earth?", options: ["Magnetism", "Friction", "Gravity", "Inertia"], correctAnswer: "Gravity", explanation: "Gravity is the force that attracts a body toward the center of the earth." },
      { id: 203, topic: "Chemistry", question: "What is the chemical symbol for water?", options: ["H2O", "CO2", "O2", "NaCl"], correctAnswer: "H2O", explanation: "Water is composed of two hydrogen atoms and one oxygen atom." },
      { id: 204, topic: "Earth Science", question: "Which planet is closest to the Sun?", options: ["Venus", "Mars", "Mercury", "Earth"], correctAnswer: "Mercury", explanation: "Mercury is the first planet from the Sun in our solar system." },
      { id: 205, topic: "Biology", question: "What is the powerhouse of the cell?", options: ["Nucleus", "Ribosome", "Mitochondria", "Chloroplast"], correctAnswer: "Mitochondria", explanation: "Mitochondria generate most of the chemical energy needed to power the cell's biochemical reactions." }
    ],
    'Social Studies': [
      { id: 301, topic: "Geography", question: "How many continents are there on Earth?", options: ["5", "6", "7", "8"], correctAnswer: "7", explanation: "There are 7 continents: Africa, Antarctica, Asia, Europe, North America, Australia, and South America." },
      { id: 302, topic: "History", question: "Who was the first President of the United States?", options: ["Abraham Lincoln", "George Washington", "Thomas Jefferson", "John Adams"], correctAnswer: "George Washington", explanation: "George Washington served as the first president of the United States from 1789 to 1797." },
      { id: 303, topic: "Civics", question: "What are the three branches of the US government?", options: ["Executive, Legislative, Judicial", "Local, State, Federal", "Army, Navy, Air Force", "President, Senate, House"], correctAnswer: "Executive, Legislative, Judicial", explanation: "The US government is divided into three branches to ensure a separation of powers." },
      { id: 304, topic: "Geography", question: "Which is the largest ocean on Earth?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], correctAnswer: "Pacific", explanation: "The Pacific Ocean is the largest and deepest of Earth's oceanic divisions." },
      { id: 305, topic: "Economics", question: "What is the term for the exchange of goods and services?", options: ["Trade", "Taxation", "Inflation", "Monopoly"], correctAnswer: "Trade", explanation: "Trade involves the transfer of goods or services from one person or entity to another." }
    ],
    'CRE': [
      { id: 401, topic: "Old Testament", question: "Who built the ark?", options: ["Moses", "Abraham", "Noah", "David"], correctAnswer: "Noah", explanation: "According to the Bible, Noah built the ark to save his family and animals from the great flood." },
      { id: 402, topic: "New Testament", question: "Where was Jesus born?", options: ["Jerusalem", "Nazareth", "Bethlehem", "Jericho"], correctAnswer: "Bethlehem", explanation: "The Gospels of Matthew and Luke state that Jesus was born in Bethlehem." },
      { id: 403, topic: "Commandments", question: "How many commandments did God give to Moses?", options: ["5", "10", "12", "7"], correctAnswer: "10", explanation: "God gave Moses the Ten Commandments on Mount Sinai." },
      { id: 404, topic: "Parables", question: "In the parable of the Good Samaritan, who helped the injured man?", options: ["A Priest", "A Levite", "A Samaritan", "A Roman Soldier"], correctAnswer: "A Samaritan", explanation: "Despite historical enmity, it was the Samaritan who stopped to help the injured man." },
      { id: 405, topic: "Disciples", question: "Who betrayed Jesus?", options: ["Peter", "John", "Judas Iscariot", "Thomas"], correctAnswer: "Judas Iscariot", explanation: "Judas Iscariot is known for the kiss and betrayal of Jesus to the Sanhedrin for thirty pieces of silver." }
    ]
  };

  const subjectQuestions = allQuestions[subject] || allQuestions['Mathematics'];

  return subjectQuestions.map(q => ({
    ...q,
    subject,
    className,
    term
  }));
};
