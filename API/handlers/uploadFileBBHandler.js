import jwt from 'jsonwebtoken'
import busboy from 'busboy'
import fs from 'fs'
import uploadFileBB from '../logic/uploadFileBB.js'
import { errors } from 'com'

const { NotFoundError, ContentError, TokenError } = errors
const { JsonWebTokenError } = jwt

export default (req, res) => {
    try {
        const token = req.headers.authorization.substring(7)
        const { sub: userId } = jwt.verify(token, process.env.JWT_SECRET)

        const bb = new busboy({ body: req.body })

        bb.on('file', async (name, file, info) => {
            const { filename, mimeType } = info

            try {
                const saveFile = await uploadFileBB(userId, filename, mimeType)

                const writeStream = fs.createWriteStream(saveFile)
                file.pipe(writeStream)

                writeStream.on('close', () => {
                    res.sendStatus(200)
                })
            } catch (error) {
                let status = 500

                if (error instanceof NotFoundError) {
                    status = 404
                }

                res.status(status).json({ error: error.constructor.name, message: error.message })
            }
        })

        req.pipe(bb)
    } catch (error) {
        let status = 500

        if (error instanceof TypeError || error instanceof ContentError) {
            status = 406
        }

        if (error instanceof JsonWebTokenError) {
            status = 401
            error = new TokenError(error.message)
        }

        res.status(status).json({ error: error.constructor.name, message: error.message })
    }
}
