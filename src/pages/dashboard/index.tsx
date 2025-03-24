import { Center, Title } from '@mantine/core';

export default function Dashboard() {
  return (
    <div style={{ height: '80vh' }}>
      <Center h="100%">
        <Title order={3} align="center" weight={500}>
          Bienvenido al panel de control de Me Parqueo
        </Title>
      </Center>
    </div>
  );
}
