const { getRows, syncToSheet, updateUserPoints } = require('../config/googleSheets');
const axios = require('axios');

// Helper: Get today's date string YYYY-MM-DD
const getTodayString = () => new Date().toISOString().split('T')[0];

// @desc    Get Daily Verse (Indonesian TB)
// @route   GET /api/daily/verse
// @access  Public
const getDailyVerse = async (req, res) => {
    try {
        const verses = [
            { book: 'Yohanes', ref: '3:16' },
            { book: 'Yeremia', ref: '29:11' },
            { book: 'Filipi', ref: '4:13' },
            { book: 'Mazmur', ref: '23:1' },
            { book: 'Amsal', ref: '3:5' },
            { book: 'Roma', ref: '8:28' },
            { book: 'Yosua', ref: '1:9' },
            { book: 'Matius', ref: '11:28' },
            { book: 'Galatia', ref: '5:22-23' },
            { book: 'Mazmur', ref: '46:2' },
            { book: 'Yesaya', ref: '41:10' },
            { book: '1 Korintus', ref: '13:4' },
            { book: 'Matius', ref: '6:33' },
            { book: 'Amsal', ref: '16:3' },
            { book: 'Mazmur', ref: '37:4' }
        ];

        const randomVerse = verses[Math.floor(Math.random() * verses.length)];
        const [chapter, verseRange] = randomVerse.ref.split(':');

        // Fetch from Indonesian Bible API
        const response = await axios.get(`https://api-alkitab.vercel.app/api/passage/${randomVerse.book}/${chapter}?ver=tb`);
        const data = response.data;

        // Find the specific verse in the chapter data
        // The API returns the whole chapter, we filter for our ref
        const verseText = data.verses
            .filter(v => {
                const requestedVerses = verseRange.includes('-')
                    ? range(parseInt(verseRange.split('-')[0]), parseInt(verseRange.split('-')[1]))
                    : [parseInt(verseRange)];
                return requestedVerses.includes(v.verse);
            })
            .map(v => v.content)
            .join(' ');

        res.status(200).json({
            type: 'verse',
            date: getTodayString(),
            verse: {
                text: verseText || 'Tuhanlah gembalaku, takkan kekurangan aku.',
                reference: `${randomVerse.book} ${randomVerse.ref}`,
                version: 'Terjemahan Baru (TB)'
            }
        });
    } catch (error) {
        console.error('Verse Fetch Error:', error.message);

        // Robust Fallback: List of full Indonesian verses if API fails
        const fallbackVerses = [
            { text: "Karena begitu besar kasih Allah akan dunia ini, sehingga Ia telah mengaruniakan Anak-Nya yang tunggal, supaya setiap orang yang percaya kepada-Nya tidak binasa, melainkan beroleh hidup yang kekal.", reference: "Yohanes 3:16", version: "TB" },
            { text: "Segala perkara dapat kutanggung di dalam Dia yang memberi kekuatan kepadaku.", reference: "Filipi 4:13", version: "TB" },
            { text: "Percayalah kepada TUHAN dengan segenap hatimu, dan janganlah bersandar kepada pengertianmu sendiri.", reference: "Amsal 3:5", version: "TB" },
            { text: "Tuhanlah gembalaku, takkan kekurangan aku.", reference: "Mazmur 23:1", version: "TB" },
            { text: "Kita tahu sekarang, bahwa Allah turut bekerja dalam segala sesuatu untuk mendatangkan kebaikan bagi mereka yang mengasihi Dia.", reference: "Roma 8:28", version: "TB" }
        ];

        const randomFallback = fallbackVerses[Math.floor(Math.random() * fallbackVerses.length)];

        res.status(200).json({
            type: 'verse',
            date: getTodayString(),
            verse: randomFallback
        });
    }
};

// Helper for ranges
function range(start, end) {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

// @desc    Get Daily Quiz (From Sheet)
// @route   GET /api/daily/quiz
// @access  Public
const getDailyQuiz = async (req, res) => {
    try {
        const today = getTodayString();
        const rows = await getRows('Quizzes');
        const quizRow = rows.find(r => r.Date === today);

        if (!quizRow) {
            // Return a default demo quiz instead of 404
            return res.status(200).json({
                type: 'quiz',
                date: today,
                quiz: {
                    question: 'Siapakah yang membangun bahtera?',
                    options: ['Musa|Nuh|Daud'],
                    correctIndex: 1, // Nuh
                    isDemo: true
                }
            });
        }

        res.status(200).json({
            type: 'quiz',
            date: today,
            quiz: {
                question: quizRow.Question,
                options: (quizRow.Options || '').split('|'),
                isDemo: false
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Submit Daily Quiz
// @route   POST /api/daily/quiz/submit
// @access  Private
const submitQuiz = async (req, res) => {
    const { answerIndex } = req.body;
    const today = getTodayString();

    try {
        const rows = await getRows('Quizzes');
        const quizRow = rows.find(r => r.Date === today);

        if (!quizRow) {
            return res.status(404).json({ message: 'No quiz for today' });
        }

        if (parseInt(answerIndex) === parseInt(quizRow.CorrectIndex)) {
            await updateUserPoints(req.user.email, 20);
            return res.status(200).json({ message: 'Correct!', pointsAdded: 20, correct: true });
        } else {
            return res.status(200).json({ message: 'Incorrect', pointsAdded: 0, correct: false });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create Daily Quiz (Admin)
// @route   POST /api/daily/quiz
// @access  Private/Admin
const createDailyQuiz = async (req, res) => {
    const { question, options, correctIndex, date } = req.body;

    if (!question || !options || correctIndex === undefined) {
        return res.status(400).json({ message: 'Please add all required fields' });
    }

    try {
        const newQuiz = {
            Date: date || getTodayString(),
            Question: question,
            Options: Array.isArray(options) ? options.join('|') : options,
            CorrectIndex: correctIndex.toString()
        };

        await syncToSheet('Quizzes', [newQuiz]);
        res.status(201).json(newQuiz);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDailyVerse,
    getDailyQuiz,
    submitQuiz,
    createDailyQuiz
};
