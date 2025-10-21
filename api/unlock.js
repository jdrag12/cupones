// API endpoint to check if birthday matches the expected date
export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { d } = req.query;

    if (!d) {
      return res.status(400).json({ error: "Missing date parameter" });
    }

    // Get expected birthday from environment variable
    const expectedBirthday = process.env.BIRTHDAY_DDMMYYYY;

    if (!expectedBirthday) {
      console.error("BIRTHDAY_DDMMYYYY environment variable not set");
      return res.status(500).json({ error: "Server configuration error" });
    }

    // Compare dates (both should be in DD/MM/YYYY format)
    const isMatch = d === expectedBirthday;

    return res.status(200).json({
      success: isMatch,
      message: isMatch ? "Date matches" : "Date does not match",
    });
  } catch (error) {
    console.error("Error in unlock API:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
