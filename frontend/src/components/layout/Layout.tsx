import SideNav from "./SideNav";

const Layout = ({ children, isSideNavHidden }: any) => {
  return (
    <div className="flex min-h-screen w-full">
      {!isSideNavHidden && <SideNav />}
      <main className="flex-grow">{children}</main>
    </div>
  );
};

export default Layout;
