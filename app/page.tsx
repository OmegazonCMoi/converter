'use client'

import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Input } from "@heroui/input";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/navbar";
import { Montserrat } from "next/font/google";
import { useState } from "react";

const AcmeLogo = () => {
  return (
    <svg width="30" height="30" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"> <g clipPath="url(#clip0_231_713)"> <path fillRule="evenodd" clipRule="evenodd" d="M90 32V3.93402e-06H32L5.69126e-06 0L0 22.6274L5.69126e-06 32V90H32V54.6274L63.1319 85.7593L77.3726 100L63.1319 114.241L32 145.373L32 110L1.099e-05 110L1.02983e-05 168L5.9827e-06 200L22.6274 200L32 200H90V168H54.6274L85.7593 136.868L100 122.627L114.241 136.868L145.373 168H110L110 200H168L200 200L200 177.373L200 168L200 110L168 110V145.373L136.868 114.241L122.627 100L136.868 85.7593L168 54.6274L168 90H200L200 32V5.69126e-06L177.373 0L168 4.2925e-06L110 0V32L145.373 32L114.241 63.1319L100 77.3726L85.7593 63.1318L54.6274 32L90 32Z" fill="url(#paint0_linear_231_713)" /> </g> <defs> <linearGradient id="paint0_linear_231_713" x1="14" y1="26" x2="179" y2="179.5" gradientUnits="userSpaceOnUse"> <stop stopColor="#E9B8FF" /> <stop offset="1" stopColor="#F9ECFF" /> </linearGradient> <clipPath id="clip0_231_713"> <rect width="200" height="200" fill="white" /> </clipPath> </defs> </svg>
  );
};

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal"],
  display: "swap",
})

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      console.log("Envoi du fichier au serveur...");
      const response = await fetch('api/formatPhoneNumber', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log("Réponse reçue, téléchargement du fichier...");
        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'formatted-numbers.xlsx';
        link.click();
      } else {
        alert('Une erreur s\'est produite lors du traitement du fichier');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur s\'est produite');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar>
        <NavbarBrand>
          <AcmeLogo />
          <a href="/"><p className="ml-4 font-bold text-inherit">CONVERTER</p></a>
        </NavbarBrand>
        <NavbarContent className="hidden gap-4 sm:flex" justify="center">
          <NavbarItem isActive>
            <Link color="foreground" href="/">
              Convertir
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="/docs">
              Tutoriel
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="/legal">
              Mentions Légales
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem className="hidden lg:flex">
            <Link href="#">Code</Link>
          </NavbarItem>
          <NavbarItem>
            <Button as={Link} color="primary" href="https://fmenoni.com" variant="flat">
              FMenoni
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      <div className="max-w-xl w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[10em]">
        <h1 className="text-3xl text-center">Uploadez votre fichier</h1>
        <form onSubmit={handleSubmit}>
          <Input type="file" className="mt-4" onChange={handleFileChange} />
          <p className="mt-1 text-xs text-center text-neutral-500">Vous ne comprenez comment le site marche ? Regardez le <a href="/docs" className="text-blue-600">tutoriel</a></p>
          <Button type="submit" color="primary" className="flex justify-center w-40 mx-auto mt-4">
            {loading ? "Chargement..." : "Convertir"}
          </Button>
        </form>
      </div>
    </>
  );
}
