import AppNav from './AppNav'

export default function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <AppNav />
      <div className="app-content">{children}</div>
    </div>
  )
}
