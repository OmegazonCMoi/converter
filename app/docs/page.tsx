import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/navbar';
import { Button } from '@heroui/button';
import { Link } from '@heroui/link';

const AcmeLogo = () => {
  return (
    <svg width="30" height="30" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"> <g clipPath="url(#clip0_231_713)"> <path fillRule="evenodd" clipRule="evenodd" d="M90 32V3.93402e-06H32L5.69126e-06 0L0 22.6274L5.69126e-06 32V90H32V54.6274L63.1319 85.7593L77.3726 100L63.1319 114.241L32 145.373L32 110L1.099e-05 110L1.02983e-05 168L5.9827e-06 200L22.6274 200L32 200H90V168H54.6274L85.7593 136.868L100 122.627L114.241 136.868L145.373 168H110L110 200H168L200 200L200 177.373L200 168L200 110L168 110V145.373L136.868 114.241L122.627 100L136.868 85.7593L168 54.6274L168 90H200L200 32V5.69126e-06L177.373 0L168 4.2925e-06L110 0V32L145.373 32L114.241 63.1319L100 77.3726L85.7593 63.1318L54.6274 32L90 32Z" fill="url(#paint0_linear_231_713)" /> </g> <defs> <linearGradient id="paint0_linear_231_713" x1="14" y1="26" x2="179" y2="179.5" gradientUnits="userSpaceOnUse"> <stop stopColor="#E9B8FF" /> <stop offset="1" stopColor="#F9ECFF" /> </linearGradient> <clipPath id="clip0_231_713"> <rect width="200" height="200" fill="white" /> </clipPath> </defs> </svg>
  );
};

export default function DocsPage() {
  return (
    <>
      <Navbar>
        <NavbarBrand>
          <AcmeLogo />
          <a href="/"><p className="ml-4 font-bold text-inherit">CONVERTER</p></a>
        </NavbarBrand>
        <NavbarContent className="hidden gap-4 sm:flex" justify="center">
          <NavbarItem>
            <Link color="foreground" href="/">
              Convertir
            </Link>
          </NavbarItem>
          <NavbarItem isActive>
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
            <Link href="https://github.com/OmegazonCMoi/converter">Code</Link>
          </NavbarItem>
          <NavbarItem>
            <Button as={Link} color="primary" href="https://fmenoni.com" variant="flat">
              FMenoni
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      <video src="/videos/tuto.mov" className='mt-10 rounded-lg' autoPlay loop controls></video>
    </>
  );
}
