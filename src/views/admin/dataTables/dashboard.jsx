import React  from 'react'
import { Image, Box , Text} from '@chakra-ui/react'
import stockImage from '../../../../src/image/stock image.jpg'
function Dashboard(){
    return(
        <>
         <Box width="100%" maxWidth="600px" mx="auto" textAlign="center" mt="10" >
                <Text fontSize="2xl" mb="4">Welcome to the BridgeLabz</Text>
                <Image 
                    src={stockImage} 
                    alt="Stock Market" 
                    width="100%" 
                    height="auto" 
                    objectFit="cover" 
                    borderRadius="md" 
                />
            </Box>
      
        
        </>
    )
}
export default Dashboard