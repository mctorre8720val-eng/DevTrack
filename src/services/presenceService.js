import { doc, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore'
import { db } from './firebase.js'

const COLLECTION = 'Presence'

export async function setPresence(uid, online = true) {
  if (!uid) throw new Error('uid required')
  const ref = doc(db, COLLECTION, uid)
  return setDoc(ref, { online, lastSeen: serverTimestamp() }, { merge: true })
}

export function subscribePresence(uid, cb) {
  const ref = doc(db, COLLECTION, uid)
  const unsub = onSnapshot(ref, (snap) => {
    cb(snap.exists() ? { id: snap.id, ...snap.data() } : null)
  }, (err) => console.error('subscribePresence error', err))
  return unsub
}

export default { setPresence, subscribePresence }
