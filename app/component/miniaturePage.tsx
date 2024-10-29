import { Box, Link } from "@chakra-ui/react";
import Sondage from "./sondage/[address]/page";
import path from "path";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import { Address } from "viem";

function MiniaturePage({  questionContract, reponsesContrat, addressContrat } : 
  { questionContract : string;  reponsesContrat : Array<string>; addressContrat: Address}) {


  return (
    <Router>
      <Link href={ `/sondage/${addressContrat}`} >
      <Routes>
        <Route path='/sondage/:address'  element={<Sondage addressContrat={addressContrat}/> } />
      </Routes>
      

      <Box
        width="300px"   // Largeur de la vignette
        height="200px"  // Hauteur de la vignette
        overflow="hidden"
        border="1px solid #ccc"  // Bordure autour de la vignette
        position="relative"
        borderRadius="md"
        _hover={{ boxShadow: "lg" }}  // Effet au survol
      >
        <Box
          as="iframe"
          width="1000px"  // Largeur de la page intégrée
          height="2000px" // Hauteur de la page intégrée
          position="absolute"
          top="-200px"    // Ajustement vertical
          left="-300px"   // Ajustement horizontal
          transform="scale(0.3)"  // Réduction à 30%
          transformOrigin="0 0"
          border="none"
        />
      </Box>
    </Link>
    </Router>
  );
}

export default MiniaturePage;