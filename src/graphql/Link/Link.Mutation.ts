import type { Link } from '@prisma/client';
import { nanoid } from 'nanoid';
import { arg, mutationField, nonNull } from 'nexus';
import urlRegexSafe from 'url-regex-safe';
import { getOrCreateAnonymousId } from '../../utils';

export const createOneLink = mutationField('createOneLink', {
  type: nonNull('Link'),

  args: {
    input: nonNull(arg({ type: 'CreateOneLinkInput' })),
  },

  async resolve(_, { input }, { analytics, prisma, request }): Promise<Link> {
    let { name } = input;
    const { url } = input;

    const isValidUrl = urlRegexSafe({ exact: true, strict: true }).test(url);

    if (!isValidUrl) {
      throw new Error('You must provide a valid url');
    }

    if (name) {
      const exists = await prisma.link.count({ where: { name } });

      if (exists) {
        throw new Error(`${name} is already taken`);
      }
    } else {
      name = nanoid();
    }

    const params = { name, url };

    const [link] = await Promise.all([
      prisma.link.create({ data: params }),
      analytics.track({
        anonymousId: getOrCreateAnonymousId({ request }),
        event: 'Link Created',
        properties: params,
      }),
    ]);

    return link;
  },
});
