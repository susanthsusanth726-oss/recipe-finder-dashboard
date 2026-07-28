import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API lazily or safely on server
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// AI Endpoints
app.post('/api/ai/pantry-chef', async (req, res) => {
  try {
    const { ingredients, dietary, maxTime } = req.body;
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ error: 'Please provide at least one ingredient.' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Fallback response if no API key set
      return res.json({
        recipes: [
          {
            id: 'ai-fallback-1',
            title: `Quick ${ingredients[0]} & Herb Skillet`,
            description: `A delicious dish made with ${ingredients.join(', ')} cooked in garlic butter and herbs.`,
            prepTime: '20 mins',
            calories: 380,
            cuisine: 'Contemporary',
            diet: dietary || 'Balanced',
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
            ingredients: ingredients.map((ing: string) => `1 cup ${ing}`),
            instructions: [
              `Prep your main ingredients: ${ingredients.join(', ')}.`,
              'Heat 2 tbsp olive oil in a heavy skillet over medium-high heat.',
              'Sauté ingredients with sea salt, cracked black pepper, and herbs for 12-15 minutes.',
              'Garnish with fresh parsley and serve hot.'
            ],
            nutrition: { calories: 380, protein: '24g', carbs: '18g', fat: '22g' }
          }
        ]
      });
    }

    const prompt = `You are a world-class chef. The user has the following ingredients: ${ingredients.join(', ')}.
${dietary ? `Dietary restriction: ${dietary}` : ''}
${maxTime ? `Max cooking time: ${maxTime} mins` : ''}

Generate 2 creative, delicious, and realistic recipes that can be made using these ingredients.
Return strictly valid JSON array of objects with the following schema:
[
  {
    "id": "ai-1",
    "title": "Recipe Title",
    "description": "Short appetizing description",
    "prepTime": "25 mins",
    "calories": 450,
    "cuisine": "Italian / Asian / Mediterranean etc.",
    "diet": "Keto / Vegan / High Protein / Balanced",
    "rating": 4.9,
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
    "ingredients": ["Ingredient 1 with amount", "Ingredient 2 with amount"],
    "instructions": ["Step 1...", "Step 2...", "Step 3..."],
    "nutrition": { "calories": 450, "protein": "30g", "carbs": "25g", "fat": "18g" }
  }
]`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const jsonText = response.text || '[]';
    const parsed = JSON.parse(jsonText);
    res.json({ recipes: parsed });
  } catch (error: any) {
    console.error('Pantry AI error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate recipes.' });
  }
});

app.post('/api/ai/substitute', async (req, res) => {
  try {
    const { ingredient } = req.body;
    if (!ingredient) {
      return res.status(400).json({ error: 'Ingredient required' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        substitutes: [
          `For ${ingredient}: Try using equal parts Greek Yogurt or Coconut Milk for dairy, or Flaxseed meal (1 tbsp + 3 tbsp water) for eggs.`,
          `Applesauce or mashed bananas can replace butter/oil in baking.`
        ]
      });
    }

    const prompt = `Provide 3 smart culinary substitutes for the ingredient: "${ingredient}".
Give ratio guidance and brief culinary notes for each substitute.
Return JSON format: { "substitutes": [{ "name": "Substitute Name", "ratio": "1:1 ratio", "note": "Best for baking/sauces..." }] }`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Substitute AI error:', error);
    res.status(500).json({ error: 'Failed to find substitute.' });
  }
});

app.post('/api/ai/meal-plan-generator', async (req, res) => {
  try {
    const { goal, dietaryPref, calories } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        message: 'Generated fallback meal plan',
        plan: {
          Monday: { breakfast: 'Avocado Toast & Eggs', lunch: 'Grilled Chicken Caesar Salad', dinner: 'Pan-seared Salmon with Asparagus' },
          Tuesday: { breakfast: 'Greek Yogurt Berry Bowl', lunch: 'Quinoa Veggie Buddha Bowl', dinner: 'Turkey Meatballs with Zucchini Noodles' },
          Wednesday: { breakfast: 'Protein Oatmeal with Almonds', lunch: 'Mediterranean Wrap', dinner: 'Steak with Roasted Sweet Potatoes' },
        }
      });
    }

    const prompt = `Generate a 3-day meal plan based on: Goal: ${goal || 'General Health'}, Dietary Preference: ${dietaryPref || 'None'}, Target Calories: ${calories || 2000}.
Return JSON object mapping Days (Monday, Tuesday, Wednesday) to { breakfast, lunch, dinner, totalCalories, protein, carbs, fat }.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    res.json({ plan: JSON.parse(response.text || '{}') });
  } catch (error: any) {
    console.error('Meal plan AI error:', error);
    res.status(500).json({ error: 'Failed to generate meal plan.' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
