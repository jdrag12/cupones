import { google } from "googleapis";

// Initialize Google Sheets API
function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

// Seed data for coupons
const couponsData = [
  {
    id: "massatge-relaxant",
    name: "Massatge relaxant",
    description: "Sessió de massatge de 45 minuts amb música suau.",
    used: false,
    used_at: "",
    redeemed_by: "",
  },
  {
    id: "sopar-especial",
    name: "Sopar especial",
    description: "Sopar al teu restaurant preferit (tu tries el lloc).",
    used: false,
    used_at: "",
    redeemed_by: "",
  },
  {
    id: "esmorzar-al-llit",
    name: "Esmorzar al llit",
    description: "Esmorzar casolà amb cafè/te i fruita.",
    used: false,
    used_at: "",
    redeemed_by: "",
  },
  {
    id: "picnic-sorpresa",
    name: "Pícnic sorpresa",
    description: "Manta, snacks i passeig amb fotos boniques.",
    used: false,
    used_at: "",
    redeemed_by: "",
  },
  {
    id: "nit-sushi-vi",
    name: "Nit de sushi i vi",
    description: "Sushi variat i copa de vi, estil chill.",
    used: false,
    used_at: "",
    redeemed_by: "",
  },
  {
    id: "sortida-del-sol",
    name: "Sortida del sol",
    description: "Matinar per veure la sortida del sol junts.",
    used: false,
    used_at: "",
    redeemed_by: "",
  },
  {
    id: "escapada-espontania",
    name: "Escapada espontània",
    description: "Mini-escapada d'un dia, destí sorpresa.",
    used: false,
    used_at: "",
    redeemed_by: "",
  },
  {
    id: "dia-improvisacio",
    name: "Dia d'improvisació",
    description: "Sense plans, només improvisar i gaudir.",
    used: false,
    used_at: "",
    redeemed_by: "",
  },
  {
    id: "tarda-platja-muntanya",
    name: "Tarda de platja o muntanya",
    description: "Passeig, bany o ruta senzilla.",
    used: false,
    used_at: "",
    redeemed_by: "",
  },
  {
    id: "sessio-jocs",
    name: "Sessió de jocs",
    description: "Jocs de taula o videojocs cooperatius.",
    used: false,
    used_at: "",
    redeemed_by: "",
  },
];

// API endpoint to seed initial coupons data
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Check for seed token if provided
    const seedToken = process.env.SEED_TOKEN;
    if (seedToken) {
      const { token } = req.body;
      if (token !== seedToken) {
        return res.status(401).json({ error: "Invalid seed token" });
      }
    }

    const sheets = getSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;

    if (!spreadsheetId) {
      console.error("GOOGLE_SHEETS_ID environment variable not set");
      return res.status(500).json({ error: "Server configuration error" });
    }

    // Check if data already exists
    const getResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "coupons!A:A",
    });

    const existingRows = getResponse.data.values || [];

    // If we have more than just the header, data already exists
    if (existingRows.length > 1) {
      return res.status(409).json({
        error: "Data already exists",
        message: "Coupons data has already been seeded",
      });
    }

    // Prepare data for insertion
    const values = [
      ["id", "name", "description", "used", "used_at", "redeemed_by"], // Header row
      ...couponsData.map((coupon) => [
        coupon.id,
        coupon.name,
        coupon.description,
        coupon.used,
        coupon.used_at,
        coupon.redeemed_by,
      ]),
    ];

    // Insert the data
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: "coupons!A1",
      valueInputOption: "RAW",
      requestBody: {
        values,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Coupons data seeded successfully",
      count: couponsData.length,
    });
  } catch (error) {
    console.error("Error seeding coupons:", error);
    return res.status(500).json({ error: "Error seeding coupons data" });
  }
}

