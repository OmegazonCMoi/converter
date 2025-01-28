import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
const formatPhoneNumber = (number: any): string | null => {
  if (typeof number !== "string") {
    number = String(number); // Convertir la valeur en chaîne si elle ne l'est pas déjà
  }
  // Nettoyer le numéro en supprimant tous les caractères sauf les chiffres et "+"
  let cleanedNumber = number.replace(/[^\d+]/g, "");
  // Gérer le cas où le numéro commence par "+33 0" (supprimer le 0)
  if (cleanedNumber.startsWith("+33") && cleanedNumber[3] === "0") {
    cleanedNumber = "+33" + cleanedNumber.slice(4);
  }
  // Si le numéro commence par "+33", vérifier qu'il est suivi d'un indicatif valide
  if (cleanedNumber.startsWith("+33")) {
    const restNumber = cleanedNumber.slice(3); // Enlever +33
    if (!/^[1-9]/.test(restNumber)) {
      return null; // Numéro invalide
    }
    const formattedRestNumber =
      restNumber[0] +
      " " +
      restNumber.slice(1).replace(/(\d{2})(?=\d)/g, "$1 ");
    return "+33 " + formattedRestNumber;
  }
  // Si le numéro commence par "33" sans le "+", vérifier qu'il est suivi d'un indicatif valide
  if (cleanedNumber.startsWith("33")) {
    const restNumber = cleanedNumber.slice(2); // Enlever 33
    if (!/^[1-9]/.test(restNumber)) {
      return null; // Numéro invalide
    }
    cleanedNumber = "+33" + restNumber;
    const formattedRestNumber =
      restNumber[0] +
      " " +
      restNumber.slice(1).replace(/(\d{2})(?=\d)/g, "$1 ");
    return "+33 " + formattedRestNumber;
  }
  // Si le numéro commence par "06", "07", ou "04", on ajoute "+33" au début
  if (/^(06|07|04)/.test(cleanedNumber)) {
    cleanedNumber = "+33 " + cleanedNumber.slice(1);
    const formattedRestNumber =
      cleanedNumber[4] +
      " " +
      cleanedNumber.slice(5).replace(/(\d{2})(?=\d)/g, "$1 ");
    return cleanedNumber.slice(0, 4) + formattedRestNumber;
  }
  // Si le numéro commence par 6, 7 ou 4 (sans 0), on ajoute "+33"
  if (/^[674]/.test(cleanedNumber)) {
    cleanedNumber = "+33 " + cleanedNumber;
    const formattedRestNumber =
      cleanedNumber[4] +
      " " +
      cleanedNumber.slice(5).replace(/(\d{2})(?=\d)/g, "$1 ");
    return cleanedNumber.slice(0, 4) + formattedRestNumber;
  }
  // Si le numéro commence par autre chose, on l'ignore ou on le traite selon vos besoins
  return null;
};
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
    // Lire le fichier
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    // Supposons que le fichier ait une feuille principale
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    // Convertir la feuille en un tableau JSON
    const jsonData = XLSX.utils.sheet_to_json(sheet);
    // Vérifier et formater les numéros de téléphone dans la colonne "Téléphone"
    jsonData.forEach((row: any) => {
      if (row["Téléphone"]) {
        const formattedNumber = formatPhoneNumber(row["Téléphone"]);
        if (formattedNumber) {
          row["Téléphone"] = formattedNumber;
        }
      }
    });
    // Convertir les données modifiées en une nouvelle feuille Excel
    const newSheet = XLSX.utils.json_to_sheet(jsonData);
    const newWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWorkbook, newSheet, "ModifiedData");
    // Générer le fichier Excel modifié
    const newBuffer = XLSX.write(newWorkbook, {
      bookType: "xlsx",
      type: "array",
    });
    // Récupérer le nom du fichier original
    const originalFileName = file.name;
    const extension = originalFileName.split(".").pop(); // Extension du fichier
    const baseName = originalFileName.slice(0, -(extension?.length || 0) - 1); // Nom sans extension
    const newFileName = `${baseName}-formated.${extension}`; // Ajouter "formated" avant l'extension
    return new Response(newBuffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename=${newFileName}`,
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
