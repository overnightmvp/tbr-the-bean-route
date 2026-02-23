
import { BrevoClient } from '@getbrevo/brevo'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(__dirname, '../.env.local') })

async function inspectClient() {
    const apiKey = process.env.BREVO_API_KEY
    if (!apiKey) return

    const client: any = new BrevoClient({ apiKey })

    console.log('--- Client Root Keys ---')
    console.log(Object.keys(client))

    if (client.transactionalEmails) {
        console.log('\n--- transactionalEmails Keys ---')
        console.log(Object.keys(client.transactionalEmails))
    }
}

inspectClient()
