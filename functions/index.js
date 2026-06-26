/**
 * Cloud Function scaffold: inviteByEmail
 * Steps:
 * - Initialize firebase-admin with service account in your Functions environment
 * - Call inviteByEmail(req) with JSON body { email, projectId, role }
 * - The function resolves the email to a UID and writes a ProjectShares doc
 */

const admin = require('firebase-admin')

// admin.initializeApp() // Initialize in real environment with service account

const db = admin.firestore()

exports.inviteByEmail = async (req, res) => {
  try {
    const { email, projectId, role = 'viewer' } = req.body
    if (!email || !projectId) return res.status(400).send('email and projectId required')

    // Resolve user by email
    const userRecord = await admin.auth().getUserByEmail(email)
    const targetUid = userRecord.uid

    // Read project to get ownerId
    const projectRef = db.collection('Projects').doc(projectId)
    const projectSnap = await projectRef.get()
    if (!projectSnap.exists) return res.status(404).send('project not found')
    const ownerId = projectSnap.data().ownerId

    // Only owner can invite
    // In production, validate caller's auth via Firebase token and compare

    const payload = { projectId, ownerId, uid: targetUid, role, createdAt: Date.now() }
    const shareRef = await db.collection('ProjectShares').add(payload)
    return res.json({ id: shareRef.id, ...payload })
  } catch (err) {
    console.error(err)
    return res.status(500).send(err.message || String(err))
  }
}
