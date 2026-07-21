import { useQuery } from "@tanstack/react-query";
import todosServices from "../api/todos";
export function useGetTodos() {
  const query = useQuery({
    queryKey: ["todos"],
    queryFn: todosServices.getTodos,
  });
  return query;
}
