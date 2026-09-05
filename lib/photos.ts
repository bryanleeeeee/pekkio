export type Photo = {
  src: string;
  alt: string;
  credit: string;
  source: string;
  license?: string;
  licenseUrl?: string;
  note?: string;
};
export const photos: Record<string, Photo> = {
  market: {
    src: "https://upload.wikimedia.org/wikipedia/commons/4/4d/Pek_Kio_Market_and_Food_Centre.jpg",
    alt: "Pek Kio Market and Food Centre sign and entrance, photographed in August 2025",
    credit: "Kbseah · 2025 · cropped",
    source:
      "https://commons.wikimedia.org/wiki/File:Pek_Kio_Market_and_Food_Centre.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  stalls: {
    src: "https://upload.wikimedia.org/wikipedia/commons/3/31/Pek_Kio_Market_and_Food_Centre_food_stalls.jpg",
    alt: "Real food stalls and tables inside Pek Kio Market and Food Centre, August 2025",
    credit: "Kbseah · 2025 · cropped",
    source:
      "https://commons.wikimedia.org/wiki/File:Pek_Kio_Market_and_Food_Centre_food_stalls.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  "pin-wei": {
    src: "https://dam.mediacorp.sg/image/upload/s--zw9iE4hf--/c_fill%2Cg_center%2Ch_598%2Cw_747/f_auto%2Cq_auto/makan-kakis-pek-kio-pin-wei-chee-cheong-fun--2-.jpg?itok=RjYQeR_E",
    alt: "Pin Wei Hong Kong Style Chee Cheong Fun at Pek Kio, photographed by Denise Tan",
    credit: "Denise Tan / CNA Lifestyle",
    source:
      "https://cnalifestyle.channelnewsasia.com/dining/best-local-food-singapore-chee-cheong-fun-pek-kio-pin-wei-256311",
  },
  "wah-kee": {
    src: "https://dam.mediacorp.sg/image/upload/s--nPrfKvrc--/c_crop%2Ch_715%2Cw_893%2Cx_165%2Cy_1/c_fill%2Cg_center%2Ch_598%2Cw_747/f_auto%2Cq_auto/v1/mediacorp/cna/image/2026/05/28/wah-kee-big-prawn-noodles-reopens-after-3-month-closure_3.png?itok=CKYwmlGN",
    alt: "A bowl of Wah Kee Big Prawn Noodles featured by CNA Lifestyle",
    credit: "Javier Lee / Google Maps, via CNA",
    source:
      "https://cnalifestyle.channelnewsasia.com/dining/wah-kee-big-prawn-noodles-reopens-after-3-month-closure-583786",
  },
  cc: {
    src: "https://edge.sitecorecloud.io/peoplesasso3f3f-peoplesassodf2c-productionb69a-0d06/media/Images/Outlets/Pek-Kio-CC-2.jpg?h=957&iar=0&w=1435",
    alt: "Pek Kio Community Club at Gloucester Road, as shown on onePA",
    credit: "People’s Association / onePA",
    source: "https://www.onepa.gov.sg/cc/pek-kio-cc",
  },
  "lai-hiang": {
    src: "https://eatbook.sg/wp-content/uploads/2023/08/lai-hiang-pork-rib-prawn-mee-cover.jpg",
    alt: "Lai Hiang prawn mee photographed for Eatbook",
    credit: "Heather Ng / Eatbook",
    source: "https://eatbook.sg/lai-hiang-pork-rib-prawn-mee/",
  },
  "sheng-seng": {
    src: "https://danielfooddiary.com/wp-content/uploads/2019/04/shengsheng4.jpg",
    alt: "Sheng Seng fried prawn noodles featured by DanielFoodDiary",
    credit: "DanielFoodDiary.com",
    source: "https://danielfooddiary.com/2019/04/05/shengseng/",
  },
  "yean-heng": {
    src: "https://eatbook.sg/wp-content/uploads/2023/01/YEAN-HENG-PANCAKE-UPDATED-COVER.jpg",
    alt: "Yean Heng pancakes featured by Eatbook",
    credit: "Eatbook / credited contributors",
    source: "https://eatbook.sg/yean-heng-pancake/",
  },
  "min-hiang": {
    src: "https://sethlui.com/wp-content/uploads/2019/06/pek-kio-market-10-800x533.jpg",
    alt: "Min Hiang soya bean and grass jelly drinks",
    credit: "Calida Soh / SETHLUI.com",
    source: "https://sethlui.com/pek-kio-market-food-centre-food-guide/",
  },
  "cambridge-roast": {
    src: "https://sethlui.com/wp-content/uploads/2019/06/pek-kio-market-16-800x533.jpg",
    alt: "Roast meats at Cambridge Road Hong Kong Roast Pork",
    credit: "Calida Soh / SETHLUI.com",
    source: "https://sethlui.com/pek-kio-market-food-centre-food-guide/",
  },
  "sin-kee": {
    src: "https://eatbook.sg/wp-content/uploads/2018/01/pek-kio-food-Nasi-Lemak.jpg",
    alt: "Nasi lemak from Sin Kee in the Eatbook guide",
    credit: "Sin Kee / Foursquare, via Eatbook",
    source: "https://eatbook.sg/pek-kio-food/",
  },
  "cambridge-ytf": {
    src: "https://eatbook.sg/wp-content/uploads/2018/01/pek-kio-food-Yong-Tau-Fu.jpg",
    alt: "Cambridge Road Yong Tau Foo featured in Eatbook",
    credit: "@dreamw0k / Instagram, via Eatbook",
    source: "https://eatbook.sg/pek-kio-food/",
  },
  "old-hen": {
    src: "https://static.wixstatic.com/media/6f42ff_d4cd74b22445409bbdbd19942ac4dc8d~mv2.jpg",
    alt: "Old Hen Coffee food flatlay from its Owen Road webpage",
    credit: "Old Hen Coffee",
    source: "https://www.oldhencoffee.com/",
  },
  syip: {
    src: "https://media.timeout.com/images/106155900/750/422/image.jpg",
    alt: "SYIP café photo supplied to Time Out; outlet unspecified",
    credit: "SYIP / Time Out",
    source:
      "https://www.timeout.com/singapore/restaurants/50-best-cafes-singapore",
    note: "SYIP brand photo · outlet unspecified",
  },
  daizu: {
    src: "https://www.daizucafe.com/wp-content/uploads/2020/10/cropped-brunch-1.png",
    alt: "Brunch photo from Daizu Cafe’s official website",
    credit: "Daizu Cafe",
    source: "https://www.daizucafe.com/",
  },
  "pek-kio-park": {
    src: "https://www.littledayout.com/wp-content/uploads/pekkiopark_02.jpg",
    alt: "The therapeutic garden at Pek Kio Park, photographed by Little Day Out",
    credit: "Little Day Out",
    source: "https://www.littledayout.com/pek-kio-park-therapeutic-garden-nature-play-area-petanque-court/",
  },
  heartroom: {
    src: "https://cdn.heartroomgallery.com/wp-content/uploads/2016/07/27202243/Bamboo-on-Canvas-Revolution-Slider.jpg",
    alt: "Example bamboo canvas painting shown by Heartroom Gallery",
    credit: "Heartroom Gallery",
    source: "https://heartroomgallery.com/",
    note: "Example artwork · not the session venue",
  },
  activesg: {
    src: "https://isomer-user-content.by.gov.sg/46/1d733b30-dc83-48b6-8e16-c1abb7dde058/Photo%201.jpeg",
    alt: "Pickleball players at the March 2026 opening of ActiveSG Courts at Farrer Park",
    credit: "Sport Singapore",
    source:
      "https://www.sportsingapore.gov.sg/media-centre/activesg-courts---farrer-park-opens--showcasing-creative-space-optimisation-with-bus-terminal-sports-integration/",
    note: "Launch photograph · March 2026",
  },
  "indian-heritage": {
    src: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Indian_Heritage_Centre%2C_Singapore_-_20150423-02.jpg",
    alt: "Indian Heritage Centre building at Campbell Lane in April 2015",
    credit: "Smuconlaw · 2015 · cropped",
    source:
      "https://commons.wikimedia.org/wiki/File:Indian_Heritage_Centre,_Singapore_-_20150423-02.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
};
const photoAliases: Record<string, string> = {
  "good-spice": "stalls",
  heritage: "market",
  neighbours: "market",
  badminton: "cc",
  arts: "cc",
  "little-india-trail": "indian-heritage",
  "breakfast-plan": "stalls",
  "creative-plan": "heartroom",
};
export const placePhoto = (id: string): Photo => {
  if (photos[id]) return photos[id];
  const key = photoAliases[id] || "market";
  return {
    ...photos[key],
    note:
      id === "good-spice"
        ? "Pek Kio Market · location photo"
        : id === "little-india-trail"
          ? "Trail starting point · Indian Heritage Centre"
          : photos[key].note,
  };
};
