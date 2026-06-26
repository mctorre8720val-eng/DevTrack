import { collection, addDoc, query, onSnapshot } from 'firebase/firestore'
import { db } from './firebase.js'

const COLLECTION = 'Activities'

export async function logActivity(projectId, actorUid, verb, details = {}) {
  const col = collection(db, COLLECTION)
  const payload = { projectId, actorUid, verb, details, createdAt: Date.now() }
  const docRef = await addDoc(col, payload)
  return { id: docRef.id, ...payload }
}

export function subscribeActivities(projectId, cb) {
  const q = query(collection(db, COLLECTION))
  const unsub = onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((a) => a.projectId === projectId)
      cb(items)
    },
    (err) => console.error('subscribeActivities error', err)
  )
  return unsub
}

export default { logActivity, subscribeActivities }
