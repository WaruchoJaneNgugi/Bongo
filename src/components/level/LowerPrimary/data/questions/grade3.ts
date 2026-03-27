/**
 * data/questions/grade3.ts
 * All Grade 3 questions — 7 per subject, 8 subjects = 56 questions.
 */

import type { SubjectId, Question } from "../../types";

const grade3: Record<SubjectId, Question[]> = {
    literacy: [
        { q: "A 'metaphor' is:", opts: ["A comparison using 'like' or 'as'", "A direct comparison without 'like' or 'as'", "A rhyming pattern", "A type of punctuation"], ans: 1 },
        { q: "Which is an example of a simile?", opts: ["Life is a journey.", "She ran like the wind.", "The stars danced.", "His heart is ice."], ans: 1 },
        { q: "Main idea of a paragraph is in the:", opts: ["Last sentence", "Supporting detail", "Topic sentence", "Punctuation mark"], ans: 2 },
        { q: "Antonym of 'ancient' is:", opts: ["Old", "Modern", "Historical", "Aged"], ans: 1 },
        { q: "A 'biography' is about:", opts: ["A made-up character", "A real person's life", "A fantasy world", "An animal"], ans: 1 },
        { q: "Suffix '-ful' in 'beautiful' means:", opts: ["Without", "Full of", "Before", "Against"], ans: 1 },
        { q: "Which text type gives instructions?", opts: ["Narrative", "Poem", "Procedure text", "Journal"], ans: 2 },
    ],
    kiswahili: [
        { q: "Nomino katika 'Mtoto mzuri anacheza' ni:", opts: ["Mzuri", "Mtoto", "Anacheza", "Mzuri anacheza"], ans: 1 },
        { q: "Kitenzi 'SOMA' wakati uliopita ni:", opts: ["Anasoma", "Alisoma", "Atasoma", "Kusoma"], ans: 1 },
        { q: "Kinyume cha neno 'KUBWA' ni:", opts: ["Nzuri", "Mrefu", "Kidogo", "Nyeupe"], ans: 2 },
        { q: "Lugha rasmi za Kenya ni:", opts: ["Kiswahili tu", "Kiingereza tu", "Kiswahili na Kiingereza", "Kikuyu na Dholuo"], ans: 2 },
        { q: "Methali 'Haba na haba hujaza kibaba' inamaanisha:", opts: ["Haraka haina baraka", "Kidogo kidogo hujengea mkubwa", "Umoja ni nguvu", "Akili ni nywele"], ans: 1 },
        { q: "Sentensi kamili lazima iwe na:", opts: ["Nomino tu", "Kitenzi tu", "Nomino na kitenzi", "Kivumishi tu"], ans: 2 },
        { q: "Uandishi mzuri wa hadithi una:", opts: ["Mwanzo tu", "Katikati tu", "Mwisho tu", "Mwanzo, katikati na mwisho"], ans: 3 },
    ],
    english: [
        { q: "Passive voice of 'The boy kicked the ball':", opts: ["The ball kicked the boy.", "The ball was kicked by the boy.", "The boy is kicking the ball.", "The boy had kicked."], ans: 1 },
        { q: "A compound sentence:", opts: ["She ran.", "He sings and she dances.", "Running fast.", "The red car."], ans: 1 },
        { q: "'There ___ two dogs in the yard.'", opts: ["is", "are", "was", "am"], ans: 1 },
        { q: "A 'homophone' has:", opts: ["Opposite meanings", "Same sound, different meaning", "Same meaning", "Words that rhyme"], ans: 1 },
        { q: "Superlative of 'good':", opts: ["Gooder", "Better", "Best", "More good"], ans: 2 },
        { q: "Adverb in 'She speaks very softly':", opts: ["She", "Speaks", "Very", "Softly"], ans: 3 },
        { q: "Reported speech:", opts: ["He said, 'I am happy.'", "He said that he was happy.", "Am I happy?", "He is happy!"], ans: 1 },
    ],
    mathematics: [
        { q: "234 + 567 =", opts: ["791", "801", "811", "821"], ans: 1 },
        { q: "Perimeter of a rectangle 5cm × 3cm:", opts: ["8cm", "15cm", "16cm", "20cm"], ans: 2 },
        { q: "7 × 8 =", opts: ["54", "55", "56", "57"], ans: 2 },
        { q: "500 ÷ 5 =", opts: ["10", "100", "50", "25"], ans: 1 },
        { q: "Which number is prime?", opts: ["4", "6", "7", "9"], ans: 2 },
        { q: "Round 347 to the nearest hundred:", opts: ["200", "300", "400", "350"], ans: 2 },
        { q: "6 hours is what fraction of a day?", opts: ["1/2", "1/3", "1/4", "1/6"], ans: 2 },
    ],
    environmental: [
        { q: "Water cycle includes evaporation, condensation, and:", opts: ["Pollution", "Precipitation", "Combustion", "Erosion"], ans: 1 },
        { q: "Plants absorb ___ during photosynthesis:", opts: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"], ans: 2 },
        { q: "Soil erosion is caused by:", opts: ["Planting trees", "Overgrazing and deforestation", "Building stone walls", "Irrigating farms"], ans: 1 },
        { q: "Kenya's highest mountain:", opts: ["Mt. Elgon", "Mt. Kilimanjaro", "Mt. Kenya", "Aberdare Range"], ans: 2 },
        { q: "Main source of energy for Earth:", opts: ["The moon", "Wind", "The Sun", "Coal"], ans: 2 },
        { q: "'Ecosystem' means:", opts: ["A type of weather", "Living things and their non-living environment", "A water source", "A type of soil"], ans: 1 },
        { q: "Which practice conserves water?", opts: ["Leaving taps running", "Fixing leaking pipes", "Watering at hot midday", "Using water carelessly"], ans: 1 },
    ],
    hygiene: [
        { q: "Lack of Vitamin C causes:", opts: ["Rickets", "Scurvy", "Night blindness", "Anaemia"], ans: 1 },
        { q: "First aid for a minor cut:", opts: ["Ignoring it", "Cleaning and bandaging", "Rubbing soil on it", "Leaving it open"], ans: 1 },
        { q: "BCG vaccine prevents:", opts: ["Malaria", "HIV", "Tuberculosis (TB)", "Typhoid"], ans: 2 },
        { q: "Cholera is spread through:", opts: ["Air", "Contaminated food and water", "Mosquito bites", "Touch"], ans: 1 },
        { q: "Main nutrient for energy:", opts: ["Proteins", "Vitamins", "Carbohydrates", "Minerals"], ans: 2 },
        { q: "Personal hygiene EXCLUDES:", opts: ["Bathing regularly", "Washing hands", "Wearing dirty clothes", "Brushing teeth"], ans: 2 },
        { q: "BMI measures:", opts: ["Height only", "Weight only", "Weight and height relationship", "Age and health"], ans: 2 },
    ],
    religious: [
        { q: "Prophet Muhammad's journey from Mecca was to:", opts: ["Egypt", "Medina", "Jerusalem", "Baghdad"], ans: 1 },
        { q: "Ten Commandments were given to:", opts: ["Abraham", "David", "Moses", "Solomon"], ans: 2 },
        { q: "Ubuntu philosophy originates from:", opts: ["Asia", "Europe", "Africa", "America"], ans: 2 },
        { q: "Holy month of fasting for Muslims:", opts: ["Muharram", "Ramadhan", "Shawwal", "Dhul Hijja"], ans: 1 },
        { q: "The Hindu festival of lights:", opts: ["Eid", "Christmas", "Diwali", "Hanukkah"], ans: 2 },
        { q: "The Golden Rule means:", opts: ["Collecting gold", "Treat others as you wish to be treated", "Being the most important", "Follow only your religion"], ans: 1 },
        { q: "A good citizen shows:", opts: ["Disrespect for laws", "Responsibility and integrity", "Selfishness and greed", "Laziness"], ans: 1 },
    ],
    movement: [
        { q: "Secondary colours are:", opts: ["Red, yellow, blue", "Orange, green, purple", "Black, white, grey", "Pink, brown, teal"], ans: 1 },
        { q: "Warm-up exercises before sports:", opts: ["Make you tired faster", "Prepare muscles and prevent injury", "Help you cool down", "Are not necessary"], ans: 1 },
        { q: "Tempo in music refers to:", opts: ["Volume", "Pitch", "Speed of the beat", "Type of instrument"], ans: 2 },
        { q: "A choreographer:", opts: ["Designs buildings", "Creates and arranges dance moves", "Paints pictures", "Writes music"], ans: 1 },
        { q: "Fair play means:", opts: ["Winning at any cost", "Cheating when necessary", "Playing honestly and respecting rules", "Supporting only your team"], ans: 2 },
        { q: "A 'collage' in art is:", opts: ["Drawing with pencils", "Painting with watercolours", "Assembling materials to make art", "Making clay models"], ans: 2 },
        { q: "Aerobic exercise includes:", opts: ["Weight lifting only", "Stretching only", "Running, cycling, swimming", "Only sleeping"], ans: 2 },
    ],
};

export default grade3;