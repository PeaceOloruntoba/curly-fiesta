export type UiRecipe = {
  id: number;
  name: string;
  image_url: string;
};

// Extracted from ui.tsx (truncated fields to only those we persist)
export const RECIPES: UiRecipe[] = [
  {
    id: 2,
    name: "Moi Moi",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/2/2a/Moimoi_served_with_garri.jpg"
  },
  {
    id: 16,
    name: "Jollof Rice",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/0/0b/Jollof_rice_served_with_vegetables_and_chicken.jpg"
  },
  {
    id: 18,
    name: "Egusi Soup",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/6/6a/Egusi_Soup_Nigeria.jpg"
  },
  {
    id: 21,
    name: "Edikang Ikong",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/4/40/Edikang_Ikong_in_a_bowl.jpg"
  },
  {
    id: 22,
    name: "Afang Soup",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/6/62/Afang_Soup_Served.jpg"
  },
  {
    id: 23,
    name: "Beans & Plantain (Ewa Riro)",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/8/8b/Ewa_Riro_with_plantain.jpg"
  },
  {
    id: 24,
    name: "Okro Soup",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/4/4d/Nigerian_Seafood_Okro_Soup.jpg"
  },
  {
    id: 25,
    name: "Ogbono Soup",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/5/59/Ogbono_Soup_in_a_plate.jpg"
  },
  {
    id: 27,
    name: "White Rice & Stew",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/2/28/Plain_rice_and_stew_with_beef.jpg"
  },
  {
    id: 28,
    name: "Fried Rice",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/5/54/Fried_rice_with_chicken_and_plantain.jpg"
  },
  {
    id: 31,
    name: "Amala & Ewedu Soup",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/5/57/Amala_and_Ewedu_soup.jpg"
  },
  {
    id: 32,
    name: "Pounded Yam & Egusi",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/2/21/Pounded_yam_and_egusi_soup.jpg"
  },
  {
    id: 35,
    name: "Abacha (African Salad)",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/9/9f/Abacha_and_Ugba_with_fish.jpg"
  },
  {
    id: 36,
    name: "Nkwobi",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/c/cc/Nkwobi_served_in_a_bowl.jpg"
  },
  {
    id: 37,
    name: "Fisherman Soup",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/7/7d/Nigerian_Fisherman_Soup.jpg"
  },
  {
    id: 38,
    name: "Oha Soup",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/8/89/Oha_Soup.jpg"
  },
  {
    id: 40,
    name: "Gizdodo (Gizzard & Plantain)",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/7/7f/Gizdodo_in_a_pan.jpg"
  },
  {
    id: 41,
    name: "Pepper Soup",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/3/3f/Nigerian_Pepper_Soup_with_meat.jpg"
  },
  {
    id: 48,
    name: "Catfish Pepper Soup",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/6/6f/Catfish_Pepper_Soup.jpg"
  },
  {
    id: 53,
    name: "Boli (Roasted Plantain)",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/d/df/Boli_Roasted_Plantain_Nigeria.jpg"
  }
];
