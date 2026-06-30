import { Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-white">
      <header className="h-(--header-height) shrink-0 bg-header px-5">
        <div className="flex h-full items-center">
          <span className="text-sm font-bold text-white">Currency Converter</span>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
