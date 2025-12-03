export type RecipeDetailSchem = {
  id: number;
  name: string;
  description: string;
  details: string;
};

// Extracted from ui.tsx (truncated fields to only those we persist)
export const RECIPES: RecipeDetailSchem[] = [
  {
    "id": 46,
    "name": "Light Efo Riro",
    "description": "A lighter, healthier version of the classic Yoruba spinach stew. This adaptation reduces the oil content while maintaining the rich flavors and nutritional benefits of the leafy greens. It's perfect for health-conscious individuals who still want to enjoy traditional Nigerian cuisine.",
    "details": "<p><strong>Ingredients</strong>:</p><p>- 4 cups fresh spinach or green amaranth (chopped)</p><p>- 400g lean turkey or chicken (cut into pieces)</p><p>- 100g stockfish (soaked and shredded)</p><p>- 50g dried fish</p><p>- 3 tablespoons palm oil or vegetable oil</p><p>- 3 large tomatoes (blended)</p><p>- 1 red bell pepper (blended)</p><p>- 2 Scotch bonnet peppers (blended)</p><p>- 1 large onion (chopped)</p><p>- 2 tablespoons ground crayfish</p><p>- 2 seasoning cubes</p><p>- Salt to taste</p><p><br></p><p><strong>Instructions</strong>:</p><p>1. Season turkey or chicken with salt and one seasoning cube, then cook until tender with minimal water.</p><p>2. Add stockfish and dried fish, simmer for 5 minutes.</p><p>3. Heat oil in a pot and sauté onions until soft.</p><p>4. Add blended tomatoes and peppers, fry for 10 minutes until oil separates.</p><p>5. Add cooked meat, fish, and a little stock.</p><p>6. Stir in ground crayfish and remaining seasoning cube.</p><p>7. Simmer for 5 minutes.</p><p>8. Add chopped spinach and stir well.</p><p>9. Cook for 3–5 minutes until spinach wilts.</p><p>10. Adjust seasoning and serve with brown rice, boiled yam, or whole wheat swallow.</p><p><br></p>"
  },
  {
    "id": 47,
    "name": "Yam Porridge (Light)",
    "description": "A lighter version of the traditional Nigerian yam porridge, using less oil while maintaining the creamy texture and rich flavors. This nutritious one-pot meal is perfect for a healthy lunch or dinner.",
    "details": "<p><strong>Ingredients</strong>:</p><p>- 1kg white yam (peeled and cut into cubes)</p><p>- 300g lean chicken or turkey (optional)</p><p>- 3 large tomatoes (blended)</p><p>- 1 red bell pepper (blended)</p><p>- 2 Scotch bonnet peppers (blended)</p><p>- 1 large onion (chopped)</p><p>- 3 tablespoons palm oil or vegetable oil</p><p>- 1 cup spinach or uGu (sliced)</p><p>- 2 tablespoons ground crayfish</p><p>- 2 seasoning cubes</p><p>- 1 teaspoon thyme</p><p>- Salt to taste</p><p><br></p><p><strong>Instructions</strong>:</p><p>1. If using meat, season and cook until tender, then set aside with the stock.</p><p>2. Place yam cubes in a pot and add stock or water to barely cover.</p><p>3. Add salt and cook until half-tender.</p><p>4. In a separate pot, heat oil and sauté onions.</p><p>5. Add blended tomatoes and peppers, fry for 8 minutes.</p><p>6. Pour tomato mixture into yam pot.</p><p>7. Add cooked meat, crayfish, thyme, and seasoning cubes.</p><p>8. Stir gently, breaking some yam pieces to thicken.</p><p>9. Cook on low heat for 10 minutes.</p><p>10. Add sliced greens and cook for 2 minutes.</p><p>11. Adjust seasoning and serve hot.</p><p><br></p>"
  },
  {
    "id": 48,
    "name": "Catfish Pepper Soup",
    "description": "A spicy, aromatic soup featuring fresh catfish cooked in a flavorful broth of African spices and herbs. Known for its warming and therapeutic qualities, it’s often enjoyed as a light meal or appetizer.",
    "details": "<p><strong>Ingredients</strong>:</p><p>- 1kg fresh catfish (cut into chunks)</p><p>- 2–3 tablespoons pepper soup spice mix</p><p>- 5–6 Scotch bonnet peppers (whole or crushed)</p><p>- 2 medium onions (sliced)</p><p>- 4 cloves garlic (crushed)</p><p>- 1 tablespoon fresh ginger (grated)</p><p>- 1 teaspoon ground ehuru</p><p>- 10–12 uziza or scent leaves (sliced)</p><p>- 2 seasoning cubes</p><p>- 1 teaspoon ground uziza seeds</p><p>- Salt to taste</p><p>- Water (about 6 cups)</p><p><br></p><p><strong>Instructions</strong>:</p><p>1. Clean catfish with hot water and lemon to remove slime.</p><p>2. Season fish lightly with salt and set aside.</p><p>3. In a pot, add water, onions, garlic, and ginger.</p><p>4. Bring to a boil, then add pepper soup spice, ehuru, uziza seeds, and seasoning cubes.</p><p>5. Let spices boil for 5 minutes.</p><p>6. Gently add catfish pieces.</p><p>7. Reduce heat and simmer for 10–15 minutes.</p><p>8. Adjust seasoning and water if needed.</p><p>9. Add sliced uziza or scent leaves.</p><p>10. Cook for 2 minutes and remove from heat.</p><p>11. Serve hot with yam, plantain, or rice.</p><p><br></p>"
  },
  {
    "id": 49,
    "name": "Puff Puff",
    "description": "A popular Nigerian deep-fried snack that is soft, airy, slightly sweet, and loved across the country. Puff puff is a party favorite and street food classic.",
    "details": "<p><strong>Ingredients</strong>:</p><p>- 3 cups all-purpose flour</p><p>- 1/2 cup granulated sugar</p><p>- 2 teaspoons instant yeast</p><p>- 1/2 teaspoon salt</p><p>- 1/2 teaspoon nutmeg</p><p>- 1 1/2 cups warm water</p><p>- 1 teaspoon vanilla extract (optional)</p><p>- Vegetable oil for deep frying</p><p><br></p><p><strong>Instructions</strong>:</p><p>1. Mix flour, sugar, yeast, salt, and nutmeg.</p><p>2. Add warm water gradually to form smooth batter.</p><p>3. Add vanilla if using.</p><p>4. Cover and let rise 45 minutes to 1 hour.</p><p>5. Heat oil in deep pan.</p><p>6. Drop batter into oil in small scoops.</p><p>7. Fry until golden brown, turning occasionally.</p><p>8. Drain on paper towels and serve warm.</p><p><br></p>"
  },
  {
    "id": 50,
    "name": "Chin Chin",
    "description": "A crunchy, slightly sweet Nigerian snack made from fried dough. Popular during festive seasons and enjoyed by both children and adults.",
    "details": "<p><strong>Ingredients</strong>:</p><p>- 4 cups flour</p><p>- 1 cup sugar</p><p>- 1/2 cup butter or margarine</p><p>- 2 eggs</p><p>- 1 teaspoon baking powder</p><p>- 1/2 teaspoon nutmeg</p><p>- 1/4 teaspoon salt</p><p>- 1/2 cup milk</p><p>- 1 teaspoon vanilla extract</p><p>- Oil for frying</p><p><br></p><p><strong>Instructions</strong>:</p><p>1. Mix flour, sugar, baking powder, nutmeg, and salt.</p><p>2. Add butter and mix to crumbs.</p><p>3. Whisk eggs, milk, and vanilla.</p><p>4. Combine wet and dry ingredients to form dough.</p><p>5. Knead lightly and roll out.</p><p>6. Cut into small squares.</p><p>7. Fry until golden brown, stirring occasionally.</p><p>8. Drain and cool completely before storing.</p><p><br></p>"
  },
  {
    "id": 51,
    "name": "Plantain Chips",
    "description": "Crispy thin slices of plantain fried to perfection. A classic Nigerian street snack, savory or slightly sweet depending on ripeness.",
    "details": "<p><strong>Ingredients</strong>:</p><p>- 4 firm plantains</p><p>- Oil for frying</p><p>- Salt to taste</p><p>- Optional pepper or paprika</p><p><br></p><p><strong>Instructions</strong>:</p><p>1. Peel and slice plantains very thinly.</p><p>2. Soak in cold salted water for 10 minutes.</p><p>3. Drain and pat dry.</p><p>4. Heat oil to 350°F.</p><p>5. Fry in batches until golden.</p><p>6. Drain and season while hot.</p><p>7. Cool completely for crispiness.</p><p><br></p>"
  },
  {
    "id": 52,
    "name": "Coconut Candy",
    "description": "A sweet, chewy Nigerian treat made from caramelized sugar and shredded coconut. Popular at parties and festive occasions.",
    "details": "<p><strong>Ingredients</strong>:</p><p>- 2 cups shredded coconut</p><p>- 2 cups sugar</p><p>- 1/2 cup water</p><p>- 1 teaspoon vanilla</p><p>- Red coloring (optional)</p><p>- Pinch of salt</p><p><br></p><p><strong>Instructions</strong>:</p><p>1. Combine sugar and water in pot and dissolve.</p><p>2. Add shredded coconut and stir.</p><p>3. Add vanilla, salt, and coloring (optional).</p><p>4. Cook 15–20 minutes until thick and sticky.</p><p>5. Drop spoonfuls onto parchment to cool.</p><p>6. Let harden completely before serving.</p><p><br></p>"
  },
  {
    "id": 53,
    "name": "Boli (Roasted Plantain)",
    "description": "A classic Nigerian roasted plantain snack with a smoky caramelized flavor, served with peanuts or pepper sauce.",
    "details": "<p><strong>Ingredients</strong>:</p><p>- 4 ripe plantains</p><p>- Oil for brushing (optional)</p><p>- Salt (optional)</p><p><br></p><p><strong>Ingredients (Pepper Sauce)</strong>:</p><p>- 4 tomatoes</p><p>- 2–3 Scotch bonnet peppers</p><p>- 1 small onion</p><p>- Salt to taste</p><p>- Palm oil</p><p><br></p><p><strong>Instructions</strong>:</p><p>1. Leave plantains unpeeled and score lightly.</p><p>2. Roast over grill or oven for 15–20 minutes, turning often.</p><p>3. Peel charred skin and serve.</p><p>4. For sauce: roast tomatoes, peppers, onions and blend with salt and palm oil.</p><p><br></p>"
  },
  {
    "id": 54,
    "name": "Meat Pie",
    "description": "A savory Nigerian pastry filled with spiced minced meat and vegetables. Flaky, delicious, and perfect for snacks or parties.",
    "details": "<p><strong>Ingredients (Pastry)</strong>:</p><p>- 4 cups flour</p><p>- 1 cup butter (cold)</p><p>- 1 egg</p><p>- 1/2 cup cold water</p><p>- 1 teaspoon salt</p><p>- 1 teaspoon baking powder</p><p><br></p><p><strong>Ingredients (Filling)</strong>:</p><p>- 500g minced beef</p><p>- 3 potatoes (diced)</p><p>- 2 carrots (diced)</p><p>- 1 onion (chopped)</p><p>- 2 cloves garlic</p><p>- Curry, thyme, salt, pepper</p><p>- 2 seasoning cubes</p><p>- 2 tablespoons oil</p><p><br></p><p><strong>Ingredients (Egg Wash)</strong>:</p><p>- 1 egg (beaten)</p><p><br></p><p><strong>Instructions</strong>:</p><p>1. Prepare filling by sautéing onion and garlic.</p><p>2. Add beef and spices, cook until browned.</p><p>3. Add potatoes and carrots, cook until tender.</p><p>4. Mix pastry ingredients to form dough and chill 30 minutes.</p><p>5. Roll dough and cut circles.</p><p>6. Fill, fold, seal with fork.</p><p>7. Brush with egg wash.</p><p>8. Bake 30–35 minutes at 350°F.</p><p><br></p>"
  },
  {
    "id": 55,
    "name": "Samosa",
    "description": "A crispy triangular pastry filled with spiced meat or vegetables. Popular Nigerian party snack with Asian and Middle Eastern influence.",
    "details": "<p><strong>Ingredients (Wrapper)</strong>:</p><p>- 2 cups flour</p><p>- 1/4 cup oil</p><p>- 1/2 teaspoon salt</p><p>- 1/2 cup water</p><p><br></p><p><strong>Ingredients (Filling)</strong>:</p><p>- 300g minced meat</p><p>- 2 potatoes (mashed)</p><p>- 1 onion</p><p>- 2 cloves garlic</p><p>- 2 Scotch bonnet peppers</p><p>- Curry, ginger, seasoning cubes</p><p>- Salt and pepper</p><p><br></p><p><strong>Ingredients (Frying)</strong>:</p><p>- Vegetable oil</p><p><br></p><p><strong>Instructions</strong>:</p><p>1. Prepare filling by frying onions, garlic, and peppers.</p><p>2. Add meat, spices, potatoes, mix and cool.</p><p>3. Make wrapper dough, knead and roll thin.</p><p>4. Cut into semicircles, form cones.</p><p>5. Fill cones and seal with water.</p><p>6. Deep fry until golden.</p><p><br></p>"
  },
  {
    "id": 56,
    "name": "Fish Roll",
    "description": "A Nigerian bakery classic: spiced fish wrapped in soft dough and deep-fried until golden and crispy.",
    "details": "<p><strong>Ingredients (Dough)</strong>:</p><p>- 3 cups flour</p><p>- 2 tablespoons butter</p><p>- 2 tablespoons sugar</p><p>- 1 teaspoon yeast</p><p>- 1/2 teaspoon salt</p><p>- 1 cup warm milk</p><p>- 1 egg</p><p><br></p><p><strong>Ingredients (Filling)</strong>:</p><p>- 400g tuna or flaked fish</p><p>- 2 potatoes (mashed)</p><p>- 1 onion</p><p>- 2 carrots (grated)</p><p>- 1 Scotch bonnet</p><p>- Seasoning cubes, thyme, salt, pepper</p><p><br></p><p><strong>Instructions</strong>:</p><p>1. Prepare filling by sautéing onion and pepper in oil.</p><p>2. Add fish, carrots, potatoes, and seasoning.</p><p>3. Mix dough ingredients and knead smooth.</p><p>4. Rise 45 minutes, punch down, divide.</p><p>5. Roll portions, add filling, roll tight.</p><p>6. Deep fry 4–5 minutes until golden.</p><p><br></p>"
  },
  {
    "id": 57,
    "name": "Groundnut (Roasted)",
    "description": "Crunchy roasted peanuts enjoyed across Nigeria. Can be roasted plain, salted, or spiced.",
    "details": "<p><strong>Ingredients</strong>:</p><p>- 2 cups raw groundnuts</p><p>- 1–2 tablespoons oil (optional)</p><p>- Salt to taste</p><p>- Optional spices</p><p><br></p><p><strong>Instructions (Stovetop)</strong>:</p><p>1. Heat pan and add groundnuts.</p><p>2. Dry roast 15–20 minutes stirring constantly.</p><p>3. Toss with salt and oil if desired.</p><p>4. Cool completely.</p><p><br></p><p><strong>Instructions (Oven)</strong>:</p><p>1. Preheat oven to 350°F.</p><p>2. Spread nuts on tray and roast 15–20 minutes, stirring every 5 minutes.</p><p>3. Season, cool, and store.</p><p><br></p>"
  },
  {
    "id": 58,
    "name": "Tiger Nut Drink (Kunu Aya)",
    "description": "A refreshing, creamy beverage made from tiger nuts. Naturally sweet, dairy-free, and rich in nutrients.",
    "details": "<p><strong>Ingredients</strong>:</p><p>- 2 cups tiger nuts</p><p>- 4 cups water</p><p>- 1/2 cup coconut flakes (optional)</p><p>- 1/4 cup dates (optional)</p><p>- 1 teaspoon vanilla</p><p>- 1/2 teaspoon ginger</p><p>- Sugar or honey (optional)</p><p>- Ice cubes</p><p><br></p><p><strong>Instructions</strong>:</p><p>1. Rinse and soak tiger nuts 12–24 hours.</p><p>2. Drain and blend with water, coconut, and dates.</p><p>3. Blend 3–5 minutes until smooth.</p><p>4. Strain through cloth or fine sieve.</p><p>5. Add vanilla and ginger.</p><p>6. Sweeten to taste.</p><p>7. Chill at least 2 hours and serve over ice.</p><p><br></p>"
  }
]
