import { Link } from 'nexus-prisma';
import { objectType } from 'nexus';

export const LinkType = objectType({
  name: 'Link',
  definition(t) {
    t.field(Link.id);
    t.field(Link.createdAt);
    t.field(Link.updatedAt);
    t.field(Link.name);
    t.field(Link.url);
  },
});
