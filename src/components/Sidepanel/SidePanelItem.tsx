import { SidebatrItemProps } from "@/types";

export function SidePanelItem({
  icon,
  text,
  isActive,
  onClick,
  expanded,
  subTabs,
  activeSubTab,
}: SidebatrItemProps & { subTabs?: string[]; activeSubTab?: string | null }) {
  const handleClick = () => onClick && onClick();

  return (
    <>
      <hr
        className={`my-3 ${
          text !== "Back to Dashboard" && text !== "Support" ? "hidden" : ""
        }`}
      />
      <li
        onClick={handleClick}
        className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group
          ${
            isActive
              ? "bg-gradient-to-tr from-blue-200 to-blue-100 text-[#4318FF]"
              : "hover:bg-blue-50 text-gray-600"
          }`}
      >
        {icon}
        <span
          className={`overflow-hidden transition-all ${
            expanded ? "ml-3" : "w-0"
          }`}
        >
          {text}
        </span>
      </li>

      {isActive && subTabs && expanded && (
        <ul className="ml-8 mt-2">
          {subTabs.map((sub, index) => (
            <li
              key={index}
              onClick={() => onClick && onClick(sub)}
              className={`cursor-pointer text-sm py-1 px-2 rounded-md 
                            ${
                              activeSubTab === sub
                                ? "bg-blue-100 text-[#4318FF]"
                                : "text-gray-600 hover:text-[#4318FF]"
                            }`}
            >
              {sub}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
