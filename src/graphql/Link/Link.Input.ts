import { inputObjectType } from 'nexus';

export const CreateOneLinkInput = inputObjectType({
  name: 'CreateOneLinkInput',
  definition(t) {
    t.nullable.string('name');
    t.boolean('redirect', {
      default: false,
    });
    t.nonNull.string('url');
  },
});

export const GetOneLinkInput = inputObjectType({
  name: 'GetOneLinkInput',
  definition(t) {
    t.nonNull.string('name');
  },
});
