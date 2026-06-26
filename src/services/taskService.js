import { createDocument, updateDocument, deleteDocument } from './firestoreService'
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore'
import { db } from './firebase.js'
import { getProjectsByOwner } from './projectService'

const COLLECTION = 'Tasks'

export const TASK_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
}

export function createTask(data) {
  return createDocument(COLLECTION, {
    ...data,
    status: data.status ?? TASK_STATUS.PENDING,
    createdAt: data.createdAt ?? Date.now(),
  })
}

export function subscribeTasksByProject(projectId, cb, onError) {
  const q = query(collection(db, COLLECTION), where('projectId', '==', projectId))
  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
      cb(items)
    },
    (err) => {
      console.error('subscribeTasksByProject error', err)
      onError?.(err)
    },
  )
}

export function updateTask(id, data) {
  return updateDocument(COLLECTION, id, data)
}

export function deleteTask(id) {
  return deleteDocument(COLLECTION, id)
}

export function toggleTaskComplete(id, currentStatus) {
  const status =
    currentStatus === TASK_STATUS.COMPLETED ? TASK_STATUS.PENDING : TASK_STATUS.COMPLETED
  return updateTask(id, { status, updatedAt: Date.now() })
}

async function countTasksForProjectIds(projectIds) {
  let total = 0
  let completed = 0
  const ids = [...projectIds]

  for (let i = 0; i < ids.length; i += 10) {
    const batch = ids.slice(i, i + 10)
    const q = query(collection(db, COLLECTION), where('projectId', 'in', batch))
    const snapshot = await getDocs(q)
    snapshot.docs.forEach((docItem) => {
      total += 1
      if (docItem.data().status === TASK_STATUS.COMPLETED) completed += 1
    })
  }

  return { total, completed, pending: total - completed }
}

export async function getTaskStatsForOwner(ownerId) {
  const projects = await getProjectsByOwner(ownerId)
  if (projects.length === 0) {
    return { total: 0, completed: 0, pending: 0 }
  }
  return countTasksForProjectIds(projects.map((p) => p.id))
}
