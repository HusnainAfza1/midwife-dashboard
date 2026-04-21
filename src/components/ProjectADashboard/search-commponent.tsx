// components/ui/search.jsx
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";

export function Search({ placeholder = "Search..." }) {
  return (
    <div className="relative w-64">
      <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        className="pl-9 w-full"
      />
    </div>
  );
}