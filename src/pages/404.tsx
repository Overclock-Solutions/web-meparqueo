import { Center, Title } from '@mantine/core';

export default function Custom404() {
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
            Esta página no se pudo encontrar.
          </Title>
        </div>
      </Center>
    </>
  );
}
