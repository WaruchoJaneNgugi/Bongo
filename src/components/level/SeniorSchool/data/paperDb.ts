import type { ExamData } from '../types/school';

export const EXAM_DATA: ExamData = {
  "10": {
    "TERM 1": [
      {
        name: "Mathematics",
        questions: [
          { id: 101, text: "Solve for x: 2x + 15 = 35", options: { A: "5", B: "10", C: "15", D: "20" }, correctAnswer: "B" },
          { id: 102, text: "What is the square root of 144?", options: { A: "10", B: "11", C: "12", D: "14" }, correctAnswer: "C" },
          { id: 103, text: "What is the value of 5 cubed (5³)?", options: { A: "15", B: "25", C: "125", D: "625" }, correctAnswer: "C" },
          { id: 104, text: "A triangle has angles 90° and 45°. What is the third angle?", options: { A: "35°", B: "45°", C: "55°", D: "90°" }, correctAnswer: "B" },
          { id: 105, text: "Which of these is a prime number?", options: { A: "4", B: "9", C: "11", D: "15" }, correctAnswer: "C" },
          { id: 106, text: "Simplify: 10 + 5 × 2", options: { A: "30", B: "20", C: "25", D: "15" }, correctAnswer: "B" }
        ]
      },
      {
        name: "Physics",
        questions: [
          { id: 401, text: "What is the SI unit of Force?", options: { A: "Joule", B: "Watt", C: "Newton", D: "Pascal" }, correctAnswer: "C" },
          { id: 402, text: "Which state of matter has a definite shape and volume?", options: { A: "Solid", B: "Liquid", C: "Gas", D: "Plasma" }, correctAnswer: "A" },
          { id: 403, text: "What is the process of a liquid turning into a gas at its boiling point?", options: { A: "Freezing", B: "Condensation", C: "Evaporation", D: "Boiling" }, correctAnswer: "D" },
          { id: 404, text: "Which instrument is used to measure atmospheric pressure?", options: { A: "Thermometer", B: "Barometer", C: "Anemometer", D: "Hygrometer" }, correctAnswer: "B" },
          { id: 405, text: "Light travels in a ______ line.", options: { A: "Curved", B: "Zigzag", C: "Straight", D: "Circular" }, correctAnswer: "C" },
          { id: 406, text: "Which of these is a good conductor of electricity?", options: { A: "Plastic", B: "Wood", C: "Copper", D: "Glass" }, correctAnswer: "C" }
        ]
      },
      {
        name: "English",
        questions: [
          { id: 201, text: "Which of the following is a synonym for 'benevolent'?", options: { A: "Cruel", B: "Kind", C: "Lazy", D: "Angry" }, correctAnswer: "B" },
          { id: 202, text: "Identify the noun in this sentence: 'The dog barked loudly.'", options: { A: "barked", B: "loudly", C: "The", D: "dog" }, correctAnswer: "D" },
          { id: 203, text: "Which sentence is grammatically correct?", options: { A: "She don't like apples.", B: "She doesn't likes apples.", C: "She doesn't like apples.", D: "She not like apples." }, correctAnswer: "C" },
          { id: 204, text: "What is the plural of 'child'?", options: { A: "Childs", B: "Childes", C: "Children", D: "Childrens" }, correctAnswer: "C" },
          { id: 205, text: "Which word is an antonym of 'ancient'?", options: { A: "Old", B: "Modern", C: "Historic", D: "Aged" }, correctAnswer: "B" },
          { id: 206, text: "What literary device is used in: 'The wind whispered through the trees'?", options: { A: "Simile", B: "Metaphor", C: "Personification", D: "Alliteration" }, correctAnswer: "C" }
        ]
      },
      {
        name: "Kiswahili",
        questions: [
          { id: 301, text: "Neno 'haraka' ni la aina gani?", options: { A: "Nomino", B: "Kivumishi", C: "Kielelezo", D: "Kitenzi" }, correctAnswer: "C" },
          { id: 302, text: "Wingi wa 'mtoto' ni nini?", options: { A: "Watoto", B: "Mtoto", C: "Vitoto", D: "Matoto" }, correctAnswer: "A" },
          { id: 303, text: "Sentensi ipi ina kitenzi sahihi?", options: { A: "Yeye kwenda shule.", B: "Yeye anaenda shule.", C: "Yeye aenda shule.", D: "Yeye enda shule." }, correctAnswer: "B" },
          { id: 304, text: "Kinyume cha neno 'furaha' ni nini?", options: { A: "Shangwe", B: "Huzuni", C: "Starehe", D: "Amani" }, correctAnswer: "B" },
          { id: 305, text: "Methali 'Haraka haraka haina baraka' inamaanisha nini?", options: { A: "Kufanya kazi haraka ni vizuri", B: "Kuharakisha husababisha makosa", C: "Baraka huja haraka", D: "Kasi ni nguvu" }, correctAnswer: "B" },
          { id: 306, text: "Neno 'mwalimu' lina silabi ngapi?", options: { A: "2", B: "3", C: "4", D: "5" }, correctAnswer: "C" }
        ]
      },
      {
        name: "Chemistry",
        questions: [
          { id: 501, text: "What is the chemical symbol for Gold?", options: { A: "Go", B: "Gd", C: "Au", D: "Ag" }, correctAnswer: "C" },
          { id: 502, text: "How many electrons does a Carbon atom have?", options: { A: "4", B: "6", C: "8", D: "12" }, correctAnswer: "B" },
          { id: 503, text: "What is the pH of pure water?", options: { A: "0", B: "5", C: "7", D: "14" }, correctAnswer: "C" },
          { id: 504, text: "Which gas is produced when an acid reacts with a metal?", options: { A: "Oxygen", B: "Carbon dioxide", C: "Nitrogen", D: "Hydrogen" }, correctAnswer: "D" },
          { id: 505, text: "What type of bond is formed when electrons are shared between atoms?", options: { A: "Ionic bond", B: "Covalent bond", C: "Metallic bond", D: "Hydrogen bond" }, correctAnswer: "B" },
          { id: 506, text: "Which of the following is a physical change?", options: { A: "Burning wood", B: "Rusting iron", C: "Melting ice", D: "Cooking an egg" }, correctAnswer: "C" }
        ]
      },
      {
        name: "Biology",
        questions: [
          { id: 601, text: "What is the powerhouse of the cell?", options: { A: "Nucleus", B: "Ribosome", C: "Mitochondria", D: "Vacuole" }, correctAnswer: "C" },
          { id: 602, text: "Which process do plants use to make their own food?", options: { A: "Respiration", B: "Photosynthesis", C: "Digestion", D: "Transpiration" }, correctAnswer: "B" },
          { id: 603, text: "How many chromosomes does a normal human cell have?", options: { A: "23", B: "44", C: "46", D: "48" }, correctAnswer: "C" },
          { id: 604, text: "What is the basic unit of life?", options: { A: "Tissue", B: "Organ", C: "Atom", D: "Cell" }, correctAnswer: "D" },
          { id: 605, text: "Which blood type is known as the universal donor?", options: { A: "A", B: "B", C: "AB", D: "O" }, correctAnswer: "D" },
          { id: 606, text: "What organ is responsible for pumping blood in the human body?", options: { A: "Lungs", B: "Liver", C: "Heart", D: "Kidney" }, correctAnswer: "C" }
        ]
      },
      {
        name: "Geography",
        questions: [
          { id: 701, text: "What is the largest continent by area?", options: { A: "Africa", B: "North America", C: "Asia", D: "Europe" }, correctAnswer: "C" },
          { id: 702, text: "Which is the longest river in the world?", options: { A: "Amazon", B: "Congo", C: "Mississippi", D: "Nile" }, correctAnswer: "D" },
          { id: 703, text: "What causes the seasons on Earth?", options: { A: "Distance from the Sun", B: "Earth's tilt on its axis", C: "Speed of Earth's rotation", D: "Moon's gravity" }, correctAnswer: "B" },
          { id: 704, text: "What is the term for the imaginary line at 0° latitude?", options: { A: "Tropic of Cancer", B: "Prime Meridian", C: "Equator", D: "Arctic Circle" }, correctAnswer: "C" },
          { id: 705, text: "Which type of rock is formed from cooled magma?", options: { A: "Sedimentary", B: "Metamorphic", C: "Igneous", D: "Limestone" }, correctAnswer: "C" },
          { id: 706, text: "What is the capital city of Kenya?", options: { A: "Mombasa", B: "Kisumu", C: "Nakuru", D: "Nairobi" }, correctAnswer: "D" }
        ]
      },
      {
        name: "Computer Studies",
        questions: [
          { id: 801, text: "What does CPU stand for?", options: { A: "Central Processing Unit", B: "Computer Personal Unit", C: "Central Program Utility", D: "Core Processing Unit" }, correctAnswer: "A" },
          { id: 802, text: "Which of the following is an input device?", options: { A: "Monitor", B: "Printer", C: "Keyboard", D: "Speaker" }, correctAnswer: "C" },
          { id: 803, text: "What does RAM stand for?", options: { A: "Read Access Memory", B: "Random Access Memory", C: "Rapid Application Memory", D: "Read And Modify" }, correctAnswer: "B" },
          { id: 804, text: "Which file extension is used for a Microsoft Word document?", options: { A: ".xls", B: ".ppt", C: ".pdf", D: ".docx" }, correctAnswer: "D" },
          { id: 805, text: "What is the binary equivalent of the decimal number 10?", options: { A: "1010", B: "1100", C: "1001", D: "0110" }, correctAnswer: "A" },
          { id: 806, text: "Which of the following is an operating system?", options: { A: "Microsoft Word", B: "Google Chrome", C: "Windows 11", D: "Adobe Photoshop" }, correctAnswer: "C" }
        ]
      }
    ],
    "TERM 2": [
      {
        name: "Mathematics",
        questions: [
          { id: 1101, text: "What is the value of 7² − 3²?", options: { A: "40", B: "44", C: "49", D: "16" }, correctAnswer: "A" },
          { id: 1102, text: "Solve: 3(x − 4) = 15", options: { A: "x = 7", B: "x = 9", C: "x = 11", D: "x = 5" }, correctAnswer: "B" },
          { id: 1103, text: "What is 15% of 200?", options: { A: "25", B: "30", C: "35", D: "40" }, correctAnswer: "B" },
          { id: 1104, text: "A rectangle has length 12 cm and width 5 cm. What is its area?", options: { A: "34 cm²", B: "60 cm²", C: "17 cm²", D: "70 cm²" }, correctAnswer: "B" },
          { id: 1105, text: "What is the LCM of 4 and 6?", options: { A: "8", B: "10", C: "12", D: "24" }, correctAnswer: "C" },
          { id: 1106, text: "Simplify the fraction 18/24.", options: { A: "2/3", B: "3/4", C: "4/5", D: "1/2" }, correctAnswer: "B" }
        ]
      },
      {
        name: "English",
        questions: [
          { id: 1201, text: "Choose the correct form: 'Neither the boys nor the girl ___ ready.'", options: { A: "are", B: "were", C: "is", D: "be" }, correctAnswer: "C" },
          { id: 1202, text: "What is the past tense of 'bring'?", options: { A: "Bringed", B: "Brought", C: "Brung", D: "Brang" }, correctAnswer: "B" },
          { id: 1203, text: "Which sentence uses a simile?", options: { A: "The stars danced in the sky.", B: "He is a lion in battle.", C: "She runs like the wind.", D: "The thunder roared angrily." }, correctAnswer: "C" },
          { id: 1204, text: "What does the prefix 'un-' mean in the word 'unhappy'?", options: { A: "Very", B: "Not", C: "Again", D: "Before" }, correctAnswer: "B" },
          { id: 1205, text: "Identify the adjective: 'The tall boy won the race.'", options: { A: "boy", B: "won", C: "tall", D: "race" }, correctAnswer: "C" },
          { id: 1206, text: "Which punctuation ends an exclamatory sentence?", options: { A: ".", B: "?", C: ",", D: "!" }, correctAnswer: "D" }
        ]
      },
      {
        name: "Kiswahili",
        questions: [
          { id: 1301, text: "Kitenzi 'soma' katika wakati uliopita ni nini?", options: { A: "atasoma", B: "anasoma", C: "alisoma", D: "asome" }, correctAnswer: "C" },
          { id: 1302, text: "Neno gani ni nomino katika sentensi: 'Mtoto anacheza mpira'?", options: { A: "anacheza", B: "mtoto", C: "mpira", D: "B na C" }, correctAnswer: "D" },
          { id: 1303, text: "Kinyume cha 'kubwa' ni nini?", options: { A: "Refu", B: "Fupi", C: "Ndogo", D: "Nzuri" }, correctAnswer: "C" },
          { id: 1304, text: "Sentensi 'Nilikula chakula' iko katika wakati gani?", options: { A: "Sasa", B: "Uliopita", C: "Ujao", D: "Masharti" }, correctAnswer: "B" },
          { id: 1305, text: "Herufi ngapi zipo katika alfabeti ya Kiswahili?", options: { A: "24", B: "25", C: "26", D: "28" }, correctAnswer: "C" },
          { id: 1306, text: "Neno 'shule' limetoka lugha gani?", options: { A: "Kiarabu", B: "Kiingereza", C: "Kijerumani", D: "Kifaransa" }, correctAnswer: "C" }
        ]
      },
      {
        name: "Physics",
        questions: [
          { id: 1401, text: "What is the formula for speed?", options: { A: "Speed = Distance × Time", B: "Speed = Distance / Time", C: "Speed = Time / Distance", D: "Speed = Mass × Velocity" }, correctAnswer: "B" },
          { id: 1402, text: "Which type of energy does a moving car possess?", options: { A: "Potential energy", B: "Chemical energy", C: "Kinetic energy", D: "Nuclear energy" }, correctAnswer: "C" },
          { id: 1403, text: "What happens to resistance when the length of a wire is doubled?", options: { A: "It halves", B: "It stays the same", C: "It doubles", D: "It quadruples" }, correctAnswer: "C" },
          { id: 1404, text: "Which colour of light has the highest frequency?", options: { A: "Red", B: "Green", C: "Yellow", D: "Violet" }, correctAnswer: "D" },
          { id: 1405, text: "What is the unit of electrical resistance?", options: { A: "Ampere", B: "Volt", C: "Ohm", D: "Watt" }, correctAnswer: "C" },
          { id: 1406, text: "An object at rest on a table has zero ___.", options: { A: "Mass", B: "Weight", C: "Net force", D: "Volume" }, correctAnswer: "C" }
        ]
      },
      {
        name: "Chemistry",
        questions: [
          { id: 1501, text: "What is the chemical formula for water?", options: { A: "HO", B: "H₂O", C: "H₂O₂", D: "OH" }, correctAnswer: "B" },
          { id: 1502, text: "Which element has the atomic number 1?", options: { A: "Helium", B: "Oxygen", C: "Hydrogen", D: "Carbon" }, correctAnswer: "C" },
          { id: 1503, text: "What is the process of separating a mixture using heat called?", options: { A: "Filtration", B: "Evaporation", C: "Distillation", D: "Decantation" }, correctAnswer: "C" },
          { id: 1504, text: "Which of these is a mixture?", options: { A: "Water", B: "Salt", C: "Air", D: "Iron" }, correctAnswer: "C" },
          { id: 1505, text: "What charge does a proton carry?", options: { A: "Negative", B: "Neutral", C: "Positive", D: "Variable" }, correctAnswer: "C" },
          { id: 1506, text: "Which gas do plants absorb during photosynthesis?", options: { A: "Oxygen", B: "Nitrogen", C: "Carbon dioxide", D: "Hydrogen" }, correctAnswer: "C" }
        ]
      },
      {
        name: "Biology",
        questions: [
          { id: 1601, text: "What is the process by which cells divide to produce two identical daughter cells?", options: { A: "Meiosis", B: "Mitosis", C: "Fertilisation", D: "Osmosis" }, correctAnswer: "B" },
          { id: 1602, text: "Which organ produces insulin in the human body?", options: { A: "Liver", B: "Kidney", C: "Pancreas", D: "Stomach" }, correctAnswer: "C" },
          { id: 1603, text: "What is the main function of red blood cells?", options: { A: "Fight infection", B: "Carry oxygen", C: "Clot blood", D: "Produce hormones" }, correctAnswer: "B" },
          { id: 1604, text: "Which part of the plant conducts photosynthesis?", options: { A: "Root", B: "Stem", C: "Leaf", D: "Flower" }, correctAnswer: "C" },
          { id: 1605, text: "What is the term for organisms that eat both plants and animals?", options: { A: "Herbivores", B: "Carnivores", C: "Omnivores", D: "Decomposers" }, correctAnswer: "C" },
          { id: 1606, text: "Which vitamin is produced when skin is exposed to sunlight?", options: { A: "Vitamin A", B: "Vitamin B", C: "Vitamin C", D: "Vitamin D" }, correctAnswer: "D" }
        ]
      },
      {
        name: "Geography",
        questions: [
          { id: 1701, text: "What is the term for the movement of people from rural to urban areas?", options: { A: "Emigration", B: "Immigration", C: "Rural-urban migration", D: "Urbanisation" }, correctAnswer: "C" },
          { id: 1702, text: "Which ocean is the largest in the world?", options: { A: "Atlantic", B: "Indian", C: "Arctic", D: "Pacific" }, correctAnswer: "D" },
          { id: 1703, text: "What type of rainfall is caused by air rising over mountains?", options: { A: "Convectional", B: "Frontal", C: "Relief", D: "Cyclonic" }, correctAnswer: "C" },
          { id: 1704, text: "What is the name of the layer of the Earth we live on?", options: { A: "Mantle", B: "Core", C: "Crust", D: "Lithosphere" }, correctAnswer: "C" },
          { id: 1705, text: "Which country is the largest in Africa by area?", options: { A: "Nigeria", B: "Sudan", C: "Algeria", D: "Democratic Republic of Congo" }, correctAnswer: "C" },
          { id: 1706, text: "What instrument is used to measure rainfall?", options: { A: "Barometer", B: "Thermometer", C: "Rain gauge", D: "Hygrometer" }, correctAnswer: "C" }
        ]
      },
      {
        name: "Computer Studies",
        questions: [
          { id: 1801, text: "What does 'www' stand for in a web address?", options: { A: "World Wide Web", B: "Wide World Web", C: "Web World Wide", D: "World Web Wide" }, correctAnswer: "A" },
          { id: 1802, text: "Which of the following is an example of application software?", options: { A: "Windows 11", B: "Linux", C: "Microsoft Excel", D: "BIOS" }, correctAnswer: "C" },
          { id: 1803, text: "What is the function of a router in a network?", options: { A: "Store data", B: "Print documents", C: "Direct network traffic", D: "Display images" }, correctAnswer: "C" },
          { id: 1804, text: "Which storage device has the largest capacity?", options: { A: "Floppy disk", B: "CD-ROM", C: "USB flash drive", D: "Hard disk drive" }, correctAnswer: "D" },
          { id: 1805, text: "What does HTML stand for?", options: { A: "Hyper Text Markup Language", B: "High Text Making Language", C: "Hyper Transfer Markup Link", D: "Home Tool Markup Language" }, correctAnswer: "A" },
          { id: 1806, text: "Which of the following is NOT a programming language?", options: { A: "Python", B: "Java", C: "Excel", D: "C++" }, correctAnswer: "C" }
        ]
      }
    ],
    "TERM 3": [
      {
        name: "Mathematics",
        questions: [
          { id: 2101, text: "What is the gradient of a line passing through (0,0) and (4,8)?", options: { A: "1", B: "2", C: "4", D: "8" }, correctAnswer: "B" },
          { id: 2102, text: "Factorise: x² − 9", options: { A: "(x−3)(x−3)", B: "(x+9)(x−1)", C: "(x+3)(x−3)", D: "(x+3)(x+3)" }, correctAnswer: "C" },
          { id: 2103, text: "What is the circumference of a circle with radius 7 cm? (π = 22/7)", options: { A: "22 cm", B: "44 cm", C: "154 cm", D: "88 cm" }, correctAnswer: "B" },
          { id: 2104, text: "If a = 3 and b = 4, what is √(a² + b²)?", options: { A: "5", B: "6", C: "7", D: "25" }, correctAnswer: "A" },
          { id: 2105, text: "What is the mean of: 4, 7, 9, 10, 10?", options: { A: "7", B: "8", C: "9", D: "10" }, correctAnswer: "B" },
          { id: 2106, text: "Solve the inequality: 2x − 3 > 7", options: { A: "x > 2", B: "x > 5", C: "x < 5", D: "x > 10" }, correctAnswer: "B" }
        ]
      },
      {
        name: "English",
        questions: [
          { id: 2201, text: "Which sentence is in the passive voice?", options: { A: "The chef cooked the meal.", B: "The meal was cooked by the chef.", C: "The chef is cooking the meal.", D: "The chef had cooked the meal." }, correctAnswer: "B" },
          { id: 2202, text: "What is the meaning of the idiom 'bite the bullet'?", options: { A: "To eat quickly", B: "To endure a painful situation", C: "To shoot a gun", D: "To be very angry" }, correctAnswer: "B" },
          { id: 2203, text: "Choose the correct word: 'The team ___ won the trophy.'", options: { A: "have", B: "has", C: "had been", D: "were" }, correctAnswer: "B" },
          { id: 2204, text: "What type of noun is 'happiness'?", options: { A: "Proper noun", B: "Collective noun", C: "Abstract noun", D: "Concrete noun" }, correctAnswer: "C" },
          { id: 2205, text: "Which word correctly completes the sentence: 'He is ___ honest man.'?", options: { A: "a", B: "an", C: "the", D: "some" }, correctAnswer: "B" },
          { id: 2206, text: "What is the superlative form of 'good'?", options: { A: "Gooder", B: "Better", C: "More good", D: "Best" }, correctAnswer: "D" }
        ]
      },
      {
        name: "Kiswahili",
        questions: [
          { id: 2301, text: "Neno 'upole' ni la aina gani?", options: { A: "Kitenzi", B: "Nomino", C: "Kivumishi", D: "Kielelezo" }, correctAnswer: "B" },
          { id: 2302, text: "Sentensi 'Nitasoma kesho' iko katika wakati gani?", options: { A: "Uliopita", B: "Sasa hivi", C: "Ujao", D: "Masharti" }, correctAnswer: "C" },
          { id: 2303, text: "Wingi wa 'jicho' ni nini?", options: { A: "Majicho", B: "Jicho", C: "Macho", D: "Vijicho" }, correctAnswer: "C" },
          { id: 2304, text: "Methali 'Umoja ni nguvu, utengano ni udhaifu' inamaanisha nini?", options: { A: "Nguvu ni muhimu", B: "Kufanya kazi peke yako ni bora", C: "Kushirikiana kunaleta mafanikio", D: "Udhaifu ni hatari" }, correctAnswer: "C" },
          { id: 2305, text: "Neno gani ni kinyume cha 'mapema'?", options: { A: "Haraka", B: "Polepole", C: "Baadaye", D: "Sasa" }, correctAnswer: "C" },
          { id: 2306, text: "Kiambishi 'wa' katika 'mtoto wa shule' kinaonyesha nini?", options: { A: "Wingi", B: "Umiliki", C: "Wakati", D: "Hali" }, correctAnswer: "B" }
        ]
      },
      {
        name: "Physics",
        questions: [
          { id: 2401, text: "What is the SI unit of electric current?", options: { A: "Volt", B: "Watt", C: "Ampere", D: "Ohm" }, correctAnswer: "C" },
          { id: 2402, text: "Which law states that every action has an equal and opposite reaction?", options: { A: "Newton's First Law", B: "Newton's Second Law", C: "Newton's Third Law", D: "Hooke's Law" }, correctAnswer: "C" },
          { id: 2403, text: "What type of image is formed by a plane mirror?", options: { A: "Real and inverted", B: "Virtual and upright", C: "Real and upright", D: "Virtual and inverted" }, correctAnswer: "B" },
          { id: 2404, text: "Which of the following is a renewable source of energy?", options: { A: "Coal", B: "Natural gas", C: "Solar", D: "Petroleum" }, correctAnswer: "C" },
          { id: 2405, text: "What is the acceleration due to gravity on Earth (approx.)?", options: { A: "5 m/s²", B: "9.8 m/s²", C: "12 m/s²", D: "15 m/s²" }, correctAnswer: "B" },
          { id: 2406, text: "Sound travels fastest through which medium?", options: { A: "Vacuum", B: "Air", C: "Water", D: "Steel" }, correctAnswer: "D" }
        ]
      },
      {
        name: "Chemistry",
        questions: [
          { id: 2501, text: "What is the chemical symbol for Sodium?", options: { A: "So", B: "Sd", C: "Na", D: "Nm" }, correctAnswer: "C" },
          { id: 2502, text: "Which type of reaction releases heat to the surroundings?", options: { A: "Endothermic", B: "Exothermic", C: "Neutralisation", D: "Decomposition" }, correctAnswer: "B" },
          { id: 2503, text: "What is the product when an acid reacts with a base?", options: { A: "An oxide", B: "A gas", C: "Salt and water", D: "A metal" }, correctAnswer: "C" },
          { id: 2504, text: "How many atoms are in one molecule of H₂SO₄?", options: { A: "5", B: "6", C: "7", D: "8" }, correctAnswer: "C" },
          { id: 2505, text: "Which of the following is a noble gas?", options: { A: "Oxygen", B: "Nitrogen", C: "Argon", D: "Chlorine" }, correctAnswer: "C" },
          { id: 2506, text: "What is the process of a solid turning directly into a gas called?", options: { A: "Evaporation", B: "Condensation", C: "Sublimation", D: "Melting" }, correctAnswer: "C" }
        ]
      },
      {
        name: "Biology",
        questions: [
          { id: 2601, text: "What is the term for the variety of life on Earth?", options: { A: "Ecology", B: "Biodiversity", C: "Evolution", D: "Taxonomy" }, correctAnswer: "B" },
          { id: 2602, text: "Which part of the neuron receives signals from other neurons?", options: { A: "Axon", B: "Myelin sheath", C: "Dendrite", D: "Synapse" }, correctAnswer: "C" },
          { id: 2603, text: "What is the role of the kidney in the human body?", options: { A: "Produce bile", B: "Filter blood and remove waste", C: "Pump blood", D: "Digest food" }, correctAnswer: "B" },
          { id: 2604, text: "Which gas is released during respiration?", options: { A: "Oxygen", B: "Nitrogen", C: "Carbon dioxide", D: "Hydrogen" }, correctAnswer: "C" },
          { id: 2605, text: "What is the name of the pigment that makes plants green?", options: { A: "Melanin", B: "Haemoglobin", C: "Carotene", D: "Chlorophyll" }, correctAnswer: "D" },
          { id: 2606, text: "Which type of reproduction involves only one parent?", options: { A: "Sexual", B: "Asexual", C: "Fertilisation", D: "Pollination" }, correctAnswer: "B" }
        ]
      },
      {
        name: "Geography",
        questions: [
          { id: 2701, text: "What is the term for the wearing away of the Earth's surface by wind, water or ice?", options: { A: "Weathering", B: "Deposition", C: "Erosion", D: "Leaching" }, correctAnswer: "C" },
          { id: 2702, text: "Which of the following is an example of a fold mountain?", options: { A: "Mount Kenya", B: "The Himalayas", C: "The Rift Valley", D: "Mount Kilimanjaro" }, correctAnswer: "B" },
          { id: 2703, text: "What is the Greenwich Meridian also known as?", options: { A: "Equator", B: "Tropic of Capricorn", C: "Prime Meridian", D: "International Date Line" }, correctAnswer: "C" },
          { id: 2704, text: "Which type of vegetation is found in areas with very low rainfall?", options: { A: "Tropical rainforest", B: "Savanna", C: "Desert scrub", D: "Mangrove" }, correctAnswer: "C" },
          { id: 2705, text: "What is the name of the process by which water vapour turns into liquid water?", options: { A: "Evaporation", B: "Condensation", C: "Precipitation", D: "Transpiration" }, correctAnswer: "B" },
          { id: 2706, text: "Which East African country is landlocked?", options: { A: "Kenya", B: "Tanzania", C: "Uganda", D: "Mozambique" }, correctAnswer: "C" }
        ]
      },
      {
        name: "Computer Studies",
        questions: [
          { id: 2801, text: "What does 'GUI' stand for?", options: { A: "General User Interface", B: "Graphical User Interface", C: "Global Utility Interface", D: "Graphical Utility Input" }, correctAnswer: "B" },
          { id: 2802, text: "Which of the following best describes a virus in computing?", options: { A: "A hardware fault", B: "A slow internet connection", C: "Malicious software that replicates itself", D: "A type of printer error" }, correctAnswer: "C" },
          { id: 2803, text: "What is the purpose of an antivirus program?", options: { A: "Speed up the CPU", B: "Detect and remove malware", C: "Increase RAM", D: "Connect to the internet" }, correctAnswer: "B" },
          { id: 2804, text: "In a spreadsheet, which symbol is used to start a formula?", options: { A: "#", B: "@", C: "=", D: "$" }, correctAnswer: "C" },
          { id: 2805, text: "What does 'LAN' stand for?", options: { A: "Large Area Network", B: "Local Area Network", C: "Linked Access Node", D: "Local Application Network" }, correctAnswer: "B" },
          { id: 2806, text: "Which generation of computers used transistors?", options: { A: "First", B: "Second", C: "Third", D: "Fourth" }, correctAnswer: "B" }
        ]
      }
    ]
  },
  "11": {
    "TERM 1": [
      {
        name: "Mathematics",
        questions: [
          { id: 3101, text: "What is the value of log₁₀(1000)?", options: { A: "2", B: "3", C: "4", D: "10" }, correctAnswer: "B" },
          { id: 3102, text: "Solve: 2x² − 8 = 0", options: { A: "x = ±1", B: "x = ±2", C: "x = ±4", D: "x = ±8" }, correctAnswer: "B" },
          { id: 3103, text: "What is the sum of interior angles of a hexagon?", options: { A: "540°", B: "620°", C: "720°", D: "900°" }, correctAnswer: "C" },
          { id: 3104, text: "If f(x) = 3x + 2, what is f(4)?", options: { A: "10", B: "12", C: "14", D: "16" }, correctAnswer: "C" },
          { id: 3105, text: "What is the derivative of y = x³?", options: { A: "x²", B: "2x²", C: "3x²", D: "3x" }, correctAnswer: "C" },
          { id: 3106, text: "A car travels 180 km in 3 hours. What is its average speed?", options: { A: "40 km/h", B: "50 km/h", C: "60 km/h", D: "70 km/h" }, correctAnswer: "C" }
        ]
      },
      {
        name: "English",
        questions: [
          { id: 3201, text: "Which of the following is an example of a complex sentence?", options: { A: "She sang and danced.", B: "Although it rained, we went out.", C: "He ran fast.", D: "The dog barked." }, correctAnswer: "B" },
          { id: 3202, text: "What is the tone of a piece of writing that mocks human folly?", options: { A: "Romantic", B: "Satirical", C: "Tragic", D: "Lyrical" }, correctAnswer: "B" },
          { id: 3203, text: "Identify the gerund in: 'Swimming is good exercise.'", options: { A: "good", B: "exercise", C: "Swimming", D: "is" }, correctAnswer: "C" },
          { id: 3204, text: "Which word is a conjunction in: 'I was tired but I kept going.'?", options: { A: "tired", B: "kept", C: "but", D: "going" }, correctAnswer: "C" },
          { id: 3205, text: "What does 'ambiguous' mean?", options: { A: "Very clear", B: "Open to more than one interpretation", C: "Completely wrong", D: "Extremely long" }, correctAnswer: "B" },
          { id: 3206, text: "Which figure of speech is: 'Life is a journey'?", options: { A: "Simile", B: "Hyperbole", C: "Metaphor", D: "Onomatopoeia" }, correctAnswer: "C" }
        ]
      },
      {
        name: "Kiswahili",
        questions: [
          { id: 3301, text: "Tamko 'Pole pole ndio mwendo' linamaanisha nini?", options: { A: "Haraka ni bora", B: "Subira huleta mafanikio", C: "Polepole ni uvivu", D: "Mwendo ni muhimu" }, correctAnswer: "B" },
          { id: 3302, text: "Neno 'uandishi' limetokana na kitenzi gani?", options: { A: "andika", B: "soma", C: "imba", D: "cheza" }, correctAnswer: "A" },
          { id: 3303, text: "Katika sentensi 'Wanafunzi walisoma vitabu', neno 'vitabu' ni nini?", options: { A: "Kitenzi", B: "Kivumishi", C: "Nomino", D: "Kielelezo" }, correctAnswer: "C" },
          { id: 3304, text: "Ni ipi kati ya hizi ni ngeli ya 'U-U'?", options: { A: "Mti / Miti", B: "Uji / Uji", C: "Kisu / Visu", D: "Jiwe / Mawe" }, correctAnswer: "B" },
          { id: 3305, text: "Kinyume cha kitenzi 'kupenda' ni nini?", options: { A: "Kutopenda", B: "Kuchukia", C: "Kusahau", D: "Kuacha" }, correctAnswer: "B" },
          { id: 3306, text: "Sentensi sahihi ni ipi?", options: { A: "Yeye alikwenda sokoni jana.", B: "Yeye kwenda sokoni jana.", C: "Yeye aenda sokoni jana.", D: "Yeye sokoni jana alikwenda." }, correctAnswer: "A" }
        ]
      },
      {
        name: "Physics",
        questions: [
          { id: 3401, text: "What is the formula for kinetic energy?", options: { A: "KE = mgh", B: "KE = ½mv²", C: "KE = mv", D: "KE = Fd" }, correctAnswer: "B" },
          { id: 3402, text: "Which phenomenon explains why a straw appears bent in a glass of water?", options: { A: "Reflection", B: "Diffraction", C: "Refraction", D: "Dispersion" }, correctAnswer: "C" },
          { id: 3403, text: "What is the unit of power?", options: { A: "Joule", B: "Newton", C: "Watt", D: "Pascal" }, correctAnswer: "C" },
          { id: 3404, text: "A wave has a frequency of 50 Hz and wavelength of 2 m. What is its speed?", options: { A: "25 m/s", B: "52 m/s", C: "100 m/s", D: "200 m/s" }, correctAnswer: "C" },
          { id: 3405, text: "Which type of lens is used to correct short-sightedness?", options: { A: "Convex", B: "Concave", C: "Bifocal", D: "Plane" }, correctAnswer: "B" },
          { id: 3406, text: "What is the relationship between pressure and volume in Boyle's Law (at constant temperature)?", options: { A: "Directly proportional", B: "Inversely proportional", C: "No relationship", D: "Exponentially related" }, correctAnswer: "B" }
        ]
      },
      {
        name: "Chemistry",
        questions: [
          { id: 3501, text: "What is the oxidation state of oxygen in most compounds?", options: { A: "+2", B: "0", C: "-1", D: "-2" }, correctAnswer: "D" },
          { id: 3502, text: "Which type of isomerism involves compounds with the same molecular formula but different structural arrangements?", options: { A: "Geometric isomerism", B: "Optical isomerism", C: "Structural isomerism", D: "Chain isomerism" }, correctAnswer: "C" },
          { id: 3503, text: "What is the IUPAC name for CH₃CH₂OH?", options: { A: "Methanol", B: "Ethanol", C: "Propanol", D: "Butanol" }, correctAnswer: "B" },
          { id: 3504, text: "Which gas is produced at the cathode during electrolysis of dilute sulphuric acid?", options: { A: "Oxygen", B: "Chlorine", C: "Hydrogen", D: "Sulphur dioxide" }, correctAnswer: "C" },
          { id: 3505, text: "What is the molar mass of NaCl? (Na=23, Cl=35.5)", options: { A: "48.5 g/mol", B: "58.5 g/mol", C: "68.5 g/mol", D: "78.5 g/mol" }, correctAnswer: "B" },
          { id: 3506, text: "Which of the following is a strong acid?", options: { A: "Ethanoic acid", B: "Carbonic acid", C: "Hydrochloric acid", D: "Citric acid" }, correctAnswer: "C" }
        ]
      },
      {
        name: "Biology",
        questions: [
          { id: 3601, text: "What is the first stage of mitosis?", options: { A: "Anaphase", B: "Metaphase", C: "Telophase", D: "Prophase" }, correctAnswer: "D" },
          { id: 3602, text: "Which molecule carries genetic information in a cell?", options: { A: "ATP", B: "RNA", C: "DNA", D: "Protein" }, correctAnswer: "C" },
          { id: 3603, text: "What is the term for organisms that break down dead organic matter?", options: { A: "Producers", B: "Consumers", C: "Decomposers", D: "Parasites" }, correctAnswer: "C" },
          { id: 3604, text: "Which hormone regulates blood sugar levels?", options: { A: "Adrenaline", B: "Insulin", C: "Oestrogen", D: "Thyroxine" }, correctAnswer: "B" },
          { id: 3605, text: "What type of symbiosis benefits one organism while the other is unaffected?", options: { A: "Mutualism", B: "Parasitism", C: "Commensalism", D: "Competition" }, correctAnswer: "C" },
          { id: 3606, text: "Which part of the brain controls balance and coordination?", options: { A: "Cerebrum", B: "Medulla oblongata", C: "Hypothalamus", D: "Cerebellum" }, correctAnswer: "D" }
        ]
      },
      {
        name: "Geography",
        questions: [
          { id: 3701, text: "What is the term for the boundary between two tectonic plates?", options: { A: "Fault line", B: "Plate margin", C: "Rift zone", D: "Subduction zone" }, correctAnswer: "B" },
          { id: 3702, text: "Which type of farming involves growing crops for sale rather than personal use?", options: { A: "Subsistence farming", B: "Pastoral farming", C: "Commercial farming", D: "Mixed farming" }, correctAnswer: "C" },
          { id: 3703, text: "What is the name of the hot, molten rock below the Earth's surface?", options: { A: "Lava", B: "Magma", C: "Basalt", D: "Granite" }, correctAnswer: "B" },
          { id: 3704, text: "Which factor most influences the climate of a coastal area?", options: { A: "Latitude", B: "Altitude", C: "Proximity to the sea", D: "Vegetation" }, correctAnswer: "C" },
          { id: 3705, text: "What is the term for the total value of goods and services produced by a country in a year?", options: { A: "GNP", B: "GDP", C: "HDI", D: "PPP" }, correctAnswer: "B" },
          { id: 3706, text: "Which wind system blows from the sea to the land during the day?", options: { A: "Land breeze", B: "Trade wind", C: "Sea breeze", D: "Monsoon" }, correctAnswer: "C" }
        ]
      },
      {
        name: "Computer Studies",
        questions: [
          { id: 3801, text: "What does OOP stand for in programming?", options: { A: "Object Oriented Programming", B: "Open Output Processing", C: "Operational Output Program", D: "Object Output Protocol" }, correctAnswer: "A" },
          { id: 3802, text: "Which data structure follows the LIFO principle?", options: { A: "Queue", B: "Array", C: "Stack", D: "Linked list" }, correctAnswer: "C" },
          { id: 3803, text: "What is the function of a compiler?", options: { A: "Store data permanently", B: "Translate high-level code to machine code", C: "Connect to the internet", D: "Manage files on disk" }, correctAnswer: "B" },
          { id: 3804, text: "Which of the following is a database management system?", options: { A: "Python", B: "MySQL", C: "HTML", D: "Linux" }, correctAnswer: "B" },
          { id: 3805, text: "What is the decimal value of the binary number 1101?", options: { A: "11", B: "12", C: "13", D: "14" }, correctAnswer: "C" },
          { id: 3806, text: "Which network topology connects all devices to a central hub?", options: { A: "Ring", B: "Bus", C: "Mesh", D: "Star" }, correctAnswer: "D" }
        ]
      }
    ],
    "TERM 2": [
      {
        name: "Mathematics",
        questions: [
          { id: 4101, text: "What is the value of sin 30°?", options: { A: "0", B: "0.5", C: "√2/2", D: "1" }, correctAnswer: "B" },
          { id: 4102, text: "Expand: (x + 3)²", options: { A: "x² + 6x + 6", B: "x² + 9", C: "x² + 6x + 9", D: "x² + 3x + 9" }, correctAnswer: "C" },
          { id: 4103, text: "What is the area of a triangle with base 10 cm and height 6 cm?", options: { A: "30 cm²", B: "60 cm²", C: "16 cm²", D: "20 cm²" }, correctAnswer: "A" },
          { id: 4104, text: "If the probability of an event is 0.3, what is the probability it does NOT occur?", options: { A: "0.3", B: "0.6", C: "0.7", D: "1.3" }, correctAnswer: "C" },
          { id: 4105, text: "What is the nth term of the arithmetic sequence 5, 8, 11, 14...?", options: { A: "3n + 2", B: "3n + 5", C: "5n + 3", D: "2n + 3" }, correctAnswer: "A" },
          { id: 4106, text: "Evaluate: ∫2x dx", options: { A: "2", B: "x² + C", C: "2x² + C", D: "x + C" }, correctAnswer: "B" }
        ]
      },
      {
        name: "English",
        questions: [
          { id: 4201, text: "What is the term for a word that sounds like the noise it describes?", options: { A: "Alliteration", B: "Onomatopoeia", C: "Assonance", D: "Consonance" }, correctAnswer: "B" },
          { id: 4202, text: "Which sentence contains a dangling modifier?", options: { A: "Running fast, she won the race.", B: "Running fast, the finish line was crossed.", C: "She ran fast to cross the line.", D: "The fast runner crossed the line." }, correctAnswer: "B" },
          { id: 4203, text: "What is the function of a thesis statement in an essay?", options: { A: "To conclude the argument", B: "To provide evidence", C: "To state the main argument", D: "To introduce background information" }, correctAnswer: "C" },
          { id: 4204, text: "Which tense is used in: 'By noon, she will have finished the report'?", options: { A: "Simple future", B: "Future continuous", C: "Future perfect", D: "Present perfect" }, correctAnswer: "C" },
          { id: 4205, text: "What does the word 'verbose' mean?", options: { A: "Brief and concise", B: "Using more words than necessary", C: "Extremely loud", D: "Difficult to understand" }, correctAnswer: "B" },
          { id: 4206, text: "Which of the following is an example of dramatic irony?", options: { A: "A character says the opposite of what they mean.", B: "The audience knows something a character does not.", C: "Two events happen at the same time.", D: "A character speaks directly to the audience." }, correctAnswer: "B" }
        ]
      },
      {
        name: "Kiswahili",
        questions: [
          { id: 4301, text: "Neno 'mazungumzo' lina maana gani?", options: { A: "Kuandika", B: "Mazungumzo ya mdomo", C: "Kusoma", D: "Kucheza" }, correctAnswer: "B" },
          { id: 4302, text: "Ni ipi kati ya hizi ni sentensi ya masharti?", options: { A: "Nitakwenda kesho.", B: "Alikwenda jana.", C: "Kama itanyesha, nitabaki nyumbani.", D: "Anasoma sasa hivi." }, correctAnswer: "C" },
          { id: 4303, text: "Kiambishi awali 'wa' katika 'wanafunzi' kinaonyesha nini?", options: { A: "Umiliki", B: "Wingi wa ngeli ya M-WA", C: "Wakati uliopita", D: "Hali ya kuuliza" }, correctAnswer: "B" },
          { id: 4304, text: "Neno 'taharuki' lina maana gani?", options: { A: "Utulivu", B: "Wasiwasi na hofu", C: "Furaha kubwa", D: "Uchovu" }, correctAnswer: "B" },
          { id: 4305, text: "Shairi lenye mistari minne katika kila ubeti huitwa nini?", options: { A: "Terzina", B: "Quatrain", C: "Ukwapi", D: "Tathlitha" }, correctAnswer: "B" },
          { id: 4306, text: "Wingi wa neno 'uso' ni nini?", options: { A: "Nyuso", B: "Mauso", C: "Viuso", D: "Uso" }, correctAnswer: "A" }
        ]
      },
      {
        name: "Physics",
        questions: [
          { id: 4401, text: "What is the half-life of a radioactive substance that decays from 80g to 10g in 9 years?", options: { A: "1 year", B: "2 years", C: "3 years", D: "4 years" }, correctAnswer: "C" },
          { id: 4402, text: "Which particle has no charge and is found in the nucleus?", options: { A: "Proton", B: "Electron", C: "Neutron", D: "Positron" }, correctAnswer: "C" },
          { id: 4403, text: "What is the principle behind a transformer?", options: { A: "Electrostatics", B: "Electromagnetic induction", C: "Photoelectric effect", D: "Nuclear fission" }, correctAnswer: "B" },
          { id: 4404, text: "An object is thrown horizontally. Which component of its velocity remains constant (ignoring air resistance)?", options: { A: "Vertical", B: "Both change", C: "Horizontal", D: "Neither" }, correctAnswer: "C" },
          { id: 4405, text: "What does a voltmeter measure?", options: { A: "Current", B: "Resistance", C: "Power", D: "Potential difference" }, correctAnswer: "D" },
          { id: 4406, text: "Which type of radiation is most penetrating?", options: { A: "Alpha", B: "Beta", C: "Gamma", D: "Infrared" }, correctAnswer: "C" }
        ]
      },
      {
        name: "Chemistry",
        questions: [
          { id: 4501, text: "What is the general formula for alkanes?", options: { A: "CₙH₂ₙ", B: "CₙH₂ₙ₋₂", C: "CₙH₂ₙ₊₂", D: "CₙHₙ" }, correctAnswer: "C" },
          { id: 4502, text: "Which process is used to extract iron from its ore in a blast furnace?", options: { A: "Oxidation", B: "Reduction", C: "Electrolysis", D: "Distillation" }, correctAnswer: "B" },
          { id: 4503, text: "What is the pH range of a buffer solution designed to resist change?", options: { A: "It has no fixed range", B: "Always pH 7", C: "Near the pKa of the weak acid", D: "Always below pH 4" }, correctAnswer: "C" },
          { id: 4504, text: "Which functional group is present in alcohols?", options: { A: "-COOH", B: "-CHO", C: "-OH", D: "-NH₂" }, correctAnswer: "C" },
          { id: 4505, text: "What type of reaction is: CH₄ + 2O₂ → CO₂ + 2H₂O?", options: { A: "Decomposition", B: "Displacement", C: "Combustion", D: "Neutralisation" }, correctAnswer: "C" },
          { id: 4506, text: "Which law states that gases combine in simple ratios by volume?", options: { A: "Avogadro's Law", B: "Gay-Lussac's Law", C: "Boyle's Law", D: "Charles's Law" }, correctAnswer: "B" }
        ]
      },
      {
        name: "Biology",
        questions: [
          { id: 4601, text: "What is the term for the movement of water across a semi-permeable membrane?", options: { A: "Diffusion", B: "Active transport", C: "Osmosis", D: "Filtration" }, correctAnswer: "C" },
          { id: 4602, text: "Which enzyme breaks down starch in the mouth?", options: { A: "Pepsin", B: "Lipase", C: "Amylase", D: "Trypsin" }, correctAnswer: "C" },
          { id: 4603, text: "What is the role of mRNA in protein synthesis?", options: { A: "It carries amino acids to the ribosome", B: "It carries the genetic code from DNA to the ribosome", C: "It forms the ribosome structure", D: "It unzips the DNA strand" }, correctAnswer: "B" },
          { id: 4604, text: "Which blood vessel carries oxygenated blood from the lungs to the heart?", options: { A: "Pulmonary artery", B: "Aorta", C: "Vena cava", D: "Pulmonary vein" }, correctAnswer: "D" },
          { id: 4605, text: "What is the name of the process by which plants lose water through their leaves?", options: { A: "Respiration", B: "Transpiration", C: "Photosynthesis", D: "Guttation" }, correctAnswer: "B" },
          { id: 4606, text: "Which vitamin deficiency causes scurvy?", options: { A: "Vitamin A", B: "Vitamin B12", C: "Vitamin C", D: "Vitamin D" }, correctAnswer: "C" }
        ]
      },
      {
        name: "Geography",
        questions: [
          { id: 4701, text: "What is the term for the maximum population an environment can sustainably support?", options: { A: "Population density", B: "Carrying capacity", C: "Birth rate", D: "Overpopulation" }, correctAnswer: "B" },
          { id: 4702, text: "Which type of industry processes raw materials into finished goods?", options: { A: "Primary", B: "Tertiary", C: "Quaternary", D: "Secondary" }, correctAnswer: "D" },
          { id: 4703, text: "What is the name of the current that keeps Western Europe relatively warm?", options: { A: "Labrador Current", B: "Benguela Current", C: "North Atlantic Drift", D: "Humboldt Current" }, correctAnswer: "C" },
          { id: 4704, text: "Which type of map shows the height of land using contour lines?", options: { A: "Political map", B: "Topographic map", C: "Climate map", D: "Road map" }, correctAnswer: "B" },
          { id: 4705, text: "What is the main cause of desertification in sub-Saharan Africa?", options: { A: "Volcanic activity", B: "Overgrazing and deforestation", C: "Earthquakes", D: "Rising sea levels" }, correctAnswer: "B" },
          { id: 4706, text: "What does a negative trade balance indicate?", options: { A: "Exports exceed imports", B: "Imports exceed exports", C: "Equal exports and imports", D: "No international trade" }, correctAnswer: "B" }
        ]
      },
      {
        name: "Computer Studies",
        questions: [
          { id: 4801, text: "What is the time complexity of a binary search algorithm?", options: { A: "O(n)", B: "O(n²)", C: "O(log n)", D: "O(1)" }, correctAnswer: "C" },
          { id: 4802, text: "Which HTML tag is used to create a hyperlink?", options: { A: "<link>", B: "<href>", C: "<a>", D: "<url>" }, correctAnswer: "C" },
          { id: 4803, text: "What does CSS stand for?", options: { A: "Computer Style Sheets", B: "Cascading Style Sheets", C: "Creative Style System", D: "Coded Style Syntax" }, correctAnswer: "B" },
          { id: 4804, text: "Which of the following is a primary key property in a database?", options: { A: "It can be NULL", B: "It can repeat", C: "It uniquely identifies each record", D: "It must be a number" }, correctAnswer: "C" },
          { id: 4805, text: "What is the purpose of an IP address?", options: { A: "Store files on a server", B: "Identify a device on a network", C: "Encrypt data", D: "Speed up the processor" }, correctAnswer: "B" },
          { id: 4806, text: "Which programming concept allows a function to call itself?", options: { A: "Iteration", B: "Inheritance", C: "Recursion", D: "Polymorphism" }, correctAnswer: "C" }
        ]
      }
    ],
    "TERM 3": [
      {
        name: "Mathematics",
        questions: [
          { id: 5101, text: "What is the value of cos 60°?", options: { A: "0", B: "0.5", C: "√3/2", D: "1" }, correctAnswer: "B" },
          { id: 5102, text: "Find the equation of a line with gradient 2 passing through (1, 3).", options: { A: "y = 2x + 1", B: "y = 2x − 1", C: "y = 2x + 3", D: "y = x + 2" }, correctAnswer: "A" },
          { id: 5103, text: "What is the volume of a cylinder with radius 3 cm and height 7 cm? (π ≈ 22/7)", options: { A: "66 cm³", B: "132 cm³", C: "198 cm³", D: "154 cm³" }, correctAnswer: "C" },
          { id: 5104, text: "Solve: log₂(x) = 5", options: { A: "x = 10", B: "x = 25", C: "x = 32", D: "x = 64" }, correctAnswer: "C" },
          { id: 5105, text: "What is the standard deviation a measure of?", options: { A: "Central tendency", B: "Spread of data", C: "Highest value", D: "Total frequency" }, correctAnswer: "B" },
          { id: 5106, text: "If P(A) = 0.4 and P(B) = 0.5 and they are independent, what is P(A and B)?", options: { A: "0.9", B: "0.1", C: "0.2", D: "0.45" }, correctAnswer: "C" }
        ]
      },
      {
        name: "English",
        questions: [
          { id: 5201, text: "What is the term for the repetition of consonant sounds at the beginning of words?", options: { A: "Assonance", B: "Rhyme", C: "Alliteration", D: "Onomatopoeia" }, correctAnswer: "C" },
          { id: 5202, text: "Which narrative point of view uses 'he', 'she', and 'they'?", options: { A: "First person", B: "Second person", C: "Third person", D: "Omniscient" }, correctAnswer: "C" },
          { id: 5203, text: "What is a 'foil' character in literature?", options: { A: "The main character", B: "A character who contrasts with the protagonist", C: "A villain", D: "A narrator" }, correctAnswer: "B" },
          { id: 5204, text: "Which sentence correctly uses a semicolon?", options: { A: "I was tired; and I slept.", B: "She studied hard; she passed the exam.", C: "He ran; quickly.", D: "They ate; because they were hungry." }, correctAnswer: "B" },
          { id: 5205, text: "What is the term for the central message or insight of a literary work?", options: { A: "Plot", B: "Setting", C: "Theme", D: "Conflict" }, correctAnswer: "C" },
          { id: 5206, text: "Which word correctly fills the blank: 'The committee ___ reached a decision.'?", options: { A: "have", B: "has", C: "were", D: "are" }, correctAnswer: "B" }
        ]
      },
      {
        name: "Kiswahili",
        questions: [
          { id: 5301, text: "Tamko 'Asiyesikia la mkuu huvunjika guu' linamaanisha nini?", options: { A: "Mkuu ana nguvu", B: "Kutokusikiliza ushauri husababisha madhara", C: "Guu ni muhimu", D: "Mkuu anajua kila kitu" }, correctAnswer: "B" },
          { id: 5302, text: "Neno 'ujenzi' ni la ngeli gani?", options: { A: "M-WA", B: "KI-VI", C: "U-U", D: "MA-MA" }, correctAnswer: "C" },
          { id: 5303, text: "Katika ushairi wa Kiswahili, 'mizani' inamaanisha nini?", options: { A: "Idadi ya beti", B: "Mpangilio wa vina", C: "Idadi ya silabi katika mstari", D: "Aina ya shairi" }, correctAnswer: "C" },
          { id: 5304, text: "Sentensi 'Chakula kilichopikwa na mama kilikuwa kitamu' ina aina gani ya kishazi?", options: { A: "Kishazi huru", B: "Kishazi tegemezi cha sifa", C: "Kishazi tegemezi cha wakati", D: "Kishazi tegemezi cha masharti" }, correctAnswer: "B" },
          { id: 5305, text: "Neno gani ni kiwakilishi katika: 'Yeye alifanya kazi nzuri'?", options: { A: "alifanya", B: "kazi", C: "Yeye", D: "nzuri" }, correctAnswer: "C" },
          { id: 5306, text: "Kinyume cha neno 'ujasiri' ni nini?", options: { A: "Nguvu", B: "Uoga", C: "Upole", D: "Utulivu" }, correctAnswer: "B" }
        ]
      },
      {
        name: "Physics",
        questions: [
          { id: 5401, text: "What is the work done when a force of 20 N moves an object 5 m in the direction of the force?", options: { A: "4 J", B: "25 J", C: "100 J", D: "200 J" }, correctAnswer: "C" },
          { id: 5402, text: "Which phenomenon causes the splitting of white light into a spectrum?", options: { A: "Reflection", B: "Diffraction", C: "Dispersion", D: "Interference" }, correctAnswer: "C" },
          { id: 5403, text: "What is the efficiency of a machine that has a useful output of 400 J and a total input of 500 J?", options: { A: "60%", B: "70%", C: "80%", D: "90%" }, correctAnswer: "C" },
          { id: 5404, text: "In a series circuit, what happens to the total resistance when more resistors are added?", options: { A: "It decreases", B: "It stays the same", C: "It increases", D: "It becomes zero" }, correctAnswer: "C" },
          { id: 5405, text: "What is the name of the force that keeps a planet in orbit around the Sun?", options: { A: "Magnetic force", B: "Gravitational force", C: "Nuclear force", D: "Electrostatic force" }, correctAnswer: "B" },
          { id: 5406, text: "Which type of wave requires a medium to travel through?", options: { A: "Electromagnetic wave", B: "Light wave", C: "Mechanical wave", D: "Radio wave" }, correctAnswer: "C" }
        ]
      },
      {
        name: "Chemistry",
        questions: [
          { id: 5501, text: "What is the term for the energy required to remove one mole of electrons from one mole of gaseous atoms?", options: { A: "Electron affinity", B: "Ionisation energy", C: "Bond energy", D: "Lattice energy" }, correctAnswer: "B" },
          { id: 5502, text: "Which of the following is an example of a condensation polymer?", options: { A: "Polythene", B: "PVC", C: "Nylon", D: "Polystyrene" }, correctAnswer: "C" },
          { id: 5503, text: "What is the oxidising agent in the reaction: Zn + CuSO₄ → ZnSO₄ + Cu?", options: { A: "Zn", B: "ZnSO₄", C: "Cu", D: "CuSO₄" }, correctAnswer: "D" },
          { id: 5504, text: "How many moles are in 44 g of CO₂? (C=12, O=16)", options: { A: "0.5 mol", B: "1 mol", C: "2 mol", D: "4 mol" }, correctAnswer: "B" },
          { id: 5505, text: "Which test is used to identify the presence of starch?", options: { A: "Benedict's solution", B: "Biuret test", C: "Iodine solution", D: "Fehling's solution" }, correctAnswer: "C" },
          { id: 5506, text: "What is the shape of a methane (CH₄) molecule?", options: { A: "Linear", B: "Planar triangular", C: "Tetrahedral", D: "Octahedral" }, correctAnswer: "C" }
        ]
      },
      {
        name: "Biology",
        questions: [
          { id: 5601, text: "What is the term for a change in the DNA sequence of an organism?", options: { A: "Variation", B: "Mutation", C: "Adaptation", D: "Evolution" }, correctAnswer: "B" },
          { id: 5602, text: "Which part of the nephron is responsible for selective reabsorption?", options: { A: "Glomerulus", B: "Bowman's capsule", C: "Proximal convoluted tubule", D: "Loop of Henle" }, correctAnswer: "C" },
          { id: 5603, text: "What is the name of the theory that states organisms best adapted to their environment survive and reproduce?", options: { A: "Cell theory", B: "Germ theory", C: "Natural selection", D: "Lamarckism" }, correctAnswer: "C" },
          { id: 5604, text: "Which gas is produced as a by-product of photosynthesis?", options: { A: "Carbon dioxide", B: "Nitrogen", C: "Oxygen", D: "Hydrogen" }, correctAnswer: "C" },
          { id: 5605, text: "What is the function of the corpus luteum after ovulation?", options: { A: "Produce oestrogen only", B: "Produce progesterone to maintain the uterine lining", C: "Release the egg", D: "Stimulate the pituitary gland" }, correctAnswer: "B" },
          { id: 5606, text: "Which type of immunity is acquired through vaccination?", options: { A: "Natural passive", B: "Natural active", C: "Artificial passive", D: "Artificial active" }, correctAnswer: "D" }
        ]
      },
      {
        name: "Geography",
        questions: [
          { id: 5701, text: "What is the term for the gradual increase in Earth's average temperature due to greenhouse gases?", options: { A: "Ozone depletion", B: "Acid rain", C: "Global warming", D: "El Niño" }, correctAnswer: "C" },
          { id: 5702, text: "Which type of weathering involves the chemical breakdown of rocks?", options: { A: "Mechanical weathering", B: "Biological weathering", C: "Chemical weathering", D: "Freeze-thaw action" }, correctAnswer: "C" },
          { id: 5703, text: "What is the Human Development Index (HDI) used to measure?", options: { A: "A country's military strength", B: "Economic growth only", C: "Overall human well-being including health, education and income", D: "Population density" }, correctAnswer: "C" },
          { id: 5704, text: "Which African country has the largest population?", options: { A: "Ethiopia", B: "Egypt", C: "South Africa", D: "Nigeria" }, correctAnswer: "D" },
          { id: 5705, text: "What is the name of the process where river sediment is deposited at the mouth of a river?", options: { A: "Meander formation", B: "Delta formation", C: "Oxbow lake formation", D: "Floodplain formation" }, correctAnswer: "B" },
          { id: 5706, text: "Which international agreement aims to reduce carbon emissions globally?", options: { A: "Kyoto Protocol", B: "Montreal Protocol", C: "Geneva Convention", D: "Paris Agreement" }, correctAnswer: "D" }
        ]
      },
      {
        name: "Computer Studies",
        questions: [
          { id: 5801, text: "What is the difference between a class and an object in OOP?", options: { A: "They are the same thing", B: "A class is a blueprint; an object is an instance of a class", C: "An object is a blueprint; a class is an instance", D: "A class stores data; an object stores code" }, correctAnswer: "B" },
          { id: 5802, text: "Which SQL command is used to retrieve data from a database?", options: { A: "INSERT", B: "UPDATE", C: "SELECT", D: "DELETE" }, correctAnswer: "C" },
          { id: 5803, text: "What does 'https' indicate in a web address?", options: { A: "The site uses HTTP version 2", B: "The connection is encrypted and secure", C: "The site is hosted on a government server", D: "The site requires a login" }, correctAnswer: "B" },
          { id: 5804, text: "Which sorting algorithm has an average time complexity of O(n log n)?", options: { A: "Bubble sort", B: "Insertion sort", C: "Selection sort", D: "Merge sort" }, correctAnswer: "D" },
          { id: 5805, text: "What is the purpose of normalisation in database design?", options: { A: "To speed up queries", B: "To reduce data redundancy and improve integrity", C: "To encrypt sensitive data", D: "To increase storage capacity" }, correctAnswer: "B" },
          { id: 5806, text: "Which of the following best describes cloud computing?", options: { A: "Storing data on a local hard drive", B: "Using physical servers in your office", C: "Delivering computing services over the internet", D: "A type of operating system" }, correctAnswer: "C" }
        ]
      }
    ]
  },
  "12": {
    "TERM 1": [
      {
        name: "Mathematics",
        questions: [
          { id: 6101, text: "Differentiate y = 4x³ − 2x² + 5x − 1", options: { A: "12x² − 4x + 5", B: "4x² − 2x + 5", C: "12x² − 4x − 1", D: "12x³ − 4x + 5" }, correctAnswer: "A" },
          { id: 6102, text: "What is the sum to infinity of a geometric series with first term 8 and common ratio 0.5?", options: { A: "12", B: "14", C: "16", D: "20" }, correctAnswer: "C" },
          { id: 6103, text: "Evaluate: ∫₀² (3x²) dx", options: { A: "6", B: "8", C: "12", D: "24" }, correctAnswer: "B" },
          { id: 6104, text: "What are the roots of x² − 5x + 6 = 0?", options: { A: "x = 1 and x = 6", B: "x = 2 and x = 3", C: "x = −2 and x = −3", D: "x = 5 and x = 1" }, correctAnswer: "B" },
          { id: 6105, text: "What is the determinant of the matrix [[3, 1], [2, 4]]?", options: { A: "10", B: "12", C: "14", D: "16" }, correctAnswer: "A" },
          { id: 6106, text: "Which of the following is the correct binomial expansion of (1 + x)³?", options: { A: "1 + 3x + 3x² + x³", B: "1 + x + x² + x³", C: "3 + 3x + x²", D: "1 + 3x + x³" }, correctAnswer: "A" }
        ]
      },
      {
        name: "English",
        questions: [
          { id: 6201, text: "What is the term for a long narrative poem that tells the story of a heroic figure?", options: { A: "Sonnet", B: "Ballad", C: "Epic", D: "Ode" }, correctAnswer: "C" },
          { id: 6202, text: "Which rhetorical device involves asking a question not meant to be answered?", options: { A: "Anaphora", B: "Rhetorical question", C: "Chiasmus", D: "Epistrophe" }, correctAnswer: "B" },
          { id: 6203, text: "In critical writing, what does 'synthesise' mean?", options: { A: "Copy from multiple sources", B: "Summarise one source", C: "Combine ideas from multiple sources into a coherent argument", D: "Contradict an author's view" }, correctAnswer: "C" },
          { id: 6204, text: "Which of the following best defines 'diction' in literature?", options: { A: "The rhythm of a poem", B: "The choice and use of words by a writer", C: "The structure of a sentence", D: "The setting of a story" }, correctAnswer: "B" },
          { id: 6205, text: "What is the effect of using short, fragmented sentences in a narrative?", options: { A: "Creates a slow, reflective pace", B: "Adds complexity to the plot", C: "Creates urgency and tension", D: "Introduces new characters" }, correctAnswer: "C" },
          { id: 6206, text: "Which word correctly completes: 'The data ___ been analysed thoroughly.'?", options: { A: "have", B: "has", C: "is", D: "are" }, correctAnswer: "B" }
        ]
      },
      {
        name: "Kiswahili",
        questions: [
          { id: 6301, text: "Riwaya ni nini?", options: { A: "Shairi refu la masimulizi", B: "Hadithi ndefu ya kubuni yenye wahusika na matukio", C: "Mchezo wa kuigiza", D: "Mkusanyiko wa mashairi" }, correctAnswer: "B" },
          { id: 6302, text: "Katika fasihi, 'msimulizi' ni nani?", options: { A: "Mwandishi wa kitabu", B: "Sauti inayosimulia hadithi", C: "Mhusika mkuu", D: "Msomaji wa kitabu" }, correctAnswer: "B" },
          { id: 6303, text: "Neno 'dhana' lina maana gani?", options: { A: "Kitu halisi", B: "Wazo au fikira", C: "Hisia za moyo", D: "Tendo la kimwili" }, correctAnswer: "B" },
          { id: 6304, text: "Ni ipi kati ya hizi ni sifa ya ushairi wa kisasa wa Kiswahili?", options: { A: "Lazima uwe na vina na mizani", B: "Hauhitaji kufuata kanuni kali za vina na mizani", C: "Lazima uwe na beti nne tu", D: "Hausimuliwi hadharani" }, correctAnswer: "B" },
          { id: 6305, text: "Wingi wa neno 'shujaa' ni nini?", options: { A: "Mashujaa", B: "Vishujaa", C: "Washujaa", D: "Shujaa" }, correctAnswer: "A" },
          { id: 6306, text: "Kitenzi 'andika' katika hali ya kuamrisha wingi ni nini?", options: { A: "Andika", B: "Mwandike", C: "Andikeni", D: "Waandike" }, correctAnswer: "C" }
        ]
      },
      {
        name: "Physics",
        questions: [
          { id: 6401, text: "What is the photoelectric effect?", options: { A: "Emission of light by heated metals", B: "Emission of electrons when light hits a metal surface", C: "Absorption of photons by electrons", D: "Reflection of light off a metal surface" }, correctAnswer: "B" },
          { id: 6402, text: "What does E = mc² represent?", options: { A: "Kinetic energy of a moving object", B: "Equivalence of mass and energy", C: "Electric field strength", D: "Gravitational potential energy" }, correctAnswer: "B" },
          { id: 6403, text: "Which particle is emitted during beta-minus decay?", options: { A: "Proton", B: "Neutron", C: "Alpha particle", D: "Electron" }, correctAnswer: "D" },
          { id: 6404, text: "What is the Doppler effect?", options: { A: "Bending of waves around obstacles", B: "Change in observed frequency due to relative motion between source and observer", C: "Splitting of light into colours", D: "Interference of two wave sources" }, correctAnswer: "B" },
          { id: 6405, text: "In a p-n junction diode, current flows easily in which direction?", options: { A: "Reverse bias", B: "Both directions equally", C: "Forward bias", D: "Neither direction" }, correctAnswer: "C" },
          { id: 6406, text: "What is the SI unit of capacitance?", options: { A: "Henry", B: "Tesla", C: "Farad", D: "Weber" }, correctAnswer: "C" }
        ]
      },
      {
        name: "Chemistry",
        questions: [
          { id: 6501, text: "What is the rate expression for a reaction that is first order in A and second order in B?", options: { A: "rate = k[A][B]", B: "rate = k[A]²[B]", C: "rate = k[A][B]²", D: "rate = k[A]²[B]²" }, correctAnswer: "C" },
          { id: 6502, text: "Which of the following best describes a buffer solution?", options: { A: "A solution that changes pH rapidly", B: "A solution that resists changes in pH", C: "A neutral solution at pH 7", D: "A solution with no solute" }, correctAnswer: "B" },
          { id: 6503, text: "What is the Haber process used to produce?", options: { A: "Sulphuric acid", B: "Nitric acid", C: "Ammonia", D: "Chlorine" }, correctAnswer: "C" },
          { id: 6504, text: "Which type of reaction involves the addition of hydrogen to an unsaturated compound?", options: { A: "Oxidation", B: "Substitution", C: "Hydrogenation", D: "Elimination" }, correctAnswer: "C" },
          { id: 6505, text: "What does Le Chatelier's principle state?", options: { A: "Reactions always go to completion", B: "A system at equilibrium shifts to oppose any imposed change", C: "Catalysts change the equilibrium position", D: "Temperature has no effect on equilibrium" }, correctAnswer: "B" },
          { id: 6506, text: "What is the hybridisation of carbon in ethene (C₂H₄)?", options: { A: "sp³", B: "sp²", C: "sp", D: "dsp²" }, correctAnswer: "B" }
        ]
      },
      {
        name: "Biology",
        questions: [
          { id: 6601, text: "What is the role of ATP in cellular processes?", options: { A: "It stores genetic information", B: "It acts as the cell's energy currency", C: "It catalyses chemical reactions", D: "It transports oxygen in the blood" }, correctAnswer: "B" },
          { id: 6602, text: "What is the term for the complete set of genes in an organism?", options: { A: "Phenotype", B: "Proteome", C: "Genome", D: "Transcriptome" }, correctAnswer: "C" },
          { id: 6603, text: "Which process produces four genetically unique haploid cells?", options: { A: "Mitosis", B: "Binary fission", C: "Meiosis", D: "Budding" }, correctAnswer: "C" },
          { id: 6604, text: "What is the name of the enzyme that unzips the DNA double helix during replication?", options: { A: "DNA polymerase", B: "RNA polymerase", C: "Ligase", D: "Helicase" }, correctAnswer: "D" },
          { id: 6605, text: "Which immunoglobulin is most abundant in blood serum?", options: { A: "IgA", B: "IgE", C: "IgG", D: "IgM" }, correctAnswer: "C" },
          { id: 6606, text: "What is the term for the variety of ecosystems within a region?", options: { A: "Species diversity", B: "Genetic diversity", C: "Ecosystem diversity", D: "Functional diversity" }, correctAnswer: "C" }
        ]
      },
      {
        name: "Geography",
        questions: [
          { id: 6701, text: "What is the term for the movement of people out of a country permanently?", options: { A: "Immigration", B: "Emigration", C: "Refugee displacement", D: "Urbanisation" }, correctAnswer: "B" },
          { id: 6702, text: "Which economic sector involves providing services rather than producing goods?", options: { A: "Primary", B: "Secondary", C: "Tertiary", D: "Quaternary" }, correctAnswer: "C" },
          { id: 6703, text: "What is the name of the supercontinent that existed 300 million years ago?", options: { A: "Laurasia", B: "Gondwana", C: "Pangaea", D: "Rodinia" }, correctAnswer: "C" },
          { id: 6704, text: "Which of the following is a push factor for migration?", options: { A: "Better job opportunities elsewhere", B: "Poverty and unemployment at home", C: "Good healthcare in the destination", D: "Political stability abroad" }, correctAnswer: "B" },
          { id: 6705, text: "What is the term for the boundary where two air masses of different temperatures meet?", options: { A: "Isobar", B: "Isotherm", C: "Front", D: "Trough" }, correctAnswer: "C" },
          { id: 6706, text: "Which organisation promotes free trade among African nations?", options: { A: "AU", B: "AfCFTA", C: "COMESA", D: "SADC" }, correctAnswer: "B" }
        ]
      },
      {
        name: "Computer Studies",
        questions: [
          { id: 6801, text: "What is the purpose of an operating system's scheduler?", options: { A: "Manage disk storage", B: "Allocate CPU time to processes", C: "Handle network connections", D: "Render graphics" }, correctAnswer: "B" },
          { id: 6802, text: "Which of the following is an example of a heuristic algorithm?", options: { A: "Binary search", B: "Bubble sort", C: "A* pathfinding", D: "Linear search" }, correctAnswer: "C" },
          { id: 6803, text: "What does 'polymorphism' mean in OOP?", options: { A: "A class can only have one method", B: "Objects of different classes can be treated as the same type", C: "A class inherits from multiple parents", D: "Data is hidden from outside the class" }, correctAnswer: "B" },
          { id: 6804, text: "Which protocol is used to send emails?", options: { A: "FTP", B: "HTTP", C: "SMTP", D: "DNS" }, correctAnswer: "C" },
          { id: 6805, text: "What is a deadlock in an operating system?", options: { A: "A virus that locks files", B: "When two or more processes wait indefinitely for each other's resources", C: "A corrupted hard drive", D: "A failed network connection" }, correctAnswer: "B" },
          { id: 6806, text: "What is the hexadecimal equivalent of the decimal number 255?", options: { A: "EF", B: "FE", C: "FF", D: "F0" }, correctAnswer: "C" }
        ]
      }
    ],
    "TERM 2": [
      {
        name: "Mathematics",
        questions: [
          { id: 7101, text: "What is the second derivative of y = 5x⁴ − 3x²?", options: { A: "20x³ − 6x", B: "60x² − 6", C: "20x³ − 3", D: "60x³ − 6x" }, correctAnswer: "B" },
          { id: 7102, text: "Find the value of x: eˣ = 20 (give answer to 3 s.f.)", options: { A: "2.77", B: "2.99", C: "3.00", D: "3.04" }, correctAnswer: "C" },
          { id: 7103, text: "What is the scalar product of vectors a = (2, 3) and b = (4, −1)?", options: { A: "5", B: "8", C: "11", D: "14" }, correctAnswer: "A" },
          { id: 7104, text: "How many ways can 5 people be arranged in a line?", options: { A: "25", B: "60", C: "120", D: "240" }, correctAnswer: "C" },
          { id: 7105, text: "What is the equation of a circle with centre (2, −3) and radius 5?", options: { A: "(x−2)² + (y+3)² = 5", B: "(x+2)² + (y−3)² = 25", C: "(x−2)² + (y+3)² = 25", D: "(x−2)² + (y−3)² = 25" }, correctAnswer: "C" },
          { id: 7106, text: "Resolve into partial fractions: 5/(x(x+1))", options: { A: "5/x − 5/(x+1)", B: "1/x + 1/(x+1)", C: "5/x + 5/(x+1)", D: "1/(x+1) − 1/x" }, correctAnswer: "A" }
        ]
      },
      {
        name: "English",
        questions: [
          { id: 7201, text: "What is the term for the repetition of a word or phrase at the beginning of successive clauses?", options: { A: "Epistrophe", B: "Chiasmus", C: "Anaphora", D: "Asyndeton" }, correctAnswer: "C" },
          { id: 7202, text: "Which of the following is a characteristic of postcolonial literature?", options: { A: "Celebration of colonial rule", B: "Exploration of identity, displacement and cultural conflict", C: "Focus exclusively on European settings", D: "Avoidance of political themes" }, correctAnswer: "B" },
          { id: 7203, text: "What is 'stream of consciousness' as a narrative technique?", options: { A: "A story told in strict chronological order", B: "A technique that presents a character's continuous flow of thoughts", C: "A story narrated by multiple characters", D: "A technique using only dialogue" }, correctAnswer: "B" },
          { id: 7204, text: "Which of the following is an example of a Shakespearean sonnet structure?", options: { A: "Three quatrains and a couplet (ABAB CDCD EFEF GG)", B: "Two quatrains and a sestet (ABBA ABBA CDECDE)", C: "Four tercets and a couplet", D: "Eight lines with alternating rhyme" }, correctAnswer: "A" },
          { id: 7205, text: "What does 'verisimilitude' mean in literature?", options: { A: "The use of exaggeration for effect", B: "The appearance of being true or real", C: "A sudden reversal of fortune", D: "A moment of critical realisation" }, correctAnswer: "B" },
          { id: 7206, text: "Which sentence uses the subjunctive mood correctly?", options: { A: "I wish I was taller.", B: "If I was you, I would leave.", C: "I wish I were taller.", D: "She acts as if she was the boss." }, correctAnswer: "C" }
        ]
      },
      {
        name: "Kiswahili",
        questions: [
          { id: 7301, text: "Mchezo wa kuigiza una sehemu kuu ngapi?", options: { A: "Mbili", B: "Tatu", C: "Nne", D: "Tano" }, correctAnswer: "B" },
          { id: 7302, text: "Katika tamthilia, 'mzozo' unamaanisha nini?", options: { A: "Mwisho wa hadithi", B: "Mgongano kati ya wahusika au nguvu", C: "Utangulizi wa hadithi", D: "Mazingira ya hadithi" }, correctAnswer: "B" },
          { id: 7303, text: "Neno 'taswira' katika fasihi linamaanisha nini?", options: { A: "Mhusika mkuu", B: "Picha inayoundwa akilini mwa msomaji kupitia maneno", C: "Aina ya shairi", D: "Muundo wa sentensi" }, correctAnswer: "B" },
          { id: 7304, text: "Ni ipi kati ya hizi ni ngeli ya 'N-N'?", options: { A: "Mtu / Watu", B: "Kisu / Visu", C: "Ndege / Ndege", D: "Jiwe / Mawe" }, correctAnswer: "C" },
          { id: 7305, text: "Kitenzi 'penda' katika hali ya kukataa wakati uliopita ni nini?", options: { A: "Sikupenda", B: "Sipendi", C: "Sitapenda", D: "Sipendaga" }, correctAnswer: "A" },
          { id: 7306, text: "Tamko 'Damu nzito kuliko maji' linamaanisha nini?", options: { A: "Damu ina uzito zaidi", B: "Familia ni muhimu zaidi kuliko marafiki", C: "Maji ni muhimu kwa maisha", D: "Ndugu hawapendani" }, correctAnswer: "B" }
        ]
      },
      {
        name: "Physics",
        questions: [
          { id: 7401, text: "What is the de Broglie wavelength of a particle?", options: { A: "λ = hf", B: "λ = h/mv", C: "λ = mv/h", D: "λ = mc²" }, correctAnswer: "B" },
          { id: 7402, text: "In nuclear fission, what happens to the nucleus?", options: { A: "It absorbs a neutron and becomes stable", B: "It splits into smaller nuclei releasing energy", C: "It emits an alpha particle only", D: "It combines with another nucleus" }, correctAnswer: "B" },
          { id: 7403, text: "What is the function of a moderator in a nuclear reactor?", options: { A: "Absorb excess neutrons to stop the reaction", B: "Slow down fast neutrons to sustain the chain reaction", C: "Cool the reactor core", D: "Convert heat to electricity" }, correctAnswer: "B" },
          { id: 7404, text: "Which gate produces an output of 1 only when both inputs are 1?", options: { A: "OR gate", B: "NOT gate", C: "AND gate", D: "NAND gate" }, correctAnswer: "C" },
          { id: 7405, text: "What is the formula for the energy of a photon?", options: { A: "E = mv²", B: "E = hf", C: "E = mc", D: "E = qV" }, correctAnswer: "B" },
          { id: 7406, text: "What does a Geiger-Müller tube detect?", options: { A: "Magnetic fields", B: "Sound waves", C: "Ionising radiation", D: "Electric fields" }, correctAnswer: "C" }
        ]
      },
      {
        name: "Chemistry",
        questions: [
          { id: 7501, text: "What is the term for the enthalpy change when one mole of a compound is formed from its elements in their standard states?", options: { A: "Enthalpy of combustion", B: "Enthalpy of neutralisation", C: "Enthalpy of formation", D: "Enthalpy of atomisation" }, correctAnswer: "C" },
          { id: 7502, text: "Which of the following is a characteristic of transition metals?", options: { A: "They form only one type of ion", B: "They are all non-conductors", C: "They form coloured compounds and act as catalysts", D: "They have very low melting points" }, correctAnswer: "C" },
          { id: 7503, text: "What is the Contact process used to manufacture?", options: { A: "Ammonia", B: "Sulphuric acid", C: "Nitric acid", D: "Hydrochloric acid" }, correctAnswer: "B" },
          { id: 7504, text: "Which type of chromatography separates compounds based on their affinity for a stationary and mobile phase?", options: { A: "Distillation", B: "Electrophoresis", C: "Column chromatography", D: "Crystallisation" }, correctAnswer: "C" },
          { id: 7505, text: "What is the term for the minimum energy required for a reaction to occur?", options: { A: "Enthalpy change", B: "Bond energy", C: "Activation energy", D: "Lattice energy" }, correctAnswer: "C" },
          { id: 7506, text: "Which of the following is produced when an ester reacts with sodium hydroxide?", options: { A: "An alcohol and an acid", B: "A salt and water", C: "A soap and an alcohol", D: "An aldehyde and water" }, correctAnswer: "C" }
        ]
      },
      {
        name: "Biology",
        questions: [
          { id: 7601, text: "What is the term for the movement of alleles between populations through migration?", options: { A: "Genetic drift", B: "Natural selection", C: "Gene flow", D: "Mutation" }, correctAnswer: "C" },
          { id: 7602, text: "Which molecule acts as the anticodon carrier during translation?", options: { A: "mRNA", B: "rRNA", C: "tRNA", D: "DNA" }, correctAnswer: "C" },
          { id: 7603, text: "What is the Hardy-Weinberg principle used to describe?", options: { A: "Rate of mutation in a population", B: "Allele frequencies in a non-evolving population", C: "Speed of natural selection", D: "Rate of genetic recombination" }, correctAnswer: "B" },
          { id: 7604, text: "Which hormone triggers the 'fight or flight' response?", options: { A: "Insulin", B: "Thyroxine", C: "Adrenaline", D: "Cortisol" }, correctAnswer: "C" },
          { id: 7605, text: "What is the name of the process by which bacteria transfer genetic material through direct contact?", options: { A: "Transformation", B: "Transduction", C: "Conjugation", D: "Replication" }, correctAnswer: "C" },
          { id: 7606, text: "Which type of cell junction allows direct communication between adjacent cells?", options: { A: "Tight junction", B: "Desmosome", C: "Gap junction", D: "Adherens junction" }, correctAnswer: "C" }
        ]
      },
      {
        name: "Geography",
        questions: [
          { id: 7701, text: "What is the term for the process by which cities expand outward into surrounding rural areas?", options: { A: "Gentrification", B: "Urban sprawl", C: "Counter-urbanisation", D: "Suburbanisation" }, correctAnswer: "B" },
          { id: 7702, text: "Which of the following best describes a 'primate city'?", options: { A: "A city with the most wildlife", B: "A city that is disproportionately large compared to others in the country", C: "The oldest city in a country", D: "A city with the highest GDP" }, correctAnswer: "B" },
          { id: 7703, text: "What is the name of the phenomenon where urban areas are significantly warmer than surrounding rural areas?", options: { A: "Greenhouse effect", B: "Urban heat island", C: "Thermal inversion", D: "Albedo effect" }, correctAnswer: "B" },
          { id: 7704, text: "Which type of aid is given as a loan that must be repaid with interest?", options: { A: "Bilateral aid", B: "Multilateral aid", C: "Tied aid", D: "Soft loan" }, correctAnswer: "D" },
          { id: 7705, text: "What is the term for the sustainable management of forests to meet present needs without compromising future generations?", options: { A: "Afforestation", B: "Deforestation", C: "Sustainable forestry", D: "Reforestation" }, correctAnswer: "C" },
          { id: 7706, text: "Which index measures inequality in income distribution within a country?", options: { A: "HDI", B: "GDP per capita", C: "Gini coefficient", D: "PPP index" }, correctAnswer: "C" }
        ]
      },
      {
        name: "Computer Studies",
        questions: [
          { id: 7801, text: "What is the purpose of a foreign key in a relational database?", options: { A: "To uniquely identify each record", B: "To link two tables together", C: "To encrypt sensitive data", D: "To speed up queries" }, correctAnswer: "B" },
          { id: 7802, text: "Which of the following describes a man-in-the-middle attack?", options: { A: "Flooding a server with requests", B: "Intercepting communication between two parties without their knowledge", C: "Guessing a user's password", D: "Installing malware via email" }, correctAnswer: "B" },
          { id: 7803, text: "What is the function of the ALU in a CPU?", options: { A: "Store program instructions", B: "Manage input and output devices", C: "Perform arithmetic and logical operations", D: "Control the fetch-decode-execute cycle" }, correctAnswer: "C" },
          { id: 7804, text: "Which of the following is a lossless compression format?", options: { A: "JPEG", B: "MP3", C: "PNG", D: "MPEG" }, correctAnswer: "C" },
          { id: 7805, text: "What does 'encapsulation' mean in OOP?", options: { A: "A class inheriting from another class", B: "Bundling data and methods together and restricting direct access", C: "One method performing multiple tasks", D: "Creating multiple instances of a class" }, correctAnswer: "B" },
          { id: 7806, text: "What is the purpose of a DNS server?", options: { A: "Assign IP addresses to devices", B: "Translate domain names into IP addresses", C: "Filter malicious web traffic", D: "Store website files" }, correctAnswer: "B" }
        ]
      }
    ],
    "TERM 3": [
      {
        name: "Mathematics",
        questions: [
          { id: 8101, text: "What is the integral of 1/x dx?", options: { A: "x + C", B: "ln|x| + C", C: "eˣ + C", D: "1/x² + C" }, correctAnswer: "B" },
          { id: 8102, text: "A geometric sequence has first term 3 and common ratio 2. What is the 6th term?", options: { A: "48", B: "64", C: "96", D: "192" }, correctAnswer: "C" },
          { id: 8103, text: "What is the angle between two vectors a and b if their scalar product is 0?", options: { A: "0°", B: "45°", C: "90°", D: "180°" }, correctAnswer: "C" },
          { id: 8104, text: "Solve: 2sin(x) = 1 for 0° ≤ x ≤ 360°", options: { A: "x = 30° only", B: "x = 30° and 150°", C: "x = 60° and 120°", D: "x = 45° and 135°" }, correctAnswer: "B" },
          { id: 8105, text: "What is the coefficient of x³ in the expansion of (2 + x)⁵?", options: { A: "40", B: "80", C: "160", D: "320" }, correctAnswer: "B" },
          { id: 8106, text: "A committee of 3 is chosen from 7 people. How many combinations are possible?", options: { A: "21", B: "35", C: "42", D: "210" }, correctAnswer: "B" }
        ]
      },
      {
        name: "English",
        questions: [
          { id: 8201, text: "What is the term for a narrative that has a second, symbolic meaning beneath the literal one?", options: { A: "Parody", B: "Allegory", C: "Pastiche", D: "Satire" }, correctAnswer: "B" },
          { id: 8202, text: "Which of the following best describes 'intertextuality'?", options: { A: "Writing in multiple languages", B: "The relationship between a text and other texts it references or echoes", C: "Using footnotes in academic writing", D: "Translating a text into another form" }, correctAnswer: "B" },
          { id: 8203, text: "What is the effect of an unreliable narrator in a story?", options: { A: "It makes the plot easier to follow", B: "It creates ambiguity and encourages the reader to question the truth", C: "It speeds up the pace of the narrative", D: "It removes all conflict from the story" }, correctAnswer: "B" },
          { id: 8204, text: "Which of the following is an example of a Petrarchan sonnet?", options: { A: "Three quatrains and a couplet", B: "An octave presenting a problem and a sestet offering a resolution", C: "Four stanzas of equal length", D: "A poem with no fixed rhyme scheme" }, correctAnswer: "B" },
          { id: 8205, text: "What does 'catharsis' mean in the context of tragedy?", options: { A: "The climax of the plot", B: "The emotional purging or release felt by the audience", C: "The downfall of the protagonist", D: "The moral lesson of the play" }, correctAnswer: "B" },
          { id: 8206, text: "Which of the following is a feature of magical realism?", options: { A: "Strict adherence to scientific facts", B: "Magical elements presented as a normal part of reality", C: "Stories set entirely in fantasy worlds", D: "Absence of any realistic characters" }, correctAnswer: "B" }
        ]
      },
      {
        name: "Kiswahili",
        questions: [
          { id: 8301, text: "Katika fasihi simulizi, 'hadithi' hutofautiana na 'ngano' vipi?", options: { A: "Hadithi ni za kweli; ngano ni za kubuni", B: "Ngano mara nyingi zina wanyama na mafunzo ya maadili; hadithi ni pana zaidi", C: "Hadithi huimbwa; ngano husomwa", D: "Hazitofautiani kabisa" }, correctAnswer: "B" },
          { id: 8302, text: "Neno 'sitiari' katika lugha ya Kiswahili linamaanisha nini?", options: { A: "Kulinganisha vitu kwa kutumia 'kama'", B: "Kusema kitu kwa njia ya mfano bila kutumia 'kama'", C: "Kurudia maneno kwa msisitizo", D: "Kutumia sauti za asili" }, correctAnswer: "B" },
          { id: 8303, text: "Mwandishi wa riwaya maarufu ya 'Utengano' ni nani?", options: { A: "Shaaban Robert", B: "Said Ahmed Mohamed", C: "Euphrase Kezilahabi", D: "Mohamed Suleiman Mohamed" }, correctAnswer: "B" },
          { id: 8304, text: "Katika muundo wa insha, 'hitimisho' lina kazi gani?", options: { A: "Kutoa hoja mpya", B: "Kufupisha hoja na kutoa mwisho wenye nguvu", C: "Kuanzisha mada", D: "Kutoa mifano" }, correctAnswer: "B" },
          { id: 8305, text: "Kitenzi 'jenga' katika hali ya kutendwa ni nini?", options: { A: "Jengwa", B: "Jengewa", C: "Jengana", D: "Jengeka" }, correctAnswer: "A" },
          { id: 8306, text: "Neno 'mazingira' katika fasihi linamaanisha nini?", options: { A: "Wahusika wa hadithi", B: "Wakati na mahali ambapo hadithi inajiri", C: "Maudhui ya kazi ya fasihi", D: "Mtindo wa mwandishi" }, correctAnswer: "B" }
        ]
      },
      {
        name: "Physics",
        questions: [
          { id: 8401, text: "What is the principle of superposition of waves?", options: { A: "Waves cancel each other out completely", B: "The resultant displacement is the vector sum of individual displacements", C: "Waves speed up when they meet", D: "Only transverse waves can superpose" }, correctAnswer: "B" },
          { id: 8402, text: "What is the binding energy per nucleon a measure of?", options: { A: "The speed of the nucleus", B: "The stability of the nucleus", C: "The charge of the nucleus", D: "The temperature of the nucleus" }, correctAnswer: "B" },
          { id: 8403, text: "Which semiconductor device amplifies electrical signals?", options: { A: "Diode", B: "Capacitor", C: "Transistor", D: "Resistor" }, correctAnswer: "C" },
          { id: 8404, text: "What is the Heisenberg Uncertainty Principle?", options: { A: "Energy is always conserved in a closed system", B: "It is impossible to know both the exact position and momentum of a particle simultaneously", C: "Light behaves as both a wave and a particle", D: "Every action has an equal and opposite reaction" }, correctAnswer: "B" },
          { id: 8405, text: "What type of spectrum is produced by a hot, low-pressure gas?", options: { A: "Continuous spectrum", B: "Absorption spectrum", C: "Line emission spectrum", D: "Blackbody spectrum" }, correctAnswer: "C" },
          { id: 8406, text: "What is the main source of energy in stars like the Sun?", options: { A: "Nuclear fission", B: "Chemical combustion", C: "Gravitational collapse", D: "Nuclear fusion" }, correctAnswer: "D" }
        ]
      },
      {
        name: "Chemistry",
        questions: [
          { id: 8501, text: "What is the term for the energy released when one mole of gaseous ions is formed from gaseous atoms?", options: { A: "Electron affinity", B: "Ionisation energy", C: "Lattice enthalpy", D: "Bond dissociation energy" }, correctAnswer: "B" },
          { id: 8502, text: "Which of the following is an example of a nucleophilic substitution reaction?", options: { A: "Bromination of benzene", B: "Hydrolysis of a halogenoalkane with NaOH", C: "Combustion of methane", D: "Cracking of alkanes" }, correctAnswer: "B" },
          { id: 8503, text: "What does a high value of Kc indicate about an equilibrium reaction?", options: { A: "The reaction is very slow", B: "Products are favoured at equilibrium", C: "Reactants are favoured at equilibrium", D: "The reaction is endothermic" }, correctAnswer: "B" },
          { id: 8504, text: "Which analytical technique uses the absorption of electromagnetic radiation to identify elements?", options: { A: "Mass spectrometry", B: "Atomic absorption spectroscopy", C: "Infrared spectroscopy", D: "NMR spectroscopy" }, correctAnswer: "B" },
          { id: 8505, text: "What is the product of the reaction between ethanol and ethanoic acid in the presence of an acid catalyst?", options: { A: "Ethane", B: "Ethyl ethanoate", C: "Diethyl ether", D: "Acetaldehyde" }, correctAnswer: "B" },
          { id: 8506, text: "Which of the following best describes a Brønsted-Lowry acid?", options: { A: "A substance that accepts electrons", B: "A substance that donates protons", C: "A substance that produces OH⁻ ions", D: "A substance that accepts protons" }, correctAnswer: "B" }
        ]
      },
      {
        name: "Biology",
        questions: [
          { id: 8601, text: "What is the term for the complete sequence of DNA in an organism including all its genes?", options: { A: "Proteome", B: "Transcriptome", C: "Genome", D: "Metabolome" }, correctAnswer: "C" },
          { id: 8602, text: "Which process describes the conversion of atmospheric nitrogen into ammonia by bacteria?", options: { A: "Denitrification", B: "Nitrification", C: "Nitrogen fixation", D: "Ammonification" }, correctAnswer: "C" },
          { id: 8603, text: "What is the role of the hypothalamus in thermoregulation?", options: { A: "It produces sweat directly", B: "It acts as the body's thermostat, detecting temperature changes and coordinating responses", C: "It stores heat energy", D: "It controls breathing rate only" }, correctAnswer: "B" },
          { id: 8604, text: "Which of the following is a correct description of apoptosis?", options: { A: "Uncontrolled cell division", B: "Programmed cell death that is essential for development and homeostasis", C: "Cell division by mitosis", D: "Viral infection of a cell" }, correctAnswer: "B" },
          { id: 8605, text: "What is the term for the total amount of living organic matter in an ecosystem?", options: { A: "Biodiversity", B: "Biomass", C: "Productivity", D: "Carrying capacity" }, correctAnswer: "B" },
          { id: 8606, text: "Which technique is used to produce multiple identical copies of a DNA fragment in vitro?", options: { A: "Gel electrophoresis", B: "DNA sequencing", C: "Polymerase Chain Reaction (PCR)", D: "Southern blotting" }, correctAnswer: "C" }
        ]
      },
      {
        name: "Geography",
        questions: [
          { id: 8701, text: "What is the term for the long-term shift in global climate patterns attributed largely to human activity?", options: { A: "El Niño", B: "Climate change", C: "Seasonal variation", D: "Thermal expansion" }, correctAnswer: "B" },
          { id: 8702, text: "Which of the following best describes 'sustainable development'?", options: { A: "Economic growth at any environmental cost", B: "Development that meets present needs without compromising future generations", C: "Halting all industrial activity", D: "Focusing only on social development" }, correctAnswer: "B" },
          { id: 8703, text: "What is the name of the process by which salt water is converted to fresh water?", options: { A: "Filtration", B: "Condensation", C: "Desalination", D: "Precipitation" }, correctAnswer: "C" },
          { id: 8704, text: "Which of the following is a consequence of rapid urbanisation in developing countries?", options: { A: "Reduced rural-urban migration", B: "Growth of informal settlements and strain on infrastructure", C: "Improved air quality", D: "Decreased population density" }, correctAnswer: "B" },
          { id: 8705, text: "What is the term for the variety of species, genes and ecosystems in a region?", options: { A: "Carrying capacity", B: "Ecological footprint", C: "Biodiversity", D: "Biomass" }, correctAnswer: "C" },
          { id: 8706, text: "Which of the following is an example of a transnational corporation (TNC)?", options: { A: "A local market trader", B: "A national government ministry", C: "Apple Inc.", D: "A village cooperative" }, correctAnswer: "C" }
        ]
      },
      {
        name: "Computer Studies",
        questions: [
          { id: 8801, text: "What is the purpose of a firewall in a network?", options: { A: "Speed up data transmission", B: "Monitor and control incoming and outgoing network traffic based on security rules", C: "Compress files for storage", D: "Assign IP addresses to devices" }, correctAnswer: "B" },
          { id: 8802, text: "Which of the following describes 'abstraction' in computer science?", options: { A: "Writing code without comments", B: "Hiding complex implementation details and showing only essential features", C: "Using multiple programming languages", D: "Storing data in binary format" }, correctAnswer: "B" },
          { id: 8803, text: "What is the worst-case time complexity of quicksort?", options: { A: "O(n)", B: "O(n log n)", C: "O(n²)", D: "O(log n)" }, correctAnswer: "C" },
          { id: 8804, text: "Which of the following is a feature of a distributed system?", options: { A: "All processing occurs on a single machine", B: "Components on networked computers communicate and coordinate to achieve a common goal", C: "It requires no network connection", D: "It can only handle one user at a time" }, correctAnswer: "B" },
          { id: 8805, text: "What does 'inheritance' allow in object-oriented programming?", options: { A: "A class to hide its data from other classes", B: "A class to acquire properties and methods from another class", C: "An object to change its type at runtime", D: "A method to call itself" }, correctAnswer: "B" },
          { id: 8806, text: "Which of the following is an ethical concern related to artificial intelligence?", options: { A: "AI systems run too slowly", B: "AI requires too much storage", C: "Algorithmic bias and lack of transparency in decision-making", D: "AI cannot process images" }, correctAnswer: "C" }
        ]
      }
    ]
  }
};