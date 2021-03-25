import faker from 'faker';
import type { Link } from '@prisma/client';
import type { NexusGenInputs } from '../../../generated/nexus';
import { createTestContext } from '../../../../tests/__helpers';

const ctx = createTestContext();

const linkData: NexusGenInputs['CreateOneLinkInput'] = {
  url: faker.internet.url(),
  name: 'foo',
};

it('ensures that a link can be created and retrieved', async () => {
  const {
    data: { createOneLink },
  } = await ctx.client.mutate<
    { createOneLink: Link },
    { input: NexusGenInputs['CreateOneLinkInput'] }
  >(
    /* GraphQL */ `
      mutation CreateOneLink($input: CreateOneLinkInput!) {
        createOneLink(input: $input) {
          id
          name
          url
        }
      }
    `,
    {
      variables: {
        input: linkData,
      },
    }
  );

  expect(createOneLink).toEqual(
    expect.objectContaining({
      id: expect.any(String),
      url: linkData.url,
      name: 'foo',
    })
  );

  const {
    data: { link },
  } = await ctx.client.query<{ link: Link }, { input: NexusGenInputs['GetOneLinkInput'] }>(
    /* GraphQL */ `
      query link($input: GetOneLinkInput!) {
        link(input: $input) {
          id
          name
          url
        }
      }
    `,
    {
      variables: {
        input: { name: linkData.name },
      },
    }
  );

  expect(link).toEqual(
    expect.objectContaining({
      id: expect.any(String),
      url: linkData.url,
      name: 'foo',
    })
  );
});
