export function ActiveUsers(users) {
  return (
    <div className="flex -space-x-2 overflow-hidden">
      {Array.isArray(users) &&
        users?.map((user, index) => (
          <div
            key={index}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full ring-2 ring-white dark:ring-gray-800"
            style={{ backgroundColor: user.color }}
            title={user.name}
          >
            <span className="text-xs font-medium text-white">
              {user.name.charAt(0)}
            </span>
          </div>
        ))}
    </div>
  );
}
