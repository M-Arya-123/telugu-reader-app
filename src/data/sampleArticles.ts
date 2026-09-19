export type ReadingLevel = "beginner" | "intermediate" | "advanced";

export type SampleArticle = {
    id: string;
    title: string;
    englishTitle: string;
    level: ReadingLevel;
    difficultyLabel: string;
    description: string;
    content: string;
};

export const sampleArticles: SampleArticle[] = [
    {
        id: "level-1-simple",
        title: "సరళ వాక్యాలు",
        englishTitle: "Simple Everyday Words",
        level: "beginner",
        difficultyLabel: "Level 1 • Beginner",
        description: "Short words and sentences using basic consonants and vowels.",
        content: "కలం పలక బలపం ఆట పాట. అమ్మ మాట వినాలి. మంచి అలవాట్లు నేర్వాలి. బడికి వెళ్ళి చదువుకోవాలి.",
    },
    {
        id: "level-2-culture",
        title: "మన తెలుగు భాష",
        englishTitle: "Our Sweet Telugu Language",
        level: "intermediate",
        difficultyLabel: "Level 2 • Intermediate",
        description: "Sentences with common matras (vowel signs) and descriptive vocabulary.",
        content: "తెలుగు భాష చాలా తీయనైనది మరియు ప్రాచీనమైనది. మన రాష్ట్రంలో అందమైన పర్వతాలు, పచ్చని పొలాలు ఉన్నాయి. గోదావరి మరియు కృష్ణా నదులు మన నేలను సస్యశ్యామలం చేస్తున్నాయి.",
    },
    {
        id: "level-3-story",
        title: "తెలివైన కాకి",
        englishTitle: "The Clever Crow (Fable)",
        level: "advanced",
        difficultyLabel: "Level 3 • Story Mode",
        description: "A classic fable featuring conjunct consonants (ఒత్తులు) and rich storytelling.",
        content: "ఒక ఊరిలో ఒక తెలివైన కాకి ఉండేది. ఒక ఎండాకాలంలో దానికి విపరీతమైన దాహం వేసింది. నీటి కోసం అది ఆకాశంలో అంతటా వెతికింది. చివరకు ఒక ఇంటి పెరట్లో చిన్న కుండ కనిపించింది. కుండ అడుగున కొద్దిగా నీరు ఉంది. కాకికి ఒక మంచి ఆలోచన వచ్చింది. అది చుట్టుపక్కల ఉన్న చిన్న చిన్న రాళ్లను ముక్కుతో తెచ్చి కుండలో వేసింది. నీరు మెల్లగా పైకి వచ్చింది. కాకి సంతోషంగా నీరు తాగి తన దాహం తీర్చుకుని హాయిగా ఎగిరిపోయింది.",
    },
];
