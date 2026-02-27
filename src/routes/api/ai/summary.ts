import { createFileRoute } from '@tanstack/react-router'
import { streamText } from 'ai'
import { prisma } from '@/db'
import { openrouter } from '@/lib/openRouter'

export const Route = createFileRoute('/api/ai/summary')({
  server: {
    handlers: {
      POST: async ({ request, context }) => {
        const { itemId, prompt } = await request.json()

        if (!itemId || !prompt) {
          return new Response('Missing prompt or itemId', { status: 400 })
        }

        const item = await prisma.savedItem.findUnique({
          where: {
            id: itemId,
            userId: context?.session.userId,
          },
        })

        if (!item) {
          return new Response('Item not found', { status: 404 })
        }
        // stream summary

        const result = streamText({
          model: openrouter.chat('z-ai/glm-4.5-air:free'),
          system: `You are a helpful assistant that creates concise, informative summaries of web content.
          Your summaries should:
          - Be 2-3 paragraphs long
          - Capture the main points and key takeaways
          - Be written in a clear, professionl tone
          - Not include any markdown formatting
          `,
          prompt: `Please summarize the following content: \n\n${prompt}`,
        })

        // Return the stream in the format useCompletion expectes
        return result.toTextStreamResponse()
      },
    },
  },
})
