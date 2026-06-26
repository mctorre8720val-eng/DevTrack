import { createDocument, getCollection, getDocument, updateDocument, deleteDocument } from './firestoreService'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from './firebase.js'

const COLLECTION = 'Projects'

export function createProject(data) {
  return createDocument(COLLECTION, data)
}

export async function getProjectsByOwner(ownerId) {
  const all = await getCollection(COLLECTION)
  return all.filter((p) => p.ownerId === ownerId)
}

export function subscribeProjectsByOwner(ownerId, cb, onError) {
  const q = query(collection(db, COLLECTION), where('ownerId', '==', ownerId))
  const unsub = onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
      cb(items)
    },
    (err) => {
      console.error('subscribeProjectsByOwner error', err)
      onError?.(err)
    },
  )
  return unsub
}

export function getProject(id) {
  return getDocument(COLLECTION, id)
}

export function updateProject(id, data) {
  return updateDocument(COLLECTION, id, data)
}

export function deleteProject(id) {
  return deleteDocument(COLLECTION, id)
}
