import { Link, useLocation } from "react-router-dom";
import { cn } from "../../utils/cn";
import { useUser } from "@clerk/clerk-react";

const navLinks = [
  { name: "View Notes", slug: "/" },
  { name: "Create Note", slug: "/create-note" },
];

const SideNav = () => {
  const { pathname } = useLocation();
  const { user } = useUser();

  return (
    <header className="bg-primary-dark min-w-80 py-8 text-white flex flex-col items-center text-lg">
      <img src={user?.imageUrl} className="w-36 h-36 rounded-full mx-auto" />
      <p className="mt-2 text-white">@{user?.username}</p>

      <nav className="mt-8 flex flex-col items-center w-full">
        {navLinks.map((item) => (
          <Link
            key={item.name}
            to={item.slug}
            className={cn(
              "w-[90%] text-center mx-auto py-3",
              pathname == item.slug
                ? "bg-primary-light rounded-md text-black transition-all"
                : ""
            )}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </header>
  );
};

export default SideNav;
