import { NavLink, Outlet } from "react-router-dom";
import { HiOutlineHome, HiOutlineOfficeBuilding } from "react-icons/hi";

const navItems = [
  { name: "Home", path: "/", icon: HiOutlineHome },
  {
    name: "Organization",
    path: "/dashboard/organization",
    icon: HiOutlineOfficeBuilding,
  },
];

export default function DashboardLayout() {
  return (
    <div className="flex bg-sky-100 h-screen justify-center items-center">
      <div className="bg-white h-[95%] m-3 flex w-full shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-2xl">
        <aside className="w-20 bg-white border-r border-gray-200 flex flex-col transition-all rounded-2xl">
          <nav className="flex-1 px-4 space-y-2 mt-4">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-500 hover:bg-gray-100"
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
              </NavLink>
            ))}
          </nav>
        </aside>

        <div className="flex-1 flex flex-col overflow-hidden rounded-2xl">
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
