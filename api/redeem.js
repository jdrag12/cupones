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

// Send email via Resend API
async function sendEmail(couponName, timestamp) {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    console.error("RESEND_API_KEY environment variable not set");
    return false;
  }

  try {
    const formattedDate = new Intl.DateTimeFormat("ca-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/Madrid",
    }).format(new Date(timestamp));

    const emailData = {
      from: "onboarding@resend.dev",
      to: ["jdrago10@gmail.com"],
      subject: `Cupó bescanviat: ${couponName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #fef7f0;">
          <div style="background: #f8b5c1; padding: 20px; border-radius: 16px; text-align: center; margin-bottom: 20px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🎁 Cupó bescanviat</h1>
          </div>
          <div style="background: white; padding: 20px; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #2d3748; margin-bottom: 15px;">${couponName}</h2>
            <p style="color: #718096; margin-bottom: 10px;"><strong>Data i hora:</strong> ${formattedDate}</p>
            <p style="color: #718096; margin-bottom: 10px;"><strong>bescanviat per:</strong> Tuxi</p>
            <p style="color: #718096; font-size: 14px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              Aquest cupó ha estat bescanviat des de l'aplicació d'aniversari.
            </p>
          </div>
        </div>
      `,
    };

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Resend API error:", errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

// API endpoint to redeem a coupon
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id, customDateTime } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Missing coupon ID" });
    }

    const sheets = getSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;

    if (!spreadsheetId) {
      console.error("GOOGLE_SHEETS_ID environment variable not set");
      return res.status(500).json({ error: "Server configuration error" });
    }

    // First, get the current coupon data
    const getResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "coupons!A:F",
    });

    const rows = getResponse.data.values || [];
    const headerRow = rows[0] || [];
    const dataRows = rows.slice(1);

    // Find the coupon by ID
    const couponIndex = dataRows.findIndex((row) => row[0] === id);

    if (couponIndex === -1) {
      return res.status(404).json({ error: "Coupon not found" });
    }

    const couponRow = dataRows[couponIndex];
    const couponName = couponRow[1] || "Unknown";
    const isAlreadyUsed = couponRow[3] === "TRUE" || couponRow[3] === "true";

    if (isAlreadyUsed) {
      return res.status(409).json({ error: "already_used" });
    }

    // Update the coupon to mark it as used
    const now = customDateTime || new Date().toISOString();
    const rowNumber = couponIndex + 2; // +2 because we skip header and arrays are 0-indexed

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `coupons!D${rowNumber}:F${rowNumber}`,
      valueInputOption: "RAW",
      requestBody: {
        values: [[true, now, "Tuxi"]],
      },
    });

    // Send email notification
    await sendEmail(couponName, now);

    // Return updated coupon data
    const updatedCoupon = {
      id: couponRow[0],
      name: couponName,
      description: couponRow[2] || "",
      used: true,
      used_at: now,
      redeemed_by: "Tuxi",
    };

    return res.status(200).json(updatedCoupon);
  } catch (error) {
    console.error("Error redeeming coupon:", error);
    return res.status(500).json({ error: "Error redeeming coupon" });
  }
}
