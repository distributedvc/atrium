import { objectType } from 'nexus';

export const Link = objectType({
  name: 'Link',
  definition(t) {
    t.model.id();
    t.model.createdAt();
    t.model.updatedAt();
    t.model.name();
    t.model.url();
  },
});
