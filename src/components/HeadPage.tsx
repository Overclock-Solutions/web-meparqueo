import { Title, Breadcrumbs, Anchor } from '@mantine/core';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

interface BeforePath {
  title: string;
  path: string;
}

interface HeadPageProps {
  title: string;
  beforePath?: BeforePath[];
}

function HeadPage({ title, beforePath = [] }: HeadPageProps) {
  return (
    <>
      <Helmet>
        <title>Me Parqueo | {title}</title>
      </Helmet>
      <Title order={1} className="mt-4 mb-1">
        {title}
      </Title>
      <Breadcrumbs className="mb-4">
        {beforePath.map((item, index) => (
          <Anchor key={index} component={Link} to={item.path}>
            {item.title}
          </Anchor>
        ))}
        <Anchor>{title}</Anchor>
      </Breadcrumbs>
    </>
  );
}

export default HeadPage;
