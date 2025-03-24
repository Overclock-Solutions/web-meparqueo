import React from 'react';
import { Link } from 'react-router-dom';
import { IconChevronDown } from '@tabler/icons-react';

interface LinkItem {
  name: string;
  to: string;
}

interface CollapseSidenavProps {
  icon: React.ReactNode;
  name: string;
  links: LinkItem[];
}

const CollapseSidenav: React.FC<CollapseSidenavProps> = ({
  icon,
  name,
  links,
}) => {
  return (
    <>
      <a
        className="nav-link collapsed"
        data-bs-toggle="collapse"
        data-bs-target={`#collapse${name}`}
        aria-expanded="false"
        aria-controls={`collapse${name}`}
        style={{ cursor: 'pointer' }}
      >
        <div className="sb-nav-link-icon">{icon}</div>
        {name}
        <div className="sb-sidenav-collapse-arrow">
          <IconChevronDown />
        </div>
      </a>
      <div
        className="collapse"
        id={`collapse${name}`}
        aria-labelledby="headingOne"
        data-bs-parent="#sidenavAccordion"
      >
        <nav className="sb-sidenav-menu-nested nav">
          {links.map((link, index) => (
            <Link
              key={`${index}_${link.name}`}
              className="nav-link"
              to={link.to}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

export default CollapseSidenav;
