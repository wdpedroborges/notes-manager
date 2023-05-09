import { prisma } from '../../../../lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const noteId = req.query.id
    const {title, content} = req.body

    if (req.method === 'DELETE') {
        const note = await prisma.note.delete({
            where: {
                id: String(noteId)
            }
        })

        res.status(200).json({message: 'Note deleted successfully'})
    } else if (req.method === 'PUT') {
        const note = await prisma.note.update({
            data: {
                title: title,
                content: content
            },
            where: {
                id: String(noteId)
            }
        })

        res.status(200).json({message: 'Note updated successfully'})
    }
}
