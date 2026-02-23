import { createServerFn } from '@tanstack/react-start'
import * as z from 'zod'
import { bulkImportSchema, extractSchema, importSchema } from '../schemas/input'
import { firecrawl } from '@/lib/firecrawl'
import { prisma } from '@/db'
import { authFnMiddleware } from '@/middlewares/auth'

export const scrapeUrlFn = createServerFn({ method: 'POST' })
  .middleware([authFnMiddleware])
  .inputValidator(importSchema)
  .handler(async ({ data, context }) => {
    const item = await prisma.savedItem.create({
      data: {
        url: data.url,
        userId: context.session.userId,
        status: 'PROCESSING',
      },
    })

    try {
      const result = await firecrawl.scrape(data.url, {
        formats: ['markdown', { type: 'json', schema: extractSchema }],
        onlyMainContent: true,
      })

      const jsonData = result.json as z.infer<typeof extractSchema>

      let publishedAt = null
      if (jsonData.publishedAt) {
        const parsed = new Date(jsonData.publishedAt)

        if (isNaN(parsed.getTime())) {
          publishedAt = parsed
        }
      }

      const updatedItem = await prisma.savedItem.update({
        where: {
          id: item.id,
        },
        data: {
          title: result.metadata?.title || null,
          content: result.markdown || null,
          ogImage: result.metadata?.ogImage || null,
          author: jsonData.author || null,
          publishedAt: publishedAt,
          status: 'COMPLETED',
        },
      })

      return updatedItem
    } catch (error) {
      const failedItem = await prisma.savedItem.update({
        where: { id: item.id },
        data: {
          status: 'FAILED',
        },
      })
      return failedItem
    }
  })

export const mapUrlFn = createServerFn({ method: 'POST' })
  .middleware([authFnMiddleware])
  .inputValidator(bulkImportSchema)
  .handler(async ({ data }) => {
    const result = await firecrawl.map(data.url, {
      limit: 25,
      search: data.search,
      location: {
        country: 'US',
        languages: ['en'],
      },
    })
    return result.links
  })

export const bulkScrapeUrl = createServerFn({ method: 'POST' })
  .middleware([authFnMiddleware])
  .inputValidator(
    z.object({
      urls: z.array(z.string().url()),
    }),
  )
  .handler(async ({ data, context }) => {
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < data.urls.length; i++) {
      const url = data.urls[i]

      const item = await prisma.savedItem.create({
        data: {
          url: url,
          userId: context.user.id,
          status: 'PENDING',
        },
      })

      try {
        const result = await firecrawl.scrape(url, {
          formats: ['markdown', { type: 'json', schema: extractSchema }],
          onlyMainContent: true,
        })

        const jsonData = result.json as z.infer<typeof extractSchema>

        let publishedAt = null
        if (jsonData.publishedAt) {
          const parsed = new Date(jsonData.publishedAt)

          if (isNaN(parsed.getTime())) {
            publishedAt = parsed
          }
        }

        await prisma.savedItem.update({
          where: {
            id: item.id,
          },
          data: {
            title: result.metadata?.title || null,
            content: result.markdown || null,
            ogImage: result.metadata?.ogImage || null,
            author: jsonData.author || null,
            publishedAt: publishedAt,
            status: 'COMPLETED',
          },
        })
      } catch (error) {
        await prisma.savedItem.update({
          where: { id: item.id },
          data: {
            status: 'FAILED',
          },
        })
      }
    }
  })
