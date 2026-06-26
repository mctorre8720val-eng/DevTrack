import { collection, addDoc, query, where, getDocs, onSnapshot, deleteDoc, doc } from 'firebase/firestore'
import { db } from './firebase.js'

const COLLECTION = 'ProjectShares'

// Create a share entry linking a project to a user with a role
export async function shareProject(projectId, ownerId, targetUid, role = 'viewer') {
  const payload = {
    projectId,
    ownerId,
    uid: targetUid,
    role,
    createdAt: Date.now(),
  }
  const colRef = collection(db, COLLECTION)
  const docRef = await addDoc(colRef, payload)
  return { id: docRef.id, ...payload }
}

export async function revokeShareById(shareId) {
  const d = doc(db, COLLECTION, shareId)
  await deleteDoc(d)
}

export async function getSharesByProject(projectId) {
  const q = query(collection(db, COLLECTION), where('projectId', '==', projectId))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function getSharedProjectsForUser(uid) {
  const q = query(collection(db, COLLECTION), where('uid', '==', uid))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export function subscribeSharedProjectsForUser(uid, cb) {
  const q = query(collection(db, COLLECTION), where('uid', '==', uid))
  const unsub = onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
    cb(items)
  }, (err) => console.error('subscribeSharedProjectsForUser error', err))
  return unsub
}

export default {
  shareProject,
  revokeShareById,
  getSharesByProject,
  getSharedProjectsForUser,
  subscribeSharedProjectsForUser,
}
