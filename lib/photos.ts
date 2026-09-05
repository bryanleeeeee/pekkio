export type Photo = {
  src: string;
  alt: string;
  credit: string;
  source: string;
  license?: string;
  licenseUrl?: string;
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
};
export const placePhoto = (id: string) =>
  photos[id] ||
  photos[id === "heritage" || id === "neighbours" ? "market" : "cc"];
