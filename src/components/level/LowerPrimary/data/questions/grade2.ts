
import type { SubjectId, Question } from "../../types";

const grade2: Record<SubjectId, Question[]> = {
    literacy: [
        { q: "What is a 'sentence'?", opts: ["A single letter", "A group of words that makes complete sense", "Just two words", "A letter of the alphabet"], ans: 1 },
        { q: "Which punctuation mark ends a question?", opts: ["Full stop (.)", "Question mark (?)", "Comma (,)", "Exclamation mark (!)"], ans: 1 },
        { q: "What is the plural of 'child'?", opts: ["Childs", "Childrens", "Children", "Child's"], ans: 2 },
        { q: "Choose the correct spelling:", opts: ["Freind", "Friend", "Frend", "Friand"], ans: 1 },
        { q: "What type of writing tells a story?", opts: ["A recipe", "A poem", "Narrative writing", "A list"], ans: 2 },
        { q: "Adjective in 'The big dog runs fast':", opts: ["Dog", "Runs", "Big", "Fast"], ans: 2 },
        { q: "A 'syllable' is:", opts: ["A full sentence", "A part of a word with one vowel sound", "A punctuation mark", "A paragraph"], ans: 1 },
    ],
    kiswahili: [
        { q: "Neno 'DAKTARI' linamaanisha:", opts: ["Teacher", "Doctor", "Farmer", "Driver"], ans: 1 },
        { q: "Sentensi sahihi ni:", opts: ["Mtoto anasoma kitabu.", "Mtoto inasoma kitabu.", "Mtoto nasoma kitabu.", "Mtoto unasoma kitabu."], ans: 0 },
        { q: "'HARAKA' inamaanisha:", opts: ["Slowly", "Loudly", "Quickly", "Quietly"], ans: 2 },
        { q: "Neno la kukubaliana ni:", opts: ["La, hapana", "Ndiyo", "Sijui", "Labda"], ans: 1 },
        { q: "Mwanafunzi anasomea wapi?", opts: ["Hospitali", "Sokoni", "Shuleni", "Nyumbani"], ans: 2 },
        { q: "Tarakimu 'KUMI' ni sawa na:", opts: ["5", "8", "10", "12"], ans: 2 },
        { q: "Wingi wa 'NYUMBA' ni:", opts: ["Nyumba", "Nyumbas", "Nyumba nyingi", "Manyumba"], ans: 3 },
    ],
    english: [
        { q: "VERB in 'The bird sings sweetly':", opts: ["Bird", "Sings", "Sweetly", "The"], ans: 1 },
        { q: "Correct sentence:", opts: ["They was happy.", "She were sad.", "He is tall.", "We is running."], ans: 2 },
        { q: "'Enormous' means:", opts: ["Very tiny", "Very huge", "Very fast", "Very slow"], ans: 1 },
        { q: "Prefix 'un-' in 'unhappy' means:", opts: ["Very", "Again", "Not", "Before"], ans: 2 },
        { q: "Past tense sentence:", opts: ["I eat lunch.", "She runs home.", "They played football.", "He jumps high."], ans: 2 },
        { q: "Synonym for 'happy':", opts: ["Sad", "Angry", "Joyful", "Tired"], ans: 2 },
        { q: "A paragraph must have at least:", opts: ["1 sentence", "2 sentences", "3 sentences", "10 sentences"], ans: 2 },
    ],
    mathematics: [
        { q: "What is 15 + 27?", opts: ["40", "41", "42", "43"], ans: 2 },
        { q: "What is 50 − 23?", opts: ["25", "26", "27", "28"], ans: 2 },
        { q: "Which shape has 4 equal sides?", opts: ["Rectangle", "Triangle", "Square", "Circle"], ans: 2 },
        { q: "What is 6 × 4?", opts: ["20", "22", "24", "26"], ans: 2 },
        { q: "Half of 20 is:", opts: ["5", "8", "10", "15"], ans: 2 },
        { q: "In 345, what is the value of digit 4?", opts: ["4", "40", "400", "4000"], ans: 1 },
        { q: "100 − 38 =", opts: ["52", "62", "72", "42"], ans: 1 },
    ],
    environmental: [
        { q: "Three states of matter:", opts: ["Hot, warm, cold", "Solid, liquid, gas", "Hard, soft, fluffy", "Rock, wood, metal"], ans: 1 },
        { q: "Which planet do we live on?", opts: ["Mars", "Venus", "Earth", "Jupiter"], ans: 2 },
        { q: "What causes day and night?", opts: ["Moon spinning", "Earth rotating", "Clouds moving", "Wind blowing"], ans: 1 },
        { q: "A renewable energy source:", opts: ["Coal", "Petrol", "Solar energy", "Gas"], ans: 2 },
        { q: "Largest land animal:", opts: ["Giraffe", "Elephant", "Hippo", "Rhino"], ans: 1 },
        { q: "Deforestation means:", opts: ["Planting more trees", "Cutting down forests", "Protecting wildlife", "Building schools"], ans: 1 },
        { q: "The sun rises from the:", opts: ["West", "North", "East", "South"], ans: 2 },
    ],
    hygiene: [
        { q: "Vitamin we get from sunlight:", opts: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"], ans: 3 },
        { q: "Illness spread by mosquitoes:", opts: ["Cholera", "Typhoid", "Malaria", "Flu"], ans: 2 },
        { q: "Balanced diet means eating:", opts: ["Only vegetables", "Only meat", "Foods from all food groups", "Only starchy foods"], ans: 2 },
        { q: "To prevent tooth decay, avoid too much:", opts: ["Water", "Vegetables", "Sugar", "Fruit"], ans: 2 },
        { q: "Exercise is important because it:", opts: ["Makes you tired only", "Keeps the body fit and strong", "Makes you sleep all day", "Makes you hungry"], ans: 1 },
        { q: "Iron-rich food helps our body:", opts: ["See better", "Make strong blood", "Grow taller", "Run faster"], ans: 1 },
        { q: "Safe food should be:", opts: ["Left uncovered", "Stored properly and clean", "Eaten after many days", "Shared without washing hands"], ans: 1 },
    ],
    religious: [
        { q: "Moses led the Israelites out of:", opts: ["Egypt", "Israel", "Jordan", "Babylon"], ans: 0 },
        { q: "Five Pillars of Islam include:", opts: ["Prayer (Salah)", "Singing", "Dancing", "Painting"], ans: 0 },
        { q: "Ubuntu means:", opts: ["Selfishness", "I am because we are (togetherness)", "Laziness", "Greed"], ans: 1 },
        { q: "Birth of Jesus is celebrated on:", opts: ["Easter", "Eid", "Christmas", "Diwali"], ans: 2 },
        { q: "Respecting elders is an example of:", opts: ["Bad behaviour", "Good values", "Laziness", "Dishonesty"], ans: 1 },
        { q: "Zakat in Islam means:", opts: ["Prayer", "Fasting", "Giving to the poor", "Pilgrimage"], ans: 2 },
        { q: "The Sabbath is observed on:", opts: ["Monday", "Friday", "Saturday/Sunday", "Wednesday"], ans: 2 },
    ],
    movement: [
        { q: "Primary colours are:", opts: ["Red, green, blue", "Red, yellow, blue", "Orange, green, purple", "Black, white, grey"], ans: 1 },
        { q: "Athletics includes:", opts: ["Swimming only", "Running, jumping, throwing", "Singing and dancing", "Drawing and painting"], ans: 1 },
        { q: "Melody in music is:", opts: ["A rhythm pattern", "A sequence of musical notes", "A type of dance", "A musical instrument"], ans: 1 },
        { q: "Teamwork in games means:", opts: ["Playing alone", "Cheating to win", "Working together with others", "Ignoring teammates"], ans: 2 },
        { q: "Movement to music is called:", opts: ["Painting", "Dancing", "Drawing", "Sculpting"], ans: 1 },
        { q: "Crayon art technique uses:", opts: ["Watercolour", "Oil painting", "Wax crayons on paper", "Clay"], ans: 2 },
        { q: "The colour wheel shows how colours:", opts: ["Are named", "Relate to each other", "Are made from light", "Are used in cooking"], ans: 1 },
    ],
};

export default grade2;