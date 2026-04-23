import { BookOpen, Calculator, Globe, Languages, Microscope } from 'lucide-react';
import type { Subject } from '../types/types';

export const subjects: Subject[] = [
  {
    id: 'math',
    title: 'Mathematics',
    icon: Calculator,
    color: 'bg-blue-500',
    topics: [
      {
        id: 'math-g4-t1',
        title: 'Fractions',
        grade: 4,
        term: 1,
        description: 'Parts of a whole.',
        content: (
            <div className="space-y-4 text-gray-800">
              <div className="prose prose-blue max-w-none">
                <p className="leading-relaxed text-lg">A fraction represents a part of a whole or a collection. When we divide a whole object into equal parts, each part is a fraction of the whole. A fraction has two main parts separated by a line: the Numerator and the Denominator. The Numerator is the top number, which shows how many parts we have. The Denominator is the bottom number, which shows the total number of equal parts the whole is divided into. For example, if you cut a pizza into 4 equal slices and eat 1 slice, you have eaten 1/4 of the pizza. If you add 1/2 and 1/2 together, you get 2/2, which is equal to 1 whole.</p>
              </div>
              <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 mt-6 shadow-sm">
                <p className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Study Note
                </p>
                <p className="text-blue-900">Read the text above carefully. All the questions in the revision quiz are directly based on the facts provided in these notes.</p>
              </div>
            </div>
        ),
        quiz: [
          {
            id: 'q1',
            text: 'Top number?',
            options: ['Numerator', 'Denominator', 'Base', 'Root'],
            correctAnswerIndex: 0,
            explanation: 'Numerator is top.'
          },
          {
            id: 'q2',
            text: 'Bottom number?',
            options: ['Numerator', 'Denominator', 'Base', 'Root'],
            correctAnswerIndex: 1,
            explanation: 'Denominator is bottom.'
          },
          {
            id: 'q3',
            text: '1/2 + 1/2 = ?',
            options: ['1', '2', '1/4', '0'],
            correctAnswerIndex: 0,
            explanation: 'Two halves make a whole.'
          }
        ]
      },
      {
        id: 'math-g5-t1',
        title: 'Decimals',
        grade: 5,
        term: 1,
        description: 'Numbers with decimal points.',
        content: (
            <div className="space-y-4 text-gray-800">
              <div className="prose prose-blue max-w-none">
                <p className="leading-relaxed text-lg">Decimals are another way to write fractions. They show parts of a whole using a decimal point. The decimal point separates the whole numbers on the left from the fractional parts on the right. For example, in the number 3.5, 3 is the whole number and 5 represents five-tenths (or a half). Therefore, 0.5 is exactly equal to 1/2. When adding decimals, you must align the decimal points. For instance, 1.5 + 0.5 equals 2.0.</p>
              </div>
              <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 mt-6 shadow-sm">
                <p className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Study Note
                </p>
                <p className="text-blue-900">Read the text above carefully. All the questions in the revision quiz are directly based on the facts provided in these notes.</p>
              </div>
            </div>
        ),
        quiz: [
          {
            id: 'q1',
            text: 'What separates whole numbers from parts?',
            options: ['Comma', 'Decimal point', 'Space', 'Slash'],
            correctAnswerIndex: 1,
            explanation: 'The decimal point.'
          },
          {
            id: 'q2',
            text: '0.5 is equal to?',
            options: ['1/2', '1/4', '1/3', '1'],
            correctAnswerIndex: 0,
            explanation: '0.5 is one half.'
          },
          {
            id: 'q3',
            text: '1.5 + 0.5 = ?',
            options: ['1.0', '2.0', '1.10', '2.5'],
            correctAnswerIndex: 1,
            explanation: '1.5 + 0.5 is 2.0.'
          }
        ]
      },
      {
        id: 'math-g6-t1',
        title: 'Percentages',
        grade: 6,
        term: 1,
        description: 'Parts per hundred.',
        content: (
            <div className="space-y-4 text-gray-800">
              <div className="prose prose-blue max-w-none">
                <p className="leading-relaxed text-lg">The word "percent" simply means "out of 100". We use the symbol % to represent percentages. Percentages are used everywhere, from test scores to discounts in shops. Because percent means out of 100, 50% means 50 out of 100. If we simplify the fraction 50/100, we get 1/2. Therefore, 50% is the same as a half. If you have 100% of something, you have the entire, whole amount. So 100% of 50 is just 50.</p>
              </div>
              <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 mt-6 shadow-sm">
                <p className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Study Note
                </p>
                <p className="text-blue-900">Read the text above carefully. All the questions in the revision quiz are directly based on the facts provided in these notes.</p>
              </div>
            </div>
        ),
        quiz: [
          {
            id: 'q1',
            text: 'What does percent mean?',
            options: ['Out of 10', 'Out of 100', 'Out of 1000', 'Out of 1'],
            correctAnswerIndex: 1,
            explanation: 'Percent means per hundred.'
          },
          {
            id: 'q2',
            text: '50% as a fraction?',
            options: ['1/2', '1/4', '3/4', '1/100'],
            correctAnswerIndex: 0,
            explanation: '50/100 simplifies to 1/2.'
          },
          {
            id: 'q3',
            text: '100% of 50 is?',
            options: ['100', '50', '0', '25'],
            correctAnswerIndex: 1,
            explanation: '100% is the whole amount.'
          }
        ]
      },
      {
        id: 'math-g7-t1',
        title: 'Integers',
        grade: 7,
        term: 1,
        description: 'Positive and negative whole numbers.',
        content: (
            <div className="space-y-4 text-gray-800">
              <div className="prose prose-blue max-w-none">
                <p className="leading-relaxed text-lg">Integers are all the whole numbers and their opposites. This includes positive numbers (like 1, 2, 3), negative numbers (like -1, -2, -3), and zero. Zero is a special integer because it is neutral; it is neither positive nor negative. Negative numbers are always less than zero, so -5 is a negative integer. When adding integers, think of moving on a number line. If you start at -3 and add 5 (-3 + 5), you move 5 steps to the right, landing on positive 2.</p>
              </div>
              <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 mt-6 shadow-sm">
                <p className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Study Note
                </p>
                <p className="text-blue-900">Read the text above carefully. All the questions in the revision quiz are directly based on the facts provided in these notes.</p>
              </div>
            </div>
        ),
        quiz: [
          {
            id: 'q1',
            text: 'Which is a negative integer?',
            options: ['0', '1', '-5', '2.5'],
            correctAnswerIndex: 2,
            explanation: '-5 is less than zero.'
          },
          {
            id: 'q2',
            text: '-3 + 5 = ?',
            options: ['-8', '2', '8', '-2'],
            correctAnswerIndex: 1,
            explanation: 'Moving 5 right from -3 gives 2.'
          },
          {
            id: 'q3',
            text: '0 is?',
            options: ['Positive', 'Negative', 'Neither', 'Both'],
            correctAnswerIndex: 2,
            explanation: 'Zero is neutral.'
          }
        ]
      },
      {
        id: 'math-g8-t1',
        title: 'Linear Equations',
        grade: 8,
        term: 1,
        description: 'Solving for unknowns.',
        content: (
            <div className="space-y-4 text-gray-800">
              <div className="prose prose-blue max-w-none">
                <p className="leading-relaxed text-lg">An equation is a mathematical statement that shows two things are equal, using an equal sign (=). In algebra, we often use letters called variables (like x or y) to represent unknown numbers. To solve an equation, you must find the value of the variable that makes the equation true. For example, in the equation x + 2 = 5, we ask "what number plus 2 equals 5?" The answer is 3. In the equation 2x = 10, it means 2 multiplied by x is 10, so x must be 5. If x - 4 = 0, then x must be 4 because 4 - 4 = 0.</p>
              </div>
              <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 mt-6 shadow-sm">
                <p className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Study Note
                </p>
                <p className="text-blue-900">Read the text above carefully. All the questions in the revision quiz are directly based on the facts provided in these notes.</p>
              </div>
            </div>
        ),
        quiz: [
          {
            id: 'q1',
            text: 'Solve: x + 2 = 5',
            options: ['2', '3', '7', '5'],
            correctAnswerIndex: 1,
            explanation: '3 + 2 = 5.'
          },
          {
            id: 'q2',
            text: 'Solve: 2x = 10',
            options: ['5', '8', '12', '20'],
            correctAnswerIndex: 0,
            explanation: '2 * 5 = 10.'
          },
          {
            id: 'q3',
            text: 'What is x in x - 4 = 0?',
            options: ['0', '-4', '4', '1'],
            correctAnswerIndex: 2,
            explanation: '4 - 4 = 0.'
          }
        ]
      },
      {
        id: 'math-g9-t1',
        title: 'Quadratic Equations',
        grade: 9,
        term: 1,
        description: 'Equations with x squared.',
        content: (
            <div className="space-y-4 text-gray-800">
              <div className="prose prose-blue max-w-none">
                <p className="leading-relaxed text-lg">A quadratic equation is an equation where the highest power of the unknown variable (usually x) is 2. The standard form of a quadratic equation is ax^2 + bx + c = 0. Because the highest power is 2, these equations often have two solutions. For example, the equation x^2 = 9 asks "what number multiplied by itself equals 9?" The answer can be 3 (since 3*3=9) or -3 (since -3*-3=9). When you graph a quadratic equation on a coordinate plane, it always forms a U-shaped curve called a parabola.</p>
              </div>
              <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 mt-6 shadow-sm">
                <p className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Study Note
                </p>
                <p className="text-blue-900">Read the text above carefully. All the questions in the revision quiz are directly based on the facts provided in these notes.</p>
              </div>
            </div>
        ),
        quiz: [
          {
            id: 'q1',
            text: 'Highest power of x in a quadratic?',
            options: ['1', '2', '3', '4'],
            correctAnswerIndex: 1,
            explanation: 'Quadratic means power of 2.'
          },
          {
            id: 'q2',
            text: 'Solve x^2 = 9',
            options: ['3', '-3', '3 or -3', '9'],
            correctAnswerIndex: 2,
            explanation: 'Both 3^2 and (-3)^2 are 9.'
          },
          {
            id: 'q3',
            text: 'What is the shape of a quadratic graph?',
            options: ['Line', 'Circle', 'Parabola', 'Square'],
            correctAnswerIndex: 2,
            explanation: 'It forms a parabola.'
          }
        ]
      }
    ]
  },
  {
    id: 'english',
    title: 'English',
    icon: BookOpen,
    color: 'bg-red-500',
    topics: [
      {
        id: 'english-g4-t1',
        title: 'Nouns',
        grade: 4,
        term: 1,
        description: 'Naming words.',
        content: (
            <div className="space-y-4 text-gray-800">
              <div className="prose prose-blue max-w-none">
                <p className="leading-relaxed text-lg">Nouns are naming words. They are used to name people, places, animals, or things. Everything we can see or talk about is represented by a word that names it. For example, "teacher" is a person, "school" is a place, and "dog" is a thing or animal. In the sentence "The cat slept", the word "cat" is the noun because it names the animal doing the action. When we have more than one of a noun, we usually make it plural. For most words we add "s", but for words ending in x, like "box", we add "es" to make "boxes".</p>
              </div>
              <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 mt-6 shadow-sm">
                <p className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Study Note
                </p>
                <p className="text-blue-900">Read the text above carefully. All the questions in the revision quiz are directly based on the facts provided in these notes.</p>
              </div>
            </div>
        ),
        quiz: [
          {
            id: 'q1',
            text: 'Which is a noun?',
            options: ['Run', 'Quickly', 'Dog', 'Blue'],
            correctAnswerIndex: 2,
            explanation: 'Dog is a thing.'
          },
          {
            id: 'q2',
            text: 'Identify the noun: The cat slept.',
            options: ['The', 'cat', 'slept', 'None'],
            correctAnswerIndex: 1,
            explanation: 'Cat is an animal.'
          },
          {
            id: 'q3',
            text: 'Plural of box?',
            options: ['Boxs', 'Boxes', 'Boxen', 'Box'],
            correctAnswerIndex: 1,
            explanation: 'Add -es to box.'
          }
        ]
      },
      {
        id: 'english-g5-t1',
        title: 'Adjectives',
        grade: 5,
        term: 1,
        description: 'Describing words.',
        content: (
            <div className="space-y-4 text-gray-800">
              <div className="prose prose-blue max-w-none">
                <p className="leading-relaxed text-lg">Adjectives are describing words. They give us more information about a noun. They can tell us what color something is, what size it is, or how it feels. For example, in the phrase "a red car", "red" is the adjective describing the car. In the sentence "The tall tree", "tall" is the adjective because it describes the tree. Adjectives can also describe feelings, so "happy" is an adjective. Adjectives often have opposites, known as antonyms. The opposite of "hot" is "cold".</p>
              </div>
              <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 mt-6 shadow-sm">
                <p className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Study Note
                </p>
                <p className="text-blue-900">Read the text above carefully. All the questions in the revision quiz are directly based on the facts provided in these notes.</p>
              </div>
            </div>
        ),
        quiz: [
          {
            id: 'q1',
            text: 'Which is an adjective?',
            options: ['Jump', 'Happy', 'Table', 'Slowly'],
            correctAnswerIndex: 1,
            explanation: 'Happy describes a feeling.'
          },
          {
            id: 'q2',
            text: 'Identify the adjective: The tall tree.',
            options: ['The', 'tall', 'tree', 'None'],
            correctAnswerIndex: 1,
            explanation: 'Tall describes the tree.'
          },
          {
            id: 'q3',
            text: 'Opposite of hot?',
            options: ['Warm', 'Cold', 'Boiling', 'Sun'],
            correctAnswerIndex: 1,
            explanation: 'Cold is the opposite.'
          }
        ]
      },
      {
        id: 'english-g6-t1',
        title: 'Verbs',
        grade: 6,
        term: 1,
        description: 'Action words.',
        content: (
            <div className="space-y-4 text-gray-800">
              <div className="prose prose-blue max-w-none">
                <p className="leading-relaxed text-lg">Verbs are action words or doing words. They tell us what a person, animal, or thing is doing. Every complete sentence must have a verb. For example, words like "jump", "eat", and "sing" are all verbs because they are actions you can perform. In the sentence "She runs fast", the word "runs" is the verb. Verbs can also change their form to show when the action happened, which is called tense. The past tense of the verb "go" is "went", meaning the action already happened.</p>
              </div>
              <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 mt-6 shadow-sm">
                <p className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Study Note
                </p>
                <p className="text-blue-900">Read the text above carefully. All the questions in the revision quiz are directly based on the facts provided in these notes.</p>
              </div>
            </div>
        ),
        quiz: [
          {
            id: 'q1',
            text: 'Which is a verb?',
            options: ['Apple', 'Sing', 'Beautiful', 'Very'],
            correctAnswerIndex: 1,
            explanation: 'Sing is an action.'
          },
          {
            id: 'q2',
            text: 'Past tense of go?',
            options: ['Goes', 'Going', 'Went', 'Gone'],
            correctAnswerIndex: 2,
            explanation: 'Went is the past tense.'
          },
          {
            id: 'q3',
            text: 'Identify the verb: She runs fast.',
            options: ['She', 'runs', 'fast', 'None'],
            correctAnswerIndex: 1,
            explanation: 'Runs is the action.'
          }
        ]
      },
      {
        id: 'english-g7-t1',
        title: 'Sentence Structure',
        grade: 7,
        term: 1,
        description: 'Subject, Verb, Object.',
        content: (
            <div className="space-y-4 text-gray-800">
              <div className="prose prose-blue max-w-none">
                <p className="leading-relaxed text-lg">A basic English sentence follows a specific structure to make sense. This structure is often Subject, Verb, Object, or SVO for short. The Subject is the person or thing doing the action. The Verb is the action itself. The Object is the person or thing receiving the action. For example, in the sentence "The dog barks", "The dog" is the subject doing the barking. In the sentence "I eat apples", "I" is the subject, "eat" is the verb, and "apples" is the object because they are the things being eaten.</p>
              </div>
              <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 mt-6 shadow-sm">
                <p className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Study Note
                </p>
                <p className="text-blue-900">Read the text above carefully. All the questions in the revision quiz are directly based on the facts provided in these notes.</p>
              </div>
            </div>
        ),
        quiz: [
          {
            id: 'q1',
            text: 'What is the subject in: The dog barks?',
            options: ['The', 'dog', 'barks', 'None'],
            correctAnswerIndex: 1,
            explanation: 'The dog is doing the action.'
          },
          {
            id: 'q2',
            text: 'What is the object in: I eat apples?',
            options: ['I', 'eat', 'apples', 'None'],
            correctAnswerIndex: 2,
            explanation: 'Apples receive the action.'
          },
          {
            id: 'q3',
            text: 'SVO stands for?',
            options: ['Subject Verb Object', 'Some Very Old', 'Subject Value Object', 'None'],
            correctAnswerIndex: 0,
            explanation: 'Subject, Verb, Object.'
          }
        ]
      },
      {
        id: 'english-g8-t1',
        title: 'Essay Writing',
        grade: 8,
        term: 1,
        description: 'Structuring an essay.',
        content: (
            <div className="space-y-4 text-gray-800">
              <div className="prose prose-blue max-w-none">
                <p className="leading-relaxed text-lg">An essay is a structured piece of writing that explores a specific topic. A standard essay has three main parts: the Introduction, the Body, and the Conclusion. The Introduction is the very first paragraph; it introduces the topic and grabs the reader's attention. The Body paragraphs come next; this is where all the main points, arguments, and evidence are discussed in detail. Finally, the Conclusion is the last paragraph; it wraps up the essay by summarizing the main points and providing a final thought.</p>
              </div>
              <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 mt-6 shadow-sm">
                <p className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Study Note
                </p>
                <p className="text-blue-900">Read the text above carefully. All the questions in the revision quiz are directly based on the facts provided in these notes.</p>
              </div>
            </div>
        ),
        quiz: [
          {
            id: 'q1',
            text: 'First paragraph of an essay?',
            options: ['Body', 'Conclusion', 'Introduction', 'Summary'],
            correctAnswerIndex: 2,
            explanation: 'Introduction comes first.'
          },
          {
            id: 'q2',
            text: 'Where are the main points discussed?',
            options: ['Title', 'Introduction', 'Body', 'Conclusion'],
            correctAnswerIndex: 2,
            explanation: 'Body paragraphs contain main points.'
          },
          {
            id: 'q3',
            text: 'Last paragraph is called?',
            options: ['Start', 'Body', 'Conclusion', 'End'],
            correctAnswerIndex: 2,
            explanation: 'Conclusion wraps it up.'
          }
        ]
      },
      {
        id: 'english-g9-t1',
        title: 'Literature Analysis',
        grade: 9,
        term: 1,
        description: 'Analyzing themes and characters.',
        content: (
            <div className="space-y-4 text-gray-800">
              <div className="prose prose-blue max-w-none">
                <p className="leading-relaxed text-lg">Literature analysis involves looking deeply at a story to understand its hidden meanings. We look at elements like Theme, Setting, and Characters. The Theme is the central idea or main message the author wants to convey, such as "love conquers all" or "the danger of greed". The Setting is the time and place where the story happens. Characters are the people in the story. The main character, who drives the story forward and whom we usually root for, is called the protagonist.</p>
              </div>
              <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 mt-6 shadow-sm">
                <p className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Study Note
                </p>
                <p className="text-blue-900">Read the text above carefully. All the questions in the revision quiz are directly based on the facts provided in these notes.</p>
              </div>
            </div>
        ),
        quiz: [
          {
            id: 'q1',
            text: 'What is a theme?',
            options: ['A character', 'The main idea or message', 'The setting', 'The author'],
            correctAnswerIndex: 1,
            explanation: 'Theme is the central message.'
          },
          {
            id: 'q2',
            text: 'What is the setting?',
            options: ['Time and place', 'Main character', 'The problem', 'The ending'],
            correctAnswerIndex: 0,
            explanation: 'Setting is where and when.'
          },
          {
            id: 'q3',
            text: 'A protagonist is?',
            options: ['The villain', 'The main character', 'The author', 'The setting'],
            correctAnswerIndex: 1,
            explanation: 'Protagonist is the main character.'
          }
        ]
      }
    ]
  },
  {
    id: 'kiswahili',
    title: 'Kiswahili',
    icon: Languages,
    color: 'bg-green-500',
    topics: [
      {
        id: 'kiswahili-g4-t1',
        title: 'Salamu',
        grade: 4,
        term: 1,
        description: 'Maamkizi mbalimbali.',
        content: (
            <div className="space-y-4 text-gray-800">
              <div className="prose prose-blue max-w-none">
                <p className="leading-relaxed text-lg">Katika lugha ya Kiswahili, salamu ni muhimu sana kwa kuonyesha heshima na kujenga uhusiano mwema. Kuna salamu tofauti kulingana na umri na wakati. Kwa mfano, salamu ya kawaida ni "Hujambo?", na jibu lake sahihi ni "Sijambo". Tunapomsalimia mtu aliyetuzidi umri, tunatumia "Shikamoo", na yeye atajibu "Marahaba". Pia, tunasalimiana kulingana na wakati wa siku; kwa mfano, tukiuliza "Habari za asubuhi?", jibu lake huwa ni "Nzuri" au "Salama".</p>
              </div>
              <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 mt-6 shadow-sm">
                <p className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Study Note
                </p>
                <p className="text-blue-900">Read the text above carefully. All the questions in the revision quiz are directly based on the facts provided in these notes.</p>
              </div>
            </div>
        ),
        quiz: [
          {
            id: 'q1',
            text: 'Jibu la Hujambo ni?',
            options: ['Sijambo', 'Hatujambo', 'Nzuri', 'Salama'],
            correctAnswerIndex: 0,
            explanation: 'Hujambo hujibiwa Sijambo.'
          },
          {
            id: 'q2',
            text: 'Shikamoo hujibiwa?',
            options: ['Sijambo', 'Marahaba', 'Nzuri', 'Asante'],
            correctAnswerIndex: 1,
            explanation: 'Marahaba ni jibu la Shikamoo.'
          },
          {
            id: 'q3',
            text: 'Habari za asubuhi?',
            options: ['Nzuri', 'Sijambo', 'Marahaba', 'Ndiyo'],
            correctAnswerIndex: 0,
            explanation: 'Habari hujibiwa Nzuri/Salama.'
          }
        ]
      },
      {
        id: 'kiswahili-g5-t1',
        title: 'Vitenzi',
        grade: 5,
        term: 1,
        description: 'Maneno ya vitendo.',
        content: (
            <div className="space-y-4 text-gray-800">
              <div className="prose prose-blue max-w-none">
                <p className="leading-relaxed text-lg">Vitenzi ni maneno ambayo huonyesha kitendo kinachofanyika, hali, au tukio. Kila sentensi kamili lazima iwe na kitenzi. Kwa mfano, maneno kama "soma", "lala", na "kimbia" ni vitenzi kwa sababu yanaonyesha vitendo. Vitenzi pia hubadilika kulingana na wakati (njeo). Kwa mfano, wakati uliopita wa kitenzi "soma" kwa nafsi ya kwanza ni "nilisoma", ambapo kiambishi "li" huonyesha wakati uliopita. Vitenzi pia vinaweza kuwa na vinyume chake; kwa mfano, kinyume cha kitendo "cheka" ni "lia".</p>
              </div>
              <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 mt-6 shadow-sm">
                <p className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Study Note
                </p>
                <p className="text-blue-900">Read the text above carefully. All the questions in the revision quiz are directly based on the facts provided in these notes.</p>
              </div>
            </div>
        ),
        quiz: [
          {
            id: 'q1',
            text: 'Kipi ni kitenzi?',
            options: ['Kiti', 'Kimbia', 'Mrefu', 'Sana'],
            correctAnswerIndex: 1,
            explanation: 'Kimbia ni kitendo.'
          },
          {
            id: 'q2',
            text: 'Wakati uliopita wa soma?',
            options: ['Ninasoma', 'Nitasoma', 'Nilisoma', 'Nimesoma'],
            correctAnswerIndex: 2,
            explanation: 'Nilisoma ni wakati uliopita (li).'
          },
          {
            id: 'q3',
            text: 'Kinyume cha cheka?',
            options: ['Lia', 'Kimbia', 'Lala', 'Sema'],
            correctAnswerIndex: 0,
            explanation: 'Kinyume cha cheka ni lia.'
          }
        ]
      },
      {
        id: 'kiswahili-g6-t1',
        title: 'Vivumishi',
        grade: 6,
        term: 1,
        description: 'Maneno yanayoelezea nomino.',
        content: (
            <div className="space-y-4 text-gray-800">
              <div className="prose prose-blue max-w-none">
                <p className="leading-relaxed text-lg">Vivumishi ni maneno ambayo hutoa taarifa zaidi au kufafanua nomino (majina). Yanatusaidia kujua sifa za kitu, kama vile rangi, umbo, au tabia. Kwa mfano, katika neno "kizuri", mzizi ni "-zuri" na kinaelezea sifa. Vivumishi lazima vikubaliane na ngeli ya nomino inayoelezewa. Kwa mfano, tukitumia nomino "mtoto" (ngeli ya A-WA), tutasema "Mtoto mzuri". Lakini tukitumia nomino "kiti" (ngeli ya KI-VI), tutasema "Kiti kizuri".</p>
              </div>
              <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 mt-6 shadow-sm">
                <p className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Study Note
                </p>
                <p className="text-blue-900">Read the text above carefully. All the questions in the revision quiz are directly based on the facts provided in these notes.</p>
              </div>
            </div>
        ),
        quiz: [
          {
            id: 'q1',
            text: 'Kipi ni kivumishi?',
            options: ['Soma', 'Kiti', 'Kizuri', 'Yeye'],
            correctAnswerIndex: 2,
            explanation: 'Kizuri kinaelezea nomino.'
          },
          {
            id: 'q2',
            text: 'Mtoto ___ analia.',
            options: ['mzuri', 'kizuri', 'vizuri', 'pazuri'],
            correctAnswerIndex: 0,
            explanation: 'Mtoto mzuri (ngeli ya A-WA).'
          },
          {
            id: 'q3',
            text: 'Kiti ___ kimevunjika.',
            options: ['mzuri', 'kizuri', 'vizuri', 'yangu'],
            correctAnswerIndex: 1,
            explanation: 'Kiti kizuri (ngeli ya KI-VI).'
          }
        ]
      },
      {
        id: 'kiswahili-g7-t1',
        title: 'Ngeli za Nomino',
        grade: 7,
        term: 1,
        description: 'Makundi ya nomino.',
        content: (
            <div className="space-y-4 text-gray-800">
              <div className="prose prose-blue max-w-none">
                <p className="leading-relaxed text-lg">Ngeli ni makundi maalum ambayo nomino za Kiswahili huwekwa kulingana na maumbo yake ya umoja na wingi, au kulingana na sifa zake. Kwa mfano, ngeli ya A-WA inajumuisha viumbe hai wote kama watu na wanyama; kwa hivyo, neno "mtu" liko katika ngeli ya A-WA. Ngeli ya KI-VI inajumuisha vitu visivyo hai vinavyoanza na "ki" katika umoja na "vi" katika wingi, kama vile "kiti". Ngeli ya LI-YA inajumuisha maneno kama "jicho", ambalo wingi wake ni "macho".</p>
              </div>
              <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 mt-6 shadow-sm">
                <p className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Study Note
                </p>
                <p className="text-blue-900">Read the text above carefully. All the questions in the revision quiz are directly based on the facts provided in these notes.</p>
              </div>
            </div>
        ),
        quiz: [
          {
            id: 'q1',
            text: 'Mtu yuko katika ngeli gani?',
            options: ['KI-VI', 'LI-YA', 'A-WA', 'U-I'],
            correctAnswerIndex: 2,
            explanation: 'Mtu ni kiumbe hai (A-WA).'
          },
          {
            id: 'q2',
            text: 'Kiti yuko katika ngeli gani?',
            options: ['A-WA', 'KI-VI', 'LI-YA', 'U-I'],
            correctAnswerIndex: 1,
            explanation: 'Kiti huanza na Ki (KI-VI).'
          },
          {
            id: 'q3',
            text: 'Wingi wa jicho ni?',
            options: ['Macho', 'Vijicho', 'Majicho', 'Jicho'],
            correctAnswerIndex: 0,
            explanation: 'Jicho (LI) -> Macho (YA).'
          }
        ]
      },
      {
        id: 'kiswahili-g8-t1',
        title: 'Fasihi Simulizi',
        grade: 8,
        term: 1,
        description: 'Fasihi inayopitishwa kwa mdomo.',
        content: (
            <div className="space-y-4 text-gray-800">
              <div className="prose prose-blue max-w-none">
                <p className="leading-relaxed text-lg">Fasihi simulizi ni sanaa ya lugha inayopitishwa kutoka kizazi kimoja hadi kingine kwa njia ya mdomo. Inajumuisha tanzu mbalimbali kama vile hadithi, methali, na vitendawili. Vitendawili ni mafumbo yanayohitaji kufikiriwa ili kupata jibu. Kwa mfano, kitendawili "Nyumba yangu haina mlango" jibu lake ni "Yai" kwa sababu yai ni kama nyumba iliyofungwa pande zote. Methali ni misemo yenye hekima; kwa mfano, methali "Haraka haraka haina baraka" inatufundisha kufanya mambo kwa utulivu.</p>
              </div>
              <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 mt-6 shadow-sm">
                <p className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Study Note
                </p>
                <p className="text-blue-900">Read the text above carefully. All the questions in the revision quiz are directly based on the facts provided in these notes.</p>
              </div>
            </div>
        ),
        quiz: [
          {
            id: 'q1',
            text: 'Kipi ni kitendawili?',
            options: ['Asiyesikia la mkuu...', 'Nyumba yangu haina mlango', 'Hapo zamani za kale', 'Mimi ni mwanafunzi'],
            correctAnswerIndex: 1,
            explanation: 'Nyumba yangu haina mlango (Yai).'
          },
          {
            id: 'q2',
            text: 'Jibu la: Nyumba yangu haina mlango?',
            options: ['Yai', 'Kiatu', 'Kalamu', 'Kitabu'],
            correctAnswerIndex: 0,
            explanation: 'Yai halina mlango.'
          },
          {
            id: 'q3',
            text: 'Methali: Haraka haraka haina...',
            options: ['Baraka', 'Faida', 'Mwisho', 'Mwanzo'],
            correctAnswerIndex: 0,
            explanation: 'Haraka haraka haina baraka.'
          }
        ]
      },
      {
        id: 'kiswahili-g9-t1',
        title: 'Fasihi Andishi',
        grade: 9,
        term: 1,
        description: 'Fasihi iliyoandikwa.',
        content: (
            <div className="space-y-4 text-gray-800">
              <div className="prose prose-blue max-w-none">
                <p className="leading-relaxed text-lg">Fasihi andishi ni sanaa ya lugha ambayo imehifadhiwa kwa njia ya maandishi. Inajumuisha tanzu kuu tatu: Riwaya, Tamthilia, na Ushairi. Riwaya ni hadithi ndefu ya kubuni iliyoandikwa kwa nathari (kama kitabu cha kawaida). Ushairi ni sanaa ya kutunga mashairi, na mtu anayeandika mashairi anaitwa mshairi. Tamthilia ni mchezo wa kuigiza ulioandikwa mahususi kwa ajili ya kuigizwa jukwaani na waigizaji mbele ya watazamaji.</p>
              </div>
              <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 mt-6 shadow-sm">
                <p className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Study Note
                </p>
                <p className="text-blue-900">Read the text above carefully. All the questions in the revision quiz are directly based on the facts provided in these notes.</p>
              </div>
            </div>
        ),
        quiz: [
          {
            id: 'q1',
            text: 'Riwaya ni nini?',
            options: ['Hadithi fupi', 'Hadithi ndefu ya kitabu', 'Shairi', 'Kitendawili'],
            correctAnswerIndex: 1,
            explanation: 'Riwaya ni hadithi ndefu.'
          },
          {
            id: 'q2',
            text: 'Mtu anayeandika mashairi anaitwa?',
            options: ['Mwandishi', 'Mshairi', 'Mwimbaji', 'Mwalimu'],
            correctAnswerIndex: 1,
            explanation: 'Mshairi huandika mashairi.'
          },
          {
            id: 'q3',
            text: 'Tamthilia huandikwa kwa ajili ya?',
            options: ['Kusomwa tu', 'Kuigizwa', 'Kuimbwa', 'Kukaririwa'],
            correctAnswerIndex: 1,
            explanation: 'Tamthilia huigizwa jukwaani.'
          }
        ]
      }
    ]
  },
  {
    id: 'science',
    title: 'Science',
    icon: Microscope,
    color: 'bg-purple-500',
    topics: [
      {
        id: 'science-g4-t1',
        title: 'Plants',
        grade: 4,
        term: 1,
        description: 'Parts of a plant.',
        content: (
            <div className="space-y-4 text-gray-800">
              <div className="prose prose-blue max-w-none">
                <p className="leading-relaxed text-lg">Plants are living things that are essential for life on Earth. A typical plant has several main parts: roots, stems, leaves, and flowers. The roots grow underground and their main job is to absorb water and nutrients from the soil, as well as anchor the plant. The stem supports the plant and carries water to the leaves. The leaves are like the plant's kitchen; they use sunlight to make food for the plant through a process called photosynthesis. Flowers are the reproductive parts of the plant, and their main function is to produce seeds so new plants can grow.</p>
              </div>
              <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 mt-6 shadow-sm">
                <p className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Study Note
                </p>
                <p className="text-blue-900">Read the text above carefully. All the questions in the revision quiz are directly based on the facts provided in these notes.</p>
              </div>
            </div>
        ),
        quiz: [
          {
            id: 'q1',
            text: 'Which part absorbs water?',
            options: ['Leaves', 'Stem', 'Roots', 'Flowers'],
            correctAnswerIndex: 2,
            explanation: 'Roots absorb water from soil.'
          },
          {
            id: 'q2',
            text: 'Which part makes food?',
            options: ['Roots', 'Stem', 'Leaves', 'Flowers'],
            correctAnswerIndex: 2,
            explanation: 'Leaves make food via photosynthesis.'
          },
          {
            id: 'q3',
            text: 'What do flowers produce?',
            options: ['Water', 'Seeds', 'Soil', 'Light'],
            correctAnswerIndex: 1,
            explanation: 'Flowers produce seeds for reproduction.'
          }
        ]
      },
      {
        id: 'science-g5-t1',
        title: 'States of Matter',
        grade: 5,
        term: 1,
        description: 'Solid, Liquid, Gas.',
        content: (
            <div className="space-y-4 text-gray-800">
              <div className="prose prose-blue max-w-none">
                <p className="leading-relaxed text-lg">Matter is everything around us that has mass and takes up space. Matter exists in three primary states: solid, liquid, and gas. Solids, like a rock or a desk, have a fixed shape and a fixed volume; their particles are packed tightly together. Liquids, like water or milk, have a fixed volume but no fixed shape; they flow and take the shape of their container. Gases, like the air we breathe or steam from boiling water, have no fixed shape or volume and will spread out to fill any container they are in.</p>
              </div>
              <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 mt-6 shadow-sm">
                <p className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Study Note
                </p>
                <p className="text-blue-900">Read the text above carefully. All the questions in the revision quiz are directly based on the facts provided in these notes.</p>
              </div>
            </div>
        ),
        quiz: [
          {
            id: 'q1',
            text: 'Which has a fixed shape?',
            options: ['Solid', 'Liquid', 'Gas', 'None'],
            correctAnswerIndex: 0,
            explanation: 'Solids have a fixed shape.'
          },
          {
            id: 'q2',
            text: 'Water is a?',
            options: ['Solid', 'Liquid', 'Gas', 'Plasma'],
            correctAnswerIndex: 1,
            explanation: 'Water flows and is a liquid.'
          },
          {
            id: 'q3',
            text: 'Steam is a?',
            options: ['Solid', 'Liquid', 'Gas', 'Ice'],
            correctAnswerIndex: 2,
            explanation: 'Steam is water in gas form.'
          }
        ]
      },
      {
        id: 'science-g6-t1',
        title: 'Light and Sound',
        grade: 6,
        term: 1,
        description: 'Forms of energy.',
        content: (
            <div className="space-y-4 text-gray-800">
              <div className="prose prose-blue max-w-none">
                <p className="leading-relaxed text-lg">Light and sound are two important forms of energy that help us interact with the world. Light energy allows us to see things. A key property of light is that it always travels in straight lines, which is why shadows form when an object blocks the light. Sound energy allows us to hear. Sound is created by vibrations—when an object vibrates, it pushes the air around it, creating sound waves that travel to our ears. While both travel fast, light travels much faster than sound. This is why during a storm, you see the lightning before you hear the thunder.</p>
              </div>
              <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 mt-6 shadow-sm">
                <p className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Study Note
                </p>
                <p className="text-blue-900">Read the text above carefully. All the questions in the revision quiz are directly based on the facts provided in these notes.</p>
              </div>
            </div>
        ),
        quiz: [
          {
            id: 'q1',
            text: 'Light travels in?',
            options: ['Circles', 'Straight lines', 'Waves only', 'Zigzags'],
            correctAnswerIndex: 1,
            explanation: 'Light travels in straight lines.'
          },
          {
            id: 'q2',
            text: 'Sound is caused by?',
            options: ['Heat', 'Vibrations', 'Light', 'Electricity'],
            correctAnswerIndex: 1,
            explanation: 'Vibrations create sound waves.'
          },
          {
            id: 'q3',
            text: 'Which travels faster?',
            options: ['Sound', 'Light', 'They are equal', 'Depends'],
            correctAnswerIndex: 1,
            explanation: 'Light is much faster than sound.'
          }
        ]
      },
      {
        id: 'science-g7-t1',
        title: 'Acids and Bases',
        grade: 7,
        term: 1,
        description: 'The pH scale.',
        content: (
            <div className="space-y-4 text-gray-800">
              <div className="prose prose-blue max-w-none">
                <p className="leading-relaxed text-lg">Chemicals can often be classified as acids or bases. Acids are substances that usually taste sour, like the citric acid found in lemons and oranges. Bases are substances that feel slippery and taste bitter, like soap or baking soda. We measure how acidic or basic a liquid is using the pH scale, which ranges from 0 to 14. A pH of 7 is perfectly neutral, meaning it is neither an acid nor a base. Pure water is an example of a neutral substance with a pH of exactly 7.</p>
              </div>
              <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 mt-6 shadow-sm">
                <p className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Study Note
                </p>
                <p className="text-blue-900">Read the text above carefully. All the questions in the revision quiz are directly based on the facts provided in these notes.</p>
              </div>
            </div>
        ),
        quiz: [
          {
            id: 'q1',
            text: 'What is the pH of pure water?',
            options: ['0', '7', '14', '1'],
            correctAnswerIndex: 1,
            explanation: 'Pure water is neutral (pH 7).'
          },
          {
            id: 'q2',
            text: 'Lemons contain?',
            options: ['Acid', 'Base', 'Salt', 'Water only'],
            correctAnswerIndex: 0,
            explanation: 'Lemons contain citric acid.'
          },
          {
            id: 'q3',
            text: 'Soap is usually a?',
            options: ['Acid', 'Base', 'Neutral', 'Salt'],
            correctAnswerIndex: 1,
            explanation: 'Soap is a mild base.'
          }
        ]
      },
      {
        id: 'science-g8-t1',
        title: 'Atomic Structure',
        grade: 8,
        term: 1,
        description: 'Protons, Neutrons, Electrons.',
        content: (
            <div className="space-y-4 text-gray-800">
              <div className="prose prose-blue max-w-none">
                <p className="leading-relaxed text-lg">All matter in the universe is made up of tiny building blocks called atoms. An atom has a dense central core called the nucleus. Inside the nucleus, there are two types of particles: protons, which carry a positive electrical charge, and neutrons, which have no charge (they are neutral). Orbiting around the outside of the nucleus are much smaller particles called electrons. Electrons carry a negative electrical charge. The balance of positive protons and negative electrons determines the properties of the atom.</p>
              </div>
              <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 mt-6 shadow-sm">
                <p className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Study Note
                </p>
                <p className="text-blue-900">Read the text above carefully. All the questions in the revision quiz are directly based on the facts provided in these notes.</p>
              </div>
            </div>
        ),
        quiz: [
          {
            id: 'q1',
            text: 'What is in the center of an atom?',
            options: ['Electrons', 'Nucleus', 'Empty space', 'Molecules'],
            correctAnswerIndex: 1,
            explanation: 'The nucleus is at the center.'
          },
          {
            id: 'q2',
            text: 'Protons have what charge?',
            options: ['Positive', 'Negative', 'Neutral', 'Varies'],
            correctAnswerIndex: 0,
            explanation: 'Protons are positive.'
          },
          {
            id: 'q3',
            text: 'Electrons have what charge?',
            options: ['Positive', 'Negative', 'Neutral', 'Varies'],
            correctAnswerIndex: 1,
            explanation: 'Electrons are negative.'
          }
        ]
      },
      {
        id: 'science-g9-t1',
        title: 'Genetics',
        grade: 9,
        term: 1,
        description: 'DNA and inheritance.',
        content: (
            <div className="space-y-4 text-gray-800">
              <div className="prose prose-blue max-w-none">
                <p className="leading-relaxed text-lg">Genetics is the branch of science that studies how traits are passed down from parents to their offspring. This passing down of traits is called inheritance. The instructions for these traits are carried in a complex, ladder-like molecule called DNA (Deoxyribonucleic Acid). In most living organisms, DNA is safely stored inside the nucleus of every cell. Because you inherit your DNA from your parents, you share many physical traits with them, such as eye color or hair type.</p>
              </div>
              <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 mt-6 shadow-sm">
                <p className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Study Note
                </p>
                <p className="text-blue-900">Read the text above carefully. All the questions in the revision quiz are directly based on the facts provided in these notes.</p>
              </div>
            </div>
        ),
        quiz: [
          {
            id: 'q1',
            text: 'What molecule carries genetic info?',
            options: ['Protein', 'Fat', 'DNA', 'Carbohydrate'],
            correctAnswerIndex: 2,
            explanation: 'DNA carries genetic information.'
          },
          {
            id: 'q2',
            text: 'Where is DNA found?',
            options: ['Cell membrane', 'Nucleus', 'Cytoplasm', 'Ribosome'],
            correctAnswerIndex: 1,
            explanation: 'DNA is in the nucleus.'
          },
          {
            id: 'q3',
            text: 'Traits passed from parents are?',
            options: ['Acquired', 'Inherited', 'Learned', 'Random'],
            correctAnswerIndex: 1,
            explanation: 'They are inherited traits.'
          }
        ]
      }
    ]
  },
  {
    id: 'social-studies',
    title: 'Social Studies',
    icon: Globe,
    color: 'bg-yellow-500',
    topics: [
      {
        id: 'social-studies-g4-t1',
        title: 'Physical Features',
        grade: 4,
        term: 1,
        description: 'Mountains and Rivers.',
        content: (
            <div className="space-y-4 text-gray-800">
              <div className="prose prose-blue max-w-none">
                <p className="leading-relaxed text-lg">Physical features are the natural landforms and bodies of water on the Earth's surface. In Kenya, we have many diverse physical features. Mountains are high, steep landforms. The highest mountain in Kenya is Mt. Kenya, which even has snow at its peak! Rivers are flowing bodies of fresh water. The longest river in Kenya is River Tana, which flows into the Indian Ocean. Lakes are large bodies of water completely surrounded by land, such as Lake Victoria or Lake Nakuru.</p>
              </div>
              <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 mt-6 shadow-sm">
                <p className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Study Note
                </p>
                <p className="text-blue-900">Read the text above carefully. All the questions in the revision quiz are directly based on the facts provided in these notes.</p>
              </div>
            </div>
        ),
        quiz: [
          {
            id: 'q1',
            text: 'Highest mountain in Kenya?',
            options: ['Mt. Elgon', 'Mt. Kenya', 'Mt. Kilimanjaro', 'Mt. Longonot'],
            correctAnswerIndex: 1,
            explanation: 'Mt. Kenya is the highest in Kenya.'
          },
          {
            id: 'q2',
            text: 'Longest river in Kenya?',
            options: ['River Athi', 'River Tana', 'River Nzoia', 'River Yala'],
            correctAnswerIndex: 1,
            explanation: 'River Tana is the longest.'
          },
          {
            id: 'q3',
            text: 'A large body of water is a?',
            options: ['Mountain', 'Valley', 'Lake', 'Hill'],
            correctAnswerIndex: 2,
            explanation: 'A lake is a body of water.'
          }
        ]
      },
      {
        id: 'social-studies-g5-t1',
        title: 'Weather',
        grade: 5,
        term: 1,
        description: 'Elements of weather.',
        content: (
            <div className="space-y-4 text-gray-800">
              <div className="prose prose-blue max-w-none">
                <p className="leading-relaxed text-lg">Weather refers to the daily conditions of the atmosphere in a specific place, such as how hot, cold, wet, or windy it is. Meteorologists use special instruments to measure these elements. Temperature, which is how hot or cold the air is, is measured using a thermometer. Rainfall, the amount of rain that falls, is collected and measured using a rain gauge. Wind is simply moving air, and its direction is shown by a wind vane, while its speed is measured by an anemometer.</p>
              </div>
              <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 mt-6 shadow-sm">
                <p className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Study Note
                </p>
                <p className="text-blue-900">Read the text above carefully. All the questions in the revision quiz are directly based on the facts provided in these notes.</p>
              </div>
            </div>
        ),
        quiz: [
          {
            id: 'q1',
            text: 'Instrument for measuring temperature?',
            options: ['Rain gauge', 'Thermometer', 'Wind vane', 'Barometer'],
            correctAnswerIndex: 1,
            explanation: 'Thermometer measures temperature.'
          },
          {
            id: 'q2',
            text: 'Instrument for measuring rainfall?',
            options: ['Rain gauge', 'Thermometer', 'Wind vane', 'Barometer'],
            correctAnswerIndex: 0,
            explanation: 'Rain gauge measures rainfall.'
          },
          {
            id: 'q3',
            text: 'Moving air is called?',
            options: ['Cloud', 'Rain', 'Wind', 'Sun'],
            correctAnswerIndex: 2,
            explanation: 'Wind is moving air.'
          }
        ]
      },
      {
        id: 'social-studies-g6-t1',
        title: 'History of Kenya',
        grade: 6,
        term: 1,
        description: 'Pre-colonial period.',
        content: (
            <div className="space-y-4 text-gray-800">
              <div className="prose prose-blue max-w-none">
                <p className="leading-relaxed text-lg">Before Kenya was colonized by the British, it had a rich history of different communities migrating and settling in the region. The very first inhabitants of Kenya were hunter-gatherers, such as the Ndorobo, who lived by hunting wild animals and gathering fruits. Later, other groups migrated into Kenya. The Bantus, like the Kikuyu and Kamba, were primarily farmers. The Nilotes, which include River-Lake Nilotes like the Luo, Plains Nilotes like the Maasai, and Highland Nilotes like the Kalenjin, were traditionally pastoralists or fishermen.</p>
              </div>
              <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 mt-6 shadow-sm">
                <p className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Study Note
                </p>
                <p className="text-blue-900">Read the text above carefully. All the questions in the revision quiz are directly based on the facts provided in these notes.</p>
              </div>
            </div>
        ),
        quiz: [
          {
            id: 'q1',
            text: 'Who were the first inhabitants?',
            options: ['Bantus', 'Nilotes', 'Cushites', 'Hunter-gatherers'],
            correctAnswerIndex: 3,
            explanation: 'Hunter-gatherers were the earliest.'
          },
          {
            id: 'q2',
            text: 'Which community is Nilotic?',
            options: ['Kikuyu', 'Luo', 'Kamba', 'Mijikenda'],
            correctAnswerIndex: 1,
            explanation: 'Luos are River-Lake Nilotes.'
          },
          {
            id: 'q3',
            text: 'Which community is Bantu?',
            options: ['Maasai', 'Kalenjin', 'Kikuyu', 'Turkana'],
            correctAnswerIndex: 2,
            explanation: 'Kikuyus are Bantus.'
          }
        ]
      },
      {
        id: 'social-studies-g7-t1',
        title: 'Trade',
        grade: 7,
        term: 1,
        description: 'Buying and selling.',
        content: (
            <div className="space-y-4 text-gray-800">
              <div className="prose prose-blue max-w-none">
                <p className="leading-relaxed text-lg">Trade is the activity of buying, selling, or exchanging goods and services. In the past, people used Barter Trade, which is the direct exchange of goods for other goods without using money (e.g., trading a cow for bags of maize). Today, we use Currency, which is the official money of a country (like Kenyan Shillings), to buy things. In any trade, there are producers who make the goods, sellers who offer them in markets, and consumers, who are the people who buy and use the goods and services.</p>
              </div>
              <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 mt-6 shadow-sm">
                <p className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Study Note
                </p>
                <p className="text-blue-900">Read the text above carefully. All the questions in the revision quiz are directly based on the facts provided in these notes.</p>
              </div>
            </div>
        ),
        quiz: [
          {
            id: 'q1',
            text: 'Exchange of goods for goods is?',
            options: ['Currency trade', 'Barter trade', 'Online trade', 'Retail'],
            correctAnswerIndex: 1,
            explanation: 'Barter is goods for goods.'
          },
          {
            id: 'q2',
            text: 'Money used in a country is?',
            options: ['Barter', 'Currency', 'Goods', 'Services'],
            correctAnswerIndex: 1,
            explanation: 'Currency is the official money.'
          },
          {
            id: 'q3',
            text: 'A person who buys goods is a?',
            options: ['Seller', 'Producer', 'Consumer', 'Farmer'],
            correctAnswerIndex: 2,
            explanation: 'Consumers buy and use goods.'
          }
        ]
      },
      {
        id: 'social-studies-g8-t1',
        title: 'Government',
        grade: 8,
        term: 1,
        description: 'Arms of government.',
        content: (
            <div className="space-y-4 text-gray-800">
              <div className="prose prose-blue max-w-none">
                <p className="leading-relaxed text-lg">A government is a system or group of people governing an organized community or state. In Kenya, the government is divided into three main branches, or "arms", to ensure a balance of power. The Legislature, which is Parliament, is responsible for debating and making the laws of the country. The Executive, led by the President and the Cabinet, is responsible for enforcing and implementing those laws. The Judiciary, which consists of the courts and judges, is responsible for interpreting the laws and ensuring justice is served.</p>
              </div>
              <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 mt-6 shadow-sm">
                <p className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Study Note
                </p>
                <p className="text-blue-900">Read the text above carefully. All the questions in the revision quiz are directly based on the facts provided in these notes.</p>
              </div>
            </div>
        ),
        quiz: [
          {
            id: 'q1',
            text: 'Which arm makes laws?',
            options: ['Executive', 'Judiciary', 'Legislature', 'Police'],
            correctAnswerIndex: 2,
            explanation: 'Legislature (Parliament) makes laws.'
          },
          {
            id: 'q2',
            text: 'Which arm enforces laws?',
            options: ['Executive', 'Judiciary', 'Legislature', 'Citizens'],
            correctAnswerIndex: 0,
            explanation: 'The Executive enforces laws.'
          },
          {
            id: 'q3',
            text: 'Which arm interprets laws?',
            options: ['Executive', 'Judiciary', 'Legislature', 'President'],
            correctAnswerIndex: 1,
            explanation: 'The Judiciary (Courts) interprets laws.'
          }
        ]
      },
      {
        id: 'social-studies-g9-t1',
        title: 'Global Issues',
        grade: 9,
        term: 1,
        description: 'Challenges facing the world.',
        content: (
            <div className="space-y-4 text-gray-800">
              <div className="prose prose-blue max-w-none">
                <p className="leading-relaxed text-lg">Global issues are major challenges that affect people and environments all over the world. One critical issue is climate change, largely driven by global warming. Global warming is caused by the buildup of greenhouse gases (like carbon dioxide) in the atmosphere, which trap the sun's heat. Another major issue is deforestation, which is the large-scale cutting down of trees, destroying habitats and worsening climate change. To combat these issues, the world is shifting towards renewable energy sources, like solar energy from the sun, which do not deplete natural resources or pollute the air.</p>
              </div>
              <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 mt-6 shadow-sm">
                <p className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Study Note
                </p>
                <p className="text-blue-900">Read the text above carefully. All the questions in the revision quiz are directly based on the facts provided in these notes.</p>
              </div>
            </div>
        ),
        quiz: [
          {
            id: 'q1',
            text: 'What causes global warming?',
            options: ['Planting trees', 'Greenhouse gases', 'Solar panels', 'Windmills'],
            correctAnswerIndex: 1,
            explanation: 'Greenhouse gases trap heat.'
          },
          {
            id: 'q2',
            text: 'Cutting down trees is called?',
            options: ['Afforestation', 'Deforestation', 'Reforestation', 'Farming'],
            correctAnswerIndex: 1,
            explanation: 'Deforestation is cutting trees.'
          },
          {
            id: 'q3',
            text: 'Which is a renewable energy source?',
            options: ['Coal', 'Oil', 'Solar', 'Natural Gas'],
            correctAnswerIndex: 2,
            explanation: 'Solar energy comes from the sun and is renewable.'
          }
        ]
      }
    ]
  }
];
