import { Center, Title, Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

export default function Custom404() {
  const navigate = useNavigate();

  return (
    <>
      <Center h="100%" pb={120} px={16}>
        <div>
          <Title mb={15} order={1} align="center" weight={600} color="primary">
            404
          </Title>
          <Title
            order={2}
            align="center"
            weight={500}
            size={16}
            color="secondary"
          >
            Esta pagina no se pudo encontrar
          </Title>
          <Center mt={20}>
            <Button onClick={() => navigate(-1)} color="primary">
              Volver atrás
            </Button>
          </Center>
        </div>
      </Center>
    </>
  );
}
