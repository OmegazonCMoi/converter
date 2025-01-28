import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { parse } from "vcard4";

// Fonction pour formater les numéros de téléphone
const formatPhoneNumber = (number: any): string | null => {
  if (typeof number !== "string") {
    number = String(number);
  }

  let cleanedNumber = number.replace(/[^\d+]/g, "");

  if (cleanedNumber.startsWith("+33") && cleanedNumber[3] === "0") {
    cleanedNumber = "+33" + cleanedNumber.slice(4);
  }

  if (cleanedNumber.startsWith("+33")) {
    const restNumber = cleanedNumber.slice(3);
    if (!/^[1-9]/.test(restNumber)) {
      return null;
    }
    const formattedRestNumber =
      restNumber[0] +
      " " +
      restNumber.slice(1).replace(/(\d{2})(?=\d)/g, "$1 ");
    return "+33 " + formattedRestNumber;
  }

  return null;
};

// Fonction pour formater les e-mails
const formatEmail = (email: string): string | null => {
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  return emailRegex.test(email) ? email : null;
};

// Fonction POST
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: "Aucun fichier trouvé." },
        { status: 400 }
      );
    }

    // Lire le fichier VCF
    const text = await file.text();

    // Convertir les nouvelles lignes LF en CRLF
    const normalizedText = text.replace(/\n/g, "\r\n");

    const vCardData = parse(normalizedText); // Utilisation de vcard4-ts pour parser le fichier

    if (!vCardData || (Array.isArray(vCardData) && vCardData.length === 0)) {
      return NextResponse.json(
        { error: "Fichier VCF invalide ou vide." },
        { status: 400 }
      );
    }

    // Conversion des contacts en tableau JSON
    const jsonData = (Array.isArray(vCardData) ? vCardData : [vCardData]).map(
      (contact: any) => {
        const formattedContact: any = {
          Nom: contact.fn || null,
          Prénom: contact.givenName || null,
          Téléphone: contact.tel ? formatPhoneNumber(contact.tel) : null,
          Email: contact.email ? formatEmail(contact.email) : null,
          Adresse: contact.adr ? contact.adr.streetAddress : null,
          Ville: contact.adr ? contact.adr.locality : null,
          CodePostal: contact.adr ? contact.adr.postalCode : null,
        };
        return formattedContact;
      }
    );

    // Conversion en fichier Excel
    const newSheet = XLSX.utils.json_to_sheet(jsonData);
    const newWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWorkbook, newSheet, "Contacts");

    // Générer le fichier Excel
    const buffer = XLSX.write(newWorkbook, { bookType: "xlsx", type: "array" });
    const fileName = file.name.replace(/\.[^/.]+$/, "") + "-formated.xlsx";

    return new Response(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename=${fileName}`,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
