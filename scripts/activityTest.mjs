import { logActivity } from '../src/services/activityService.js'

async function run() {
  try {
    const res = await logActivity('smoke-project', 'system', 'test-activity', { note: 'hello' })
    console.log('ACTIVITY_OK', res.id)
  } catch (err) {
    console.error('ACTIVITY_ERR', err && err.toString ? err.toString() : err)
    process.exitCode = 1
  }
}

run()
