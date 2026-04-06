import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Méthode non autorisée." });
  }

  try {
    const { message } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({ reply: "Message manquant." });
    }

    const response = await client.responses.create({
      model: "gpt-5.4-mini",
      input: [
        {
          role: "system",
          content: `
Tu es l'assistant officiel de 2KPI Aviculture.

Réponds en français simple, clair et professionnel.
Tu réponds uniquement sur la ferme et ses activités.

Informations fiables :
- 2KPI Aviculture est une ferme avicole située à Bodokro, à environ 60 km de Bouaké, en Côte d’Ivoire.
- Activité actuelle : élevage de poulets de chair.
- Cycle actuel : environ 45 jours.
- La ferme recherche des partenariats avec maquis, restaurants, revendeurs et partenaires locaux.
- Contact principal : WhatsApp +225 07 77 59 96 05.
- Le formulaire du site peut aussi être utilisé.

Règles :
- N’invente jamais de prix, de stock, de capacité exacte, ni de délai de livraison.
- Si la personne veut commander ou proposer un partenariat, invite-la à écrire sur WhatsApp.
- Garde des réponses courtes et utiles.
          `.trim(),
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    return res.status(200).json({
      reply: response.output_text || "Je n’ai pas pu répondre pour le moment."
    });
  } catch (error) {
    return res.status(500).json({
      reply: "Une erreur est survenue. Veuillez nous contacter sur WhatsApp au +225 07 77 59 96 05."
    });
  }
}