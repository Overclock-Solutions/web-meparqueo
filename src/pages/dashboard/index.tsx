import { Center, Title } from '@mantine/core';
import myImage from '../../assets/image-1.webp'; // Asegúrate de que la ruta sea correcta

export default function Dashboard() {
  return (
    <div style={{ height: '80vh' }}>
      <Center h="100%">
        <div style={{ textAlign: 'center' }}>
          <Center h="100%">
            <img
              src={myImage}
              alt="Descripción de la imagen"
              style={{ maxWidth: '100%', height: 'auto', marginBottom: '20px' }}
            />
          </Center>
          <Title order={2} align="center" weight={500}>
            Bienvenido al panel de control de Me Parqueo
          </Title>
        </div>
      </Center>
    </div>
  );
}
