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

// API endpoint to get all coupons from Google Sheets
export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const sheets = getSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;

    if (!spreadsheetId) {
      console.error("GOOGLE_SHEETS_ID environment variable not set");
      return res.status(500).json({ error: "Server configuration error" });
    }

    // Read data from the coupons sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "coupons!A:F", // Columns A through F (id, name, description, used, used_at, redeemed_by)
    });

    const rows = response.data.values || [];

    // Skip header row and convert to objects
    const coupons = rows.slice(1).map((row, index) => ({
      id: row[0] || `coupon-${index + 1}`,
      name: row[1] || "",
      description: row[2] || "",
      used: row[3] === "TRUE" || row[3] === "true",
      used_at: row[4] || null,
      redeemed_by: row[5] || null,
    }));

    return res.status(200).json(coupons);
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return res.status(500).json({ error: "Error loading coupons" });
  }
}

