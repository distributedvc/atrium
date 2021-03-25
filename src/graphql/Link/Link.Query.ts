import type { Link } from '@prisma/client';
import { arg, nonNull, queryField } from 'nexus';

export const linkQuery = queryField('link', {
  type: 'Link',

  args: {
    input: nonNull(arg({ type: 'GetOneLinkInput' })),
  },

  async resolve(_, { input }, { prisma }): Promise<Link> {
    const { name } = input;

    return prisma.link.findUnique({
      where: { name },
    });
  },
});
